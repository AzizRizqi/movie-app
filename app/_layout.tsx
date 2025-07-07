// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import SplashScreen from '../components/ui/SplasScreen';

export default function RootLayout() {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" /> // Points to the (tabs) route group
        </Stack>
    );

}