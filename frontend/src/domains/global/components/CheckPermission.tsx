import { useMemo, type ReactNode } from "react";
import { Action, Resource } from "../types/user";
import useCheckPermission from "../hooks/useCheckPermission";
import { Childrenable } from "../types/components";
import Tooltip from "@/design-system/Tooltip";
import classNames from "classnames";

interface CheckPermissionProperties extends Childrenable {
  resource: Resource;
  action: Action;
}

const actionFormatted = {
  create: "criar",
  read: "visualizar",
  update: "editar",
  delete: "excluir",
};

const resourceFormatted: Record<Resource, string> = {
  users: "usuários",
};

export default function CheckPermission({
  action,
  resource,
  children,
}: CheckPermissionProperties): ReactNode {
  const hasPermission = useCheckPermission(resource, action);

  const messageFormatted = useMemo(() => {
    return `Você não pode ${actionFormatted[action]} ${resourceFormatted[resource]}`;
  }, [action, resource]);

  return (
    <Tooltip content={messageFormatted} disabled={hasPermission}>
      <div className="cursor-not-allowed">
        <div
          className={classNames({
            "pointer-events-none opacity-50": !hasPermission,
          })}
          onClickCapture={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Tooltip>
  );
}
