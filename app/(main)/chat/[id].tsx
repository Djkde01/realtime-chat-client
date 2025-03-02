"use client"

import { useState, useEffect, useRef } from "react"
import { KeyboardAvoidingView, Platform, type FlatList } from "react-native"
import { useLocalSearchParams } from "expo-router"
import styled from "styled-components/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChatHeader } from "@/components/ui/ChatHeader"
import { MessageBubble } from "@/components/ui/MessageBubble"
import { ChatInput } from "@/components/ui/ChatInput"
import { useChat } from "@/hooks/useChat"

export default function ChatScreen() {
    const { id } = useLocalSearchParams()
    const [inputText, setInputText] = useState("")
    const flatListRef = useRef<FlatList>(null)
    const { chat, messages, sendMessage, loading } = useChat(id as string)

    const handleSend = () => {
        if (inputText.trim() === "") return
        sendMessage(inputText)
        setInputText("")
    }

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true })
        }
    }, [messages])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container>
                <ChatHeader title={chat?.name || "Chat"} participants={chat?.participants || []} />

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
                    <ChatInput value={inputText} onChangeText={setInputText} onSend={handleSend} disabled={loading} />
                </KeyboardAvoidingView>
            </Container>
        </SafeAreaView>
    )
}

const Container = styled.View`
  flex: 1;
  background-color: #121212;
`

const MessageList = styled.FlatList`
  flex: 1;
` as unknown as typeof FlatList

