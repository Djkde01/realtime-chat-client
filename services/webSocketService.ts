import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Message, Chat } from "@/types/uiTypes";

export enum WebSocketEvent {
  MESSAGE = "message",
  MESSAGE_STATUS = "message_status",
  NEW_CHAT = "new_chat",
  PARTICIPANTS_UPDATED = "participants_updated",
  TYPING = "typing",
}

type WebSocketCallbacks = {
  [WebSocketEvent.MESSAGE]?: (message: Message) => void;
  [WebSocketEvent.MESSAGE_STATUS]?: (data: {
    messageId: string;
    status: string;
  }) => void;
  [WebSocketEvent.NEW_CHAT]?: (chat: Chat) => void;
  [WebSocketEvent.PARTICIPANTS_UPDATED]?: (data: {
    chatId: string;
    participants: any[];
  }) => void;
  [WebSocketEvent.TYPING]?: (data: { chatId: string; userId: string }) => void;
};

export class WebSocketService {
  private socket: WebSocket | null = null;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private chatId: string | null = null;
  private isConnecting = false;
  private isConnected = false;
  private messageQueue: Array<{ type: string; payload?: any }> = [];

  // Check connection status
  public get connected(): boolean {
    return (
      this.isConnected &&
      !!this.socket &&
      this.socket.readyState === WebSocket.OPEN
    );
  }

  async connect(chatId?: string): Promise<void> {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      console.log("WebSocket connection already in progress");
      return;
    }

    // If already connected to the same chat, don't reconnect
    if (this.connected && this.chatId === chatId) {
      console.log("WebSocket already connected to this chat");
      return;
    }

    this.chatId = chatId || null;
    this.isConnecting = true;

    try {
      // Close existing connection if any
      if (this.socket) {
        this.socket.close();
        this.isConnected = false;
      }

      // Get auth token
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        throw new Error("User not authenticated");
      }

      const user = JSON.parse(userData);
      const token = user.token;

      if (!token) {
        throw new Error("Auth token not found");
      }

      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
      let wsUrl = apiUrl.replace("http", "ws").replace("https", "wss");
      wsUrl = `${wsUrl}/ws/chat/${chatId || ""}/?token=${token}`;

      console.log("Connecting to WebSocket:", wsUrl);
      this.socket = new WebSocket(wsUrl);

      // Create a promise to wait for connection
      const connectionPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("WebSocket connection timeout"));
        }, 10000); // 10 second timeout

        if (!this.socket) {
          clearTimeout(timeout);
          reject(new Error("Failed to create WebSocket"));
          return;
        }

        this.socket.onopen = () => {
          console.log("WebSocket connected successfully");
          clearTimeout(timeout);
          this.reconnectAttempts = 0;
          this.isConnected = true;

          // Process any queued messages
          while (this.messageQueue.length > 0) {
            const msg = this.messageQueue.shift();
            if (msg) this.sendRaw(msg.type, msg.payload);
          }

          resolve();
        };

        this.socket.onmessage = this.handleMessage.bind(this);

        this.socket.onclose = (event) => {
          console.log("WebSocket disconnected", event.code);
          this.isConnected = false;
          if (!this.isConnecting) {
            // Only attempt reconnect if not already connecting
            this.handleReconnect();
          }
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error", error);
          this.isConnected = false;
          clearTimeout(timeout);
          reject(error);
        };
      });

      await connectionPromise;
    } catch (error) {
      console.error("WebSocket connection error", error);
      this.isConnected = false;
      this.handleReconnect();
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(
        `Maximum reconnect attempts (${this.maxReconnectAttempts}) reached`
      );
      return;
    }

    // Clear existing timeout if any
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;

    // Exponential backoff with some randomness to prevent all clients reconnecting simultaneously
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts) + Math.random() * 1000,
      30000 // Max 30 seconds
    );

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${
        this.maxReconnectAttempts
      }) in ${Math.round(delay / 1000)}s`
    );

    this.reconnectTimeout = setTimeout(() => {
      // Only try to reconnect if we're not already connecting
      if (!this.isConnecting) {
        console.log(`Reconnecting to chat ${this.chatId || "global"}`);
        this.connect(this.chatId || undefined).catch((err) => {
          console.error("Reconnection failed:", err);
        });
      }
    }, delay);
  }

  // Also add this to ensure we clean up properly
  disconnect() {
    // Clear any pending reconnect attempts
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts = 0;

    if (this.socket) {
      this.isConnected = false;
      this.socket.close();
      this.socket = null;
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log("WebSocket received:", data.type);

      if (
        data.type === WebSocketEvent.MESSAGE &&
        this.callbacks[WebSocketEvent.MESSAGE]
      ) {
        this.callbacks[WebSocketEvent.MESSAGE](data.message);
      }

      if (
        data.type === WebSocketEvent.MESSAGE_STATUS &&
        this.callbacks[WebSocketEvent.MESSAGE_STATUS]
      ) {
        this.callbacks[WebSocketEvent.MESSAGE_STATUS](data);
      }

      if (
        data.type === WebSocketEvent.NEW_CHAT &&
        this.callbacks[WebSocketEvent.NEW_CHAT]
      ) {
        this.callbacks[WebSocketEvent.NEW_CHAT](data.chat);
      }

      if (
        data.type === WebSocketEvent.PARTICIPANTS_UPDATED &&
        this.callbacks[WebSocketEvent.PARTICIPANTS_UPDATED]
      ) {
        this.callbacks[WebSocketEvent.PARTICIPANTS_UPDATED](data);
      }

      if (
        data.type === WebSocketEvent.TYPING &&
        this.callbacks[WebSocketEvent.TYPING]
      ) {
        this.callbacks[WebSocketEvent.TYPING](data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message", error);
    }
  }

  // Safe send with connection check and queuing
  private sendRaw(type: string, payload?: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn(`WebSocket not connected, queueing '${type}' message`);
      // Queue message for when connection is ready
      this.messageQueue.push({ type, payload });
      return;
    }

    const message = payload ? { type, ...payload } : { type };
    this.socket.send(JSON.stringify(message));
  }

  // Public send methods
  sendMessage(message: string) {
    this.sendRaw("chat_message", { message });
  }

  sendTyping() {
    this.sendRaw("typing");
  }

  markAsRead() {
    this.sendRaw("read_messages");
  }

  markAsDelivered() {
    this.sendRaw("delivered_messages");
  }

  on(event: WebSocketEvent, callback: any) {
    this.callbacks[event] = callback;
  }

  off(event: WebSocketEvent) {
    if (this.callbacks[event]) {
      delete this.callbacks[event];
    }
  }
}

// Create a singleton instance
export const webSocketService = new WebSocketService();
