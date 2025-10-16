import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import AddressFields from "@/domains/global/components/AddressFields";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { ActionsType, ResourcesType } from "@shared/enums";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SchemaStoreForm } from "../schemas";
import { StoreFormInputs } from "../types";

interface StoreFormProperties extends ContextHelperable {
  defaultValues: Partial<StoreFormInputs>;
  onSubmit: (data: StoreFormInputs) => void;
  isPending: boolean;
  headerTitle: string;
  isEdit?: boolean;
  resource?: ResourcesType;
  action?: ActionsType;
}

export default function StoreForm({
  defaultValues,
  onSubmit,
  isPending,
  headerTitle,
  isEdit = false,
  resource,
  action,
  contextHelper
}: StoreFormProperties): ReactNode {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<StoreFormInputs>
        schema={SchemaStoreForm}
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
                <Input<StoreFormInputs>
                  name="name"
                  label="Nome"
                  required
                  autoFocus
                />
                <Input<StoreFormInputs>
                  name="cnpj"
                  label="CNPJ"
                  mask="cnpj"
                  maxLength={18}
                  required
                />
                <Input<StoreFormInputs>
                  name="email"
                  label="Email"
                  type="email"
                />
                <Input<StoreFormInputs>
                  name="phone"
                  label="Celular"
                  mask="phone"
                  maxLength={15}
                  type="tel"
                />
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
            onClick={() => navigate("/stores")}
            tooltipMessage="Cancelar cadastro"
          />
        </PageFooter>
      </Form>
    </div>
  );
}
