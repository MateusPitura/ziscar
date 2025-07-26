import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Post,
  Req,
  ForbiddenException,
  Delete,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FETCH_USER, GET_USER } from './user.constant';
import {
  UserPostInDto,
  UserPatchInDto,
  ProfilePatchInDto,
  UserDeleteInDto,
  UserFindManyInDto,
  UserGeneratePdfInDto,
} from './user.schema';
import { ParamInputs } from 'src/schemas';
import { Actions, Resources } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/auth.type';

@Controller()
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RoleGuard(Resources.USERS, Actions.CREATE)
  @Post('user')
  post(@Req() req: AuthRequest, @Body() userPostInDto: UserPostInDto) {
    const { enterpriseId } = req.authToken;

    const createUserPayload = {
      ...userPostInDto,
      enterpriseId,
    };
    return this.userService.create({ userCreateInDto: createUserPayload });
  }

  @RoleGuard(Resources.USERS, Actions.READ)
  @Get('user')
  async findMany(
    @Req() req: AuthRequest,
    @Query() userFindManyInDto: UserFindManyInDto,
  ) {
    const { userId, enterpriseId } = req.authToken;
    return await this.userService.findMany({
      userFindManyInDto,
      userId: +userId,
      select: FETCH_USER,
      enterpriseId,
    });
  }

  @Get('profile')
  async getProfile(@Req() req: AuthRequest) {
    const { userId } = req.authToken;
    return await this.userService.findOne({
      where: { id: +userId },
      select: GET_USER,
    });
  }

  @Get('permissions')
  async getPermissions(@Req() req: AuthRequest) {
    const { userId, enterpriseId } = req.authToken;
    return await this.userService.getPermissions({
      userId: +userId,
      enterpriseId,
    });
  }

  @Get('user/pdf')
  @HttpCode(HttpStatus.OK)
  async generatePdf(
    @Req() req: AuthRequest,
    @Query() userGeneratePdfInDto: UserGeneratePdfInDto,
    @Res() res?: Response,
  ) {
    const { userId, enterpriseId } = req.authToken;
    const pdfBuffer = await this.userService.generatePdf({
      userGeneratePdfInDto,
      userId: +userId,
      enterpriseId,
    });

    res?.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
    });

    res?.end(pdfBuffer);
  }

  @RoleGuard(Resources.USERS, Actions.READ)
  @Get('user/:id')
  async get(@Req() req: AuthRequest, @Param() { id }: ParamInputs) {
    const { userId, enterpriseId } = req.authToken;
    if (userId == id) {
      throw new ForbiddenException(
        'Use a rota /profile para acessar seus dados',
      );
    }
    return await this.userService.findOne({
      where: { id: +id },
      select: GET_USER,
      enterpriseId,
    });
  }

  @Patch('profile')
  async patchProfile(
    @Req() req: AuthRequest,
    @Body() profilePatchInDto: ProfilePatchInDto,
  ) {
    const { userId, enterpriseId } = req.authToken;
    return await this.userService.update({
      where: { id: +userId },
      userUpdateInDto: profilePatchInDto,
      enterpriseId,
    });
  }

  @RoleGuard(Resources.USERS, Actions.UPDATE)
  @Patch('user/:id')
  async patch(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() userPatchInDto: UserPatchInDto,
  ) {
    const { userId, enterpriseId } = req.authToken;
    if (userId == id) {
      throw new ForbiddenException(
        'Use a rota /profile para atualizar seus dados',
      );
    }
    return await this.userService.update({
      where: { id: +id },
      userUpdateInDto: userPatchInDto,
      enterpriseId,
    });
  }

  @RoleGuard(Resources.USERS, Actions.DELETE)
  @Delete('user/:id')
  async disable(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() userDeleteInDto: UserDeleteInDto,
  ) {
    const { userId, enterpriseId } = req.authToken;
    if (userId == id) {
      throw new ForbiddenException(
        'Você não pode desativar o seu próprio usuário',
      );
    }
    return await this.userService.update({
      where: { id: +id },
      userUpdateInDto: userDeleteInDto,
      enterpriseId,
    });
  }
}
