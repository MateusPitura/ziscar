import { memo, useState, type ReactElement } from "react";
import Button from "@/design-system/Button";
import PageGroupContainer from "@/components/PageGroupContainer";
import { routes } from "@/utils/constants/routes";
import { useNavigate } from "react-router-dom";

function PageSideMenu(): ReactElement {
  const [activePath, setActivePath] = useState("");

  const navigate = useNavigate();

  return (
    <div className="min-w-64 max-w-64 bg-light-primary p-4 flex flex-col gap-2 flex-1">
      {routes.map((group) => (
        <PageGroupContainer key={group.groupName} label={group.groupName}>
          {group.routes.map((route) => (
            <Button
              key={route.path}
              label={route.displayName}
              state={activePath === route.path ? "active" : undefined}
              variant="quaternary"
              iconLeft={route.icon}
              onClick={() => {
                setActivePath(route.path);
                navigate(route.path);
              }}
              fullWidth
            />
          ))}
        </PageGroupContainer>
      ))}
    </div>
  );
}

export default memo(PageSideMenu);
