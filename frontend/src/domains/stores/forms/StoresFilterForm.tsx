import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import { memo, ReactElement, ReactNode } from "react";
import { storeFilterDefaultValues } from "../constants";
import { useFormContext } from "react-hook-form";
import { SchemaStoresFilterForm } from "../schemas";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { StoresFilterFormInputs } from "../types";
import InputLabel from "@/design-system/Form/InputLabel";

function StoresFilterForm(): ReactNode {
  const { storesFilter, handleStoresFilter } = useGlobalContext();
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
        orderBy: storesFilter?.orderBy || "name",
        status: storesFilter?.status || "active",
      }}
      replaceEmptyStringToNull={false}
    >
      <StoresFilterFormContent />
    </Form>
  );
}

function StoresFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleStoresFilter } = useGlobalContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleStoresFilter(storeFilterDefaultValues);
    reset(storeFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <InputLabel label="Buscar por" />
        <Input<StoresFilterFormInputs> name="name" label="Nome" />
        <InputLabel label="Ordenar por" />
        <div className="flex flex-col gap-2">
          <Choice hideErrorLabel>
            <Choice.Radio<StoresFilterFormInputs>
              name="orderBy"
              label="Nome"
              value="name"
            />
            <Choice.Radio<StoresFilterFormInputs>
              name="orderBy"
              label="Email"
              value="email"
            />
          </Choice>
        </div>
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
