import type React from "react"
import styled from "styled-components/native"
import type { Message } from "@/types/uiTypes"
import { DefaultTheme } from "styled-components"
import { useAuth } from "@/context/AuthContext"

interface MessageBubbleProps {
  message: Message
}

type MessageProps = {
  isMyMessage: boolean
} & { theme: DefaultTheme }

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth()
  const formattedTime = formatTime(message.sent_at)
  const isMyMessage = message.sender.id === user?.id

  return (
    <BubbleContainer isMyMessage={isMyMessage}>
      <BubbleContent isMyMessage={isMyMessage}>
        <MessageText isMyMessage={isMyMessage}>{message.content}</MessageText>
        <TimeText isMyMessage={isMyMessage}>{formattedTime} - {message.status}</TimeText>
      </BubbleContent>
    </BubbleContainer>
  )
}

const formatTime = (date: string): string => {
  const dateObj = new Date(date)
  // Validate if dateObj is a valid date
  if (isNaN(dateObj.getTime())) {
    return ""
  }
  return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const BubbleContainer = styled.View<{ isMyMessage: boolean }>`
  align-self: ${(props: MessageProps) => (props.isMyMessage ? "flex-end" : "flex-start")};
  margin-bottom: 10px;
  max-width: 80%;
`

const BubbleContent = styled.View<{ isMyMessage: boolean }>`
  background-color: ${(props: MessageProps) => (props.isMyMessage ? "#0084ff" : "#333")};
  border-radius: 18px;
  padding: 12px 16px;
`

const MessageText = styled.Text<{ isMyMessage: boolean }>`
  color: ${(props: MessageProps) => (props.isMyMessage ? "#fff" : "#eee")};
  font-size: 16px;
`

const TimeText = styled.Text<{ isMyMessage: boolean }>`
  color: ${(props: MessageProps) => (props.isMyMessage ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.5)")};
  font-size: 12px;
  align-self: flex-end;
  margin-top: 4px;
`

