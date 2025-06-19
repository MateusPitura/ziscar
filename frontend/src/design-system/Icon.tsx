import { type ReactNode } from "react";
import { IconsName } from "./types";
import { icons } from "./constants/icons";

interface IconProperties {
  iconName: IconsName;
  className?: string;
}

export default function Icon({
  iconName,
  className,
}: IconProperties): ReactNode {
  const BareIcon = icons[iconName];
  if (!BareIcon) return null;

  return (
    <div className={className}>
      <BareIcon color="inherit" fontSize="medium"/>
    </div>
  );
}
