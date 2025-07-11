import { lazy, ReactNode } from "react";
import { Action, Resource } from "@shared/types";
import { IconsName } from "@/design-system/types";

interface Route {
  path: string;
  displayName?: string;
  icon?: IconsName;
  entryPage: ReactNode;
  shouldDisplay: boolean;
  resource?: Resource;
  action?: Action;
}

const Vehicles = lazy(
  () => import("@/domains/vehicles/components/VehiclesPage")
);
const Users = lazy(() => import("@/domains/users/components/UsersPage"));
const NewUser = lazy(() => import("@/domains/users/components/NewUsersPage"));
const EditUser = lazy(() => import("@/domains/users/components/EditUserPage"));
const Profile = lazy(() => import("@/domains/profile/components/ProfilePage"));
const EditProfile = lazy(
  () => import("@/domains/profile/components/EditProfilePage")
);
const Branches = lazy(
  () => import("@/domains/branches/components/BranchesPage")
);
const Audit = lazy(() => import("@/domains/audit/components/AuditPage"));
const NotFound = lazy(() => import("@/domains/global/components/NotFoundPage"));

const Sign = lazy(() => import("@/domains/sign/components/SignPage"));

export const privateRoutes: Route[] = [
  {
    path: "/vehicles",
    displayName: "Veículos",
    icon: "DirectionsCar",
    entryPage: <Vehicles />,
    shouldDisplay: true,
  },
  {
    path: "/branches",
    displayName: "Lojas",
    icon: "Store",
    entryPage: <Branches />, // 🌠 mudar par stores
    shouldDisplay: true,
  },
  {
    path: "/vehicle-sale",
    displayName: "Realizar Venda",
    icon: "CurrencyExchange",
    entryPage: <Vehicles />, // 🌠 Criar tela
    shouldDisplay: true,
  },
  {
    path: "/accounts-payable",
    displayName: "Contas a Pagar",
    icon: "CreditCardOff",
    entryPage: <Vehicles />, // 🌠 Criar tela
    shouldDisplay: true,
  },
  {
    path: "/accounts-receivable",
    displayName: "Contas a Receber",
    icon: "CreditCard",
    entryPage: <Vehicles />, // 🌠 Criar tela
    shouldDisplay: true,
  },
  {
    path: "/users",
    displayName: "Usuários",
    icon: "Person",
    entryPage: <Users />,
    shouldDisplay: true,
    action: "READ",
    resource: "USERS",
  },
  {
    path: "/users/new",
    entryPage: <NewUser />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "USERS",
  },
  {
    path: "/users/edit/:userId",
    entryPage: <EditUser />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "USERS",
  },
  {
    path: "/profile",
    displayName: "Conta",
    icon: "Settings",
    entryPage: <Profile />,
    shouldDisplay: true,
  },
  {
    path: "/profile/edit",
    entryPage: <EditProfile />,
    shouldDisplay: false,
  },
  {
    path: "/customers",
    displayName: "Clientes",
    icon: "People",
    entryPage: <Audit />, // 🌠 Criar tela
    shouldDisplay: true,
  },
  // { // 🌠 Remover
  //   path: "/audit",
  //   displayName: "Auditoria",
  //   icon: "VerifiedUser",
  //   entryPage: <Audit />,
  //   shouldDisplay: true,
  // },
];

export const publicRoutes: Route[] = [
  {
    path: "/",
    entryPage: <Sign />,
    shouldDisplay: false,
  },
  {
    path: "*",
    entryPage: <NotFound />,
    shouldDisplay: false,
  },
];
