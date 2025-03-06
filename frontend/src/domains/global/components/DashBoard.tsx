import Loading from "@/design-system/Loading";
import { Childrenable } from "@/domains/global/types";
import type { ReactElement } from "react";
import useCheckPermission from "../hooks/useCheckPermission";
import formatDeniedMessage from "../utils/formatDeniedMessage";
import { Action, Resource } from "@shared/types";

interface ContainerProperties extends Childrenable {
  isLoading: boolean;
  resource: Resource;
  action: Action;
}

function Container({
  children,
  isLoading,
  action,
  resource,
}: ContainerProperties): ReactElement {
  const hasPermission = useCheckPermission(resource, action);

  return (
    <div className="flex gap-4 overflow-x-auto">
      {!hasPermission ? (
        <Card label={formatDeniedMessage({ resource, action })} value="-" />
      ) : isLoading ? (
        <Card isLoading={true} />
      ) : (
        children
      )}
    </div>
  );
}

interface CardProperties {
  label?: string;
  value?: string;
  isLoading?: boolean;
}

function Card({ label, value, isLoading }: CardProperties) {
  return (
    <div className="p-4 bg-light-surfaceContainerLowest rounded-md min-w-fit flex flex-col text-light-onSurface gap-4">
      <Loading isLoading={!!isLoading} className="text-body-large line-clamp-1">
        {label}
      </Loading>
      <Loading
        isLoading={!!isLoading}
        className="text-display-medium tabular-nums line-clamp-1"
      >
        {value}
      </Loading>
    </div>
  );
}

const DashBoard = Object.assign(Container, { Card });

export default DashBoard;
