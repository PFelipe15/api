import fs from "fs/promises";
import prisma from "../config/db";
import GeminiResMeasure from "../services/gemini-upload";
import convertDate from "../utils/format-date";
import { FastifyReply, FastifyRequest } from "fastify";
import { processMultipartData } from "../services/process-multipart-data";

export const uploadHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  let fields, fileData;
  try {
    ({ fields, fileData } = await processMultipartData(request));
  } catch (error) {
    return reply.status(500).send({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "Erro ao processar a requisição",
    });
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

    // https://github.com/prisma/prisma/discussions/11443
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