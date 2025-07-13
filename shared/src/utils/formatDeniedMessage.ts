import { Action, Resource } from "../types";

const actionFormatted: Record<Action, string> = {
  CREATE: "criar",
  READ: "visualizar",
  UPDATE: "editar",
  DELETE: "excluir",
};

const resourceFormatted: Record<Resource, string> = {
  USERS: "usuários",
  ACCOUNTS_PAYABLE: "contas a pagar",
  ACCOUNTS_RECEIVABLE: "contas a receber",
  CUSTOMERS: "clientes",
  STORES: "lojas",
  VEHICLE_EXPENSE: "despesas de veículo",
  VEHICLES: "veículos",
  VEHICLE_PURCHASE: "compra de veículo",
  VEHICLE_SALE: "venda de veículo",
};

interface FormatDeniedMessageProperties {
  resource?: Resource;
  action?: Action;
}

export function formatDeniedMessage({
  resource,
  action,
}: FormatDeniedMessageProperties): string {
  if (resource && action) {
    return `Você não pode ${actionFormatted[action]} ${resourceFormatted[resource]}`;
  }
  return "";
}
