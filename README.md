# E-Commerce Management API

API REST isolada para categorias, produtos, clientes e pedidos. Usa autenticação JWT no padrão `Bearer`, MySQL e Swagger UI.

## Deploy de produção: Render + Aiven for MySQL

1. Crie um serviço **Aiven for MySQL** e importe o arquivo [`loja.sql`](./loja.sql) no banco.
2. No Render, crie um **Web Service** a partir deste repositório e selecione a branch `develop`.
3. Configure `npm install` como *Build Command* e `npm start` como *Start Command*.
4. Cadastre estas variáveis no Render:

```env
NODE_ENV=production
DB_HOST=SEU_HOST.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=sua_senha
DB_NAME=defaultdb
DB_SSL=true
DB_SSL_CA=conteudo_do_certificado_CA_com_quebras_substituidas_por_\\n
JWT_SECRET=uma-chave-longa-aleatoria-e-secreta
CORS_ORIGIN=https://seu-frontend.com
```

`APP_URL` é opcional no Render: a API usa automaticamente `RENDER_EXTERNAL_URL`, fornecida pela plataforma, para que o Swagger teste os endpoints de produção. O serviço recusa iniciar em produção se faltar TLS do banco, uma origem CORS específica ou uma chave JWT segura. O Render disponibiliza HTTPS para a URL pública.

## Homologação

Após o deploy, valide nesta ordem:

1. `GET /health` deve retornar `{ "status": "ok", "database": "connected" }`.
2. Abra `/api-docs`, faça registro ou login e use **Authorize** com o JWT retornado.
3. Teste os endpoints protegidos diretamente pelo Swagger.

## Endpoints

- `POST /api/auth/register` e `POST /api/auth/login`
- `GET|POST|PUT|DELETE /api/categorias`
- `GET|POST|PUT|DELETE /api/produtos`
- `GET|POST|PUT|DELETE /api/clientes`
- `GET|POST|PUT|DELETE /api/pedidos`
- `GET /api/status`, `GET /api/versao` e `GET /health`

## Execução local

```bash
npm install
copy .env.example .env
npm run dev
```

Configure um MySQL local e importe `loja.sql` antes de iniciar.
