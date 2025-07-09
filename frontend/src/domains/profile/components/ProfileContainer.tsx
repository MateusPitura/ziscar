import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { useState, type ReactElement } from "react";
import PasswordForm from "../forms/PasswordForm";
import useDialog from "@/domains/global/hooks/useDialog";
import EditProfileModal from "./EditProfileModal";
import { EditProfile } from "../types";
import { useNavigate } from "react-router-dom";

export default function ProfileContainer(): ReactElement {
  const [editProfileInfo, setEditProfileInfo] = useState<EditProfile>({
    title: "",
    content: undefined,
  });

  const navigate = useNavigate();

  const dialog = useDialog();

  return (
    <>
      <EditProfileModal {...editProfileInfo} {...dialog} />
      <div className="flex flex-col gap-4">
        <PageHeader title="Perfil" />
        <div className="flex justify-center">
          <Section>
            <Section.Title title="Seus dados" />
            <Section.Group>
              <Section.Header title="Conta" />
              <Section.Row
                label="Informações pessoais"
                onEdit={() => {
                  navigate("/profile/edit");
                  // dialog.openDialog();
                  // setEditProfileInfo({
                  //   title: "Alterar email",
                  //   content: (
                  //     <EmailForm
                  //       defaultValues={{ email: profileInfo?.email }}
                  //     />
                  //   ),
                  // });
                }}
              />
              <Section.Row
                label="Senha"
                onEdit={() => {
                  dialog.openDialog();
                  setEditProfileInfo({
                    title: "Alterar senha",
                    content: <PasswordForm />,
                  });
                }}
              />
            </Section.Group>
            {/* <Section.Group>
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
            </Section.Group> */}
          </Section>
        </div>
      </div>
    </>
  );
}
