Entre no site https://docs.docker.com/desktop/setup/install/windows-install/ e clique em "Docker Desktop for Windows - x86_64"

Execute o arquivo ".exe" e siga as instruções

Inicie o aplicativo "Docker Desktop" e clique em "skip" na tela de login

Execute em um terminal "wsl --update". Após concluir, verifique a versão com "wsl --version" (ex.: 2.5.10.0). Reinicie o computador e abra novamente o aplicativo "Docker Desktop"

Em um terminal verifique a versão do docker com "docker -v" (ex.: 28.3.3) e "docker-compose -v" (ex.: 2.39.2)

Baixe o zip do projeto, descompacte e abra na raiz do projeto. USe as opções padrões do arquivo ".env" ou o configure conforme a sua preferência

Abra um terminal, navegue até a pasta raiz do projeto e execute "docker-compose pull" (irá demorar aproximadamente 2 minutos a depender da internet) e depois "docker-compose up". Caso o Docker solicite permissão para acessar o serviço de rede, aceite

No navegador abra "http://localhost:5173", faça login com usuário administrador "john.doe@email.com" e senha "Senha12345@" ou vendedor "john.sales@email.com" e senha "Senha12345@"
