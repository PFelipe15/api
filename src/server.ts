import fastify from "fastify";
const app = fastify({ logger: true });

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
    !measure.measure_datetime
  ) {
    return reply.status(404).send({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos",
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
