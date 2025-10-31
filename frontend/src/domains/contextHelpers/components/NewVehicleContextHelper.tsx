import type { ReactNode } from "react";

export default function NewVehicleContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Utilize esta página para cadastrar um novo veículo. Preencha as
        informações de compra, dados do veículo e selecione as características
        desejadas.
      </p>
      <p>
        Campos obrigatórios estão sinalizados com "*". Após preencher todos os
        dados, clique em "Salvar" para registrar o veículo ou "Cancelar" para
        descartar o cadastro.
      </p>
    </div>
  );
}
