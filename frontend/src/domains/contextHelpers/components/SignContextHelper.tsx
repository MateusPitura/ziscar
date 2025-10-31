import type { ReactNode } from "react";

export default function SignContextHelper(): ReactNode {
  return (
    <div className="text-body-medium text-neutral-700 space-y-2">
      <p>
        Informe seu email e senha para acessar o sistema. Caso tenha esquecido a
        senha, utilize a opção "Esqueci a senha" para receber instruções de
        recuperação no seu email.
      </p>
    </div>
  );
}
