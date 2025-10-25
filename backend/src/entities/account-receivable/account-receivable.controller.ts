import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { QueryAccountReceivableDTO } from 'src/infra/dtos/account-receivable/query-account-receivable-dto';
import { AuthRequest } from '../auth/auth.type';
import { AccountReceivableService } from './account-receivable.service';

@Controller('account-receivable')
export class AccountReceivableController {
  constructor(
    private readonly AccountReceivableService: AccountReceivableService,
  ) {}

  @Get('search')
  async searchAccountsReceivable(
    @Query() query: QueryAccountReceivableDTO,
    @Req() req: AuthRequest,
  ) {
    const { enterpriseId } = req.authToken;
    return this.AccountReceivableService.search(
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
  async findByIdAccountReceivable(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    const { enterpriseId } = req.authToken;
    return this.AccountReceivableService.findById(id, enterpriseId);
  }

  @Get('/by-installment/:installmentId')
  async findByInstallmentId(
    @Param('installmentId') installmentId: string,
    @Req() req: AuthRequest,
  ) {
    const { enterpriseId } = req.authToken;
    return this.AccountReceivableService.findByInstallmentId(
      installmentId,
      enterpriseId,
    );
  }
}
