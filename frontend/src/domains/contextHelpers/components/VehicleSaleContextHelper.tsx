import type { ReactNode } from "react";

export default function VehicleSaleContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Utilize esta página para registrar a venda de um veículo. Verifique os
        dados do veículo, selecione o cliente e informe as condições de
        pagamento.
      </p>
      <p>
        Campos obrigatórios estão sinalizados com "*". Após preencher todas as
        informações, clique em "Salvar" para concluir a venda ou "Cancelar" para
        descartar as alterações.
      </p>
    </div>
  );
}
