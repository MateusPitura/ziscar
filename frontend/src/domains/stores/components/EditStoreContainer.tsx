import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { Store } from "@/domains/global/types/model";
import {
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoreFormInputs } from "../types";
import parseAddressToUpdate from "@/domains/global/utils/parseAddressToUpdate";
import Spinner from "@/design-system/Spinner";
import StoreForm from "../forms/StoreForm";
import selectStoreInfo from "../utils/selectStoreInfo";

export default function EditStoreContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetchingCep = useIsFetching({ queryKey: ["cepApi"] });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { storeId } = useParams();

  async function getStore(): Promise<Store> {
    return await safeFetch(`${BACKEND_URL}/store/${storeId}`, {
      resource: "STORES",
      action: "READ",
    });
  }

  const { data: storeData, isFetching } = useQuery({
    queryKey: ["stores", storeId],
    queryFn: getStore,
    select: selectStoreInfo,
  });

  async function editStore(data: StoreFormInputs) {
    const { address, ...rest } = data;

    const addressPayload = parseAddressToUpdate({
      newAddress: address,
      oldAddress: storeData?.address,
    });

    await safeFetch(`${BACKEND_URL}/store/${storeId}`, {
      method: "PATCH",
      body: {
        ...rest,
        ...(addressPayload && { address: addressPayload }),
      },
      resource: "STORES",
      action: "UPDATE",
    });
  }

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editStore,
    onSuccess: async () => {
      showSuccessSnackbar({
        title: `Loja ${storeData?.name} atualizada com sucesso`,
      });
      queryClient.invalidateQueries({
        queryKey: ["stores"],
      });
      navigate("/stores");
    },
  });

  useEffect(
    () => () => {
      if (isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["stores", storeId],
        });
      }
    },
    [isSuccess, queryClient, storeId]
  );

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    storeData && (
      <StoreForm
        defaultValues={storeData}
        onSubmit={mutate}
        isPending={isPending || !!isFetchingCep}
        headerTitle="Alterar usuário"
        isEdit
        resource="STORES"
        action="UPDATE"
      />
    )
  );
}
