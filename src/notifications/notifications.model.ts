export interface Notification {
    id: string;
    title: string;
    content: string;
    recipientId: string;
    isRead: boolean;
  }

  export type NewNotification = Omit<Notification, 'id' | 'recipientId'>;