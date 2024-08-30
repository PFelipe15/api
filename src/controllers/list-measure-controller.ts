import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../config/db";

export const listMeasureHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const { customer_code } = request.params as { customer_code: string };
    const { measure_type } = request.query as { measure_type?: string };
  
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


}
