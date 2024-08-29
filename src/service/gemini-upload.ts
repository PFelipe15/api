import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { randomUUID } from "crypto";

interface FileData {
  path: string;
  mimetype: string;
  filename: string;
}

interface MeasureResponse {
  image_url: string;
  measure_value: string;
  measure_uuid: string;
}

const GeminiResMeasure = async (fileData: FileData): Promise<MeasureResponse> => {
  try {
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
    const uploadResponse = await fileManager.uploadFile(fileData.path, {
      mimeType: fileData.mimetype,
      displayName: fileData.filename,
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: "Analise a imagem e retorne o numero que está no medidor, retorne somente o numero" },
    ]);

    const getResponse = await fileManager.getFile(uploadResponse.file.name);

    return {
      image_url: getResponse.uri,
      measure_value: result.response.text(),
      measure_uuid: randomUUID(),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao processar a solicitação.");
  }
};

export default GeminiResMeasure;
