import { memo, useEffect, useState, type ReactElement } from "react";
import Button from "@/design-system/Button";
import RoutesGroup from "@/domains/global/components/RoutesGroup";
import { closeRoutes } from "@/domains/global/constants/routes";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";

interface PageSideBarProps {
  isOpen: boolean;
}

function PageSideBar({ isOpen }: PageSideBarProps): ReactElement {
  const [activePath, setActivePath] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActivePath(`/${location.pathname.split("/")[1]}`);
  }, [location]);

  return (
    <div
      className={classNames(
        "min-w-[5rem] max-w-[5rem] bg-light-surfaceContainerLowest p-4 flex flex-col gap-2 overflow-y-auto transition-all duration-300 ease-in-out",
        {
          "!min-w-64 !max-w-64": isOpen,
        }
      )}
    >
      {closeRoutes.map((group) => {
        if (!group.shoudDisplay) return null;

        return (
          <RoutesGroup
            key={group.groupName}
            label={isOpen ? group.groupName : undefined}
          >
            {group.routes.map(
              (route) =>
                route.shouldDisplay && (
                  <Button
                    key={route.path}
                    padding={isOpen ? "default" : "none"}
                    label={isOpen ? route.displayName : undefined}
                    state={activePath === route.path ? "active" : undefined}
                    variant="quaternary"
                    iconLeft={route.icon}
                    onClick={() => {
                      navigate(route.path);
                    }}
                    fullWidth
                  />
                )
            )}
          </RoutesGroup>
        );
      })}
    </div>
  );
}

export default memo(PageSideBar);
