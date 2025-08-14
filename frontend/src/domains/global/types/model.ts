import { Action, Resource } from "@shared/types";

export type Address = {
  cep: string;
  number: string;
  street?: string;
  neighborhood?: string;
  city?: {
    ibgeCode: number;
    state: string;
    name: string;
  };
};

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  cpf?: string;
  address?: Address;
  archivedAt?: Date;
  roleId?: string;
  permissions: Record<Resource, Record<Action, boolean>>;
}

export interface Store {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cnpj: string;
  address?: Address;
  archivedAt?: Date;
}

export type FetchUser = Pick<
  User,
  "id" | "fullName" | "email" | "phone" | "archivedAt" | "roleId"
>;
export type FetchStore = Pick<
  Store,
  "id" | "name" | "email" | "phone" | "archivedAt"
>;
