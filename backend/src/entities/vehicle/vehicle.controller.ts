import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Actions, Resources } from '@prisma/client';
import { AuthGuard } from 'src/entities/auth/auth.guard';
import { RoleGuard } from 'src/entities/auth/role.guard';
import { AuthRequest } from '../auth/auth.type';
import {
  ArchiveVehicleResponseDto,
  FetchVehicleBrandsResponseDto,
  InsertVehicleRequestDto,
  InsertVehicleResponseDto,
  MakeVehicleSaleRequestDto,
  MakeVehicleSaleResponseDto,
  SearchPaidToRequestDto,
  SearchPaidToResponseDto,
  SearchVehiclesRequestDto,
  SearchVehiclesResponseDto,
  UnarchiveVehicleResponseDto,
  UpdateVehicleRequestDto,
  UpdateVehicleResponseDto,
  VehicleSaleResponseDto,
  VehicleWithPaymentResponseDto,
} from './dtos';
import { ArchiveVehicleUseCase } from './use-case/archive-vehicle.use-case';
import { FetchBrandsUseCase } from './use-case/fetch-brands.use-case';
import { GetVehicleByIdUseCase } from './use-case/get-vehicle-by-id.use-case';
import { GetVehicleSaleUseCase } from './use-case/get-vehicle-sale.use-case';
import { InsertVehicleUseCase } from './use-case/insert-vehicle.use-case';
import { MakeSaleUseCase } from './use-case/make-sale.use-case';
import { SearchPaidToUseCase } from './use-case/search-paid-to.use-case';
import { SearchVehiclesUseCase } from './use-case/search-vehicles.use-case';
import { UnarchiveVehicleUseCase } from './use-case/unarchive-vehicle.use-case';
import { UpdateVehicleUseCase } from './use-case/update-vehicle.use-case';

@Controller('vehicles')
@UseGuards(AuthGuard)
export class VehicleController {
  constructor(
    private readonly insertVehicle: InsertVehicleUseCase,
    private readonly searchVehicles: SearchVehiclesUseCase,
    private readonly searchPaidToVehicle: SearchPaidToUseCase,
    private readonly fetchBrands: FetchBrandsUseCase,
    private readonly makeSale: MakeSaleUseCase,
    private readonly updateVehicle: UpdateVehicleUseCase,
    private readonly archiveVehicle: ArchiveVehicleUseCase,
    private readonly unarchiveVehicle: UnarchiveVehicleUseCase,
    private readonly getVehicleSale: GetVehicleSaleUseCase,
    private readonly fetchVehicleById: GetVehicleByIdUseCase,
  ) {}

  @Post()
  @RoleGuard(Resources.VEHICLES, Actions.CREATE)
  async create(
    @Body() input: InsertVehicleRequestDto,
    @Req() req: AuthRequest,
  ): Promise<InsertVehicleResponseDto> {
    const { userId } = req.authToken;
    return this.insertVehicle.execute(input, userId);
  }

  @Get()
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async search(
    @Query() query: SearchVehiclesRequestDto,
  ): Promise<SearchVehiclesResponseDto> {
    return this.searchVehicles.execute(query);
  }

  @Get('/paid-to')
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async searchPaidTo(
    @Query() query: SearchPaidToRequestDto,
  ): Promise<SearchPaidToResponseDto> {
    return this.searchPaidToVehicle.execute(query);
  }

  @Get('brands')
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async brands(): Promise<FetchVehicleBrandsResponseDto> {
    return this.fetchBrands.execute();
  }

  @Post('sale')
  @RoleGuard(Resources.VEHICLE_SALE, Actions.CREATE)
  async sale(
    @Body() input: MakeVehicleSaleRequestDto,
    @Req() req: AuthRequest,
  ): Promise<MakeVehicleSaleResponseDto> {
    const { userId } = req.authToken;
    return this.makeSale.execute(input, userId);
  }

  @Patch(':id')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() input: UpdateVehicleRequestDto,
  ): Promise<UpdateVehicleResponseDto> {
    return this.updateVehicle.execute(id, input);
  }

  @Patch(':id/archive')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async archive(@Param('id') id: string): Promise<ArchiveVehicleResponseDto> {
    const payload = { id: Number(id) };
    return this.archiveVehicle.execute(payload);
  }

  @Patch(':id/unarchive')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async unarchive(
    @Param('id') id: string,
  ): Promise<UnarchiveVehicleResponseDto> {
    const payload = { id: Number(id) };
    return this.unarchiveVehicle.execute(payload);
  }

  @Get(':id')
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async findById(
    @Param('id') id: string,
  ): Promise<VehicleWithPaymentResponseDto> {
    return this.fetchVehicleById.execute(id);
  }

  @Get('sale/:saleId')
  @RoleGuard(Resources.VEHICLE_SALE, Actions.READ)
  async fetchSale(
    @Param('saleId') saleId: string,
  ): Promise<VehicleSaleResponseDto> {
    return this.getVehicleSale.execute(saleId);
  }
}
