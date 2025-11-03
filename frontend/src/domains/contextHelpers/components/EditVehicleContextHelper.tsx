import type { ReactNode } from "react";

export default function EditVehicleContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página, você pode editar as informações de um veículo já cadastrado no sistema.
      </p>

      <p>
        Clique no botão “Compra” para alterar os dados relacionados à compra do veículo.
      </p>

      <p>
        Clique no botão “Veículo” para editar as informações gerais do veículo cadastrado.
      </p>

      <p>
        Clique no botão “Características” para modificar as especificações e detalhes do veículo.
      </p>

      <p>
        Para alterar um campo, clique no respectivo campo de entrada e insira as novas informações.
        Quando terminar, clique no botão “Salvar”, localizado no canto inferior direito da página.
        Para cancelar as alterações, clique em “Cancelar”, ao lado do botão “Salvar”.
      </p>
    </div>
  );
}
