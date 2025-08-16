import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { StoreFormInputs } from "../types";
import parseAddressToCreate from "@/domains/global/utils/parseAddressToCreate";
import { BACKEND_URL } from "@/domains/global/constants";
import { storeDefaultValues } from "../constants";
import StoreForm from "../forms/StoreForm";
import useSnackbar from "@/domains/global/hooks/useSnackbar";

export default function NewStoreContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const isFetching = useIsFetching({ queryKey: ["cepApi"] });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {showSuccessSnackbar} = useSnackbar()

  async function createStore(data: StoreFormInputs) {
    const { address: formAddress, ...rest } = data;

    const address = parseAddressToCreate({ address: formAddress });

    await safeFetch(`${BACKEND_URL}/store`, {
      method: "POST",
      body: {
        ...rest,
        address,
      },
      resource: "STORES",
      action: "CREATE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Loja criada com sucesso",
      });
      navigate("/stores");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });

  return (
    <StoreForm
      defaultValues={storeDefaultValues}
      onSubmit={mutate}
      isPending={isPending || !!isFetching}
      headerTitle="Nova loja"
      resource="STORES"
      action="CREATE"
    />
  );
}
