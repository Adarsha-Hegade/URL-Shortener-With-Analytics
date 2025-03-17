import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { supabase } from '@/lib/supabase';

export default function RootLayout() {
  useFrameworkReady();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // If no session exists, redirect to the sign in page
      if (!session && segments[0] !== '(auth)') {
        router.replace('/(auth)/sign-in');
      } else if (session && segments[0] === '(auth)') {
        router.replace('/(tabs)');
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && segments[0] === '(auth)') {
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT' && segments[0] !== '(auth)') {
        router.replace('/(auth)/sign-in');
      }
    });
  }, [segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}