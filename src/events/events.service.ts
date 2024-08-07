import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { UserCookieData } from "src/users/users.model";

const UNAUTHENTICATED_ERR = new WsException('Unauthenticated');

export class EventsService {
    constructor() { }

    getUserFromSocket(socket: Socket) {

    }
}