import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { QueryAccountReceivableDTO } from 'src/infra/dtos/account-receivable/query-account-receivable-dto';
import { AuthRequest } from '../auth/auth.type';
import { AccountPayableService } from './account-payable.service';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Actions, Resources } from '@prisma/client';

@Controller('account-payable')
@UseGuards(AuthGuard)
export class AccountPayableController {
  constructor(private readonly accountPayableService: AccountPayableService) {}

  @Get('search')
  @RoleGuard(Resources.ACCOUNTS_PAYABLE, Actions.READ)
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
  @RoleGuard(Resources.ACCOUNTS_PAYABLE, Actions.READ)
  async findById(@Param('id') id: string, @Req() req: AuthRequest) {
    const { enterpriseId } = req.authToken;
    return this.accountPayableService.findById(id, enterpriseId);
  }
}
