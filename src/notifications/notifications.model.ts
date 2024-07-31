export interface Notification {
    id: string;
    title: string;
    content: string;
    senderId?: string;
    recipientId: string;
    isRead: boolean;
  }

  export type NewNotification = Omit<Notification, 'id' | 'recipientId'>;