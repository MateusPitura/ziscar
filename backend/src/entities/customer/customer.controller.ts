import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Actions, Resources } from '@prisma/client';
import { AuthRequest } from '../auth/auth.type';
import { ParamInputs } from 'src/types';
import { CustomerService } from './customer.service';
import {
  CustomerDeleteInDto,
  CustomerFindManyInDto,
  CustomerPatchInDto,
  CustomerPostInDto,
} from './customer.schema';
import { FETCH_CUSTOMER, GET_CUSTOMER } from './customer.constant';

@Controller('customer')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @RoleGuard(Resources.CUSTOMERS, Actions.CREATE)
  @Post()
  post(@Req() req: AuthRequest, @Body() customerPostInDto: CustomerPostInDto) {
    const { enterpriseId } = req.authToken;

    const createCustomerPayload = {
      ...customerPostInDto,
      enterpriseId,
    };
    return this.customerService.create({
      customerCreateInDto: createCustomerPayload,
    });
  }

  @RoleGuard(Resources.CUSTOMERS, Actions.READ)
  @Get()
  async findMany(
    @Req() req: AuthRequest,
    @Query() customerFindManyInDto: CustomerFindManyInDto,
  ) {
    const { enterpriseId } = req.authToken;
    return await this.customerService.findMany({
      customerFindManyInDto,
      select: FETCH_CUSTOMER,
      enterpriseId,
    });
  }

  @RoleGuard(Resources.CUSTOMERS, Actions.READ)
  @Get(':id')
  async get(@Req() req: AuthRequest, @Param() { id }: ParamInputs) {
    const { enterpriseId } = req.authToken;

    return await this.customerService.findOne({
      where: { id: +id },
      select: GET_CUSTOMER,
      enterpriseId,
    });
  }

  @RoleGuard(Resources.CUSTOMERS, Actions.UPDATE)
  @Patch(':id')
  async patch(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() customerPatchInDto: CustomerPatchInDto,
  ) {
    const { enterpriseId } = req.authToken;

    return await this.customerService.update({
      where: { id: +id },
      customerUpdateInDto: customerPatchInDto,
      enterpriseId,
    });
  }

  @RoleGuard(Resources.CUSTOMERS, Actions.DELETE)
  @Delete(':id')
  async disable(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() userDeleteInDto: CustomerDeleteInDto,
  ) {
    const { enterpriseId } = req.authToken;

    return await this.customerService.update({
      where: { id: +id },
      customerUpdateInDto: userDeleteInDto,
      enterpriseId,
    });
  }
}
