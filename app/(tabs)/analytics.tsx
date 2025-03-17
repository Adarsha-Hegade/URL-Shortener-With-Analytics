import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Users, Globe as Globe2, Monitor, Smartphone } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type AnalyticsData = {
  totalClicks: number;
  countries: Set<string>;
  deviceStats: {
    desktop: number;
    mobile: number;
  };
  dailyClicks: {
    [date: string]: number;
  };
};

export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalClicks: 0,
    countries: new Set(),
    deviceStats: { desktop: 0, mobile: 0 },
    dailyClicks: {},
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: urlData, error: urlError } = await supabase
        .from('shortened_urls')
        .select(`
          id,
          url_analytics (
            created_at,
            device_type,
            country
          )
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (urlError) throw urlError;

      // Process analytics data
      const analyticsData: AnalyticsData = {
        totalClicks: 0,
        countries: new Set<string>(),
        deviceStats: { desktop: 0, mobile: 0 },
        dailyClicks: {},
      };

      urlData?.forEach(url => {
        if (url.url_analytics) {
          url.url_analytics.forEach((analytics: any) => {
            // Total clicks
            analyticsData.totalClicks++;

            // Countries
            if (analytics.country) {
              analyticsData.countries.add(analytics.country);
            }

            // Device stats
            if (analytics.device_type === 'desktop') {
              analyticsData.deviceStats.desktop++;
            } else {
              analyticsData.deviceStats.mobile++;
            }

            // Daily clicks
            const date = new Date(analytics.created_at).toLocaleDateString();
            analyticsData.dailyClicks[date] = (analyticsData.dailyClicks[date] || 0) + 1;
          });
        }
      });

      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAnalytics}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Prepare chart data
  const dates = Object.keys(analytics.dailyClicks).sort();
  const chartData = {
    labels: dates.slice(-7), // Last 7 days
    datasets: [
      {
        data: dates.slice(-7).map(date => analytics.dailyClicks[date] || 0),
      },
    ],
  };

  // Calculate percentages for device types
  const totalDevices = analytics.deviceStats.desktop + analytics.deviceStats.mobile;
  const desktopPercentage = totalDevices ? Math.round((analytics.deviceStats.desktop / totalDevices) * 100) : 0;
  const mobilePercentage = totalDevices ? Math.round((analytics.deviceStats.mobile / totalDevices) * 100) : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Overview</Text>
        <Text style={styles.subtitle}>Last 7 days</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Click Performance</Text>
        <LineChart
          data={chartData}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(8, 145, 178, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Users size={24} color="#0891b2" />
          <Text style={styles.statNumber}>{analytics.totalClicks}</Text>
          <Text style={styles.statLabel}>Total Clicks</Text>
        </View>

        <View style={styles.statCard}>
          <Globe2 size={24} color="#0891b2" />
          <Text style={styles.statNumber}>{analytics.countries.size}</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>

        <View style={styles.statCard}>
          <Monitor size={24} color="#0891b2" />
          <Text style={styles.statNumber}>{desktopPercentage}%</Text>
          <Text style={styles.statLabel}>Desktop</Text>
        </View>

        <View style={styles.statCard}>
          <Smartphone size={24} color="#0891b2" />
          <Text style={styles.statNumber}>{mobilePercentage}%</Text>
          <Text style={styles.statLabel}>Mobile</Text>
        </View>
      </View>

      <View style={styles.upgradeCard}>
        <Text style={styles.upgradeTitle}>Want More Insights?</Text>
        <Text style={styles.upgradeText}>
          Upgrade to Premium for advanced analytics, custom domains, and more!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  upgradeCard: {
    backgroundColor: '#0891b2',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});