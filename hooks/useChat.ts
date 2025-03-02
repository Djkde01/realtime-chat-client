import { useState, useEffect, useCallback, useRef } from "react";
import { chatService } from "@/services/chatService";
import { webSocketService, WebSocketEvent } from "@/services/webSocketService";
import type { Chat, Message, MessageStatus } from "@/types/uiTypes";
import { useAuth } from "@/context/AuthContext";

export function useChat(chatId: string) {
  const { user } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load chat details and initial messages
  const loadChat = async () => {
    try {
      setLoading(true);

      // Load chat details
      const chatData = await chatService.getChat(chatId);
      setChat(chatData);

      // Load initial messages
      const messagesData = await chatService.getMessages(chatId);

      // Process messages to identify sender
      const processedMessages = messagesData.map((message) => ({
        ...message,
        isFromCurrentUser: message.sender.id === user?.id,
      }));

      setMessages(processedMessages);
      setHasMore(messagesData.length === 50); // If we got a full page, there might be more

      // Mark all messages as read
      await chatService.markAllAsRead(chatId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load chat";
      setError(errorMessage);
      console.error("Error loading chat:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!hasMore || loading) return;

    try {
      const nextPage = page + 1;
      const moreMessages = await chatService.getMessages(chatId, nextPage);

      if (moreMessages.length === 0) {
        setHasMore(false);
        return;
      }

      // Process new messages
      const processedMessages = moreMessages.map((message) => ({
        ...message,
        isFromCurrentUser: message.sender.id === user?.id,
      }));

      setMessages((prev) => [...prev, ...processedMessages]);
      setPage(nextPage);
      setHasMore(moreMessages.length === 50);
    } catch (err) {
      console.error("Error loading more messages:", err);
    }
  };

  // Send message via WebSocket instead of REST API
  const sendMessage = useCallback(
    async (content: string) => {
      // Create temporary message to show immediately in UI
      const tempMessage = {
        id: `temp-${Date.now()}`,
        chat: chatId,
        sender: { id: user!.id, username: user!.username },
        content,
        sent_at: new Date().toDateString(),
        status: "sending" as MessageStatus,
        isFromCurrentUser: true,
      };

      setMessages((prev) => [tempMessage, ...prev]);

      try {
        // Send via WebSocket
        webSocketService.sendMessage(content);

        // Update local message status (WebSocket may confirm later)
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempMessage.id
                ? { ...msg, status: "sent" as MessageStatus }
                : msg
            )
          );
        }, 300);

        return tempMessage;
      } catch (err) {
        // Handle failure
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? { ...msg, status: "failed" as MessageStatus }
              : msg
          )
        );

        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        console.error("Error sending message:", errorMessage);
        throw new Error(errorMessage);
      }
    },
    [chatId, user?.id]
  );

  // Update message status
  const updateMessageStatus = useCallback(
    async (messageId: string, status: MessageStatus) => {
      try {
        await chatService.updateMessageStatus(messageId, status);

        // Update local message state
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
        );
      } catch (err) {
        console.error("Error updating message status:", err);
      }
    },
    []
  );

  // Consolidated WebSocket connection
  useEffect(() => {
    // Initial data load
    loadChat();

    // Connection state tracking
    let isConnected = false;

    // Connect WebSocket once
    const connectWebSocket = async () => {
      try {
        await webSocketService.connect(chatId);
        isConnected = true;

        // Mark messages as delivered only after confirmed connection
        setTimeout(() => {
          if (isConnected) {
            webSocketService.markAsDelivered();
          }
        }, 1000);
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    };

    connectWebSocket();

    // Add listeners after connection
    webSocketService.on(WebSocketEvent.MESSAGE, (message: Message) => {
      // Check if message belongs to current chat
      if (message.chat === chatId) {
        const isFromCurrentUser = message.sender.id === user?.id;

        // Add message to state
        setMessages((prev) => [
          {
            ...message,
            isFromCurrentUser,
          },
          ...prev,
        ]);

        // If not from current user, mark as delivered
        if (!isFromCurrentUser && isConnected) {
          chatService.updateMessageStatus(message.id, "delivered");
        }
      }
    });

    webSocketService.on(WebSocketEvent.TYPING, () => {
      setIsTyping(true);

      // Auto-reset after 3 seconds
      setTimeout(() => setIsTyping(false), 3000);
    });

    // Listen for message status updates
    interface MessageStatusUpdate {
      messageId: string;
      status: MessageStatus;
    }

    webSocketService.on(
      WebSocketEvent.MESSAGE_STATUS,
      (data: MessageStatusUpdate) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId
              ? { ...msg, status: data.status as MessageStatus }
              : msg
          )
        );
      }
    );

    return () => {
      // Single clean up point
      isConnected = false;
      webSocketService.off(WebSocketEvent.MESSAGE);
      webSocketService.off(WebSocketEvent.MESSAGE_STATUS);
      webSocketService.off(WebSocketEvent.TYPING);
      webSocketService.disconnect();
    };
  }, [chatId, user?.id]);

  // Send typing indicator
  const handleTyping = useCallback(() => {
    webSocketService.sendTyping();

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to stop typing indicator after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  }, []);

  // Mark messages as read when user views them
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      webSocketService.markAsRead();
    }
  }, [messages, loading]);

  return {
    chat,
    messages,
    loading,
    error,
    sendMessage,
    loadMoreMessages,
    isTyping,
    handleTyping,
  };
}
