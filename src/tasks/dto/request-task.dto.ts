import { TaskPriority, TaskStatus } from "@prisma/client"
import { IsNotEmpty, IsString } from "class-validator";

export class RequestTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    status: TaskStatus;
    @IsString()
    @IsNotEmpty()
    priority: TaskPriority;
    @IsString()
    @IsNotEmpty()
    type: string;
    @IsString()
    @IsNotEmpty()
    startDate: Date;
    @IsString()
    @IsNotEmpty()
    endDate: Date;
    @IsString()
    @IsNotEmpty()
    senderId: string;
    @IsString()
    @IsNotEmpty()
    recipientId: string;
}
