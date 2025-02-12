import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { useMemo, useState, type ReactElement } from "react";
import { User } from "@/domains/global/types/user";
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
import useDialog from "../../global/hooks/useDialog";
import EditProfileModal from "./EditProfileModal";
import { EditProfile } from "../types/editProfile";
import { queryKeys } from "@/domains/global/types/queryKeys";

export default function ProfileContainer(): ReactElement {
  const [editProfileInfo, setEditProfileInfo] = useState<EditProfile>({
    title: "",
    content: undefined,
  });

  const dialog = useDialog();

  const { userLogged } = useGlobalContext();

  const { safeFetch } = useSafeFetch();

  async function getProfileInfo(): Promise<User> {
    return await safeFetch(`${baseUrl}/users/${userLogged?.id}`); // TODO: Ao implementar o back-end criar uma request que não precise de id, pegar o id automaticamente
  }

  const { data: profileInfo, isFetching } = useQuery({
    queryKey: [queryKeys.PROFILE_INFO],
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
      <EditProfileModal {...editProfileInfo} {...dialog} />
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
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar email",
                    content: (
                      <EmailForm
                        defaultValues={{ email: profileInfo?.email }}
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
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar senha",
                    content: <PasswordForm />,
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
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar nome completo",
                    content: (
                      <FullNameForm
                        defaultValues={{ fullName: profileInfo?.fullName }}
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
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar endereço",
                    content: (
                      <AddressForm
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
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar data de nascimento",
                    content: (
                      <BirthDateForm
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
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar CPF",
                    content: (
                      <CpfForm defaultValues={{ cpf: profileInfo?.cpf }} />
                    ),
                  });
                }}
              />
              <Section.Row
                label="Matrícula"
                value={profileInfo?.code}
                isLoading={isFetching}
                onEdit={() => {
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar matrícula",
                    content: (
                      <CodeForm defaultValues={{ code: profileInfo?.code }} />
                    ),
                  });
                }}
              />
              <Section.Row
                label="Celular"
                value={profileInfo?.cellphone}
                isLoading={isFetching}
                onEdit={() => {
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar celular",
                    content: (
                      <CellphoneForm
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
