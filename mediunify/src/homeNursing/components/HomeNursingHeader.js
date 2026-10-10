import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/Logo';
import CallModal from './CallModal';
import { useHomeNursing } from '../context/HomeNursingContext';

export default function HomeNursingHeader({
  navigation,
  showBack = false,
  title = null,
  subtitle = null,
  rightElement = null,
  patientPhone = null,
  patientName = null,
  compact = false,
  onBackPress = null,
  showCall = true,
}) {
  const { currentStatus, setCurrentStatus, unreadNotificationsCount } = useHomeNursing();
  const [callModalVisible, setCallModalVisible] = useState(false);

  // Online when status is anything except 'Off duty'
  const isOnline = currentStatus !== 'Off duty';

  const handleSetStatus = (newStatus) => {
    setCurrentStatus(newStatus);
    if (newStatus === 'Available') {
      Alert.alert(
        'Status: Online 🟢',
        'You are now Online and available to receive patient doorstep care assignments.'
      );
    } else {
      Alert.alert(
        'Status: Offline ⚪',
        'You are now Offline. You will not receive any new patient assignments until you go online.'
      );
    }
  };

  const handleNotificationPress = () => {
    if (navigation) {
      navigation.navigate('HomeNursingNotifications');
    }
  };

  const handleBackPress = () => {
    if (!navigation) return;
    if (typeof onBackPress === 'function') {
      onBackPress();
      return;
    }
    if (navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      try {
        navigation.navigate('HomeNursingHome');
      } catch (err) {
        try {
          navigation.navigate('RoleSelection');
        } catch (e) {}
      }
    }
  };

  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#071E42" />

      {/* TOP ROW: BRAND (LOGO + MEDIUNIFY TEXT) & ONLINE/OFFLINE + ACTIONS */}
      <View style={styles.topRow}>
        {/* LEFT: BACK BUTTON (IF SUBPAGE) + LOGO + MEDIUNIFY TEXT */}
        <View style={styles.leftBrandSection}>
          {showBack && navigation && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleBackPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.brandRow}
            onPress={() => navigation && navigation.navigate('HomeNursingHome')}
            activeOpacity={0.85}
          >
            <Logo size={28} style={styles.logoBadge} />
            <View style={styles.brandTextWrap}>
              <Text style={styles.brandName}>
                <Text style={styles.brandMedi}>Medi</Text>
                <Text style={styles.brandUnify}>Unify</Text>
              </Text>
              <Text style={styles.brandRoleBadge}>HOME NURSE</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* RIGHT: ONLINE / OFFLINE BUTTON & CALL / NOTIFICATION ICONS */}
        <View style={styles.rightHeaderControls}>
          {/* ONLINE / OFFLINE BUTTON AT TOP */}
          <View style={styles.onlineOfflinePill}>
            {/* ONLINE BUTTON */}
            <TouchableOpacity
              style={[
                styles.statusBtn,
                isOnline && styles.statusBtnOnlineActive,
              ]}
              onPress={() => handleSetStatus('Available')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.statusDot,
                  isOnline && styles.statusDotOnlineActive,
                ]}
              />
              <Text
                style={[
                  styles.statusBtnText,
                  isOnline && styles.statusBtnTextActive,
                ]}
              >
                Online
              </Text>
            </TouchableOpacity>

            {/* OFFLINE BUTTON */}
            <TouchableOpacity
              style={[
                styles.statusBtn,
                !isOnline && styles.statusBtnOfflineActive,
              ]}
              onPress={() => handleSetStatus('Off duty')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.statusDot,
                  !isOnline && styles.statusDotOfflineActive,
                ]}
              />
              <Text
                style={[
                  styles.statusBtnText,
                  !isOnline && styles.statusBtnTextActive,
                ]}
              >
                Offline
              </Text>
            </TouchableOpacity>
          </View>

          {/* CALL & NOTIFICATION ICONS */}
          <View style={styles.iconsRow}>
            {/* CALL BUTTON */}
            {showCall && (
              <TouchableOpacity
                style={styles.headerCircleBtn}
                onPress={() => setCallModalVisible(true)}
                activeOpacity={0.75}
                accessibilityLabel="Emergency and Direct Support Call"
              >
                <Ionicons name="call" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {/* NOTIFICATION BUTTON */}
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={handleNotificationPress}
              activeOpacity={0.75}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications" size={16} color="#FFFFFF" />
              {unreadNotificationsCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* SUB-SCREEN TITLE BAR (IF PROVIDED) */}
      {title && (
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>{title}</Text>
            {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
          </View>
          {rightElement && <View style={styles.rightElementWrap}>{rightElement}</View>}
        </View>
      )}

      {/* CALL MODAL DIALOG */}
      <CallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        patientPhone={patientPhone}
        patientName={patientName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#071E42',
    paddingTop:
      Platform.OS === 'ios'
        ? 50
        : (StatusBar.currentHeight ? StatusBar.currentHeight + 14 : 44),
    paddingBottom: 14,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 2,
    gap: 8,
  },
  leftBrandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    borderWidth: 1.2,
    borderColor: '#00B894',
    backgroundColor: '#FFFFFF',
  },
  brandTextWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandMedi: {
    color: '#00B894',
    fontWeight: '900',
  },
  brandUnify: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  brandRoleBadge: {
    fontSize: 8,
    fontWeight: '800',
    color: '#7FE3D4',
    letterSpacing: 0.8,
    marginTop: -2,
  },

  /* Right Section: Online/Offline Pill + Actions */
  rightHeaderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  /* Online / Offline Button Pill */
  onlineOfflinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    padding: 2.5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 15,
    gap: 4.5,
  },
  statusBtnOnlineActive: {
    backgroundColor: '#00B894',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  statusBtnOfflineActive: {
    backgroundColor: '#475569',
  },
  statusDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  statusDotOnlineActive: {
    backgroundColor: '#FFFFFF',
  },
  statusDotOfflineActive: {
    backgroundColor: '#CBD5E1',
  },
  statusBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  statusBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* Call & Notification Icons */
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#00B894',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#071E42',
  },
  bellBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 4,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  rightElementWrap: {
    marginLeft: 10,
  },
});
