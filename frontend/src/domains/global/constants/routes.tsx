import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { lazy, ReactNode } from "react";

interface Route {
  path: string;
  displayName?: string;
  icon?: ReactNode;
  entryPage: ReactNode;
  shouldDisplay: boolean;
}

interface RouteGroup {
  groupName: string;
  shoudDisplay?: boolean;
  routes: Route[];
}

const Vehicles = lazy(
  () => import("@/domains/vehicles/components/VehiclesPage")
);
const Users = lazy(() => import("@/domains/users/components/UsersPage"));
const NewUser = lazy(() => import("@/domains/users/components/NewUsersPage"));
const EditUser = lazy(() => import("@/domains/users/components/EditUserPage"));
const Profile = lazy(() => import("@/domains/profile/components/ProfilePage"));
const Branches = lazy(
  () => import("@/domains/branches/components/BranchesPage")
);
const Audit = lazy(() => import("@/domains/audit/components/AuditPage"));
const NotFound = lazy(() => import("@/domains/global/components/NotFoundPage"));

const Sign = lazy(() => import("@/domains/sign/components/SignPage"));

export const privateRoutes: RouteGroup[] = [
  {
    groupName: "Cadastros",
    shoudDisplay: true,
    routes: [
      {
        path: "/users",
        displayName: "Usuários",
        icon: <PersonOutlinedIcon />,
        entryPage: <Users />,
        shouldDisplay: true,
      },
      {
        path: "/users/new",
        entryPage: <NewUser />,
        shouldDisplay: false,
      },
      {
        path: "/users/edit/:userId",
        entryPage: <EditUser />,
        shouldDisplay: false,
      },
      {
        path: "/vehicles",
        displayName: "Veículos",
        icon: <DirectionsCarOutlinedIcon />,
        entryPage: <Vehicles />,
        shouldDisplay: true,
      },
      {
        path: "/branches",
        displayName: "Filiais",
        icon: <StoreOutlinedIcon />,
        entryPage: <Branches />,
        shouldDisplay: true,
      },
    ],
  },
  {
    groupName: "Configurações",
    shoudDisplay: true,
    routes: [
      {
        path: "/",
        displayName: "Perfil",
        icon: <SettingsOutlinedIcon />,
        entryPage: <Profile />,
        shouldDisplay: true,
      },
    ],
  },
  {
    groupName: "Outros",
    shoudDisplay: true,
    routes: [
      {
        path: "/audit",
        displayName: "Auditoria",
        icon: <VerifiedUserOutlinedIcon />,
        entryPage: <Audit />,
        shouldDisplay: true,
      },
    ],
  },
  {
    groupName: "*",
    shoudDisplay: false,
    routes: [
      {
        path: "*",
        entryPage: <NotFound />,
        shouldDisplay: false,
      },
    ],
  },
];

export const publicRoutes: RouteGroup[] = [
  {
    groupName: "*",
    shoudDisplay: false,
    routes: [
      {
        path: "/sign",
        entryPage: <Sign />,
        shouldDisplay: false,
      },
      {
        path: "*",
        entryPage: <NotFound />,
        shouldDisplay: false,
      },
    ],
  },
];
