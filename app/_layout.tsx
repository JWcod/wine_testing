import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from '../db/database';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="wine_atlas.db" onInit={initDatabase}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Colors.cream },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-wine"
          options={{
            presentation: 'modal',
            title: 'Add Wine',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
          }}
        />
        <Stack.Screen name="wine/[id]" options={{ title: 'Wine Detail' }} />
        <Stack.Screen name="region/[id]" options={{ title: 'Wine Region' }} />
        <Stack.Screen name="winery/[id]" options={{ title: 'Winery' }} />
      </Stack>
    </SQLiteProvider>
  );
}
