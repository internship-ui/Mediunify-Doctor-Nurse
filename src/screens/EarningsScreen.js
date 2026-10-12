import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import Card from '../components/Card';
import { colors, spacing, typography, radius } from '../theme/colors';
import { stats } from '../data/mockData';

export default function EarningsScreen({ navigation }) {
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
          DARK NAVY HEADER (MATCHING APP THEME)
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
              onPress={() => navigation && navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION ROW: (←) Earnings */}
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
            <Text style={styles.screenMainTitle}>Earnings</Text>
            <Text style={styles.screenSubTitle}>Track how much you have earned</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TOTAL EARNINGS CARD IN NAVY THEME */}
        <Card style={styles.earningsCard} borderColor="#071E42">
          <View style={styles.earningsHeaderRow}>
            <View style={styles.earningsIconBadge}>
              <Ionicons name="wallet" size={24} color="#071E42" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.earningsLabel}>Total Earned</Text>
              <Text style={styles.earningsValue}>₹{stats.monthlyEarnings.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.footnoteRow}>
            <Ionicons name="checkmark-circle" size={16} color="#071E42" />
            <Text style={styles.earningsFootnote}>
              Earned from completed patient consultations
            </Text>
          </View>
        </Card>

        {/* TODAY & THIS MONTH SUMMARY */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard} borderColor="#CBD5E1">
            <View style={styles.summaryIconCircle}>
              <Ionicons name="today" size={18} color="#071E42" />
            </View>
            <Text style={styles.summaryValue}>₹{stats.todayEarnings.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Today's Earnings</Text>
          </Card>
          <Card style={styles.summaryCard} borderColor="#CBD5E1">
            <View style={styles.summaryIconCircle}>
              <Ionicons name="calendar" size={18} color="#071E42" />
            </View>
            <Text style={styles.summaryValue}>₹{stats.monthlyEarnings.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>This Month</Text>
          </Card>
        </View>

        {/* TOTAL CONSULTATIONS */}
        <Card style={styles.consultationsCard} borderColor="#CBD5E1">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.summaryIconCircle}>
                <Ionicons name="people" size={20} color="#071E42" />
              </View>
              <View>
                <Text style={styles.consultationsTitle}>Completed Consultations</Text>
                <Text style={styles.consultationsSubtitle}>Total patient visits completed</Text>
              </View>
            </View>
            <Text style={styles.consultationsCount}>{stats.totalPatients}</Text>
          </View>
        </Card>
      </ScrollView>
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#061A3A',
  },
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
  },
  headerNavCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  titleContainer: {
    alignItems: 'center',
  },
  screenMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  screenSubTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },

  /* ==========================================================
     EARNINGS CARDS IN NAVY BLUE THEME
  ========================================================== */
  earningsCard: {
    backgroundColor: '#EEF4FC',
    borderWidth: 1.5,
    borderColor: '#071E42',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  earningsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#071E42',
  },
  earningsLabel: {
    ...typography.smallBold,
    color: '#071E42',
    fontSize: 13,
  },
  earningsValue: {
    ...typography.h1,
    color: '#071E42',
    marginTop: 2,
    fontSize: 28,
    fontWeight: '800',
  },
  earningsDivider: {
    height: 1,
    backgroundColor: 'rgba(7, 30, 66, 0.15)',
    marginVertical: spacing.md,
  },
  footnoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  earningsFootnote: {
    ...typography.small,
    color: '#475569',
    fontSize: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
  },
  summaryIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    ...typography.h3,
    color: '#071E42',
    fontSize: 17,
    fontWeight: '800',
  },
  summaryLabel: {
    ...typography.small,
    color: '#64748B',
    marginTop: 2,
    fontSize: 12,
  },

  consultationsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  consultationsTitle: {
    ...typography.bodyBold,
    color: '#071E42',
    fontSize: 14,
  },
  consultationsSubtitle: {
    ...typography.tiny,
    color: '#64748B',
    marginTop: 1,
  },
  consultationsCount: {
    ...typography.h2,
    color: '#071E42',
    fontWeight: '800',
    fontSize: 22,
  },
});
