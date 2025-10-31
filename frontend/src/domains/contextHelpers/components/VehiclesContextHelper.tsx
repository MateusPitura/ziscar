import type { ReactNode } from "react";

export default function VehiclesContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página você pode visualizar, filtrar e gerenciar os veículos
        cadastrados no sistema. Utilize os filtros para buscar veículos por
        loja, marca, status, categoria, ano, modelo ou faixa de preço.
      </p>
      <p>
        Para adicionar um novo veículo, clique em "Adicionar veículo". Para
        editar, desativar ou excluir um veículo, utilize os ícones de ação na
        tabela. O botão "Gerar relatório PDF" permite exportar a lista de
        veículos conforme os filtros aplicados. O status de cada veículo é
        exibido com uma etiqueta colorida para facilitar a identificação.
      </p>
    </div>
  );
}
