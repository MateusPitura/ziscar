import { baseUrl } from "@/domains/global/constants/requests";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { queryKeys } from "@/domains/global/types/queryKeys";
import {
  useIsFetching,
  useQueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserFormInputs } from "../schemas/users";
import UserForm from "./UserForm";
import { User } from "@/domains/global/types/user";
import selectUserInfo from "../utils/selectUserInfo";
import Spinner from "@/design-system/Spinner";

export default function EditUserContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetchingCep = useIsFetching({ queryKey: [queryKeys.CEP_API] });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useParams();

  async function getUser(): Promise<User> {
    return await safeFetch({
      path: `${baseUrl}/users/${userId}`,
    });
  }

  const { data, isFetching } = useQuery({
    queryKey: [queryKeys.USER, userId],
    queryFn: getUser,
    select: selectUserInfo,
  });

  async function editUser(data: UserFormInputs) {
    const dataFormatted = data;

    await safeFetch({
      path: `${baseUrl}/users/${userId}`,
      method: "PATCH",
      body: dataFormatted,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: editUser,
    onSuccess: async () => {
      showSuccessSnackbar({
        title: `Usuário ${data?.fullName} atualizado com sucesso`,
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USER],
      });
      navigate("/users");
    },
  });

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    data && (
      <UserForm
        defaultValues={data}
        onSubmit={mutate}
        isPending={isPending || !!isFetchingCep}
        headerPrimaryBtnLabel="Alterar"
        headerTitle="Alterar usuário"
      />
    )
  );
}
