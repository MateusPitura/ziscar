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

const Stores = lazy(() => import("@/domains/stores/components/StoresPage"));
const NewStore = lazy(
  () => import("@/domains/stores/components/NewStoresPage")
);
const EditStore = lazy(
  () => import("@/domains/stores/components/EditStorePage")
);

const VehicleSale = lazy(
  () => import("@/domains/vehicleSale/components/VehicleSalePage")
);

const NotFound = lazy(() => import("@/domains/global/components/NotFoundPage"));

const Sign = lazy(() => import("@/domains/sign/components/SignPage"));

const AccountsPayable = lazy(
  () => import("@/domains/accountsPayable/components/AccountsPayablePage")
);

const AccountsReceivable = lazy(
  () => import("@/domains/accountsReceivable/components/AccountsReceivablePage")
);

const Customers = lazy(
  () => import("@/domains/customers/components/CustomersPage")
);

export const privateRoutes: Route[] = [
  {
    path: DEFAULT_ROUTE,
    displayName: "Veículos",
    icon: "DirectionsCar",
    entryPage: <Vehicles />,
    shouldDisplay: true,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/stores",
    displayName: "Lojas",
    icon: "Store",
    entryPage: <Stores />,
    shouldDisplay: true,
    action: "READ",
    resource: "STORES",
  },
  {
    path: "/stores/new",
    entryPage: <NewStore />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "STORES",
  },
  {
    path: "/stores/edit/:storeId",
    entryPage: <EditStore />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "STORES",
  },
  {
    path: "/vehicle-sale",
    displayName: "Realizar Venda",
    icon: "CurrencyExchange",
    entryPage: <VehicleSale />,
    shouldDisplay: true,
    action: "CREATE",
    resource: "VEHICLE_SALE",
  },
  {
    path: "/accounts-payable",
    displayName: "Contas a Pagar",
    icon: "CreditCardOff",
    entryPage: <AccountsPayable />,
    shouldDisplay: true,
    action: "READ",
    resource: "ACCOUNTS_PAYABLE",
  },
  {
    path: "/accounts-receivable",
    displayName: "Contas a Receber",
    icon: "CreditCard",
    entryPage: <AccountsReceivable />,
    shouldDisplay: true,
    action: "READ",
    resource: "ACCOUNTS_RECEIVABLE",
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
    entryPage: <Customers />,
    shouldDisplay: true,
    action: "READ",
    resource: "CUSTOMERS",
  },
];

export const publicRoutes: Route[] = [
  {
    path: "/",
    entryPage: <Sign />,
    shouldDisplay: false,
  },
  {
    path: "/new-account",
    entryPage: <Sign />,
    shouldDisplay: false,
  },
  {
    path: "*",
    entryPage: <NotFound />,
    shouldDisplay: false,
  },
];
