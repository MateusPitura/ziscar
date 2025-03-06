import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import UserForm from "../forms/UserForm";
import { UserFormInputs } from "../types";
import { BASE_URL } from "@/domains/global/constants";
import { userDefaultValues } from "../constants";

export default function NewUsersContainer(): ReactElement {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetching = useIsFetching({ queryKey: ["cepApi"] });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function createUser(data: UserFormInputs) {
    await safeFetch(`${BASE_URL}/user`, {
      method: "POST",
      body: data,
      resource: "USERS",
      action: "CREATE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Confira o email para ativar a conta",
      });
      navigate("/users");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["usersDashboard"] });
    },
  });

  return (
    <UserForm
      defaultValues={userDefaultValues}
      onSubmit={mutate}
      isPending={isPending || !!isFetching}
      headerPrimaryBtnLabel="Criar"
      headerTitle="Novo usuário"
      resource="USERS"
      action="CREATE"
      onlyDirty
    />
  );
}
