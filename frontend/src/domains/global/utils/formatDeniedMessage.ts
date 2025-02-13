import { Action, Resource } from "../types/model";

const actionFormatted: Record<Action, string> = {
  create: "criar",
  read: "visualizar",
  update: "editar",
  delete: "excluir",
};

const resourceFormatted: Record<Resource, string> = {
  users: "usuários",
};

interface FormatDeniedMessageProperties {
  resource?: Resource;
  action?: Action;
}

export default function formatDeniedMessage({
  resource,
  action,
}: FormatDeniedMessageProperties): string {
  if (resource && action) {
    return `Você não pode ${actionFormatted[action]} ${resourceFormatted[resource]}`;
  }
  return "";
}
