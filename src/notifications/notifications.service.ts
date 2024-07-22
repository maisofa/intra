import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  clientToUser = {};

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

    this.eventEmitter.emit('notification.created', notification);

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
