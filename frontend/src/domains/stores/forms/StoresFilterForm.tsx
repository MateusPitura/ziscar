import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import { memo, ReactElement, ReactNode } from "react";
import { storeFilterDefaultValues } from "../constants";
import { useFormContext } from "react-hook-form";
import { SchemaStoresFilterForm } from "../schemas";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { StoresFilterFormInputs } from "../types";
import InputLabel from "@/design-system/Form/InputLabel";
import useFilterContext from "@/domains/global/hooks/useFilterContext";

function StoresFilterForm(): ReactNode {
  const { storesFilter, handleStoresFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleSubmit(data: StoresFilterFormInputs) {
    handleStoresFilter({ page: 1, ...data });
    closeDialog();
  }

  return (
    <Form<StoresFilterFormInputs>
      schema={SchemaStoresFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col"
      defaultValues={{
        name: storesFilter?.name || "",
        status: storesFilter?.status || "active",
        startDate: storesFilter?.startDate || "",
        endDate: storesFilter?.endDate || "",
      }}
      replaceEmptyStringToNull={false}
    >
      <StoresFilterFormContent />
    </Form>
  );
}

function StoresFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleStoresFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleStoresFilter(storeFilterDefaultValues);
    reset(storeFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <Input<StoresFilterFormInputs> name="name" label="Nome" />
        <InputLabel label="Status" />
        <div className="flex flex-col gap-2">
          <Choice hideErrorLabel>
            <Choice.Radio<StoresFilterFormInputs>
              name="status"
              label="Ativo"
              value="active"
            />
            <Choice.Radio<StoresFilterFormInputs>
              name="status"
              label="Inativo"
              value="inactive"
            />
          </Choice>
        </div>
        <Input<StoresFilterFormInputs>
          name="startDate"
          label="Data inicial"
          type="date"
        />
        <Input<StoresFilterFormInputs>
          name="endDate"
          label="Data final"
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

export default memo(StoresFilterForm);
