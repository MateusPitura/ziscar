DEV:

- Configure `.env`
- Inicie o banco, backend e frontend com `npm start` (obs.: no Windows execute em terminais separados `npm run dev:db`, `backend/npm run dev`, `frontend/npm run dev`) ou com `npm run dev` para executar com Docker
- Execute `backend/npm run dev:db-init` para preparar o banco para desenvolvimento, isso irá aplicar migrations, rodar seeds e popular. Use também quando precisar redefinir o banco (obs.: no Windows use o comando `npm run dev` e `npm run down`, para executar esses comandos através do container)
- Instale a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) para testar requisições através dos arquivos `.http`

TESTES UNITÁRIOS:

- Execute `npm run test:db` para subir o banco de testes
- Execute `backend/npm run test:db-init` para preparar o banco para testes
- Para executar os testes faça `backend/npm run test`
- Um testes não pode interferir no outro, assim a ordem de execução não pode ser um fator determinante. Portanto, o comando `test:db-init` deve ser usado para preparar o banco na primeira vez e enquanto criar/modificar os testes, logo usar o comando antes de cada suit de testes não é uma prática recomendada, pois cada testes deve ser capaz de fazer rollback de suas transações e manter o estado inicial do banco
- Para realizar rollback faça uso das transações. Se o teste buscar a falha, o próprio método testado deve ser capaz de realizar o rollback. Se o método testado possui uma transaction (ex.: createAccount), use o spyOn para injetar a transaction. Nos outros casos use Reflect para injetar a transaction
- Os testes não passam pelo AuthGuards nem pelo ValidationPipe do Zod

TESTES DE CARGA:

- Há também testes de carga com k6, execute `npm run test:load`. O comando irá iterar pelas pastas de `test/load/routes`, que deve ficar organizada conforme as rotas do backend. O resultado dos testes serão salvos na pasta `test/load/result`, para posterior comparação. Atenção, o teste de carga interage com o ambiente de produção. É possível ainda executar apenas um teste de carga com `npm run test:load test/load/routes/<path>.js`

BACKEND:

- As migrations podem ser geradas com `backend/npm run dev:migration-generate` e aplicadas com `backend/npm run dev:migration-run`
- Para usar transactions, use do método `.transaction` e não do `.$transaction`, que é nativo do Prisma. Esse método sobrescreve a função original e define tratativas para rollback e retries

FRONTEND:

- Para realizar requisições use o hook `useSafeFetch`, este método irá: mostrar snackbar em caso de erro, validar as permissões do usuário antes de cada request, fazer o stringify e o parse de objetos
- Para criar rotas modifique o arquivo `routes.tsx`, isso irá automaticamente criar uma rota e também um item no menu lateral. Elas são dividas em dois grupos, rotas privadas e públicas. Ao acessar uma rota privada será feita uma request para buscar as permissões do usuário, caso não retorne corretamente irá redirecionar para o signin, então irá verificar se o usuário possui as permissões necessárias conforme definido para cada rota em `routes.tsx`
- Para itens de formulário, use o `Form`, por padrão ele irá remover campos com strings vazias `""` ao realizar submit. Também sempre forneça o defaultValues, garanta que ao menos uma string vazia `""` seja fornecida e não undefined
- Para usar um dialog, use do componente `Dialog` e do hook `useDialog`, que fornece um state para controle do dialog é métodos úteis como `close`, `open`, `toggle` e `handle`
- As queries keys do React Query estão definidas em `global/types/index.ts`
- Para executar testes com Cypress execute `frontend/npm run cypress:test`, para abrir execute `frontend/npm run cypress:open`

SHARED:

- O módulo shared pode ser acessado tanto no frontend quanto no backend
- Ao invés de usar o zod diretamente, use o `safeZod`, importado como `s`. Ele abstrai e define padrões para o uso do zod, como toda string ser required e no máximo 128 caracteres. Para tornar opcional, no frontend `.or(s.empty())`, pois no frontend, no geral, não pode haver campos undefined, apenas strings vazias `""`

DEPLOY:

- O frontend é hospedado no Git Hub Pages, para realizar o deploy da main faça `frontend/npm run prod`
- O banco é hospedado em uma VM no OCI. Faça o build e atualize DockerHub com `npm run build`. Então configure o `.env` e execute o comando de `npm run prod:db` estando conectado na VM
- O backend é hospedado em uma VM no OCI. Faça o build e atualize o DockerHub com `npm run build`. Então configure o `.env` e execute o comando de `npm run prod:backend` estando conectado na VM
- Quando precisar atualizar o banco de produção, use o Bastion com o IP e porta do banco de produção, configure o `.env.prod` com o usuário, senha, porta e nome do banco de produção, mantenha localhost. Então execute `backend/npm run prod:db-init` para aplicar migrations e rodar seeds
