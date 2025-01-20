import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface UseUpdateProfileInfoProperties {
  onSuccessSubmit: () => void;
  snackbarTitle: string;
}

export default function useUpdateProfileInfo<T>({
  onSuccessSubmit,
  snackbarTitle,
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

  const mutation = useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileInfo"] });
      showSuccessSnackbar({
        title: snackbarTitle,
      });
      onSuccessSubmit();
    },
  });

  const handleSubmit = useCallback(
    (data: T) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  return { handleSubmit };
}
