import fastify from "fastify";
import VerifyBase64 from "./utils/verify-base64";



const app = fastify();

interface measureBodyProps {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
  measure_value: number;
}
app.get("/:customer_code/list", async (request, reply) => {
  return { hello: "world" };
});
app.post("/upload", async (request, reply) => {
  const measure = request.body as measureBodyProps;
  if (
    !measure.customer_code ||
    !measure.measure_datetime ||
    !measure.measure_type ||
    !measure.image
  ) {
    return reply.status(400).send({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos",
    });
  }

  if (VerifyBase64(measure.image) === false) {
    return reply.status(400).send({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos",
    });
  }

  const hasMeasure = false;

  if (hasMeasure) {
    return reply.status(409).send({
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada",
    });
  }

  return reply.status(200).send({
    image_url: "string",
    measure_value: "integer",
    measure_uuid: "string",
  });
});

app.patch("/confirm", async (request, reply) => {
  return { hello: "world" };
});
app.listen({ port: 8080 }, () => {
  console.log(`Server listening on http://localhost:8080`);
});
