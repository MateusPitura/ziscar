import Modal from "@/design-system/Modal";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { User } from "@/domains/global/types/User";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import { applyMask } from "@/domains/global/utils/applyMask";
import useFetch from "@/domains/global/hooks/useFetch";
import convertDate from "@/domains/global/utils/convertDate";
import EmailForm from "../forms/EmailForm";

interface EditModalInfoProps {
  open: boolean;
  title: string;
  successSnackbarTitle: string;
  body: ReactElement | undefined;
  onSubmit: () => void;
}

export default function ProfileContainer(): ReactElement {
  const [editModalInfo, setEditModalInfo] = useState<EditModalInfoProps>({
    open: false,
    title: "",
    successSnackbarTitle: "",
    body: undefined,
    onSubmit: () => {},
  });
  const [user, setUser] = useState<User | undefined>(undefined);

  const { userLogged } = useGlobalContext();

  const { showSuccessSnackbar } = useSnackbar();
  const { request } = useFetch();

  function handleCloseEditModal() {
    setEditModalInfo((prev) => ({
      ...prev,
      open: false,
    }));
  }

  async function handleGetProfileInfo(id: string) {
    const data = await request({ path: `/users/${id}` }); // Ao implementar o back-end criar uma request que não precise de id, pegar o id passado nos headers
    setUser(data);
  }

  useEffect(() => {
    if (userLogged?.id) {
      handleGetProfileInfo(userLogged?.id);
    }
  }, [userLogged?.id]);

  const birthDateFormatted = useMemo(
    () =>
      user?.birthDate
        ? convertDate({ date: new Date(user?.birthDate), format: "dd/MM/yyyy" })
        : "",
    [user?.birthDate]
  );

  const addressFormatted = useMemo(() => {
    if (user?.address?.street && user?.address?.number) {
      return `${user?.address?.street}, ${user?.address?.number}`;
    }
    return "";
  }, [user?.address?.street, user?.address?.number]);

  return (
    <div className="flex flex-col gap-4">
      <Modal
        open={editModalInfo.open}
        onClose={handleCloseEditModal}
        title={editModalInfo.title}
        labelPrimaryBtn="Salvar"
        onClickPrimaryBtn={() => {
          showSuccessSnackbar({
            title: editModalInfo.successSnackbarTitle,
          });
        }}
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={handleCloseEditModal}
      >
        {editModalInfo.body}
      </Modal>
      <PageHeader title="Perfil" />
      <div className="flex justify-center">
        <Section>
          <Section.Title title="Informações Pessoais" />
          <Section.Group>
            <Section.Header title="Conta" />
            <Section.Row
              label="Email"
              value={user?.email}
              onEdit={() =>
                setEditModalInfo((prev) => ({
                  ...prev,
                  title: "Alterar email",
                  successSnackbarTitle: "Email alterado com sucesso",
                  open: true,
                  body: <EmailForm />,
                }))
              }
            />
            <Section.Row
              label="Senha"
              value="••••••••••••"
              onEdit={() =>
                setEditModalInfo((prev) => ({
                  ...prev,
                  title: "Alterar senha",
                  successSnackbarTitle: "Senha alterada com sucesso",
                  open: true,
                  body: <div>Senha</div>,
                }))
              }
            />
          </Section.Group>
          <Section.Group>
            <Section.Header title="Dados" />
            <Section.Row
              label="Nome completo"
              value={user?.fullName}
              onEdit={() => {}}
            />
            <Section.Row
              label="Endereço"
              value={addressFormatted}
              onEdit={() => {}}
            />
            <Section.Row
              label="Data de nascimento"
              value={birthDateFormatted}
              onEdit={() => {}}
            />
            <Section.Row
              label="CPF"
              value={applyMask(user?.cpf, "CPF")}
              onEdit={() => {}}
            />
            <Section.Row
              label="Matrícula"
              value={user?.code}
              onEdit={() => {}}
            />
            <Section.Row
              label="Celular"
              value={applyMask(user?.cellphone, "CELLPHONE")}
              onEdit={() => {}}
            />
          </Section.Group>
        </Section>
      </div>
    </div>
  );
}
