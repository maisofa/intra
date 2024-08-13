import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AcceptTask } from './events.model';
import { TasksService } from 'src/tasks/tasks.service';
import { AcceptTaskEvent } from './events.events';
import { UserCookieData } from 'src/users/users.model';
import { EventsService } from './events.service';
import { get } from 'http';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server

  userSockets: Map<string, UserCookieData> = new Map();
  private users = {}

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly tasksService: TasksService,
    private readonly eventsService: EventsService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const user = await this.eventsService.getUser(socket);
      this.addUserToRoom(socket, user);
      //const { id } = socket.handshake.query;
      //this.users[socket.id] = id;
    } catch (error) {
      console.error(error.message);

      socket.emit('error', { reason: error.message });
      socket.disconnect(true);
    }
  }

  private addUserToRoom(socket: Socket, user: any) {
    this.userSockets.set(user.id, user);
    const roomIdentifier = this.getRoomIdentifier(socket);
    socket.join(roomIdentifier);
    //console.log('BEFORE ERROR')
    //this.userSockets.set(user.id, user);
    //socket.join(user.id);
  }

  private getRoomIdentifier(socket: Socket) {
    const taskId = this.getTaskIdFromSocket(socket);
    return `task:${taskId}`;
  }

  private getTaskIdFromSocket(socket: Socket) {
    const { taskId } = socket.handshake.query;
    return taskId;
  }

  @SubscribeMessage('accepted.task')
  async handleAcceptTaskEvent(socket: Socket, payload: AcceptTask): Promise<WsResponse> {
    //const { recipientId } = payload;
    //const id = this.getSocketIdByUserId(recipientId);
    const user = this.userSockets.get(socket.id);
    const taskId = this.getTaskIdFromSocket(socket);

    try {
      const acceptTask = await this.tasksService.acceptTask(payload.taskId);
      
      const roomIdentifier = this.getRoomIdentifier(socket);
      socket.to(roomIdentifier).emit('accepted.task', { acceptTask });
      // socket.to(id).emit('accepted.task', { acceptTask });

      this.eventEmitter.emitAsync(
        AcceptTaskEvent.EVENT_NAME,
        new AcceptTaskEvent(acceptTask.id, payload.senderId, payload.recipientId),
      );

      return {
        event: 'accepted.task',
        data: {
          acceptTask
        },
      }
    } catch (error) {
      console.error(error);
    }
  }

  getSocketIdByUserId(recipientId: string): string | undefined {
    for (const [socketId, userId] of Object.entries(this.users)) {
      if (userId === recipientId) {
        return socketId;
      }
    }
    return undefined;
  }

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationsService.create(createNotificationDto);
    this.server.emit('notification', notification);
    return notification;
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('departament') departament: string, @ConnectedSocket() client: Socket) {
    return this.notificationsService.identify(departament, client.id);
  }
}
