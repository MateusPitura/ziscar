import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import { memo, ReactElement } from "react";
import { defaultValues } from "../constants/usersFilter";
import { useFormContext } from "react-hook-form";
import {
  SchemaUsersFilterForm,
  UsersFilterFormInputs,
} from "../schemas/users";
import useDialogContext from "@/domains/global/hooks/useDialogContext";

function UsersFilterForm(): ReactElement {
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
      defaultValues={{ ...usersFilter }}
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
    handleUsersFilter(defaultValues);
    reset(defaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <span className="text-label-medium text-light-onSurface">
          Buscar por
        </span>
        <Input<UsersFilterFormInputs>
          name="fullName"
          label="Nome completo"
          hideErrorLabel
        />
        <span className="text-label-medium text-light-onSurface">
          Ordenar por
        </span>
        <div className="flex flex-col gap-2">
          <Choice<UsersFilterFormInputs> name="orderBy">
            <Choice.Radio label="Nome" value="name" />
            <Choice.Radio label="Email" value="email" />
          </Choice>
        </div>
        <span className="text-label-medium text-light-onSurface">Status</span>
        <div className="flex flex-col gap-2">
          <Choice<UsersFilterFormInputs> name="category">
            <Choice.Checkbox label="Ativo" value="active" />
            <Choice.Checkbox label="Inativo" value="inactive" />
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
