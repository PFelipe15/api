import axios from "axios";
import prisma from "../config/db";


axios.defaults.validateStatus = function () {
    return true;
  };
   
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Listar medicoes",()=>{

    test("GET /list retorna a lista de medicoes com sucesso", async () => {
      await prisma.measure.deleteMany({});
      await prisma.measure.createMany({
        data: [
          {
            customer_code: "123456",
            measure_uuid: "uuid123",
            measure_value: 12345,
            measure_datetime: "2024-03-19T14:30:00Z",
            measure_type: "WATER",
            image_url: "http://example.com/image.png",
          },
          {
            customer_code: "123456",
            measure_uuid: "uuid123",
            measure_value: 12345,
            measure_datetime: "2024-03-19T14:30:00Z",
            measure_type: "GAS",
            image_url: "http://example.com/image.png",
          },
          {
            customer_code: "123456",
            measure_uuid: "uuid123",
            measure_value: 12345,
            measure_datetime: "2024-05-19T14:30:00Z",
            measure_type: "WATER",
            image_url: "http://example.com/image.png",
          },
        ],
      });
    
      const res = await axios.get("http://127.0.0.1:8080/123456/list");
    
      expect(res.status).toBe(200);
      expect(res.data).toEqual(
        expect.objectContaining({
          customer_code: "123456",
          measures: expect.arrayContaining([
            expect.objectContaining({
              measure_type: "WATER",
            }),
            expect.objectContaining({
              measure_type: "GAS",
            }),
          ]),
        })
      );
    });
    
    test("GET /list/gas retorna a lista filtrada de medicoes de gas com sucesso", async () => {
      await prisma.measure.deleteMany({});
      await prisma.measure.createMany({
        data: [
          {
            customer_code: "123456",
            measure_uuid: "uuid123",
            measure_value: 12345,
            measure_datetime: "2024-03-19T14:30:00Z",
            measure_type: "WATER",
            image_url: "http://example.com/image.png",
          },
          {
            customer_code: "123456",
            measure_uuid: "uuid123",
            measure_value: 12345,
            measure_datetime: "2024-03-19T14:30:00Z",
            measure_type: "GAS",
            image_url: "http://example.com/image.png",
          },
          {
            customer_code: "123456",
            measure_uuid: "uuid123",
            measure_value: 12345,
            measure_datetime: "2024-05-19T14:30:00Z",
            measure_type: "WATER",
            image_url: "http://example.com/image.png",
          },
        ],
      });
    
      const res = await axios.get(
        "http://127.0.0.1:8080/123456/list?measure_type=GAS"
      );
    
      expect(res.status).toBe(200);
      expect(res.data).toEqual(
        expect.objectContaining({
          customer_code: "123456",
          measures: expect.arrayContaining([
            expect.objectContaining({
              measure_type: "GAS",
            }),
          ]),
        })
      );
    });
    
    
    test("GET /list/water retorna a lista filtrada de medicoes de agua com sucesso", async () => {
        await prisma.measure.deleteMany({});
        await prisma.measure.createMany({
            data: [
              {
                customer_code: "123456",
                measure_uuid: "uuid123",
                measure_value: 12345,
                measure_datetime: "2024-03-19T14:30:00Z",
                measure_type: "WATER",
                image_url: "http://example.com/image.png",
              },
              {
                customer_code: "123456",
                measure_uuid: "uuid123",
                measure_value: 12345,
                measure_datetime: "2024-03-19T14:30:00Z",
                measure_type: "GAS",
                image_url: "http://example.com/image.png",
              },
              {
                customer_code: "123456",
                measure_uuid: "uuid123",
                measure_value: 12345,
                measure_datetime: "2024-05-19T14:30:00Z",
                measure_type: "WATER",
                image_url: "http://example.com/image.png",
              },
            ],
          });
    
    const res = await axios.get("http://127.0.0.1:8080/123456/list?measure_type=WATER")
    
    expect(res.status).toBe(200)
    expect(res.status).toBe(200);
    expect(res.data).toEqual(
      expect.objectContaining({
        customer_code: "123456",
        measures: expect.arrayContaining([
          expect.objectContaining({
            measure_type: "WATER",
          }),
        ]),
      })
    );
    
    
    })
    
    
    test("GET /list/invalid-type retorna erro para tipo de medicao invalido", async () => {
    
    
        await prisma.measure.createMany({
            data: [
              {
                customer_code: "123456",
                measure_uuid: "uuid123",
                measure_value: 12345,
                measure_datetime: "2024-03-19T14:30:00Z",
                measure_type: "WATER",
                image_url: "http://example.com/image.png",
              },
              {
                customer_code: "123456",
                measure_uuid: "uuid123",
                measure_value: 12345,
                measure_datetime: "2024-03-19T14:30:00Z",
                measure_type: "GAS",
                image_url: "http://example.com/image.png",
              },
              {
                customer_code: "123456",
                measure_uuid: "uuid123",
                measure_value: 12345,
                measure_datetime: "2024-05-19T14:30:00Z",
                measure_type: "WATER",
                image_url: "http://example.com/image.png",
              },
            ],
          });
    
        const res = await axios.get("http://127.0.0.1:8080/123456/list?measure_type=Eletricity")
    
        expect(res.status).toBe(400)
        expect(res.data).toEqual(
            expect.objectContaining({
                   error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida"
            })
        )
    })
    
    test("GET /list/ retorna erro para Medicoes não encontradas", async () => {
    
        await prisma.measure.deleteMany({}) //Deleta todas as medicoes assim nao vai ter nenhuma para o customer 123456
        const res = await axios.get("http://127.0.0.1:8080/123456/list")
    
        expect(res.status).toBe(404)
        expect(res.data).toEqual(
            expect.objectContaining({
            error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada"
            })
        )})
    

  })
