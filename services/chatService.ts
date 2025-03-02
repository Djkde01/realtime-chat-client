import { api } from "./apiClient";
import type { Chat, Message, MessageStatus } from "@/types/uiTypes";

// Chat APIs
export const chatService = {
  // Get all chats for current user
  async getChats(): Promise<Chat[]> {
    const { data, error } = await api.get<Chat[]>("/api/chats/");

    if (error) {
      throw new Error(error);
    }

    return data;
  },

  // Get a specific chat by ID
  async getChat(chatId: string): Promise<Chat> {
    const { data, error } = await api.get<Chat>(`/api/chats/${chatId}/`);

    if (error) {
      throw new Error(error);
    }

    return data;
  },

  // Create a new chat
  async createChat(name: string, participantIds: string[]): Promise<Chat> {
    const { data, error } = await api.post<Chat>("/api/chats/", {
      name,
      participant_ids: participantIds,
    });

    if (error) {
      throw new Error(error);
    }

    return data;
  },

  // Add participants to a chat
  async addParticipants(chatId: string, userIds: string[]): Promise<Chat> {
    const { data, error } = await api.post<Chat>(
      `/api/chats/${chatId}/add_participants/`,
      {
        users_ids: userIds,
      }
    );

    if (error) {
      throw new Error(error);
    }

    return data;
  },

  // Get messages for a chat with pagination
  async getMessages(
    chatId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<Message[]> {
    const { data, error } = await api.get<Message[]>(
      `/api/chats/${chatId}/messages/`,
      {
        params: { page, page_size: pageSize },
      }
    );

    if (error) {
      throw new Error(error);
    }

    return data;
  },

  // Send a message to a chat
  async sendMessage(chatId: string, content: string): Promise<Message> {
    const { data, error } = await api.post<Message>(
      `/api/chats/${chatId}/messages/`,
      {
        content,
        chat: chatId,
      }
    );

    if (error) {
      throw new Error(error);
    }

    return data;
  },

  // Update status of a message
  async updateMessageStatus(
    messageId: string,
    status: MessageStatus
  ): Promise<void> {
    const { error } = await api.put(`/api/messages/${messageId}/status/`, {
      status,
    });

    if (error) {
      throw new Error(error);
    }
  },

  // Mark all messages in a chat as read
  async markAllAsRead(chatId: string): Promise<void> {
    const { error } = await api.put(
      `/api/messages/status/update-all/${chatId}/`,
      {}
    );

    if (error) {
      throw new Error(error);
    }
  },
};
