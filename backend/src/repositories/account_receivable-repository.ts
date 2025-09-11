import { AccountReceivable } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

export interface SearchRequest {
  page: number;
  limit: number;
  startDate?: Date;
  endDate?: Date;
  overallStatus?: 'PAID' | 'PENDING';
  orderBy?: string;
}

export interface SearchResponseItem {
  id: number;
  description: string;
  receivedFrom: string;
  totalValue: string;
  overallStatus: 'PAID' | 'PENDING';
}

export interface SearchResponse {
  total: number;
  data: AccountReceivable[];
}

export abstract class AccountReceivableRepository {
  abstract create(
    data: CreateInput<AccountReceivable>,
  ): Promise<AccountReceivable>;
  abstract findById(id: string): Promise<AccountReceivable | null>;
  abstract findByInstallmentId(
    installmentId: string,
  ): Promise<AccountReceivable | null>;

  abstract search(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    overallStatus: 'PENDING' | 'PAID',
    totalValue: string): Promise<SearchResponse>;

  abstract update(
    id: string,
    data: UpdateInput<AccountReceivable>,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
