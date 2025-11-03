import type { ReactNode } from "react";

export default function EditCustomerContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página, você pode editar os dados de um cliente já cadastrado no sistema.
      </p>

      <p>
        Para alterar um campo, clique no respectivo campo de entrada e insira as novas informações.
        Quando terminar, clique no botão “Salvar”, localizado no canto inferior direito da página.
        Para cancelar as alterações, clique em “Cancelar”, ao lado do botão “Salvar”.
      </p>
    </div>
  );
}
