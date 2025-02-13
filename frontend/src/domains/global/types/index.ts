export interface Childrenable {
  children?: React.ReactNode;
}

export interface Dialog {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
  handleOpen: (state: boolean) => void;
}

export interface DashBoard {
  id: string;
  label: string;
  value: string;
}

export interface Pageable {
  page: number;
}

export type Mask = "cellphone" | "cpf" | "cep" | "cnpj";

export type QueryKeys = [
  "cepApi" | "profileInfo" | "users" | "user" | "usersDashboard",
  ...ReadonlyArray<unknown>
];
