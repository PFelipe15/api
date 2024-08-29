import fastify from "fastify";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import VerifyBase64 from "./utils/verify-base64";
import GeminiResMeasure from "./service/gemini-upload";
import { saveFile } from "./utils/file-save";
import fs from "fs/promises";
import path from "path";

dotenv.config();

const app = fastify();
app.register(multipart);

interface MeasureBodyProps {
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

app.post("/upload", async (request, reply) => {
  const parts = request.parts();   
  const fields: Partial<MeasureBodyProps> = {};
  let fileData: any = null;

  for await (const part of parts) {
    if (part.type === "file") {
      const { buffer, base64Image, imagePath } = await saveFile(part.file, path.join(__dirname, "uploads"));

      if (!VerifyBase64(base64Image)) {
        return reply.status(400).send({
          error_code: "INVALID_DATA",
          error_description: "Imagem inválida",
        });
      }

      fileData = { buffer, mimetype: part.mimetype, filename: part.filename, path: imagePath };
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  if (!fields.customer_code || !fields.measure_datetime || !fields.measure_type || !fileData) {
    return reply.status(400).send({
      error_code: "INVALID_DATA",
      error_description: "Os dados fornecidos no corpo da requisição são inválidos",
    });
  }

  try {
    const response = await GeminiResMeasure(fileData);
    await fs.unlink(fileData.path);
    return reply.status(200).send(response);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "Ocorreu um erro ao processar a solicitação.",
    });
  }
});

app.listen({ port: 8080 }, () => {
  console.log(`Server listening on http://localhost:8080`);
});