import Modal from "@/design-system/Modal";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useState, type ReactElement } from "react";

export default function ProfileContainer(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const { showSuccessSnackbar } = useSnackbar();

  function handleOpen(open: boolean) {
    setIsOpen(open);
  }

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
              value="john.doe@gmail.com"
              onEdit={() => handleOpen(true)}
            />
            <Section.Row label="Senha" value="************" onEdit={() => {}} />
          </Section.Group>
          <Section.Group>
            <Section.Header title="Dados" />
            <Section.Row
              label="Nome completo"
              value="John Doe"
              onEdit={() => {}}
            />
            <Section.Row
              label="Endereço"
              value="Av. General Carlos Cavalcanti, 4748"
              onEdit={() => {}}
            />
            <Section.Row
              label="Data de nascimento"
              value="01/01/1970"
              onEdit={() => {}}
            />
            <Section.Row label="CPF" value="111.222.333-44" onEdit={() => {}} />
            <Section.Row label="Matrícula" value="22222222" onEdit={() => {}} />
            <Section.Row
              label="Celular"
              value="(42) 9 8888-4444"
              onEdit={() => {}}
            />
          </Section.Group>
          <Section.Title title="Preferências" />
          <Section.Group>
            <Section.Header title="Notificações" />
            <Section.Row label="Email" value="Ativado" onEdit={() => {}} />
            <Section.Row label="SMS" value="Desativado" onEdit={() => {}} />
          </Section.Group>
          <Section.Group>
            <Section.Header title="Sistema" />
            <Section.Row
              label="Modo escuro"
              value="Desativado"
              onEdit={() => {}}
            />
            <Section.Row label="Idioma" value="Português" onEdit={() => {}} />
          </Section.Group>
        </Section>
      </div>
    </div>
  );
}
