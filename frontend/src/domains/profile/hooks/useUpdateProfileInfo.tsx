import { baseUrl } from "@/domains/global/constants/requests";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { queryKeys } from "@/domains/global/types/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseUpdateProfileInfoProperties {
  onSuccessSubmit: () => void;
  snackbarTitle: string;
  shouldInvalidateQuery?: boolean;
}

export default function useUpdateProfileInfo<T>({
  onSuccessSubmit,
  snackbarTitle,
  shouldInvalidateQuery = true,
}: UseUpdateProfileInfoProperties) {
  const { safeFetch } = useSafeFetch();
  const { userLogged } = useGlobalContext();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function updateProfileInfo(data: T) {
    await safeFetch(
      `${baseUrl}/users/${userLogged?.id}`, //  TODO: Ao implementar o back-end criar uma request que não precise de id, pegar o id automaticamente
      {
        method: "patch",
        body: data,
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: () => {
      if (shouldInvalidateQuery) {
        queryClient.invalidateQueries({ queryKey: [queryKeys.PROFILE_INFO] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.USERS] });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.USER, userLogged?.id],
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.USERS_DASHBOARD],
        });
      }
      showSuccessSnackbar({
        title: snackbarTitle,
      });
      onSuccessSubmit();
    },
  });

  return { mutate, isPending };
}
