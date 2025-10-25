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
  SearchModelRequestDto,
  SearchModelResponseDto,
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
import { SearchModelUseCase } from './use-case/search-model.use-case';
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
    private readonly searchModelVehicle: SearchModelUseCase,
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
    const { userId, enterpriseId } = req.authToken;
    return this.insertVehicle.execute(input, userId, enterpriseId);
  }

  @Get()
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async search(
    @Query() query: SearchVehiclesRequestDto,
    @Req() req: AuthRequest,
  ): Promise<SearchVehiclesResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.searchVehicles.execute(query, enterpriseId);
  }

  @Get('/paid-to')
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async searchPaidTo(
    @Query() query: SearchPaidToRequestDto,
  ): Promise<SearchPaidToResponseDto> {
    return this.searchPaidToVehicle.execute(query);
  }

  @Get('/model')
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async searchModel(
    @Query() query: SearchModelRequestDto,
    @Req() req: AuthRequest,
  ): Promise<SearchModelResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.searchModelVehicle.execute(query, enterpriseId);
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
    const { userId, enterpriseId } = req.authToken;
    return this.makeSale.execute(input, userId, enterpriseId);
  }

  @Patch(':id')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() input: UpdateVehicleRequestDto,
    @Req() req: AuthRequest,
  ): Promise<UpdateVehicleResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.updateVehicle.execute(id, input, enterpriseId);
  }

  @Patch(':id/archive')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async archive(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<ArchiveVehicleResponseDto> {
    const payload = { id: Number(id) };
    const { enterpriseId } = req.authToken;
    return this.archiveVehicle.execute(payload, enterpriseId);
  }

  @Patch(':id/unarchive')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async unarchive(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<UnarchiveVehicleResponseDto> {
    const { enterpriseId } = req.authToken;
    const payload = { id: Number(id) };
    return this.unarchiveVehicle.execute(payload, enterpriseId);
  }

  @Get(':id')
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async findById(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<VehicleWithPaymentResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.fetchVehicleById.execute(id, enterpriseId);
  }

  @Get('sale/:saleId')
  @RoleGuard(Resources.VEHICLE_SALE, Actions.READ)
  async fetchSale(
    @Param('saleId') saleId: string,
    @Req() req: AuthRequest,
  ): Promise<VehicleSaleResponseDto> {
    const { enterpriseId } = req.authToken;
    return this.getVehicleSale.execute(saleId, enterpriseId);
  }
}
