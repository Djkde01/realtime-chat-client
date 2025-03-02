import { Stack } from "expo-router"

export default function ChatsLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#1e1e1e",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                contentStyle: {
                    backgroundColor: "#121212",
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Chats",
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: "Chat",
                    headerBackTitle: "Back",
                }}
            />
        </Stack>
    )
}

