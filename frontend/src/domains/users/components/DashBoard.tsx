import Loading from "@/design-system/Loading";
import { Childrenable } from "@/domains/global/types/components";
import type { ReactElement } from "react";

interface DashBoardProperties extends Childrenable {
  isLoading: boolean;
}

function DashBoard({ children, isLoading }: DashBoardProperties): ReactElement {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {isLoading ? <Card isLoading={true} /> : children}
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

Object.assign(DashBoard, { Card });

type DashBoardType = typeof DashBoard & {
  Card: typeof Card;
};

export default DashBoard as DashBoardType;
