import type { ReactNode } from "react";

export default function ViewVehicleSaleContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página você pode consultar os detalhes da venda realizada,
        incluindo informações do veículo e do cliente.
      </p>
      <p>
        Utilize as abas para alternar entre os dados do veículo e do comprador.
        Para retornar à listagem de vendas, utilize o botão "Voltar".
      </p>
    </div>
  );
}
