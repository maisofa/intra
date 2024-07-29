import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from './entities/task.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestTaskCreatedEvent, TaskCreatedEvent } from './tasks.event';
import { RequestTaskDto } from './dto/request-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.prismaService.tasks.create({
      data: {
        title: createTaskDto.title,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        type: createTaskDto.type,
        startDate: createTaskDto.startDate,
        endDate: createTaskDto.endDate,
        senderId: createTaskDto.userId,
      },
    });

    const taskCreateEvent = new TaskCreatedEvent();
    taskCreateEvent.title = task.title;
    taskCreateEvent.priority = task.priority;
    taskCreateEvent.type = task.type;
    taskCreateEvent.startDate = task.startDate;
    taskCreateEvent.endDate = task.endDate;
    taskCreateEvent.userId = task.senderId;

    this.eventEmitter.emit('task.created', taskCreateEvent);

    return task;
  }

  async requestTaskToUser(requestTaskDto: RequestTaskDto) {
    const task = await this.prismaService.tasks.create({
      data: {
        title: requestTaskDto.title,
        status: requestTaskDto.status,
        priority: requestTaskDto.priority,
        type: requestTaskDto.type,
        startDate: requestTaskDto.startDate,
        endDate: requestTaskDto.endDate,
        senderId: requestTaskDto.senderId,
        recipientId: requestTaskDto.recipientId,
      },
    });

    const taskCreateEvent = new RequestTaskCreatedEvent();
    taskCreateEvent.title = task.title;
    taskCreateEvent.priority = task.priority;
    taskCreateEvent.type = task.type;
    taskCreateEvent.startDate = task.startDate;
    taskCreateEvent.endDate = task.endDate;
    taskCreateEvent.senderId = task.senderId;
    taskCreateEvent.recipientId = task.recipientId;

    this.eventEmitter.emit('task.requested', taskCreateEvent);

    return task;
  }

  async acceptTask(taskId: string) {

    const task = await this.prismaService.tasks.update({
      where: { id: taskId },
      data: { status: 'ACCEPTED' },
    });

    const user = await this.prismaService.users.findUnique({
      where: { id: task.recipientId },
    });

    const notification = {
      message: `Your task "${task.title}" has been accepted.`,
      userId: user.id,
    };

    this.eventEmitter.emit('notification.accpted', notification);

    return task;
  }

  async denyTask(taskId: string) {
    const task = await this.prismaService.tasks.update({
      where: { id: taskId },
      data: { status: 'REJEITED' },
    });
  
    return task;
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
