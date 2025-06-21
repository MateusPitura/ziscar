import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { useMemo, useState, type ReactElement } from "react";
import { User } from "@/domains/global/types/model";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import safeFormat from "@/domains/global/utils/safeFormat";
import EmailForm from "../forms/EmailForm";
import PasswordForm from "../forms/PasswordForm";
import { useQuery } from "@tanstack/react-query";
import FullNameForm from "../forms/FullNameForm";
import AddressForm from "../forms/AddressForm";
import BirthDateForm from "../forms/BirthDateForm";
import CpfForm from "../forms/CpfForm";
import CodeForm from "../forms/CodeForm";
import CellphoneForm from "../forms/CellphoneForm";
import selectProfileInfo from "../utils/selectProfileInfo";
import useDialog from "../../global/hooks/useDialog";
import EditProfileModal from "./EditProfileModal";
import { EditProfile } from "../types";
import { BACKEND_URL } from "@/domains/global/constants";
import { DateFormats } from "@/domains/global/types";

export default function ProfileContainer(): ReactElement {
  const [editProfileInfo, setEditProfileInfo] = useState<EditProfile>({
    title: "",
    content: undefined,
  });

  const dialog = useDialog();

  const { safeFetch } = useSafeFetch();

  async function getProfileInfo(): Promise<User> {
    return await safeFetch(`${BACKEND_URL}/profile`);
  }

  const { data: profileInfo, isFetching } = useQuery({
    queryKey: ["profile"],
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

  function formatBirthDate(format: DateFormats) {
    if (profileInfo?.birthDate) {
      return safeFormat({
        date: profileInfo.birthDate,
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
                value={profileInfo?.cellPhone}
                isLoading={isFetching}
                onEdit={() => {
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar celular",
                    content: (
                      <CellphoneForm
                        defaultValues={{ cellPhone: profileInfo?.cellPhone }}
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
