import { UsersFilterFormInputs } from "@/domains/users/types";

export interface Childrenable {
  children?: React.ReactNode;
}

export interface Pageable {
  page: number;
}

export interface DialogProps {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
  handleOpen: (state: boolean) => void;
}

export interface DashBoardProps {
  id: string;
  label: string;
  value: string;
}

export type Mask = "cellphone" | "cpf" | "cep" | "cnpj";

export type QueryKeys = [
  "cepApi" | "user" | "profile" | "usersDashboard",
  ...ReadonlyArray<unknown>
];

export interface UsersFilter extends UsersFilterFormInputs, Pageable {}

export interface PageablePayload<T> {
  data: T[];
  total: number;
}
