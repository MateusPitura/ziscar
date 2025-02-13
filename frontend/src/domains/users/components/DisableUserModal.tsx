import Modal from "@/design-system/Modal";
import { BASE_URL, BLANK } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { DisableUser } from "../types";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import { Dialog } from "@/domains/global/types";

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
    await safeFetch(`${BASE_URL}/users/${userId}`, {
      method: "patch",
      body: { isActive: false },
      resource: "users",
      action: "delete",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: disableUser,
    onSuccess: () => {
      handleUsersFilter({ page: 1 });
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
        primaryBtResource="users"
        primaryBtnAction="delete"
      />
    </Modal>
  );
}
