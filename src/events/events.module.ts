import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { EventsService } from './events.service';

@Module({
  imports: [NotificationsModule, TasksModule],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway]
})
export class EventsModule {}
