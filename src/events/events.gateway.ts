import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@WebSocketGateway({cors: true})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.eventEmitter.on('notification.created', (notification) => {
      this.server.emit('notification', notification); 
    });
  }

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationsService.create(createNotificationDto);
    this.server.emit('notification', notification);
    return notification;
  }

  @SubscribeMessage('findAllNotifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('departament') departament: string, @ConnectedSocket() client: Socket) {
    return this.notificationsService.identify(departament, client.id);
  }
}
