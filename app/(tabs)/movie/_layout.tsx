// app/(tabs)/movie/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
export default function MovieStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> 
      <Stack.Screen name="[id]" /> 
    </Stack>
  );
}