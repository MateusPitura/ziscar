import { UsersFilterFormInputs } from "@/domains/users/types";

export interface Childrenable {
  children?: React.ReactNode;
}

export interface Pageable {
  page: number;
}

export type UnwrapArray<T> = T extends (infer U)[] ? U : T;

export interface DialogProps {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
  handleOpen: (state: boolean) => void;
}

export type Mask = "phone" | "cpf" | "cep" | "cnpj" | "money";

export type QueryKeys =
  | "cepApi"
  | "ibgeApi"
  | "user"
  | "users"
  | "profile"
  | "permissions"
  | "usersSearch";

export interface UsersFilter extends UsersFilterFormInputs, Pageable {}

export interface PageablePayload<T> {
  data: T[];
  total: number;
}

export type DateFormats = "yyyy-MM-dd" | "dd/MM/yyyy";

export interface Options {
  value: string;
  label: string;
}
