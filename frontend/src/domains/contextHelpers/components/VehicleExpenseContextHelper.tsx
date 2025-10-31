import type { ReactNode } from "react";

export default function VehicleExpenseContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página você pode consultar todas as despesas vinculadas ao veículo
        selecionado. Para adicionar um novo gasto, clique em "Adicionar gasto".
      </p>
      <p>
        As ações na tabela permitem editar, desativar ou reativar despesas. O
        valor total de gastos é exibido no topo da tela.
      </p>
    </div>
  );
}
