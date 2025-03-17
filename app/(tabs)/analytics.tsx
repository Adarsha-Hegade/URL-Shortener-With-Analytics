import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Users, Globe as Globe2, Monitor, Smartphone } from 'lucide-react-native';

const DEMO_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 50],
    },
  ],
};

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Overview</Text>
        <Text style={styles.subtitle}>Last 7 days</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Click Performance</Text>
        <LineChart
          data={DEMO_DATA}
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
          <Text style={styles.statNumber}>1,234</Text>
          <Text style={styles.statLabel}>Total Visitors</Text>
        </View>

        <View style={styles.statCard}>
          <Globe2 size={24} color="#0891b2" />
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>

        <View style={styles.statCard}>
          <Monitor size={24} color="#0891b2" />
          <Text style={styles.statNumber}>60%</Text>
          <Text style={styles.statLabel}>Desktop</Text>
        </View>

        <View style={styles.statCard}>
          <Smartphone size={24} color="#0891b2" />
          <Text style={styles.statNumber}>40%</Text>
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