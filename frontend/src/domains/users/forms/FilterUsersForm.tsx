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

export default function FilterUsersForm(): ReactElement {
  return (
    <Form<FilterUsersFormInputs>
      schema={SchemaFilterUsersForm}
      onSubmit={(data) => {
        console.log("🌠 data", data);
      }}
      className="flex-1 flex flex-col"
      defaultValues={{ orderBy: "name" }}
    >
      <FilterUsersFormContent />
    </Form>
  );
}

function FilterUsersFormContent(): ReactElement {
  const { setOpen } = useCustomFormContext();

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
        onPrimaryCallback={() => {}}
      />
    </>
  );
}
