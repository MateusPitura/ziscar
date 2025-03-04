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
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { FETCH_USER, GET_USER } from './user.constant';
import { AuthRequest, AuthSignin } from '../auth/auth.type';
import { UserPostInDto, UserFetchInDto, UserPatchInDto } from './user.schema';
import { ParamInputs } from 'src/schemas';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  post(@Req() req: AuthRequest, @Body() userPostInDto: UserPostInDto) {
    const { clientId } = req.authToken as AuthSignin;

    const createUserPayload = {
      ...userPostInDto,
      clientId,
    };
    return this.userService.create(createUserPayload);
  }

  @Get()
  async fetch(
    @Req() req: AuthRequest,
    @Query() userFetchInDto: UserFetchInDto,
  ) {
    const { userId } = req.authToken as AuthSignin;
    return await this.userService.findMany(userFetchInDto, +userId, FETCH_USER);
  }

  @Get('/me')
  async getMe(@Req() req: AuthRequest) {
    const { userId } = req.authToken as AuthSignin;
    return await this.userService.findOne({ id: +userId }, GET_USER);
  }

  @Get(':id')
  async get(@Param() { id }: ParamInputs) {
    return await this.userService.findOne({ id: +id }, GET_USER);
  }

  @Patch(':id')
  async patchMe(
    @Req() req: AuthRequest,
    @Body() userPatchInDto: UserPatchInDto,
  ) {
    const { userId } = req.authToken as AuthSignin;
    return await this.userService.update({ id: +userId }, userPatchInDto);
  }

  @Patch(':id')
  async patch(
    @Param() { id }: ParamInputs,
    @Body() userPatchInDto: UserPatchInDto,
  ) {
    return await this.userService.update({ id: +id }, userPatchInDto);
  }
}
