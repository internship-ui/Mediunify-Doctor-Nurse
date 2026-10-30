import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doctor } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function DoctorTopNavbar({
  activeTab,
  setActiveTab,
  onQuickConsultation,
  onNavigateHome,
}) {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    setShowProfileMenu(false);
    if (logout) logout();
    if (onNavigateHome) onNavigateHome();
  };

  return (
    <View style={styles.navbar}>
      {/* Brand Section */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Ionicons name="medical" size={22} color="#00B894" />
        </View>
        <View>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitle}>MediUnify</Text>
            <View style={styles.portalTag}>
              <Text style={styles.portalTagText}>CLINICIAN DESK</Text>
            </View>
          </View>
          <Text style={styles.brandSub}>Doctor Portal & Healthcare Suite</Text>
        </View>
      </View>

      {/* Global Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={17} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients, appointments, medicines, lab records..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
            <Ionicons name="close-circle" size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Right Actions */}
      <View style={styles.rightSection}>
        {/* Live Clinic Status Badge */}
        <View style={styles.liveStatusPill}>
          <View style={styles.liveStatusDot} />
          <Text style={styles.liveStatusText}>Live Practice</Text>
        </View>

        {/* Quick Action Button: New Consultation */}
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => setActiveTab('consultation')}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={16} color="#FFFFFF" />
          <Text style={styles.quickActionBtnText}>New Consultation</Text>
        </TouchableOpacity>

        {/* Quick Action Button: New Prescription */}
        <TouchableOpacity
          style={styles.secondaryActionBtn}
          onPress={() => setActiveTab('prescriptions')}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={16} color="#0F766E" />
          <Text style={styles.secondaryActionBtnText}>Write Rx</Text>
        </TouchableOpacity>

        {/* Email / Messages Icon -> Directs to external Google Email with "to" tag */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={() => {
            if (typeof window !== 'undefined') {
              window.open('https://mail.google.com/mail/?view=cm&fs=1&to=', '_blank');
            }
          }}
          title="Compose Email via Google Mail"
        >
          <Ionicons name="mail-outline" size={20} color="#334155" />
        </TouchableOpacity>

        {/* Notifications Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={() => setActiveTab('appointments')}
        >
          <Ionicons name="notifications-outline" size={20} color="#334155" />
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>3</Text>
          </View>
        </TouchableOpacity>

        {/* Doctor Profile Menu */}
        <View style={styles.profileWrapper}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setShowProfileMenu(!showProfileMenu)}
            activeOpacity={0.8}
          >
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorInitials}>
                {doctor.name ? doctor.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('') : 'DR'}
              </Text>
            </View>
            <View style={styles.doctorMeta}>
              <Text style={styles.doctorName}>{doctor.name || 'Dr. Ananya Rao'}</Text>
              <Text style={styles.doctorSpec}>{doctor.specialization || 'General Physician'}</Text>
            </View>
            <Ionicons
              name={showProfileMenu ? 'chevron-up' : 'chevron-down'}
              size={15}
              color="#64748B"
            />
          </TouchableOpacity>

          {showProfileMenu && (
            <View style={styles.profileDropdown}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>{doctor.name}</Text>
                <Text style={styles.dropdownSub}>{doctor.qualification}</Text>
                <Text style={styles.dropdownReg}>Reg: {doctor.regNo}</Text>
              </View>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowProfileMenu(false);
                  setActiveTab('profile');
                }}
              >
                <Ionicons name="person-outline" size={16} color="#334155" />
                <Text style={styles.dropdownItemText}>My Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowProfileMenu(false);
                  setActiveTab('schedule');
                }}
              >
                <Ionicons name="calendar-outline" size={16} color="#334155" />
                <Text style={styles.dropdownItemText}>My Schedule & Slots</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowProfileMenu(false);
                  setActiveTab('earnings');
                }}
              >
                <Ionicons name="wallet-outline" size={16} color="#334155" />
                <Text style={styles.dropdownItemText}>Earnings & Payouts</Text>
              </TouchableOpacity>

              <View style={styles.dropdownDivider} />

              <TouchableOpacity
                style={[styles.dropdownItem, styles.dropdownItemDanger]}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={16} color="#DC2626" />
                <Text style={styles.dropdownItemTextDanger}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Portal Home Button */}
        <TouchableOpacity
          style={styles.homeShortcutBtn}
          onPress={onNavigateHome}
          activeOpacity={0.7}
        >
          <Ionicons name="globe-outline" size={15} color="#0A2342" />
          <Text style={styles.homeShortcutText}>Portal Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 72,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 1000,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 240,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 184, 148, 0.12)',
    borderWidth: 1.5,
    borderColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  portalTag: {
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.3)',
  },
  portalTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00B894',
    letterSpacing: 0.6,
  },
  brandSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  searchContainer: {
    flex: 1,
    maxWidth: 440,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00B894',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginHorizontal: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  clearSearchBtn: {
    padding: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  liveStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    boxShadow: '0 2px 8px rgba(0, 184, 148, 0.35)',
  },
  quickActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
  },
  secondaryActionBtnText: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  profileWrapper: {
    position: 'relative',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  doctorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInitials: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  doctorMeta: {
    alignItems: 'flex-start',
  },
  doctorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorSpec: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  profileDropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
    padding: 8,
    zIndex: 9999,
  },
  dropdownHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 4,
  },
  dropdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  dropdownSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  dropdownReg: {
    fontSize: 10,
    color: '#00B894',
    fontWeight: '600',
    marginTop: 2,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  dropdownItemDanger: {
    backgroundColor: '#FEF2F2',
  },
  dropdownItemTextDanger: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  homeShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  homeShortcutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A2342',
  },
});
