import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import {
  useIsFetching,
  useQueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../forms/UserForm";
import selectUserInfo from "../utils/selectUserInfo";
import Spinner from "@/design-system/Spinner";
import { BACKEND_URL } from "@/domains/global/constants";
import { User } from "@/domains/global/types/model";
import { UserFormInputs } from "../types";

export default function EditUserContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetchingCep = useIsFetching({ queryKey: ["cepApi"] });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useParams();

  async function getUser(): Promise<User> {
    return await safeFetch(`${BACKEND_URL}/user/${userId}`, {
      resource: "USERS",
      action: "READ",
    });
  }

  const { data: userData, isFetching } = useQuery({
    queryKey: ["user", userId],
    queryFn: getUser,
    select: selectUserInfo,
  });

  async function editUser(data: UserFormInputs) {
    await safeFetch(`${BACKEND_URL}/user/${userId}`, {
      method: "PATCH",
      body: data,
      resource: "USERS",
      action: "UPDATE",
    });
  }

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editUser,
    onSuccess: async () => {
      showSuccessSnackbar({
        title: `Usuário ${userData?.fullName} atualizado com sucesso`,
      });
      queryClient.invalidateQueries({
        queryKey: ["usersDashboard"],
      });
      navigate("/users");
    },
  });

  useEffect(() => {
    return () => {
      if (isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["user"],
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
        resource="USERS"
        action="UPDATE"
      />
    )
  );
}
