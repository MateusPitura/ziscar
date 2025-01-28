import Input from "@/design-system/Input";
import SideSheet from "@/design-system/SideSheet";
import Form from "@/domains/global/components/Form";
import useCustomFormContext from "@/domains/global/hooks/useCustomFormContext";
import { ReactElement } from "react";
import { z } from "zod";

const SchemaFilterUsersForm = z.object({
  name: z.string().optional(),
  orderBy: z.enum(["name", "email"]).optional(),
  category: z.enum(["active", "inactive"]).optional(),
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
        <Input<FilterUsersFormInputs> name="orderBy" label="Ordenar por" />
        <span className="text-label-medium text-light-onSurface">
          Categoria
        </span>
        <Input<FilterUsersFormInputs> name="category" label="Categoria" />
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
