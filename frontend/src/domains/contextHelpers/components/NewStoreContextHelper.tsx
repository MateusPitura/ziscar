import type { ReactNode } from "react";

export default function NewStoreContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Preencha os dados da nova loja, como nome, CNPJ, email, telefone e
        endereço. Campos obrigatórios estão sinalizados com "*".
      </p>
      <p>
        Após preencher todos os campos, clique em "Salvar" para registrar a loja
        ou "Cancelar" para voltar à listagem.
      </p>
    </div>
  );
}
