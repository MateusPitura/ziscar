export type Address = {
  cep: string;
  number: string;
  street?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export type Resource = "users";

export type Action = "create" | "read" | "update" | "delete"; // TODO: colocar na shared

export interface User {
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
export type UserLogged = Pick<User, "permissions">;
