
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  
  return (
    <LinearGradient
      colors={['#6B46C1', '#7C2D12']}
      style={styles.container}
    >
      <Text style={styles.title}>Movie App</Text>
      <Text style={styles.subtitle}>Tontonan Gratis di Movie App</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
});