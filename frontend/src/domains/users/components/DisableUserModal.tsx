import Modal from "@/design-system/Modal";
import { baseUrl } from "@/domains/global/constants/requests";
import { BLANK } from "@/domains/global/constants/text";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactElement } from "react";

interface DisableUserModalProperties {
  open: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
}

export default function DisableUserModal({
  open,
  onClose,
  userId,
  userName,
}: DisableUserModalProperties): ReactElement {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function updateProfileInfo() {
    await safeFetch({
      path: `${baseUrl}/users/${userId}`,
      method: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessSnackbar({
        title: `Usuário ${userName} desativado com sucesso`,
      });
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header title="Desativar usuário" onClose={onClose} />
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
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={onClose}
        onClickPrimaryBtn={mutate}
        primaryBtnState={isPending ? "loading" : "red"}
      />
    </Modal>
  );
}
