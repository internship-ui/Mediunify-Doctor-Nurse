import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';
import { useHomeNursing } from '../../homeNursing/context/HomeNursingContext';

export default function NurseSidebar({
  activeTab,
  setActiveTab,
  onLogout,
}) {
  const { currentStatus, nurseProfile } = useHomeNursing();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
    { id: 'services', label: 'Services', icon: 'bag-handle-outline' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar-outline' },
    { id: 'history', label: 'History', icon: 'refresh-outline' },
    { id: 'profile', label: 'Profile', icon: 'person-outline' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return '#00B894';
      case 'Assigned':
        return '#F59E0B';
      case 'On the way':
      case 'On the Way':
        return '#0284C7';
      case 'In progress':
      case 'Service In Progress':
        return '#8B5CF6';
      case 'Off duty':
      case 'Unavailable / Off Duty':
        return '#94A3B8';
      default:
        return '#00B894';
    }
  };

  return (
    <View style={styles.sidebar}>
      {/* Brand Top: MediUnify Logo and Word matching Doctor Portal */}
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.logoRow}
          onPress={() => setActiveTab('dashboard')}
          activeOpacity={0.8}
        >
          <WebLogo size={30} style={styles.brandLogo} />
          <Text style={styles.brandTitle}>
            Medi<Text style={styles.brandAccent}>Unify</Text>
          </Text>
        </TouchableOpacity>

        {/* Nav Links */}
        <View style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'schedule' && activeTab === 'availability');
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => setActiveTab(item.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon}
                  size={19}
                  color={isActive ? '#FFFFFF' : '#94A3B8'}
                />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bottom Profile Pill */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.nurseProfileCard}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.8}
        >
          <View style={styles.nurseAvatar}>
            <Text style={styles.avatarInitials}>
              {nurseProfile?.initials || 'KR'}
            </Text>
          </View>
          <View style={styles.nurseMeta}>
            <Text style={styles.nurseName} numberOfLines={1}>
              {nurseProfile?.fullName || 'Kavitha R.'}
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(currentStatus) }]} />
              <Text style={styles.nurseStatusText}>{currentStatus || 'Available'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn} title="Sign Out">
            <Ionicons name="log-out-outline" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: '#081E3E',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
  },
  topSection: {
    gap: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  odaletBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
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
  nurseProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 10,
  },
  nurseAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  nurseMeta: {
    flex: 1,
  },
  nurseName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nurseStatusText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: 4,
  },
});
