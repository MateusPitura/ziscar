import Form from "@/design-system/Form";
import { defaultValues } from "@/domains/global/constants/passwordDefaultValues";
import { SchemaPassword } from "@/domains/global/schemas/schemas";
import type { ReactNode } from "react";
import SignCard from "../components/SignCard";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { s } from "@/domains/global/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "@/domains/global/constants/requests";
import InputPassword from "@/design-system/Form/InputPassword";

type NewPasswordFormInputs = s.infer<typeof SchemaPassword>;

export default function NewPasswordForm(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { token } = useParams();
  const navigate = useNavigate();

  async function handleSingin(data: NewPasswordFormInputs) {
    await safeFetch({
      path: `${baseUrl}/sign/${token}`,
      method: "PATCH",
      body: { password: data.newPassword },
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleSingin,
    onSuccess: () => {
      navigate("/sign");
    },
  });

  return (
    <Form<NewPasswordFormInputs>
      defaultValues={defaultValues}
      schema={SchemaPassword}
      onSubmit={mutate}
      className="flex-1 flex flex-col"
    >
      <div className="flex-1">
        <InputPassword<NewPasswordFormInputs>
          label="Nova senha"
          name="newPassword"
          required
        />
        <InputPassword<NewPasswordFormInputs>
          label="Confirmar senha"
          name="confirmPassword"
          required
        />
      </div>
      <SignCard.Footer
        label="Salvar"
        primaryBtnState={isPending ? "loading" : undefined}
      />
    </Form>
  );
}
