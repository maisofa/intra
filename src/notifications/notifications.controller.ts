import { Controller, Get, Req, Sse } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { concat, Observable } from 'rxjs';
import { from } from 'rxjs';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { map } from 'rxjs/operators';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsReadEvent } from './notifications.event';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    @IsPublic()
    @Get()
    async getNotifications() {  
        const notifications = this.notificationsService.findAll();

        const unreadNotifications = (await notifications)
            .filter(notification => !notification.is_read)
            .map(notification => notification.id);

        this.eventEmitter.emitAsync(
            'notification.read',
             new NotificationsReadEvent(unreadNotifications)
        );
    }

    @IsPublic()
    @Sse('/count')
    notificationCount(@Req() req: AuthRequest): Observable<MessageEvent<any>> {
        const count = concat(
            from(this.notificationsService.getUnreadNotificationsCount("f6649596-4ea0-41c6-8d67-2eca4e4ffff4"))
            .pipe(
                map(count => ({ data: { unreadCount: +count } }))
            )
        ) as Observable<MessageEvent<any>>;

        return count;
    }
}
