export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  token?: string;
}

export interface ChatParticipant {
  id: string;
  userId: string;
  username: string;
  profileImage?: string;
  lastSeen?: Date;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  chat: string;
  content: string;
  sent_at: string;
  status: MessageStatus;
  sender: {
    id: string;
    username: string;
    profile_img?: string;
  };
  isFromCurrentUser?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
  unreadCount?: number;
  isGroup: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";
