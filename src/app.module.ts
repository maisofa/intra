import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TaskfilesModule } from './taskfiles/taskfiles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DepartamentsModule } from './departaments/departaments.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(), 
    UsersModule, 
    TasksModule, 
    PermissionsModule, 
    TaskfilesModule, 
    NotificationsModule, 
    AuthModule, 
    PrismaModule, 
    EventsModule, 
    DepartamentsModule, 
    DepartamentsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
