import type React from "react"
import styled from "styled-components/native"
import { AlertCircle, MessageSquare, Users } from "./Icons"

interface EmptyStateProps {
    icon: "alert-circle" | "message-square" | "users"
    title: string
    message: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
    const IconComponent = {
        "alert-circle": AlertCircle,
        "message-square": MessageSquare,
        users: Users,
    }[icon]

    return (
        <Container>
            <IconComponent size={48} color="#666" />
            <Title>{title}</Title>
            <Message>{message}</Message>
        </Container>
    )
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #121212;
`

const Title = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-top: 16px;
  margin-bottom: 8px;
`

const Message = styled.Text`
  color: #666;
  font-size: 16px;
  text-align: center;
`

