import { AccountPayable } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

export interface SearchResponse {
  total: number;
  data: {
    id: number;
    description: string;
    paidTo: string;
    totalValue: number;
    overallStatus: 'PAID' | 'PENDING';
  }[];
}

export interface FindByIdResponse
  extends Omit<AccountPayable, 'createdAt' | 'updatedAt' | 'archivedAt'> {
  totalValue: number;
  overallStatus: 'PAID' | 'PENDING';
  installmentsNumber: number;
}

export abstract class AccountPayableRepository {
  abstract create(data: CreateInput<AccountPayable>): Promise<AccountPayable>;
  abstract findById(id: string): Promise<FindByIdResponse | null>;
  abstract search(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    overallStatus: 'PENDING' | 'PAID',
    totalValue: string,
  ): Promise<SearchResponse>;
  abstract update(id: string, data: UpdateInput<AccountPayable>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
