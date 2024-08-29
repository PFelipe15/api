import { FastifyRequest } from "fastify";
import path from "path";
import { saveFile } from "../utils/file-save";
import VerifyBase64 from "../utils/verify-base64";

interface MeasureBodyProps {
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

interface ProcessedParts {
  fields: Partial<MeasureBodyProps>;
  fileData: {
    buffer: Buffer;
    mimetype: string;
    filename: string;
    path: string;
  } | null;
}

export const processMultipartData = async (request: FastifyRequest): Promise<ProcessedParts> => {
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
        throw new Error("INVALID_IMAGE");
      }

      fileData = { buffer, mimetype: part.mimetype, filename, path: imagePath };
    } else {
      fields[part.fieldname as keyof MeasureBodyProps] = part.value as string;
    }
  }

  return { fields, fileData };
};
