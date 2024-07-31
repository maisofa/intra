export class TaskCreatedEvent {
    constructor(
        public readonly taskId: string,
        public readonly title: string,
        public readonly priority: string,
        public readonly type: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly userId: string
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
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly priority: string,
        public readonly type: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly senderId: string,
        public readonly recipientId: string,
    ) {}

    static EVENT_NAME = 'task.requested';

    public getContent(): string {
        return `Task ${this.title} has been requested`;
    }

    public getTitle(): string {
        return `Task Requested`;
    }
}