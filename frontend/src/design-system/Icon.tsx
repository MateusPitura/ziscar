import { type ReactNode } from "react";
import { IconsName } from "./types";
import { icons } from "./constants/icons";

interface IconProperties {
  iconName: IconsName;
  fontSize?: "small" | "medium" | "large" | "inherit";
  className?: string;
}

export default function Icon({
  iconName,
  fontSize = "medium",
  className,
}: IconProperties): ReactNode {
  const BareIcon = icons[iconName];
  if (!BareIcon) return null;

  return (
    <div className={className}>
      <BareIcon color="inherit" fontSize={fontSize} />
    </div>
  );
}
