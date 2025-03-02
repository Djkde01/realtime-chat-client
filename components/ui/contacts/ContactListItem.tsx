import type React from "react"
import styled from "styled-components/native"
import type { Contact } from "@/types/uiTypes"

interface ContactListItemProps {
    contact: Contact
}

export const ContactListItem: React.FC<ContactListItemProps> = ({ contact }) => {
    return (
        <Container>
            <Avatar source={{ uri: contact.avatar }} />
            <Content>
                <Name>{contact.name}</Name>
                <Status>{contact.status}</Status>
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

