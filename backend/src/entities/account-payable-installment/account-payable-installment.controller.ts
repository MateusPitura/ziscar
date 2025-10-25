import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentMethodToAccountPayableDTO } from 'src/infra/dtos/account-payable-installment/create-payment-method-to-account-payable-installment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.type';
import { AccountPayableInstallmentService } from './account-payable-installment.service';

@Controller('account-payable-installments')
@UseGuards(AuthGuard)
export class AccountPayableInstallmentController {
  constructor(
    private readonly accountPayableInstallmentService: AccountPayableInstallmentService,
  ) {}

  @Get('/by-account-payable/:accountPayableId')
  async findAllByAccountPayableId(
    @Param('accountPayableId') accountPayableId: string,
    @Req() req: AuthRequest,
  ) {
    const { enterpriseId } = req.authToken;
    return this.accountPayableInstallmentService.findAllByAccountPayableId(
      accountPayableId,
      enterpriseId,
    );
  }

  @Post('payment-method/:installmentId')
  async addPaymentMethodToInstallment(
    @Param('installmentId') installmentId: string,
    @Body() body: CreatePaymentMethodToAccountPayableDTO,
    @Req() req: AuthRequest,
  ) {
    const { userId, enterpriseId } = req.authToken;
    return this.accountPayableInstallmentService.addPaymentMethodToInstallment(
      installmentId,
      {
        type: body.type,
        paymentDate: body.paymentDate,
        userId,
      },
      enterpriseId,
    );
  }
}
