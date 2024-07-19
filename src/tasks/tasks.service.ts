import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from './entities/task.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from './tasks.event';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.prismaService.tasks.create({
      data: {
        title: createTaskDto.title,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        type: createTaskDto.type,
        startDate: createTaskDto.startDate,
        endDate: createTaskDto.endDate
      }
    });

    const taskCreateEvent = new TaskCreatedEvent();
    taskCreateEvent.title = task.title;
    taskCreateEvent.priority = task.priority;
    taskCreateEvent.type = task.type;
    taskCreateEvent.startDate = task.startDate;
    taskCreateEvent.endDate = task.endDate;

    this.eventEmitter.emit('task.created', taskCreateEvent);

    return task;
  }

  async requestTaskToUser(createTaskDto: CreateTaskDto) {

  }

  async acceptTask() {

  }

  async denyTask() {

  }
 
  async findAll(): Promise<Task[]> {
    return await this.prismaService.tasks.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
