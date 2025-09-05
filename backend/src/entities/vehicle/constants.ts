export const GET_VEHICLE = {
  id: true,
  chassiNumber: true,
  modelYear: true,
  yearOfManufacture: true,
  modelName: true,
  category: true,
  kilometers: true,
  plateNumber: true,
  announcedPrice: true,
  minimumPrice: true,
  commissionValue: true,
  color: true,
  fuelType: true,
  status: true,
  storeId: true,
  archivedAt: true,
  store: {
    select: {
      id: true,
      name: true,
    },
  },
  vehicleCharacteristicValues: {
    select: {
      id: true,
      characteristic: true,
    },
  },
  brand: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const VEHICLE_WITH_PAYMENT_SELECT = {
  ...GET_VEHICLE,
  vehiclePurchases: {
    select: {
      id: true,
      date: true,
      accountPayable: {
        select: {
          id: true,
          description: true,
          paidTo: true,
          accountPayableInstallments: {
            select: {
              id: true,
              installmentSequence: true,
              dueDate: true,
              value: true,
              status: true,
              isRefund: true,
              isUpfront: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  },
};

export const VEHICLE_EXPENSE_SELECT = {
  id: true,
  vehicleId: true,
  category: true,
  observations: true,
  competencyDate: true,
  archivedAt: true,
  accountPayable: {
    select: {
      id: true,
      description: true,
      paidTo: true,
      accountPayableInstallments: {
        select: {
          id: true,
          installmentSequence: true,
          dueDate: true,
          value: true,
          status: true,
          isRefund: true,
          isUpfront: true,
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      fullName: true,
    },
  },
};

export const VEHICLE_EXPENSE_WITH_VEHICLE_SELECT = {
  ...VEHICLE_EXPENSE_SELECT,
  vehicle: {
    select: {
      id: true,
      plateNumber: true,
    },
  },
};
