import fastify from "fastify";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import { uploadHandler } from "./controllers/upload-controller";
import prisma from "./config/db";
 
dotenv.config();

const app = fastify();

app.register(multipart);

app.post("/upload", uploadHandler);


interface confirmProps{

"measure_uuid": string,
"confirmed_value": number

}

app.patch("/confirm", async (req, reply) => {
  const data = req.body as confirmProps

  
const hasMeasure = await prisma.measure.findFirst({
  where:{
    measure_uuid: data.measure_uuid,
   }
}) 

 if (!hasMeasure){
  return reply.status(404).send({
    error_code:"MEASURE_NOT_FOUND",
    error_description: "Leitura do mês já realizada"
   })
}


if(hasMeasure?.has_confirmed){
  return reply.status(409).send({
    error_code:"CONFIRMATION_DUPLICATE",
    error_description: "Leitura do mês já realizada"})
  }

    return reply.status(200).send({
      success:true
    })

});



app.listen({ port: 8080 }, () => {
  console.log(`Server listening on http://localhost:8080`);
});
 