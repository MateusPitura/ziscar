import { Address } from "./Address";

export interface UserLogged {
  id: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  cellphone?: string;
  cpf?: string;
  code?: string;
  birthDate?: string;
  address?: Address;
}
