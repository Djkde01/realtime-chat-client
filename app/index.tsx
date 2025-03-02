import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from "react-native";
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function IndexPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // This acts as a splash/routing page
        if (!loading) {
            if (user) {
                router.replace('/(main)/chat' as never);
            } else {
                router.replace('/login');
            }
        }
    }, [user, loading, router]);

    // Show loading indicator while determining authentication state
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0084ff" />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    text: {
        marginTop: 20,
        color: '#fff',
        fontSize: 16,
    }
});