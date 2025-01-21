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
import AddressForm from "../forms/AddressForm";
import { baseUrl } from "@/domains/global/constants/requests";
import BirthDateForm from "../forms/BirthDateForm";

interface EditProfileInfoModalProps {
  open: boolean;
  title: string;
  content: ReactElement | undefined;
}

export default function ProfileContainer(): ReactElement {
  const [editProfileInfoModal, setEditProfileInfoModal] =
    useState<EditProfileInfoModalProps>({
      open: false,
      title: "",
      content: undefined,
    });

  const { userLogged } = useGlobalContext();

  const { safeFetch } = useSafeFetch();

  async function getProfileInfo(): Promise<User> {
    return await safeFetch({ path: `${baseUrl}/users/${userLogged?.id}` }); // TODO: Ao implementar o back-end criar uma request que não precise de id, pegar o id automaticamente
  }

  const { data: profileInfo, isFetching } = useQuery({
    queryKey: ["profileInfo"],
    queryFn: getProfileInfo,
  });

  function handleCloseEditProfileInfoModal() {
    setEditProfileInfoModal((prev) => ({
      ...prev,
      open: false,
    }));
  }

  const addressFormatted = useMemo(() => {
    if (profileInfo?.address?.street && profileInfo?.address?.number) {
      return `${profileInfo?.address?.street}, ${profileInfo?.address?.number}`;
    }
    return "";
  }, [profileInfo?.address?.street, profileInfo?.address?.number]);

  function handleBirthDate(format: string) {
    if (profileInfo?.birthDate) {
      return {
        birthDate: safeFormat({
          date: new Date(profileInfo?.birthDate),
          format,
        }),
      };
    }
    return {
      birthDate: "",
    };
  }

  return (
    <>
      <Modal
        open={editProfileInfoModal.open}
        onClose={handleCloseEditProfileInfoModal}
      >
        <Modal.Header
          title={editProfileInfoModal.title}
          onClose={handleCloseEditProfileInfoModal}
        />
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
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar email",
                    open: true,
                    content: (
                      <EmailForm
                        defaultValues={{ email: profileInfo?.email }}
                        handleCloseModal={handleCloseEditProfileInfoModal}
                      />
                    ),
                  })
                }
              />
              <Section.Row
                label="Senha"
                value="••••••••••••"
                isLoading={isFetching}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar senha",
                    open: true,
                    content: (
                      <PasswordForm
                        handleCloseModal={handleCloseEditProfileInfoModal}
                      />
                    ),
                  })
                }
              />
            </Section.Group>
            <Section.Group>
              <Section.Header title="Dados" />
              <Section.Row
                label="Nome completo"
                value={profileInfo?.fullName}
                isLoading={isFetching}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar nome completo",
                    open: true,
                    content: (
                      <FullNameForm
                        handleCloseModal={handleCloseEditProfileInfoModal}
                        defaultValues={{ fullName: profileInfo?.fullName }}
                      />
                    ),
                  })
                }
              />
              <Section.Row
                label="Endereço"
                value={addressFormatted}
                isLoading={isFetching}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar endereço",
                    open: true,
                    content: (
                      <AddressForm
                        handleCloseModal={handleCloseEditProfileInfoModal}
                        defaultValues={{ ...profileInfo?.address }}
                      />
                    ),
                  })
                }
              />
              <Section.Row
                label="Data de nascimento"
                value={handleBirthDate("dd/MM/yyyy").birthDate}
                isLoading={isFetching}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar data de nascimento",
                    open: true,
                    content: (
                      <BirthDateForm
                        handleCloseModal={handleCloseEditProfileInfoModal}
                        defaultValues={handleBirthDate("yyyy-MM-dd")}
                      />
                    ),
                  })
                }
              />
              <Section.Row
                label="CPF"
                value={applyMask(profileInfo?.cpf, "CPF")}
                isLoading={isFetching}
                onEdit={() => {}}
              />
              <Section.Row
                label="Matrícula"
                value={profileInfo?.code}
                isLoading={isFetching}
                onEdit={() => {}}
              />
              <Section.Row
                label="Celular"
                value={applyMask(profileInfo?.cellphone, "CELLPHONE")}
                isLoading={isFetching}
                onEdit={() => {}}
              />
            </Section.Group>
          </Section>
        </div>
      </div>
    </>
  );
}
