import { BACKEND_URL } from "@/domains/global/constants";
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
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function updateProfileInfo(data: T) {
    await safeFetch(
      `${BACKEND_URL}/profile`,
      {
        method: "PATCH",
        body: data,
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: () => {
      if (shouldInvalidateQuery) {
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });
        queryClient.invalidateQueries({
          queryKey: ["usersDashboard"],
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
