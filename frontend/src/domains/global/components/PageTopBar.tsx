import Button from "@/design-system/Button";
import type { ReactElement } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface PageTopBarProps {
  onToggleSideMenu: () => void;
}

export default function PageTopBar({
  onToggleSideMenu,
}: PageTopBarProps): ReactElement {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
          onClick={() => {
            queryClient.clear();
            localStorage.clear();
            navigate("/sign");
            window.location.reload();
          }}
          variant="tertiary"
          iconLeft={<LogoutIcon />}
        />
      </div>
    </div>
  );
}
