import Icon from "@/design-system/Icon";
import Tooltip from "@/design-system/Tooltip";
import type { ReactNode } from "react";

export default function AccountExpired(): ReactNode {
  return (
    <Tooltip content="Atrasado">
      <div>
        <Icon iconName="Warning" className="text-orange-500" />
      </div>
    </Tooltip>
  );
}
