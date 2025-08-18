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
  PAYMENTMETHODRECEIVABLETYPE_VALUES,
} from "../enums";
import {
  createAccountPayableDTO,
  createAccountPayableInstallmentDTO,
} from "./account-payable.dto";
import {
  createAccountReceivableDTO,
  createAccountReceivableInstallmentDTO,
} from "./account-receivable.dto";

export const InsertVehicleRequestSchema = s.object({
  chassiNumber: s.string(17),
  modelYear: s.number().nullable(),
  yearOfManufacture: s.number().nullable(),
  modelName: s.string(127).nullable(),
  brandId: s.id(),
  category: s.enumeration(VEHICLECATEGORY_VALUES).nullable(),
  kilometers: s.number().nullable(),
  plateNumber: s.string(7),
  announcedPrice: s.number().nullable(),
  minimumPrice: s.number().nullable(),
  commissionValue: s.number(),
  color: s.string(6).nullable(),
  fuelType: s.enumeration(FUELTYPE_VALUES).nullable(),
  status: s.enumeration(VEHICLESTATUS_VALUES),
  storeId: s.id(),
  characteristics: s.array(s.string()).optional(),
});

export const InsertVehicleResponseSchema = BaseIdResponseSchema;

export const SearchVehiclesRequestSchema = BasePaginationSchema.merge(
  BaseDateRangeSchema
)
  .extend({
    storeId: s.id().optional(),
    brandId: s.id().optional(),
    status: s.enumeration(VEHICLESTATUS_VALUES).optional(),
    category: s.enumeration(VEHICLECATEGORY_VALUES).optional(),
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
  storeId: s.id(),
  status: s.enumeration(VEHICLESTATUS_VALUES),
  category: s.enumeration(VEHICLECATEGORY_VALUES).nullable(),
  announcedPrice: s.number().nullable(),
  plateNumber: s.string(7),
  archivedAt: s.date().nullable().optional(),
  vehicleCharacteristicValues: s
    .array(
      s.object({
        id: s.id(),
        characteristic: s.string(),
      })
    )
    .optional(),
  brand: s
    .object({
      id: s.id(),
      name: s.string(),
    })
    .optional(),
  store: s
    .object({
      id: s.id(),
      name: s.string(),
    })
    .optional(),
});

export const SearchVehiclesResponseSchema =
  BasePaginatedResponseSchema(VehicleItemSchema);

export const InsertVehicleExpenseRequestSchema = s
  .object({
    vehicleId: s.id(),
    category: s.enumeration(EXPENSECATEGORY_VALUES),
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
                type: s.enumeration(PAYMENTMETHODPAYABLETYPE_VALUES),
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
  date: s.date(),
  commissionValue: s.number().min(0),
  accountReceivable: createAccountReceivableDTO,
  installments: s.array(
    createAccountReceivableInstallmentDTO
      .omit({
        installmentSequence: true,
        accountReceivableId: true,
        status: true,
        isRefund: true,
        refundAccountReceivableInstallmentId: true,
      })
      .extend({
        paymentMethods: s
          .array(
            s.object({
              type: s.enumeration(PAYMENTMETHODRECEIVABLETYPE_VALUES),
              value: s.number(),
              paymentDate: s.date().nullable(),
            })
          )
          .nullable(),
      })
  ),
});

export const MakeVehicleSaleResponseSchema = BaseIdResponseSchema;

export const UpdateVehicleRequestSchema = InsertVehicleRequestSchema.omit({
  characteristics: true,
})
  .partial()
  .extend({
    characteristics: s
      .array(
        s.object({
          id: s.id().optional(),
          characteristic: s.string(127),
        })
      )
      .optional(),
  });

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
