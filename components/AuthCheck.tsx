import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export function AuthCheck() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        // Check if the current route is within auth screens
        // "/login" or "/(auth)/login" should both match
        const isAuthRoute = segments.some(segment =>
            segment === 'login' || segment === 'register' || segment === '(auth)'
        );

        // If user is authenticated but on auth screens, redirect to chat
        if (user && isAuthRoute) {
            router.replace('/chat' as never);
        }

        // If user is not authenticated and not on auth screens or index, redirect to login
        if (!user && !isAuthRoute && segments[0] !== undefined) {
            router.replace('/login' as never);
        }
    }, [user, loading, segments]);

    return null;
}