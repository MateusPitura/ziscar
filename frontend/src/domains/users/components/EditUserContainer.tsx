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
import { useEffect, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserFormInputs } from "../schemas/users";
import UserForm from "../forms/UserForm";
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
    return await safeFetch(`${baseUrl}/users/${userId}`, {
      resource: 'users',
      action: 'read'
    });
  }

  const { data: userData, isFetching } = useQuery({
    queryKey: [queryKeys.USER, userId],
    queryFn: getUser,
    select: selectUserInfo,
  });

  async function editUser(data: UserFormInputs) {
    await safeFetch(`${baseUrl}/users/${userId}`, {
      method: "patch",
      body: data,
      resource: 'users',
      action: 'update'
    });
  }

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editUser,
    onSuccess: async () => {
      showSuccessSnackbar({
        title: `Usuário ${userData?.fullName} atualizado com sucesso`,
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS_DASHBOARD],
      });
      navigate("/users");
    },
  });

  useEffect(() => {
    return () => {
      if (isSuccess) {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.USER],
        });
      }
    };
  }, [isSuccess, queryClient]);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    userData && (
      <UserForm
        defaultValues={userData}
        onSubmit={mutate}
        isPending={isPending || !!isFetchingCep}
        headerPrimaryBtnLabel="Alterar"
        headerTitle="Alterar usuário"
        onlyDirty
        resource="users"
        action="update"
      />
    )
  );
}
