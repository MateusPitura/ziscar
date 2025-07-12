import { lazy, ReactNode } from "react";
import { Action, Resource } from "@shared/types";
import { IconsName } from "@/design-system/types";
import { DEFAULT_ROUTE } from ".";

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
const EditProfile = lazy(
  () => import("@/domains/profile/components/EditProfilePage")
);
const Stores = lazy(
  () => import("@/domains/stores/components/StoresPage")
);
const Audit = lazy(() => import("@/domains/audit/components/AuditPage"));
const NotFound = lazy(() => import("@/domains/global/components/NotFoundPage"));

const Sign = lazy(() => import("@/domains/sign/components/SignPage"));

export const privateRoutes: Route[] = [
  {
    path: DEFAULT_ROUTE,
    displayName: "Veículos",
    icon: "DirectionsCar",
    entryPage: <Vehicles />,
    shouldDisplay: true,
  },
  {
    path: "/stores",
    displayName: "Lojas",
    icon: "Store",
    entryPage: <Stores />,
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
    path: "/profile/edit",
    entryPage: <EditProfile />,
    shouldDisplay: true,
    icon: "Settings",
    displayName: "Conta",
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
