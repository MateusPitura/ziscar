import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountPayableInstallmentService } from './account-payable-installment.service';
import { CreateAccountPayableInstallmentDTO } from 'src/infra/dtos/account-payable-installment/create-account-payable-installment.dto';
import { UpdateAccountPayableInstallmentDTO } from 'src/infra/dtos/account-payable-installment/update-account-payable-installment.dto';
import { AuthRequest } from '../auth/auth.type';
import { CreatePaymentMethodToAccountPayableDTO } from 'src/infra/dtos/account-payable-installment/create-payment-method-to-account-payable-installment.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('account-payable-installments')
@UseGuards(AuthGuard)
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

  @Get('/by-account-payable/:accountPayableId')
  async findAllByAccountPayableId(
    @Param('accountPayableId') accountPayableId: string,
  ) {
    return this.accountPayableInstallmentService.findAllByAccountPayableId(
      accountPayableId,
    );
  }

  @Post('payment-method/:installmentId')
  async addPaymentMethodToInstallment(
    @Param('installmentId') installmentId: string,
    @Body() body: CreatePaymentMethodToAccountPayableDTO,
    @Req() req: AuthRequest,
  ) {
    return this.accountPayableInstallmentService.addPaymentMethodToInstallment(
      installmentId,
      {
        type: body.type,
        paymentDate: body.paymentDate,
        userId: req.authToken.userId, // usar o userId do token (já é number)
      },
    );
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
