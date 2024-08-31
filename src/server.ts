import fastify from "fastify";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import { uploadHandler } from "./controllers/upload-controller";
import { confirmHandler } from "./controllers/confirm-controller";
 import { listMeasureHandler } from "./controllers/list-measure-controller";
 
dotenv.config();

const app = fastify();

app.register(multipart);

app.post("/upload", uploadHandler);

app.patch("/confirm", confirmHandler);

app.get("/:customer_code/list", listMeasureHandler);


app.get('/test', (req, res) => {
  res.send('API is working');
});

app.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor ouvindo em ${address}`);
});
