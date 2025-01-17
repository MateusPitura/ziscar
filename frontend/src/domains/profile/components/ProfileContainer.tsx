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

export default function ProfileContainer(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const { userLogged } = useGlobalContext();

  const { showSuccessSnackbar } = useSnackbar();
  const { request } = useFetch();

  function handleOpen(open: boolean) {
    setIsOpen(open);
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
        open={isOpen}
        onClose={() => handleOpen(false)}
        title="Editar email"
        labelPrimaryBtn="Salvar"
        onClickPrimaryBtn={() => {
          showSuccessSnackbar({
            title: "Email alterado com sucesso",
            description: "Seu email foi alterado com sucesso",
            actionLabel: "Desfazer",
            onActionClick: () => {},
          });
        }}
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={() => {}}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio animi
        eius voluptatibus velit fugit mollitia aspernatur sequi accusamus esse
        cum, pariatur quam fuga modi quis provident neque aliquam quo eligendi
        atque magni cupiditate ipsum. Optio eaque exercitationem fugit, harum ab
        assumenda impedit quia. A magnam repudiandae libero sint sunt. Commodi?
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
              onEdit={() => handleOpen(true)}
            />
            <Section.Row label="Senha" value="••••••••••••" onEdit={() => {}} />
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
