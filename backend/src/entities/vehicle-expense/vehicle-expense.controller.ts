import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Actions, Resources } from '@prisma/client';
import { AuthGuard } from 'src/entities/auth/auth.guard';
import { RoleGuard } from 'src/entities/auth/role.guard';
import { AuthRequest } from '../auth/auth.type';
import {
  ArchiveVehicleExpenseResponseDto,
  InsertVehicleExpenseRequestDto,
  InsertVehicleExpenseResponseDto,
  UnarchiveVehicleExpenseResponseDto,
  UpdateVehicleExpenseRequestDto,
  VehicleExpenseResponseDto,
} from './dtos';
import { ArchiveVehicleExpenseUseCase } from './use-case/archive-vehicle-expense.use-case';
import { FetchVehicleExpensesUseCase } from './use-case/fetch-vehicle-expenses.use-case';
import { GetVehicleExpenseByIdUseCase } from './use-case/get-vehicle-expense-by-id.use-case';
import { InsertExpenseUseCase } from './use-case/insert-expense.use-case';
import { UnarchiveVehicleExpenseUseCase } from './use-case/unarchive-vehicle-expense.use-case';
import { UpdateVehicleExpenseUseCase } from './use-case/update-vehicle-expense.use-case';

@Controller('vehicle-expense')
@UseGuards(AuthGuard)
export class VehicleExpenseController {
  constructor(
    private readonly insertExpense: InsertExpenseUseCase,
    private readonly fetchVehicleExpenses: FetchVehicleExpensesUseCase,
    private readonly getVehicleExpenseById: GetVehicleExpenseByIdUseCase,
    private readonly updateVehicleExpense: UpdateVehicleExpenseUseCase,
    private readonly archiveVehicleExpense: ArchiveVehicleExpenseUseCase,
    private readonly unarchiveVehicleExpense: UnarchiveVehicleExpenseUseCase,
  ) {}

  @Post()
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.CREATE)
  async insertVehicleExpense(
    @Body() input: InsertVehicleExpenseRequestDto,
    @Req() req: AuthRequest,
  ): Promise<InsertVehicleExpenseResponseDto> {
    const { userId, enterpriseId } = req.authToken;
    return this.insertExpense.execute(input, userId, enterpriseId);
  }

  @Get(':vehicleId')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.READ)
  async fetchExpenses(
    @Param('vehicleId') vehicleId: string,
    @Req() req: AuthRequest,
  ): Promise<VehicleExpenseResponseDto[]> {
    const { enterpriseId } = req.authToken;
    return this.fetchVehicleExpenses.execute(vehicleId, enterpriseId);
  }

  @Get('detail/:expenseId')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.READ)
  async getExpenseById(
    @Param('expenseId') expenseId: string,
    @Req() req: AuthRequest,
  ): Promise<VehicleExpenseResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.getVehicleExpenseById.execute(expenseId, enterpriseId);
  }

  @Patch(':expenseId')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.UPDATE)
  async updateExpense(
    @Param('expenseId') expenseId: string,
    @Body() input: UpdateVehicleExpenseRequestDto,
    @Req() req: AuthRequest,
  ): Promise<VehicleExpenseResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.updateVehicleExpense.execute(expenseId, input, enterpriseId);
  }

  @Patch(':expenseId/archive')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.UPDATE)
  async archiveExpense(
    @Param('expenseId') expenseId: string,
    @Req() req: AuthRequest,
  ): Promise<ArchiveVehicleExpenseResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.archiveVehicleExpense.execute(expenseId, enterpriseId);
  }

  @Patch(':expenseId/unarchive')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.UPDATE)
  async unarchiveExpense(
    @Param('expenseId') expenseId: string,
    @Req() req: AuthRequest,
  ): Promise<UnarchiveVehicleExpenseResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.unarchiveVehicleExpense.execute(expenseId, enterpriseId);
  }
}
