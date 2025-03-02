import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SendIcon } from '@/components/ui/Icons';
import { ButtonProps } from '@/types/props';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  onTyping?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  disabled = false,
  onTyping
}) => {
  // Debounce typing events
  useEffect(() => {
    if (value && onTyping) {
      onTyping();
    }
  }, [value, onTyping]);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend();
    }
  };

  return (
    <InputContainer>
      <StyledTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        placeholderTextColor="#999"
        multiline
      />
      <SendButton onPress={handleSend} disabled={disabled || !value.trim()}>
        <SendIcon size={24} color={value.trim() ? "#0084ff" : "#666"} />
      </SendButton>
    </InputContainer>
  );
};

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 16px;
  background-color: #1e1e1e;
  border-top-width: 1px;
  border-top-color: #333;
`

const StyledTextInput = styled.TextInput`
  flex: 1;
  min-height: 40px;
  max-height: 100px;
  background-color: #333;
  border-radius: 20px;
  padding: 10px 15px;
  color: #fff;
  font-size: 16px;
  margin-right: 10px;
`

const SendButton = styled.TouchableOpacity<{ disabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props: ButtonProps) => props.disabled ? "#222" : "#222"};
  justify-content: center;
  align-items: center;
  opacity: ${(props: ButtonProps) => props.disabled ? 0.5 : 1};
`