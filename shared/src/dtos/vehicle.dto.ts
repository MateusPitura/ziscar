import {
  EXPENSECATEGORY_VALUES,
  FUELTYPE_VALUES,
  PAYMENTMETHODPAYABLETYPE_VALUES,
  PAYMENTMETHODRECEIVABLETYPE_VALUES,
  VEHICLECATEGORY_VALUES,
  VEHICLESTATUS_VALUES,
} from "../enums";
import { s } from "../safeZod";
import { VehicleStatusForFilter } from "../types";
import {
  createAccountPayableDTO,
  createAccountPayableInstallmentDTO,
} from "./account-payable.dto";
import {
  createAccountReceivableDTO,
  createAccountReceivableInstallmentDTO,
} from "./account-receivable.dto";
import {
  BaseDateRangeSchema,
  BaseIdResponseSchema,
  BaseIdSchema,
  BasePaginatedResponseSchema,
  BasePaginationSchema,
} from "./base.dto";

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
  payment: s
    .object({
      purchaseDate: s.date(),
      paidTo: s.string(127).nullable(),
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
                  paymentDate: s.date(),
                })
              )
              .nullable(),
          })
      ),
    })
    .optional(),
});

export const InsertVehicleResponseSchema = BaseIdResponseSchema;

export const SearchVehiclesRequestSchema = BasePaginationSchema.merge(
  BaseDateRangeSchema
)
  .extend({
    storeId: s.id().optional(),
    brandId: s.id().optional(),
    status: s.enumeration(VehicleStatusForFilter).optional(),
    category: s.enumeration(VEHICLECATEGORY_VALUES).optional(),
    modelYear: s.number().optional(),
    yearOfManufacture: s.number().optional(),
    modelName: s.string().optional(),
    plateNumber: s.string(7).optional(),
    announcedPriceMin: s.number().optional(),
    announcedPriceMax: s.number().optional(),
  })
  .refine(...s.dateRangeRule);

export const SearchPaidToRequestSchema = s.object({
  paidTo: s.string().optional(),
});

export const SearchModelRequestSchema = s.object({
  modelName: s.string().optional(),
});

export const VehicleItemResponseSchema = s.object({
  id: s.id(),
  chassiNumber: s.string(17),
  modelYear: s.number().nullable(),
  yearOfManufacture: s.number().nullable(),
  modelName: s.string(127).nullable(),
  storeId: s.id(),
  status: s.enumeration(VEHICLESTATUS_VALUES),
  category: s.enumeration(VEHICLECATEGORY_VALUES).nullable(),
  announcedPrice: s.number().nullable(),
  plateNumber: s.string(7),
  archivedAt: s.date().nullable().optional(),
  kilometers: s.number().nullable(),
  minimumPrice: s.number().nullable(),
  commissionValue: s.number(),
  color: s.string(6).nullable(),
  fuelType: s.enumeration(FUELTYPE_VALUES).nullable(),
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

export const SearchVehiclesResponseSchema = BasePaginatedResponseSchema(
  VehicleItemResponseSchema
);

export const SearchPaidToResponseSchema = s.object({
  data: s.array(
    s.object({
      paidTo: s.string().nullable(),
      id: s.id(),
    })
  ),
});

export const SearchModelResponseSchema = s.object({
  data: s.array(
    s.object({
      modelName: s.string().nullable(),
      id: s.id(),
    })
  ),
});


export const InsertVehicleExpenseRequestSchema = s
  .object({
    vehicleId: s.id(),
    category: s.enumeration(EXPENSECATEGORY_VALUES),
    observations: s.string().nullable(),
    competencyDate: s.date(),
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
                paymentDate: s.date(),
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
              paymentDate: s.date(),
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
    characteristics: s.array(s.string()).optional(),
    payment: s
      .object({
        purchaseDate: s.date().optional(),
        paidTo: s.string().nullable().optional(),
      })
      .optional(),
  });

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

export const ArchiveVehicleExpenseResponseSchema = s.object({
  id: s.id(),
  archivedAt: s.date(),
});

export const UnarchiveVehicleExpenseResponseSchema = s.object({
  id: s.id(),
  archivedAt: s.date().nullable(),
});

export const VehicleExpenseResponseSchema = s.object({
  id: s.id(),
  vehicleId: s.id(),
  category: s.enumeration(EXPENSECATEGORY_VALUES),
  observations: s.string().nullable(),
  competencyDate: s.date(),
  archivedAt: s.date().nullable(),
  totalValue: s.number(),
  accountPayable: s
    .object({
      description: s.string().nullable(),
      paidTo: s.string().nullable(),
    })
    .optional(),
});

export const VehicleSaleResponseSchema = s.object({
  id: s.id(),
  vehicleId: s.id(),
  customerId: s.id(),
  date: s.date(),
  userId: s.id(),
  archivedAt: s.date().nullable(),
  vehicleSnapshot: s.record(s.unknown()).nullable(),
  customerSnapshot: s.record(s.unknown()).nullable(),
  accountReceivable: s
    .object({
      description: s.string().nullable(),
      receivedFrom: s.string().nullable(),
    })
    .optional(),
  accountPayable: s
    .object({
      description: s.string().nullable(),
      paidTo: s.string().nullable(),
    })
    .optional(),
});

export const VehicleWithPaymentResponseSchema =
  VehicleItemResponseSchema.extend({
    payment: s
      .object({
        purchaseDate: s.date(),
        paidTo: s.string().nullable(),
        value: s.numberPositive(),
      })
      .optional(),
  });

export const UpdateVehicleExpenseRequestSchema = s.object({
  observations: s.string().nullable().optional(),
  category: s.enumeration(EXPENSECATEGORY_VALUES).optional(),
  competencyDate: s.date().optional(),
});

export const UpdateVehicleResponseSchema = VehicleWithPaymentResponseSchema;
