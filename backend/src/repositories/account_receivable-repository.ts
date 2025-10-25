import { AccountReceivable } from '@prisma/client';
import { CreateInput } from 'src/types';

export interface SearchResponse {
  total: number;
  summary: {
    totalPaid: number;
    totalPending: number;
    totalOverall: number;
  };
  data: {
    id: number;
    description: string;
    receivedFrom: string;
    totalValue: number;
    overallStatus: 'PAID' | 'PENDING';
    vehicleSaleId: number | null;
    date: Date | null;
  }[];
}

export abstract class AccountReceivableRepository {
  abstract create(
    data: CreateInput<AccountReceivable>,
  ): Promise<AccountReceivable>;

  abstract findById(
    id: string,
    enterpriseId: number,
  ): Promise<AccountReceivable | null>;

  abstract findByInstallmentId(
    installmentId: string,
    enterpriseId: number,
  ): Promise<AccountReceivable | null>;

  abstract search(
    query: string,
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    enterpriseId: number,
    overallStatus: 'PENDING' | 'PAID',
  ): Promise<SearchResponse>;
}
