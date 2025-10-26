import { AccountPayable } from '@prisma/client';
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
    paidTo: string;
    totalValue: number;
    overallStatus: 'PAID' | 'PENDING';
    date: Date | null;
  }[];
}

export interface FindByIdResponse
  extends Omit<
    AccountPayable,
    'createdAt' | 'updatedAt' | 'archivedAt' | 'enterpriseId'
  > {
  totalValue: number;
  overallStatus: 'PAID' | 'PENDING';
  installmentsNumber: number;
}

export abstract class AccountPayableRepository {
  abstract create(data: CreateInput<AccountPayable>): Promise<AccountPayable>;
  abstract findById(
    id: string,
    enterpriseId: number,
  ): Promise<FindByIdResponse | null>;
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
