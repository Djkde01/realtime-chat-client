import { Stack } from "expo-router"

export default function ContactsLayout() {
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
                    title: "Contacts",
                }}
            />
            <Stack.Screen
                name="new-chat"
                options={{
                    presentation: "modal",
                    title: "New Chat",
                }}
            />
        </Stack>
    )
}

