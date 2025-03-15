BACKEND:
- Configure os .env do backend e do root
- Configure o settings.json
- Instale a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) para fazer requisições através dos arquivos .http
- Execute `docker-compose up --build -d`
- Execute `npm run prisma:dev`, para preparar o banco para desenvolvimento
- Execute `npm run test:setup`, para preparar o banco para testes
- Faça `npm i` nas pastas backend, frontend e shared
- Para rodar execute `npm start` na raíz do projeto

TESTES:
- Para executar os testes faça `npm run test`
- Um testes não pode interferir no outro, assim a ordem de execução não pode ser um fator determinante. Portanto, o comando `test:setup` deve ser usado para preparar o banco na primeira vez e enquanto criar/modificar os testes, logo usar o comando antes de cada suit de testes não é uma prática recomendada, pois cada testes deve ser capaz de fazer rollback de suas transações e manter o estado inicial do banco
- Para realizar rollback faça uso das transações. Se o teste buscar a falha, o próprio método testado deve ser capaz de realizar o rollback. Se o método testado possui uma transaction (ex.: createAccount), faça uso do spyOn para injetar a transaction. Nos outros casos use o método Reflect para injetar a transaction
- Os testes não passam pelo ValidationPipe do Zod, logo os inputs não são validados