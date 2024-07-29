import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RequestTaskCreatedEvent, TaskCreatedEvent } from 'src/tasks/tasks.event';
import { NotificationsReadEvent } from './notifications.event';

@Injectable()
export class NotificationsService implements OnModuleDestroy, OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  clientToUser = {};

  onModuleInit() {
    this.eventEmitter.on('task.created', async (event: TaskCreatedEvent) => {
      const createNotificationDto = new CreateNotificationDto();
      createNotificationDto.title = event.title;
      createNotificationDto.content = `A tarefa "${event.title}" foi criada.`;
      createNotificationDto.recipientId = '1';  // Altere conforme necessário
      createNotificationDto.senderId = '1';  // Ou o ID do usuário que criou a tarefa
      createNotificationDto.is_read = false;

      await this.create(createNotificationDto);
    });

    this.eventEmitter.on('task.accepted', async (event: TaskCreatedEvent) => {
      const createNotificationDto = new CreateNotificationDto();
      createNotificationDto.title = event.title;
      createNotificationDto.content = `A tarefa "${event.title}" foi aceita.`;
      createNotificationDto.recipientId = '1';  // Altere conforme necessário
      createNotificationDto.senderId = '1';  // Ou o ID do usuário que aceitou a tarefa
      createNotificationDto.is_read = false;

      await this.create(createNotificationDto);
    });

    this.eventEmitter.on('task.rejected', async (event: TaskCreatedEvent) => {
      const createNotificationDto = new CreateNotificationDto();
      createNotificationDto.title = event.title;
      createNotificationDto.content = `A tarefa "${event.title}" foi rejeitada.`;
      createNotificationDto.recipientId = '1';  // Altere conforme necessário
      createNotificationDto.senderId = '1';  // Ou o ID do usuário que rejeitou a tarefa
      createNotificationDto.is_read = false;

      await this.create(createNotificationDto);
    });

    this.eventEmitter.on('task.requested', async (event: RequestTaskCreatedEvent) => {
      const createNotificationDto = new CreateNotificationDto();
      createNotificationDto.title = event.title;
      createNotificationDto.content = `A tarefa "${event.title}" foi solicitada.`;
      createNotificationDto.recipientId = event.recipientId; 
      createNotificationDto.senderId = event.recipientId; 
      createNotificationDto.is_read = false;

      await this.create(createNotificationDto);
    });
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    return this.prismaService.notifications.count({
      where: {
        recipientId: userId,
        is_read: false
      }
    });
  }

  @OnEvent('notification.read', { async: true })
  handleNotificationRead(payload: NotificationsReadEvent) {
    const { notifIds } = payload;

    this.markNotificationsAsRead(notifIds);
  }

  async markNotificationsAsRead(notifIds: string[]) {
    await this.prismaService.notifications.updateMany({
      where: {
        id: {
          in: notifIds
        }
      },
      data: {
        is_read: true
      }
    });
  }

  /*async createTaskForUser(createTaskDto: CreateTaskDto, recipientId: string) {
    const task = await this.prismaService.tasks.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        recipientId: recipientId,
        senderId: createTaskDto.senderId,
        is_completed: false,
      },
    });

    this.eventEmitter.emit('task.created', task);

    return task;
  }
    const task = await this.prismaService.tasks.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        recipientId: recipientId,
        senderId: createTaskDto.senderId,
        is_completed: false,
      },
    });

    this.eventEmitter.emit('task.created', task);

    return task;
  }*/

  onModuleDestroy() {
    this.eventEmitter.removeAllListeners(TaskCreatedEvent.name);
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.prismaService.notifications.create({
      data: {
        title: createNotificationDto.title,
        content: createNotificationDto.content,
        recipientId: createNotificationDto.recipientId,
        senderId: createNotificationDto.senderId,
        is_read: createNotificationDto.is_read
      }
    });

    return notification;
  }

  findAll() {
    return this.prismaService.notifications.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
