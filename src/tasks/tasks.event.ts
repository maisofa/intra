export class TaskCreatedEvent {
    title: string
    priority: string
    type: string
    startDate: Date
    endDate: Date
    userId: string
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