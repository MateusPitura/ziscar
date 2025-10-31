import type { ReactNode } from "react";

export default function NewUserContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Para adicionar um novo usuário, preencha todos os campos obrigatórios,
        incluindo dados pessoais, endereço e categoria de acesso.
      </p>
      <p>
        Após o cadastro, um email será enviado ao usuário para definição de
        senha. Clique em "Salvar" para concluir ou "Cancelar" para voltar.
      </p>
    </div>
  );
}
