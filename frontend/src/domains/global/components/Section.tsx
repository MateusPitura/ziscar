import Button from "@/design-system/Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Loading from "@/design-system/Loading";
import { Childrenable } from "../types/components";

function Container({ children }: Childrenable) {
  return <div className="flex flex-col gap-4 w-[56rem]">{children}</div>;
}

function Group({ children }: Childrenable) {
  return (
    <div className="bg-light-surfaceContainerLowest rounded-md overflow-hidden">
      {children}
    </div>
  );
}

interface SectionTitleProps {
  title: string;
}

function Title({ title }: SectionTitleProps) {
  return (
    <span className="text-light-onSurface text-title-medium">{title}</span>
  );
}

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <div className="bg-light-tertiaryContainer p-4">
      <span className="text-body-large text-light-onTertiaryContainer">
        {title}
      </span>
    </div>
  );
}

interface SectionRowProps {
  label: string;
  value?: string;
  onEdit: () => void;
  isLoading?: boolean;
}

function Row({ label, value, onEdit, isLoading = false }: SectionRowProps) {
  return (
    <div className="p-4 border-b flex last:border-none">
      <div className="w-full flex items-center">
        <span className="text-light-onSurface flex-1 text-body-large">
          {label}
        </span>
        <Loading
          className="flex-1 text-light-onSurface text-body-large line-clamp-1"
          isLoading={isLoading}
        >
          {value}
        </Loading>
      </div>
      <Button
        variant="quaternary"
        onClick={onEdit}
        state={isLoading ? "loading" : undefined}
        iconLeft={<EditOutlinedIcon />}
      />
    </div>
  );
}

const Section = Object.assign(Container, { Title, Group, Header, Row });

export default Section;
