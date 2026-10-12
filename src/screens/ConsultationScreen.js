import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Keyboard,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import Card from '../components/Card';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, spacing, typography, radius } from '../theme/colors';
import { patients } from '../data/mockData';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ConsultationScreen({ route, navigation }) {
  const { patientId, perception } = route.params || {};
  const patient = patients.find((p) => p.id === patientId) || patients[0];

  const [complaint, setComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState(perception || '');
  const [notes, setNotes] = useState('');
  const [needsFollowUp, setNeedsFollowUp] = useState(true);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpType, setFollowUpType] = useState('Video');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calDate, setCalDate] = useState(new Date());

  // Scroll, layout position, and keyboard state for preventing overlap
  const scrollViewRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [notesCardY, setNotesCardY] = useState(0);
  const [treatmentPlanY, setTreatmentPlanY] = useState(0);

  const scrollToTreatmentPlan = () => {
    // Scroll directly to the treatment plan field so it sits comfortably in view below the header
    const targetY = notesCardY > 0 && treatmentPlanY > 0 ? notesCardY + treatmentPlanY - 40 : 450;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, targetY),
        animated: true,
      });
    }, 100);
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setIsKeyboardOpen(true);
      setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : 280);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardOpen(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSaveFollowUp = () => {
    if (!followUpDate) {
      Alert.alert('Select Date', 'Please select a follow-up date before saving.', [
        { text: 'Open Calendar', onPress: () => setCalendarVisible(true) },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }
    Alert.alert(
      'Follow-Up Saved',
      `Follow-up scheduled on ${followUpDate} (${followUpType} consultation) for ${patient.name}.`
    );
  };

  const handleComplete = () => {
    Alert.alert('Consultation Saved', 'The consultation notes have been recorded for ' + patient.name + '.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handlePrevMonth = () => {
    setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (day) => {
    if (!day) return;
    const formatted = `${day} ${MONTH_NAMES_SHORT[calDate.getMonth()]} ${calDate.getFullYear()}`;
    setFollowUpDate(formatted);
    setCalendarVisible(false);
  };

  const handleQuickSelect = (daysToAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const formatted = `${d.getDate()} ${MONTH_NAMES_SHORT[d.getMonth()]} ${d.getFullYear()}`;
    setFollowUpDate(formatted);
    setCalendarVisible(false);
  };

  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

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
    <View style={{ flex: 1, backgroundColor: colors.white }}>
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
              onPress={() => navigation && navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION ROW: (←) Consultation */}
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
            <Text style={styles.screenMainTitle}>Consultation</Text>
            {patient?.name && <Text style={styles.screenSubTitle}>{patient.name}</Text>}
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: isKeyboardOpen ? (keyboardHeight > 0 ? keyboardHeight + 80 : 340) : 120,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. FOLLOW-UP SECTION (FIRST SECTION) */}
          <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Follow-Up</Text>
          <Card borderColor="#071E42">
            <View style={styles.followUpToggleRow}>
              <Text style={styles.fieldLabel}>Schedule a follow-up for this patient</Text>
              <Switch
                value={needsFollowUp}
                onValueChange={setNeedsFollowUp}
                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                thumbColor={needsFollowUp ? '#071E42' : '#fff'}
              />
            </View>
            {needsFollowUp ? (
              <View style={{ marginTop: spacing.md }}>
                <TouchableOpacity
                  style={styles.datePickerInput}
                  onPress={() => setCalendarVisible(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={followUpDate ? '#071E42' : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.datePickerInputText,
                      !followUpDate && { color: colors.textMuted },
                    ]}
                  >
                    {followUpDate || 'Select follow-up date (tap for calendar)'}
                  </Text>
                  {followUpDate ? (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setFollowUpDate('');
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
                  )}
                </TouchableOpacity>

                <View style={styles.followUpTypeRow}>
                  {['Video', 'In-Person'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.followUpTypeChip, followUpType === t && styles.followUpTypeChipActive]}
                      onPress={() => setFollowUpType(t)}
                    >
                      <Text style={[styles.followUpTypeText, followUpType === t && { color: colors.white }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* SAVE BUTTON BELOW VIDEO AND IN-PERSON */}
                <TouchableOpacity
                  style={styles.saveFollowUpBtn}
                  onPress={handleSaveFollowUp}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.white} />
                    <Text style={styles.saveFollowUpBtnText}>Save Follow-Up</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            ) : null}
          </Card>

          {/* 2. PATIENT DETAILS */}
          <Text style={styles.sectionTitle}>Patient Details</Text>
          <Card style={styles.patientCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{patient.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{patient.name}</Text>
                <Text style={styles.meta}>{patient.age} yrs {patient.gender} · {patient.bloodGroup}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.groupLabel}>Known Allergies</Text>
            <Text style={styles.groupValue}>{patient.allergies.join(', ')}</Text>
            <Text style={[styles.groupLabel, { marginTop: 10 }]}>Current Medications</Text>
            <Text style={styles.groupValue}>{patient.medications.length ? patient.medications.join(', ') : 'None recorded'}</Text>
          </Card>

          {/* 3. CONSULTATION NOTES */}
          <Text style={styles.sectionTitle}>Consultation Notes</Text>
          <Card onLayout={(e) => setNotesCardY(e.nativeEvent.layout.y)}>
            <Text style={styles.fieldLabel}>Chief Complaint</Text>
            <AppInput
              placeholder="What is the patient presenting with?"
              multiline
              value={complaint}
              onChangeText={setComplaint}
              style={{ marginBottom: spacing.md }}
              borderColor="#071E42"
            />

            <Text style={styles.fieldLabel}>Symptoms</Text>
            <AppInput
              placeholder="Describe symptoms observed / reported"
              multiline
              value={symptoms}
              onChangeText={setSymptoms}
              style={{ marginBottom: spacing.md }}
              borderColor="#071E42"
            />

            <Text style={styles.fieldLabel}>Diagnosis / Clinical Perception</Text>
            <AppInput
              placeholder="Clinical diagnosis"
              multiline
              value={diagnosis}
              onChangeText={setDiagnosis}
              style={{ marginBottom: spacing.md }}
              borderColor="#071E42"
            />

            <View onLayout={(e) => setTreatmentPlanY(e.nativeEvent.layout.y)}>
              <Text style={styles.fieldLabel}>Treatment Plan</Text>
              <AppInput
                placeholder="Add treatment plan and clinical notes"
                multiline
                value={notes}
                onChangeText={setNotes}
                onFocus={scrollToTreatmentPlan}
                onTouchStart={scrollToTreatmentPlan}
                style={{ marginBottom: 0 }}
                borderColor="#071E42"
              />
            </View>
          </Card>

          <View style={styles.linkGrid}>
            <LinkAction
              icon="document-text-outline"
              label="Add Prescription"
              onPress={() => navigation.navigate('Prescription', { patientId: patient.id })}
            />
            <LinkAction
              icon="flask-outline"
              label="Test Requirement"
              onPress={() => navigation.navigate('TestRequirement', { patientId: patient.id })}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: spacing.xl }}>
            <AppButton title="Save Draft" variant="outline" onPress={() => Alert.alert('Saved', 'Draft saved.')} style={{ flex: 1, borderColor: '#071E42' }} textColor="#071E42" />
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={handleComplete}
              activeOpacity={0.85}
            >
              <Text style={styles.completeBtnText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* CALENDAR POPUP MODAL */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCalendarVisible(false)}
        >
          <TouchableOpacity
            style={styles.calendarCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.calendarHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={styles.calendarTitle}>Select Follow-Up Date</Text>
              </View>
              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Quick Chips */}
            <View style={styles.quickChipsRow}>
              {[
                { label: '+3 Days', days: 3 },
                { label: '+1 Week', days: 7 },
                { label: '+2 Weeks', days: 14 },
                { label: '+1 Month', days: 30 },
              ].map((chip) => (
                <TouchableOpacity
                  key={chip.label}
                  style={styles.quickChip}
                  onPress={() => handleQuickSelect(chip.days)}
                >
                  <Text style={styles.quickChipText}>{chip.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Month / Year Navigation */}
            <View style={styles.monthNavRow}>
              <TouchableOpacity
                style={styles.monthNavBtn}
                onPress={handlePrevMonth}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="chevron-back" size={20} color={colors.primary} />
              </TouchableOpacity>

              <Text style={styles.monthNavTitle}>
                {MONTH_NAMES[calMonth]} {calYear}
              </Text>

              <TouchableOpacity
                style={styles.monthNavBtn}
                onPress={handleNextMonth}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Week Days Label */}
            <View style={styles.weekDaysRow}>
              {WEEK_DAYS.map((wd) => (
                <Text key={wd} style={styles.weekDayText}>
                  {wd}
                </Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {calendarDays.map((d, index) => {
                if (!d) {
                  return <View key={`empty-${index}`} style={styles.dayCell} />;
                }

                const today = new Date();
                const isToday =
                  today.getDate() === d &&
                  today.getMonth() === calMonth &&
                  today.getFullYear() === calYear;

                const formatted = `${d} ${MONTH_NAMES_SHORT[calMonth]} ${calYear}`;
                const isSelected = followUpDate === formatted;

                return (
                  <TouchableOpacity
                    key={`day-${d}`}
                    style={[
                      styles.dayCell,
                      isToday && styles.dayCellToday,
                      isSelected && styles.dayCellSelected,
                    ]}
                    onPress={() => handleSelectDay(d)}
                  >
                    <Text
                      style={[
                        styles.dayCellText,
                        isToday && styles.dayCellTextToday,
                        isSelected && styles.dayCellTextSelected,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer */}
            <View style={styles.calendarFooter}>
              <TouchableOpacity
                style={styles.footerBtn}
                onPress={() => {
                  const today = new Date();
                  const formatted = `${today.getDate()} ${MONTH_NAMES_SHORT[today.getMonth()]} ${today.getFullYear()}`;
                  setFollowUpDate(formatted);
                  setCalendarVisible(false);
                }}
              >
                <Text style={styles.footerBtnText}>Set to Today</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerBtn, { backgroundColor: colors.primary }]}
                onPress={() => setCalendarVisible(false)}
              >
                <Text style={[styles.footerBtnText, { color: '#FFFFFF' }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function LinkAction({ icon, label, onPress }) {
  return (
    <View style={styles.linkItemWrap}>
      <TouchableOpacity
        style={styles.directLinkBtn}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.directLinkLeft}>
          <Ionicons name={icon} size={18} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.directLinkText} numberOfLines={1}>{label}</Text>
        </View>
        <Ionicons name="arrow-forward" size={15} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ==========================================================
     DARK NAVY HEADER (MATCHING APPOINTMENTS & USER THEME)
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

  patientCard: {},
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EEF2F6',
    borderWidth: 2,
    borderColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h3,
    color: '#071E42',
    fontWeight: '700',
  },
  name: { ...typography.bodyBold, color: colors.textPrimary },
  meta: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },

  groupLabel: { ...typography.smallBold, color: colors.textSecondary },
  groupValue: { ...typography.small, color: colors.textPrimary, marginTop: 2 },

  sectionTitle: { ...typography.h3, fontSize: 15, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm },
  fieldLabel: { ...typography.smallBold, color: colors.textSecondary, marginBottom: 6 },

  followUpToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  followUpTypeRow: { flexDirection: 'row', gap: 10, marginTop: spacing.md },
  followUpTypeChip: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: radius.md, borderWidth: 1.5, borderColor: '#071E42' },
  followUpTypeChipActive: { backgroundColor: '#071E42' },
  followUpTypeText: { ...typography.smallBold, color: '#071E42' },

  datePickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#071E42',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  datePickerInputText: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  calendarCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#071E42',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  monthNavBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  monthNavTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 15,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  weekDayText: {
    width: 38,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    borderRadius: 19,
  },
  dayCellSelected: {
    backgroundColor: '#071E42',
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: '#071E42',
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dayCellTextToday: {
    color: '#071E42',
    fontWeight: '800',
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },

  linkGrid: { flexDirection: 'row', gap: 12, marginTop: spacing.lg },
  linkItemWrap: { flex: 1 },

  saveFollowUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    backgroundColor: '#071E42',
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: spacing.md,
    borderWidth: 1.5,
    borderColor: '#071E42',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  saveFollowUpBtnText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 14,
  },

  directLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF4FC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  directLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 4,
  },
  directLinkText: {
    ...typography.smallBold,
    color: '#071E42',
    fontSize: 12.5,
  },
  completeBtn: {
    flex: 1,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
