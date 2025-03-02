import type React from "react"
import styled from "styled-components/native"
import type { Contact } from "@/types/uiTypes"
import { Check } from "@components/ui/Icons"
import { SelectProps } from "@/types/props"

interface ContactSelectItemProps {
    contact: Contact
    selected: boolean
    onToggle: () => void
}

export const ContactSelectItem: React.FC<ContactSelectItemProps> = ({ contact, selected, onToggle }) => {
    return (
        <Container onPress={onToggle}>
            <Avatar source={{ uri: contact.avatar }} />
            <Content>
                <Name>{contact.name}</Name>
                <Status>{contact.status}</Status>
            </Content>
            <SelectIndicator selected={selected}>{selected && <Check size={20} color="#fff" />}</SelectIndicator>
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

const Name = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`

const Status = styled.Text`
  color: #666;
  font-size: 14px;
`

const SelectIndicator = styled.View<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props: SelectProps) => (props.selected ? "#0084ff" : "#666")};
  background-color: ${(props: SelectProps) => (props.selected ? "#0084ff" : "transparent")};
  justify-content: center;
  align-items: center;
`

