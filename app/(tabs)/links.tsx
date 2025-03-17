import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { Link2, ExternalLink, ChartBar as BarChart2 } from 'lucide-react-native';
import { getUserUrls } from '@/lib/supabase';

type ShortenedUrl = {
  id: string;
  original_url: string;
  slug: string;
  created_at: string;
  url_analytics: Array<{
    created_at: string;
  }>;
};

export default function LinksScreen() {
  const [links, setLinks] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await getUserUrls();
      setLinks(data || []);
    } catch (err) {
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      setError('Could not open the URL');
    });
  };

  const renderItem = ({ item }: { item: ShortenedUrl }) => (
    <View style={styles.linkCard}>
      <View style={styles.linkHeader}>
        <Link2 size={20} color="#0891b2" />
        <Text style={styles.shortUrl}>{item.slug}</Text>
      </View>
      
      <Text style={styles.originalUrl} numberOfLines={1}>
        {item.original_url}
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <BarChart2 size={16} color="#64748b" />
          <Text style={styles.statText}>
            {item.url_analytics?.length || 0} clicks
          </Text>
        </View>
        <Text style={styles.date}>
          Created {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleOpenLink(item.original_url)}>
          <ExternalLink size={16} color="#0891b2" />
          <Text style={styles.actionText}>Open</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <BarChart2 size={16} color="#0891b2" />
          <Text style={styles.actionText}>Stats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadLinks}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (links.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No links yet</Text>
        <Text style={styles.emptySubtext}>
          Create your first shortened URL to see it here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={links}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadLinks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  list: {
    padding: 16,
  },
  linkCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shortUrl: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0891b2',
    marginLeft: 8,
  },
  originalUrl: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    color: '#64748b',
    fontSize: 14,
  },
  date: {
    color: '#94a3b8',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    color: '#0891b2',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});