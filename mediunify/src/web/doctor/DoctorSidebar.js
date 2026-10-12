import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';
import { doctor } from '../../data/mockData';

export default function DoctorSidebar({
  activeTab,
  setActiveTab,
  onNavigateHome,
}) {
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar-outline' },
    { id: 'followups', label: 'Follow-ups', icon: 'sync-outline' },
    { id: 'directpatient', label: 'Direct patient', icon: 'person-add-outline' },
    { id: 'availability', label: 'Availability', icon: 'time-outline' },
    { id: 'profile', label: 'Profile', icon: 'person-outline' },
  ];

  return (
    <View style={styles.sidebar}>
      {/* Brand Top */}
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.brandRow}
          onPress={() => onNavigateHome ? onNavigateHome() : setActiveTab('dashboard')}
          activeOpacity={0.8}
        >
          <WebLogo size={32} style={styles.brandLogo} />
          <Text style={styles.brandTitle}>
            Medi<Text style={styles.brandAccent}>Unify</Text>
          </Text>
        </TouchableOpacity>

        {/* Navigation Group */}
        <View style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  isActive && styles.navItemActive,
                ]}
                onPress={() => setActiveTab(item.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon}
                  size={19}
                  color={isActive ? '#FFFFFF' : '#CBD5E1'}
                />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bottom Doctor Profile Card (Matching Image) */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.doctorProfileCard}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.8}
        >
          <View style={styles.doctorAvatar}>
            <Text style={styles.avatarInitials}>AR</Text>
          </View>
          <View style={styles.doctorMeta}>
            <Text style={styles.doctorName}>Dr. Ananya Rao</Text>
            <Text style={styles.doctorRole}>Indiranagar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    flexShrink: 0,
    backgroundColor: '#081E3E',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    overflowY: 'auto',
  },
  topSection: {
    gap: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  brandLogo: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  brandAccent: {
    color: '#00B894',
  },
  navList: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: '#00B894',
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  doctorProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 10,
  },
  doctorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  doctorMeta: {
    flex: 1,
  },
  doctorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doctorRole: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
