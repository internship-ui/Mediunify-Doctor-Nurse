import React, { useState, useMemo } from 'react';
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

const PRESET_INSTRUCTIONS = [
  'Fasting required (10-12 hrs)',
  'Drink plenty of water before ultrasound',
  'Carry previous scan & lab reports',
  'Visit diagnostic lab within 3 days',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function ConsultationBottomSheet({
  visible,
  onClose,
  appointment,
  patient,
  onComplete,
}) {
  // Current active step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // ----------------------------------------------------
  // STEP 1 STATE: CONSULT NOTES (ONE typing field)
  // ----------------------------------------------------
  const [consultNotes, setConsultNotes] = useState(
    appointment?.reason
      ? `Patient presented for: ${appointment.reason}.\nVitals stable on arrival (BP: 122/80 mmHg). Advised adequate hydration, rest, and follow-up care.`
      : 'Vitals stable on arrival. Blood pressure recorded at 122/80 mmHg. Advised warm saline gargle twice daily and avoiding cold beverages.'
  );

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
      morningTiming.tabletOption === 'ON' ? 'ON (' + (morningTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')' : 'OFF'
    } · Aftern: ${
      afternoonTiming.tabletOption === 'ON' ? 'ON (' + (afternoonTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')' : 'OFF'
    } · Night: ${
      nightTiming.tabletOption === 'ON' ? 'ON (' + (nightTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')' : 'OFF'
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
  const [consultMode, setConsultMode] = useState('In-Person'); // 'In-Person' | 'Video'
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
  // STEP 5: NOTES DOWN OK CONFIRMATION POP-UP
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
    }
    if (onClose) {
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
              NAVY BLUE HEADER (MATCHING THEME & IMAGE REQUIREMENT)
          ======================================================= */}
          <View style={styles.sheetHeaderNavy}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerTitleWrap}>
                <View style={styles.modeBadge}>
                  <Ionicons name="repeat-outline" size={13} color="#081E3E" />
                  <Text style={styles.modeBadgeText}>FOLLOW-UP TREATMENT PLAN</Text>
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
              SCROLLABLE BODY CONTENT (MIDDLE)
          ======================================================= */}
          <ScrollView
            style={styles.sheetScrollBody}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ----------------------------------------------------
                STEP 1: CONSULT NOTES
                (with one typing field)
            ----------------------------------------------------- */}
            {currentStep === 1 && (
              <View style={styles.stepContentWrap}>
                <View style={styles.sectionHeaderBanner}>
                  <View style={styles.sectionIconWrap}>
                    <Ionicons name="document-text" size={18} color="#071E42" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionHeaderTitle}>
                      Clinical Consultation Notes
                    </Text>
                    <Text style={styles.sectionHeaderSub}>
                      Record consultation findings, examination observations, and doctor advice
                    </Text>
                  </View>
                </View>

                {/* Consult notes with one typing field */}
                <Text style={styles.inputFieldLabel}>Consult Notes</Text>
                <TextInput
                  style={styles.singleConsultNotesBox}
                  placeholder="Type consult notes, clinical observations, patient findings, diagnosis and doctor advice here..."
                  placeholderTextColor="#94A3B8"
                  value={consultNotes}
                  onChangeText={setConsultNotes}
                  multiline
                  numberOfLines={9}
                  textAlignVertical="top"
                />
              </View>
            )}

            {/* ----------------------------------------------------
                STEP 2: PRESCRIBE (e-Prescription)
                (tall search, highlighted select, medicine name, dosage, frequency, duration, schedule timings pop-up, add to prescription, requirement lists)
            ----------------------------------------------------- */}
            {currentStep === 2 && (
              <View style={styles.stepContentWrap}>
                <View style={styles.sectionHeaderBanner}>
                  <View style={styles.sectionIconWrap}>
                    <Ionicons name="medkit" size={18} color="#071E42" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionHeaderTitle}>
                      e-Prescription
                    </Text>
                    <Text style={styles.sectionHeaderSub}>
                      Search or enter medicine, specify dosage, frequency, duration & schedule
                    </Text>
                  </View>
                </View>

                {/* Search Medicine with Tall Box & Highlighted Select Button */}
                <Text style={styles.inputFieldLabel}>Search Medicine</Text>
                <View style={styles.searchDropdownWrap}>
                  <View style={[styles.searchInputRow, styles.searchBoxTall]}>
                    <Ionicons name="search" size={20} color="#071E42" />
                    <TextInput
                      style={[styles.searchInputField, styles.searchInputFieldTall]}
                      placeholder="Search medicine (e.g. Paracetamol, Amoxicillin)..."
                      placeholderTextColor="#94A3B8"
                      value={medSearch}
                      onChangeText={(t) => {
                        setMedSearch(t);
                        setIsMedDropdownOpen(true);
                      }}
                      onFocus={() => setIsMedDropdownOpen(true)}
                    />
                    {medSearch.length > 0 && (
                      <TouchableOpacity onPress={() => setMedSearch('')}>
                        <Ionicons name="close-circle" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {isMedDropdownOpen && (
                    <View style={styles.dropdownListBox}>
                      <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                        {filteredMedicines.map((m) => (
                          <View key={m} style={styles.dropdownItemRow}>
                            <View style={styles.dropdownItemInfo}>
                              <Ionicons name="medical" size={15} color="#071E42" />
                              <Text style={styles.dropdownItemName}>{m}</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.dropdownHighlightSelectBtn}
                              onPress={() => {
                                setMedicineName(m);
                                setMedSearch('');
                                setIsMedDropdownOpen(false);
                              }}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.dropdownHighlightSelectBtnText}>Select</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Medicine Name with typing field */}
                <Text style={styles.inputFieldLabel}>Medicine Name</Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="Medicine name (e.g. Paracetamol 500mg)"
                  placeholderTextColor="#94A3B8"
                  value={medicineName}
                  onChangeText={setMedicineName}
                />

                {/* Dosage Name with typing field and add up buttons */}
                <Text style={styles.inputFieldLabel}>Dosage Name</Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="e.g. 1 tablet, 2 tablets, 5 ml..."
                  placeholderTextColor="#94A3B8"
                  value={dosageName}
                  onChangeText={setDosageName}
                />
                <View style={styles.quickAddPillsRow}>
                  {['1 tablet', '2 tablets', '3 tablets', '7 tablets', '1 capsule', '5 ml', '10 ml'].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.quickAddPill,
                        dosageName === d && styles.quickAddPillActive,
                      ]}
                      onPress={() => setDosageName(d)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={dosageName === d ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={dosageName === d ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.quickAddPillText,
                          dosageName === d && styles.quickAddPillTextActive,
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Frequency with typing field and add up buttons */}
                <Text style={styles.inputFieldLabel}>Frequency</Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="e.g. 1 daily, 2 daily..."
                  placeholderTextColor="#94A3B8"
                  value={frequency}
                  onChangeText={setFrequency}
                />
                <View style={styles.quickAddPillsRow}>
                  {['1 daily', '2 daily', '3 daily', 'As needed', 'Every 8 hrs'].map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.quickAddPill,
                        frequency === f && styles.quickAddPillActive,
                      ]}
                      onPress={() => setFrequency(f)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={frequency === f ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={frequency === f ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.quickAddPillText,
                          frequency === f && styles.quickAddPillTextActive,
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Duration with typing field and add up buttons */}
                <Text style={styles.inputFieldLabel}>Duration</Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="e.g. 3 days, 5 days, 14 days..."
                  placeholderTextColor="#94A3B8"
                  value={medDuration}
                  onChangeText={setMedDuration}
                />
                <View style={styles.quickAddPillsRow}>
                  {['3 days', '5 days', '7 days', '10 days', '14 days', '30 days'].map((dur) => (
                    <TouchableOpacity
                      key={dur}
                      style={[
                        styles.quickAddPill,
                        medDuration === dur && styles.quickAddPillActive,
                      ]}
                      onPress={() => setMedDuration(dur)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={medDuration === dur ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={medDuration === dur ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.quickAddPillText,
                          medDuration === dur && styles.quickAddPillTextActive,
                        ]}
                      >
                        {dur}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Schedule Timings with pop-up button below */}
                <Text style={styles.inputFieldLabel}>Schedule Timings</Text>
                <View style={styles.timingSummaryCard}>
                  <Text style={styles.timingSummaryTitle}>Daily Schedule & Food Instructions</Text>
                  <Text style={styles.timingSummaryText}>
                    Morn: {morningTiming.tabletOption === 'ON' ? 'ON (' + (morningTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')' : 'OFF'}  |  
                    Aftern: {afternoonTiming.tabletOption === 'ON' ? 'ON (' + (afternoonTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')' : 'OFF'}  |  
                    Night: {nightTiming.tabletOption === 'ON' ? 'ON (' + (nightTiming.foodTiming === 'before' ? 'Before Food' : 'After Food') + ')' : 'OFF'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addTimingScheduleBtn}
                  onPress={() => setIsTimingModalOpen(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="time" size={17} color="#071E42" />
                  <Text style={styles.addTimingScheduleBtnText}>+ Configure Schedule Timings</Text>
                </TouchableOpacity>

                {/* Add to Prescription Button */}
                <TouchableOpacity
                  style={styles.addToPrescriptionMainBtn}
                  onPress={handleAddMedicine}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle" size={19} color="#FFFFFF" />
                  <Text style={styles.addToPrescriptionMainBtnText}>+ Add to Prescription</Text>
                </TouchableOpacity>

                {/* Prescription Requirement Lists */}
                <View style={styles.addedListWrap}>
                  <Text style={styles.addedListHeaderTitle}>
                    Prescription Requirement Lists ({prescribedList.length})
                  </Text>
                  {prescribedList.length === 0 ? (
                    <Text style={styles.emptyListHint}>No medicines added yet.</Text>
                  ) : (
                    prescribedList.map((med) => (
                      <View key={med.id} style={styles.prescribedItemCard}>
                        <View style={styles.prescribedItemTop}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.prescribedItemName}>{med.name}</Text>
                            <Text style={styles.prescribedItemDuration}>
                              Dosage: {med.dosage || '1 tablet'} · Frequency: {med.frequency || '1 daily'} · Duration: {med.duration}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.deleteNoteBtn}
                            onPress={() => handleRemoveMedicine(med.id)}
                          >
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.prescribedScheduleBadge}>
                          <Ionicons name="time-outline" size={13} color="#071E42" />
                          <Text style={styles.prescribedScheduleText}>
                            {med.timingSummary}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            )}

            {/* ----------------------------------------------------
                STEP 3: TESTS (Lab Investigations)
                (tall search, highlighted select, test name, patient prep, lab instructions, add to test required, requirement lists)
            ----------------------------------------------------- */}
            {currentStep === 3 && (
              <View style={styles.stepContentWrap}>
                <View style={styles.sectionHeaderBanner}>
                  <View style={styles.sectionIconWrap}>
                    <Ionicons name="flask" size={18} color="#071E42" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionHeaderTitle}>
                      Tests & Lab Investigations
                    </Text>
                    <Text style={styles.sectionHeaderSub}>
                      Order diagnostic tests with patient preparation & technician guidelines
                    </Text>
                  </View>
                </View>

                {/* Search Tests with Tall Box & Highlighted Select Button */}
                <Text style={styles.inputFieldLabel}>Search Tests</Text>
                <View style={styles.searchDropdownWrap}>
                  <View style={[styles.searchInputRow, styles.searchBoxTall]}>
                    <Ionicons name="search" size={20} color="#071E42" />
                    <TextInput
                      style={[styles.searchInputField, styles.searchInputFieldTall]}
                      placeholder="Search diagnostic test (e.g. CBC, HbA1c, Lipid Profile)..."
                      placeholderTextColor="#94A3B8"
                      value={testSearch}
                      onChangeText={(t) => {
                        setTestSearch(t);
                        setIsTestDropdownOpen(true);
                      }}
                      onFocus={() => setIsTestDropdownOpen(true)}
                    />
                    {testSearch.length > 0 && (
                      <TouchableOpacity onPress={() => setTestSearch('')}>
                        <Ionicons name="close-circle" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {isTestDropdownOpen && (
                    <View style={styles.dropdownListBox}>
                      <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                        {filteredTests.map((t) => (
                          <View key={t} style={styles.dropdownItemRow}>
                            <View style={styles.dropdownItemInfo}>
                              <Ionicons name="flask" size={15} color="#071E42" />
                              <Text style={styles.dropdownItemName}>{t}</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.dropdownHighlightSelectBtn}
                              onPress={() => {
                                setTestName(t);
                                setTestSearch('');
                                setIsTestDropdownOpen(false);
                              }}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.dropdownHighlightSelectBtnText}>Select</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Test Name with typing field and add up buttons */}
                <Text style={styles.inputFieldLabel}>Test Name</Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="Test name (e.g. Complete Blood Count)"
                  placeholderTextColor="#94A3B8"
                  value={testName}
                  onChangeText={setTestName}
                />
                <View style={styles.quickAddPillsRow}>
                  {[
                    'Complete Blood Count (CBC)',
                    'Lipid Profile (Fasting)',
                    'HbA1c',
                    '12-Lead ECG',
                    'Thyroid Profile (TSH)',
                    'Urine Routine',
                  ].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.quickAddPill,
                        testName === t && styles.quickAddPillActive,
                      ]}
                      onPress={() => setTestName(t)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={testName === t ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={testName === t ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.quickAddPillText,
                          testName === t && styles.quickAddPillTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Patient Preparation / Diet Requirement */}
                <Text style={styles.inputFieldLabel}>Patient Preparation / Diet Requirement</Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="e.g. Fasting 10 hrs, drinking only water..."
                  placeholderTextColor="#94A3B8"
                  value={patientPrep}
                  onChangeText={setPatientPrep}
                />
                <View style={styles.quickAddPillsRow}>
                  {[
                    'Fasting 10 hrs',
                    'Drinking only water',
                    'Normal diet',
                    'No special preparation',
                    'Overnight fasting (12 hrs)',
                  ].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.quickAddPill,
                        patientPrep === p && styles.quickAddPillActive,
                      ]}
                      onPress={() => setPatientPrep(p)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={patientPrep === p ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={patientPrep === p ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.quickAddPillText,
                          patientPrep === p && styles.quickAddPillTextActive,
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Clinical Instructions for Lab Technician */}
                <Text style={styles.inputFieldLabel}>Clinical Instructions for Lab Technician</Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="e.g. Routine analysis, urgent report required..."
                  placeholderTextColor="#94A3B8"
                  value={labInstructions}
                  onChangeText={setLabInstructions}
                />
                <View style={styles.quickAddPillsRow}>
                  {[
                    'Routine analysis',
                    'Urgent report required',
                    'Resting baseline check',
                    'Serum level check',
                    'Send digital report',
                  ].map((ins) => (
                    <TouchableOpacity
                      key={ins}
                      style={[
                        styles.quickAddPill,
                        labInstructions === ins && styles.quickAddPillActive,
                      ]}
                      onPress={() => setLabInstructions(ins)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={labInstructions === ins ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={labInstructions === ins ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.quickAddPillText,
                          labInstructions === ins && styles.quickAddPillTextActive,
                        ]}
                      >
                        {ins}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Add to Test Required Button */}
                <TouchableOpacity
                  style={styles.addToPrescriptionMainBtn}
                  onPress={handleAddTest}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle" size={19} color="#FFFFFF" />
                  <Text style={styles.addToPrescriptionMainBtnText}>+ Add to Test Required</Text>
                </TouchableOpacity>

                {/* Test Requirement Lists */}
                <View style={styles.addedListWrap}>
                  <Text style={styles.addedListHeaderTitle}>
                    Test Requirement Lists ({testsList.length})
                  </Text>
                  {testsList.length === 0 ? (
                    <Text style={styles.emptyListHint}>No lab tests ordered yet.</Text>
                  ) : (
                    testsList.map((test) => (
                      <View key={test.id} style={styles.prescribedItemCard}>
                        <View style={styles.prescribedItemTop}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.prescribedItemName}>{test.name}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.deleteNoteBtn}
                            onPress={() => handleRemoveTest(test.id)}
                          >
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.testDetailRow}>
                          <Ionicons name="restaurant-outline" size={13} color="#D97706" />
                          <Text style={styles.testDetailText}>
                            Prep: {test.patientPrep}
                          </Text>
                        </View>
                        <View style={styles.testDetailRow}>
                          <Ionicons name="information-circle-outline" size={13} color="#00B894" />
                          <Text style={styles.testDetailText}>
                            Lab Note: {test.instructions}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            )}

            {/* ----------------------------------------------------
                STEP 4: DATE SCHEDULE (DATE FIXING)
                (mode selection, calendar pop-up, time slot, overview)
            ----------------------------------------------------- */}
            {currentStep === 4 && (
              <View style={styles.stepContentWrap}>
                <View style={styles.sectionHeaderBanner}>
                  <View style={styles.sectionIconWrap}>
                    <Ionicons name="calendar" size={18} color="#071E42" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionHeaderTitle}>
                      Schedule & Consultation Summary
                    </Text>
                    <Text style={styles.sectionHeaderSub}>
                      Set follow-up requirements and review full consultation plan
                    </Text>
                  </View>
                </View>

                {/* Follow-up Required: Yes or No */}
                <Text style={styles.inputFieldLabel}>Follow-up Required?</Text>
                <View style={styles.yesNoToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.yesNoToggleBtn,
                      followUpRequired === 'yes' && styles.yesToggleBtnActive,
                    ]}
                    onPress={() => setFollowUpRequired('yes')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={followUpRequired === 'yes' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={18}
                      color={followUpRequired === 'yes' ? '#FFFFFF' : '#071E42'}
                    />
                    <Text
                      style={[
                        styles.yesNoToggleText,
                        followUpRequired === 'yes' && styles.yesNoToggleTextActive,
                      ]}
                    >
                      Yes, Required
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.yesNoToggleBtn,
                      followUpRequired === 'no' && styles.noToggleBtnActive,
                    ]}
                    onPress={() => setFollowUpRequired('no')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={followUpRequired === 'no' ? 'close-circle' : 'close-circle-outline'}
                      size={18}
                      color={followUpRequired === 'no' ? '#FFFFFF' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.yesNoToggleText,
                        followUpRequired === 'no' && styles.yesNoToggleTextActive,
                      ]}
                    >
                      No, Not Required
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* IF YES: Show Follow-up Mode & Calendar & Time Slot */}
                {followUpRequired === 'yes' ? (
                  <>
                    {/* Follow-up / Video consultation toggle */}
                    <Text style={styles.inputFieldLabel}>Follow-up Consultation Mode</Text>
                    <View style={styles.modeToggleRow}>
                      <TouchableOpacity
                        style={[
                          styles.modeToggleBtn,
                          consultMode === 'In-Person' && styles.modeToggleBtnActive,
                        ]}
                        onPress={() => setConsultMode('In-Person')}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="business"
                          size={16}
                          color={consultMode === 'In-Person' ? '#FFFFFF' : '#071E42'}
                        />
                        <Text
                          style={[
                            styles.modeToggleText,
                            consultMode === 'In-Person' && styles.modeToggleTextActive,
                          ]}
                        >
                          In-Person Follow-up
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.modeToggleBtn,
                          consultMode === 'Video' && styles.modeToggleBtnActive,
                        ]}
                        onPress={() => setConsultMode('Video')}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="videocam"
                          size={16}
                          color={consultMode === 'Video' ? '#FFFFFF' : '#071E42'}
                        />
                        <Text
                          style={[
                            styles.modeToggleText,
                            consultMode === 'Video' && styles.modeToggleTextActive,
                          ]}
                        >
                          Video Consultation
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Date Schedule Button (Clicks pop up the Calendar) */}
                    <Text style={styles.inputFieldLabel}>Target Follow-up Date</Text>
                    <TouchableOpacity
                      style={styles.calendarTriggerBtn}
                      onPress={() => setIsCalendarOpen(true)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.calTriggerLeft}>
                        <View style={styles.calIconBadge}>
                          <Ionicons name="calendar" size={18} color="#071E42" />
                        </View>
                        <View>
                          <Text style={styles.calTriggerTitle}>{selectedDate}</Text>
                          <Text style={styles.calTriggerSub}>
                            Tap calendar button to change date
                          </Text>
                        </View>
                      </View>
                      <View style={styles.calTriggerPill}>
                        <Ionicons name="calendar-outline" size={14} color="#071E42" />
                        <Text style={styles.calTriggerPillText}>Open Calendar</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Time Slot Chips */}
                    <Text style={styles.inputFieldLabel}>Preferred Time Slot</Text>
                    <View style={styles.timeSlotsRow}>
                      {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'].map((s) => (
                        <TouchableOpacity
                          key={s}
                          style={[
                            styles.timeSlotPill,
                            selectedSlot === s && styles.timeSlotPillActive,
                          ]}
                          onPress={() => setSelectedSlot(s)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.timeSlotPillText,
                              selectedSlot === s && styles.timeSlotPillTextActive,
                            ]}
                          >
                            {s}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : (
                  <View style={styles.noFollowUpNoticeBox}>
                    <Ionicons name="information-circle-outline" size={18} color="#64748B" />
                    <Text style={styles.noFollowUpNoticeText}>
                      No follow-up visit scheduled. Patient will take medications and complete test requirements as prescribed.
                    </Text>
                  </View>
                )}

                {/* DETAILS DOWN OF:
                    - Consultation notes
                    - Prescribe medicine
                    - Test requirements
                    - Follow-up --> Date fixed
                */}
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
              (continue button, skip button, and back button)
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

                {/* Weekday headers */}
                <View style={styles.calWeekHeaderRow}>
                  {WEEK_DAYS.map((w) => (
                    <Text key={w} style={styles.calWeekDayText}>
                      {w}
                    </Text>
                  ))}
                </View>

                {/* Days Grid */}
                <View style={styles.calDaysGrid}>
                  {calendarDays.map((d, index) => {
                    if (d === null) {
                      return <View key={`blank-${index}`} style={styles.calDayCell} />;
                    }
                    const isSelected = calDay === d;
                    return (
                      <TouchableOpacity
                        key={`day-${d}`}
                        style={[
                          styles.calDayCell,
                          isSelected && styles.calDayCellSelected,
                        ]}
                        onPress={() => handleSelectDay(d)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.calDayText,
                            isSelected && styles.calDayTextSelected,
                          ]}
                        >
                          {d}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Quick Selection Chips */}
                <View style={styles.calQuickSelectRow}>
                  {[
                    { label: 'In 3 Days', days: 3 },
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
              SUB-MODAL 3: STEP 5 CONFIRMATION POP-UP (NOTES DOWN OK)
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
                  Consultation notes, e-Prescription, and diagnostic test requirements have been sent successfully to {patientName}'s MediUnify app.
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

                {/* SINGLE OK BUTTON (SPECIFIED BY USER: "pop -up notes down ok") */}
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
    width: '100%',
    height: '92%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  dragHandleContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  dragHandle: {
    width: 48,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },

  /* HEADER (WHITE THEME WITH CURVED TOP EDGES) */
  sheetHeaderNavy: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitleWrap: {
    flex: 1,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    marginBottom: 6,
  },
  modeBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: 0.3,
  },
  patientTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.4,
  },
  patientMetaText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  headerCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* STEP PROGRESS INDICATOR ROW */
  stepProgressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 14,
  },
  stepNode: {
    alignItems: 'center',
    width: 58,
  },
  stepNodeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNodeCircleActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  stepNodeCirclePast: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  stepNodeNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  stepNodeNumberActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stepNodeNumberPast: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stepNodeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  stepNodeLabelActive: {
    color: '#081E3E',
    fontWeight: '800',
  },
  stepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginTop: 13.5,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#081E3E',
  },

  /* SCROLLABLE BODY */
  sheetScrollBody: {
    flex: 1,
  },
  sheetScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  stepContentWrap: {},

  sectionHeaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EEF4FC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#071E42',
  },
  sectionHeaderSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },

  /* INPUT LABELS & BOXES */
  inputFieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
    marginTop: 10,
    marginBottom: 5,
  },
  textInputBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#071E42',
    marginBottom: 6,
  },
  textAreaBox: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  /* ADD UP BUTTON DIRECTLY BELOW TYPING FIELD */
  addNoteUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#071E42',
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 14,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addNoteUpBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  /* ADDED LISTS (NOTES, PRESCRIPTIONS, TESTS) */
  addedListWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  addedListHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#071E42',
    marginBottom: 8,
  },
  emptyListHint: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  addedNoteItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 6,
    gap: 8,
  },
  noteBulletIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedNoteItemText: {
    flex: 1,
    fontSize: 12.5,
    color: '#1E293B',
    lineHeight: 17,
  },
  deleteNoteBtn: {
    padding: 4,
  },

  /* SEARCH & DROPDOWN */
  searchDropdownWrap: {
    position: 'relative',
    zIndex: 20,
    marginBottom: 6,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchInputField: {
    flex: 1,
    fontSize: 13,
    color: '#071E42',
    padding: 0,
  },
  dropdownListBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#071E42',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#071E42',
  },

  /* DURATION CHIPS */
  durationPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  durationPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  durationPillActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  durationPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  durationPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* DOSAGE PILLS */
  dosagePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  dosageQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dosageQuickBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  dosageQuickBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#071E42',
  },
  dosageQuickBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* TEST SEARCH INPUT ROW (INCREASED HEIGHT) */
  testSearchInputRow: {
    minHeight: 52,
    paddingVertical: 10,
    borderColor: '#071E42',
    borderWidth: 1.3,
  },
  testSearchInputField: {
    fontSize: 13.5,
  },

  /* TEST DROPDOWN ITEM ROW & HIGHLIGHTED SELECT BUTTON */
  testDropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  testDropdownNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 6,
  },
  testDropdownNameText: {
    fontSize: 13,
    color: '#071E42',
    fontWeight: '600',
  },
  testSelectHighlightBtn: {
    backgroundColor: '#00B894',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  testSelectHighlightBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* SELECTED TEST REFLECTION CARD */
  selectedTestReflectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6FAF5',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  selectedTestReflectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedTestReflectLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#00897B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  selectedTestReflectValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#071E42',
    marginTop: 1,
  },
  selectedTestRemoveBtn: {
    padding: 4,
  },
  testNamePlaceholderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 6,
  },
  testNamePlaceholderText: {
    fontSize: 12.5,
    color: '#94A3B8',
    fontStyle: 'italic',
  },

  /* DAILY TABLET SCHEDULE & FOOD TIMING BUTTON */
  timingTriggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF4FC',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#071E42',
    padding: 12,
    marginBottom: 6,
  },
  timingTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  timingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timingTriggerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#071E42',
  },
  timingTriggerSummary: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  timingConfigBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timingConfigBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#071E42',
  },

  /* ADD ITEM BUTTON */
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 10,
  },
  addItemBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* PRESCRIBED / TEST ITEM CARD */
  prescribedItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  prescribedItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prescribedItemName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#071E42',
  },
  prescribedItemDuration: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  prescribedScheduleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  prescribedScheduleText: {
    fontSize: 11,
    color: '#071E42',
    fontWeight: '600',
  },
  prescribedNoteText: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 4,
    fontStyle: 'italic',
  },

  /* TEST INSTRUCTION CHIPS */
  quickAddLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4,
    marginBottom: 6,
  },
  presetButtonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  presetInstructionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  presetInstructionBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  presetInstructionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#071E42',
  },
  presetInstructionBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  testInstructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  testInstructionText: {
    fontSize: 11.5,
    color: '#00897B',
    fontWeight: '600',
  },

  /* MODE SELECTOR (STEP 4) */
  modeToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  modeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  modeToggleBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  modeToggleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },

  /* CALENDAR TRIGGER BUTTON */
  calendarTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF4FC',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#071E42',
    padding: 12,
    marginBottom: 8,
  },
  calTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calTriggerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#071E42',
  },
  calTriggerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  calTriggerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  calTriggerPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#071E42',
  },

  /* TIME SLOTS */
  timeSlotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  timeSlotPill: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timeSlotPillActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  timeSlotPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  timeSlotPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* SUMMARY OVERVIEW CARD */
  summaryReviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: 6,
    gap: 6,
  },
  summaryReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  summaryReviewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#071E42',
  },
  summaryReviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  summaryReviewLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryReviewVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },

  /* ======================================================
     STATIC BUTTONS DOWN (FIXED AT BOTTOM OF BOTTOM SHEET)
  ====================================================== */
  staticBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  staticBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  staticBackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  staticSkipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#071E42',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  staticPrimaryBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  /* SUB-MODAL OVERLAYS & CARDS */
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 15, 35, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  /* TIMING SUB-MODAL (MATCHING REFERENCE IMAGE) */
  timingCardModal: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  timingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  timingCardHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#071E42',
  },
  timingBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  timingBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timingBlockTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#071E42',
  },
  timingStatusBadge: {
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timingStatusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#00897B',
  },
  timingControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  toggleBtnActiveNavy: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  toggleBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  timingSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#071E42',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  timingSaveBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* CALENDAR SUB-MODAL */
  calendarCardModal: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  calendarCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarCardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#071E42',
  },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calWeekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calWeekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  calDayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  calDayCellSelected: {
    backgroundColor: '#071E42',
  },
  calDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  calQuickSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  calQuickSelectChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#EEF4FC',
  },
  calQuickSelectText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
  },

  /* SUCCESS CONFIRMATION MODAL (STEP 5: NOTES DOWN OK) */
  successCardModal: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#071E42',
    textAlign: 'center',
  },
  successModalSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  successSummaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 14,
    gap: 6,
  },
  successSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  successSummaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  successSummaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },
  successOkBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successOkBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* STEP 1: SINGLE CONSULT NOTES */
  singleConsultNotesBox: {
    minHeight: 180,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 14,
    fontSize: 14,
    color: '#071E42',
    lineHeight: 22,
    marginBottom: 16,
  },

  /* STEP 2 & 3: TALL SEARCH & HIGHLIGHT SELECT */
  searchBoxTall: {
    minHeight: 52,
    height: 52,
    paddingHorizontal: 14,
  },
  searchInputFieldTall: {
    fontSize: 14,
    height: 52,
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  dropdownItemName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#071E42',
  },
  dropdownHighlightSelectBtn: {
    backgroundColor: '#00B894',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdownHighlightSelectBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  /* QUICK ADD-UP PILLS */
  quickAddPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  quickAddPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickAddPillActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  quickAddPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#071E42',
  },
  quickAddPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* TIMING SCHEDULE SUMMARY & TRIGGER */
  timingSummaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  timingSummaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  timingSummaryText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#071E42',
    lineHeight: 18,
  },
  addTimingScheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#EEF4FC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 16,
  },
  addTimingScheduleBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#071E42',
  },

  /* ADD BUTTONS FOR PRESCRIPTION & TESTS */
  addToPrescriptionMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#071E42',
    marginTop: 6,
    marginBottom: 16,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  addToPrescriptionMainBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  testDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  testDetailText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },

  /* STEP 4: YES / NO TOGGLE & DETAILS REVIEW */
  yesNoToggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  yesNoToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  yesToggleBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  noToggleBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  yesNoToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  yesNoToggleTextActive: {
    color: '#FFFFFF',
  },
  noFollowUpNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  noFollowUpNoticeText: {
    fontSize: 12.5,
    color: '#64748B',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  detailsReviewMasterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  detailsReviewSection: {
    paddingVertical: 4,
  },
  detailsReviewSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 6,
  },
  detailsReviewSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#071E42',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailsReviewNotesText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    paddingLeft: 4,
  },
  detailsReviewDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  detailsReviewItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 5,
    paddingLeft: 4,
  },
  detailsReviewBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#071E42',
    marginTop: 6,
  },
  detailsReviewItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailsReviewItemSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  detailsReviewEmptyText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#94A3B8',
    paddingLeft: 4,
  },
  detailsReviewFollowUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  detailsReviewFollowUpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
});
