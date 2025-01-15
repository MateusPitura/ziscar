import { memo, useState, type ReactElement } from "react";
import Button from "@/design-system/Button";
import PageGroupContainer from "@/components/PageGroupContainer";
import { routes } from "@/utils/constants/routes";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

interface PageSideMenuProps {
  isOpen: boolean;
}

function PageSideMenu({ isOpen }: PageSideMenuProps): ReactElement {
  const [activePath, setActivePath] = useState("");

  const navigate = useNavigate();

  return (
    <div
      className={classNames(
        "min-w-[5rem] max-w-[5rem] bg-light-surfaceContainerLowest p-4 flex flex-col gap-2 flex-1 overflow-y-auto",
        {
          "!min-w-64 !max-w-64": isOpen,
        }
      )}
    >
      {routes.map((group) => (
        <PageGroupContainer
          key={group.groupName}
          label={group.groupName}
          showLabel={isOpen}
        >
          {group.routes.map((route) => (
            <Button
              key={route.path}
              padding={isOpen ? "default" : "none"}
              label={isOpen ? route.displayName : undefined}
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
