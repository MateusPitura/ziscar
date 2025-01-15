import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { lazy } from "react";

const Vehicles = lazy(() => import("@/pages/vehicles/VehiclesPage"));
const Users = lazy(() => import("@/pages/users/UsersPage"));

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
