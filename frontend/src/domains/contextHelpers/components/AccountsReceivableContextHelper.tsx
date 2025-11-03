import type { ReactNode } from "react";

export default function AccountsReceivableContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página, você pode consultar e gerenciar todas as vendas da sua empresa.
        As vendas representam os valores que a sua empresa tem a receber pelos veículos vendidos.
      </p>
      <p>
        Para gerar um relatório das vendas, clique no botão azul “Gerar relatório PDF”,
        localizado no canto superior esquerdo da página.
        Caso queira gerar um relatório filtrado, utilize os filtros clicando no botão de filtros
        no canto superior direito.
      </p>
      <p>
        Clique no botão à esquerda, com o título “Filtros”, para filtrar as vendas por
        descrição, data inicial, data final e status geral.
      </p>
      <p>
        Ative o botão “Contas de hoje” para visualizar apenas as vendas realizadas no dia atual.
      </p>
      <p>
        Para ver os detalhes de uma venda específica, clique no botão com o símbolo “$”
        correspondente ao item na tabela.
      </p>
      <p>
        Para visualizar as parcelas de uma venda, clique no botão com o símbolo de uma nota fiscal,
        localizado ao lado do botão “$” do respectivo item.
      </p>
      <p>
        Para navegar entre as páginas de vendas, utilize os botões “Anterior” e “Próxima”
        no rodapé da página.
      </p>
    </div>
  );
}
