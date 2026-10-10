import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import Card from '../components/Card';
import { colors, spacing, typography, radius } from '../theme/colors';
import { notifications } from '../data/mockData';

export default function NotificationsScreen({ navigation }) {
  const handleEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Initiate an emergency call for an urgent patient case?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* ======================================================
          DARK NAVY HEADER (MATCHING APPOINTMENTS & USER'S THEME)
      ======================================================= */}
      <View style={styles.headerNavy}>
        {/* TOP BRAND ROW: LOGO & "MediUnify" + ACTIONS */}
        <View style={styles.topBrandRow}>
          <View style={styles.brandRow}>
            <Logo size={34} />
            <Text style={styles.brandName}>
              <Text style={styles.brandMedi}>Medi</Text>
              <Text style={styles.brandUnify}>Unify</Text>
            </Text>
          </View>

          <View style={styles.headerIconsRow}>
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={handleEmergency}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={17} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications" size={17} color="#FFFFFF" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION ROW: (←) Notifications */}
        <View style={styles.navHeaderRow}>
          <TouchableOpacity
            style={styles.headerNavCircleBtn}
            onPress={() => {
              if (navigation && navigation.canGoBack && navigation.canGoBack()) {
                navigation.goBack();
              } else if (navigation && navigation.navigate) {
                navigation.navigate('Home');
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.screenMainTitle}>Notifications</Text>
            <Text style={styles.screenSubTitle}>Stay on top of your practice</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* NOTIFICATIONS LIST */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon || 'notifications-outline'} size={19} color="#071E42" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.detail}>{item.detail}</Text>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={12} color="#94A3B8" />
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /* ==========================================================
     DARK NAVY HEADER
  ========================================================== */
  headerNavy: {
    backgroundColor: '#061A3A',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  brandMedi: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  brandUnify: {
    color: '#00B894',
    fontWeight: '800',
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00B894',
    borderWidth: 1,
    borderColor: '#061A3A',
  },
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 4,
  },
  headerNavCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  screenMainTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  screenSubTitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },

  /* ==========================================================
     CARD STYLES
  ========================================================== */
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071E42',
  },
  detail: {
    fontSize: 13,
    color: '#475569',
    marginTop: 3,
    lineHeight: 18,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  time: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
