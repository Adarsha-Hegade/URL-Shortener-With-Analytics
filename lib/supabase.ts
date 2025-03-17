import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function shortenUrl(originalUrl: string, customSlug?: string) {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const slug = customSlug || generateRandomSlug();
    const { data, error } = await supabase
      .from('shortened_urls')
      .insert({
        original_url: originalUrl,
        slug,
        user_id: user.data.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUserUrls() {
  try {
    const { data, error } = await supabase
      .from('shortened_urls')
      .select(`
        *,
        url_analytics (
          device_type,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUrlAnalytics(urlId: string) {
  try {
    const { data, error } = await supabase
      .from('url_analytics')
      .select('*')
      .eq('url_id', urlId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}

function generateRandomSlug(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}