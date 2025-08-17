import { InstallmentStatus } from "@shared/enums";
import { s } from "../safeZod";

export const createAccountReceivableDTO = s.object({
  description: s.string(),
  receivedFrom: s.string(),
});

export const updateAccountReceivableDTO = s.object({
  description: s.string(),
  receivedFrom: s.string(),
});

export const createAccountReceivableInstallmentDTO = s.object({
  installmentSequence: s.number().min(1),
  dueDate: s.date(),
  value: s.number().min(0),
  status: s.nativeEnum(InstallmentStatus),
  isRefund: s.boolean().default(false),
  isUpfront: s.boolean().default(false),
  accountReceivableId: s.id(),
  refundAccountReceivableInstallmentId: s.id().nullable(),
});

export const updateAccountReceivableInstallmentDTO = s.object({
  installmentSequence: s.number().min(1),
  dueDate: s.date(),
  value: s.number().min(0),
  status: s.nativeEnum(InstallmentStatus),
  isRefund: s.boolean().default(false),
  isUpfront: s.boolean().default(false),
});
