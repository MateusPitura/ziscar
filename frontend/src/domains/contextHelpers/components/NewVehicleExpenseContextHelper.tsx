import type { ReactNode } from "react";

export default function NewVehicleExpenseContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Preencha os campos obrigatórios para cadastrar uma nova despesa de
        veículo. Informe corretamente a categoria, valor, data de competência e,
        se necessário, detalhes adicionais.
      </p>
      <p>
        Utilize as seções para adicionar informações de entrada e pagamento.
        Após preencher, clique em "Salvar" para registrar a despesa ou
        "Cancelar" para descartar.
      </p>
    </div>
  );
}
