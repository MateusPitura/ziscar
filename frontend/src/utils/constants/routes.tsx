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
    id: "1",
    groupName: "Cadastros",
    routes: [
      {
        id: "1",
        path: "users",
        displayName: "Usuários",
        icon: <PersonOutlinedIcon />,
        entryPage: <Users />,
      },
      {
        id: "2",
        path: "vehicles",
        displayName: "Veículos",
        icon: <DirectionsCarOutlinedIcon />,
        entryPage: <Vehicles />,
      },
      {
        id: "3",
        path: "branches",
        displayName: "Filiais",
        icon: <StoreOutlinedIcon />,
      },
    ],
  },
  {
    id: "2",
    groupName: "Configurações",
    routes: [
      {
        id: "1",
        path: "profile",
        displayName: "Perfil",
        icon: <SettingsOutlinedIcon />,
      },
    ],
  },
  {
    id: "3",
    groupName: "Outros",
    routes: [
      {
        id: "1",
        path: "audit",
        displayName: "Auditoria",
        icon: <VerifiedUserOutlinedIcon />,
      },
    ],
  },
];
