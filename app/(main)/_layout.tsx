import { Tabs } from "expo-router"
import { MessageSquare, Users } from "@/components/ui/Icons"

export default function MainLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#1e1e1e",
                    borderTopColor: "#333",
                },
                tabBarActiveTintColor: "#0084ff",
                tabBarInactiveTintColor: "#666",
            }}
        >
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chats",
                    tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="(contacts)"
                options={{
                    title: "Contacts",
                    tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
                }}
            />
        </Tabs>
    )
}

