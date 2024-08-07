export class AcceptTaskEvent {
    constructor(
        public readonly taskId: string,
    ) {}

    static EVENT_NAME = 'acceptedTask';
}