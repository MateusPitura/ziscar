import Button from "@/design-system/Button";
import Input from "@/design-system/Form/Input";
import { useEffect, useState, type ReactNode } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import useSafeFetch from "../hooks/useSafeFetch";
import useSnackbar from "../hooks/useSnackbar";
import { useQuery } from "@tanstack/react-query";

interface ViaCepAddress {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export default function AddressFields<T extends FieldValues>(): ReactNode {
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
      <div
        className="flex items-center justify-between gap-1"
        onKeyDown={handleOnSubmitCepField}
      >
        <Input<T> label="CEP" name="cep" mask="CEP" maxLength={9} required />
        <Button
          variant="quaternary"
          label="Preencher automaticamente"
          onClick={fillAddress}
          padding="none"
          state={isFetching ? "loading" : undefined}
        />
      </div>
      <Input<T> label="Número" name="number" required />
      <Input<T> label="Rua" name="street" />
      <Input<T> label="Bairro" name="neighborhood" />
      <Input<T> label="Cidade" name="city" />
      <Input<T> label="Estado" name="state" />
      <Input<T> label="Complemento" name="complement" />
    </>
  );
}
