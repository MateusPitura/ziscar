import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { s } from "@/domains/global/schemas";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { defaultValues } from "../constants/newUserDefaultValues";
import { removeMask } from "@/domains/global/utils/removeMask";
import Choice from "@/design-system/Form/Choice";
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { baseUrl } from "@/domains/global/constants/requests";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import AddressFields from "@/domains/global/components/AddressFields";

const SchemNewUserForm = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cellphone: s
    .cellphone()
    .transform((cellhpone) => removeMask(cellhpone, "CELLPHONE")),
  cpf: s.cpf().transform((cpf) => removeMask(cpf, "CPF")),
  code: s.string("default", "optional"),
  birthDate: s.birthDate(),
  category: s.string(),
  address: s.addressSchema().extend({
    cep: s.cep().transform((cep) => removeMask(cep, "CEP")),
  }),
});

type NewUserFormInputs = Omit<s.infer<typeof SchemNewUserForm>, "birthDate"> & {
  birthDate: string;
};

export default function NewUsersContainer(): ReactElement {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetching = useIsFetching({ queryKey: ["cepApi"] });
  const queryClient = useQueryClient();

  async function createUser(data: NewUserFormInputs) {
    const dataFormatted = { ...data, isActive: true };

    await safeFetch({
      path: `${baseUrl}/users`,
      method: "POST",
      body: dataFormatted,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Usuário criado com sucesso",
      });
      navigate("/users");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Form<NewUserFormInputs>
        schema={SchemNewUserForm}
        defaultValues={defaultValues}
        onSubmit={mutate}
        className="gap-4 flex flex-col"
      >
        <PageHeader
          title="Novo usuário"
          primaryButtonLabel="Criar"
          secondaryButtonLabel="Cancelar"
          onClickSecondaryBtn={() => navigate("/users")}
          primaryBtnState={isPending || isFetching ? "loading" : undefined}
          dirty
        />
        <div className="flex justify-center">
          <Section>
            <Section.Title title="Informações pessoais" />
            <Section.Group>
              <Section.Header title="Dados" />
              <Section.Body>
                <Input<NewUserFormInputs>
                  name="fullName"
                  label="Nome completo"
                  required
                />
                <Input<NewUserFormInputs> name="email" label="Email" required />
                <Input<NewUserFormInputs>
                  name="cellphone"
                  label="Celular"
                  mask="CELLPHONE"
                  required
                />
                <Input<NewUserFormInputs>
                  name="cpf"
                  label="CPF"
                  required
                  mask="CPF"
                />
                <Input<NewUserFormInputs> name="code" label="Matrícula" />
                <Input<NewUserFormInputs>
                  name="birthDate"
                  label="Data de nascimento"
                  type="date"
                />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Endereço" />
              <Section.Body>
                <AddressFields<NewUserFormInputs> inputNamePrefix="address" />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Categoria" />
              <Section.Body>
                <Choice<NewUserFormInputs> name="category">
                  <Choice.Radio label="Administrativo" value="admin" />
                  <Choice.Radio label="Vendedor" value="sales" />
                  <Choice.Radio label="Financeiro" value="finance" />
                </Choice>
              </Section.Body>
            </Section.Group>
          </Section>
        </div>
      </Form>
    </div>
  );
}
