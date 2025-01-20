import Modal from "@/design-system/Modal";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { useMemo, useState, type ReactElement } from "react";
import { User } from "@/domains/global/types/User";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import { applyMask } from "@/domains/global/utils/applyMask";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import safeFormat from "@/domains/global/utils/safeFormat";
import EmailForm from "../forms/EmailForm";
import PasswordForm from "../forms/PasswordForm";
import { useQuery } from "@tanstack/react-query";
import FullNameForm from "../forms/FullNameForm";

interface EditProfileInfoModalProps {
  open: boolean;
  title: string;
  body: ReactElement | undefined;
  formId: string;
}

export default function ProfileContainer(): ReactElement {
  const [editProfileInfoModal, setEditProfileInfoModal] =
    useState<EditProfileInfoModalProps>({
      open: false,
      title: "",
      body: undefined,
      formId: "",
    });

  const { userLogged } = useGlobalContext();

  const { safeFetch } = useSafeFetch();

  async function getProfileInfo(): Promise<User> {
    return await safeFetch({ path: `/users/${userLogged?.id}` }); // TODO: Ao implementar o back-end criar uma request que não precise de id, pegar o id automaticamente
  }

  const { data: profileInfo } = useQuery({
    queryKey: ["profileInfo"],
    queryFn: getProfileInfo,
  });

  function handleCloseEditModal() {
    setEditProfileInfoModal((prev) => ({
      ...prev,
      open: false,
    }));
  }

  const birthDateFormatted = useMemo(
    () =>
      profileInfo?.birthDate
        ? safeFormat({
            date: new Date(profileInfo?.birthDate),
            format: "dd/MM/yyyy",
          })
        : "",
    [profileInfo?.birthDate]
  );

  const addressFormatted = useMemo(() => {
    if (profileInfo?.address?.street && profileInfo?.address?.number) {
      return `${profileInfo?.address?.street}, ${profileInfo?.address?.number}`;
    }
    return "";
  }, [profileInfo?.address?.street, profileInfo?.address?.number]);

  return (
    <>
      <Modal
        open={editProfileInfoModal.open}
        onClose={handleCloseEditModal}
        title={editProfileInfoModal.title}
        labelPrimaryBtn="Alterar"
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={handleCloseEditModal}
        formId={editProfileInfoModal.formId}
      >
        {editProfileInfoModal.body}
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
                value={profileInfo?.email}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar email",
                    open: true,
                    body: (
                      <EmailForm
                        formId="email-form"
                        defaultValues={{ email: profileInfo?.email }}
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
                  setEditProfileInfoModal({
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
                value={profileInfo?.fullName}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar nome completo",
                    open: true,
                    body: (
                      <FullNameForm
                        formId="full-name-form"
                        onSuccessSubmit={handleCloseEditModal}
                        defaultValues={{ fullName: profileInfo?.fullName }}
                      />
                    ),
                    formId: "full-name-form",
                  })
                }
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
                value={applyMask(profileInfo?.cpf, "CPF")}
                onEdit={() => {}}
              />
              <Section.Row
                label="Matrícula"
                value={profileInfo?.code}
                onEdit={() => {}}
              />
              <Section.Row
                label="Celular"
                value={applyMask(profileInfo?.cellphone, "CELLPHONE")}
                onEdit={() => {}}
              />
            </Section.Group>
          </Section>
        </div>
      </div>
    </>
  );
}
