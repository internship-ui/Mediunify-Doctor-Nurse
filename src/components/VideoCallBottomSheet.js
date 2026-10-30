import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';

const MEDICINES_LIST = [
  'Paracetamol 500mg',
  'Amoxicillin 500mg',
  'Pantoprazole 40mg',
  'Cetirizine 10mg',
  'Azithromycin 500mg',
  'Metformin 500mg',
  'Ibuprofen 400mg',
  'Atorvastatin 10mg',
  'Amlodipine 5mg',
  'Telmisartan 40mg',
  'Montelukast 10mg',
  'Omeprazole 20mg',
  'Dolo 650mg',
  'Augmentin 625mg',
  'Ciprofloxacin 500mg',
  'Levocetirizine 5mg',
];

const TESTS_LIST = [
  'Complete Blood Count (CBC)',
  'Fasting Blood Sugar (FBS)',
  'Postprandial Blood Sugar (PPBS)',
  'HbA1c (Glycated Hemoglobin)',
  'Lipid Profile',
  'Liver Function Test (LFT)',
  'Kidney Function Test (KFT)',
  'Thyroid Profile (T3, T4, TSH)',
  'Urine Routine & Microscopy',
  'Serum Electrolytes',
  'Chest X-Ray (PA View)',
  'ECG (12 Lead)',
  'Ultrasound Whole Abdomen',
  'Serum Creatinine & Urea',
  'Vitamin D3 & B12 Test',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function VideoCallBottomSheet({
  visible,
  onClose,
  appointment,
  patient,
  callDuration = '10:00',
  initialNotes = '',
  initialStep = 1,
  onNotesChange,
  onComplete,
}) {
  // Current active step (1 to 4)
  const [currentStep, setCurrentStep] = useState(initialStep || 1);

  // ----------------------------------------------------
  // STEP 1 STATE: CONSULT NOTES (ONE typing field)
  // ----------------------------------------------------
  const [consultNotes, setConsultNotes] = useState(
    initialNotes ||
      (appointment?.reason
        ? `Video consultation conducted for: ${appointment.reason}.\nPatient reported symptoms discussed over call. Advised hydration, prescribed medications, and lifestyle modifications.`
        : 'Video consultation conducted successfully. Patient reviewed over call. Discussed ongoing symptoms and advised adequate rest, hydration, and monitoring.')
  );

  // Keep step and consult notes in sync with props whenever opened or changed
  useEffect(() => {
    if (visible) {
      if (initialStep) {
        setCurrentStep(initialStep);
      }
      if (initialNotes && initialNotes.trim().length > 0) {
        setConsultNotes(initialNotes);
      }
    }
  }, [visible, initialStep, initialNotes]);

  const handleConsultNotesChange = (text) => {
    setConsultNotes(text);
    if (onNotesChange) {
      onNotesChange(text);
    }
  };

  // ----------------------------------------------------
  // STEP 2 STATE: PRESCRIBE (e-Prescription)
  // Search, Medicine Name, Dosage Name, Frequency, Duration, Schedule Timings Pop-up, Add to Prescription
  // ----------------------------------------------------
  const [medSearch, setMedSearch] = useState('');
  const [isMedDropdownOpen, setIsMedDropdownOpen] = useState(false);
  const [medicineName, setMedicineName] = useState('Paracetamol 500mg');
  const [dosageName, setDosageName] = useState('1 tablet');
  const [frequency, setFrequency] = useState('1 daily');
  const [medDuration, setMedDuration] = useState('5 days');

  // Daily Tablet Schedule & Food Timing Modal & State
  const [isTimingModalOpen, setIsTimingModalOpen] = useState(false);
  const [morningTiming, setMorningTiming] = useState({
    tabletOption: 'ON',
    foodTiming: 'after',
  });
  const [afternoonTiming, setAfternoonTiming] = useState({
    tabletOption: 'OFF',
    foodTiming: 'after',
  });
  const [nightTiming, setNightTiming] = useState({
    tabletOption: 'ON',
    foodTiming: 'after',
  });

  // Prescribed items list
  const [prescribedList, setPrescribedList] = useState([
    {
      id: 'm1',
      name: 'Cetirizine 10mg',
      dosage: '1 tablet',
      frequency: '1 daily',
      duration: '5 days',
      timingSummary: 'Morn: OFF · Aftern: OFF · Night: ON (After Food)',
    },
  ]);

  const filteredMedicines = useMemo(() => {
    if (!medSearch.trim()) return MEDICINES_LIST;
    return MEDICINES_LIST.filter((m) =>
      m.toLowerCase().includes(medSearch.toLowerCase().trim())
    );
  }, [medSearch]);

  const handleAddMedicine = () => {
    const name = medicineName.trim();
    if (!name) {
      Alert.alert('Medicine Required', 'Please enter or select a medicine name.');
      return;
    }

    const timingSummary = `Morn: ${
      morningTiming.tabletOption === 'ON'
        ? 'ON (' + (morningTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')'
        : 'OFF'
    } · Aftern: ${
      afternoonTiming.tabletOption === 'ON'
        ? 'ON (' + (afternoonTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')'
        : 'OFF'
    } · Night: ${
      nightTiming.tabletOption === 'ON'
        ? 'ON (' + (nightTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')'
        : 'OFF'
    }`;

    const newMed = {
      id: `med-${Date.now()}`,
      name,
      dosage: dosageName.trim() || '1 tablet',
      frequency: frequency.trim() || '1 daily',
      duration: medDuration.trim() || '5 days',
      timingSummary,
    };

    setPrescribedList((prev) => [...prev, newMed]);
    setMedicineName('');
    setMedSearch('');
    setIsMedDropdownOpen(false);
  };

  const handleRemoveMedicine = (id) => {
    setPrescribedList((prev) => prev.filter((m) => m.id !== id));
  };

  // ----------------------------------------------------
  // STEP 3 STATE: TESTS (Lab Investigations)
  // Search, Test Name, Patient Preparation / Diet Requirement, Clinical Instructions, Add to Test Required
  // ----------------------------------------------------
  const [testSearch, setTestSearch] = useState('');
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [testName, setTestName] = useState('Complete Blood Count (CBC)');
  const [patientPrep, setPatientPrep] = useState('Fasting 10 hrs');
  const [labInstructions, setLabInstructions] = useState('Routine analysis');
  const [testsList, setTestsList] = useState([
    {
      id: 't1',
      name: 'Complete Blood Count (CBC)',
      patientPrep: 'Fasting 10 hrs',
      instructions: 'Routine analysis & serum check',
    },
  ]);

  const filteredTests = useMemo(() => {
    if (!testSearch.trim()) return TESTS_LIST;
    return TESTS_LIST.filter((t) =>
      t.toLowerCase().includes(testSearch.toLowerCase().trim())
    );
  }, [testSearch]);

  const handleAddTest = () => {
    const name = testName.trim();
    if (!name) {
      Alert.alert('Test Name Required', 'Please enter or select a diagnostic test name.');
      return;
    }

    const newTest = {
      id: `test-${Date.now()}`,
      name,
      patientPrep: patientPrep.trim() || 'No special preparation',
      instructions: labInstructions.trim() || 'Routine analysis',
    };

    setTestsList((prev) => [...prev, newTest]);
    setTestName('');
    setTestSearch('');
    setIsTestDropdownOpen(false);
  };

  const handleRemoveTest = (id) => {
    setTestsList((prev) => prev.filter((t) => t.id !== id));
  };

  // ----------------------------------------------------
  // STEP 4 STATE: DATE SCHEDULE (DATE FIXING)
  // Follow-up Required (Yes / No), Mode selection, Calendar popup, Time slot, Overview
  // ----------------------------------------------------
  const [followUpRequired, setFollowUpRequired] = useState('yes'); // 'yes' | 'no'
  const [consultMode, setConsultMode] = useState('Video'); // default 'Video' for video consultation follow-up
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(9); // 0-indexed: 9 = October
  const [calDay, setCalDay] = useState(18);
  const [selectedSlot, setSelectedSlot] = useState('11:30 AM');

  const selectedDate = `${calDay < 10 ? '0' + calDay : calDay} ${MONTH_NAMES[calMonth].slice(0, 3)} ${calYear}`;

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysArray = [];
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      daysArray.push(d);
    }
    return daysArray;
  }, [calYear, calMonth]);

  const handleSelectDay = (day) => {
    if (day) {
      setCalDay(day);
      setIsCalendarOpen(false);
    }
  };

  // ----------------------------------------------------
  // CONFIRMATION POP-UP (SENT TO PATIENT MODAL)
  // ----------------------------------------------------
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmitPlan = () => {
    setIsSuccessModalOpen(true);
  };

  const handleFinalOk = () => {
    setIsSuccessModalOpen(false);
    if (onComplete) {
      onComplete({
        consultNotes,
        prescriptions: prescribedList,
        tests: testsList,
        followUpRequired,
        followUpDate: followUpRequired === 'yes' ? selectedDate : 'Not required',
        followUpTime: followUpRequired === 'yes' ? selectedSlot : null,
        followUpMode: followUpRequired === 'yes' ? consultMode : null,
      });
    } else if (onClose) {
      onClose();
    }
  };

  // Step transitions
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmitPlan();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    }
  };

  const patientName = appointment?.patient || patient?.name || 'Patient';
  const patientMeta = `${appointment?.age || patient?.age || '28'} yrs · ${appointment?.gender || patient?.gender || 'Patient'}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <TouchableOpacity
          style={styles.sheetBackdropDismiss}
          activeOpacity={1}
          onPress={onClose}
        />
        <KeyboardAvoidingView
          style={styles.sheetContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* DRAG HANDLE BAR AT TOP - TAP TO DISMISS DOWN */}
          <TouchableOpacity
            style={styles.dragHandleContainer}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <View style={styles.dragHandle} />
          </TouchableOpacity>

          {/* ======================================================
              WHITE HEADER (VIDEO CALL CONSULTATION SUMMARY)
          ======================================================= */}
          <View style={styles.sheetHeaderNavy}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerTitleWrap}>
                <View style={styles.modeBadgeRow}>
                  <View style={styles.modeBadge}>
                    <Ionicons name="videocam" size={13} color="#081E3E" />
                    <Text style={styles.modeBadgeText}>VIDEO CALL CONSULTATION</Text>
                  </View>
                  {callDuration ? (
                    <View style={styles.durationBadge}>
                      <Ionicons name="time" size={12} color="#00B894" />
                      <Text style={styles.durationBadgeText}>{callDuration} Call Ended</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.patientTitleText}>{patientName}</Text>
                <Text style={styles.patientMetaText}>
                  {patientMeta} · Step {currentStep} of 4
                </Text>
              </View>

              <TouchableOpacity
                style={styles.headerCloseBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#081E3E" />
              </TouchableOpacity>
            </View>

            {/* 4-STEP PROGRESS INDICATOR ROW */}
            <View style={styles.stepProgressRow}>
              {/* Step 1 */}
              <View style={styles.stepNode}>
                <View
                  style={[
                    styles.stepNodeCircle,
                    currentStep === 1 && styles.stepNodeCircleActive,
                    currentStep > 1 && styles.stepNodeCirclePast,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNodeNumber,
                      currentStep === 1 && styles.stepNodeNumberActive,
                      currentStep > 1 && styles.stepNodeNumberPast,
                    ]}
                  >
                    {currentStep > 1 ? '✓' : '1'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepNodeLabel,
                    currentStep === 1 && styles.stepNodeLabelActive,
                  ]}
                >
                  Consult
                </Text>
              </View>

              <View
                style={[
                  styles.stepLine,
                  currentStep > 1 && styles.stepLineActive,
                ]}
              />

              {/* Step 2 */}
              <View style={styles.stepNode}>
                <View
                  style={[
                    styles.stepNodeCircle,
                    currentStep === 2 && styles.stepNodeCircleActive,
                    currentStep > 2 && styles.stepNodeCirclePast,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNodeNumber,
                      currentStep === 2 && styles.stepNodeNumberActive,
                      currentStep > 2 && styles.stepNodeNumberPast,
                    ]}
                  >
                    {currentStep > 2 ? '✓' : '2'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepNodeLabel,
                    currentStep === 2 && styles.stepNodeLabelActive,
                  ]}
                >
                  Prescribe
                </Text>
              </View>

              <View
                style={[
                  styles.stepLine,
                  currentStep > 2 && styles.stepLineActive,
                ]}
              />

              {/* Step 3 */}
              <View style={styles.stepNode}>
                <View
                  style={[
                    styles.stepNodeCircle,
                    currentStep === 3 && styles.stepNodeCircleActive,
                    currentStep > 3 && styles.stepNodeCirclePast,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNodeNumber,
                      currentStep === 3 && styles.stepNodeNumberActive,
                      currentStep > 3 && styles.stepNodeNumberPast,
                    ]}
                  >
                    {currentStep > 3 ? '✓' : '3'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepNodeLabel,
                    currentStep === 3 && styles.stepNodeLabelActive,
                  ]}
                >
                  Tests
                </Text>
              </View>

              <View
                style={[
                  styles.stepLine,
                  currentStep > 3 && styles.stepLineActive,
                ]}
              />

              {/* Step 4 */}
              <View style={styles.stepNode}>
                <View
                  style={[
                    styles.stepNodeCircle,
                    currentStep === 4 && styles.stepNodeCircleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNodeNumber,
                      currentStep === 4 && styles.stepNodeNumberActive,
                    ]}
                  >
                    4
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepNodeLabel,
                    currentStep === 4 && styles.stepNodeLabelActive,
                  ]}
                >
                  Schedule
                </Text>
              </View>
            </View>
          </View>

          {/* ======================================================
              STEP SCROLLABLE CONTENT BODY
          ======================================================= */}
          <ScrollView
            style={styles.sheetBodyScroll}
            contentContainerStyle={styles.sheetBodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* --------------------------------------------------
                STEP 1: CONSULT NOTES (WITH ONE TYPING FIELD)
            --------------------------------------------------- */}
            {currentStep === 1 && (
              <View style={styles.stepContainer}>
                <View style={styles.stepTitleRow}>
                  <View style={styles.stepIconBubble}>
                    <Ionicons name="document-text" size={18} color="#00B894" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepHeading}>Consultation Notes</Text>
                    <Text style={styles.stepSubheading}>
                      Type clinical notes, observations, diagnosis, and doctor advice
                    </Text>
                  </View>
                </View>

                {/* SINGLE MULTILINE TYPING FIELD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Doctor Consult Notes & Advice</Text>
                  <TextInput
                    style={styles.singleConsultNotesBox}
                    placeholder="Type patient's video consultation notes, clinical observations, diagnosis, doctor advice, and home instructions here..."
                    placeholderTextColor="#94A3B8"
                    value={consultNotes}
                    onChangeText={handleConsultNotesChange}
                    multiline
                    textAlignVertical="top"
                  />
                  <Text style={styles.fieldHint}>
                    This note will be recorded in patient's permanent consultation history.
                  </Text>
                </View>

                {/* QUICK CONSULTATION CHIPS */}
                <Text style={[styles.inputFieldLabel, { marginTop: 14 }]}>
                  Quick Clinical Presets (Tap to append)
                </Text>
                <View style={styles.quickChipsWrap}>
                  {[
                    'Advised plenty of oral fluids and adequate bed rest.',
                    'Review in 5 days if fever persists or symptoms worsen.',
                    'Check vitals daily (BP & SpO2) and maintain a log.',
                    'Avoid cold water, oily and spicy food for 3 days.',
                    'Continue existing chronic medications without skipping.',
                  ].map((preset, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickNoteChip}
                      onPress={() => {
                        const noteToAdd = `• ${preset}`;
                        setConsultNotes((prev) => {
                          const updated = prev ? `${prev.trim()}\n${noteToAdd}` : noteToAdd;
                          if (onNotesChange) {
                            onNotesChange(updated);
                          }
                          return updated;
                        });
                      }}
                    >
                      <Ionicons name="add" size={13} color="#00B894" />
                      <Text style={styles.quickNoteChipText}>{preset}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* --------------------------------------------------
                STEP 2: PRESCRIBE (OF E-PRESCRIPTION INSIDE)
            --------------------------------------------------- */}
            {currentStep === 2 && (
              <View style={styles.stepContainer}>
                <View style={styles.stepTitleRow}>
                  <View style={styles.stepIconBubble}>
                    <Ionicons name="medkit" size={18} color="#00B894" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepHeading}>e-Prescription</Text>
                    <Text style={styles.stepSubheading}>
                      Search medicine, configure dosage, frequency, duration, and schedule
                    </Text>
                  </View>
                </View>

                {/* SEARCH WITH INCREASED HEIGHT & HIGHLIGHT SELECT BUTTON */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Search Medicine</Text>
                  <View style={styles.searchBoxTall}>
                    <Ionicons name="search" size={20} color="#64748B" />
                    <TextInput
                      style={styles.searchInputFieldTall}
                      placeholder="Type to search medicine (e.g. Paracetamol, Pantoprazole)..."
                      placeholderTextColor="#94A3B8"
                      value={medSearch}
                      onChangeText={(text) => {
                        setMedSearch(text);
                        setIsMedDropdownOpen(true);
                      }}
                      onFocus={() => setIsMedDropdownOpen(true)}
                    />
                    {medSearch.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setMedSearch('');
                          setIsMedDropdownOpen(false);
                        }}
                      >
                        <Ionicons name="close-circle" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* SEARCH DROPDOWN WITH HIGHLIGHTED SELECT BUTTON */}
                  {isMedDropdownOpen && (
                    <View style={styles.searchDropdownCard}>
                      <View style={styles.dropdownHeaderRow}>
                        <Text style={styles.dropdownHeaderTitle}>
                          Matching Medicines ({filteredMedicines.length})
                        </Text>
                        <TouchableOpacity onPress={() => setIsMedDropdownOpen(false)}>
                          <Text style={styles.dropdownCloseText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                      <ScrollView
                        style={styles.dropdownScrollView}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                      >
                        {filteredMedicines.map((item, index) => (
                          <View key={index} style={styles.dropdownItemRow}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.dropdownItemTitle}>{item}</Text>
                              <Text style={styles.dropdownItemSubtitle}>Oral administration</Text>
                            </View>
                            {/* HIGHLIGHTED SELECT BUTTON */}
                            <TouchableOpacity
                              style={styles.dropdownHighlightSelectBtn}
                              onPress={() => {
                                setMedicineName(item);
                                setMedSearch(''); // Search input emptied as requested
                                setIsMedDropdownOpen(false);
                              }}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="checkmark-sharp" size={14} color="#FFFFFF" />
                              <Text style={styles.dropdownHighlightSelectBtnText}>Select</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* MEDICINE NAME INPUT */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Medicine Name</Text>
                  <View style={styles.standardInputBox}>
                    <Ionicons name="bandage-outline" size={18} color="#00B894" />
                    <TextInput
                      style={styles.standardTextInput}
                      placeholder="Enter or selected medicine name..."
                      placeholderTextColor="#94A3B8"
                      value={medicineName}
                      onChangeText={setMedicineName}
                    />
                  </View>
                </View>

                {/* DOSAGE NAME WITH TYPING FIELD & ADD-UP BUTTONS */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Dosage Name</Text>
                  <View style={styles.standardInputBox}>
                    <Ionicons name="flask-outline" size={18} color="#071E42" />
                    <TextInput
                      style={styles.standardTextInput}
                      placeholder="e.g. 1 tablet, 500 mg, 5 ml..."
                      placeholderTextColor="#94A3B8"
                      value={dosageName}
                      onChangeText={setDosageName}
                    />
                  </View>
                  {/* ADD-UP BUTTONS LIKE 1 tablet, 3 tablet, 7 tablet */}
                  <View style={styles.quickAddPillsRow}>
                    {['1 tablet', '2 tablets', '3 tablets', '7 tablets', '1 capsule', '5 ml', '10 ml'].map(
                      (pill) => (
                        <TouchableOpacity
                          key={pill}
                          style={[
                            styles.quickAddPill,
                            dosageName === pill && styles.quickAddPillActive,
                          ]}
                          onPress={() => setDosageName(pill)}
                        >
                          <Text
                            style={[
                              styles.quickAddPillText,
                              dosageName === pill && styles.quickAddPillTextActive,
                            ]}
                          >
                            {pill}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>

                {/* FREQUENCY WITH TYPING FIELD & ADD-UP BUTTONS */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Frequency</Text>
                  <View style={styles.standardInputBox}>
                    <Ionicons name="repeat" size={18} color="#071E42" />
                    <TextInput
                      style={styles.standardTextInput}
                      placeholder="e.g. 1 daily, 2 daily, 3 daily..."
                      placeholderTextColor="#94A3B8"
                      value={frequency}
                      onChangeText={setFrequency}
                    />
                  </View>
                  {/* ADD-UP BUTTONS LIKE 1 daily, 2 daily */}
                  <View style={styles.quickAddPillsRow}>
                    {['1 daily', '2 daily', '3 daily', 'As needed (SOS)', 'Every 8 hrs'].map(
                      (pill) => (
                        <TouchableOpacity
                          key={pill}
                          style={[
                            styles.quickAddPill,
                            frequency === pill && styles.quickAddPillActive,
                          ]}
                          onPress={() => setFrequency(pill)}
                        >
                          <Text
                            style={[
                              styles.quickAddPillText,
                              frequency === pill && styles.quickAddPillTextActive,
                            ]}
                          >
                            {pill}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>

                {/* DURATION WITH TYPING FIELD & ADD-UP BUTTONS */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Duration</Text>
                  <View style={styles.standardInputBox}>
                    <Ionicons name="calendar-outline" size={18} color="#071E42" />
                    <TextInput
                      style={styles.standardTextInput}
                      placeholder="e.g. 3 days, 5 days, 7 days..."
                      placeholderTextColor="#94A3B8"
                      value={medDuration}
                      onChangeText={setMedDuration}
                    />
                  </View>
                  {/* ADD-UP BUTTONS LIKE 3 days 5 days so on */}
                  <View style={styles.quickAddPillsRow}>
                    {['3 days', '5 days', '7 days', '10 days', '14 days', '30 days'].map(
                      (pill) => (
                        <TouchableOpacity
                          key={pill}
                          style={[
                            styles.quickAddPill,
                            medDuration === pill && styles.quickAddPillActive,
                          ]}
                          onPress={() => setMedDuration(pill)}
                        >
                          <Text
                            style={[
                              styles.quickAddPillText,
                              medDuration === pill && styles.quickAddPillTextActive,
                            ]}
                          >
                            {pill}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>

                {/* SCHEDULE TIMINGS WITH BUTTON OPENING POP-UP AS SHOWN IN IMAGE */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Schedule Timings</Text>
                  <View style={styles.timingSummaryCard}>
                    <View style={styles.timingSummaryRow}>
                      <View style={styles.timingSummaryBadge}>
                        <Ionicons name="sunny" size={13} color="#00B894" />
                        <Text style={styles.timingSummaryText}>
                          Morn:{' '}
                          {morningTiming.tabletOption === 'ON'
                            ? `ON (${morningTiming.foodTiming === 'before' ? 'Before' : 'After'})`
                            : 'OFF'}
                        </Text>
                      </View>
                      <View style={styles.timingSummaryBadge}>
                        <Ionicons name="partly-sunny" size={13} color="#00B894" />
                        <Text style={styles.timingSummaryText}>
                          Aftern:{' '}
                          {afternoonTiming.tabletOption === 'ON'
                            ? `ON (${afternoonTiming.foodTiming === 'before' ? 'Before' : 'After'})`
                            : 'OFF'}
                        </Text>
                      </View>
                      <View style={styles.timingSummaryBadge}>
                        <Ionicons name="moon" size={13} color="#00B894" />
                        <Text style={styles.timingSummaryText}>
                          Night:{' '}
                          {nightTiming.tabletOption === 'ON'
                            ? `ON (${nightTiming.foodTiming === 'before' ? 'Before' : 'After'})`
                            : 'OFF'}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.addTimingScheduleBtn}
                      onPress={() => setIsTimingModalOpen(true)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="time" size={16} color="#081E3E" />
                      <Text style={styles.addTimingScheduleBtnText}>
                        Configure Schedule Timings (Morn / Aftern / Night)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ADD TO PRESCRIPTION BUTTON */}
                <TouchableOpacity
                  style={styles.addToPrescriptionMainBtn}
                  onPress={handleAddMedicine}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.addToPrescriptionMainBtnText}>
                    + Add to Prescription
                  </Text>
                </TouchableOpacity>

                {/* PRESCRIPTION REQUIREMENT LISTS SHOWN BELOW */}
                <View style={styles.prescriptionListSection}>
                  <Text style={styles.prescriptionListHeader}>
                    Prescription Requirement Lists ({prescribedList.length})
                  </Text>
                  {prescribedList.length === 0 ? (
                    <View style={styles.emptyListPlaceholder}>
                      <Ionicons name="medkit-outline" size={28} color="#CBD5E1" />
                      <Text style={styles.emptyListPlaceholderText}>
                        No medicines added yet. Configure above and tap "+ Add to Prescription".
                      </Text>
                    </View>
                  ) : (
                    prescribedList.map((med) => (
                      <View key={med.id} style={styles.prescriptionListCard}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="bandage" size={15} color="#00B894" />
                            <Text style={styles.prescriptionItemName}>{med.name}</Text>
                          </View>
                          <Text style={styles.prescriptionItemDetails}>
                            {med.dosage} · {med.frequency} · {med.duration}
                          </Text>
                          <Text style={styles.prescriptionItemSchedule}>
                            {med.timingSummary}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.removeListBtn}
                          onPress={() => handleRemoveMedicine(med.id)}
                        >
                          <Ionicons name="trash-outline" size={17} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>
            )}

            {/* --------------------------------------------------
                STEP 3: TESTS (LAB INVESTIGATIONS INSIDE)
            --------------------------------------------------- */}
            {currentStep === 3 && (
              <View style={styles.stepContainer}>
                <View style={styles.stepTitleRow}>
                  <View style={styles.stepIconBubble}>
                    <Ionicons name="flask" size={18} color="#00B894" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepHeading}>Diagnostic Tests</Text>
                    <Text style={styles.stepSubheading}>
                      Search test, patient preparation / diet requirement, and lab technician instructions
                    </Text>
                  </View>
                </View>

                {/* SEARCH WITH INCREASED HEIGHT & HIGHLIGHT SELECT BUTTON */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Search Diagnostic Tests</Text>
                  <View style={styles.searchBoxTall}>
                    <Ionicons name="search" size={20} color="#64748B" />
                    <TextInput
                      style={styles.searchInputFieldTall}
                      placeholder="Type to search test (e.g. CBC, Lipid Profile, HbA1c)..."
                      placeholderTextColor="#94A3B8"
                      value={testSearch}
                      onChangeText={(text) => {
                        setTestSearch(text);
                        setIsTestDropdownOpen(true);
                      }}
                      onFocus={() => setIsTestDropdownOpen(true)}
                    />
                    {testSearch.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setTestSearch('');
                          setIsTestDropdownOpen(false);
                        }}
                      >
                        <Ionicons name="close-circle" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* TESTS DROPDOWN WITH HIGHLIGHTED SELECT BUTTON */}
                  {isTestDropdownOpen && (
                    <View style={styles.searchDropdownCard}>
                      <View style={styles.dropdownHeaderRow}>
                        <Text style={styles.dropdownHeaderTitle}>
                          Matching Diagnostic Tests ({filteredTests.length})
                        </Text>
                        <TouchableOpacity onPress={() => setIsTestDropdownOpen(false)}>
                          <Text style={styles.dropdownCloseText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                      <ScrollView
                        style={styles.dropdownScrollView}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                      >
                        {filteredTests.map((item, index) => (
                          <View key={index} style={styles.dropdownItemRow}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.dropdownItemTitle}>{item}</Text>
                              <Text style={styles.dropdownItemSubtitle}>Diagnostic Laboratory Panel</Text>
                            </View>
                            {/* HIGHLIGHTED SELECT BUTTON */}
                            <TouchableOpacity
                              style={styles.dropdownHighlightSelectBtn}
                              onPress={() => {
                                setTestName(item);
                                setTestSearch(''); // Search input emptied as requested
                                setIsTestDropdownOpen(false);
                              }}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="checkmark-sharp" size={14} color="#FFFFFF" />
                              <Text style={styles.dropdownHighlightSelectBtnText}>Select</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* TEST NAME WITH TYPING FIELD & ADD-UP BUTTONS */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Test Name</Text>
                  <View style={styles.standardInputBox}>
                    <Ionicons name="flask-outline" size={18} color="#00B894" />
                    <TextInput
                      style={styles.standardTextInput}
                      placeholder="Enter or selected test name..."
                      placeholderTextColor="#94A3B8"
                      value={testName}
                      onChangeText={setTestName}
                    />
                  </View>
                  <View style={styles.quickAddPillsRow}>
                    {[
                      'CBC',
                      'Lipid Profile',
                      'HbA1c',
                      '12-Lead ECG',
                      'Thyroid Profile',
                      'Urine Routine',
                    ].map((pill) => (
                      <TouchableOpacity
                        key={pill}
                        style={[
                          styles.quickAddPill,
                          testName === pill && styles.quickAddPillActive,
                        ]}
                        onPress={() => setTestName(pill)}
                      >
                        <Text
                          style={[
                            styles.quickAddPillText,
                            testName === pill && styles.quickAddPillTextActive,
                          ]}
                        >
                          {pill}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* PATIENT PREPARATION / DIET REQUIREMENT WITH TYPING FIELD & ADD-UP BUTTONS */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>
                    Patient Preparation / Diet Requirement
                  </Text>
                  <View style={styles.standardInputBox}>
                    <Ionicons name="restaurant-outline" size={18} color="#071E42" />
                    <TextInput
                      style={styles.standardTextInput}
                      placeholder="e.g. Fasting 10 hrs, drinking only water..."
                      placeholderTextColor="#94A3B8"
                      value={patientPrep}
                      onChangeText={setPatientPrep}
                    />
                  </View>
                  <View style={styles.quickAddPillsRow}>
                    {[
                      'Fasting 10 hrs',
                      'Drinking only water',
                      'Normal diet',
                      'No caffeine 24h',
                      'Carry previous scan',
                    ].map((pill) => (
                      <TouchableOpacity
                        key={pill}
                        style={[
                          styles.quickAddPill,
                          patientPrep === pill && styles.quickAddPillActive,
                        ]}
                        onPress={() => setPatientPrep(pill)}
                      >
                        <Text
                          style={[
                            styles.quickAddPillText,
                            patientPrep === pill && styles.quickAddPillTextActive,
                          ]}
                        >
                          {pill}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* CLINICAL INSTRUCTIONS FOR LAB TECHNICIAN WITH TYPING FIELD & ADD-UP BUTTONS */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>
                    Clinical Instructions for Lab Technician
                  </Text>
                  <View style={styles.standardInputBox}>
                    <Ionicons name="clipboard-outline" size={18} color="#071E42" />
                    <TextInput
                      style={styles.standardTextInput}
                      placeholder="e.g. Routine analysis, urgent report required..."
                      placeholderTextColor="#94A3B8"
                      value={labInstructions}
                      onChangeText={setLabInstructions}
                    />
                  </View>
                  <View style={styles.quickAddPillsRow}>
                    {[
                      'Routine analysis',
                      'Urgent report required',
                      'Check fasting glucose & HbA1c',
                      'Serum electrolyte breakdown',
                    ].map((pill) => (
                      <TouchableOpacity
                        key={pill}
                        style={[
                          styles.quickAddPill,
                          labInstructions === pill && styles.quickAddPillActive,
                        ]}
                        onPress={() => setLabInstructions(pill)}
                      >
                        <Text
                          style={[
                            styles.quickAddPillText,
                            labInstructions === pill && styles.quickAddPillTextActive,
                          ]}
                        >
                          {pill}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* ADD TO TEST REQUIRED BUTTON */}
                <TouchableOpacity
                  style={styles.addToPrescriptionMainBtn}
                  onPress={handleAddTest}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.addToPrescriptionMainBtnText}>
                    + Add to Test Required
                  </Text>
                </TouchableOpacity>

                {/* TEST REQUIREMENT LISTS SHOWN BELOW */}
                <View style={styles.prescriptionListSection}>
                  <Text style={styles.prescriptionListHeader}>
                    Test Requirement Lists ({testsList.length})
                  </Text>
                  {testsList.length === 0 ? (
                    <View style={styles.emptyListPlaceholder}>
                      <Ionicons name="flask-outline" size={28} color="#CBD5E1" />
                      <Text style={styles.emptyListPlaceholderText}>
                        No diagnostic tests added yet. Configure above and tap "+ Add to Test Required".
                      </Text>
                    </View>
                  ) : (
                    testsList.map((t) => (
                      <View key={t.id} style={styles.prescriptionListCard}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="flask" size={15} color="#00B894" />
                            <Text style={styles.prescriptionItemName}>{t.name}</Text>
                          </View>
                          <Text style={styles.testDetailRow}>
                            <Text style={{ fontWeight: '600', color: '#071E42' }}>Prep: </Text>
                            {t.patientPrep}
                          </Text>
                          <Text style={styles.testDetailRow}>
                            <Text style={{ fontWeight: '600', color: '#071E42' }}>Instructions: </Text>
                            {t.instructions}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.removeListBtn}
                          onPress={() => handleRemoveTest(t.id)}
                        >
                          <Ionicons name="trash-outline" size={17} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>
            )}

            {/* --------------------------------------------------
                STEP 4: SCHEDULE & CONSULTATION DETAILS REVIEW
            --------------------------------------------------- */}
            {currentStep === 4 && (
              <View style={styles.stepContainer}>
                <View style={styles.stepTitleRow}>
                  <View style={styles.stepIconBubble}>
                    <Ionicons name="calendar" size={18} color="#00B894" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepHeading}>Follow-up & Schedule</Text>
                    <Text style={styles.stepSubheading}>
                      Set follow-up requirement, date, mode, and review consultation details
                    </Text>
                  </View>
                </View>

                {/* FOLLOW REQUIRED YES OR NO TOGGLE */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputFieldLabel}>Follow-up Required?</Text>
                  <View style={styles.yesNoToggleRow}>
                    <TouchableOpacity
                      style={[
                        styles.yesNoBtn,
                        followUpRequired === 'yes' && styles.yesNoBtnActive,
                      ]}
                      onPress={() => setFollowUpRequired('yes')}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={followUpRequired === 'yes' ? '#FFFFFF' : '#64748B'}
                      />
                      <Text
                        style={[
                          styles.yesNoBtnText,
                          followUpRequired === 'yes' && styles.yesNoBtnTextActive,
                        ]}
                      >
                        Yes, Required
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.yesNoBtn,
                        followUpRequired === 'no' && styles.yesNoBtnActive,
                      ]}
                      onPress={() => setFollowUpRequired('no')}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={followUpRequired === 'no' ? '#FFFFFF' : '#64748B'}
                      />
                      <Text
                        style={[
                          styles.yesNoBtnText,
                          followUpRequired === 'no' && styles.yesNoBtnTextActive,
                        ]}
                      >
                        No, Not Required
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* IF YES: APPEAR FOLLOW-UP OR VIDEO CONSULTATION & CALENDAR BUTTON */}
                {followUpRequired === 'yes' && (
                  <>
                    {/* CONSULTATION MODE SELECTION */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputFieldLabel}>Follow-up Consultation Mode</Text>
                      <View style={styles.modeToggleRow}>
                        <TouchableOpacity
                          style={[
                            styles.modeToggleBtn,
                            consultMode === 'Video' && styles.modeToggleBtnActive,
                          ]}
                          onPress={() => setConsultMode('Video')}
                        >
                          <Ionicons
                            name="videocam"
                            size={16}
                            color={consultMode === 'Video' ? '#081E3E' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.modeToggleBtnText,
                              consultMode === 'Video' && styles.modeToggleBtnTextActive,
                            ]}
                          >
                            Video Consultation
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.modeToggleBtn,
                            consultMode === 'In-Person' && styles.modeToggleBtnActive,
                          ]}
                          onPress={() => setConsultMode('In-Person')}
                        >
                          <Ionicons
                            name="people"
                            size={16}
                            color={consultMode === 'In-Person' ? '#081E3E' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.modeToggleBtnText,
                              consultMode === 'In-Person' && styles.modeToggleBtnTextActive,
                            ]}
                          >
                            In-Person Follow-up
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* TARGET FOLLOW-UP DATE WITH CALENDAR BUTTON */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputFieldLabel}>Target Follow-up Date</Text>
                      <TouchableOpacity
                        style={styles.calendarTriggerBtn}
                        onPress={() => setIsCalendarOpen(true)}
                        activeOpacity={0.85}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={styles.calendarIconBubble}>
                            <Ionicons name="calendar" size={18} color="#00B894" />
                          </View>
                          <View>
                            <Text style={styles.calendarDateText}>{selectedDate}</Text>
                            <Text style={styles.calendarDateSubtext}>
                              Tap to open interactive calendar picker
                            </Text>
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#00B894" />
                      </TouchableOpacity>
                    </View>

                    {/* PREFERRED TIME SLOT */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputFieldLabel}>Preferred Time Slot</Text>
                      <View style={styles.timeSlotRow}>
                        {['09:30 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'].map((slot) => (
                          <TouchableOpacity
                            key={slot}
                            style={[
                              styles.timeSlotChip,
                              selectedSlot === slot && styles.timeSlotChipActive,
                            ]}
                            onPress={() => setSelectedSlot(slot)}
                          >
                            <Text
                              style={[
                                styles.timeSlotChipText,
                                selectedSlot === slot && styles.timeSlotChipTextActive,
                              ]}
                            >
                              {slot}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </>
                )}

                {/* IF NO: DISPLAY NOTICE */}
                {followUpRequired === 'no' && (
                  <View style={styles.noFollowUpNoticeCard}>
                    <Ionicons name="information-circle" size={20} color="#00B894" />
                    <Text style={styles.noFollowUpNoticeText}>
                      No mandatory follow-up scheduled. The patient is advised to consult SOS if symptoms recur.
                    </Text>
                  </View>
                )}

                {/* DETAILS DOWN OF: CONSULTATION NOTES, PRESCRIBE MEDICINE, TEST REQUIREMENTS, FOLLOW-UP DATE FIXED */}
                <Text style={[styles.inputFieldLabel, { marginTop: 16 }]}>
                  Consultation Details Review
                </Text>
                <View style={styles.detailsReviewMasterCard}>
                  {/* 1. Consultation Notes */}
                  <View style={styles.detailsReviewSection}>
                    <View style={styles.detailsReviewSectionHeader}>
                      <Ionicons name="document-text-outline" size={16} color="#071E42" />
                      <Text style={styles.detailsReviewSectionTitle}>Consultation Notes</Text>
                    </View>
                    <Text style={styles.detailsReviewNotesText} numberOfLines={4}>
                      {consultNotes ? consultNotes : 'No consultation notes entered.'}
                    </Text>
                  </View>

                  <View style={styles.detailsReviewDivider} />

                  {/* 2. Prescribed Medicine */}
                  <View style={styles.detailsReviewSection}>
                    <View style={styles.detailsReviewSectionHeader}>
                      <Ionicons name="medkit-outline" size={16} color="#071E42" />
                      <Text style={styles.detailsReviewSectionTitle}>
                        Prescribed Medicine ({prescribedList.length})
                      </Text>
                    </View>
                    {prescribedList.length === 0 ? (
                      <Text style={styles.detailsReviewEmptyText}>No medicine prescribed.</Text>
                    ) : (
                      prescribedList.map((m, idx) => (
                        <View key={m.id || idx} style={styles.detailsReviewItemRow}>
                          <View style={styles.detailsReviewBullet} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.detailsReviewItemName}>{m.name}</Text>
                            <Text style={styles.detailsReviewItemSub}>
                              {m.dosage} · {m.frequency} · {m.duration} ({m.timingSummary})
                            </Text>
                          </View>
                        </View>
                      ))
                    )}
                  </View>

                  <View style={styles.detailsReviewDivider} />

                  {/* 3. Test Requirements */}
                  <View style={styles.detailsReviewSection}>
                    <View style={styles.detailsReviewSectionHeader}>
                      <Ionicons name="flask-outline" size={16} color="#071E42" />
                      <Text style={styles.detailsReviewSectionTitle}>
                        Test Requirements ({testsList.length})
                      </Text>
                    </View>
                    {testsList.length === 0 ? (
                      <Text style={styles.detailsReviewEmptyText}>No test requirements added.</Text>
                    ) : (
                      testsList.map((t, idx) => (
                        <View key={t.id || idx} style={styles.detailsReviewItemRow}>
                          <View style={[styles.detailsReviewBullet, { backgroundColor: '#00B894' }]} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.detailsReviewItemName}>{t.name}</Text>
                            <Text style={styles.detailsReviewItemSub}>
                              Prep: {t.patientPrep} · Lab: {t.instructions}
                            </Text>
                          </View>
                        </View>
                      ))
                    )}
                  </View>

                  <View style={styles.detailsReviewDivider} />

                  {/* 4. Follow-up --> Date Fixed */}
                  <View style={styles.detailsReviewSection}>
                    <View style={styles.detailsReviewSectionHeader}>
                      <Ionicons name="calendar-outline" size={16} color="#071E42" />
                      <Text style={styles.detailsReviewSectionTitle}>Follow-up Target</Text>
                    </View>
                    <View style={styles.detailsReviewFollowUpBadge}>
                      <Ionicons
                        name={followUpRequired === 'yes' ? 'time' : 'close-circle'}
                        size={16}
                        color={followUpRequired === 'yes' ? '#00B894' : '#64748B'}
                      />
                      <Text style={styles.detailsReviewFollowUpText}>
                        {followUpRequired === 'yes'
                          ? `Date Fixed: ${selectedDate} at ${selectedSlot} (${consultMode})`
                          : 'Follow-up: Not required (SOS / As needed)'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* ======================================================
              STATIC BUTTONS DOWN (FIXED AT BOTTOM OF BOTTOM SHEET)
              (continue button, skip button, and back button / submit)
          ======================================================= */}
          <View style={styles.staticBottomBar}>
            {/* BACK / CANCEL BUTTON */}
            <TouchableOpacity
              style={styles.staticBackBtn}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={16} color="#475569" />
              <Text style={styles.staticBackBtnText}>
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Text>
            </TouchableOpacity>

            {/* SKIP BUTTON (for steps 1, 2, 3) */}
            {currentStep < 4 && (
              <TouchableOpacity
                style={styles.staticSkipBtn}
                onPress={handleSkip}
                activeOpacity={0.8}
              >
                <Text style={styles.staticSkipBtnText}>Skip</Text>
              </TouchableOpacity>
            )}

            {/* CONTINUE / SUBMIT BUTTON */}
            <TouchableOpacity
              style={[styles.staticPrimaryBtn, currentStep === 4 && { flex: 2 }]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.staticPrimaryBtnText}>
                {currentStep === 1
                  ? 'Continue to Prescribe'
                  : currentStep === 2
                  ? 'Continue to Tests'
                  : currentStep === 3
                  ? 'Continue to Schedule'
                  : 'Submit'}
              </Text>
              <Ionicons
                name={currentStep === 4 ? 'checkmark-circle' : 'arrow-forward'}
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* ======================================================
              SUB-MODAL 1: DAILY TABLET SCHEDULE & FOOD TIMING
              (MATCHING REFERENCE IMAGE)
          ======================================================= */}
          <Modal
            visible={isTimingModalOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsTimingModalOpen(false)}
          >
            <View style={styles.subModalOverlay}>
              <View style={styles.timingCardModal}>
                <View style={styles.timingCardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="time-outline" size={20} color="#00B894" />
                    <Text style={styles.timingCardHeaderTitle}>
                      Daily Tablet Schedule & Food Timing
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsTimingModalOpen(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* MORNING */}
                  <View style={styles.timingBlock}>
                    <View style={styles.timingBlockHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="sunny-outline" size={18} color="#00B894" />
                        <Text style={styles.timingBlockTitle}>Morning</Text>
                      </View>
                      <View style={styles.timingStatusBadge}>
                        <Text style={styles.timingStatusBadgeText}>
                          {morningTiming.tabletOption === 'OFF'
                            ? 'Tablet OFF'
                            : `Tablet ON · ${morningTiming.foodTiming === 'before' ? 'Before Food' : 'After Food'}`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timingControlRow}>
                      <Text style={styles.timingControlLabel}>Tablet Option:</Text>
                      <View style={styles.toggleButtonsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            morningTiming.tabletOption === 'ON' && styles.toggleBtnActiveNavy,
                          ]}
                          onPress={() =>
                            setMorningTiming((prev) => ({ ...prev, tabletOption: 'ON' }))
                          }
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color={morningTiming.tabletOption === 'ON' ? '#FFFFFF' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.toggleBtnText,
                              morningTiming.tabletOption === 'ON' && styles.toggleBtnTextActive,
                            ]}
                          >
                            ON
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            morningTiming.tabletOption === 'OFF' && styles.toggleBtnActiveNavy,
                          ]}
                          onPress={() =>
                            setMorningTiming((prev) => ({ ...prev, tabletOption: 'OFF' }))
                          }
                        >
                          <Ionicons
                            name="close-circle"
                            size={14}
                            color={morningTiming.tabletOption === 'OFF' ? '#FFFFFF' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.toggleBtnText,
                              morningTiming.tabletOption === 'OFF' && styles.toggleBtnTextActive,
                            ]}
                          >
                            OFF
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {morningTiming.tabletOption === 'ON' && (
                      <View style={styles.timingControlRow}>
                        <Text style={styles.timingControlLabel}>Food Timing:</Text>
                        <View style={styles.toggleButtonsGroup}>
                          <TouchableOpacity
                            style={[
                              styles.toggleBtn,
                              morningTiming.foodTiming === 'before' && styles.toggleBtnActiveNavy,
                            ]}
                            onPress={() =>
                              setMorningTiming((prev) => ({ ...prev, foodTiming: 'before' }))
                            }
                          >
                            <Text
                              style={[
                                styles.toggleBtnText,
                                morningTiming.foodTiming === 'before' && styles.toggleBtnTextActive,
                              ]}
                            >
                              Before Food
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.toggleBtn,
                              morningTiming.foodTiming === 'after' && styles.toggleBtnActiveNavy,
                            ]}
                            onPress={() =>
                              setMorningTiming((prev) => ({ ...prev, foodTiming: 'after' }))
                            }
                          >
                            <Text
                              style={[
                                styles.toggleBtnText,
                                morningTiming.foodTiming === 'after' && styles.toggleBtnTextActive,
                              ]}
                            >
                              After Food
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* AFTERNOON */}
                  <View style={styles.timingBlock}>
                    <View style={styles.timingBlockHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="partly-sunny-outline" size={18} color="#00B894" />
                        <Text style={styles.timingBlockTitle}>Afternoon</Text>
                      </View>
                      <View style={styles.timingStatusBadge}>
                        <Text style={styles.timingStatusBadgeText}>
                          {afternoonTiming.tabletOption === 'OFF'
                            ? 'Tablet OFF'
                            : `Tablet ON · ${afternoonTiming.foodTiming === 'before' ? 'Before Food' : 'After Food'}`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timingControlRow}>
                      <Text style={styles.timingControlLabel}>Tablet Option:</Text>
                      <View style={styles.toggleButtonsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            afternoonTiming.tabletOption === 'ON' && styles.toggleBtnActiveNavy,
                          ]}
                          onPress={() =>
                            setAfternoonTiming((prev) => ({ ...prev, tabletOption: 'ON' }))
                          }
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color={afternoonTiming.tabletOption === 'ON' ? '#FFFFFF' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.toggleBtnText,
                              afternoonTiming.tabletOption === 'ON' && styles.toggleBtnTextActive,
                            ]}
                          >
                            ON
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            afternoonTiming.tabletOption === 'OFF' && styles.toggleBtnActiveNavy,
                          ]}
                          onPress={() =>
                            setAfternoonTiming((prev) => ({ ...prev, tabletOption: 'OFF' }))
                          }
                        >
                          <Ionicons
                            name="close-circle"
                            size={14}
                            color={afternoonTiming.tabletOption === 'OFF' ? '#FFFFFF' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.toggleBtnText,
                              afternoonTiming.tabletOption === 'OFF' && styles.toggleBtnTextActive,
                            ]}
                          >
                            OFF
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {afternoonTiming.tabletOption === 'ON' && (
                      <View style={styles.timingControlRow}>
                        <Text style={styles.timingControlLabel}>Food Timing:</Text>
                        <View style={styles.toggleButtonsGroup}>
                          <TouchableOpacity
                            style={[
                              styles.toggleBtn,
                              afternoonTiming.foodTiming === 'before' && styles.toggleBtnActiveNavy,
                            ]}
                            onPress={() =>
                              setAfternoonTiming((prev) => ({ ...prev, foodTiming: 'before' }))
                            }
                          >
                            <Text
                              style={[
                                styles.toggleBtnText,
                                afternoonTiming.foodTiming === 'before' && styles.toggleBtnTextActive,
                              ]}
                            >
                              Before Food
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.toggleBtn,
                              afternoonTiming.foodTiming === 'after' && styles.toggleBtnActiveNavy,
                            ]}
                            onPress={() =>
                              setAfternoonTiming((prev) => ({ ...prev, foodTiming: 'after' }))
                            }
                          >
                            <Text
                              style={[
                                styles.toggleBtnText,
                                afternoonTiming.foodTiming === 'after' && styles.toggleBtnTextActive,
                              ]}
                            >
                              After Food
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* NIGHT */}
                  <View style={styles.timingBlock}>
                    <View style={styles.timingBlockHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="moon-outline" size={18} color="#00B894" />
                        <Text style={styles.timingBlockTitle}>Night</Text>
                      </View>
                      <View style={styles.timingStatusBadge}>
                        <Text style={styles.timingStatusBadgeText}>
                          {nightTiming.tabletOption === 'OFF'
                            ? 'Tablet OFF'
                            : `Tablet ON · ${nightTiming.foodTiming === 'before' ? 'Before Food' : 'After Food'}`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timingControlRow}>
                      <Text style={styles.timingControlLabel}>Tablet Option:</Text>
                      <View style={styles.toggleButtonsGroup}>
                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            nightTiming.tabletOption === 'ON' && styles.toggleBtnActiveNavy,
                          ]}
                          onPress={() =>
                            setNightTiming((prev) => ({ ...prev, tabletOption: 'ON' }))
                          }
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color={nightTiming.tabletOption === 'ON' ? '#FFFFFF' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.toggleBtnText,
                              nightTiming.tabletOption === 'ON' && styles.toggleBtnTextActive,
                            ]}
                          >
                            ON
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            nightTiming.tabletOption === 'OFF' && styles.toggleBtnActiveNavy,
                          ]}
                          onPress={() =>
                            setNightTiming((prev) => ({ ...prev, tabletOption: 'OFF' }))
                          }
                        >
                          <Ionicons
                            name="close-circle"
                            size={14}
                            color={nightTiming.tabletOption === 'OFF' ? '#FFFFFF' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.toggleBtnText,
                              nightTiming.tabletOption === 'OFF' && styles.toggleBtnTextActive,
                            ]}
                          >
                            OFF
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {nightTiming.tabletOption === 'ON' && (
                      <View style={styles.timingControlRow}>
                        <Text style={styles.timingControlLabel}>Food Timing:</Text>
                        <View style={styles.toggleButtonsGroup}>
                          <TouchableOpacity
                            style={[
                              styles.toggleBtn,
                              nightTiming.foodTiming === 'before' && styles.toggleBtnActiveNavy,
                            ]}
                            onPress={() =>
                              setNightTiming((prev) => ({ ...prev, foodTiming: 'before' }))
                            }
                          >
                            <Text
                              style={[
                                styles.toggleBtnText,
                                nightTiming.foodTiming === 'before' && styles.toggleBtnTextActive,
                              ]}
                            >
                              Before Food
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.toggleBtn,
                              nightTiming.foodTiming === 'after' && styles.toggleBtnActiveNavy,
                            ]}
                            onPress={() =>
                              setNightTiming((prev) => ({ ...prev, foodTiming: 'after' }))
                            }
                          >
                            <Text
                              style={[
                                styles.toggleBtnText,
                                nightTiming.foodTiming === 'after' && styles.toggleBtnTextActive,
                              ]}
                            >
                              After Food
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.timingSaveBtn}
                    onPress={() => setIsTimingModalOpen(false)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-done" size={17} color="#FFFFFF" />
                    <Text style={styles.timingSaveBtnText}>Save Schedule & Food Timing</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* ======================================================
              SUB-MODAL 2: CALENDAR DATE PICKER
          ======================================================= */}
          <Modal
            visible={isCalendarOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsCalendarOpen(false)}
          >
            <View style={styles.subModalOverlay}>
              <View style={styles.calendarCardModal}>
                <View style={styles.calendarCardHeader}>
                  <Text style={styles.calendarCardHeaderTitle}>
                    {MONTH_NAMES[calMonth]} {calYear}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={styles.calNavBtn}
                      onPress={() => {
                        if (calMonth === 0) {
                          setCalMonth(11);
                          setCalYear((y) => y - 1);
                        } else {
                          setCalMonth((m) => m - 1);
                        }
                      }}
                    >
                      <Ionicons name="chevron-back" size={18} color="#071E42" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.calNavBtn}
                      onPress={() => {
                        if (calMonth === 11) {
                          setCalMonth(0);
                          setCalYear((y) => y + 1);
                        } else {
                          setCalMonth((m) => m + 1);
                        }
                      }}
                    >
                      <Ionicons name="chevron-forward" size={18} color="#071E42" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Day Labels */}
                <View style={styles.calendarGridRow}>
                  {WEEK_DAYS.map((wd) => (
                    <Text key={wd} style={styles.calendarDayColLabel}>
                      {wd}
                    </Text>
                  ))}
                </View>

                {/* Days Grid */}
                <View style={styles.calendarGridWrap}>
                  {calendarDays.map((d, index) => {
                    const isSelected = d === calDay;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.calDayBox,
                          isSelected && styles.calDayBoxSelected,
                          !d && { opacity: 0 },
                        ]}
                        disabled={!d}
                        onPress={() => handleSelectDay(d)}
                      >
                        <Text
                          style={[
                            styles.calDayText,
                            isSelected && styles.calDayTextSelected,
                          ]}
                        >
                          {d || ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Quick Shortcuts */}
                <View style={styles.calQuickSelectRow}>
                  {[
                    { label: 'In 3 Days', days: 3 },
                    { label: 'In 5 Days', days: 5 },
                    { label: 'In 1 Week', days: 7 },
                    { label: 'In 2 Weeks', days: 14 },
                  ].map((q) => (
                    <TouchableOpacity
                      key={q.label}
                      style={styles.calQuickSelectChip}
                      onPress={() => {
                        const target = new Date(calYear, calMonth, calDay + q.days);
                        setCalYear(target.getFullYear());
                        setCalMonth(target.getMonth());
                        setCalDay(target.getDate());
                        setIsCalendarOpen(false);
                      }}
                    >
                      <Text style={styles.calQuickSelectText}>{q.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>

          {/* ======================================================
              SUB-MODAL 3: FINAL SENT TO PATIENTS POP-UP MODAL
          ======================================================= */}
          <Modal
            visible={isSuccessModalOpen}
            transparent
            animationType="fade"
            onRequestClose={handleFinalOk}
          >
            <View style={styles.subModalOverlay}>
              <View style={styles.successCardModal}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-circle" size={44} color="#071E42" />
                </View>

                <Text style={styles.successModalTitle}>Consultation Plan Sent to Patient</Text>
                <Text style={styles.successModalSubtitle}>
                  Video consultation notes, e-Prescription, and diagnostic test requirements have been sent successfully to {patientName}'s MediUnify app.
                </Text>

                <View style={styles.successSummaryBox}>
                  <View style={styles.successSummaryRow}>
                    <Text style={styles.successSummaryLabel}>Follow-up Target</Text>
                    <Text style={styles.successSummaryVal}>
                      {followUpRequired === 'yes'
                        ? `${selectedDate} (${consultMode})`
                        : 'Not Required'}
                    </Text>
                  </View>
                  {followUpRequired === 'yes' && (
                    <View style={styles.successSummaryRow}>
                      <Text style={styles.successSummaryLabel}>Time Slot</Text>
                      <Text style={styles.successSummaryVal}>
                        {selectedSlot}
                      </Text>
                    </View>
                  )}
                  <View style={styles.successSummaryRow}>
                    <Text style={styles.successSummaryLabel}>Prescriptions</Text>
                    <Text style={styles.successSummaryVal}>
                      {prescribedList.length} items
                    </Text>
                  </View>
                  <View style={styles.successSummaryRow}>
                    <Text style={styles.successSummaryLabel}>Lab Tests</Text>
                    <Text style={styles.successSummaryVal}>
                      {testsList.length} investigations
                    </Text>
                  </View>
                </View>

                {/* SINGLE OK BUTTON */}
                <TouchableOpacity
                  style={styles.successOkBtn}
                  onPress={handleFinalOk}
                  activeOpacity={0.88}
                >
                  <Text style={styles.successOkBtnText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export { VideoCallBottomSheet };

const styles = StyleSheet.create({
  /* BOTTOM SHEET OVERLAY & CONTAINER */
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 15, 35, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetBackdropDismiss: {
    flex: 1,
    width: '100%',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    maxHeight: '94%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 24,
  },

  /* TOP DRAG HANDLE */
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },

  /* HEADER WHITE THEME */
  sheetHeaderNavy: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleWrap: {
    flex: 1,
  },
  modeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  modeBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#00B894',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modeBadgeText: {
    color: '#081E3E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 184, 148, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.35)',
  },
  durationBadgeText: {
    color: '#00B894',
    fontSize: 10,
    fontWeight: '700',
  },
  patientTitleText: {
    color: '#071E42',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  patientMetaText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  headerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 4-STEP PROGRESS INDICATOR */
  stepProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepNode: {
    alignItems: 'center',
    width: 60,
  },
  stepNodeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNodeCircleActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  stepNodeCirclePast: {
    backgroundColor: '#E6F8F4',
    borderColor: '#00B894',
  },
  stepNodeNumber: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  stepNodeNumberActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stepNodeNumberPast: {
    color: '#00B894',
    fontWeight: '800',
  },
  stepNodeLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  stepNodeLabelActive: {
    color: '#071E42',
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: '#00B894',
  },

  /* SCROLL BODY */
  sheetBodyScroll: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  sheetBodyContent: {
    padding: 18,
    paddingBottom: 40,
  },
  stepContainer: {
    width: '100%',
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  stepIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F8F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#071E42',
  },
  stepSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },

  /* FORM INPUTS */
  inputGroup: {
    marginBottom: 16,
  },
  inputFieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
    marginBottom: 6,
  },
  fieldHint: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },

  /* STEP 1: CONSULT NOTES SINGLE TYPING BOX */
  singleConsultNotesBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 130,
    lineHeight: 20,
  },
  quickChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  quickNoteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickNoteChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },

  /* STEP 2 & 3: TALL SEARCH BOX */
  searchBoxTall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    minHeight: 52,
    gap: 10,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInputFieldTall: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    height: '100%',
  },

  /* SEARCH DROPDOWN */
  searchDropdownCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 230,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dropdownHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },
  dropdownCloseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  dropdownScrollView: {
    maxHeight: 180,
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  dropdownItemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  dropdownHighlightSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00B894',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdownHighlightSelectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  /* STANDARD INPUT BOX */
  standardInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  standardTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },

  /* QUICK ADD PILLS */
  quickAddPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  quickAddPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quickAddPillActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  quickAddPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  quickAddPillTextActive: {
    color: '#FFFFFF',
  },

  /* SCHEDULE TIMINGS SUMMARY CARD */
  timingSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  timingSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  timingSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  timingSummaryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  addTimingScheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E6F8F4',
    borderWidth: 1.5,
    borderColor: '#00B894',
    paddingVertical: 10,
    borderRadius: 8,
  },
  addTimingScheduleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },

  /* ADD TO PRESCRIPTION / TEST BUTTON */
  addToPrescriptionMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  addToPrescriptionMainBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* PRESCRIPTION LIST SECTION */
  prescriptionListSection: {
    marginTop: 20,
  },
  prescriptionListHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#071E42',
    marginBottom: 8,
  },
  emptyListPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 24,
    gap: 8,
  },
  emptyListPlaceholderText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  prescriptionListCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  prescriptionItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#071E42',
  },
  prescriptionItemDetails: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 3,
  },
  prescriptionItemSchedule: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  testDetailRow: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
  },
  removeListBtn: {
    padding: 6,
  },

  /* STEP 4: YES / NO TOGGLE */
  yesNoToggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  yesNoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    borderRadius: 10,
  },
  yesNoBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  yesNoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  yesNoBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* CONSULTATION MODE TOGGLE */
  modeToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 8,
  },
  modeToggleBtnActive: {
    backgroundColor: '#E6F8F4',
    borderColor: '#00B894',
  },
  modeToggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  modeToggleBtnTextActive: {
    color: '#081E3E',
    fontWeight: '700',
  },

  /* CALENDAR TRIGGER BUTTON */
  calendarTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 12,
    padding: 12,
  },
  calendarIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6F8F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDateText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071E42',
  },
  calendarDateSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },

  /* TIME SLOTS */
  timeSlotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  timeSlotChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  timeSlotChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  timeSlotChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* NO FOLLOW-UP NOTICE */
  noFollowUpNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E6F8F4',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  noFollowUpNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#064E3B',
    lineHeight: 17,
  },

  /* DETAILS REVIEW MASTER CARD */
  detailsReviewMasterCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  detailsReviewSection: {
    paddingVertical: 6,
  },
  detailsReviewSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  detailsReviewSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  detailsReviewNotesText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
  },
  detailsReviewDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  detailsReviewEmptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  detailsReviewItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  detailsReviewBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#071E42',
    marginTop: 6,
  },
  detailsReviewItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },
  detailsReviewItemSub: {
    fontSize: 11,
    color: '#64748B',
  },
  detailsReviewFollowUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsReviewFollowUpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },

  /* FIXED BOTTOM BAR */
  staticBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  staticBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  staticBackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  staticSkipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
  },
  staticSkipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  staticPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#071E42',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  staticPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* SUB-MODAL OVERLAYS */
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 15, 35, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  timingCardModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
  },
  timingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  timingCardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071E42',
  },
  timingBlock: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  timingBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timingBlockTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#071E42',
  },
  timingStatusBadge: {
    backgroundColor: '#E6F8F4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timingStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  timingControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timingControlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  toggleButtonsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  toggleBtnActiveNavy: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timingSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  timingSaveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* CALENDAR MODAL */
  calendarCardModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    maxWidth: 380,
  },
  calendarCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calendarCardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#071E42',
  },
  calNavBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  calendarGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarDayColLabel: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  calendarGridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calDayBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  calDayBoxSelected: {
    backgroundColor: '#00B894',
  },
  calDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  calQuickSelectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  calQuickSelectChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  calQuickSelectText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#071E42',
  },

  /* SUCCESS SENT POP-UP MODAL */
  successCardModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F8F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#071E42',
    textAlign: 'center',
    marginBottom: 8,
  },
  successModalSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  successSummaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    gap: 8,
  },
  successSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successSummaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  successSummaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },
  successOkBtn: {
    width: '100%',
    backgroundColor: '#071E42',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  successOkBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
