import { createContext, useCallback, useMemo, useState } from "react";
import { userFilterDefaultValues } from "@/domains/users/constants";
import {
  Childrenable,
  CustomersFilter,
  StoresFilter,
  UsersFilter,
} from "../types";
import { storeFilterDefaultValues } from "@/domains/stores/constants";
import { customerFilterDefaultValues } from "@/domains/customers/constants";

interface FilterContextValues {
  usersFilter?: UsersFilter;
  handleUsersFilter: (value: Partial<UsersFilter>) => void;
  storesFilter?: StoresFilter;
  handleStoresFilter: (value: Partial<StoresFilter>) => void;
  customersFilter?: CustomersFilter;
  handleCustomersFilter: (value: Partial<CustomersFilter>) => void;
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

  const valuesMemoized = useMemo(
    () => ({
      usersFilter,
      handleUsersFilter,
      storesFilter,
      handleStoresFilter,
      customersFilter,
      handleCustomersFilter,
    }),
    [
      usersFilter,
      handleUsersFilter,
      storesFilter,
      handleStoresFilter,
      customersFilter,
      handleCustomersFilter,
    ]
  );

  return (
    <FilterContext.Provider value={valuesMemoized}>
      {children}
    </FilterContext.Provider>
  );
}

export { FilterContext, FilterProvider };
