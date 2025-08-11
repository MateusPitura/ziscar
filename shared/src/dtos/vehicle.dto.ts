import { s } from "../safeZod";
import {
  BaseIdSchema,
  BasePaginationSchema,
  BaseDateRangeSchema,
  BaseIdResponseSchema,
  BasePaginatedResponseSchema,
} from "./base.dto";
import {
  VEHICLECATEGORY_VALUES,
  FUELTYPE_VALUES,
  VEHICLESTATUS_VALUES,
  EXPENSECATEGORY_VALUES,
  PAYMENTMETHODPAYABLETYPE_VALUES,
} from "../enums";

export const InsertVehicleRequestSchema = s.object({
  chassiNumber: s.string(17),
  modelYear: s.number().nullable(),
  yearOfManufacture: s.number().nullable(),
  modelName: s.string().nullable(),
  brandId: s.id(),
  category: s.radio(VEHICLECATEGORY_VALUES).nullable(),
  kilometers: s.number().nullable(),
  plateNumber: s.string(7),
  announcedPrice: s.number().nullable(),
  minimumPrice: s.number().nullable(),
  commissionValue: s.number(),
  color: s.color().nullable(),
  fuelType: s.radio(FUELTYPE_VALUES).nullable(),
  status: s.radio(VEHICLESTATUS_VALUES),
  storeId: s.id(),
});

export const InsertVehicleResponseSchema = BaseIdResponseSchema;

export const SearchVehiclesRequestSchema = BasePaginationSchema.merge(
  BaseDateRangeSchema
).extend({
  storeId: s.id().optional(),
  brandId: s.id().optional(),
  status: s.radio(VEHICLESTATUS_VALUES).optional(),
  category: s.radio(VEHICLECATEGORY_VALUES).optional(),
  modelYear: s.number().optional(),
  yearOfManufacture: s.number().optional(),
  modelName: s.string().optional(),
  plateNumber: s.string(7).optional(),
  announcedPriceMin: s.number().optional(),
  announcedPriceMax: s.number().optional(),
});

const VehicleItemSchema = s.object({
  id: s.id(),
  chassiNumber: s.string(17),
  modelYear: s.number().nullable(),
  yearOfManufacture: s.number().nullable(),
  modelName: s.string().nullable(),
  brandId: s.id(),
  storeId: s.id(),
  status: s.radio(VEHICLESTATUS_VALUES),
  category: s.radio(VEHICLECATEGORY_VALUES).nullable(),
  announcedPrice: s.number().nullable(),
  plateNumber: s.string(7),
  archivedAt: s.date().nullable().optional(),
});

export const SearchVehiclesResponseSchema =
  BasePaginatedResponseSchema(VehicleItemSchema);

export const InsertVehicleExpenseRequestSchema = s.object({
  vehicleId: s.id(),
  category: s.radio(EXPENSECATEGORY_VALUES),
  observations: s.string().nullable(),
  description: s.string().nullable(),
  paidTo: s.string().nullable(),
  totalValue: s.number(),
  installments: s.array(
    s.object({
      dueDate: s.date(),
      value: s.number(),
      isUpfront: s.boolean().nullable(),
      paymentMethods: s
        .array(
          s.object({
            type: s.radio(PAYMENTMETHODPAYABLETYPE_VALUES),
            value: s.number(),
            paymentDate: s.date().nullable(),
          })
        )
        .nullable(),
    })
  ),
});

export const InsertVehicleExpenseResponseSchema = BaseIdResponseSchema;

export const FetchVehicleBrandsResponseSchema = s.array(
  s.object({
    id: s.id(),
    name: s.string(),
  })
);

export const MakeVehicleSaleRequestSchema = s.object({
  vehicleId: s.id(),
  customerId: s.id(),
  accountReceivableId: s.id(),
  accountPayableId: s.id(),
  date: s.date(),
});

export const MakeVehicleSaleResponseSchema = BaseIdResponseSchema;

export const UpdateVehicleRequestSchema =
  InsertVehicleRequestSchema.partial().extend({
    id: s.id(),
  });

export const UpdateVehicleResponseSchema = BaseIdResponseSchema;

export const ToggleArchiveVehicleRequestSchema = s.object({
  id: s.id(),
  archived: s.boolean(),
});

export const ToggleArchiveVehicleResponseSchema = s.object({
  id: s.id(),
  archivedAt: s.date().nullable(),
});
