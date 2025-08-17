import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
import { s } from "@shared/safeZod";

export const SchemaVehiclesFilterForm = s
  .object({
    // name: s.string().or(s.empty()),
    // orderBy: s.radio(["name", "email"]),
    // status: s.radio(["active", "inactive"]),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaVehicleForm = s.object({
  kilometers: s.number(),
  plateNumber: s.number(), // 🌠 validação para placa,
  announcedPrice: s.money(),
  minimumPrice: s.money(),
  commissionValue: s.money(),
  color: s.string(),
  fuelType: s.radio([
    FuelType.GASOLINE,
    FuelType.ETHANOL,
    FuelType.FLEX,
    FuelType.ELECTRIC,
    FuelType.GNV,
  ]),
  status: s.radio([
    VehicleStatus.PURCHASED,
    VehicleStatus.IN_STOCK,
    VehicleStatus.MAINTENANCE,
    VehicleStatus.SOLD,
    VehicleStatus.DELIVERED,
  ]),
  storeId: s.id(),
  chassiNumber: s.string(), // 🌠 validação para chassi
  modelYear: s.string(), // 🌠 validação para ano do modelo
  yearOfManufacture: s.string(), // 🌠 validação para ano de fabricação
  modelName: s.string(),
  category: s.radio([
    VehicleCategory.CAR,
    VehicleCategory.MOTORCYCLE,
    VehicleCategory.TRUCK,
    VehicleCategory.VAN,
    VehicleCategory.BUS,
  ]),
  brandId: s.id(),
});
