import type { ReactNode } from "react";

export default function EditProfileContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página, você pode editar as informações do seu perfil.
      </p>

      <p>
        Para alterar um campo, clique no respectivo campo de entrada e insira as novas informações.
        Quando terminar, clique no botão “Salvar”, localizado no canto inferior direito da página.
        Para cancelar as alterações, clique em “Cancelar”, ao lado do botão “Salvar”.
      </p>

      <p>
        Para alterar sua senha, clique no botão “Alterar senha”.
        Em seguida, clique em “Solicitar alteração” caso deseje prosseguir com a mudança.
        Se preferir cancelar, clique em “Cancelar” no modal que será aberto.
      </p>
    </div>
  );
}
