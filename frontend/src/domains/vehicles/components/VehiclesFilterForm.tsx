import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import { memo, ReactElement, ReactNode } from "react";
import { vehicleFilterDefaultValues } from "../constants";
import { useFormContext } from "react-hook-form";
import { SchemaVehiclesFilterForm } from "../schemas";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { VehiclesFilterFormInputs } from "../types";
import useFilterContext from "@/domains/global/hooks/useFilterContext";

function VehiclesFilterForm(): ReactNode {
  const { vehiclesFilter, handleVehiclesFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleSubmit(data: VehiclesFilterFormInputs) {
    handleVehiclesFilter({ page: 1, ...data });
    closeDialog();
  }

  return (
    <Form<VehiclesFilterFormInputs>
      schema={SchemaVehiclesFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col"
      defaultValues={{
        startDate: vehiclesFilter?.startDate || "",
        endDate: vehiclesFilter?.endDate || "",
      }}
      replaceEmptyStringToNull={false}
    >
      <VehiclesFilterFormContent />
    </Form>
  );
}

function VehiclesFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleVehiclesFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleVehiclesFilter(vehicleFilterDefaultValues);
    reset(vehicleFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <Input<VehiclesFilterFormInputs>
          name="startDate"
          label="Data inicial"
          type="date"
        />
        <Input<VehiclesFilterFormInputs>
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

export default memo(VehiclesFilterForm);
