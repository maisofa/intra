import { Controller, Get, Req, Res, Sse } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { concat, Observable } from 'rxjs';
import { from } from 'rxjs';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { map } from 'rxjs/operators';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsReadEvent } from './notifications.event';
import { Response } from 'express';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    @Get()
    async getNotifications(@Req() req: AuthRequest) {
        const notifications = this.notificationsService.findAll(req.user);

        const unreadNotifications = (await notifications)
            .filter(notification => !notification.is_read)
            .map(notification => notification.id);

        this.eventEmitter.emitAsync(
            'notification.read',
            new NotificationsReadEvent(unreadNotifications)
        );
    }

    @Sse('/count')
    notificationCount(@Req() req: AuthRequest): Observable<MessageEvent<any>> {
        const count = concat(
            from(this.notificationsService.getUnreadNotificationsCount(req.user.id))
                .pipe(
                    map(count => ({ data: { unreadCount: +count } }))
                )
        ) as Observable<MessageEvent<any>>;
        return count;
    }
}
