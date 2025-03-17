import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Link2, QrCode } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shortenUrl } from '@/lib/supabase';
import QRCode from 'qrcode';

export default function ShortenScreen() {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleShorten = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setQrCode(null);

      if (!url.trim()) {
        throw new Error('Please enter a URL');
      }

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }

      const result = await shortenUrl(url, customSlug || undefined);
      const shortUrl = `${window.location.origin}/${result.slug}`;
      const qrCodeData = await QRCode.toDataURL(shortUrl);
      
      setSuccess(`URL shortened successfully! Your short URL is: ${shortUrl}`);
      setQrCode(qrCodeData);
      setUrl('');
      setCustomSlug('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0891b2', '#0284c7']}
        style={styles.header}>
        <Link2 color="white" size={32} />
        <Text style={styles.title}>URL Shortener</Text>
        <Text style={styles.subtitle}>Create short, memorable links</Text>
      </LinearGradient>

      <View style={styles.form}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}

        <Text style={styles.label}>Long URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your long URL"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <Text style={styles.label}>Custom Slug (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="my-custom-link"
          value={customSlug}
          onChangeText={setCustomSlug}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, (!url.trim() || loading) && styles.buttonDisabled]}
          onPress={handleShorten}
          disabled={loading || !url.trim()}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Link2 color="white" size={20} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Shorten URL</Text>
            </>
          )}
        </TouchableOpacity>

        {qrCode && Platform.OS === 'web' && (
          <View style={styles.qrContainer}>
            <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200 }} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  button: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  successText: {
    color: '#16a34a',
    fontSize: 14,
  },
});