import { memo, useState, type ReactElement } from "react";
import Button from "@/design-system/Button";
import { privateRoutes } from "@/domains/global/constants/routes";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import useSafeFetch from "../hooks/useSafeFetch";
import useGlobalContext from "../hooks/useGlobalContext";
import { AUTH_CHANNEL, BACKEND_URL } from "../constants";
import { useMutation } from "@tanstack/react-query";
import safeNavigate from "../utils/safeNavigate";
import usePermissions from "../hooks/usePermissions";
import checkPermission from "../utils/checkPermission";

function PageSideBar(): ReactElement {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  function handleToggleSideMenu() {
    setIsSideMenuOpen((prev) => !prev);
  }

  const navigate = useNavigate();

  const { safeFetch } = useSafeFetch();
  const { authChannel } = useGlobalContext();

  async function handleSignOut(): Promise<boolean> {
    return await safeFetch(`${BACKEND_URL}/auth/sign-out`, {
      method: "POST",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleSignOut,
    onSettled: () => {
      safeNavigate("/");
      authChannel.postMessage({ type: AUTH_CHANNEL.SIGNOUT });
    },
  });

  const { userPermissions } = usePermissions();

  return (
    <div
      className={classNames(
        "min-w-[5rem] max-w-[5rem] bg-slate-800 p-4 flex flex-col gap-4 overflow-y-auto transition-all duration-300 ease-in-out rounded-tr-md",
        {
          "!min-w-64 !max-w-64": isSideMenuOpen,
        }
      )}
    >
      <div
        className={classNames("flex gap-4", {
          "justify-center": !isSideMenuOpen,
        })}
      >
        <Button
          onClick={handleToggleSideMenu}
          variant="tertiary"
          iconLeft="Menu"
        />
        {isSideMenuOpen && (
          <span className="text-headline-small text-neutral-100 flex items-center">
            Ziscar
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2 text-nowrap">
        {privateRoutes.map((route) => {
          if (!route.shouldDisplay) return null;

          const hasPermission = checkPermission(
            userPermissions,
            route.resource,
            route.action
          );

          if(!hasPermission) return null;

          return (
            <Button
              key={route.path}
              padding={isSideMenuOpen ? "default" : "none"}
              label={isSideMenuOpen ? route.displayName : undefined}
              variant="tertiary"
              iconLeft={route.icon}
              onClick={() => {
                navigate(route.path);
              }}
              fullWidth
              data-cy={`button-${route.path}`}
            />
          );
        })}
      </div>
      <Button
        onClick={mutate}
        variant="tertiary"
        iconLeft="Logout"
        label={isSideMenuOpen ? "Sair" : undefined}
        state={isPending ? "loading" : undefined}
        fullWidth
        data-cy="button-sign-out"
      />
    </div>
  );
}

export default memo(PageSideBar);
