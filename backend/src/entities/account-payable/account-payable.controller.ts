import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AccountPayableService } from './account-payable.service';
import { CreateAccountPayableDTO } from 'src/infra/dtos/account-payable/create-account-payable.dto';
import { UpdateAccountPayableDTO } from 'src/infra/dtos/account-payable/update-account-payable.dto';

@Controller('account-payable')
export class AccountPayableController {
  constructor(private readonly accountPayableService: AccountPayableService) {}

  @Post('/')
  async create(@Body() body: CreateAccountPayableDTO) {
    return this.accountPayableService.create(body);
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
