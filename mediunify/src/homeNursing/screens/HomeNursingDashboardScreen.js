import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeNursingHeader from '../components/HomeNursingHeader';
import { useHomeNursing } from '../context/HomeNursingContext';
import { colors, radius, typography } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function HomeNursingDashboardScreen({ navigation }) {
  const {
    nurseProfile,
    currentStatus,
    setCurrentStatus,
    assignments,
    upcomingServices,
    completedHistory,
    activeAssignment,
    acceptAssignment,
    setRegistrationStatus,
  } = useHomeNursing();

  const newAssignedCount = assignments.filter((a) => a.status === 'Assigned').length;
  const upcomingCount = upcomingServices.length;
  const completedCount = completedHistory.length;

  const handleAcceptPress = (assignment) => {
    acceptAssignment(assignment.id);
    Alert.alert(
      'Assignment Accepted',
      `You accepted assignment ${assignment.id} for ${assignment.patientName}. Your status has been automatically updated to "On the way".`,
      [
        {
          text: 'View Status & Map',
          onPress: () =>
            navigation.navigate('HomeNursingServiceStatus', { assignmentId: assignment.id }),
        },
        { text: 'OK' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071E42" />

      {/* TOP BRAND HEADER (MEDIUNIFY LOGO + TEXT + CALL + NOTIFICATIONS) */}
      <HomeNursingHeader navigation={navigation} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ADMIN APPROVAL STATUS BANNER (If not approved) */}
        {nurseProfile.registrationStatus !== 'Approved' && (
          <View
            style={[
              styles.approvalBanner,
              nurseProfile.registrationStatus === 'Pending'
                ? styles.approvalBannerPending
                : styles.approvalBannerRejected,
            ]}
          >
            <Ionicons
              name={
                nurseProfile.registrationStatus === 'Pending'
                  ? 'time-outline'
                  : 'alert-circle-outline'
              }
              size={20}
              color={
                nurseProfile.registrationStatus === 'Pending' ? '#D97706' : '#DC2626'
              }
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.approvalBannerTitle}>
                Registration Status: {nurseProfile.registrationStatus}
              </Text>
              <Text style={styles.approvalBannerSubtitle}>
                {nurseProfile.registrationStatus === 'Pending'
                  ? 'Your documents are being verified by Super Admin.'
                  : 'Document verification failed. Please review your profile.'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.approvalBannerBtn}
              onPress={() =>
                setRegistrationStatus(
                  nurseProfile.registrationStatus === 'Pending' ? 'Approved' : 'Pending'
                )
              }
            >
              <Text style={styles.approvalBannerBtnText}>
                {nurseProfile.registrationStatus === 'Pending' ? 'Simulate Approve' : 'Re-verify'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* NURSE PROFILE GREETING CARD (DEEP NAVY BACKGROUND) */}
        <View style={styles.greetingHeaderCard}>
          <View style={styles.greetingRow}>
            {/* Greeting & Name with nearby location badge */}
            <View style={[styles.greetingTextWrap, { marginLeft: 0 }]}>
              <Text style={styles.greetingSub}>Good morning</Text>
              <View style={styles.nameLocationRow}>
                <Text style={styles.greetingName} numberOfLines={1}>
                  {nurseProfile.fullName || 'Nurse Kavitha'}
                </Text>
                <View style={styles.nurseLocationBadge}>
                  <Ionicons name="location-sharp" size={13} color="#00B894" />
                  <Text style={styles.nurseLocationText} numberOfLines={1}>
                    {nurseProfile.cityArea || 'Bangalore, Indiranagar'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Online / Offline Quick Indicator Bar */}
          <View style={styles.dashboardStatusBanner}>
            <View style={styles.dashboardStatusLeft}>
              <View
                style={[
                  styles.dashboardStatusDot,
                  currentStatus !== 'Off duty'
                    ? styles.dashboardDotGreen
                    : styles.dashboardDotGray,
                ]}
              />
              <Text style={styles.dashboardStatusText}>
                {currentStatus !== 'Off duty'
                  ? 'Status: Online · Ready for Doorstep Care'
                  : 'Status: Offline · Requests Paused'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.dashboardToggleBtn,
                currentStatus !== 'Off duty'
                  ? styles.dashboardToggleBtnOffline
                  : styles.dashboardToggleBtnOnline,
              ]}
              onPress={() => {
                const nextStatus =
                  currentStatus !== 'Off duty' ? 'Off duty' : 'Available';
                setCurrentStatus(nextStatus);
                Alert.alert(
                  nextStatus === 'Available'
                    ? 'Status: Online 🟢'
                    : 'Status: Offline ⚪',
                  nextStatus === 'Available'
                    ? 'You are now Online and available to receive patient doorstep care assignments.'
                    : 'You are now Offline. You will not receive any new assignments until you go online.'
                );
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.dashboardToggleBtnText}>
                {currentStatus !== 'Off duty' ? 'Go Offline' : 'Go Online'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SUMMARY METRIC CARDS (2 New assigned | 3 Upcoming | 18 Completed) */}
        <View style={styles.summaryRow}>
          {/* NEW ASSIGNED (Navy card matching screenshot) */}
          <TouchableOpacity
            style={styles.navySummaryCard}
            onPress={() => navigation.navigate('HomeNursingServices')}
            activeOpacity={0.85}
          >
            <Text style={styles.navySummaryCount}>{newAssignedCount}</Text>
            <Text style={styles.navySummaryLabel}>New{'\n'}assigned</Text>
          </TouchableOpacity>

          {/* UPCOMING (White card) */}
          <TouchableOpacity
            style={styles.whiteSummaryCard}
            onPress={() => navigation.navigate('HomeNursingServices')}
            activeOpacity={0.85}
          >
            <Text style={styles.whiteSummaryCount}>{upcomingCount}</Text>
            <Text style={styles.whiteSummaryLabel}>Upcoming</Text>
          </TouchableOpacity>

          {/* COMPLETED (White card) */}
          <TouchableOpacity
            style={styles.whiteSummaryCard}
            onPress={() => navigation.navigate('HomeNursingHistory')}
            activeOpacity={0.85}
          >
            <Text style={styles.whiteSummaryCount}>{completedCount}</Text>
            <Text style={styles.whiteSummaryLabel}>Completed</Text>
          </TouchableOpacity>
        </View>

        {/* CURRENT SERVICE SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Current service</Text>
        </View>

        {activeAssignment ? (
          <TouchableOpacity
            style={styles.activeServiceCard}
            onPress={() =>
              navigation.navigate('HomeNursingServiceStatus', {
                assignmentId: activeAssignment.id,
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.activeServiceStripe} />
            <View style={styles.activeServiceBody}>
              <View style={styles.activeServiceTop}>
                <View style={styles.activePatientAvatar}>
                  <Text style={styles.activeAvatarText}>
                    {activeAssignment.patientName.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.activePatientName}>
                    {activeAssignment.patientName}
                  </Text>
                  <Text style={styles.activeServiceType}>
                    {activeAssignment.service} · {activeAssignment.timeLabel}
                  </Text>
                </View>
                <View style={styles.activeStatusPill}>
                  <Text style={styles.activeStatusPillText}>
                    {activeAssignment.status}
                  </Text>
                </View>
              </View>

              <View style={styles.activeServiceMetaRow}>
                <Ionicons name="location-outline" size={15} color="#00B894" />
                <Text style={styles.activeServiceLocation} numberOfLines={1}>
                  {activeAssignment.location} ({activeAssignment.remainingDistance || activeAssignment.distance})
                </Text>
              </View>

              <View style={styles.trackActionRow}>
                <Text style={styles.trackActionText}>Track & Update Care Status</Text>
                <Ionicons name="arrow-forward" size={16} color="#00B894" />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.noServiceCard}>
            <View style={styles.noServiceStripe} />
            <View style={styles.noServiceContent}>
              <View style={styles.noServiceIconWrap}>
                <Ionicons name="medical-outline" size={20} color="#00B894" />
              </View>
              <View style={styles.noServiceInfo}>
                <Text style={styles.noServiceTitle}>No active service</Text>
                <Text style={styles.noServiceSubtitle}>
                  You're ready for assignments
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* NEW ASSIGNED SERVICES SECTION */}
        <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
          <Text style={styles.sectionTitle}>New assigned services</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeNursingServices')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAllLink}>View all</Text>
          </TouchableOpacity>
        </View>

        {assignments.length > 0 ? (
          assignments.map((item) => (
            <View key={item.id} style={styles.assignedCard}>
              <View style={styles.assignedCardHeader}>
                <Text style={styles.serviceName}>{item.service}</Text>
                <View style={styles.assignedBadge}>
                  <Text style={styles.assignedBadgeText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.assignedMetaRow}>
                <Ionicons name="time-outline" size={15} color="#64748B" />
                <Text style={styles.assignedMetaText}>
                  {item.timeLabel} · {item.location} · {item.distance}
                </Text>
              </View>

              {/* ACTION BUTTONS (View & Accept) */}
              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() =>
                    navigation.navigate('HomeNursingAssignmentDetail', {
                      assignmentId: item.id,
                    })
                  }
                  activeOpacity={0.75}
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAcceptPress(item)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No pending assignments right now.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071E42',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 36,
  },

  /* Approval Banner */
  approvalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  approvalBannerPending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  approvalBannerRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  approvalBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  approvalBannerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  approvalBannerBtn: {
    backgroundColor: '#071E42',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  approvalBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Greeting Header Card */
  greetingHeaderCard: {
    backgroundColor: '#071E42',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  greetingTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  greetingSub: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  nameLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 3,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  nurseLocationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 184, 148, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.35)',
    gap: 4,
  },
  nurseLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7FE3D4',
  },
  dashboardStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dashboardStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dashboardStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dashboardDotGreen: {
    backgroundColor: '#00B894',
  },
  dashboardDotGray: {
    backgroundColor: '#94A3B8',
  },
  dashboardStatusText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  dashboardToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  dashboardToggleBtnOnline: {
    backgroundColor: '#00B894',
  },
  dashboardToggleBtnOffline: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  dashboardToggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetingBellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  greetingBellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#00B894',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#071E42',
  },
  greetingBellBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  /* Summary Row */
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 18,
  },
  navySummaryCard: {
    flex: 1.1,
    backgroundColor: '#071E42',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  navySummaryCount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  navySummaryLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#00B894',
    lineHeight: 16,
    marginTop: 4,
  },
  whiteSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  whiteSummaryCount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#08317C',
    letterSpacing: -0.5,
  },
  whiteSummaryLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.3,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00B894',
  },

  /* Current Service Card */
  noServiceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  noServiceStripe: {
    width: 5,
    backgroundColor: '#00B894',
  },
  noServiceContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  noServiceIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  noServiceInfo: {
    flex: 1,
  },
  noServiceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  noServiceSubtitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#08317C',
    marginTop: 2,
  },

  /* Active Service Card */
  activeServiceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#7FE3D4',
    overflow: 'hidden',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  activeServiceStripe: {
    width: 5,
    backgroundColor: '#00B894',
  },
  activeServiceBody: {
    flex: 1,
    padding: 14,
  },
  activeServiceTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activePatientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  activePatientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
  },
  activeServiceType: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 1,
  },
  activeStatusPill: {
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  activeServiceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  activeServiceLocation: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  trackActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  trackActionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#00B894',
  },

  /* Assigned Card */
  assignedCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  assignedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
  },
  assignedBadge: {
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  assignedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 14,
  },
  assignedMetaText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  viewBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#08317C',
  },
  acceptBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Empty State */
  emptyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
