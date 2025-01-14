import type { ReactElement } from "react";
import Button from "@/design-system/Button";
import PageGroupContainer from "@/components/PageGroupContainer";
import { routes } from "@/utils/constants/routes";

export default function PageSideMenu(): ReactElement {
  return (
    <div className="w-64 bg-light-surfaceContainerLowest h-full p-4 flex flex-col gap-2">
      {routes.map((group) => (
        <PageGroupContainer key={group.id} label={group.groupName}>
          {group.routes.map((route) => (
            <Button
              key={route.id}
              label={route.displayName}
              variant="quaternary"
              iconLeft={route.icon}
              onClick={() => {}}
              fullWidth
            />
          ))}
        </PageGroupContainer>
      ))}
    </div>
  );
}
