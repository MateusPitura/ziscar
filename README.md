DEV:
- Configure `.env` e `backend/.env`
- Inicie o banco, backend e frontend com `npm start`
- Execute `backend/npm run prisma:dev` para preparar o banco para desenvolvimento, isso irá aplicar migrations, rodar seeds e popular. Use também quando precisar redefinir o banco
- Instale a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) para testar requisições através dos arquivos `.http`

TESTES:
- Execute `up:test_db` para subir o banco de testes
- Execute `backend/npm run test:setup` para preparar o banco para testes
- Para executar os testes faça `backend/npm run test`
- Um testes não pode interferir no outro, assim a ordem de execução não pode ser um fator determinante. Portanto, o comando `test:setup` deve ser usado para preparar o banco na primeira vez e enquanto criar/modificar os testes, logo usar o comando antes de cada suit de testes não é uma prática recomendada, pois cada testes deve ser capaz de fazer rollback de suas transações e manter o estado inicial do banco
- Para realizar rollback faça uso das transações. Se o teste buscar a falha, o próprio método testado deve ser capaz de realizar o rollback. Se o método testado possui uma transaction (ex.: createAccount), use o spyOn para injetar a transaction. Nos outros casos use Reflect para injetar a transaction
- Os testes não passam pelo ValidationPipe do Zod, logo os inputs não são validados. Também não passam pelos AuthGuards

BACKEND:
- As migrations podem ser geradas com `backend/npm run migration:generate` e aplicadas com `backend/npm run migration:run`
- Para usar transactions, use do método `.transaction` e não do `.$transaction`, que é nativo do Prisma. Esse método sobreescreve a função original e define tratativas para rollback e retries

FRONTEND:
- Para realizar requisições use o hook `useSafeFetch`, este método irá: mostrar snackbar em caso de erro, validar as permissões do usuário antes de cada request, fazer o stringify e o parse de objetos
- Para criar rotas modifique o arquivo `routes.tsx`, isso irá automaticamente criar uma rota e também um item no menu lateral. Elas são dividas em dois grupos, rotas privadas e públicas. Ao acessar uma rota privada será feita uma request para buscar as permissões do usuário, caso não retorne corretamente irá redirecionar para o signin, então irá verificar se o usuário possui as permissões necessárias conforme definido para cada rota em `routes.tsx`
- Para itens de formulário, use o `Form`, por padrão ele irá remover campos com strings vazias `""` ao realizar submit. Também sempre forneça o defaultValues, garanta que ao menos uma string vazia `""` seja fornecida e não undefined
- Para usar um dialog, use do componente `Dialog` e do hook `useDialog`, que fornece um state para controle do dialog é metodos úteis como `close`, `open`, `toggle` e `handle`
- As queries keys do React Query estão definidas em `global/types/index.ts`

SHARED:
- O módulo shared pode ser acessado tanto no frontend quanto no backend
- Ao invés de usar o zod diretamente, use o `safeZod`, importado como `s`. Ele abstrai e define padrões para o uso do zod, como toda string ser required e no máximo 128 caracteres. Para tornar opcional, no backend use `.optional()` e no frontend `.or(s.empty())`. Essa distinção é necessária pois no frontend não podemos ter campos undefined, apenas strings vazias `""`

DEPLOY:
- O frontend é hospeado no Git Hub Pages, para realizar o deploy da main faça `frontend/npm run deploy`
- O banco é hospedado em uma VM no OCI. Para fazer o deploy, configure o `.env` e execute o comando de `npm run prod:db` estando conectado na VM
- O backend é hospedado em uma VM no OCI. Para fazer o deploy, configure o `backend/.env` e execute o comando de `npm run prod:backend` estando conectado na VM. A primeira vez, estando conectado a um backend com acesso ao banco em produção, execute `backend/npm run prisma:deploy` para preparar o banco para produção, isso irá aplicar migrations e rodar seeds
