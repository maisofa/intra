import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from './entities/task.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestTaskCreatedEvent, TaskCreatedEvent } from './tasks.event';
import { RequestTaskDto } from './dto/request-task.dto';
import { UserCookieData } from 'src/users/users.model';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(user: UserCookieData, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.prismaService.tasks.create({
      data: {
        title: createTaskDto.title,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        type: createTaskDto.type,
        startDate: createTaskDto.startDate,
        endDate: createTaskDto.endDate,
        senderId: user.id,
      },
    });

    this.eventEmitter.emitAsync(
      TaskCreatedEvent.EVENT_NAME, 
      new TaskCreatedEvent(
        task.id, 
        task.title, 
        task.priority, 
        task.type, 
        task.startDate, 
        task.endDate, 
        user.id
      )
    );

    return task;
  }

  async requestTaskToUser(user: UserCookieData, requestTaskDto: RequestTaskDto) {
    const task = await this.prismaService.tasks.create({
      data: {
        title: requestTaskDto.title,
        status: requestTaskDto.status,
        priority: requestTaskDto.priority,
        type: requestTaskDto.type,
        startDate: requestTaskDto.startDate,
        endDate: requestTaskDto.endDate,
        senderId: user.id,
        recipientId: requestTaskDto.recipientId,
      },
    });

    this.eventEmitter.emitAsync(
      RequestTaskCreatedEvent.EVENT_NAME,
      new RequestTaskCreatedEvent(
        task.id, 
        task.title, 
        task.priority, 
        task.type, 
        task.startDate, 
        task.endDate, 
        user.id, 
        task.recipientId
      )
    )

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

    this.eventEmitter.emit('task.accepted', notification);

    return task;
  }

  async rejectTask(taskId: string) {
    const task = await this.prismaService.tasks.update({
      where: { id: taskId },
      data: { status: 'REJEITED' },
    });

    const user = await this.prismaService.users.findUnique({
      where: { id: task.recipientId },
    });

    const notification = {
      message: `Your task "${task.title}" has been accepted.`,
      userId: user.id,
    };

    this.eventEmitter.emit('task.rejected', notification);
  
    return task;
  }
 
  async findAll(userId: string): Promise<Task[]> {
    return await this.prismaService.tasks.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
    });
    ;
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
