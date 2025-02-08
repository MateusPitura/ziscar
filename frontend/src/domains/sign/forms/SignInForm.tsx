import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import InputPassword from "@/design-system/Form/InputPassword";
import { s } from "@/domains/global/schemas";
import { type ReactNode } from "react";
import SignCard from "../components/SignCard";

const SchemaSignInForm = s.object({
  email: s.email(),
  password: s.string(),
});

type SignInFormInputs = s.infer<typeof SchemaSignInForm>;

export default function SignInForm(): ReactNode {
  return (
    <Form<SignInFormInputs>
      schema={SchemaSignInForm}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={() => {}}
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
          <Button label="Esqueci a senha" variant="quaternary" />
        </div>
        <SignCard.Footer label="Entrar" />
      </div>
      <Button
        label="Criar conta"
        fullWidth
        textAlign="center"
        variant="secondary"
      />
    </Form>
  );
}
