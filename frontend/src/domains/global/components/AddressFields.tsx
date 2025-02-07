import Button from "@/design-system/Button";
import Input from "@/design-system/Form/Input";
import { useEffect, useState, type ReactNode } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import useSafeFetch from "../hooks/useSafeFetch";
import useSnackbar from "../hooks/useSnackbar";
import { useQuery } from "@tanstack/react-query";
import formatInputPrefix from "../utils/formatInputPrefix";
import { queryKeys } from "../types/queryKeys";

interface ViaCepAddress {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

interface AddressFieldsProps<T extends FieldValues> {
  inputNamePrefix?: keyof T & string;
}

export default function AddressFields<T extends FieldValues>({
  inputNamePrefix,
}: AddressFieldsProps<T>): ReactNode {
  const [currentValidCep, setCurrentValidCep] = useState("");

  const { setValue, trigger, getValues } = useFormContext();

  const { safeFetch } = useSafeFetch();
  const { showErrorSnackbar } = useSnackbar();

  async function fillAddress() {
    const isValid = await trigger(formatInputPrefix("cep", inputNamePrefix));
    if (isValid) {
      const cep = getValues(formatInputPrefix("cep", inputNamePrefix));
      setCurrentValidCep(cep);
    }
  }

  async function getCepInfo(cep: string): Promise<ViaCepAddress | undefined> {
    return await safeFetch({
      path: `https://viacep.com.br/ws/${cep}/json/`,
    });
  }

  const { data: cepInfo, isFetching } = useQuery({
    queryKey: [queryKeys.CEP_API, currentValidCep],
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
      setValue(
        formatInputPrefix("street", inputNamePrefix),
        cepInfo.logradouro
      );
      setValue(
        formatInputPrefix("neighborhood", inputNamePrefix),
        cepInfo.bairro
      );
      setValue(formatInputPrefix("city", inputNamePrefix), cepInfo.localidade);
      setValue(formatInputPrefix("state", inputNamePrefix), cepInfo.uf, {
        shouldDirty: true,
      });
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
        <Input<T>
          label="CEP"
          name={formatInputPrefix("cep", inputNamePrefix)}
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
      <Input<T>
        label="Número"
        name={formatInputPrefix("number", inputNamePrefix)}
        required
      />
      <Input<T>
        label="Rua"
        name={formatInputPrefix("street", inputNamePrefix)}
      />
      <Input<T>
        label="Bairro"
        name={formatInputPrefix("neighborhood", inputNamePrefix)}
      />
      <Input<T>
        label="Cidade"
        name={formatInputPrefix("city", inputNamePrefix)}
      />
      <Input<T>
        label="Estado"
        name={formatInputPrefix("state", inputNamePrefix)}
      />
      <Input<T>
        label="Complemento"
        name={formatInputPrefix("complement", inputNamePrefix)}
      />
    </>
  );
}
