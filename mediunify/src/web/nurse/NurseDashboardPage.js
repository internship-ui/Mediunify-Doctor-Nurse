import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NurseDashboardPage({ setActiveTab }) {
  const [assignmentAccepted, setAssignmentAccepted] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Available');

  const statuses = ['Available', 'Assigned', 'On the way', 'In progress', 'Off duty'];
  const weekDays = [
    { label: 'Mon', active: true },
    { label: 'Tue', active: true },
    { label: 'Wed', active: true },
    { label: 'Thu', active: true },
    { label: 'Fri', active: true },
    { label: 'Sat', active: true },
    { label: 'Sun', active: false },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 4 Stat Metric Cards (Row 1) */}
      <View style={styles.statsRow}>
        {/* Card 1: Today Progress */}
        <View style={styles.statCard}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>3/5</Text>
          </View>
          <View style={styles.statMeta}>
            <Text style={styles.statTitle}>Today</Text>
            <Text style={styles.statSub}>3 done, 2 to go</Text>
          </View>
        </View>

        {/* Card 2: Deep Navy Card (2 New assigned) */}
        <View style={[styles.statCard, styles.navyCard]}>
          <Text style={styles.navyCardNumber}>2</Text>
          <Text style={styles.navyCardLabel}>New assigned</Text>
        </View>

        {/* Card 3: Upcoming */}
        <View style={styles.statCard}>
          <Text style={styles.statBigNumber}>3</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>

        {/* Card 4: Rating */}
        <View style={styles.statCard}>
          <Text style={styles.statBigNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating • 142 services</Text>
        </View>
      </View>

      {/* Middle Row (Row 2): New Assignment + Availability */}
      <View style={styles.middleRow}>
        {/* Left: New Assignment Card */}
        <View style={styles.assignmentCard}>
          <View style={styles.assignmentHeader}>
            <View style={styles.newAssignmentBadge}>
              <Text style={styles.newAssignmentBadgeText}>NEW ASSIGNMENT</Text>
            </View>
            <View style={styles.timerRow}>
              <Ionicons name="hourglass-outline" size={13} color="#DC2626" />
              <Text style={styles.timerText}>Respond in 09:42</Text>
            </View>
          </View>

          {/* Service Details Main */}
          <View style={styles.serviceDetailsRow}>
            <View style={styles.serviceIconNavy}>
              <Ionicons name="briefcase" size={20} color="#FFFFFF" />
            </View>

            <View style={styles.serviceInfo}>
              <View style={styles.serviceTitleRow}>
                <Text style={styles.serviceTitle}>Wound dressing</Text>
                <Text style={styles.serviceScheduleTime}>4:00 PM</Text>
              </View>

              <View style={styles.serviceSubRow}>
                <Text style={styles.patientInfo}>Priya Sharma • 28 yrs • Female</Text>
                <Text style={styles.serviceScheduleDay}>Today</Text>
              </View>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#64748B" />
                <Text style={styles.locationText}>12th Main, Indiranagar • 3.2 km</Text>
              </View>
            </View>
          </View>

          {/* Instructions Box (Light Teal) */}
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsText}>
              <Text style={styles.boldText}>Instructions:</Text> Dressing change on left forearm. Carry sterile kit.
            </Text>
          </View>

          {/* Actions Row */}
          <View style={styles.assignmentActionsRow}>
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() => setActiveTab('services')}
              activeOpacity={0.7}
            >
              <Text style={styles.detailBtnText}>View details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => alert('Map route preview: 3.2 km via 100ft Rd, Indiranagar')}
              activeOpacity={0.7}
            >
              <Ionicons name="map-outline" size={14} color="#0A2342" />
              <Text style={styles.mapBtnText}>Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.acceptBtn, assignmentAccepted && styles.acceptedBtn]}
              onPress={() => {
                setAssignmentAccepted(true);
                if (setActiveTab) setActiveTab('services');
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark" size={15} color="#FFFFFF" />
              <Text style={styles.acceptBtnText}>
                {assignmentAccepted ? 'Accepted' : 'Accept assignment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Row (Row 3): Timeline + Notifications */}
      <View style={styles.bottomRow}>
        {/* Left: Today's Timeline */}
        <View style={styles.timelineCard}>
          <View style={styles.cardHeaderBetween}>
            <Text style={styles.cardTitle}>Today's timeline</Text>
            <TouchableOpacity onPress={() => setActiveTab('schedule')} activeOpacity={0.7}>
              <Text style={styles.editLink}>Full schedule</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timelineList}>
            {/* Timeline item 1 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.timelineTime}>9:30 AM</Text>
              </View>
              <Text style={styles.timelineContent}>Injection • Sneha I.</Text>
              <View style={[styles.tagPill, { backgroundColor: '#DCFCE7' }]}>
                <Text style={[styles.tagPillText, { color: '#16A34A' }]}>Done</Text>
              </View>
            </View>

            {/* Timeline item 2 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.statusDot, { backgroundColor: '#0A2342' }]} />
                <Text style={styles.timelineTime}>4:00 PM</Text>
              </View>
              <Text style={styles.timelineContent}>Wound dressing • Priya S.</Text>
              <View style={[styles.tagPill, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.tagPillText, { color: '#0369A1' }]}>Next</Text>
              </View>
            </View>

            {/* Timeline item 3 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.statusDot, { backgroundColor: '#94A3B8' }]} />
                <Text style={styles.timelineTime}>5:30 PM</Text>
              </View>
              <Text style={styles.timelineContent}>Vitals check • Anil M.</Text>
              <View style={[styles.tagPill, { backgroundColor: '#F1F5F9' }]}>
                <Text style={[styles.tagPillText, { color: '#64748B' }]}>Upcoming</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right: Notifications */}
        <View style={styles.notificationsCard}>
          <View style={styles.cardHeaderBetween}>
            <Text style={styles.cardTitle}>Notifications</Text>
          </View>

          <View style={styles.notifList}>
            {/* Notification 1 */}
            <View style={styles.notifItem}>
              <View style={styles.notifIconCircle}>
                <Ionicons name="medkit-outline" size={15} color="#0A2342" />
              </View>
              <View style={styles.notifInfo}>
                <Text style={styles.notifTitle}>New assignment</Text>
                <Text style={styles.notifSub}>Wound dressing • 4:00 PM</Text>
              </View>
              <Text style={styles.notifTime}>10m</Text>
            </View>

            {/* Notification 2 */}
            <View style={styles.notifItem}>
              <View style={[styles.notifIconCircle, { backgroundColor: '#E8F8F5' }]}>
                <Ionicons name="sync-outline" size={15} color="#00B894" />
              </View>
              <View style={styles.notifInfo}>
                <Text style={styles.notifTitle}>Assignment update</Text>
                <Text style={styles.notifSub}>Visit moved to 5:00 PM</Text>
              </View>
              <Text style={styles.notifTime}>1h</Text>
            </View>

            {/* Notification 3 */}
            <View style={styles.notifItem}>
              <View style={[styles.notifIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="megaphone-outline" size={15} color="#D97706" />
              </View>
              <View style={styles.notifInfo}>
                <Text style={styles.notifTitle}>From admin</Text>
                <Text style={styles.notifSub}>Update documents by 15 Oct</Text>
              </View>
              <Text style={styles.notifTime}>1d</Text>
            </View>
          </View>
        </View>
      </View>

      {/* CARD BOX: GO FOR MEDIUNIFY */}
      <View style={styles.mediunifyHubCard}>
        <View style={styles.mediunifyHubLeft}>
          <View style={styles.mediunifyHubLogoBadge}>
            <Ionicons name="pulse" size={24} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Text style={styles.mediunifyHubTitle}>Go for MediUnify</Text>
              <View style={styles.mediunifyHubBadgePill}>
                <Text style={styles.mediunifyHubBadgeText}>Care Network</Text>
              </View>
            </View>
            <Text style={styles.mediunifyHubSubtitle}>
              Connect seamlessly with patient home visits, real-time dispatch routes, and centralized clinical workflows on MediUnify.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.mediunifyHubCtaBtn}
          onPress={() => {
            if (setActiveTab) setActiveTab('services');
          }}
          activeOpacity={0.88}
        >
          <Text style={styles.mediunifyHubCtaText}>Go for MediUnify</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* NURSE DASHBOARD FOOTER (Navy Blue Background) */}
      <View style={styles.dashboardFooter}>
        <View style={styles.footerTopRow}>
          {/* Brand Col */}
          <View style={styles.footerBrandCol}>
            <View style={styles.footerLogoRow}>
              <View style={styles.footerLogoBadge}>
                <Ionicons name="pulse" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.footerBrandText}>
                Medi<Text style={{ color: '#00B894' }}>Unify</Text>
              </Text>
              <View style={styles.footerVersionPill}>
                <Text style={styles.footerVersionText}>Nurse Portal v2.4.0</Text>
              </View>
            </View>
            <Text style={styles.footerBrandTagline}>
              Empowering professional home healthcare nurses with real-time doorstep dispatch, automated clinical vitals logging, and secure EHR sync.
            </Text>
            <View style={styles.footerCertRow}>
              <View style={styles.footerCertItem}>
                <Ionicons name="shield-checkmark" size={13} color="#00B894" />
                <Text style={styles.footerCertText}>HIPAA Compliant</Text>
              </View>
              <View style={styles.footerCertItem}>
                <Ionicons name="lock-closed" size={13} color="#00B894" />
                <Text style={styles.footerCertText}>256-Bit Encrypted</Text>
              </View>
              <View style={styles.footerCertItem}>
                <Ionicons name="medical" size={13} color="#00B894" />
                <Text style={styles.footerCertText}>INC / KNC Standards</Text>
              </View>
            </View>
          </View>

          {/* Quick Links Col */}
          <View style={styles.footerLinksCol}>
            <Text style={styles.footerLinksHeading}>Quick Clinical Links</Text>
            <View style={styles.footerLinksGrid}>
              <TouchableOpacity onPress={() => setActiveTab && setActiveTab('services')}>
                <Text style={styles.footerLinkText}>Active Care Services</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab && setActiveTab('schedule')}>
                <Text style={styles.footerLinkText}>Doorstep Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab && setActiveTab('history')}>
                <Text style={styles.footerLinkText}>Service History & Dossier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab && setActiveTab('profile')}>
                <Text style={styles.footerLinkText}>Nurse Profile & Documents</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer Bottom Line */}
        <View style={styles.footerBottomRow}>
          <Text style={styles.footerCopyText}>
            © 2026 MediUnify Health Systems Inc. All rights reserved. Registered with National Health Authority.
          </Text>
          <View style={styles.footerBottomLinks}>
            <Text style={styles.footerBottomLinkText}>Privacy Policy</Text>
            <Text style={styles.footerDotSeparator}>•</Text>
            <Text style={styles.footerBottomLinkText}>Clinical Terms</Text>
            <Text style={styles.footerDotSeparator}>•</Text>
            <Text style={styles.footerBottomLinkText}>24/7 Nurse Triage Support</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    padding: 24,
    gap: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  progressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A2342',
  },
  statMeta: {
    gap: 2,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A2342',
  },
  statSub: {
    fontSize: 11,
    color: '#64748B',
  },
  navyCard: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 4,
  },
  navyCardNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  navyCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  statBigNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A2342',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  middleRow: {
    width: '100%',
  },
  assignmentCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#00B894',
    padding: 20,
    gap: 16,
    boxShadow: '0 4px 20px rgba(0, 184, 148, 0.08)',
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newAssignmentBadge: {
    backgroundColor: '#00B894',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  newAssignmentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  serviceDetailsRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  serviceIconNavy: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
    gap: 4,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0A2342',
  },
  serviceScheduleTime: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A2342',
  },
  serviceSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfo: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  serviceScheduleDay: {
    fontSize: 11,
    color: '#64748B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
  },
  instructionsBox: {
    backgroundColor: '#E8F8F5',
    padding: 12,
    borderRadius: 10,
  },
  instructionsText: {
    fontSize: 12,
    color: '#0A2342',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
  assignmentActionsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  detailBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mapBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  acceptBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#081E3E',
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptedBtn: {
    backgroundColor: '#00B894',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  availabilityCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 16,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A2342',
  },
  editLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B894',
  },
  statusPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  statusChipActive: {
    backgroundColor: '#00B894',
  },
  statusChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  statusChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayActive: {
    backgroundColor: '#081E3E',
  },
  dayInactive: {
    backgroundColor: '#F1F5F9',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  dayTextInactive: {
    color: '#94A3B8',
  },
  leaveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
  },
  leaveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  requestedBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  requestedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 16,
  },
  timelineList: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  timelineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  timelineContent: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  notificationsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 16,
  },
  notifList: {
    gap: 12,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  notifIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifInfo: {
    flex: 1,
    gap: 2,
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  notifSub: {
    fontSize: 11,
    color: '#64748B',
  },
  notifTime: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Go for MediUnify Card
  mediunifyHubCard: {
    width: '100%',
    backgroundColor: '#081E3E',
    borderRadius: 18,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 184, 148, 0.35)',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  mediunifyHubLeft: {
    flex: 1,
    minWidth: 280,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mediunifyHubLogoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediunifyHubTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  mediunifyHubBadgePill: {
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00B894',
  },
  mediunifyHubBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  mediunifyHubSubtitle: {
    fontSize: 12.5,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  mediunifyHubCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00B894',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  mediunifyHubCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Nurse Dashboard Footer (Navy Blue Background)
  dashboardFooter: {
    marginTop: 20,
    backgroundColor: '#081E3E',
    borderRadius: 18,
    padding: 24,
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerBrandCol: {
    flex: 1.4,
    minWidth: 280,
    gap: 10,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLogoBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  footerVersionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  footerVersionText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  footerBrandTagline: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    maxWidth: 500,
  },
  footerCertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  footerCertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerCertText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  footerLinksCol: {
    flex: 1,
    minWidth: 200,
    gap: 10,
  },
  footerLinksHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerLinksGrid: {
    gap: 8,
  },
  footerLinkText: {
    fontSize: 12.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  footerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerCopyText: {
    fontSize: 11,
    color: '#64748B',
  },
  footerBottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerBottomLinkText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  footerDotSeparator: {
    fontSize: 11,
    color: '#475569',
  },
});
