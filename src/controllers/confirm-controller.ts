import prisma from "../config/db";
import { FastifyReply, FastifyRequest } from "fastify";
 

interface confirmProps{

    "measure_uuid": string,
    confirmed_value: string | number
    
    }

export const confirmHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const data = req.body as confirmProps
        if (!data.measure_uuid || typeof data.measure_uuid !== 'string' || 
        !data.confirmed_value || (typeof data.confirmed_value !== 'string' && typeof data.confirmed_value !== 'number')) {
        return reply.status(400).send({
            error_code: "INVALID_DATA",
            error_description: "Os dados fornecidos no corpo da requisição são inválidos"
        })
    }


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
    
    
    
       
     await prisma.measure.update({
      where: {
        id: hasMeasure.id,
      },
       data:{
          has_confirmed: true,
          measure_value: Number(data.confirmed_value)
        }
      })
    
    
        return reply.status(200).send({
          success:true
        })
};