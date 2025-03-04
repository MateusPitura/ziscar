import Button from "@/design-system/Button";
import type { ReactElement } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSafeFetch from "../hooks/useSafeFetch";
import { BASE_URL } from "../constants";

interface PageTopBarProps {
  onToggleSideMenu: () => void;
}

export default function PageTopBar({
  onToggleSideMenu,
}: PageTopBarProps): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { safeFetch } = useSafeFetch();

  async function handleSignOut(): Promise<boolean> {
    return await safeFetch(`${BASE_URL}/auth/sign-out`, {
      method: "POST",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleSignOut,
    onSuccess: () => {
      queryClient.clear();
      localStorage.clear();
      navigate("/sign");
      window.location.reload();
    }
  });

  return (
    <div className="flex w-full items-center p-4 bg-light-surfaceContainerLowest h-16 gap-4">
      <div className="flex flex-1 gap-4">
        <Button
          onClick={onToggleSideMenu}
          variant="tertiary"
          iconLeft={<MenuIcon />}
        />
        <span className="text-headline-small text-light-onSurface flex items-center">
          Projeto de Software
        </span>
      </div>
      <div className="flex flex-2 gap-4 items-center">
        <Button
          onClick={mutate}
          variant="tertiary"
          iconLeft={<LogoutIcon />}
          state={isPending ? "loading" : undefined}
        />
      </div>
    </div>
  );
}
