// app/_layout.tsx
import { Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import SplashScreen from '../../components/SplasScreen';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 detik
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return <Slot />;
}
