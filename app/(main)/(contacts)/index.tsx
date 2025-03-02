"use client"
import { FlatList, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import styled from "styled-components/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useContacts } from "@/hooks/useContacts"
import { ContactListItem } from "@/components/ui/contacts/ContactListItem"
import { EmptyState } from "@/components/ui/EmptyState"
import { Plus } from "@/components/ui/Icons"

export default function ContactsScreen() {
    const { contacts, loading, error } = useContacts()
    const router = useRouter()

    if (loading) {
        return (
            <LoadingContainer>
                <ActivityIndicator size="large" color="#0084ff" />
            </LoadingContainer>
        )
    }

    if (error) {
        return <EmptyState icon="alert-circle" title="Error loading contacts" message="Please try again later" />
    }

    if (!contacts?.length) {
        return <EmptyState icon="users" title="No contacts found" message="Your contacts will appear here" />
    }

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <Container>
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ContactListItem contact={item} />}
                    ItemSeparatorComponent={() => <Separator />}
                />
                <NewChatButton onPress={() => router.push("/(main)/(contacts)/new-chat" as never)}>
                    <Plus size={24} color="#fff" />
                </NewChatButton>
            </Container>
        </SafeAreaView>
    )
}

const Container = styled.View`
  flex: 1;
  background-color: #121212;
`

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #121212;
`

const Separator = styled.View`
  height: 1px;
  background-color: #333;
`

const NewChatButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #0084ff;
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`

