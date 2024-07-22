import { TaskStatus } from "@prisma/client"

export class CreateTaskDto {
    title: string;
    status: TaskStatus;
    priority: string;
    type: string;
    startDate: Date;
    endDate: Date;
    userId: string;
}
