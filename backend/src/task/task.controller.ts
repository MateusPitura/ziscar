import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindAllDto, TaskDto, TaskRouteParams } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() task: TaskDto) {
    await this.taskService.create(task);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    return await this.taskService.findById(id);
  }

  @Put('/:id')
  async update(@Param() params: TaskRouteParams, @Body() task: TaskDto) {
    await this.taskService.update(params.id, task);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.taskService.delete(id);
  }

  @Get()
  async findAll(@Query() params: FindAllDto): Promise<TaskDto[]> {
    return await this.taskService.findAll(params);
  }
}
