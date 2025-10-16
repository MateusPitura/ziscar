import { ContextHelperable } from "@/domains/contextHelpers/types";
import { BACKEND_URL } from "@/domains/global/constants";
import UserForm from "@/domains/global/forms/UserForm";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import parseAddressToCreate from "@/domains/global/utils/parseAddressToCreate";
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { userDefaultValues } from "../constants";
import { NewUserPageProvider } from "../contexts/NewUserPageContext";
import { UserFormInputs } from "../types";

export default function NewUserPage({ contextHelper }: ContextHelperable) {
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
    <NewUserPageProvider>
      <UserForm
        defaultValues={userDefaultValues}
        onSubmit={mutate}
        isPending={isPending || !!isFetching}
        headerTitle="Novo usuário"
        resource="USERS"
        action="CREATE"
        allowEditRole
        contextHelper={contextHelper}
      />
    </NewUserPageProvider>
  );
}
