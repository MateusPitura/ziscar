import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import UserForm from "@/domains/global/forms/UserForm";
import { UserFormInputs } from "../types";
import { BACKEND_URL } from "@/domains/global/constants";
import { userDefaultValues } from "../constants";
import parseAddressToCreate from "@/domains/global/utils/parseAddressToCreate";

export default function NewUsersContainer(): ReactElement {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetching = useIsFetching({ queryKey: ["cepApi"] });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function createUser(data: UserFormInputs) {
    const { address: formAddress, ...rest } = data;

    const address = parseAddressToCreate({ address: formAddress });

    await safeFetch(`${BACKEND_URL}/user`, {
      method: "POST",
      body: {
        ...rest,
        address,
      },
      resource: "USERS",
      action: "CREATE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Um email será enviado",
        description: "Confira também a caixa de spam",
      });
      navigate("/users");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <UserForm
      defaultValues={userDefaultValues}
      onSubmit={mutate}
      isPending={isPending || !!isFetching}
      headerTitle="Novo usuário"
      resource="USERS"
      action="CREATE"
      allowEditRole
    />
  );
}
