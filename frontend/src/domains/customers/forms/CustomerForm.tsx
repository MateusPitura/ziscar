import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import AddressFields from "@/domains/global/components/AddressFields";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { ActionsType, ResourcesType } from "@shared/enums";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SchemaCustomerForm } from "../schemas";
import { CustomerFormInputs as CustomerFormInputsType } from "../types";
import CustomerFormInputs from "./CustomerFormInputs";

interface CustomerFormProperties extends ContextHelperable {
  defaultValues: Partial<CustomerFormInputsType>;
  onSubmit: (data: CustomerFormInputsType) => void;
  isPending: boolean;
  headerTitle: string;
  isEdit?: boolean;
  resource?: ResourcesType;
  action?: ActionsType;
}

export default function CustomerForm({
  defaultValues,
  onSubmit,
  isPending,
  headerTitle,
  isEdit = false,
  resource,
  action,
  contextHelper
}: CustomerFormProperties): ReactNode {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<CustomerFormInputsType>
        schema={SchemaCustomerForm}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className="gap-4 flex flex-col flex-1"
        onlyDirty={isEdit}
      >
        <PageHeader title={headerTitle} contextHelper={contextHelper}/>
        <div className="flex justify-center flex-1">
          <Section>
            <Section.Group>
              <Section.Header title="Dados" />
              <Section.Body>
                <CustomerFormInputs/>
              </Section.Body>
            </Section.Group>
            <AddressFields />
          </Section>
        </div>
        <PageFooter primaryBtnState={isPending ? "loading" : undefined} dirty>
          <Button
            color="lightBlue"
            iconRight="Save"
            label="Salvar"
            resource={resource}
            action={action}
            tooltipMessage="Salvar cadastro"
          />
          <Button
            color="red"
            iconRight="Close"
            label="Cancelar"
            tooltipMessage="Cancelar cadastro"
            onClick={() => navigate('/customers')}
          />
        </PageFooter>
      </Form>
    </div>
  );
}
