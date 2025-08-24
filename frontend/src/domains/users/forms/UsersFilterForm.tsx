import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import { memo, ReactElement, ReactNode } from "react";
import { userFilterDefaultValues } from "../constants";
import { useFormContext } from "react-hook-form";
import { SchemaUsersFilterForm } from "../schemas";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { UsersFilterFormInputs } from "../types";
import InputLabel from "@/design-system/Form/InputLabel";
import useFilterContext from "@/domains/global/hooks/useFilterContext";

function UsersFilterForm(): ReactNode {
  const { usersFilter, handleUsersFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleSubmit(data: UsersFilterFormInputs) {
    handleUsersFilter({ page: 1, ...data });
    closeDialog();
  }

  return (
    <Form<UsersFilterFormInputs>
      schema={SchemaUsersFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col"
      defaultValues={{
        fullName: usersFilter?.fullName || "",
        status: usersFilter?.status || "active",
        startDate: usersFilter?.startDate || "",
        endDate: usersFilter?.endDate || "",
      }}
      replaceEmptyStringToNull={false}
    >
      <UsersFilterFormContent />
    </Form>
  );
}

function UsersFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleUsersFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleUsersFilter(userFilterDefaultValues);
    reset(userFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <Input<UsersFilterFormInputs> name="fullName" label="Nome completo" />
        <InputLabel label="Status" />
        <div className="flex flex-col gap-2">
          <Choice hideErrorLabel>
            <Choice.Radio<UsersFilterFormInputs>
              name="status"
              label="Ativo"
              value="active"
            />
            <Choice.Radio<UsersFilterFormInputs>
              name="status"
              label="Inativo"
              value="inactive"
            />
          </Choice>
        </div>
        <Input<UsersFilterFormInputs>
          name="startDate"
          label="Data inicial de criação"
          type="date"
        />
        <Input<UsersFilterFormInputs>
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

export default memo(UsersFilterForm);
