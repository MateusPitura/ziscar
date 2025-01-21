import { ReactElement, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/domains/global/components/Form";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Input";
import { useFormContext } from "react-hook-form";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { useQuery } from "@tanstack/react-query";
import Button from "@/design-system/Button";

interface ViaCepAddress {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
}

const SchemaAddressForm = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP no formato inválido"),
  street: z.string().nullable(),
  number: z.string().nonempty({ message: "Campo obrigatório" }),
  neighborhood: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  complement: z.string().nullable(),
});

type AddressFormInputs = z.infer<typeof SchemaAddressForm>;

interface AddressFormProps {
  handleCloseModal: () => void;
  defaultValues: Partial<AddressFormInputs>;
}

export default function AddressForm({
  handleCloseModal,
  defaultValues,
}: AddressFormProps): ReactElement {
  const { mutate, isPending } = useUpdateProfileInfo<{
    address: AddressFormInputs;
  }>({
    onSuccessSubmit: handleCloseModal,
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
      <AddressFormContent
        handleCloseModal={handleCloseModal}
        isPending={isPending}
      />
    </Form>
  );
}

interface AddressFormContentProps {
  handleCloseModal: () => void;
  isPending: boolean;
}

function AddressFormContent({
  handleCloseModal,
  isPending,
}: AddressFormContentProps): ReactElement {
  const [currentValidCep, setCurrentValidCep] = useState("");

  const {
    formState: { isDirty },
    setValue,
    trigger,
    getValues,
  } = useFormContext();

  const { safeFetch } = useSafeFetch();

  async function fillAddress() {
    const isValid = await trigger("cep");
    if (isValid) {
      const cep = getValues("cep");
      setCurrentValidCep(cep);
    }
  }

  async function getCepInfo(cep: string): Promise<ViaCepAddress | null> {
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
    if (cepInfo) {
      setValue("street", cepInfo.logradouro);
      setValue("neighborhood", cepInfo.bairro);
      setValue("city", cepInfo.localidade);
      setValue("state", cepInfo.uf, { shouldDirty: true });
    }
  }, [cepInfo]);

  const primaryBtnState = useMemo(() => {
    if (isPending || isFetching) return "loading";
    if (!isDirty) return "disabled";
  }, [isPending, isDirty, isFetching]);

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
          className="flex items-center justify-between"
          onKeyDown={handleOnSubmitCepField}
        >
          <Input<AddressFormInputs> label="CEP" name="cep" />
          <Button
            variant="quaternary"
            label="Preencher automaticamente"
            onClick={fillAddress}
            state={isFetching ? "loading" : undefined}
          />
        </div>
        <Input<AddressFormInputs> label="Número" name="number" />
        <Input<AddressFormInputs> label="Rua" name="street" />
        <Input<AddressFormInputs> label="Bairro" name="neighborhood" />
        <Input<AddressFormInputs> label="Cidade" name="city" />
        <Input<AddressFormInputs> label="Estado" name="state" />
        <Input<AddressFormInputs> label="Complemento" name="complement" />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={handleCloseModal}
        primaryBtnState={primaryBtnState}
      />
    </>
  );
}
