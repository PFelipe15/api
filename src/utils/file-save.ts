import fs from "fs/promises";
import path from "path";

export const saveFile = async (file: any, uploadDir: string) => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of file) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const base64Image = buffer.toString("base64");

  const imagePath = path.join(uploadDir, file.filename);
  await fs.writeFile(imagePath, buffer);

  return { buffer, base64Image, imagePath };
};