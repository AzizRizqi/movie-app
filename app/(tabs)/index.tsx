// app/(tabs)/index.tsx
import { Redirect } from 'expo-router';
import React from 'react';

export default function TabRootRedirect() {
  // This component acts as a redirector for the base path of the (tabs) group.
  // It will automatically navigate to the '/movie' route, which corresponds
  // to app/(tabs)/movie/index.tsx based on your _layout.tsx setup.
  return <Redirect href="/movie" />;
}