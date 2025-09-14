import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateAccountReceivableDTO } from 'src/infra/dtos/account-receivable/create-account-receivable.dto';
import { QueryAccountReceivableDTO } from 'src/infra/dtos/account-receivable/query-account-receivable-dto';
import { UpdateAccountReceivableDTO } from 'src/infra/dtos/account-receivable/update-account-receivable.dto';
import { AccountReceivableService } from './account-receivable.service';

@Controller('account-receivable')
export class AccountReceivableController {
  constructor(
    private readonly AccountReceivableService: AccountReceivableService,
  ) { }

  @Post('/')
  async createAccountReceivable(@Body() body: CreateAccountReceivableDTO) {
    return this.AccountReceivableService.create(body);
  }

  @Get('search')
  async searchAccountsReceivable(@Query() query: QueryAccountReceivableDTO) {
    return this.AccountReceivableService.search(
      query.description ?? '',
      query.page,
      query.limit,
      query.startDate ? new Date(query.startDate) : new Date('1970-01-01'),
      query.endDate ? new Date(query.endDate) : new Date(),
      query.overallStatus,
    );
  }

  @Get('/:id')
  async findByIdAccountReceivable(@Param('id') id: string) {
    return this.AccountReceivableService.findById(id);
  }

  @Get('/by-installment/:installmentId')
  async findByInstallmentId(@Param('installmentId') installmentId: string) {
    return this.AccountReceivableService.findByInstallmentId(installmentId);
  }

  @Put('/:id')
  async updateAccountReceivable(
    @Param('id') id: string,
    @Body() body: UpdateAccountReceivableDTO,
  ) {
    return this.AccountReceivableService.update(id, body);
  }

  @Delete('/:id')
  async deleteAccountReceivable(@Param('id') id: string) {
    return this.AccountReceivableService.delete(id);
  }
}
