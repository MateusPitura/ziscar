import type { ReactNode } from "react";

export default function AccountsPayableInstallmentsContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página, você pode visualizar e gerenciar os detalhes de um pagamento
        que a empresa realizou ou ainda deve realizar a um credor.
      </p>

      <p>
        Para retornar à página de contas a pagar, clique no botão “Voltar”,
        localizado no canto superior direito da página.
      </p>

      <p>
        Para adicionar um método de pagamento a uma conta e, consequentemente, marcá-la como concluída,
        clique no botão com o ícone de cartão de crédito, localizado à direita do item da tabela.
        Em seguida, preencha os campos obrigatórios marcados com um asterisco (*) no modal que será aberto.
        Clique em “Adicionar” para confirmar ou em “Cancelar” para interromper o processo.
      </p>
    </div>
  );
}
