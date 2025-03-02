import { useState, useEffect, useMemo } from "react";
import { api } from "@/services/apiClient";
import type { User, Contact } from "@/types/uiTypes";
import { useAuth } from "@/context/AuthContext";

export function useContacts() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth(); // Get the current user

  // Filter out current user and map to Contact format
  const contacts = useMemo<Contact[]>(() => {
    return users
      .filter((user) => user.id !== currentUser?.id) // Filter out current user
      .map((user) => ({
        id: user.id,
        name: user.username,
        avatar: user.profileImage || "https://via.placeholder.com/50",
        status: user.email,
      }));
  }, [users, currentUser?.id]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await api.get<User[]>("/api/users/");

      if (error) {
        throw new Error(error);
      }

      setUsers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load contacts";
      setError(errorMessage);
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a chat from selected contacts
  const createChat = async (
    participantIds: string[],
    name?: string
  ): Promise<any> => {
    try {
      // Create a new array with the selected participant IDs
      let allParticipantIds = [...participantIds];

      // Add the current user's ID if they have one and it's not already included
      if (currentUser?.id && !allParticipantIds.includes(currentUser.id)) {
        // This automatically adds the current user to the participants
        allParticipantIds.push(currentUser.id);
      }

      const { data, error } = await api.post("/api/chats/", {
        name,
        participants_ids: allParticipantIds, // Send the complete list including current user
      });

      if (error) {
        throw new Error(error);
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create chat";
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts, // Return the mapped contacts
    loading,
    setLoading,
    error,
    refreshContacts: loadContacts,
    createChat,
    // Optionally provide the original users if needed elsewhere
    users: users.filter((user) => user.id !== currentUser?.id),
  };
}
