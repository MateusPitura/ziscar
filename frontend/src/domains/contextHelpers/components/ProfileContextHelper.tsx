import type { ReactNode } from "react";

export default function ProfileContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Nesta página você pode atualizar seus dados pessoais, como nome,
        celular, CPF e endereço. Campos obrigatórios estão sinalizados com "*".
      </p>
      <p>
        Para alterar sua senha, utilize o botão "Alterar senha" e siga as
        instruções enviadas por email. Após realizar as alterações desejadas,
        clique em "Salvar" para atualizar seu perfil ou "Cancelar" para
        descartar as mudanças.
      </p>
    </div>
  );
}
