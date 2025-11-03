import type { ReactNode } from "react";

export default function AccountsPayableContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página você pode ver todos os pagamentos que a empresa fez ou precisa fazer a seus fornecedores, prestadores de serviço ou outros credores.
      </p>
      <p>
        Para filtrar a lista de contas a pagar, clique no botão "filtros" e defina os critérios desejados.
      </p>

      <p>
        Para gerar um relatório, clique no botão localizado no canto superior esquerdo da página. Os relatórios gerados seguem os filtros aplicados na tabela.
      </p>

      <p>
        Para filtar apenas as contas a pagar do dia de hoje, clique no botão "Contas de hoje" em formato de interruptor localizado no canto superior direito da página.
      </p>

      <p>
        Para ver detalhes de uma conta a pagar, clique no ícone de conta, localizado no canto direito do item da tabela.
      </p>
      <p>
        Para navegar entre as páginas de contas a pagar, utilize os botões "Anterior" e "Próxima" no rodapé da página.
      </p>
    </div>
  )
}