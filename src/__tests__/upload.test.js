const axios = require("axios");
import VerifyBase64 from '../utils/verify-base64'

axios.defaults.validateStatus = function () {
  return true;
};
test("Realizar operação de upload com sucesso", async () => {
  const body = {
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA",
    customer_code: "2",
    measure_datetime: "4",
    measure_type: "5",
  };

  const res = await axios.post("http://127.0.0.1:8080/upload", body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

 
  expect(res.status).toBe(200);
  expect(res.data.image_url).toBe("string");
  expect(res.data.measure_value).toBe("integer");
  expect(res.data.measure_uuid).toBe("string");
});
test("Retornar 400 error code e INVALID DATA no Upload", async () => {
  const body = {
    image: "",
    customer_code: "",
    measure_datetime: "",
    measure_type: "",
  };

  const res = await axios.post("http://127.0.0.1:8080/upload", body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

 
  expect(res.status).toBe(400);
  expect(res.data.error_code).toBe("INVALID_DATA");
  expect(res.data.error_description).toBe("Os dados fornecidos no corpo da requisição são inválidos",
  );

});

test("VerifyBase64 deve retornar true para uma string base64 válida", async () => {
  const validBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA";  
  
  const result = VerifyBase64(validBase64);

  expect(result).toBe(true);
});

test("VerifyBase64 deve retornar false para uma string base64 inválida", async () => {
  const invalidBase64 = "invalidBase64String"; // Uma string que claramente não é Base64

  const result = VerifyBase64(invalidBase64);

  expect(result).toBe(false);
});

test.skip("Retornar 409 error code e DOUBLE_REPORT no Upload", async () => {
  const body = {
    image: "",
    customer_code: "",
    measure_datetime: "",
    measure_type: "",
  };

  const res = await axios.post("http://127.0.0.1:8080/upload", body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

 
  expect(res.status).toBe(409);
  expect(res.data.error_code).toBe("DOUBLE_REPORT");
  expect(res.data.error_description).toBe("Leitura do mês já realizada",
  );
});
