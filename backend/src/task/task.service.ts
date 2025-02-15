import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllDto, TaskDto, TaskStatusEnum } from './task.dto';
import { v4 } from 'uuid';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  create(task: TaskDto) {
    task.id = v4();
    task.status = TaskStatusEnum.TO_DO;
    this.tasks.push(task);
  }

  findById(id: string) {
    const foundTask = this.tasks.find((task) => task.id === id);

    if (foundTask) {
      return foundTask;
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }

  update(task: TaskDto) {
    const id = this.tasks.findIndex((t) => t.id === task.id);

    if (id === -1) {
      throw new NotFoundException(`Task with id ${task.id} not found`);
    }

    this.tasks[id] = task;
  }

  delete(id: string) {
    const foundTask = this.tasks.find((task) => task.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  findAll(params: FindAllDto): TaskDto[] {
    return this.tasks.filter((task) => {
      let match = true;
      if (params.title !== undefined && !task.title.includes(params.title)) {
        match = false;
      }
      if (params.status !== undefined && !task.status.includes(params.status)) {
        match = false;
      }
      return match;
    });
  }
}
