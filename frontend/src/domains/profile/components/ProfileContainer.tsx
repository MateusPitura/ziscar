import Modal from "@/design-system/Modal";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { User } from "@/domains/global/types/User";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import { applyMask } from "@/domains/global/utils/applyMask";
import useFetch from "@/domains/global/hooks/useFetch";
import convertDate from "@/domains/global/utils/convertDate";
import EmailForm from "../forms/EmailForm";
import PasswordForm from "../forms/PasswordForm";

interface EditModalInfoProps {
  open: boolean;
  title: string;
  body: ReactElement | undefined;
  formId: string;
}

export default function ProfileContainer(): ReactElement {
  const [editModalInfo, setEditModalInfo] = useState<EditModalInfoProps>({
    open: false,
    title: "",
    body: undefined,
    formId: "",
  });
  const [user, setUser] = useState<User | undefined>(undefined);

  const { userLogged } = useGlobalContext();

  const { request } = useFetch();

  async function handleGetProfileInfo(id: string) {
    const data = await request({ path: `/users/${id}` }); // Ao implementar o back-end criar uma request que não precise de id, pegar o id passado nos headers
    setUser(data);
  }

  useEffect(() => {
    if (userLogged?.id) {
      handleGetProfileInfo(userLogged?.id);
    }
  }, [userLogged?.id]);

  function handleCloseEditModal() {
    setEditModalInfo((prev) => ({
      ...prev,
      open: false,
    }));
  }

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
    <>
      <Modal
        open={editModalInfo.open}
        onClose={handleCloseEditModal}
        title={editModalInfo.title}
        labelPrimaryBtn="Alterar"
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={handleCloseEditModal}
        formId={editModalInfo.formId}
      >
        {editModalInfo.body}
      </Modal>
      <div className="flex flex-col gap-4">
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
                  setEditModalInfo({
                    title: "Alterar email",
                    open: true,
                    body: (
                      <EmailForm
                        formId="email-form"
                        defaultValues={{ email: user?.email }}
                        onSuccessSubmit={handleCloseEditModal}
                      />
                    ),
                    formId: "email-form",
                  })
                }
              />
              <Section.Row
                label="Senha"
                value="••••••••••••"
                onEdit={() =>
                  setEditModalInfo({
                    title: "Alterar senha",
                    open: true,
                    body: (
                      <PasswordForm
                        formId="password-form"
                        onSuccessSubmit={handleCloseEditModal}
                      />
                    ),
                    formId: "password-form",
                  })
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
    </>
  );
}
