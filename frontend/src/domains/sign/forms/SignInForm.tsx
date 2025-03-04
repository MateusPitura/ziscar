import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import InputPassword from "@/design-system/Form/InputPassword";
import { s } from "@shared/safeZod";
import { type ReactNode } from "react";
import SignCard from "../components/SignCard";
import useSignPageContext from "../hooks/useSignPageContext";
import useDialog from "@/domains/global/hooks/useDialog";
import ForgetPasswordModal from "../components/ForgetPasswordModal";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/domains/global/constants";

const SchemaSignInForm = s.object({
  email: s.email(),
  password: s.string(),
});

type SignInFormInputs = s.infer<typeof SchemaSignInForm>;

export default function SignInForm(): ReactNode {
  const { handleStep } = useSignPageContext();
  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const navigate = useNavigate();

  async function handleSignIn(data: SignInFormInputs) {
    await safeFetch(`${BASE_URL}/auth/sign-in`, {
      method: "POST",
      body: data,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleSignIn,
    onSuccess: () => {
      navigate("/");
    },
  });

  return (
    <>
      <ForgetPasswordModal {...dialog} />
      <Form<SignInFormInputs>
        schema={SchemaSignInForm}
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={mutate}
        className="flex-1 flex flex-col"
      >
        <div className="flex-1 flex flex-col gap-2">
          <Input<SignInFormInputs> name="email" label="Email" required />
          <InputPassword<SignInFormInputs>
            label="Senha"
            name="password"
            required
          />
          <div className="flex items-end justify-end">
            <Button
              label="Esqueci a senha"
              variant="quaternary"
              onClick={dialog.openDialog}
            />
          </div>
        </div>
        <SignCard.Footer
          label="Entrar"
          secondaryBtnLabel="Criar conta"
          onClickSecondaryBtn={() => handleStep("SIGN_UP")}
          primaryBtnState={isPending ? "loading" : undefined}
        />
      </Form>
    </>
  );
}
