import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import useCustomFormContext from "@/domains/global/hooks/useCustomFormContext";
import { ReactElement } from "react";
import { z } from "zod";

const SchemaFilterUsersForm = z.object({
  name: z.string().optional(),
  orderBy: z.enum(["name", "email"], { message: "Opção inválida" }).optional(),
  category: z.string().array().optional(),
});

type FilterUsersFormInputs = z.infer<typeof SchemaFilterUsersForm>;

interface FilterUsersFormProps {
  setUsersInfoFilter: (value: string) => void;
}

export default function FilterUsersForm({
  setUsersInfoFilter,
}: FilterUsersFormProps): ReactElement {
  function handleSubmit(data: FilterUsersFormInputs) {
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
    if (!filters.length) return;
    const filter = `?${filters.join("&")}`;
    setUsersInfoFilter(filter);
  }

  return (
    <Form<FilterUsersFormInputs>
      schema={SchemaFilterUsersForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col"
      defaultValues={{ orderBy: "name", category: [] }}
    >
      <FilterUsersFormContent />
    </Form>
  );
}

function FilterUsersFormContent(): ReactElement {
  const { setOpen } = useCustomFormContext(); // TODO: Não funciona mais

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-2">
        <span className="text-label-medium text-light-onSurface">
          Buscar por
        </span>
        <Input<FilterUsersFormInputs> name="name" label="Nome" />
        <span className="text-label-medium text-light-onSurface">
          Ordenar por
        </span>
        <Choice<FilterUsersFormInputs> name="orderBy">
          <Choice.Radio label="Nome" value="name" />
          <Choice.Radio label="Email" value="email" />
        </Choice>
        <span className="text-label-medium text-light-onSurface">
          Categoria
        </span>
        <Choice<FilterUsersFormInputs> name="category">
          <Choice.Checkbox label="Ativo" value="active" />
          <Choice.Checkbox label="Inativo" value="inactive" />
        </Choice>
      </SideSheet.Body>
      <SideSheet.Footer
        primaryLabel="Aplicar"
        secondaryLabel="Limpar"
        onSecondaryCallback={() => setOpen(false)}
      />
    </>
  );
}
