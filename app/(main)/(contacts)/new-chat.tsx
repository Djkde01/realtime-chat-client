"use client"

import { useState } from "react"
import { FlatList, ActivityIndicator, Alert } from "react-native"
import { useRouter } from "expo-router"
import styled from "styled-components/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useContacts } from "@/hooks/useContacts"
import { ContactSelectItem } from "@/components/ui/contacts/ContactSelectItem"
import { EmptyState } from "@/components/ui/EmptyState"
import { ButtonProps } from "@/types/props"

export default function NewChatScreen() {
    const { contacts, loading, error, createChat, setLoading } = useContacts()
    const [selectedContacts, setSelectedContacts] = useState<string[]>([])
    const router = useRouter()

    const toggleContact = (contactId: string) => {
        setSelectedContacts((prev) =>
            prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
        )
    }

    const handleCreateChat = async () => {
        if (selectedContacts.length === 0) return;

        try {
            setLoading(true);

            // Determine if it's a group chat
            const isGroup = selectedContacts.length > 1;
            const chatName = isGroup ? "New Group Chat" : undefined;

            // Use the createChat function from the hook
            const newChat = await createChat(selectedContacts, chatName);

            // Navigate to the new chat
            router.push({
                pathname: "/(main)/chat/[id]",
                params: { id: newChat.id }
            } as never);

        } catch (error) {
            console.error("Failed to create chat:", error);
            Alert.alert("Error", "Failed to create chat. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <LoadingContainer>
                <ActivityIndicator size="large" color="#0084ff" />
            </LoadingContainer>
        )
    }

    if (error) {
        return <EmptyState icon="alert-circle" title="Error loading contacts" message="Please try again later" />
    }

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <Container>
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ContactSelectItem
                            contact={item}
                            selected={selectedContacts.includes(item.id)}
                            onToggle={() => toggleContact(item.id)}
                        />
                    )}
                    ItemSeparatorComponent={() => <Separator />}
                />
                <CreateButton onPress={handleCreateChat} disabled={selectedContacts.length === 0}>
                    <CreateButtonText>Create Chat ({selectedContacts.length})</CreateButtonText>
                </CreateButton>
            </Container>
        </SafeAreaView>
    )
}

const Container = styled.View`
  flex: 1;
  background-color: #121212;
`

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #121212;
`

const Separator = styled.View`
  height: 1px;
  background-color: #333;
`

const CreateButton = styled.TouchableOpacity<{ disabled: boolean }>`
  margin: 16px;
  padding: 16px;
  background-color: ${(props: ButtonProps) => (props.disabled ? "#666" : "#0084ff")};
  border-radius: 8px;
  align-items: center;
`

const CreateButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`

