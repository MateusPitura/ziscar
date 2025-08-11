import type { ReactNode } from "react";
import { CustomerFormInputs } from "../types";
import { Action, Resource } from "@shared/types";
import Form from "@/design-system/Form";
import { SchemaCustomerForm } from "../schemas";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import Input from "@/design-system/Form/Input";
import AddressFields from "@/domains/global/components/AddressFields";
import PageFooter from "@/domains/global/components/PageFooter";
import Button from "@/design-system/Button";
import { PREVIOUS_PAGE } from "@/domains/global/constants";
import { useNavigate } from "react-router-dom";

interface CustomerFormProperties {
  defaultValues: Partial<CustomerFormInputs>;
  onSubmit: (data: CustomerFormInputs) => void;
  isPending: boolean;
  headerTitle: string;
  isEdit?: boolean;
  resource?: Resource;
  action?: Action;
}

export default function CustomerForm({
  defaultValues,
  onSubmit,
  isPending,
  headerTitle,
  isEdit = false,
  resource,
  action,
}: CustomerFormProperties): ReactNode {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<CustomerFormInputs>
        schema={SchemaCustomerForm}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className="gap-4 flex flex-col flex-1"
        onlyDirty={isEdit}
      >
        <PageHeader title={headerTitle} />
        <div className="flex justify-center flex-1">
          <Section>
            <Section.Group>
              <Section.Header title="Dados" />
              <Section.Body>
                <Input<CustomerFormInputs>
                  name="fullName"
                  label="Nome completo"
                  required
                  autoFocus
                />
                <Input<CustomerFormInputs>
                  name="cpf"
                  label="CPF"
                  mask="cpf"
                  maxLength={18}
                  required
                />
                <Input<CustomerFormInputs>
                  name="email"
                  label="Email"
                  type="email"
                />
                <Input<CustomerFormInputs>
                  name="phone"
                  label="Celular"
                  mask="phone"
                  maxLength={15}
                  type="tel"
                />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Endereço" />
              <Section.Body>
                <AddressFields />
              </Section.Body>
            </Section.Group>
          </Section>
        </div>
        <PageFooter primaryBtnState={isPending ? "loading" : undefined} dirty>
          <Button
            color="lightBlue"
            iconRight="Save"
            label="Salvar"
            resource={resource}
            action={action}
          />
          <Button
            color="red"
            iconRight="Close"
            label="Cancelar"
            onClick={() => navigate(PREVIOUS_PAGE)}
          />
        </PageFooter>
      </Form>
    </div>
  );
}
