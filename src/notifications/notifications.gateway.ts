import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server

  constructor(private readonly notificationsService: NotificationsService) {}

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
