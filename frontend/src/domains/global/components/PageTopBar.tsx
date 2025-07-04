import Button from "@/design-system/Button";
import type { ReactElement } from "react";
import { useMutation } from "@tanstack/react-query";
import useSafeFetch from "../hooks/useSafeFetch";
import { AUTH_CHANNEL, BACKEND_URL } from "../constants";
import useGlobalContext from "../hooks/useGlobalContext";
import safeNavigate from "../utils/safeNavigate";

interface PageTopBarProps {
  onToggleSideMenu: () => void;
}

export default function PageTopBar({
  onToggleSideMenu,
}: PageTopBarProps): ReactElement {
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

  return (
    <div className="flex w-full items-center p-4 bg-light-surfaceContainerLowest h-16 gap-4">
      <div className="flex flex-1 gap-4">
        <Button onClick={onToggleSideMenu} variant="tertiary" iconLeft="Menu" />
        <span className="text-headline-small text-light-onSurface flex items-center">
          Ziscar
        </span>
      </div>
      <div className="flex flex-2 gap-4 items-center">
        <Button
          onClick={mutate}
          variant="tertiary"
          iconRight="Logout"
          state={isPending ? "loading" : undefined}
        />
      </div>
    </div>
  );
}
