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
import { AuthRequest, AuthSigninOutDto } from '../auth/auth.dto';
import { ZodPipe } from 'src/utils/ZodPipe';
import {
  UserPostInDtoInputs,
  SchemaUserPostInDto,
  SchemaUserFetchInDto,
  UserFetchInDtoInputs,
  SchemaUserPatchInDto,
  UserPatchInDtoInputs,
} from './user.schema';
import { ParamInputs, SchemaParam } from 'src/schemas';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  post(
    @Req() req: AuthRequest,
    @Body(new ZodPipe(SchemaUserPostInDto))
    userPostInDto: UserPostInDtoInputs,
  ) {
    const { clientId } = req.authToken as AuthSigninOutDto;

    const createUserPayload = {
      ...userPostInDto,
      clientId,
    };
    return this.userService.create(createUserPayload);
  }

  @Get()
  async fetch(
    @Query(new ZodPipe(SchemaUserFetchInDto))
    userFetchInDto: UserFetchInDtoInputs,
  ) {
    return await this.userService.findMany(userFetchInDto, FETCH_USER);
  }

  @Get(':id')
  async get(@Param(new ZodPipe(SchemaParam)) { id }: ParamInputs) {
    return await this.userService.findOne({ id: +id }, GET_USER);
  }

  @Patch(':id')
  async patch(
    @Param(new ZodPipe(SchemaParam)) { id }: ParamInputs,
    @Body(new ZodPipe(SchemaUserPatchInDto))
    userPatchInDto: UserPatchInDtoInputs,
  ) {
    return await this.userService.update({ id: +id }, userPatchInDto);
  }
}
