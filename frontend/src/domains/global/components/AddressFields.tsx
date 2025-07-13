import Button from "@/design-system/Button";
import Input from "@/design-system/Form/Input";
import { useEffect, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import useSafeFetch from "../hooks/useSafeFetch";
import useSnackbar from "../hooks/useSnackbar";
import { useQuery } from "@tanstack/react-query";
import { addressDefaultValues } from "@/domains/users/constants";
import Tooltip from "@/design-system/Tooltip";
import { UserFormInputs } from "@/domains/users/types";
import Select from "@/design-system/Form/Select";
import { STATES } from "../constants";

interface ViaCepAddress {
  logradouro: string;
  bairro: string;
  ibge: string;
  uf: string;
  erro: boolean;
}

interface IbgeCity {
  nome: string;
  id: string;
}

interface AddressFieldsProps {
  defaultOpen?: boolean;
}

export default function AddressFields({
  defaultOpen = false,
}: AddressFieldsProps): ReactNode {
  const [currentValidCep, setCurrentValidCep] = useState("");
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const { setValue, trigger, getValues, watch } =
    useFormContext<UserFormInputs>();

  const { safeFetch } = useSafeFetch();
  const { showErrorSnackbar } = useSnackbar();

  async function getCepInfo(cep: string): Promise<ViaCepAddress | undefined> {
    return await safeFetch(`https://viacep.com.br/ws/${cep}/json/`, {
      enableCookie: false,
    });
  }

  const { data: cepInfo, isFetching: isFetchingCep } = useQuery({
    queryKey: ["cepApi", currentValidCep],
    queryFn: ({ queryKey }) => getCepInfo(queryKey[1]),
    enabled: !!currentValidCep,
  });

  useEffect(() => {
    if (cepInfo?.erro) {
      showErrorSnackbar({
        description: "CEP não encontrado",
      });
      return;
    }

    if (!cepInfo) return;

    setValue("address.street", cepInfo.logradouro, { shouldDirty: true });
    setValue("address.neighborhood", cepInfo.bairro, { shouldDirty: true });
    setValue("address.city", cepInfo.ibge, {
      shouldDirty: true,
    });
    setValue("address.state", cepInfo.uf, {
      shouldDirty: true,
    });
  }, [cepInfo, setValue, showErrorSnackbar]);

  async function getCitiesFromState(
    state?: string
  ): Promise<IbgeCity[] | undefined> {
    if (!state) return [];

    return await safeFetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`,
      {
        enableCookie: false,
      }
    );
  }

  const selectedState = watch("address.state");

  const { data: citiesInfo, isFetching: isFetchingCities } = useQuery({
    queryKey: ["ibgeApi", selectedState],
    queryFn: ({ queryKey }) => getCitiesFromState(queryKey[1]),
    enabled: !!selectedState,
    select: (data) =>
      data?.map((city) => ({
        value: String(city.id),
        label: city.nome,
      })),
  });

  async function fillAddress() {
    const isValid = await trigger("address.cep");
    if (isValid) {
      const cep = getValues("address.cep");
      setCurrentValidCep(cep);
    }
  }

  function handleOnSubmitCepField(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      fillAddress();
    }
  }

  return !isOpen ? (
    <div className="col-span-full">
      <Button
        variant="secondary"
        label="Adicionar endereço"
        onClick={() => {
          setIsOpen(true);
          setValue("address", addressDefaultValues, { shouldDirty: true });
        }}
        fullWidth
        textAlign="center"
      />
    </div>
  ) : (
    <>
      <div className="flex items-center justify-end col-span-full">
        <Tooltip content="Remover endereço">
          <Button
            variant="quaternary"
            iconLeft="Delete"
            onClick={() => {
              setIsOpen(false);
              setValue("address", null, { shouldDirty: true });
            }}
          />
        </Tooltip>
      </div>
      <div
        className="flex items-center justify-between gap-1"
        onKeyDown={handleOnSubmitCepField}
      >
        <Input<UserFormInputs>
          label="CEP"
          name="address.cep"
          mask="cep"
          maxLength={9}
          required
          forceUnselect
        />
        <Button
          variant="quaternary"
          label="Preencher automaticamente"
          onClick={fillAddress}
          padding="none"
          state={isFetchingCep ? "loading" : undefined}
        />
      </div>
      <Input<UserFormInputs> label="Número" name="address.number" required />
      <Input<UserFormInputs> label="Rua" name="address.street" />
      <Input<UserFormInputs> label="Bairro" name="address.neighborhood" />
      <Select<UserFormInputs>
        label="Estado"
        name="address.state"
        options={STATES}
        onChange={() => setValue("address.city", "", { shouldDirty: true })}
      />
      <Select<UserFormInputs>
        label="Cidade"
        name="address.city"
        options={citiesInfo || []}
        loading={isFetchingCities}
        disabled={!selectedState}
      />
      <Input<UserFormInputs> label="Complemento" name="address.complement" />
    </>
  );
}
