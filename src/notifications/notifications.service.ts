import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from 'src/tasks/tasks.event';

@Injectable()
export class NotificationsService implements OnModuleDestroy, OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  onModuleInit() {
    this.eventEmitter.on(TaskCreatedEvent, async (ev: TaskCreatedEvent) => {
      
    })    
  }
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
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
