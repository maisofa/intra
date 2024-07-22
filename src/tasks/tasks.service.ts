import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from './entities/task.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from './tasks.event';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
    private notificationsService: NotificationsService,
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
        user_id: createTaskDto.userId,
      },
    });

    const taskCreateEvent = new TaskCreatedEvent();
    taskCreateEvent.title = task.title;
    taskCreateEvent.priority = task.priority;
    taskCreateEvent.type = task.type;
    taskCreateEvent.startDate = task.startDate;
    taskCreateEvent.endDate = task.endDate;

    this.eventEmitter.emit('task.created', taskCreateEvent);

    // Create a notification
    const createNotificationDto = new CreateNotificationDto();
    createNotificationDto.title = 'Nova Tarefa Criada';
    createNotificationDto.content = `A tarefa "${task.title}" foi criada.`;
    createNotificationDto.recipientId = createTaskDto.userId;  // Altere conforme necessário
    createNotificationDto.senderId = createTaskDto.userId;  // Ou o ID do usuário que criou a tarefa
    createNotificationDto.is_read = false;

    const notification = await this.notificationsService.create(createNotificationDto);

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
