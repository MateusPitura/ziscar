import { InstallmentStatus } from "@shared/enums";
import { s } from "@shared/safeZod";

export const createAccountPayableDTO = s.object({
  description: s.string(127),
  paidTo: s.string(),
});

export const updateAccountPayableDTO = s.object({
  description: s.string(127).optional(),
  paidTo: s.string().optional(),
});

export const createAccountPayableInstallmentDTO = s.object({
  installmentSequence: s.number().min(0),
  dueDate: s.date(),
  value: s.number().min(0),
  status: s.nativeEnum(InstallmentStatus),
  isRefund: s.boolean().default(false),
  isUpfront: s.boolean().default(false),
  accountPayableId: s.id(),
  refundAccountPayableInstallmentId: s.id().nullable(),
});
