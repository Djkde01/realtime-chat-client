import { useState, useEffect, useRef } from "react";
import { chatService } from "@/services/chatService";
import type { Chat } from "@/types/uiTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false); // To track loading state between renders

  const loadChats = async (refresh = false) => {
    // Prevent concurrent fetch requests
    if (isLoadingRef.current) return;

    // Try to load from cache if not refreshing
    if (!refresh) {
      const cachedChats = await AsyncStorage.getItem("chats");
      if (cachedChats) {
        setChats(JSON.parse(cachedChats));
        setLoading(false);
      }
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      const fetchedChats = await chatService.getChats();

      // Sort chats by last message timestamp
      const sortedChats = fetchedChats.sort((a, b) => {
        const aTime = a.lastMessage
          ? new Date(a.lastMessage.sent_at).getTime()
          : new Date(a.updatedAt).getTime();
        const bTime = b.lastMessage
          ? new Date(b.lastMessage.sent_at).getTime()
          : new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });

      setChats(sortedChats);
      setError(null);

      // Cache the chats
      await AsyncStorage.setItem("chats", JSON.stringify(sortedChats));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load chats";
      setError(errorMessage);
      console.error("Error loading chats:", err);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  // Smart polling with exponential backoff on failure
  useEffect(() => {
    let pollTimer: NodeJS.Timeout;
    let pollInterval = 30000; // Start with 30s
    const maxInterval = 5 * 60 * 1000; // Max 5 minutes

    // Initial load
    loadChats();

    const schedulePoll = () => {
      pollTimer = setTimeout(() => {
        loadChats(true)
          .then(() => {
            // On success, reset interval
            pollInterval = 30000;
            schedulePoll();
          })
          .catch(() => {
            // On failure, increase interval with exponential backoff
            pollInterval = Math.min(pollInterval * 2, maxInterval);
            schedulePoll();
          });
      }, pollInterval);
    };

    schedulePoll();

    return () => clearTimeout(pollTimer);
  }, []);

  return {
    chats,
    loading,
    error,
    refreshChats: () => loadChats(true),
  };
}
