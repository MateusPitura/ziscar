import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import { memo, ReactElement, ReactNode } from "react";
import { userFilterDefaultValues } from "../constants";
import { useFormContext } from "react-hook-form";
import { SchemaUsersFilterForm } from "../schemas";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { UsersFilterFormInputs } from "../types";
import InputLabel from "@/design-system/Form/InputLabel";

function UsersFilterForm(): ReactNode {
  const { usersFilter, handleUsersFilter } = useGlobalContext();
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
        orderBy: usersFilter?.orderBy || "fullName",
        status: usersFilter?.status || "active",
      }}
      replaceEmptyStringToNull={false}
    >
      <UsersFilterFormContent />
    </Form>
  );
}

function UsersFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleUsersFilter } = useGlobalContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleUsersFilter(userFilterDefaultValues);
    reset(userFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <InputLabel label="Buscar por" />
        <Input<UsersFilterFormInputs> name="fullName" label="Nome completo" />
        <InputLabel label="Ordenar por" />
        <div className="flex flex-col gap-2">
          <Choice<UsersFilterFormInputs> name="orderBy" hideErrorLabel>
            <Choice.Radio<UsersFilterFormInputs>
              name="orderBy"
              label="Nome"
              value="fullName"
            />
            <Choice.Radio<UsersFilterFormInputs>
              name="orderBy"
              label="Email"
              value="email"
            />
          </Choice>
        </div>
        <InputLabel label="Status" />
        <div className="flex flex-col gap-2">
          <Choice<UsersFilterFormInputs> name="status" hideErrorLabel>
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
