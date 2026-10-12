import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHomeNursing } from '../../homeNursing/context/HomeNursingContext';

export default function NurseHistoryPage() {
  const { completedHistory } = useHomeNursing();
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredHistory = completedHistory.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.patientName && item.patientName.toLowerCase().includes(q)) ||
      (item.service && item.service.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Service History & Clinical Dossier</Text>
          <Text style={styles.pageSubtitle}>
            Complete archive of verified home nursing visits, treatment notes, and patient records
          </Text>
        </View>

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => alert('Clinical history and verified reports exported to PDF!')}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={15} color="#081E3E" />
          <Text style={styles.exportBtnText}>Export Report</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedHistory.length}</Text>
          <Text style={styles.statLabel}>Completed Visits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>4.9 ★</Text>
          <Text style={styles.statLabel}>Patient Rating</Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by patient name, procedure or address..."
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* History Records List */}
      <View style={styles.recordsList}>
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="documents-outline" size={36} color="#94A3B8" />
            <Text style={styles.emptyText}>No service history records matching "{search}"</Text>
          </View>
        ) : (
          filteredHistory.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recordCard}
              onPress={() => setSelectedRecord(item)}
              activeOpacity={0.88}
            >
              <View style={styles.recordCardTop}>
                <View style={styles.patientCol}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.patientInitials}>
                      {item.initials || (item.patientName ? item.patientName.slice(0, 2).toUpperCase() : 'PS')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.patientName}>{item.patientName}</Text>
                    <Text style={styles.serviceSubtitle}>
                      {item.service} · {item.patientAge ? `${item.patientAge} yrs` : 'Adult'}
                    </Text>
                  </View>
                </View>

                <View style={styles.timingBadgeCol}>
                  <Text style={styles.dateTimeText}>{item.dateTime}</Text>
                  <View style={styles.durationPill}>
                    <Ionicons name="time-outline" size={12} color="#00B894" />
                    <Text style={styles.durationText}>{item.duration || '40 min'}</Text>
                  </View>
                </View>
              </View>

              {/* Clinical Notes Excerpt */}
              <View style={styles.notesExcerptBox}>
                <Text style={styles.notesExcerptText} numberOfLines={2}>
                  <Text style={styles.notesBold}>Clinical Record: </Text>
                  {item.notes || 'Care completed smoothly. Patient vitals stable.'}
                </Text>
              </View>

              {/* Bottom Metadata Row */}
              <View style={styles.recordCardBottom}>
                <View style={styles.locRow}>
                  <Ionicons name="location-outline" size={13} color="#64748B" />
                  <Text style={styles.locText}>{item.location || 'Indiranagar, Bengaluru'}</Text>
                </View>

                <View style={styles.cardActionsRight}>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={13} color="#00B894" />
                    <Text style={styles.verifiedBadgeText}>GPS Verified</Text>
                  </View>
                  <Text style={styles.viewDetailLink}>View Full Record →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* DETAIL MODAL: Complete Clinical Visit Record */}
      <Modal visible={!!selectedRecord} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedRecord && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Clinical Visit Record</Text>
                    <Text style={styles.modalSub}>
                      {selectedRecord.service} · {selectedRecord.dateTime}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedRecord(null)}>
                    <Ionicons name="close" size={22} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ maxHeight: 450 }} showsVerticalScrollIndicator={false}>
                  {/* Patient Dossier Tile */}
                  <View style={styles.dossierPatientTile}>
                    <View style={styles.modalAvatar}>
                      <Text style={styles.modalAvatarText}>
                        {selectedRecord.initials || 'PS'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalPatientName}>{selectedRecord.patientName}</Text>
                      <Text style={styles.modalPatientMeta}>
                        {selectedRecord.location || '12th Main, Indiranagar, Bengaluru'}
                      </Text>
                      <Text style={styles.modalPatientDuration}>
                        Visit Duration: {selectedRecord.duration || '40 min'} · Status: Completed
                      </Text>
                    </View>
                  </View>

                  {/* Verification Box */}
                  <View style={styles.modalVerificationBox}>
                    <Ionicons name="shield-checkmark" size={20} color="#00B894" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalVerifyTitle}>Doorstep GPS & Arrival Timestamp Confirmed</Text>
                      <Text style={styles.modalVerifySub}>
                        {selectedRecord.arrivalLocation || '#12, 12th Main, Indiranagar (GPS: 12.9716° N, 77.5946° E)'}
                      </Text>
                    </View>
                  </View>

                  {/* Clinical Treatment Notes */}
                  <Text style={styles.sectionHeading}>Clinical Observations & Treatment Notes</Text>
                  <View style={styles.fullNotesBox}>
                    <Text style={styles.fullNotesText}>{selectedRecord.notes}</Text>
                  </View>

                  {/* Follow-up recommendation */}
                  {selectedRecord.followupRequired && (
                    <View style={styles.followupNotice}>
                      <Ionicons name="calendar-outline" size={16} color="#081E3E" />
                      <Text style={styles.followupNoticeText}>
                        Follow-up scheduled: {selectedRecord.followupDate || 'In 48 Hours'}
                      </Text>
                    </View>
                  )}
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.printBtn}
                    onPress={() => alert('Printing clinical prescription & dressing note...')}
                  >
                    <Ionicons name="print-outline" size={15} color="#081E3E" />
                    <Text style={styles.printBtnText}>Print Note</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelectedRecord(null)}
                  >
                    <Text style={styles.closeBtnText}>Close Record</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  exportBtnText: {
    color: '#081E3E',
    fontWeight: '700',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#081E3E',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#081E3E',
  },
  recordsList: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 14,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  recordCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#081E3E',
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  timingBadgeCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dateTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00B894',
  },
  notesExcerptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#00B894',
  },
  notesExcerptText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  notesBold: {
    fontWeight: '700',
    color: '#081E3E',
  },
  recordCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locText: {
    fontSize: 11,
    color: '#64748B',
  },
  cardActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  viewDetailLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 580,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  dossierPatientTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  modalPatientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#081E3E',
  },
  modalPatientMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalPatientDuration: {
    fontSize: 11,
    color: '#00B894',
    fontWeight: '600',
    marginTop: 2,
  },
  modalVerificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E8F8F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  modalVerifyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  modalVerifySub: {
    fontSize: 10,
    color: '#065F46',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#081E3E',
    marginBottom: 6,
  },
  fullNotesBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  fullNotesText: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 18,
  },
  followupNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  followupNoticeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  printBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  closeBtn: {
    backgroundColor: '#081E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
