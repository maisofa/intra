import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { EventsService } from './events.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [NotificationsModule, TasksModule, UsersModule],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway]
})
export class EventsModule {}
