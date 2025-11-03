import type { ReactNode } from "react";

export default function AccountsReceivableInstallmentsContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página, você pode visualizar os detalhes de pagamento de uma venda
        referente a um veículo específico.
      </p>
      <p>
        Para marcar uma parcela como paga, clique no botão com o símbolo de cartão,
        localizado no canto direito do item da tabela.
        Em seguida, preencha os campos obrigatórios indicados com um asterisco (*).
      </p>
      <p>
        Para retornar à página de vendas, clique no botão “Voltar”, localizado no canto superior direito.
      </p>
    </div>
  );
}
