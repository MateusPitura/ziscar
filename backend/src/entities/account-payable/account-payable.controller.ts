import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { QueryAccountReceivableDTO } from 'src/infra/dtos/account-receivable/query-account-receivable-dto';
import { AuthRequest } from '../auth/auth.type';
import { AccountPayableService } from './account-payable.service';

@Controller('account-payable')
export class AccountPayableController {
  constructor(private readonly accountPayableService: AccountPayableService) {}

  @Get('search')
  async searchAccountsPayable(
    @Query() query: QueryAccountReceivableDTO,
    @Req() req: AuthRequest,
  ) {
    const { enterpriseId } = req.authToken;
    return this.accountPayableService.search(
      query.description ?? '',
      query.page,
      query.limit,
      query.startDate ? new Date(query.startDate) : new Date('1970-01-01'),
      query.endDate ? new Date(query.endDate) : new Date(),
      enterpriseId,
      query.overallStatus,
    );
  }

  @Get('/:id')
  async findById(@Param('id') id: string, @Req() req: AuthRequest) {
    const { enterpriseId } = req.authToken;
    return this.accountPayableService.findById(id, enterpriseId);
  }
}
