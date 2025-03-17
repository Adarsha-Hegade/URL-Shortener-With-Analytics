import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function RedirectScreen() {
  const { slug } = useLocalSearchParams();

  useEffect(() => {
    async function handleRedirect() {
      try {
        // Get the original URL from the database
        const { data, error } = await supabase
          .from('shortened_urls')
          .select('original_url')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (!data?.original_url) throw new Error('URL not found');

        // Record analytics
        await supabase.from('url_analytics').insert({
          url_id: data.id,
          visitor_id: Math.random().toString(36).substring(7),
          device_type: 'mobile',
          browser: 'Expo Go',
        });

        // Redirect to the original URL
        window.location.href = data.original_url;
      } catch (err) {
        console.error('Redirect error:', err);
      }
    }

    handleRedirect();
  }, [slug]);

  return (
    <>
      <Stack.Screen options={{ title: 'Redirecting...' }} />
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0891b2" />
        <Text style={styles.text}>Redirecting...</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
});