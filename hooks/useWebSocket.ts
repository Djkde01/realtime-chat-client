"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export const useWebSocket = (url: string) => {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(url);
    socketRef.current = socket;

    // Connection opened
    socket.onopen = () => {
      console.log("WebSocket Connected");
      setConnected(true);
    };

    // Listen for messages
    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setLastMessage(event.data);
    };

    // Connection closed
    socket.onclose = (event) => {
      console.log("WebSocket Disconnected:", event.code, event.reason);
      setConnected(false);
    };

    // Connection error
    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Clean up on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [url]);

  // Send message function
  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
      console.log("Message sent:", message);
      return true;
    }
    console.warn("WebSocket is not connected");
    return false;
  }, []);

  return { connected, lastMessage, sendMessage };
};
