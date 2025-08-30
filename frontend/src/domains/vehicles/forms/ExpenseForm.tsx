import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import PaymentForm from "@/domains/global/forms/PaymentForm";
import { ActionsType, ResourcesType } from "@shared/enums";
import type { ReactNode } from "react";
import { SchemaVehicleExpenseForm } from "../schemas";
import { VehicleExpenseFormInputs } from "../types";
import VehicleExpenseDetailsForm from "./VehicleExpenseDetailsForm";
import UpfrontForm from "@/domains/global/forms/UpfrontForm";

interface ExpenseFormProperties {
  defaultValues: Partial<VehicleExpenseFormInputs>;
  onSubmit: (data: VehicleExpenseFormInputs) => void;
  isPending: boolean;
  headerTitle: string;
  isEdit?: boolean;
  resource?: ResourcesType;
  action?: ActionsType;
  onClose: () => void;
}

export default function ExpenseForm({
  defaultValues,
  onSubmit,
  isPending,
  headerTitle,
  isEdit = false,
  resource,
  action,
  onClose,
}: ExpenseFormProperties): ReactNode {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<VehicleExpenseFormInputs>
        schema={SchemaVehicleExpenseForm}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className="gap-4 flex flex-col flex-1"
        onlyDirty={isEdit}
      >
        <PageHeader title={headerTitle} />
        <div className="flex justify-center flex-1">
          <Section>
            <Section.Group>
              <Section.Header title="Informações do gasto" />
              <Section.Body>
                <VehicleExpenseDetailsForm />
              </Section.Body>
            </Section.Group>
            {!isEdit && (
              <>
                <Section.Group>
                  <Section.Header title="Informações da entrada" />
                  <Section.Body>
                    <UpfrontForm />
                  </Section.Body>
                </Section.Group>
                <Section.Group>
                  <Section.Header title="Informações do pagamento" />
                  <Section.Body>
                    <PaymentForm />
                  </Section.Body>
                </Section.Group>
              </>
            )}
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
            onClick={onClose}
          />
        </PageFooter>
      </Form>
    </div>
  );
}
