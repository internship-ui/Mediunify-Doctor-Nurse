import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeNursingHeader from '../components/HomeNursingHeader';
import { useHomeNursing } from '../context/HomeNursingContext';
import { radius } from '../../theme/colors';

const TIME_FILTERS = ['All', 'This week', 'This month'];

export default function HomeNursingHistoryScreen({ navigation }) {
  const { completedHistory } = useHomeNursing();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredHistory = completedHistory.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'This week') return item.dateTime.includes('Today') || item.dateTime.includes('Sep');
    if (activeFilter === 'This month') return true;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071E42" />

      {/* TOP BRAND HEADER */}
      <HomeNursingHeader
        navigation={navigation}
        showBack={true}
        title="Service history"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STATS BANNER (18 This month | 142 All time) */}
        <View style={styles.statsBanner}>
          <View style={styles.statColumn}>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>This month</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statColumn}>
            <Text style={styles.statNumber}>142</Text>
            <Text style={styles.statLabel}>All time</Text>
          </View>
        </View>

        {/* TIME FILTER PILLS */}
        <View style={styles.filterRow}>
          {TIME_FILTERS.map((f) => {
            const isSelected = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* HISTORY CARDS LIST */}
        <View style={styles.historyList}>
          {filteredHistory.map((item, index) => {
            const isFirst = index === 0;
            return (
              <View
                key={item.id}
                style={[
                  styles.historyCard,
                  isFirst && styles.historyCardFirst,
                ]}
              >
                {isFirst && <View style={styles.leftTealStripe} />}

                <View style={styles.cardMainContent}>
                  {/* PATIENT INFO HEADER */}
                  <View style={styles.patientRow}>
                    <View
                      style={[
                        styles.avatarCircle,
                        isFirst && styles.avatarCircleTeal,
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarText,
                          isFirst && styles.avatarTextTeal,
                        ]}
                      >
                        {item.initials || item.patientName.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.patientName}>{item.patientName}</Text>
                      <Text style={styles.serviceName}>{item.service}</Text>
                    </View>

                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark" size={13} color="#00B894" style={{ marginRight: 3 }} />
                      <Text style={styles.completedBadgeText}>Completed</Text>
                    </View>
                  </View>

                  {/* DATE & DURATION ROW */}
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={14} color="#64748B" />
                    <Text style={styles.metaText}>{item.dateTime}</Text>
                    {item.duration && (
                      <Text style={styles.durationText}>
                        · Duration {item.duration}
                      </Text>
                    )}
                  </View>

                  {/* FOLLOW-UP BADGE (IF REQUESTED) */}
                  {item.followupRequired && item.followupDate && (
                    <View style={styles.followupTagRow}>
                      <Ionicons name="calendar" size={13} color="#0284C7" />
                      <Text style={styles.followupTagText}>
                        Follow-up: {item.followupDate}
                      </Text>
                    </View>
                  )}

                  {/* NOTE OR VIEW RECORD LINK */}
                  {item.notes ? (
                    <View style={styles.noteBox}>
                      <Text style={styles.noteText}>
                        <Text style={styles.noteLabel}>Completion note: </Text>
                        {item.notes}
                      </Text>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={styles.viewRecordRow}
                    onPress={() => setSelectedRecord(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewRecordText}>View record</Text>
                    <Ionicons name="chevron-forward" size={14} color="#08317C" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* RECORD DETAIL MODAL */}
      <Modal
        visible={!!selectedRecord}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedRecord(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Nursing Care Record</Text>
                <Text style={styles.modalSubtitle}>
                  Verified record #{selectedRecord?.id}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedRecord(null)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedRecord && (
              <View style={styles.recordModalBody}>
                <View style={styles.recordDetailRow}>
                  <Text style={styles.recordFieldLabel}>Patient Name</Text>
                  <Text style={styles.recordFieldValue}>
                    {selectedRecord.patientName} (
                    {selectedRecord.patientAge || '32'} yrs,{' '}
                    {selectedRecord.patientGender || 'Patient'})
                  </Text>
                </View>

                <View style={styles.recordDetailRow}>
                  <Text style={styles.recordFieldLabel}>Service Provided</Text>
                  <Text style={styles.recordFieldValue}>
                    {selectedRecord.service}
                  </Text>
                </View>

                <View style={styles.recordDetailRow}>
                  <Text style={styles.recordFieldLabel}>Date & Time</Text>
                  <Text style={styles.recordFieldValue}>
                    {selectedRecord.dateTime}
                  </Text>
                </View>

                <View style={styles.recordDetailRow}>
                  <Text style={styles.recordFieldLabel}>Duration of Care</Text>
                  <Text style={styles.recordFieldValue}>
                    {selectedRecord.duration || '40 min'}
                  </Text>
                </View>

                <View style={styles.recordDetailRow}>
                  <Text style={styles.recordFieldLabel}>Location</Text>
                  <Text style={styles.recordFieldValue}>
                    {selectedRecord.location || 'Indiranagar, Bengaluru'}
                  </Text>
                </View>

                {selectedRecord.followupRequired && selectedRecord.followupDate && (
                  <View style={styles.recordDetailRow}>
                    <Text style={styles.recordFieldLabel}>Follow-up Requested</Text>
                    <Text
                      style={[
                        styles.recordFieldValue,
                        { color: '#0284C7', fontWeight: '800' },
                      ]}
                    >
                      {selectedRecord.followupDate}
                    </Text>
                  </View>
                )}

                <View style={styles.recordNoteBlock}>
                  <Text style={styles.recordNoteTitle}>Clinical Notes</Text>
                  <Text style={styles.recordNoteBody}>
                    {selectedRecord.notes ||
                      'Standard clinical nursing procedure completed without complications.'}
                  </Text>
                </View>

                <View style={styles.verificationBadgeRow}>
                  <Ionicons name="shield-checkmark" size={18} color="#00B894" />
                  <Text style={styles.verificationBadgeText}>
                    Super Admin & Doctor Verified Record
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setSelectedRecord(null)}
              activeOpacity={0.85}
            >
              <Text style={styles.closeModalBtnText}>Close Record</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },

  /* Stats Banner */
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: '#071E42',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  statColumn: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#7FE3D4',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 12,
  },

  /* Filter Row */
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  /* History Cards */
  historyList: {
    gap: 14,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  historyCardFirst: {
    borderLeftWidth: 0,
  },
  leftTealStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#00B894',
    zIndex: 5,
  },
  cardMainContent: {
    padding: 16,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircleTeal: {
    backgroundColor: '#E6FAF6',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#08317C',
  },
  avatarTextTeal: {
    color: '#00B894',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.2,
  },
  serviceName: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  durationText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  followupTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  followupTagText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  noteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noteText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  noteLabel: {
    fontWeight: '700',
    color: '#08317C',
  },
  viewRecordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 4,
  },
  viewRecordText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#08317C',
  },

  /* Record Detail Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 17, 39, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#08317C',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  recordModalBody: {
    gap: 12,
  },
  recordDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  recordFieldLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  recordFieldValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#08317C',
  },
  recordNoteBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  recordNoteTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#08317C',
    marginBottom: 4,
  },
  recordNoteBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#334155',
  },
  verificationBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E6FAF6',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  verificationBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#008F7A',
  },
  closeModalBtn: {
    backgroundColor: '#071E42',
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  closeModalBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
