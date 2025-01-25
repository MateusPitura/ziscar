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
    select: selectProfileInfo,
  });

  function handleCloseEditProfileInfoModal() {
    setEditProfileInfoModal((prev) => ({
      ...prev,
      open: false,
    }));
  }

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
      <Modal
        open={editProfileInfoModal.open}
        onClose={handleCloseEditProfileInfoModal}
      >
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
                value={formatBirthDate("dd/MM/yyyy")}
                isLoading={isFetching}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar data de nascimento",
                    open: true,
                    content: (
                      <BirthDateForm
                        handleCloseModal={handleCloseEditProfileInfoModal}
                        defaultValues={{
                          birthDate: formatBirthDate("yyyy-MM-dd"),
                        }}
                      />
                    ),
                  })
                }
              />
              <Section.Row
                label="CPF"
                value={profileInfo?.cpf}
                isLoading={isFetching}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar CPF",
                    open: true,
                    content: (
                      <CpfForm
                        handleCloseModal={handleCloseEditProfileInfoModal}
                        defaultValues={{ cpf: profileInfo?.cpf }}
                      />
                    ),
                  })
                }
              />
              <Section.Row
                label="Matrícula"
                value={profileInfo?.code}
                isLoading={isFetching}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar matrícula",
                    open: true,
                    content: (
                      <CodeForm
                        handleCloseModal={handleCloseEditProfileInfoModal}
                        defaultValues={{ code: profileInfo?.code }}
                      />
                    ),
                  })
                }
              />
              <Section.Row
                label="Celular"
                value={profileInfo?.cellphone}
                isLoading={isFetching}
                onEdit={() =>
                  setEditProfileInfoModal({
                    title: "Alterar celular",
                    open: true,
                    content: (
                      <CellphoneForm
                        handleCloseModal={handleCloseEditProfileInfoModal}
                        defaultValues={{ cellphone: profileInfo?.cellphone }}
                      />
                    ),
                  })
                }
              />
            </Section.Group>
          </Section>
        </div>
      </div>
    </>
  );
}
