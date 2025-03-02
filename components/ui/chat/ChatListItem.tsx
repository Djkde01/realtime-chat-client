import type React from "react"
import styled from "styled-components/native"
import { format } from "date-fns"
import type { Chat } from "@/types/uiTypes"

interface ChatListItemProps {
  chat: Chat;
  onPress?: () => void;
  style?: any;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onPress,  // Accept onPress from Link
  ...props  // Accept any other props   
}) => {
  // Get avatar from first participant or use default
  const avatarUri = chat.participants.length > 0
    ? (chat.participants[0]?.profileImage || "https://placehold.co/50")
    : "https://placehold.co/50";

  // For group chats with multiple participants, we could use a group icon instead
  const displayAvatar = chat.isGroup
    ? "https://placehold.co/50?text=Group"
    : avatarUri;

  return (
    <Container onPress={onPress} {...props}>
      <Avatar source={{ uri: displayAvatar }} />
      <Content>
        <TopRow>
          <Title>{chat.name}</Title>
          {chat.lastMessage && (
            <Time>{format(new Date(chat.lastMessage.sent_at), "HH:mm")}</Time>
          )}
        </TopRow>
        <BottomRow>
          <LastMessage numberOfLines={1}>
            {chat.lastMessage
              ? chat.lastMessage.content
              : "No messages yet"}
          </LastMessage>
          {(chat.unreadCount && chat.unreadCount > 0) && (
            <UnreadBadge>
              <UnreadCount>{chat.unreadCount}</UnreadCount>
            </UnreadBadge>
          )}
        </BottomRow>
      </Content>
    </Container>
  )
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  padding: 12px 16px;
  align-items: center;
`

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
`

const Content = styled.View`
  flex: 1;
`

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`

const Title = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`

const Time = styled.Text`
  color: #666;
  font-size: 12px;
`

const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const LastMessage = styled.Text`
  color: #999;
  font-size: 14px;
  flex: 1;
  margin-right: 8px;
`

const UnreadBadge = styled.View`
  background-color: #0084ff;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
`

const UnreadCount = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`

