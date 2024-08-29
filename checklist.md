# Checklist do Projeto
serviço de leitura de
imagens.


## Estrutura do Projeto
- [X] Criar o projeto e configurar o ambiente.
- [X] Configurar o TypeScript.
- [X] Configurar o Fastify.
- [X] Configurar o Prisma Client.
- [X] Criar a estrutura do banco de dados no Prisma.
- [X] Configurar as rotas básicas.

## Funcionalidades
- [x] Implementar o upload de imagens.
- [X] Criar o serviço Gemini para extração de valores a partir de imagens.
- [X] Implementar validações de campos obrigatórios no upload.
- [ ] Verificar se já existe uma leitura para o mês (regra de negócio).
- [ ] Inserir nova leitura no banco de dados.

## Regras de Negócio
- [X] Validar se todos os campos obrigatórios foram preenchidos.
- [X] Verificar duplicidade de leitura para o mês.
- [x] Processar imagem com o serviço Gemini para extrair valores.
- [ ] Salvar a leitura no banco de dados.
- [X] Retornar a URL da imagem e o valor extraído.

## Testes
- [X] Escrever testes unitários para as funções de validação.
- [X] Testar a rota de upload com campos válidos e inválidos.
- [X] Testar a lógica de duplicidade de leitura.
- [X] Testar a integração com o serviço Gemini.
- [X] Testar o comportamento em caso de falha no servidor.

## Documentação
- [ ] Documentar a API utilizando Swagger ou outro framework.
- [ ] Criar README.md com instruções de instalação e uso do projeto.
- [ ] Especificar as regras de negócio na documentação.

 
 

 # Descrição das Rotas

## POST `/upload`
Rota responsável por receber uma imagem em base64, consultar a API do Google Gemini e retornar a medida lida pela API. Além disso, verifica se já existe uma leitura para o mês atual do tipo especificado.

## PATCH `/confirm`
Rota responsável por confirmar ou corrigir o valor lido pelo LLM, validando se o código de leitura informado existe e se já foi confirmado.

## GET `/<customer_code>/list`
Rota responsável por listar todas as medidas realizadas por um determinado cliente. Opcionalmente, pode receber um parâmetro de consulta `measure_type` para filtrar os resultados por tipo de medida (água ou gás).



