import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export default function SplashScreen() {
    const opacity = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            delay: 300,
            useNativeDriver: true,
        }).start();

        const timeout = setTimeout(() => {
            router.replace('/(tabs)/movie');
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <LinearGradient colors={['#6B46C1', '#7C2D12']} style={styles.container}>
            <Animated.View style={[styles.content, { opacity }]}>
                <Text style={styles.title}>Movie App</Text>
                <Text style={styles.subtitle}>Cari Film Menarik</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { alignItems: 'center' },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#E5E7EB',
    },
});
