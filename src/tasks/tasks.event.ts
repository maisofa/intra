export class TaskCreatedEvent {
    constructor(
        public readonly taskId: string,
        public readonly title: string,
        public readonly priority: string,
        public readonly type: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
    ) {}

    static EVENT_NAME = 'task.created';

    public getContent(): string {
        return `Task ${this.title} has been created`;
    }

    public getTitle(): string {
        return `Task Created`;
    }
}

export class RequestTaskCreatedEvent {
    title: string
    priority: string
    type: string
    startDate: Date
    endDate: Date
    senderId: string
    recipientId: string
}