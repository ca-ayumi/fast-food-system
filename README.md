<h1 align="center">🍔 fast-food-system </h1>

![Diagrama Componente.drawio.png](Diagrams%2FDiagrama%20Componente.drawio.png)

## Descrição

Esta API é projetada para gerenciar pedidos de um restaurante de fast food, permitindo que os clientes façam pedidos e acompanhem seu progresso. A API fornece endpoints para cadastrar clientes, criar pedidos, listar pedidos, criar, editar e remover produtos e enviar os pedidos para fila. Ela segue uma arquitetura hexagonal e usa NestJS com TypeORM e PostgreSQL.

## Instalação

npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

```bash
$ git clone https://github.com/ca-ayumi/fast-food-system.git
$ cd fast-food-system
$ npm install
```

## Setup

Criar o arquivo .env com as credenciais.

## Rodando a aplicação

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## 📝 Qualidade

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## 🛫 Migração

```bash
# build
$ npm run build

# create migration
$ npm run typeorm migration:generate -- -n CreateInitialTables
$ npm run typeorm migration:run
```

## 🗒️ Documentação

- [Fast Food System DOCS](https://www.notion.so/O-BOTIC-RIO-Test-Case-0cd6be17745d415690775126903508f9?pvs=4)
- [Swagger](http://localhost:3000/api#/)

## 📌 Tecnologias

- [NestJS](https://nestjs.com/) - Framework para NodeJS
- [Jest](https://jestjs.io/pt-BR/) - Framework de testes
- [ESLint](https://eslint.org/) - Análise e limpeza de código fonte
- [Prettier](https://prettier.io/) - Formatador de código fonte
- [Swagger](https://swagger.io/) - Framework para processo de documentação
- [TypeORM](https://typeorm.io/) - ORM para TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
