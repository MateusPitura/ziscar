import { Action, Resource } from "../types";

const actionFormatted: Record<Action, string> = {
  CREATE: "criar",
  READ: "visualizar",
  UPDATE: "editar",
  DELETE: "excluir",
};

const resourceFormatted: Record<Resource, string> = {
  USERS: "usuários",
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
