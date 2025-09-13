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
import { AccountPayableService } from './account-payable.service';
import { CreateAccountPayableDTO } from 'src/infra/dtos/account-payable/create-account-payable.dto';
import { UpdateAccountPayableDTO } from 'src/infra/dtos/account-payable/update-account-payable.dto';
import { QueryAccountReceivableDTO } from 'src/infra/dtos/account-receivable/query-account-receivable-dto';

@Controller('account-payable')
export class AccountPayableController {
  constructor(private readonly accountPayableService: AccountPayableService) { }

  @Post('/')
  async create(@Body() body: CreateAccountPayableDTO) {
    return this.accountPayableService.create(body);
  }

  @Get('search')
  async searchAccountsPayable(@Query() query: QueryAccountReceivableDTO) {
    return this.accountPayableService.search(
      query.description ?? '',
      query.page,
      query.limit,
      query.startDate ? new Date(query.startDate) : new Date('1970-01-01'),
      query.endDate ? new Date(query.endDate) : new Date(),
      query.overallStatus,
    );
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.accountPayableService.findById(id);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateAccountPayableDTO) {
    return this.accountPayableService.update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.accountPayableService.delete(id);
  }
}
