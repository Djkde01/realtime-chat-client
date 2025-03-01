"use client"

import { useState, useEffect, useRef } from "react"
import { SafeAreaView, KeyboardAvoidingView, Platform, type FlatList } from "react-native"
import styled from "styled-components/native"
import { ChatHeader } from "@/components/ui/ChatHeader"
import { MessageBubble } from "@/components/ui/MessageBubble"
import { ChatInput } from "@/components/ui/ChatInput"
import { useWebSocket } from "@/hooks/useWebSocket"
import { useAuth } from "@/context/AuthContext"
import { useLocalSearchParams, router } from "expo-router"
import type { Message } from "@/types/uiTypes"

export default function ChatRoomScreen() {
    // Get chat ID from URL
    const { id } = useLocalSearchParams<{ id: string }>();

    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState("")
    const flatListRef = useRef<FlatList>(null)
    const { user, logout } = useAuth()

    // Connect to specific chat room using ID
    const wsUrl = `wss://echo.websocket.org?token=${user?.token}&room=${id}`
    const { connected, sendMessage, lastMessage } = useWebSocket(wsUrl)

    useEffect(() => {
        // Here you could fetch previous messages for this specific room
        // fetchMessageHistory(id)...

        // For now we'll just add a welcome message
        setMessages([{
            id: "welcome",
            text: `Welcome to chat room ${id}!`,
            sender: "system",
            timestamp: new Date(),
        }]);
    }, [id]);

    useEffect(() => {
        if (lastMessage) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: lastMessage,
                sender: "other",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, newMessage])
        }
    }, [lastMessage])

    const handleSend = () => {
        if (inputText.trim() === "") return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "me",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, newMessage])
        sendMessage(inputText)
        setInputText("")
    }

    // Handle logout with proper navigation
    const handleLogout = () => {
        logout();
        router.replace('/login');
    }

    // Handle back button to return to chat list
    const handleBack = () => {
        router.back();
    }

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true })
            }, 100)
        }
    }, [messages])

    return (
        <Container>
            <SafeAreaView style={{ flex: 1 }}>
                <ChatHeader
                    connected={connected}
                    username={user?.username || "User"}
                    onLogout={handleLogout}
                    showBackButton
                    onBack={handleBack}
                    roomName={`Room ${id}`}
                />

                <MessageList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MessageBubble message={item} />}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                >
                    <ChatInput value={inputText} onChangeText={setInputText} onSend={handleSend} disabled={!connected} />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Container>
    )
}

const Container = styled.View`
  flex: 1;
  background-color: #121212;
`

const MessageList = styled.FlatList`
  flex: 1;
` as unknown as typeof FlatList