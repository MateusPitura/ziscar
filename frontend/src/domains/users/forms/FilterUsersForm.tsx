import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import Radio from "@/design-system/Form/Radio";
import SideSheet from "@/design-system/SideSheet";
import useCustomFormContext from "@/domains/global/hooks/useCustomFormContext";
import { ReactElement } from "react";
import { z } from "zod";

const SchemaFilterUsersForm = z.object({
  name: z.string().optional(),
  orderBy: z.enum(["name", "email"], { message: 'Opções inválidas'}).optional(),
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
        <Radio<FilterUsersFormInputs> name="orderBy">
          <Radio.Item label="Nome" value="name"/>
          <Radio.Item label="Email" value="email"/>
        </Radio>
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
