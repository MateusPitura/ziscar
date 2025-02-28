import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserFindAllInDto, UserUpdateInDto } from './user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { SELECT_USER } from './user.constants';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  async fetch(@Query() query: UserFindAllInDto) {
    return await this.userService.fetch(query, {
      id: true,
      fullName: true,
      email: true,
      roleId: true,
      isActive: true,
    });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.userService.get({ id: +id }, SELECT_USER);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() userUpdateInDto: UserUpdateInDto,
  ) {
    return await this.userService.update({ id: +id }, userUpdateInDto);
  }
}
