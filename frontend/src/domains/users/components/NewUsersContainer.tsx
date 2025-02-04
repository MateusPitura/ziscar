import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { s } from "@/domains/global/schemas";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { defaultValues } from "../constants/newUserDefaultValues";
import { removeMask } from "@/domains/global/utils/removeMask";
import AddressFields from "@/domains/global/components/AddressFields";

const SchemNewUserForm = s.addressSchema().extend({
  fullName: s.fullName(),
  email: s.email(),
  cellphone: s
    .cellphone()
    .transform((cellhpone) => removeMask(cellhpone, "CELLPHONE")),
  cpf: s.cpf().transform((cpf) => removeMask(cpf, "CPF")),
  code: s.string("default", "optional"),
  birthDate: s.birthDate(),
});

type NewUserFormInputs = Omit<s.infer<typeof SchemNewUserForm>, "birthDate"> & {
  birthDate: string;
};

export default function NewUsersContainer(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <Form<NewUserFormInputs>
        schema={SchemNewUserForm}
        defaultValues={defaultValues}
        onSubmit={(data) => console.log("🌠 data", data)}
      >
        <PageHeader
          title="Novo usuário"
          primaryButtonLabel="Criar"
          secondaryButtonLabel="Cancelar"
          onClickSecondaryBtn={() => navigate("/users")}
          dirty
        />
        <div className="flex justify-center">
          <Section>
            <Section.Title title="Informações pessoais" />
            <Section.Group>
              <Section.Header title="Dados" />
              <Section.Body className="grid grid-cols-2 flex-1 gap-4">
                <Input<NewUserFormInputs>
                  name="fullName"
                  label="Nome completo"
                  required
                />
                <Input<NewUserFormInputs> name="email" label="Email" required />
                <Input<NewUserFormInputs>
                  name="cellphone"
                  label="Celular"
                  mask="CELLPHONE"
                  required
                />
                <Input<NewUserFormInputs>
                  name="cpf"
                  label="CPF"
                  required
                  mask="CPF"
                />
                <Input<NewUserFormInputs> name="code" label="Matrícula" />
                <Input<NewUserFormInputs>
                  name="birthDate"
                  label="Data de nascimento"
                  type="date"
                />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Endereço" />
              <Section.Body className="grid grid-cols-2 flex-1 gap-4">
                <AddressFields<NewUserFormInputs> />
              </Section.Body>
            </Section.Group>
          </Section>
        </div>
      </Form>
    </div>
  );
}
