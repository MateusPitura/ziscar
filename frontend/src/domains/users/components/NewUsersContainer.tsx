import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { defaultValues } from "../constants/newUserDefaultValues";
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { baseUrl } from "@/domains/global/constants/requests";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { queryKeys } from "@/domains/global/types/queryKeys";
import UserForm from "../forms/UserForm";
import { UserFormInputs } from "../schemas/users";

export default function NewUsersContainer(): ReactElement {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetching = useIsFetching({ queryKey: [queryKeys.CEP_API] });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function createUser(data: UserFormInputs) {
    const dataFormatted = { ...data, isActive: true };

    await safeFetch({
      path: `${baseUrl}/users`,
      method: "POST",
      body: dataFormatted,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Usuário criado com sucesso",
      });
      navigate("/users");
      queryClient.invalidateQueries({ queryKey: [queryKeys.USERS] });
    },
  });

  return (
    <UserForm
      defaultValues={defaultValues}
      onSubmit={mutate}
      isPending={isPending || !!isFetching}
      headerPrimaryBtnLabel="Criar"
      headerTitle="Novo usuário"
    />
  );
}
