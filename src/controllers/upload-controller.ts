 import fs from "fs/promises";
import path from "path";
import prisma from "../config/db";
import VerifyBase64 from "../utils/verify-base64";
import GeminiResMeasure from "../services/gemini-upload";
import { saveFile } from "../utils/file-save";
import convertDate from "../utils/format-date";
import { FastifyReply, FastifyRequest } from "fastify";

interface MeasureBodyProps {
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

export const uploadHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const parts = request.parts();
  const fields: Partial<MeasureBodyProps> = {};
  let fileData: any = null;

  for await (const part of parts) {
    if (part.type === "file") {
      const filename = part.filename || "default_filename.png";
      const { buffer, base64Image, imagePath } = await saveFile(
        part.file,
        path.join(__dirname, "..", "uploads"),
        filename
      );

      if (!VerifyBase64(base64Image)) {
        return reply.status(400).send({
          error_code: "INVALID_DATA",
          error_description: "Imagem inválida",
        });
      }

      fileData = { buffer, mimetype: part.mimetype, filename, path: imagePath };
    } else {
      fields[part.fieldname as keyof MeasureBodyProps] = part.value as string;
    }
  }

  if (
    !fields.customer_code ||
    !fields.measure_datetime ||
    !fields.measure_type ||
    !fileData
  ) {
    return reply.status(400).send({
      error_code: "INVALID_DATA",
      error_description: "Os dados fornecidos no corpo da requisição são inválidos",
    });
  }

  fields.measure_datetime = convertDate(fields.measure_datetime);

  try {
    const response = await GeminiResMeasure(fileData);
    await fs.unlink(fileData.path);

    const readingMeasure = await prisma.measure.count({
      where: {
        customer_code: fields.customer_code,
        measure_type: fields.measure_type,
        measure_datetime: {
          gte: new Date(new Date(fields.measure_datetime).getFullYear(), new Date(fields.measure_datetime).getMonth(), 1),
          lt: new Date(new Date(fields.measure_datetime).getFullYear(), new Date(fields.measure_datetime).getMonth() + 1, 1),
        },
      },
    });

    if (readingMeasure > 0) {
      return reply.status(409).send({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      });
    }

    await prisma.measure.create({
      data: {
        customer_code: fields.customer_code,
        measure_datetime: new Date(fields.measure_datetime),
        measure_type: fields.measure_type,
        image_url: response.image_url,
        measure_value: Number(response.measure_value),
        measure_uuid: response.measure_uuid,
      },
    });

    return reply.status(200).send(response);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "Ocorreu um erro ao processar a solicitação.",
    });
  }
};