import type { ReactNode } from "react";

export default function NewCustomerContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>Nesta página você pode cadastrar um novo cliente no sistema.</p>

      <p>
        Para cadastrar um novo cliente no sistema, clique no respectivo campo de entrada e insira as novas informações.
        Os campos obrigatórios estão marcados com um asterisco (*).
        Quando terminar, clique no botão “Salvar”, localizado no canto inferior direito da página.
        Para cancelar, clique em “Cancelar”, ao lado do botão “Salvar”.
      </p>

    </div>
  );
}
