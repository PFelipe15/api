const axios = require("axios");
import VerifyBase64 from "../utils/verify-base64";
import prisma from "../config/db";
const fs = require('fs');
const path = require('path');

 axios.defaults.validateStatus = function () {
  return true;
};

 beforeAll(async () => {
  await prisma.measure.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

test.skip("Realizar operação de upload com sucesso", async () => {
  const imagePath = path.join(__dirname, '../../', 'imageTeste.png');
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const body = new FormData();
  body.append("image", `data:image/png;base64,${base64Image}`);
  body.append("customer_code", "12345");
  body.append("measure_datetime", "2024-08-01T12:00:00Z");
  body.append("measure_type", "WATER");

  const res = await axios.post("http://127.0.0.1:8080/upload", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  expect(res.status).toBe(200);
  expect(res.data).toHaveProperty("image_url");
  expect(res.data).toHaveProperty("measure_value");
  expect(res.data).toHaveProperty("measure_uuid");
});

test.skip("Retornar 400 error code e INVALID_DATA no Upload com dados inválidos", async () => {
  const body = new FormData();
  body.append("image", "");
  body.append("customer_code", "");
  body.append("measure_datetime", "");
  body.append("measure_type", "");

  const res = await axios.post("http://127.0.0.1:8080/upload", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  expect(res.status).toBe(400);
  expect(res.data.error_code).toBe("INVALID_DATA");
  expect(res.data.error_description).toBe(
    "Os dados fornecidos no corpo da requisição são inválidos"
  );
});

test.skip("Retornar 409 error code e DOUBLE_REPORT no Upload de medição duplicada", async () => {
  await prisma.measure.create({
    data: {
      customer_code: "12345",
      measure_datetime: new Date("2024-08-01T12:00:00Z"),
      measure_type: "WATER",
      image_url: "http://example.com/image.png",
      measure_value: 123,
      measure_uuid: "uuid123",
    },
  });

  const body = new FormData();
  body.append("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA");
  body.append("customer_code", "12345");
  body.append("measure_datetime", "2024-08-01T12:00:00Z");
  body.append("measure_type", "WATER");

  const res = await axios.post("http://127.0.0.1:8080/upload", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  expect(res.status).toBe(409);
  expect(res.data.error_code).toBe("DOUBLE_REPORT");
  expect(res.data.error_description).toBe(
    "Leitura do mês já realizada"
  );
});

test.skip("VerifyBase64 deve retornar true para uma string base64 válida", async () => {
  const validBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA";

  const result = VerifyBase64(validBase64);

  expect(result).toBe(true);
});

test.skip("VerifyBase64 deve retornar false para uma string base64 inválida", async () => {
  const invalidBase64 = "invalidBase64String";  

  const result = VerifyBase64(invalidBase64);

  expect(result).toBe(false);
});

test.skip("Retornar 500 error code em caso de erro interno", async () => {
  const body = new FormData();
  body.append("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA");
  body.append("customer_code", "12345");
  body.append("measure_datetime", "2024-08-01T12:00:00Z");
  body.append("measure_type", "WATER");

  // Simulação de erro interno
  jest.spyOn(prisma.measure, "create").mockImplementationOnce(() => {
    throw new Error("Erro interno simulado");
  });

  const res = await axios.post("http://127.0.0.1:8080/upload", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  expect(res.status).toBe(500);
  expect(res.data.error_code).toBe("INTERNAL_SERVER_ERROR");
  expect(res.data.error_description).toBe(
    "Ocorreu um erro ao processar a solicitação."
  );
});
