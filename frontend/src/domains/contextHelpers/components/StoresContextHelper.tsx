import type { ReactNode } from "react";

export default function StoresContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página você pode visualizar, cadastrar e gerenciar lojas. Utilize
        os filtros para buscar por nome, status ou data de criação.
      </p>
      <p>
        Para adicionar uma nova loja, clique em "Adicionar loja". As ações na
        tabela permitem editar, desativar ou reativar lojas conforme necessário.
        O status indica se a loja está ativa ou inativa.
      </p>
    </div>
  );
}
