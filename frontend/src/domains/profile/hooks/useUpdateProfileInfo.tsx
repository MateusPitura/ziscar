import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
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
    await safeFetch({
      path: `/users/${userLogged?.id}`, //  TODO: Ao implementar o back-end criar uma request que não precise de id, pegar o id automaticamente
      method: "PATCH",
      body: data,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: () => {
      if (shouldInvalidateQuery) {
        queryClient.invalidateQueries({ queryKey: ["profileInfo"] });
      }
      showSuccessSnackbar({
        title: snackbarTitle,
      });
      onSuccessSubmit();
    },
  });

  return { mutate, isPending };
}
