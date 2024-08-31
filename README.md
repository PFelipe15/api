# 🛒 Shopper API

## 📋 Sobre o Projeto

Shopper API é uma aplicação backend robusta desenvolvida para gerenciar operações de uma plataforma de e-commerce. Esta API oferece funcionalidades para upload de arquivos, confirmação de pedidos e listagem de medidas por código de cliente. Além disso, a aplicação integra-se com a IA do Google Gemini para fornecer recursos avançados de processamento de linguagem natural e análise de dados.

## 🚀 Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript
- **[TypeScript](https://www.typescriptlang.org/)**: Superset tipado de JavaScript
- **[Fastify](https://www.fastify.io/)**: Framework web rápido e de baixo overhead
- **[Prisma](https://www.prisma.io/)**: ORM moderno para Node.js e TypeScript
- **[Docker](https://www.docker.com/)**: Plataforma de containerização
- **[Jest](https://jestjs.io/)**: Framework de testes
- **[Google Gemini AI](https://ai.google.dev/)**: IA para processamento de linguagem natural

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (normalmente vem com Node.js)
- Docker e Docker Compose

### Passos para Instalação

1. **Clone o repositório**
   ```
   git clone https://github.com/seu-usuario/shopper-api.git
   cd shopper-api
   ```

2. **Instale as dependências**
   ```
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Copie o arquivo `.env.example` para `.env` e preencha as variáveis necessárias.
   ```
   cp .env.example .env
   ```

4. **Execute as migrações do banco de dados**
   ```
   npx prisma migrate dev
   ```

5. **[Opcional] Execute o seed do banco de dados**
   ```
   npm run seed
   ```

## 🔐 Configuração das Variáveis de Ambiente

1. **Edite o arquivo .env**
   Abra o arquivo `.env` e preencha as seguintes variáveis:
   - `GEMINI_API_KEY`: Chave de API do Google Gemini

2. **Obtenha sua GEMINI_API_KEY**
   - Acesse o [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Crie uma nova chave de API
   - Copie a chave gerada e cole no arquivo `.env` na variável `GEMINI_API_KEY`

**Importante**: A chave `GEMINI_API_KEY` é essencial para a integração com a IA do Google Gemini. Sem esta chave, as funcionalidades relacionadas à IA não funcionarão corretamente.

## 🐳 Usando Docker

Para rodar a aplicação usando Docker:

1. **Construa a imagem e inicie os containers**
   ```
   docker-compose up --build
   ```

2. **Para parar os containers**
   ```
   docker-compose down
   ```

## 🚀 Executando a Aplicação

- **Modo de desenvolvimento**
  ```
  npm run dev
  ```

- **Modo de produção**
  ```
  npm run build
  npm start
  ```

## 🧪 Testes

Execute os testes usando o comando:

 ```
  npx jest 
  ```

## 📚 Documentação da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/upload` | Upload de arquivos |
| PATCH | `/confirm` | Confirmação de pedidos |
| GET | `/:customer_code/list` | Listagem de medidas por código de cliente |

Para mais detalhes sobre os endpoints, consulte a documentação completa da API [aqui](link-para-sua-documentacao).

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, sinta-se à vontade para submeter pull requests ou abrir issues.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## 📞 Contato

Paulo Felipe - [paulofelipet15@gmail.com](mailto:paulofelipet15@gmail.com)

Link do Projeto: [https://github.com/PFelipe15/api/](https://github.com/PFelipe15/api/)

---

⭐️ Feito com ❤️ por [Paulo Felipe](https://github.com/PFelipe15)
