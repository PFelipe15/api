const { default: axios } = require("axios")
import { describe } from 'node:test';
import prisma from '../config/db'
axios.defaults.validateStatus = function () {
    return true;
  };
   
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Confirmar leitura",()=>{
      test("Aplicacao retornará sucess para operacao realizada com sucesso ",async ()=>{
      await prisma.measure.deleteMany({});
      await prisma.measure.create({
          data: {
              customer_code:"132345",
              measure_uuid: "uuid123",
              measure_value: 12345,
              measure_datetime :"2024-03-19T14:30:00Z",
              measure_type: "WATER",
              image_url: "http://example.com/image.png",
          }
      
      }) 
      
         const res = await axios.patch("http://127.0.0.1:8080/confirm",{
              "measure_uuid": "uuid123",
              "confirmed_value": 14566
      })
      
      
      
          expect(res.status).toBe(200);
          expect(res.data.success).toBe(true);
      
      })
      test("Aplicacao retornará MEASURE_NOT_FOUND para operacao não encontrada ",async ()=>{
      
      
          await prisma.measure.deleteMany({});
      
      
         const res = await axios.patch("http://127.0.0.1:8080/confirm",{
              "measure_uuid": "uuid123",
              "confirmed_value": 14566
              })
      
      
      
          expect(res.status).toBe(404);
          expect(res.data.error_code).toBe("MEASURE_NOT_FOUND");
          expect(res.data.error_description).toBe("Leitura do mês já realizada");
      
      })
      test("Aplicacao retornará CONFIRMATION_DUPLICATE para operacao já confirmada ",async ()=>{
      await prisma.measure.deleteMany({});
           await prisma.measure.create({
              data: {
                  customer_code:"132345",
                  measure_uuid: "uuid123",
                  measure_value: 12345,
                  measure_datetime :"2024-03-19T14:30:00Z",
                  measure_type: "WATER",
                  has_confirmed:true,
                  image_url: "http://example.com/image.png",
              }
          
          }) 
      
          
      
      
         const res = await axios.patch("http://127.0.0.1:8080/confirm",{
              "measure_uuid": "uuid123",
              "confirmed_value": 14566
              })
      
      
      
          expect(res.status).toBe(409);
          expect(res.data.error_code).toBe("CONFIRMATION_DUPLICATE");
          expect(res.data.error_description).toBe("Leitura do mês já realizada");
      
      })

  })