export class AcceptTaskEvent {
    constructor(
        public readonly taskId: string,
        public readonly senderId: string,
        public readonly recipientId: string
    ) {}

    static EVENT_NAME = 'acceptedTask';

    getTitle(): string {
        return 'Tarefa aceita';
    }

    getContent(): string {
        return `A tarefa foi aceita.`;
    }
}

export class RejectTaskEvent {
    constructor(
        public readonly taskId: string,
        public readonly senderId: string,
        public readonly recipientId: string
    ) {}

    static EVENT_NAME = 'rejectedTask';

    getTitle(): string {
        return 'Tarefa rejeitada';
    }

    getContent(): string {
        return `A tarefa não foi aceita.`;
    }
}