---
description: API_REST
---

Objetivo
Desenvolver uma API REST funcional utilizando o ecossistema Node.js e o banco de dados NoSQL MongoDB. A aplicação deve demonstrar domínio em persistência de dados, segurança, autenticação de usuários e boas práticas de versionamento de código.
2. Escopo da Aplicação
O aluno deve escolher um domínio de negócio que se beneficie da flexibilidade do modelo de documentos (NoSQL), como:
Catálogo de Produtos com atributos dinâmicos.
Rede Social Simples (postagens e comentários).
Sistema de Gestão de Eventos (com participantes e inscrições).
3. Requisitos Técnicos ObrigatóriosA. Arquitetura e Persistência
Conexão NoSQL: Integração com MongoDB (local ou Atlas) utilizando a biblioteca Mongoose.
CRUD Completo: Implementação das quatro operações básicas (Create, Read, Update, Delete) para a entidade principal.
Modelagem de Dados: Criação de um Schema que utilize tipos de dados variados e validações obrigatórias.
B. Autenticação e Segurança
Rotas de Autenticação: Implementação de Registro e Login de usuários.
Segurança de Senhas: Armazenamento de senhas utilizando criptografia (Ex: BCrypt).
Proteção de Dados: Implementar defesas contra injeção de código e sanitização de entradas para evitar manipulação indevida do banco de dados (NoSQL Injection).
C. Versionamento e Governança (Git)
Repositório: O projeto deve ser hospedado obrigatoriamente no GitHub.
GitFlow: Demonstração do uso de branches organizadas:
main: Versão estável.
develop: Integração de novas funcionalidades.
feature/nome-da-tarefa: Ramos para desenvolvimento de requisitos específicos.
Histórico de Commits: Commits semânticos e frequentes, evitando grandes envios únicos.4. Critérios de Avaliação

Qualidade Técnica
40%  Organização do código (MVC), funcionamento do CRUD e conexão estável.

Segurança
20% Criptografia de senhas e tratamento de inputs dos usuários.

Git & Workflow  
20%  Uso correto do GitFlow e clareza nas mensagens de commit.

Documentação
20% Arquivo README.md explicando como rodar o projeto e a lista de endpoints.5. Entrega
Deverá ser entregue o Link do Repositório do GitHub. O repositório deve conter um arquivo .env.example indicando as variáveis de ambiente necessárias (como a string de conexão do banco), sem expor credenciais reais.

Formato: Link do GitHub via [Plataforma de Ensino/E-mail].