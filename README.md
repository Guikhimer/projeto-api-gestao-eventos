# Sistema de Gestão de Eventos - API REST

Uma API RESTful para gerenciar eventos, com autenticação JWT e banco de dados MongoDB (NoSQL).

## Requisitos
- Node.js
- MongoDB (Local ou Atlas)

## Como Instalar e Rodar

1. Clone o repositório ou baixe os arquivos.
2. No diretório do projeto, rode:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto, usando o `.env.example` como base:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/gestao_eventos
   JWT_SECRET=sua_chave_secreta_aqui
   ```
4. Para iniciar o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

## Endpoints

### Autenticação (`/api/auth`)
- **POST** `/register`: Registra um novo usuário. Precisa enviar `nome`, `email` e `senha` no body (JSON).
- **POST** `/login`: Faz login do usuário. Retorna um token JWT.

### Eventos (`/api/events`)
- **GET** `/`: Retorna a lista de todos os eventos. (Público)
- **GET** `/:id`: Retorna os detalhes de um evento específico. (Público)
- **POST** `/`: Cria um novo evento. Exige token JWT no header `Authorization: Bearer <token>`.
- **PUT** `/:id`: Atualiza um evento (Apenas o criador pode atualizar). Exige token JWT.
- **DELETE** `/:id`: Deleta um evento (Apenas o criador pode deletar). Exige token JWT.
