import Modal from "@/design-system/Modal";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { useMemo, useState, type ReactElement } from "react";
import { User } from "@/domains/global/types/User";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import safeFormat from "@/domains/global/utils/safeFormat";
import EmailForm from "../forms/EmailForm";
import PasswordForm from "../forms/PasswordForm";
import { useQuery } from "@tanstack/react-query";
import FullNameForm from "../forms/FullNameForm";
import AddressForm from "../forms/AddressForm";
import { baseUrl } from "@/domains/global/constants/requests";
import BirthDateForm from "../forms/BirthDateForm";
import CpfForm from "../forms/CpfForm";
import CodeForm from "../forms/CodeForm";
import CellphoneForm from "../forms/CellphoneForm";
import selectProfileInfo from "../utils/selectProfileInfo";
import useDialog from "../hooks/useDialog";

interface EditProfileInfoModalProps {
  title: string;
  content: ReactElement | undefined;
}

export default function ProfileContainer(): ReactElement {
  const [editProfileInfoModal, setEditProfileInfoModal] =
    useState<EditProfileInfoModalProps>({
      title: "",
      content: undefined,
    });

  const { open, closeDialog, openDialog } = useDialog();

  const { userLogged } = useGlobalContext();

  const { safeFetch } = useSafeFetch();

  async function getProfileInfo(): Promise<User> {
    return await safeFetch({ path: `${baseUrl}/users/${userLogged?.id}` }); // TODO: Ao implementar o back-end criar uma request que não precise de id, pegar o id automaticamente
  }

  const { data: profileInfo, isFetching } = useQuery({
    queryKey: ["profileInfo"],
    queryFn: getProfileInfo,
    select: selectProfileInfo,
  });

  const addressFormatted = useMemo(
    () =>
      [profileInfo?.address?.street, profileInfo?.address?.number]
        .filter(Boolean)
        .join(", "),
    [profileInfo?.address?.street, profileInfo?.address?.number]
  );

  function formatBirthDate(format: string) {
    if (profileInfo?.birthDate) {
      return safeFormat({
        date: new Date(profileInfo?.birthDate),
        format,
      });
    }
    return "";
  }

  return (
    <>
      <Modal open={open} onClose={closeDialog}>
        <Modal.Header title={editProfileInfoModal.title} />
        {editProfileInfoModal.content}
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
                isLoading={isFetching}
                onEdit={() => {
                  openDialog();
                  setEditProfileInfoModal({
                    title: "Alterar email",
                    content: (
                      <EmailForm
                        defaultValues={{ email: profileInfo?.email }}
                        handleCloseModal={closeDialog}
                      />
                    ),
                  });
                }}
              />
              <Section.Row
                label="Senha"
                value="••••••••••••"
                isLoading={isFetching}
                onEdit={() => {
                  openDialog();
                  setEditProfileInfoModal({
                    title: "Alterar senha",
                    content: <PasswordForm handleCloseModal={closeDialog} />,
                  });
                }}
              />
            </Section.Group>
            <Section.Group>
              <Section.Header title="Dados" />
              <Section.Row
                label="Nome completo"
                value={profileInfo?.fullName}
                isLoading={isFetching}
                onEdit={() => {
                  openDialog();
                  setEditProfileInfoModal({
                    title: "Alterar nome completo",
                    content: (
                      <FullNameForm
                        defaultValues={{ fullName: profileInfo?.fullName }}
                        handleCloseModal={closeDialog}
                      />
                    ),
                  });
                }}
              />
              <Section.Row
                label="Endereço"
                value={addressFormatted}
                isLoading={isFetching}
                onEdit={() => {
                  openDialog();
                  setEditProfileInfoModal({
                    title: "Alterar endereço",
                    content: (
                      <AddressForm
                        handleCloseModal={closeDialog}
                        defaultValues={{ ...profileInfo?.address }}
                      />
                    ),
                  });
                }}
              />
              <Section.Row
                label="Data de nascimento"
                value={formatBirthDate("dd/MM/yyyy")}
                isLoading={isFetching}
                onEdit={() => {
                  openDialog();
                  setEditProfileInfoModal({
                    title: "Alterar data de nascimento",
                    content: (
                      <BirthDateForm
                        handleCloseModal={closeDialog}
                        defaultValues={{
                          birthDate: formatBirthDate("yyyy-MM-dd"),
                        }}
                      />
                    ),
                  });
                }}
              />
              <Section.Row
                label="CPF"
                value={profileInfo?.cpf}
                isLoading={isFetching}
                onEdit={() => {
                  openDialog();
                  setEditProfileInfoModal({
                    title: "Alterar CPF",
                    content: (
                      <CpfForm
                        handleCloseModal={closeDialog}
                        defaultValues={{ cpf: profileInfo?.cpf }}
                      />
                    ),
                  });
                }}
              />
              <Section.Row
                label="Matrícula"
                value={profileInfo?.code}
                isLoading={isFetching}
                onEdit={() => {
                  openDialog();
                  setEditProfileInfoModal({
                    title: "Alterar matrícula",
                    content: (
                      <CodeForm
                        handleCloseModal={closeDialog}
                        defaultValues={{ code: profileInfo?.code }}
                      />
                    ),
                  });
                }}
              />
              <Section.Row
                label="Celular"
                value={profileInfo?.cellphone}
                isLoading={isFetching}
                onEdit={() => {
                  openDialog();
                  setEditProfileInfoModal({
                    title: "Alterar celular",
                    content: (
                      <CellphoneForm
                        handleCloseModal={closeDialog}
                        defaultValues={{ cellphone: profileInfo?.cellphone }}
                      />
                    ),
                  });
                }}
              />
            </Section.Group>
          </Section>
        </div>
      </div>
    </>
  );
}
