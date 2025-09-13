import { createContext, useCallback, useMemo, useState } from "react";
import { userFilterDefaultValues } from "@/domains/users/constants";
import {
  AccountsReceivableFilter,
  Childrenable,
  CustomersFilter,
  StoresFilter,
  UsersFilter,
  VehiclesFilter,
} from "../types";
import { storeFilterDefaultValues } from "@/domains/stores/constants";
import { customerFilterDefaultValues } from "@/domains/customers/constants";
import { accountReceivableFilterDefaultValues } from "@/domains/accountsReceivable/constants";
import { vehicleFilterDefaultValues } from "@/domains/vehicles/constants";
import { accountPayableFilterDefaultValues } from "@/domains/accountsPayable/constants";

interface FilterContextValues {
  usersFilter?: UsersFilter;
  handleUsersFilter: (value: Partial<UsersFilter>) => void;
  storesFilter?: StoresFilter;
  handleStoresFilter: (value: Partial<StoresFilter>) => void;
  customersFilter?: CustomersFilter;
  handleCustomersFilter: (value: Partial<CustomersFilter>) => void;
  accountsReceivableFilter?: AccountsReceivableFilter;
  handleAccountsReceivableFilter: (
    value: Partial<AccountsReceivableFilter>
  ) => void;
  accountsPayableFilter?: AccountsReceivableFilter;
  handleAccountsPayableFilter: (
    value: Partial<AccountsReceivableFilter>
  ) => void;
  vehiclesFilter?: VehiclesFilter;
  handleVehiclesFilter: (value: Partial<VehiclesFilter>) => void;
}

const FilterContext = createContext<FilterContextValues | null>(null);

function FilterProvider({ children }: Childrenable) {
  const [usersFilter, setUsersFilter] = useState<UsersFilter>({
    page: 1,
    ...userFilterDefaultValues,
  });

  const handleUsersFilter = useCallback((value: Partial<UsersFilter>) => {
    setUsersFilter((prev) => ({
      ...prev,
      ...value,
    }));
  }, []);

  const [storesFilter, setStoresFilter] = useState<StoresFilter>({
    page: 1,
    ...storeFilterDefaultValues,
  });

  const handleStoresFilter = useCallback((value: Partial<StoresFilter>) => {
    setStoresFilter((prev) => ({
      ...prev,
      ...value,
    }));
  }, []);

  const [customersFilter, setCustomersFilter] = useState<CustomersFilter>({
    page: 1,
    ...customerFilterDefaultValues,
  });

  const handleCustomersFilter = useCallback(
    (value: Partial<CustomersFilter>) => {
      setCustomersFilter((prev) => ({
        ...prev,
        ...value,
      }));
    },
    []
  );

  const [accountsReceivableFilter, setAccountsReceivableFilter] =
    useState<AccountsReceivableFilter>({
      page: 1,
      ...accountReceivableFilterDefaultValues,
    });

  const handleAccountsReceivableFilter = useCallback(
    (value: Partial<AccountsReceivableFilter>) => {
      setAccountsReceivableFilter((prev) => ({
        ...prev,
        ...value,
      }));
    },
    []
  );

  const [accountsPayableFilter, setAccountsPayableFilter] =
    useState<AccountsReceivableFilter>({
      page: 1,
      ...accountPayableFilterDefaultValues,
    });

  const handleAccountsPayableFilter = useCallback(
    (value: Partial<AccountsReceivableFilter>) => {
      setAccountsPayableFilter((prev) => ({
        ...prev,
        ...value,
      }));
    },
    []
  );

  const [vehiclesFilter, setVehiclesFilter] = useState<VehiclesFilter>({
    page: 1,
    ...vehicleFilterDefaultValues,
  });

  const handleVehiclesFilter = useCallback((value: Partial<VehiclesFilter>) => {
    setVehiclesFilter((prev) => ({
      ...prev,
      ...value,
    }));
  }, []);

  const valuesMemoized = useMemo(
    () => ({
      usersFilter,
      handleUsersFilter,
      storesFilter,
      handleStoresFilter,
      customersFilter,
      handleCustomersFilter,
      accountsReceivableFilter,
      handleAccountsReceivableFilter,
      vehiclesFilter,
      handleVehiclesFilter,
      accountsPayableFilter,
      handleAccountsPayableFilter,
    }),
    [
      usersFilter,
      handleUsersFilter,
      storesFilter,
      handleStoresFilter,
      customersFilter,
      handleCustomersFilter,
      accountsReceivableFilter,
      handleAccountsReceivableFilter,
      vehiclesFilter,
      handleVehiclesFilter,
      accountsPayableFilter,
      handleAccountsPayableFilter,
    ]
  );

  return (
    <FilterContext.Provider value={valuesMemoized}>
      {children}
    </FilterContext.Provider>
  );
}

export { FilterContext, FilterProvider };
