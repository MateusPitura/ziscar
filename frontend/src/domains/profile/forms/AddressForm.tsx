import { ReactElement, useEffect, useState } from "react";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/design-system/Form";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Form/Input";
import { useFormContext } from "react-hook-form";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { useQuery } from "@tanstack/react-query";
import Button from "@/design-system/Button";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { removeMask } from "@/domains/global/utils/removeMask";
import useDialogContext from "@/domains/global/hooks/useDialogContext";

interface ViaCepAddress {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

const SchemaAddressForm = z.object({
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido")
    .transform((cep) => removeMask(cep, "CEP")),
  street: z.string().nullable(),
  number: z.string().nonempty({ message: "Número inválido" }),
  neighborhood: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  complement: z.string().nullable(),
});

type AddressFormInputs = z.infer<typeof SchemaAddressForm>;

interface AddressFormProps {
  defaultValues: Partial<AddressFormInputs>;
}

export default function AddressForm({
  defaultValues,
}: AddressFormProps): ReactElement {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<{
    address: AddressFormInputs;
  }>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "Endereço atualizado com sucesso",
  });

  function handleSubmit(data: AddressFormInputs) {
    mutate({ address: data });
  }

  return (
    <Form<AddressFormInputs>
      onSubmit={handleSubmit}
      schema={SchemaAddressForm}
      defaultValues={defaultValues}
    >
      <AddressFormContent isPending={isPending} />
    </Form>
  );
}

interface AddressFormContentProps {
  isPending: boolean;
}

function AddressFormContent({
  isPending,
}: AddressFormContentProps): ReactElement {
  const [currentValidCep, setCurrentValidCep] = useState("");

  const { setValue, trigger, getValues } = useFormContext();

  const { safeFetch } = useSafeFetch();

  const { showErrorSnackbar } = useSnackbar();

  async function fillAddress() {
    const isValid = await trigger("cep");
    if (isValid) {
      const cep = getValues("cep");
      setCurrentValidCep(cep);
    }
  }

  async function getCepInfo(cep: string): Promise<ViaCepAddress | undefined> {
    return await safeFetch({
      path: `https://viacep.com.br/ws/${cep}/json/`,
    });
  }

  const { data: cepInfo, isFetching } = useQuery({
    queryKey: ["cepApi", currentValidCep],
    queryFn: ({ queryKey }) => getCepInfo(queryKey[1]),
    enabled: !!currentValidCep,
  });

  useEffect(() => {
    if (cepInfo?.erro) {
      showErrorSnackbar({
        title: "CEP não encontrado",
        description: "Por favor, insira um CEP válido",
      });
      return;
    }
    if (cepInfo) {
      setValue("street", cepInfo.logradouro);
      setValue("neighborhood", cepInfo.bairro);
      setValue("city", cepInfo.localidade);
      setValue("state", cepInfo.uf, { shouldDirty: true });
    }
  }, [cepInfo]);

  function handleOnSubmitCepField(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      fillAddress();
    }
  }

  return (
    <>
      <Modal.Body>
        <div
          className="flex items-center justify-between gap-1"
          onKeyDown={handleOnSubmitCepField}
        >
          <Input<AddressFormInputs>
            label="CEP"
            name="cep"
            mask="CEP"
            maxLength={9}
            required
          />
          <Button
            variant="quaternary"
            label="Preencher automaticamente"
            onClick={fillAddress}
            padding="none"
            state={isFetching ? "loading" : undefined}
          />
        </div>
        <Input<AddressFormInputs> label="Número" name="number" required />
        <Input<AddressFormInputs> label="Rua" name="street" />
        <Input<AddressFormInputs> label="Bairro" name="neighborhood" />
        <Input<AddressFormInputs> label="Cidade" name="city" />
        <Input<AddressFormInputs> label="Estado" name="state" />
        <Input<AddressFormInputs> label="Complemento" name="complement" />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending || isFetching ? "loading" : undefined}
        dirty
      />
    </>
  );
}
