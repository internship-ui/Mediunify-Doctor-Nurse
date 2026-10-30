import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { colors, spacing, typography, radius } from '../theme/colors';
import { followUps as initialFollowUps, patients } from '../data/mockData';

export default function FollowUpsScreen({ navigation }) {
  const [list, setList] = useState(initialFollowUps);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'today' | 'upcoming' | 'overdue'
  const [followUpModalItem, setFollowUpModalItem] = useState(null);
  const [upcomingConfirmed, setUpcomingConfirmed] = useState(false);

  // Dynamic counts matching the user's header summary cards
  const counts = useMemo(() => {
    return {
      all: list.length,
      overdue: list.filter((f) => f.status === 'overdue').length,
      today: list.filter((f) => f.status === 'today').length,
      upcoming: list.filter((f) => f.status === 'upcoming').length,
    };
  }, [list]);

  // Filter list by selected filter & search query
  const filteredData = useMemo(() => {
    return list.filter((item) => {
      // Filter status
      if (selectedFilter !== 'all' && item.status !== selectedFilter) {
        return false;
      }

      // Search text filter (name, id, note, type, date)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPatient = (item.patient || '').toLowerCase().includes(q);
        const matchesId = (item.patientId || item.id || '').toLowerCase().includes(q);
        const matchesNote = (item.note || '').toLowerCase().includes(q);
        const matchesType = (item.type || '').toLowerCase().includes(q);
        const matchesDate = (item.dueDate || '').toLowerCase().includes(q);
        return matchesPatient || matchesId || matchesNote || matchesType || matchesDate;
      }

      return true;
    });
  }, [list, selectedFilter, searchQuery]);

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



  const handleMarkComplete = (id, patientName) => {
    Alert.alert(
      'Follow-Up Status',
      `Mark follow-up for ${patientName} as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Done',
          onPress: () => {
            setList((prev) => prev.filter((f) => f.id !== id));
            Alert.alert('Updated', `Follow-up for ${patientName} marked as completed.`);
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* ======================================================
          DARK NAVY HEADER (MATCHING USER'S IMAGE)
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

        {/* NAVIGATION ROW AS SHOWN IN IMAGE: (←) Patient follow-ups (Y) */}
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

          <Text style={styles.screenMainTitle}>Patient follow-ups</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* 3 SUMMARY CARDS IN HEADER: [Today] [Upcoming / This week] [Overdue] */}
        <View style={styles.headerStatsRow}>
          {/* DUE TODAY CARD */}
          <TouchableOpacity
            style={[
              styles.headerStatCard,
              selectedFilter === 'today' && styles.headerStatCardActive,
            ]}
            onPress={() => setSelectedFilter(selectedFilter === 'today' ? 'all' : 'today')}
            activeOpacity={0.8}
          >
            <Text style={styles.headerStatNumber}>{counts.today}</Text>
            <Text style={styles.headerStatLabelToday}>Due today</Text>
          </TouchableOpacity>

          {/* THIS WEEK / UPCOMING CARD */}
          <TouchableOpacity
            style={[
              styles.headerStatCard,
              selectedFilter === 'upcoming' && styles.headerStatCardActive,
            ]}
            onPress={() => setSelectedFilter(selectedFilter === 'upcoming' ? 'all' : 'upcoming')}
            activeOpacity={0.8}
          >
            <Text style={styles.headerStatNumber}>{counts.upcoming || 4}</Text>
            <Text style={styles.headerStatLabelWeek}>Upcoming</Text>
          </TouchableOpacity>

          {/* OVERDUE CARD */}
          <TouchableOpacity
            style={[
              styles.headerStatCard,
              selectedFilter === 'overdue' && styles.headerStatCardActive,
            ]}
            onPress={() => setSelectedFilter(selectedFilter === 'overdue' ? 'all' : 'overdue')}
            activeOpacity={0.8}
          >
            <Text style={styles.headerStatNumber}>{counts.overdue}</Text>
            <Text style={styles.headerStatLabelOverdue}>Overdue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ======================================================
          SEARCH BAR AS SHOWN IN IMAGE: 🔍 Search patient name or ID
      ======================================================= */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarBox}>
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patient name or ID"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ======================================================
          FILTER PILLS ORDER: FIRST ALL, SECOND TODAY, THIRD UPCOMING, LAST OVERDUE
      ======================================================= */}
      <View style={styles.filterPillsRow}>
        {/* 1. ALL */}
        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedFilter === 'all' && styles.filterPillActive,
          ]}
          onPress={() => setSelectedFilter('all')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'all' && styles.filterPillTextActive,
            ]}
          >
            All {counts.all}
          </Text>
        </TouchableOpacity>

        {/* 2. TODAY */}
        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedFilter === 'today' && styles.filterPillActive,
          ]}
          onPress={() => setSelectedFilter('today')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'today' && styles.filterPillTextActive,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>

        {/* 3. UPCOMING */}
        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedFilter === 'upcoming' && styles.filterPillActive,
          ]}
          onPress={() => setSelectedFilter('upcoming')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'upcoming' && styles.filterPillTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        {/* 4. OVERDUE */}
        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedFilter === 'overdue' && styles.filterPillActive,
          ]}
          onPress={() => setSelectedFilter('overdue')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'overdue' && styles.filterPillTextActive,
            ]}
          >
            Overdue
          </Text>
        </TouchableOpacity>
      </View>

      {/* ======================================================
          PATIENT FOLLOW-UP LIST
      ======================================================= */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No follow-ups found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? `No follow-ups matching "${searchQuery}".`
                : `No patients currently due under ${selectedFilter} category.`}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isOverdue = item.status === 'overdue';
          const isToday = item.status === 'today';
          const patientDetail =
            patients.find((p) => p.id === item.patientId || p.name === item.patient) || {};

          return (
            <TouchableOpacity
              onPress={() => {
                if (item.status === 'upcoming' || item.status === 'overdue') {
                  setUpcomingConfirmed(false);
                  setFollowUpModalItem(item);
                } else {
                  navigation.navigate('PatientProfile', {
                    patientId: item.patientId,
                  });
                }
              }}
              activeOpacity={0.85}
            >
              <Card
                style={[
                  styles.patientCard,
                  isOverdue && { borderLeftColor: '#EF4444' },
                  isToday && { borderLeftColor: '#00B894' },
                ]}
              >
                {/* TOP ROW: AVATAR, NAME, DUE DATE & BADGE */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.patientAvatarText}>
                      {item.patient ? item.patient.charAt(0) : 'P'}
                    </Text>
                  </View>

                  <View style={styles.patientInfoBlock}>
                    <Text style={styles.patientName}>{item.patient}</Text>
                    <Text style={styles.patientMeta}>
                      {patientDetail.age || '32'} yrs • {patientDetail.gender || 'Patient'} • ID #{item.patientId || item.id}
                    </Text>
                    <View style={styles.dueRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={13}
                        color={isOverdue ? '#EF4444' : isToday ? '#00B894' : '#64748B'}
                      />
                      <Text
                        style={[
                          styles.dueText,
                          isOverdue && { color: '#EF4444', fontWeight: '700' },
                          isToday && { color: '#00B894', fontWeight: '700' },
                        ]}
                      >
                        {item.dueDate}
                      </Text>
                    </View>
                  </View>

                  <StatusPill status={item.status || 'upcoming'} />
                </View>

                {/* CLINICAL NOTE / REASON */}
                {!!item.note && (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteLabel}>Follow-up Objective:</Text>
                    <Text style={styles.noteText} numberOfLines={2}>
                      {item.note}
                    </Text>
                  </View>
                )}

                {/* FOOTER: PRIVACY-SAFE CLINICAL RECORD STATUS */}
                <View style={styles.cardFooter}>
                  <View style={styles.recordBadge}>
                    <Ionicons
                      name="medical-outline"
                      size={13}
                      color="#071E42"
                    />
                    <Text style={styles.recordBadgeText}>Clinical Follow-up</Text>
                  </View>

                  <View style={styles.footerActions}>
                    <View style={styles.chevronCircle}>
                      <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />

      {/* ======================================================
          FOLLOW-UP POP-UP MODAL (OVERDUE: REQUEST AGAIN, UPCOMING: SEE PATIENT PROFILE)
      ======================================================= */}
      <Modal
        visible={!!followUpModalItem}
        transparent
        animationType="fade"
        onRequestClose={() => setFollowUpModalItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* NAVY HEADER */}
            <View style={styles.modalNavyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={[
                    styles.modalIconWrap,
                    followUpModalItem?.status === 'overdue'
                      ? { backgroundColor: '#FEE2E2' }
                      : { backgroundColor: '#EEF4FC' },
                  ]}
                >
                  <Ionicons
                    name={
                      followUpModalItem?.status === 'overdue'
                        ? 'alert-circle'
                        : 'calendar-outline'
                    }
                    size={18}
                    color={
                      followUpModalItem?.status === 'overdue'
                        ? '#DC2626'
                        : '#071E42'
                    }
                  />
                </View>
                <View>
                  <Text style={styles.modalTitle}>
                    {followUpModalItem?.status === 'overdue'
                      ? 'Overdue Follow-up'
                      : 'Upcoming Visit'}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {followUpModalItem?.status === 'overdue'
                      ? 'Patient Follow-up Notice'
                      : 'Scheduled Patient Visit'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setFollowUpModalItem(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* MODAL BODY */}
            {followUpModalItem && (
              <View style={styles.modalBody}>
                {/* PATIENT INFO CARD */}
                <View style={styles.modalPatientCard}>
                  <View style={styles.modalPatientAvatar}>
                    <Text style={styles.modalPatientAvatarText}>
                      {followUpModalItem.patient ? followUpModalItem.patient.charAt(0) : 'P'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.modalPatientName}>{followUpModalItem.patient}</Text>
                    <Text style={styles.modalPatientMeta}>
                      ID #{followUpModalItem.patientId || followUpModalItem.id}
                    </Text>
                    <View
                      style={[
                        styles.statusPillModal,
                        followUpModalItem.status === 'overdue'
                          ? { backgroundColor: '#FEE2E2' }
                          : { backgroundColor: '#E0F2FE' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillModalText,
                          followUpModalItem.status === 'overdue'
                            ? { color: '#DC2626' }
                            : { color: '#0369A1' },
                        ]}
                      >
                        {followUpModalItem.status === 'overdue'
                          ? '⚠️ Overdue Follow-up'
                          : '🗓️ Upcoming Visit'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* SCHEDULED VISIT DATE ROW */}
                <View style={styles.modalScheduleBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="calendar-outline" size={16} color="#071E42" />
                    <Text style={styles.modalScheduleLabel}>
                      {followUpModalItem.status === 'overdue' ? 'Due Date:' : 'Visit Date:'}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.modalScheduleVal,
                      followUpModalItem.status === 'overdue' && { color: '#DC2626' },
                    ]}
                  >
                    {followUpModalItem.dueDate}
                  </Text>
                </View>

                {/* OBJECTIVE / CLINICAL NOTE */}
                {!!followUpModalItem.note && (
                  <View style={styles.modalNoteBox}>
                    <Text style={styles.modalNoteLabel}>
                      {followUpModalItem.status === 'overdue' ? 'Follow-up Objective:' : 'Visit Purpose / Objective:'}
                    </Text>
                    <Text style={styles.modalNoteText}>{followUpModalItem.note}</Text>
                  </View>
                )}

                {/* ACTION BUTTONS BASED ON STATUS */}
                {followUpModalItem.status === 'overdue' ? (
                  /* OVERDUE -> POP-UP -> CLOSE + REQUEST AGAIN */
                  <View style={styles.modalActionsRow}>
                    <TouchableOpacity
                      style={styles.modalCloseBtn}
                      onPress={() => setFollowUpModalItem(null)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalCloseBtnText}>Close</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalRequestBtn}
                      onPress={() => {
                        const pName = followUpModalItem.patient;
                        setFollowUpModalItem(null);
                        Alert.alert(
                          'Request Sent',
                          `Follow-up consultation request has been sent to ${pName} again.`
                        );
                      }}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="refresh-outline" size={17} color="#FFFFFF" />
                      <Text style={styles.modalRequestBtnText}>Request Again</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* UPCOMING -> POP-UP -> LITTLE BIT DETAILS AND JUST BELOW THAT OK DIRECT TO FOLLOW-UP PAGE */
                  <View style={{ marginTop: 16 }}>
                    <TouchableOpacity
                      style={[
                        styles.modalProfileBtn,
                        { backgroundColor: '#00B894', width: '100%', justifyContent: 'center', height: 46 },
                      ]}
                      onPress={() => {
                        setFollowUpModalItem(null);
                        setUpcomingConfirmed(false);
                      }}
                      activeOpacity={0.88}
                    >
                      <Text style={[styles.modalProfileBtnText, { fontSize: 15, fontWeight: '800' }]}>OK</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ==========================================================
     DARK NAVY HEADER (MATCHING APPOINTMENTS & USER'S IMAGE)
  ========================================================== */
  headerNavy: {
    backgroundColor: '#061A3A',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    paddingBottom: 20,
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
    marginBottom: 16,
  },
  headerNavCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenMainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  /* 3 SUMMARY CARDS IN HEADER */
  headerStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  headerStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerStatCardActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: '#FFFFFF',
  },
  headerStatNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerStatLabelOverdue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F87171', // Soft Red matching image
  },
  headerStatLabelToday: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34D399', // Soft Green matching image
  },
  headerStatLabelWeek: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8', // Soft Slate matching image
  },

  /* ==========================================================
     SEARCH BAR BELOW HEADER
  ========================================================== */
  searchBarWrapper: {
    paddingHorizontal: spacing.lg,
    marginTop: 14,
    marginBottom: 10,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    paddingVertical: 0,
  },

  /* ==========================================================
     FILTER PILLS ROW
  ========================================================== */
  filterPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#071E42', // Deep Navy Blue active pill matching image
  },
  filterPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* ==========================================================
     PATIENT CARD
  ========================================================== */
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4.5,
    borderLeftColor: '#071E42',
    padding: 16,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  patientAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EEF2F6',
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#071E42',
  },
  patientInfoBlock: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#071E42',
  },
  patientMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  dueText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  noteBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#CBD5E1',
  },
  noteLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recordBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#071E42',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF4FC',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  completeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#071E42', // Navy blue background
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },

  /* Modal Popup Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalNavyHeader: {
    backgroundColor: '#071E42',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  modalBody: {
    padding: 18,
  },
  modalPatientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  modalPatientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPatientAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalPatientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071E42',
  },
  modalPatientMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  statusPillModal: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  statusPillModalText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalScheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF4FC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  modalScheduleLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
  },
  modalScheduleVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#071E42',
  },
  modalNoteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  modalNoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  modalNoteText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCloseBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modalRequestBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DC2626',
  },
  modalRequestBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalProfileBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#071E42',
  },
  modalProfileBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
