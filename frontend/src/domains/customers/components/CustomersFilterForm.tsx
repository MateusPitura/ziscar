import useFilterContext from "@/domains/global/hooks/useFilterContext";
import { memo, type ReactElement, type ReactNode } from "react";
import { CustomersFilterFormInputs } from "../types";
import Form from "@/design-system/Form";
import { useFormContext } from "react-hook-form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import SideSheet from "@/design-system/SideSheet";
import Input from "@/design-system/Form/Input";
import Choice from "@/design-system/Form/Choice";
import InputLabel from "@/design-system/Form/InputLabel";
import { SchemaCustomersFilterForm } from "../schemas";
import { customerFilterDefaultValues } from "../constants";

function CustomersFilterForm(): ReactNode {
  const { customersFilter, handleCustomersFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleSubmit(data: CustomersFilterFormInputs) {
    handleCustomersFilter({ page: 1, ...data });
    closeDialog();
  }

  return (
    <Form<CustomersFilterFormInputs>
      schema={SchemaCustomersFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col min-h-0"
      defaultValues={{
        fullName: customersFilter?.fullName || "",
        status: customersFilter?.status || "active",
        startDate: customersFilter?.startDate || "",
        endDate: customersFilter?.endDate || "",
      }}
      replaceEmptyStringToNull={false}
    >
      <CustomersFilterFormContent />
    </Form>
  );
}

function CustomersFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleCustomersFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleCustomersFilter(customerFilterDefaultValues);
    reset(customerFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <Input<CustomersFilterFormInputs>
          name="fullName"
          label="Nome completo"
        />
        <InputLabel label="Status" />
        <div className="flex flex-col gap-2">
          <Choice hideErrorLabel>
            <Choice.Radio<CustomersFilterFormInputs>
              name="status"
              label="Ativo"
              value="active"
            />
            <Choice.Radio<CustomersFilterFormInputs>
              name="status"
              label="Inativo"
              value="inactive"
            />
          </Choice>
        </div>
        <Input<CustomersFilterFormInputs>
          name="startDate"
          label="Data inicial de criação"
          type="date"
        />
        <Input<CustomersFilterFormInputs>
          name="endDate"
          label="Data final de criação"
          type="date"
        />
      </SideSheet.Body>
      <SideSheet.Footer
        primaryLabel="Aplicar"
        secondaryLabel="Limpar"
        onSecondaryCallback={handleReset}
        dirty
      />
    </>
  );
}

export default memo(CustomersFilterForm);
