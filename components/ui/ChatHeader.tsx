import React from 'react';
import styled from 'styled-components/native';
import { MessageSquare, LogOut, ChevronLeft, Users } from './Icons';
import { DefaultTheme } from 'styled-components';
import { useRouter } from 'expo-router';
import type { ChatParticipant, User } from '@/types/uiTypes';

// Unified interface that works for both cases
interface ChatHeaderProps {
  // Main header props
  connected?: boolean;
  username?: string;
  onLogout?: () => void;

  // Chat room header props
  title?: string;
  participants?: ChatParticipant[];

  // Common props
  showBackButton?: boolean;
  onBack?: () => void;
}

type TextProps = {
  connected?: boolean;
} & { theme: DefaultTheme };

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  connected,
  username,
  onLogout,
  title,
  participants,
  showBackButton = false,
  onBack
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Determine which type of header to render based on props
  const isChatRoomHeader = title !== undefined;

  return (
    <HeaderContainer>
      <HeaderContent>
        {showBackButton && (
          <BackButton onPress={handleBack}>
            <ChevronLeft size={24} color="#fff" />
          </BackButton>
        )}

        <IconContainer>
          {isChatRoomHeader ? (
            <Users size={24} color="#fff" />
          ) : (
            <MessageSquare size={24} color="#fff" />
          )}
        </IconContainer>

        {isChatRoomHeader ? (
          <HeaderInfo>
            <HeaderTitle>{title}</HeaderTitle>
            {participants && participants.length > 0 && (
              <ParticipantsText>
                {participants.map(p => p.username).join(', ')}
              </ParticipantsText>
            )}
          </HeaderInfo>
        ) : (
          <HeaderTitle>Real-time Chat</HeaderTitle>
        )}
      </HeaderContent>

      <RightSection>
        {!isChatRoomHeader && username && (
          <UserInfo>
            <Username>{username}</Username>
            {connected !== undefined && (
              <ConnectionStatus connected={!!connected}>
                {connected ? "Connected" : "Disconnected"}
              </ConnectionStatus>
            )}
          </UserInfo>
        )}

        {onLogout && (
          <LogoutButton onPress={onLogout}>
            <LogOut size={20} color="#fff" />
          </LogoutButton>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

const BackButton = styled.TouchableOpacity`
  margin-right: 10px;
  padding: 5px;
`;

const HeaderInfo = styled.View`
  flex-direction: column;
`;

const ParticipantsText = styled.Text`
  color: #999;
  font-size: 12px;
`;

const HeaderContainer = styled.View`
  height: 60px;
  background-color: #1e1e1e;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
`

const IconContainer = styled.View`
  margin-right: 10px;
`

const HeaderTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`

const RightSection = styled.View`
  flex-direction: row;
  align-items: center;
`

const UserInfo = styled.View`
  align-items: flex-end;
  margin-right: 10px;
`

const Username = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`

const ConnectionStatus = styled.Text<{ connected: boolean }>`
  color: ${(props: TextProps) => props.connected ? '#4caf50' : '#f44336'};
  font-size: 14px;
`;


const LogoutButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #333;
  justify-content: center;
  align-items: center;
`