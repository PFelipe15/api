import fastify from "fastify";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import { uploadHandler } from "./controllers/upload-controller";
import { confirmHandler } from "./controllers/confirm-controller";
import prisma from "./config/db";
import { listMeasureHandler } from "./controllers/list-measure-controller";
 
dotenv.config();

const app = fastify();

app.register(multipart);

app.post("/upload", uploadHandler);

app.patch("/confirm", confirmHandler);

app.get("/:customer_code/list", listMeasureHandler);


app.listen({ port: 8080 }, () => {
  console.log(`Server listening on http://localhost:8080`);
});
