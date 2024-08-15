import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RequestTaskCreatedEvent, TaskCreatedEvent } from 'src/tasks/tasks.event';
import { NotificationsReadEvent } from './notifications.event';
import { NewNotification } from './notifications.model';
import { UserCookieData } from 'src/users/users.model';
import { AcceptTaskEvent, RejectTaskEvent } from 'src/events/events.events';
import { Notifications } from '@prisma/client';

@Injectable()
export class NotificationsService implements OnModuleDestroy, OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  clientToUser = {};

  onModuleInit() {
    this.eventEmitter.on(TaskCreatedEvent.EVENT_NAME, async (event: TaskCreatedEvent) => {
      const newNotification: NewNotification = {
        title: event.getTitle(),
        content: event.getContent(),
        isRead: false
      }

      await this.addNotificationToModerators(event.userId, newNotification);
    });

    this.eventEmitter.on(AcceptTaskEvent.EVENT_NAME, async (event: AcceptTaskEvent) => {
      const newNotification: NewNotification = {
        title: event.getTitle(),
        content: event.getContent(),
        isRead: false
      }

      await this.addNotificationToUser(event.senderId, event.recipientId, newNotification);
      await this.addNotificationToModerators(event.senderId, newNotification);
    });

    this.eventEmitter.on(RejectTaskEvent.EVENT_NAME, async (event: RejectTaskEvent) => {
      const newNotification: NewNotification = {
        title: event.getTitle(),
        content: event.getContent(),
        isRead: false
      }

      await this.addNotificationToUser(event.senderId, event.recipientId, newNotification);
      await this.addNotificationToModerators(event.senderId, newNotification);
    });

    this.eventEmitter.on('task.requested', async (event: RequestTaskCreatedEvent) => {
      const newNotification: NewNotification = {
        title: event.getTitle(),
        content: event.getContent(),
        isRead: false
      }

      await this.addNotificationToModerators(event.senderId, newNotification);
      await this.addNotificationToUser(event.senderId, event.recipientId, newNotification)
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

  async addNotificationToModerators(senderId: string, notification: NewNotification) {
    const moderators = await this.prismaService.users.findMany({
      where: {
        user_role: 'MODERATOR'
      }
    });

    const newNotifications = moderators.map(moderator => {
      return {
        title: notification.title,
        content: notification.content,
        recipientId: moderator.id,
        senderId: senderId,
        is_read: false
      };
    });

    await this.prismaService.notifications.createMany({
      data: newNotifications
    });
  }

  async addNotificationToUser(senderId: string, recipientId: string, notification: NewNotification) {
    const newNotification = {
      title: notification.title,
      content: notification.content,
      recipientId: recipientId,
      senderId,
      is_read: false
    };

    await this.prismaService.notifications.create({
      data: newNotification
    });
  }

  async getNotificationsForUser(userId: string) {
    return this.prismaService.notifications.findMany({
      where: {
        recipientId: userId 
      }
    });
  }

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

  findAll(user: UserCookieData): Promise<Notifications[]> {
    return this.prismaService.notifications.findMany({
      where: {
        recipientId: user.id
      },
      include: {
        sender: {
          select: {
            name: true
          }
        }
      }
    });
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
