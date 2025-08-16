import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AccountPayableInstallmentService } from './account-payable-installment.service';
import { CreateAccountPayableInstallmentDTO } from 'src/infra/dtos/account-payable-installment/create-account-payable-installment.dto';
import { UpdateAccountPayableInstallmentDTO } from 'src/infra/dtos/account-payable-installment/update-account-payable-installment.dto';

@Controller('account-payable-installment')
export class AccountPayableInstallmentController {
  constructor(
    private readonly accountPayableInstallmentService: AccountPayableInstallmentService,
  ) {}

  @Post('/')
  async createAccountPayableInstallment(
    @Body() body: CreateAccountPayableInstallmentDTO,
  ) {
    return this.accountPayableInstallmentService.create(body);
  }

  @Get('/:id')
  async findByIdAccountPayableInstallment(@Param('id') id: string) {
    return this.accountPayableInstallmentService.findById(id);
  }

  @Put('/:id')
  async updateAccountPayableInstallment(
    @Param('id') id: string,
    @Body() body: UpdateAccountPayableInstallmentDTO,
  ) {
    return this.accountPayableInstallmentService.update(id, body);
  }

  @Delete('/:id')
  async deleteAccountPayableInstallment(@Param('id') id: string) {
    return this.accountPayableInstallmentService.delete(id);
  }
}
