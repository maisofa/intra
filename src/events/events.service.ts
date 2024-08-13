import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { UserCookieData } from "src/users/users.model";
import { UsersService } from "src/users/users.service";

const UNAUTHENTICATED_ERR = new WsException('Unauthenticated');

@Injectable()
export class EventsService {
    constructor(
        private readonly usersService: UsersService
    ) { }

    async getUser(socket: Socket): Promise<UserCookieData> {
        const { id } = socket.handshake.auth;
        if (!id) {
            throw UNAUTHENTICATED_ERR;
        }

        const user = await this.usersService.findById(id);
        if (!user) {
            throw UNAUTHENTICATED_ERR;
        }
        return user;
    }
}