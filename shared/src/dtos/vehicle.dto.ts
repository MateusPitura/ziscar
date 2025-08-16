import { s } from "../safeZod";
import {
  BasePaginationSchema,
  BaseDateRangeSchema,
  BaseIdResponseSchema,
  BasePaginatedResponseSchema,
  BaseIdSchema,
} from "./base.dto";
import {
  VEHICLECATEGORY_VALUES,
  FUELTYPE_VALUES,
  VEHICLESTATUS_VALUES,
  EXPENSECATEGORY_VALUES,
  PAYMENTMETHODPAYABLETYPE_VALUES,
} from "../enums";
import {
  createAccountPayableDTO,
  createAccountPayableInstallmentDTO,
} from "./account-payable.dto";

export const InsertVehicleRequestSchema = s.object({
  chassiNumber: s.string(17),
  modelYear: s.number().nullable(),
  yearOfManufacture: s.number().nullable(),
  modelName: s.string(127).nullable(),
  brandId: s.id(),
  category: s.radio(VEHICLECATEGORY_VALUES).nullable(),
  kilometers: s.number().nullable(),
  plateNumber: s.string(7),
  announcedPrice: s.number().nullable(),
  minimumPrice: s.number().nullable(),
  commissionValue: s.number(),
  color: s.string(6).nullable(),
  fuelType: s.radio(FUELTYPE_VALUES).nullable(),
  status: s.radio(VEHICLESTATUS_VALUES),
  storeId: s.id(),
});

export const InsertVehicleResponseSchema = BaseIdResponseSchema;

export const SearchVehiclesRequestSchema = BasePaginationSchema.merge(
  BaseDateRangeSchema
)
  .extend({
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
  })
  .refine(...s.dateRangeRule);

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

export const InsertVehicleExpenseRequestSchema = s
  .object({
    vehicleId: s.id(),
    category: s.radio(EXPENSECATEGORY_VALUES),
    observations: s.string().nullable(),
    installments: s.array(
      createAccountPayableInstallmentDTO
        .omit({
          accountPayableId: true,
          status: true,
          isRefund: true,
          refundAccountPayableInstallmentId: true,
        })
        .extend({
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
  })
  .merge(createAccountPayableDTO);

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
  userId: s.id(),

  date: s.date(),
});

export const MakeVehicleSaleResponseSchema = BaseIdResponseSchema;

export const UpdateVehicleRequestSchema = InsertVehicleRequestSchema.partial();

export const UpdateVehicleResponseSchema = BaseIdResponseSchema;

export const ArchiveVehicleRequestSchema = BaseIdSchema;

export const UnarchiveVehicleRequestSchema = BaseIdSchema;

export const ArchiveVehicleResponseSchema = s.object({
  id: s.id(),
  archivedAt: s.date(),
});

export const UnarchiveVehicleResponseSchema = s.object({
  id: s.id(),
  archivedAt: s.date().nullable(),
});
