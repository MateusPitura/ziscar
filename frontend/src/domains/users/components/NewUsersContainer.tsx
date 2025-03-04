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
    const dataFormatted = { ...data, isActive: true };

    await safeFetch(`${BASE_URL}/user`, {
      method: "POST",
      body: dataFormatted,
      resource: "users",
      action: "create",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Usuário criado com sucesso",
      });
      navigate("/users");
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
      resource="users"
      action="create"
      onlyDirty
    />
  );
}
