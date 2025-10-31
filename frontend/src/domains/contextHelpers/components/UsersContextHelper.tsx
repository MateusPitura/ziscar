import type { ReactNode } from "react";

export default function UsersContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página você pode visualizar, cadastrar e gerenciar os usuários.
        Utilize os filtros para buscar por nome, CPF, status ou data de criação.
      </p>
      <p>
        Para adicionar um novo usuário, clique em "Adicionar usuário". As ações
        na tabela permitem editar, desativar ou reativar usuários conforme
        necessário. O status indica se o usuário está ativo ou inativo.
      </p>
    </div>
  );
}
