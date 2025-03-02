import { FlatList, ActivityIndicator } from "react-native"
import { Link } from "expo-router"
import styled from "styled-components/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useChats } from "@/hooks/useChats"
import { ChatListItem } from "@/components/ui/chat/ChatListItem"
import { EmptyState } from "@/components/ui/EmptyState"

export default function ChatsScreen() {
  const { chats, loading, error } = useChats()

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#0084ff" />
      </LoadingContainer>
    )
  }

  if (error) {
    return <EmptyState icon="alert-circle" title="Error loading chats" message="Please try again later" />
  }

  if (!chats?.length) {
    return <EmptyState icon="message-square" title="No chats yet" message="Start a new chat from the Contacts tab" />
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Container>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/(main)/chat/${item.id}` as never} asChild>
              <ChatListItem chat={item} />
            </Link>
          )}
          ItemSeparatorComponent={() => <Separator />}
        />
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

