import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Crown, Globe as Globe2, Bell, Shield, Zap, ChevronRight, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.upgradeCard}>
        <Crown size={24} color="#0891b2" />
        <View style={styles.upgradeContent}>
          <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
          <Text style={styles.upgradeText}>
            Get access to all premium features
          </Text>
        </View>
        <ChevronRight size={20} color="#0891b2" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Globe2 size={20} color="#64748b" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Custom Domain</Text>
            <Text style={styles.settingDescription}>
              Connect your own domain
            </Text>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <Bell size={20} color="#64748b" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Get alerts for link clicks
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#cbd5e1', true: '#0891b2' }}
            thumbColor="white"
            value={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Shield size={20} color="#64748b" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Privacy Settings</Text>
            <Text style={styles.settingDescription}>
              Manage link privacy options
            </Text>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Zap size={20} color="#64748b" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>API Access</Text>
            <Text style={styles.settingDescription}>
              Manage API keys and access
            </Text>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  upgradeCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  upgradeContent: {
    flex: 1,
    marginLeft: 12,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0891b2',
  },
  upgradeText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 16,
    marginBottom: 8,
  },
  settingItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#0f172a',
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 32,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});