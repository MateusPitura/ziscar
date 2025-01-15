import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { lazy } from "react";

const Vehicles = lazy(() => import("@/domains/vehicles/components/VehiclesPage"));
const Users = lazy(() => import("@/domains/users/components/UsersPage"));

export const routes = [
  {
    groupName: "Cadastros",
    routes: [
      {
        path: "/users",
        displayName: "Usuários",
        icon: <PersonOutlinedIcon />,
        entryPage: <Users />,
      },
      {
        path: "/vehicles",
        displayName: "Veículos",
        icon: <DirectionsCarOutlinedIcon />,
        entryPage: <Vehicles />,
      },
      {
        path: "/branches",
        displayName: "Filiais",
        icon: <StoreOutlinedIcon />,
      },
    ],
  },
  {
    groupName: "Configurações",
    routes: [
      {
        path: "/profile",
        displayName: "Perfil",
        icon: <SettingsOutlinedIcon />,
      },
    ],
  },
  {
    groupName: "Outros",
    routes: [
      {
        path: "/audit",
        displayName: "Auditoria",
        icon: <VerifiedUserOutlinedIcon />,
      },
    ],
  },
];
