import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Actions, Resources } from '@prisma/client';
import { QueryAccountReceivableDTO } from 'src/infra/dtos/account-receivable/query-account-receivable-dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.type';
import { RoleGuard } from '../auth/role.guard';
import { AccountReceivableService } from './account-receivable.service';

@Controller('account-receivable')
@UseGuards(AuthGuard)
export class AccountReceivableController {
  constructor(
    private readonly AccountReceivableService: AccountReceivableService,
  ) {}

  @Get('search')
  @RoleGuard(Resources.ACCOUNTS_RECEIVABLE, Actions.READ)
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
  @RoleGuard(Resources.ACCOUNTS_RECEIVABLE, Actions.READ)
  async findByIdAccountReceivable(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    const { enterpriseId } = req.authToken;
    return this.AccountReceivableService.findById(id, enterpriseId);
  }
}
