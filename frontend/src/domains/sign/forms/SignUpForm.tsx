import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import { s } from "@shared/safeZod";
import type { ReactNode } from "react";
import SignCard from "../components/SignCard";
import useSignPageContext from "../hooks/useSignPageContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { useMutation } from "@tanstack/react-query";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { BASE_URL } from "@/domains/global/constants";

const SchemaSignUpForm = s.object({
  branchName: s.string(),
  cnpj: s.cnpj(),
  userName: s.fullName(),
  userEmail: s.email(),
});

type SignUpFormInputs = s.infer<typeof SchemaSignUpForm>;

export default function SignUpForm(): ReactNode {
  const { handleStep } = useSignPageContext();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();

  async function handleSignUp(data: SignUpFormInputs) {
    await safeFetch(`${BASE_URL}/auth/sign-up`, {
      method: "POST",
      body: data,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleSignUp,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Confira seu email",
        description: "Enviaremos um email para definir a senha",
      });
    },
  });

  return (
    <Form<SignUpFormInputs>
      schema={SchemaSignUpForm}
      defaultValues={{
        branchName: "",
        cnpj: "",
        userName: "",
        userEmail: "",
      }}
      onSubmit={mutate}
      className="flex-1 flex flex-col"
    >
      <div className="flex-1">
        <Input<SignUpFormInputs>
          name="branchName"
          label="Nome da filial"
          required
        />
        <Input<SignUpFormInputs>
          name="cnpj"
          label="CNPJ"
          required
          mask="cnpj"
        />
        <Input<SignUpFormInputs>
          name="userName"
          label="Nome do usuário"
          required
        />
        <Input<SignUpFormInputs>
          name="userEmail"
          label="Email do usuário"
          required
        />
      </div>
      <SignCard.Footer
        label="Criar"
        secondaryBtnLabel="Cancelar"
        onClickSecondaryBtn={() => handleStep("SIGN_IN")}
        primaryBtnState={isPending ? "loading" : undefined}
      />
    </Form>
  );
}
