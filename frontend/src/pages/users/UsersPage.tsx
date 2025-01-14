import PageHeader from "@/components/PageHeader";
import Button from "@/design-system/Button";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PageGroupContainer from "@/components/PageGroupContainer";

export default function UsersPage() {
  return (
    <div className="w-full bg-light-surface h-screen">
      <PageHeader />
      <div className="w-64 bg-light-surfaceContainerLowest h-full p-4 flex flex-col gap-2">
        <PageGroupContainer label="Cadastros">
          <Button
            label="Cadastros"
            variant="quaternary"
            iconLeft={<PersonOutlinedIcon />}
            onClick={() => {}}
            state="active"
            fullWidth
          />
          <Button
            label="Veículos"
            variant="quaternary"
            iconLeft={<DirectionsCarOutlinedIcon />}
            onClick={() => {}}
            fullWidth
          />
          <Button
            label="Filiais"
            variant="quaternary"
            iconLeft={<StoreOutlinedIcon />}
            onClick={() => {}}
            fullWidth
          />
        </PageGroupContainer>
        <PageGroupContainer label="Configurações">
          <Button
            label="Perfil"
            variant="quaternary"
            iconLeft={<SettingsOutlinedIcon />}
            onClick={() => {}}
            fullWidth
          />
        </PageGroupContainer>
        <PageGroupContainer label="Outros">
          <Button
            label="Auditoria"
            variant="quaternary"
            iconLeft={<VerifiedUserOutlinedIcon />}
            onClick={() => {}}
            fullWidth
          />
        </PageGroupContainer>
      </div>
    </div>
  );
}
