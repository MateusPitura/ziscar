import { ITEMS_PER_PAGE } from "../constants";
import {
  InstallmentStatus,
  PaymentMethodPayableType,
  PaymentMethodReceivableType,
} from "../enums";
import { s } from "../safeZod";

export const createAccountReceivableDTO = s.object({
  description: s.string(),
  receivedFrom: s.string(),
});

export const updateAccountReceivableDTO = s.object({
  description: s.string(),
  receivedFrom: s.string(),
});

export const queryAccountReceivableDTO = s.object({
  page: s
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(s.number().min(1)),
  limit: s
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(s.number().min(1).max(100))
    .optional()
    .default(String(ITEMS_PER_PAGE)),
  startDate: s.string().optional(),
  endDate: s.string().optional(),
  overallStatus: s.enumeration(["PAID", "PENDING"]).optional(),
  orderBy: s.string().optional(),
  description: s.string().optional(),
});

export const createAccountReceivableInstallmentDTO = s.object({
  installmentSequence: s.number().min(0),
  dueDate: s.date(),
  value: s.number().min(0),
  status: s.nativeEnum(InstallmentStatus),
  isRefund: s.boolean().default(false),
  isUpfront: s.boolean().default(false),
  accountReceivableId: s.id(),
  refundAccountReceivableInstallmentId: s.id().nullable(),
});

export const updateAccountReceivableInstallmentDTO = s.object({
  installmentSequence: s.number().min(0),
  dueDate: s.date(),
  value: s.number().min(0),
  status: s.nativeEnum(InstallmentStatus),
  isRefund: s.boolean().default(false),
  isUpfront: s.boolean().default(false),
});

export const createPaymentMethodToInstallmentDTO = s.object({
  paymentDate: s.string(),
  type: s.nativeEnum(PaymentMethodReceivableType),
});

export const createPaymentMethodAccountPayableToInstallmentDTO = s.object({
  paymentDate: s.string(),
  type: s.nativeEnum(PaymentMethodPayableType),
});

export const queryAccountReceivableInstallmentsDTO = s.object({
  page: s.string().optional(),
  limit: s.string().optional(),
  dueDate: s.string().optional(),
});
