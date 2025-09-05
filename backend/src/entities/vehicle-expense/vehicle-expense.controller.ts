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
import { InsertExpenseUseCase } from './use-case/insert-expense.use-case';
import { ArchiveVehicleExpenseUseCase } from './use-case/archive-vehicle-expense.use-case';
import { GetVehicleExpenseByIdUseCase } from './use-case/get-vehicle-expense-by-id.use-case';
import { FetchVehicleExpensesUseCase } from './use-case/fetch-vehicle-expenses.use-case';
import { UnarchiveVehicleExpenseUseCase } from './use-case/unarchive-vehicle-expense.use-case';
import { UpdateVehicleExpenseUseCase } from './use-case/update-vehicle-expense.use-case';
import { AuthGuard } from 'src/entities/auth/auth.guard';
import { RoleGuard } from 'src/entities/auth/role.guard';
import { Actions, Resources } from '@prisma/client';
import {
  InsertVehicleExpenseRequestDto,
  UpdateVehicleExpenseRequestDto,
  InsertVehicleExpenseResponseDto,
  ArchiveVehicleExpenseResponseDto,
  UnarchiveVehicleExpenseResponseDto,
  VehicleExpenseResponseDto,
} from './dtos';
import { AuthRequest } from '../auth/auth.type';

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
    const { userId } = req.authToken;
    return this.insertExpense.execute(input, userId);
  }

  @Get(':vehicleId')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.READ)
  async fetchExpenses(
    @Param('vehicleId') vehicleId: string,
  ): Promise<VehicleExpenseResponseDto[]> {
    return this.fetchVehicleExpenses.execute(vehicleId);
  }

  @Get('detail/:expenseId')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.READ)
  async getExpenseById(
    @Param('expenseId') expenseId: string,
  ): Promise<VehicleExpenseResponseDto> {
    return this.getVehicleExpenseById.execute(expenseId);
  }

  @Patch(':expenseId')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.UPDATE)
  async updateExpense(
    @Param('expenseId') expenseId: string,
    @Body() input: UpdateVehicleExpenseRequestDto,
  ): Promise<VehicleExpenseResponseDto> {
    return this.updateVehicleExpense.execute(expenseId, input);
  }

  @Patch(':expenseId/archive')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.UPDATE)
  async archiveExpense(
    @Param('expenseId') expenseId: string,
  ): Promise<ArchiveVehicleExpenseResponseDto> {
    return this.archiveVehicleExpense.execute(expenseId);
  }

  @Patch(':expenseId/unarchive')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.UPDATE)
  async unarchiveExpense(
    @Param('expenseId') expenseId: string,
  ): Promise<UnarchiveVehicleExpenseResponseDto> {
    return this.unarchiveVehicleExpense.execute(expenseId);
  }
}
