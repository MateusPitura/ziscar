import Modal from "@/design-system/Modal";
import { baseUrl } from "@/domains/global/constants/requests";
import { BLANK } from "@/domains/global/constants/text";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { Dialog } from "@/domains/global/types/components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { DisableUser } from "../types/disableUser";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import { queryKeys } from "@/domains/global/types/queryKeys";

interface DisableUserModalProps extends DisableUser, Dialog {}

export default function DisableUserModal({
  userId,
  userName,
  ...dialog
}: DisableUserModalProps): ReactElement {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { handleUsersFilter } = useGlobalContext();

  async function disableUser() {
    await safeFetch({
      path: `${baseUrl}/users/${userId}`,
      method: "PATCH",
      body: { isActive: false },
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: disableUser,
    onSuccess: () => {
      handleUsersFilter({ page: 1 });
      queryClient.invalidateQueries({ queryKey: [queryKeys.USERS] });
      showSuccessSnackbar({
        title: `Usuário ${userName} desativado com sucesso`,
      });
      dialog.closeDialog();
    },
  });

  return (
    <Modal {...dialog}>
      <Modal.Header title="Desativar usuário" />
      <Modal.Body>
        <span className="text-body-medium text-light-onSurface">
          Tem certeza que deseja desativar o usuário
          <span className="font-bold">
            {BLANK}
            {userName}
          </span>
          ? Ao desativar ele não poderá mais acessar o sistema
        </span>
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Desativar"
        onClickPrimaryBtn={mutate}
        primaryBtnState={isPending ? "loading" : "red"}
      />
    </Modal>
  );
}
