import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllDto, TaskDto, TaskStatusEnum } from './task.dto';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(task: TaskDto) {
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      status: TaskStatusEnum.TO_DO,
      expirationDate: task.expirationDate,
    };

    const createdTask = await this.taskRepository.save(taskToSave);

    return this.mapEntityToDto(createdTask);
  }

  async findById(id: string): Promise<TaskDto> {
    const foundTask = await this.taskRepository.findOne({ where: { id } });

    if (!foundTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.mapEntityToDto(foundTask);
  }

  async update(id: string, task: TaskDto) {
    const foundTask = await this.taskRepository.findOne({
      where: { id: task.id },
    });

    if (!foundTask) {
      throw new NotFoundException(`Task with id ${task.id} not found`);
    }

    const taskToUpdate = this.mapDtoToEntity(task);

    await this.taskRepository.update({ id }, taskToUpdate);
  }

  async delete(id: string) {
    const foundTask = await this.taskRepository.delete(id);

    if (foundTask.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  async findAll(params: FindAllDto): Promise<TaskDto[]> {
    const searchParams: FindOptionsWhere<TaskEntity> = {};

    if (params.title) {
      searchParams.title = Like(`%${params.title}%`);
    }

    if (params.status) {
      searchParams.status = params.status;
    }

    const tasks = await this.taskRepository.find({ where: searchParams });

    return tasks.map((task) => this.mapEntityToDto(task));
  }

  private mapEntityToDto(task: TaskEntity): TaskDto {
    return {
      id: task.id as string,
      title: task.title,
      description: task.description,
      status: TaskStatusEnum[task.status] as TaskStatusEnum,
      expirationDate: task.expirationDate,
    };
  }

  private mapDtoToEntity(taskDto: TaskDto): Partial<TaskEntity> {
    return {
      title: taskDto.title,
      description: taskDto.description,
      status: taskDto.status?.toString(),
      expirationDate: taskDto.expirationDate,
    };
  }
}
