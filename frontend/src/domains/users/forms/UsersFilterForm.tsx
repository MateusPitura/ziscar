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
} from "../schemas/usersFilters";

function UsersFilterForm(): ReactElement {
  const { usersFilter, handleUsersFilter } = useGlobalContext();

  function handleSubmit(data: UsersFilterFormInputs) {
    handleUsersFilter({ page: 1, ...data });
  }

  return (
    <Form<UsersFilterFormInputs>
      schema={SchemaUsersFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col"
      defaultValues={usersFilter}
    >
      <UsersFilterFormContent />
    </Form>
  );
}

function UsersFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleUsersFilter } = useGlobalContext();

  function handleReset() {
    handleUsersFilter(defaultValues);
    reset(defaultValues);
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-2">
        <span className="text-label-medium text-light-onSurface">
          Buscar por
        </span>
        <Input<UsersFilterFormInputs> name="name" label="Nome" />
        <span className="text-label-medium text-light-onSurface">
          Ordenar por
        </span>
        <Choice<UsersFilterFormInputs> name="orderBy">
          <Choice.Radio label="Nome" value="name" />
          <Choice.Radio label="Email" value="email" />
        </Choice>
        <span className="text-label-medium text-light-onSurface">
          Categoria
        </span>
        <Choice<UsersFilterFormInputs> name="category">
          <Choice.Checkbox label="Ativo" value="active" />
          <Choice.Checkbox label="Inativo" value="inactive" />
        </Choice>
      </SideSheet.Body>
      <SideSheet.Footer
        primaryLabel="Aplicar"
        secondaryLabel="Limpar"
        onSecondaryCallback={handleReset}
      />
    </>
  );
}

export default memo(UsersFilterForm);
