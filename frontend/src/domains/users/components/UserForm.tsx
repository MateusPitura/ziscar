import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import AddressFields from "@/domains/global/components/AddressFields";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SchemUserForm, UserFormInputs } from "../schemas/users";

interface UserFormProperties {
  defaultValues: Partial<UserFormInputs>;
  onSubmit: (data: UserFormInputs) => void;
  isPending: boolean;
  headerPrimaryBtnLabel: string;
  headerTitle: string;
}

export default function UserForm({
  defaultValues,
  onSubmit,
  isPending,
  headerPrimaryBtnLabel,
  headerTitle,
}: UserFormProperties): ReactNode {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <Form<UserFormInputs>
        schema={SchemUserForm}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className="gap-4 flex flex-col"
      >
        <PageHeader
          title={headerTitle}
          primaryButtonLabel={headerPrimaryBtnLabel}
          secondaryButtonLabel="Cancelar"
          onClickSecondaryBtn={() => navigate("/users")}
          primaryBtnState={isPending ? "loading" : undefined}
          dirty
        />
        <div className="flex justify-center">
          <Section>
            <Section.Title title="Informações pessoais" />
            <Section.Group>
              <Section.Header title="Dados" />
              <Section.Body>
                <Input<UserFormInputs>
                  name="fullName"
                  label="Nome completo"
                  required
                />
                <Input<UserFormInputs> name="email" label="Email" required />
                <Input<UserFormInputs>
                  name="cellphone"
                  label="Celular"
                  mask="CELLPHONE"
                  required
                />
                <Input<UserFormInputs>
                  name="cpf"
                  label="CPF"
                  required
                  mask="CPF"
                />
                <Input<UserFormInputs> name="code" label="Matrícula" />
                <Input<UserFormInputs>
                  name="birthDate"
                  label="Data de nascimento"
                  type="date"
                />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Endereço" />
              <Section.Body>
                <AddressFields<UserFormInputs> inputNamePrefix="address" />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Categoria" />
              <Section.Body>
                <Choice<UserFormInputs> name="category">
                  <Choice.Radio label="Administrativo" value="admin" />
                  <Choice.Radio label="Vendedor" value="sales" />
                  <Choice.Radio label="Financeiro" value="finance" />
                </Choice>
              </Section.Body>
            </Section.Group>
          </Section>
        </div>
      </Form>
    </div>
  );
}
