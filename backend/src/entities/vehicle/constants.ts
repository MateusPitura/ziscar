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
  store: true,
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
