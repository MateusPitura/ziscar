import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import { ReactElement } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

const SchemaUsersFilterForm = z.object({
  name: z.string().optional(),
  orderBy: z.string().optional(),
  category: z.string().array().optional(),
});

type UsersFilterFormInputs = z.infer<typeof SchemaUsersFilterForm>;

interface UsersFiltersFormProps {
  setUsersFilter: (value: string) => void;
}

const defaultValues: UsersFilterFormInputs = {
  name: "",
  orderBy: "",
  category: [],
};

export default function UsersFilterForm({
  setUsersFilter,
}: UsersFiltersFormProps): ReactElement {
  function handleSubmit(data: UsersFilterFormInputs) {
    const filters = [];
    if (data.name) {
      filters.push(`fullName=${data.name}`);
    }
    if (data.orderBy) {
      filters.push(`orderBy=${data.orderBy}`);
    }
    if (data.category?.length) {
      filters.push(`category=${data.category?.join(",")}`);
    }
    const filter = filters.join("&");
    setUsersFilter(filter);
  }

  return (
    <Form<UsersFilterFormInputs>
      schema={SchemaUsersFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col"
      defaultValues={defaultValues}
    >
      <UsersFilterFormContent />
    </Form>
  );
}

function UsersFilterFormContent(): ReactElement {
  const { reset } = useFormContext();

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
        onSecondaryCallback={() => reset(defaultValues)}
      />
    </>
  );
}
