import FieldArray from "@/design-system/Form/FieldArray";
import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import { addressDefaultValues } from "@/domains/users/constants";
import { UserFormInputs } from "@/domains/users/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { BACKEND_URL, CEP_LENGTH_WITH_MASK, STATES } from "../constants";
import useSafeFetch from "../hooks/useSafeFetch";
import useSnackbar from "../hooks/useSnackbar";
import { BrazilianState } from "../types";
import { City } from "../types/model";

interface ViaCepAddress {
  logradouro: string;
  bairro: string;
  ibge: string;
  uf: BrazilianState;
  erro: boolean;
}

export default function AddressFields(): ReactNode {
  const [currentValidCep, setCurrentValidCep] = useState("");

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

    setValue("address.0.street", cepInfo.logradouro, { shouldDirty: true });
    setValue("address.0.neighborhood", cepInfo.bairro, { shouldDirty: true });
    setValue("address.0.cityIbgeCode", cepInfo.ibge, {
      shouldDirty: true,
    });
    setValue("address.0.state", cepInfo.uf, {
      shouldDirty: true,
    });
  }, [cepInfo, setValue, showErrorSnackbar]);

  async function getCitiesFromState(
    state?: string
  ): Promise<City[] | undefined> {
    if (!state) return [];

    return await safeFetch(`${BACKEND_URL}/city/${state}`);
  }

  const selectedState = watch("address.0.state");

  const { data: citiesInfo, isFetching: isFetchingCities } = useQuery({
    queryKey: ["ibgeApi", selectedState],
    queryFn: ({ queryKey }) => getCitiesFromState(queryKey[1]),
    enabled: !!selectedState,
    select: (data) =>
      data?.map((city) => ({
        value: String(city.ibgeCode),
        label: city.name,
      })),
  });

  async function fillAddress() {
    const isValid = await trigger("address.0.cep");
    if (isValid) {
      const cep = getValues("address.0.cep");
      setCurrentValidCep(cep);
    }
  }

  const cepWatch = watch("address.0.cep");

  useEffect(() => {
    if (cepWatch?.length === CEP_LENGTH_WITH_MASK) {
      fillAddress();
    }
  }, [cepWatch]);

  function handleOnSubmitCepField(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      fillAddress();
    }
  }

  return (
    <FieldArray<UserFormInputs>
      name="address"
      appendText="Adicionar endereço"
      removeText="Remover endereço"
      maxLength={1}
      title="Endereço"
      appendDefaultValues={addressDefaultValues}
      render={() => (
        <>
          <div onKeyDown={handleOnSubmitCepField}>
            <Input<UserFormInputs>
              label="CEP"
              name="address.0.cep"
              mask="cep"
              maxLength={CEP_LENGTH_WITH_MASK}
              required
              forceUnselect
              disabled={isFetchingCep}
            />
          </div>
          <Input<UserFormInputs>
            label="Número"
            name="address.0.number"
            required
          />
          <Input<UserFormInputs>
            label="Rua"
            name="address.0.street"
            disabled={isFetchingCep}
          />
          <Input<UserFormInputs>
            label="Bairro"
            name="address.0.neighborhood"
            disabled={isFetchingCep}
          />
          <Select<UserFormInputs>
            label="Estado"
            name="address.0.state"
            options={STATES}
            onChange={() =>
              setValue("address.0.cityIbgeCode", "", { shouldDirty: true })
            }
            disabled={isFetchingCep}
          />
          <Select<UserFormInputs>
            label="Cidade"
            name="address.0.cityIbgeCode"
            options={citiesInfo || []}
            loading={isFetchingCities}
            disabled={!selectedState}
          />
        </>
      )}
    />
  );
}
