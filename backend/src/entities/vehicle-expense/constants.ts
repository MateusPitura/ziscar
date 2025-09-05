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
