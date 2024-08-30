import fastify from "fastify";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import { uploadHandler } from "./controllers/upload-controller";
import { confirmHandler } from "./controllers/confirm-controller";
import prisma from "./config/db";
 
dotenv.config();

const app = fastify();

app.register(multipart);

app.post("/upload", uploadHandler);

app.patch("/confirm", confirmHandler);

app.get("/:customer_code/list", async (request, reply) => {
  const { customer_code } = request.params as { customer_code: string };
  const { measure_type } = request.query as { measure_type?: string };

  
  console.log(measure_type)

  if (measure_type && !["WATER", "GAS"].includes(measure_type.toUpperCase())) {
    return reply.status(400).send({
      error_code: "INVALID_TYPE",
      error_description: "Tipo de medição não permitida"
    });
  }

  const measures = await prisma.measure.findMany({
    where: {
      customer_code,
      measure_type: measure_type 
    }
  })

   if (measures.length === 0) {
    return reply.status(404).send({
      error_code: "MEASURES_NOT_FOUND",
      error_description: "Nenhuma leitura encontrada"
    });
  }

  return reply.status(200).send({
    customer_code,
    measures
  });
});


app.listen({ port: 8080 }, () => {
  console.log(`Server listening on http://localhost:8080`);
});
