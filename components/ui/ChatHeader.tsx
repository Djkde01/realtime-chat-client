import React from 'react';
import styled from 'styled-components/native';
import { MessageSquare } from './Icons';
import { DefaultTheme } from 'styled-components';

interface ChatHeaderProps {
    connected: boolean;
}

type TextProps = {
    connected: boolean;
} & { theme: DefaultTheme };

export const ChatHeader: React.FC<ChatHeaderProps> = ({ connected }) => {
    return (
        <HeaderContainer>
            <HeaderContent>
                <IconContainer>
                    <MessageSquare size={24} color="#fff" />
                </IconContainer>
                <HeaderTitle>Real-time Chat</HeaderTitle>
            </HeaderContent>
            <ConnectionStatus connected={connected}>
                {connected ? 'Connected' : 'Disconnected'}
            </ConnectionStatus>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.View`
  height: 60px;
  background-color: #1e1e1e;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.View`
  margin-right: 10px;
`;

const HeaderTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const ConnectionStatus = styled.Text<{ connected: boolean }>`
  color: ${(props: TextProps) => props.connected ? '#4caf50' : '#f44336'};
  font-size: 14px;
`;
