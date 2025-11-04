O vídeo do projeto pode ser acessado em https://youtu.be/Jkrk-iUCsal

A aplicação hospedada pode ser acessada em https://ziscar.me

O código fonte também está disponível no GitHub em https://github.com/MateusPitura/ziscar

1. Execução local

A aplicação pode ser acessada localmente utilizando as credenciais a seguir:

Administrador:
- Usuário: john.doe@email.com
- Senha: Senha12345@

Vendedor:
- Usuário: john.sales@email.com
- Senha: Senha12345@

1.1 Instalação do Docker

Caso já possua o Docker instalado pule para a próxima etapa

Entre no site https://docs.docker.com/desktop/setup/install/windows-install/ e clique em "Docker Desktop for Windows - x86_64"

Execute o arquivo ".exe" e siga as instruções

Inicie o aplicativo "Docker Desktop" e clique em "skip" na tela de login

Execute em um terminal CMD "wsl --update". Após concluir, verifique a versão com "wsl --version" (ex.: 2.5.10.0). Reinicie o computador e abra novamente o aplicativo "Docker Desktop"

Em um terminal CMD verifique a versão do docker com "docker -v" (ex.: 28.3.3) e "docker-compose -v" (ex.: 2.39.2)

1.2 Execução

Baixe o zip do projeto e descompacte. Use as opções padrão do arquivo ".env" ou o configure conforme a sua preferência navegando até a pasta raiz "ziscar-main", abrindo o arquivo e o editando

Abra um terminal CMD, navegue até a pasta raiz "ziscar-main". Garante que o programa "Docker Desktop" esteja aberto e execute no terminal "docker-compose pull" (irá demorar aproximadamente 2 minutos a depender da internet) e depois "docker-compose up". Caso o Docker solicite permissão para acessar o serviço de rede, aceite

No navegador abra "http://localhost:5173". As portas 3000, 5173, 5432 precisam estar livres
