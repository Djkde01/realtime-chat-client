import type React from "react"
import styled from "styled-components/native"
import { SendIcon } from "./Icons"
import { DefaultTheme } from "styled-components"

interface ChatInputProps {
    value: string
    onChangeText: (text: string) => void
    onSend: () => void
    disabled: boolean
}

type SendButtonProps = { disabled: boolean } & { theme: DefaultTheme };

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChangeText, onSend, disabled }) => {
    return (
        <InputContainer>
            <StyledTextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                multiline
                maxHeight={100}
                editable={!disabled}
            />
            <SendButton onPress={onSend} disabled={disabled || value.trim() === ""}>
                <SendIcon size={24} color={disabled || value.trim() === "" ? "#555" : "#0084ff"} />
            </SendButton>
        </InputContainer>
    )
}

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
  background-color: ${(props: SendButtonProps) => props.disabled ? "#222" : "#222"};
  justify-content: center;
  align-items: center;
  opacity: ${(props: SendButtonProps) => props.disabled ? 0.5 : 1};
`