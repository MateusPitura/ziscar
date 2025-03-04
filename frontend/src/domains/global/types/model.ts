export type Address = {
  cep: string;
  number: string;
  street?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export interface Client {
  id: string;
}
export type ClientLogged = Pick<Client, "id">;

export type Resource = "users";

export type Action = "create" | "read" | "update" | "delete";

export interface User { // TODO: tentar pegar isso do front
    id: string;
    fullName: string;
    email: string;
    cellPhone?: string;
    cpf?: string;
    code?: string;
    birthDate?: string;
    address?: Address;
    isActive?: boolean;
    roleId?: string;
    permissions: Record<Resource, Record<Action, boolean>>;

}
export type UserLogged = Pick<User, "id" | "permissions">;
