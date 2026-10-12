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

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function FollowUpWizardModal({
  visible,
  onClose,
  patient,
  onComplete,
}) {
  // Wizard active step: 1 = Consult Notes, 2 = Prescribe, 3 = Testing, 4 = Date Schedule
  const [step, setStep] = useState(1);

  // STEP 1: Consult Notes State
  const [complaint, setComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [consultNotes, setConsultNotes] = useState('');

  // STEP 2: Prescribe State
  const [medSearch, setMedSearch] = useState('');
  const [isMedDropdownOpen, setIsMedDropdownOpen] = useState(false);
  const [medDuration, setMedDuration] = useState('5 Days');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isTimingModalOpen, setIsTimingModalOpen] = useState(false);

  // Daily Tablet Schedule & Food Timing State (Matching User's Image)
  const [morningTiming, setMorningTiming] = useState({
    tabletOption: 'ON', // 'ON' | 'OFF'
    foodTiming: 'after', // 'before' | 'after'
  });
  const [afternoonTiming, setAfternoonTiming] = useState({
    tabletOption: 'OFF',
    foodTiming: 'after',
  });
  const [nightTiming, setNightTiming] = useState({
    tabletOption: 'ON',
    foodTiming: 'after',
  });

  const [prescribedList, setPrescribedList] = useState([]);

  // STEP 3: Testing State
  const [testSearch, setTestSearch] = useState('');
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [testInstructions, setTestInstructions] = useState('');
  const [testsList, setTestsList] = useState([]);

  // STEP 4: Date Schedule State
  const [consultMode, setConsultMode] = useState('In-Person'); // 'In-Person' | 'Video'
  const [selectedDate, setSelectedDate] = useState('17 Oct 2026');
  const [timeShift, setTimeShift] = useState('10:00 AM');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(9); // October
  const [calDay, setCalDay] = useState(17);

  // FINAL SUBMISSION SUCCESS MODAL STATE
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Filtered lists
  const filteredMedicines = useMemo(() => {
    if (!medSearch.trim()) return MEDICINES_LIST.slice(0, 8);
    const q = medSearch.toLowerCase();
    return MEDICINES_LIST.filter((m) => m.toLowerCase().includes(q));
  }, [medSearch]);

  const filteredTests = useMemo(() => {
    if (!testSearch.trim()) return TESTS_LIST.slice(0, 8);
    const q = testSearch.toLowerCase();
    return TESTS_LIST.filter((t) => t.toLowerCase().includes(q));
  }, [testSearch]);

  // Calendar days grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [calYear, calMonth]);

  // Reset wizard on open
  const resetWizard = () => {
    setStep(1);
    setComplaint('');
    setSymptoms('');
    setDiagnosis('');
    setConsultNotes('');
    setMedSearch('');
    setIsMedDropdownOpen(false);
    setMedDuration('5 Days');
    setSpecialInstructions('');
    setIsTimingModalOpen(false);
    setMorningTiming({ tabletOption: 'ON', foodTiming: 'after' });
    setAfternoonTiming({ tabletOption: 'OFF', foodTiming: 'after' });
    setNightTiming({ tabletOption: 'ON', foodTiming: 'after' });
    setPrescribedList([]);
    setTestSearch('');
    setIsTestDropdownOpen(false);
    setTestInstructions('');
    setTestsList([]);
    setConsultMode('In-Person');
    setSelectedDate('17 Oct 2026');
    setTimeShift('10:00 AM');
    setIsCalendarOpen(false);
    setIsSuccessModalOpen(false);
  };

  // Handle adding a medicine
  const handleAddMedicine = () => {
    if (!medSearch.trim()) {
      Alert.alert('Medicine Required', 'Please enter or select a medicine name.');
      return;
    }
    const newMed = {
      id: Date.now().toString(),
      name: medSearch.trim(),
      duration: medDuration,
      instructions: specialInstructions.trim(),
      schedule: {
        morning: morningTiming,
        afternoon: afternoonTiming,
        night: nightTiming,
      },
    };
    setPrescribedList((prev) => [...prev, newMed]);
    setMedSearch('');
    setSpecialInstructions('');
    setIsMedDropdownOpen(false);
  };

  const handleRemoveMedicine = (id) => {
    setPrescribedList((prev) => prev.filter((m) => m.id !== id));
  };

  // Handle adding preset instruction
  const handleToggleInstruction = (text) => {
    if (testInstructions.includes(text)) {
      setTestInstructions((prev) =>
        prev
          .replace(text, '')
          .replace(/,\s*,/g, ',')
          .trim()
      );
    } else {
      setTestInstructions((prev) =>
        prev.trim() ? `${prev.trim()}, ${text}` : text
      );
    }
  };

  // Handle adding a test
  const handleAddTest = () => {
    if (!testSearch.trim()) {
      Alert.alert('Test Required', 'Please enter or select a lab test name.');
      return;
    }
    const newTest = {
      id: Date.now().toString(),
      name: testSearch.trim(),
      instructions: testInstructions.trim(),
    };
    setTestsList((prev) => [...prev, newTest]);
    setTestSearch('');
    setTestInstructions('');
    setIsTestDropdownOpen(false);
  };

  const handleRemoveTest = (id) => {
    setTestsList((prev) => prev.filter((t) => t.id !== id));
  };

  // Quick calendar helpers
  const handleQuickAddDays = (days) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    setCalYear(target.getFullYear());
    setCalMonth(target.getMonth());
    setCalDay(target.getDate());
    const formatted = `${target.getDate()} ${MONTHS_SHORT[target.getMonth()]} ${target.getFullYear()}`;
    setSelectedDate(formatted);
    setIsCalendarOpen(false);
  };

  const handleSelectDay = (d) => {
    if (!d) return;
    setCalDay(d);
    const formatted = `${d} ${MONTHS_SHORT[calMonth]} ${calYear}`;
    setSelectedDate(formatted);
    setIsCalendarOpen(false);
  };

  // Submit complete follow-up
  const handleSubmitPlan = () => {
    // Show notes down OK popup
    setIsSuccessModalOpen(true);
  };

  const handleFinalOk = () => {
    setIsSuccessModalOpen(false);
    resetWizard();
    if (onComplete) {
      onComplete({
        patient: patient?.name,
        diagnosis,
        notes: consultNotes,
        prescriptions: prescribedList,
        tests: testsList,
        followUpDate: selectedDate,
        followUpMode: consultMode,
      });
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (isTimingModalOpen) {
          setIsTimingModalOpen(false);
        } else if (isCalendarOpen) {
          setIsCalendarOpen(false);
        } else if (isSuccessModalOpen) {
          setIsSuccessModalOpen(false);
        } else {
          onClose();
        }
      }}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.wizardContainer}>
          {/* ====================================================
              NAVY BLUE WIZARD HEADER
          ==================================================== */}
          <View style={styles.wizardHeader}>
            <View style={styles.wizardHeaderTopRow}>
              <View style={styles.wizardTitleWrap}>
                <Text style={styles.wizardHeaderTitle}>Follow-up Treatment Plan</Text>
                <Text style={styles.wizardHeaderSubtitle}>
                  Patient: {patient?.name || 'Patient'} · Step {step} of 4
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* STEP PROGRESS BAR (1 ---> 2 ---> 3 ---> 4) */}
            <View style={styles.stepIndicatorRow}>
              {[
                { num: 1, label: 'Consult' },
                { num: 2, label: 'Prescribe' },
                { num: 3, label: 'Testing' },
                { num: 4, label: 'Schedule' },
              ].map((s, idx) => {
                const isActive = step === s.num;
                const isPast = step > s.num;
                return (
                  <React.Fragment key={s.num}>
                    <TouchableOpacity
                      style={[
                        styles.stepNode,
                        isActive && styles.stepNodeActive,
                        isPast && styles.stepNodePast,
                      ]}
                      onPress={() => setStep(s.num)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.stepNodeText,
                          (isActive || isPast) && styles.stepNodeTextActive,
                        ]}
                      >
                        {isPast ? '✓' : s.num}
                      </Text>
                      <Text
                        style={[
                          styles.stepNodeLabel,
                          isActive && styles.stepNodeLabelActive,
                        ]}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                    {idx < 3 && (
                      <View
                        style={[
                          styles.stepLine,
                          step > idx + 1 && styles.stepLineActive,
                        ]}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </View>

          {/* ====================================================
              STEP CONTENT BODY
          ==================================================== */}
          <ScrollView
            style={styles.wizardScrollBody}
            contentContainerStyle={styles.wizardScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ==================================================
                STEP 1: CONSULT NOTES
            =================================================== */}
            {step === 1 && (
              <View style={styles.stepSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.stepIconWrap}>
                    <Ionicons name="document-text-outline" size={18} color="#071E42" />
                  </View>
                  <View>
                    <Text style={styles.sectionHeaderTitle}>Step 1: Consultation Notes</Text>
                    <Text style={styles.sectionHeaderSub}>
                      Record symptoms, clinical findings and diagnosis
                    </Text>
                  </View>
                </View>

                {/* Chief Complaint */}
                <Text style={styles.inputLabel}>Chief Complaint / Reason for Follow-up</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Fever, persistent dry cough, body fatigue for 4 days"
                  placeholderTextColor="#94A3B8"
                  value={complaint}
                  onChangeText={setComplaint}
                />

                {/* Symptoms Observed */}
                <Text style={styles.inputLabel}>Symptoms Observed</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Temperature 101°F, throat redness, congestion"
                  placeholderTextColor="#94A3B8"
                  value={symptoms}
                  onChangeText={setSymptoms}
                />

                {/* Clinical Diagnosis */}
                <Text style={styles.inputLabel}>Clinical Diagnosis</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Acute Upper Respiratory Tract Infection (URTI)"
                  placeholderTextColor="#94A3B8"
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                />

                {/* Consult Notes / Treatment Plan Advice */}
                <Text style={styles.inputLabel}>Clinical Notes & Advice</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  placeholder="Advised plenty of hydration, warm saline gargle, bed rest, and to report if temperature exceeds 102°F..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={consultNotes}
                  onChangeText={setConsultNotes}
                />

                {/* NAVIGATION BUTTONS */}
                <View style={styles.navButtonsRow}>
                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={onClose}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnSecondaryText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnSkip}
                    onPress={() => setStep(2)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnSkipText}>Skip</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => setStep(2)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnPrimaryText}>Continue to Prescribe</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ==================================================
                STEP 2: PRESCRIBE
            =================================================== */}
            {step === 2 && (
              <View style={styles.stepSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.stepIconWrap}>
                    <Ionicons name="medkit-outline" size={18} color="#071E42" />
                  </View>
                  <View>
                    <Text style={styles.sectionHeaderTitle}>Step 2: Prescribe Medication</Text>
                    <Text style={styles.sectionHeaderSub}>
                      Add medicine name, duration, and food timing schedule
                    </Text>
                  </View>
                </View>

                {/* Medicine Name with Search & Dropdown */}
                <Text style={styles.inputLabel}>Medicine Name</Text>
                <View style={styles.searchDropdownWrap}>
                  <View style={styles.searchInputBox}>
                    <Ionicons name="search-outline" size={17} color="#071E42" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search or enter medicine (e.g. Paracetamol 500mg)"
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
                        <Ionicons name="close-circle" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Dropdown list */}
                  {isMedDropdownOpen && (
                    <View style={styles.dropdownBox}>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                        {filteredMedicines.map((m) => (
                          <TouchableOpacity
                            key={m}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setMedSearch(m);
                              setIsMedDropdownOpen(false);
                            }}
                          >
                            <Ionicons name="medical" size={14} color="#071E42" />
                            <Text style={styles.dropdownItemText}>{m}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Duration */}
                <Text style={styles.inputLabel}>Duration</Text>
                <View style={styles.durationChipsRow}>
                  {['3 Days', '5 Days', '7 Days', '10 Days', '15 Days', '1 Month'].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.durationChip,
                        medDuration === d && styles.durationChipActive,
                      ]}
                      onPress={() => setMedDuration(d)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.durationChipText,
                          medDuration === d && styles.durationChipTextActive,
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Daily Tablet Schedule & Food Timing Button (Matching Image) */}
                <Text style={styles.inputLabel}>Daily Tablet Schedule & Food Timing</Text>
                <TouchableOpacity
                  style={styles.timingTriggerBtn}
                  onPress={() => setIsTimingModalOpen(true)}
                  activeOpacity={0.85}
                >
                  <View style={styles.timingTriggerLeft}>
                    <View style={styles.timingIconWrap}>
                      <Ionicons name="time" size={18} color="#071E42" />
                    </View>
                    <View>
                      <Text style={styles.timingTriggerTitle}>
                        Tablet Schedule & Food Timing
                      </Text>
                      <Text style={styles.timingTriggerSubtitle}>
                        M: {morningTiming.tabletOption === 'ON' ? 'ON (' + morningTiming.foodTiming + ')' : 'OFF'} ·
                        A: {afternoonTiming.tabletOption === 'ON' ? 'ON (' + afternoonTiming.foodTiming + ')' : 'OFF'} ·
                        N: {nightTiming.tabletOption === 'ON' ? 'ON (' + nightTiming.foodTiming + ')' : 'OFF'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.timingBadgePill}>
                    <Text style={styles.timingBadgeText}>Configure</Text>
                    <Ionicons name="chevron-forward" size={14} color="#071E42" />
                  </View>
                </TouchableOpacity>

                {/* Special Instructions (Optional) */}
                <Text style={styles.inputLabel}>Special Instructions (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Drink plenty of water. Do not consume on empty stomach."
                  placeholderTextColor="#94A3B8"
                  value={specialInstructions}
                  onChangeText={setSpecialInstructions}
                />

                {/* Add to Prescription List button */}
                <TouchableOpacity
                  style={styles.addMedicineBtn}
                  onPress={handleAddMedicine}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.addMedicineBtnText}>Add Medicine to Prescription</Text>
                </TouchableOpacity>

                {/* Currently Prescribed List */}
                {prescribedList.length > 0 && (
                  <View style={styles.prescribedListWrap}>
                    <Text style={styles.prescribedListHeader}>
                      Prescribed Medicines ({prescribedList.length})
                    </Text>
                    {prescribedList.map((item, idx) => (
                      <View key={item.id} style={styles.prescribedCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.prescribedName}>
                            {idx + 1}. {item.name}
                          </Text>
                          <Text style={styles.prescribedSub}>
                            Duration: {item.duration} · M: {item.schedule.morning.tabletOption} | A: {item.schedule.afternoon.tabletOption} | N: {item.schedule.night.tabletOption}
                          </Text>
                          {!!item.instructions && (
                            <Text style={styles.prescribedInst}>Note: {item.instructions}</Text>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveMedicine(item.id)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* NAVIGATION BUTTONS */}
                <View style={styles.navButtonsRow}>
                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => setStep(1)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="arrow-back" size={15} color="#475569" />
                    <Text style={styles.btnSecondaryText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnSkip}
                    onPress={() => setStep(3)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnSkipText}>Skip</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => setStep(3)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnPrimaryText}>Continue to Testing</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ==================================================
                STEP 3: TESTING
            =================================================== */}
            {step === 3 && (
              <View style={styles.stepSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.stepIconWrap}>
                    <Ionicons name="flask-outline" size={18} color="#071E42" />
                  </View>
                  <View>
                    <Text style={styles.sectionHeaderTitle}>Step 3: Lab Tests & Diagnostics</Text>
                    <Text style={styles.sectionHeaderSub}>
                      Select required diagnostic tests and patient preparation instructions
                    </Text>
                  </View>
                </View>

                {/* Test Name with search & dropdown */}
                <Text style={styles.inputLabel}>Test Name</Text>
                <View style={styles.searchDropdownWrap}>
                  <View style={styles.searchInputBox}>
                    <Ionicons name="search-outline" size={17} color="#071E42" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search or enter lab test (e.g. Complete Blood Count)"
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
                        <Ionicons name="close-circle" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Dropdown list */}
                  {isTestDropdownOpen && (
                    <View style={styles.dropdownBox}>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                        {filteredTests.map((t) => (
                          <TouchableOpacity
                            key={t}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setTestSearch(t);
                              setIsTestDropdownOpen(false);
                            }}
                          >
                            <Ionicons name="flask" size={14} color="#071E42" />
                            <Text style={styles.dropdownItemText}>{t}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Notes & Patient Instructions */}
                <Text style={styles.inputLabel}>Notes & Patient Instructions</Text>
                <TextInput
                  style={[styles.textInput, { minHeight: 65, textAlignVertical: 'top' }]}
                  placeholder="Instructions for patient prior to test..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={2}
                  value={testInstructions}
                  onChangeText={setTestInstructions}
                />

                {/* Adding Preset Buttons (Specifically Requested by User) */}
                <Text style={[styles.inputLabel, { marginTop: 8 }]}>Quick-Add Instructions:</Text>
                <View style={styles.presetButtonsWrap}>
                  {PRESET_INSTRUCTIONS.map((preset) => {
                    const isAdded = testInstructions.includes(preset);
                    return (
                      <TouchableOpacity
                        key={preset}
                        style={[
                          styles.presetChipBtn,
                          isAdded && styles.presetChipBtnActive,
                        ]}
                        onPress={() => handleToggleInstruction(preset)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={isAdded ? 'checkmark-circle' : 'add-circle-outline'}
                          size={15}
                          color={isAdded ? '#FFFFFF' : '#071E42'}
                        />
                        <Text
                          style={[
                            styles.presetChipText,
                            isAdded && styles.presetChipTextActive,
                          ]}
                        >
                          {preset}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Add Test Button */}
                <TouchableOpacity
                  style={styles.addMedicineBtn}
                  onPress={handleAddTest}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.addMedicineBtnText}>Add Test to Order</Text>
                </TouchableOpacity>

                {/* Added Tests List */}
                {testsList.length > 0 && (
                  <View style={styles.prescribedListWrap}>
                    <Text style={styles.prescribedListHeader}>
                      Requested Lab Tests ({testsList.length})
                    </Text>
                    {testsList.map((item, idx) => (
                      <View key={item.id} style={styles.prescribedCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.prescribedName}>
                            {idx + 1}. {item.name}
                          </Text>
                          {!!item.instructions && (
                            <Text style={styles.prescribedInst}>
                              Instructions: {item.instructions}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveTest(item.id)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* NAVIGATION BUTTONS */}
                <View style={styles.navButtonsRow}>
                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => setStep(2)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="arrow-back" size={15} color="#475569" />
                    <Text style={styles.btnSecondaryText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnSkip}
                    onPress={() => setStep(4)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnSkipText}>Skip</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => setStep(4)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnPrimaryText}>Continue to Schedule</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ==================================================
                STEP 4: DATE SCHEDULE & SUBMIT
            =================================================== */}
            {step === 4 && (
              <View style={styles.stepSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.stepIconWrap}>
                    <Ionicons name="calendar-outline" size={18} color="#071E42" />
                  </View>
                  <View>
                    <Text style={styles.sectionHeaderTitle}>Step 4: Schedule Follow-up Date</Text>
                    <Text style={styles.sectionHeaderSub}>
                      Set follow-up appointment date, mode and time slot
                    </Text>
                  </View>
                </View>

                {/* Consultation Mode */}
                <Text style={styles.inputLabel}>Consultation Mode</Text>
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
                      size={18}
                      color={consultMode === 'In-Person' ? '#FFFFFF' : '#071E42'}
                    />
                    <Text
                      style={[
                        styles.modeToggleText,
                        consultMode === 'In-Person' && styles.modeToggleTextActive,
                      ]}
                    >
                      In-Person Clinic Visit
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
                      size={18}
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

                {/* Follow-up Date Selector Button (Clicks to open Calendar) */}
                <Text style={styles.inputLabel}>Follow-up Appointment Date</Text>
                <TouchableOpacity
                  style={styles.datePickerBtn}
                  onPress={() => setIsCalendarOpen(true)}
                  activeOpacity={0.85}
                >
                  <View style={styles.datePickerLeft}>
                    <View style={styles.dateIconWrap}>
                      <Ionicons name="calendar" size={19} color="#071E42" />
                    </View>
                    <View>
                      <Text style={styles.datePickerTitle}>{selectedDate}</Text>
                      <Text style={styles.datePickerSub}>Click to open calendar picker</Text>
                    </View>
                  </View>
                  <View style={styles.dateChangeBadge}>
                    <Text style={styles.dateChangeText}>Change</Text>
                    <Ionicons name="chevron-forward" size={14} color="#071E42" />
                  </View>
                </TouchableOpacity>

                {/* Preferred Shift / Time Slot */}
                <Text style={styles.inputLabel}>Time Slot</Text>
                <View style={styles.durationChipsRow}>
                  {['10:00 AM', '11:30 AM', '02:30 PM', '04:30 PM', '06:00 PM'].map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.durationChip,
                        timeShift === slot && styles.durationChipActive,
                      ]}
                      onPress={() => setTimeShift(slot)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.durationChipText,
                          timeShift === slot && styles.durationChipTextActive,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Summary Card Before Submit */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryCardTitle}>Follow-up Plan Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Patient:</Text>
                    <Text style={styles.summaryVal}>{patient?.name || 'Patient'}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Diagnosis:</Text>
                    <Text style={styles.summaryVal}>{diagnosis || 'Follow-up Consultation'}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Prescriptions:</Text>
                    <Text style={styles.summaryVal}>
                      {prescribedList.length > 0 ? `${prescribedList.length} medicine(s)` : 'None'}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Lab Tests:</Text>
                    <Text style={styles.summaryVal}>
                      {testsList.length > 0 ? `${testsList.length} test(s)` : 'None'}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Scheduled Date:</Text>
                    <Text style={[styles.summaryVal, { color: '#071E42', fontWeight: '800' }]}>
                      {selectedDate} ({consultMode}) · {timeShift}
                    </Text>
                  </View>
                </View>

                {/* NAVIGATION & SUBMIT BUTTONS */}
                <View style={styles.navButtonsRow}>
                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => setStep(3)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="arrow-back" size={15} color="#475569" />
                    <Text style={styles.btnSecondaryText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnPrimary, { flex: 2 }]}
                    onPress={handleSubmitPlan}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.btnPrimaryText}>Submit Follow-up Plan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {/* ======================================================
            SUB-MODAL 1: DAILY TABLET SCHEDULE & FOOD TIMING
            (EXACT UI MATCHING USER'S ATTACHED IMAGE)
        ======================================================= */}
        <Modal
          visible={isTimingModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsTimingModalOpen(false)}
        >
          <View style={styles.timingModalOverlay}>
            <View style={styles.timingModalCard}>
              {/* HEADER WITH TIME ICON */}
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
                {/* 1. MORNING BLOCK */}
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

                  {/* Tablet Option Row */}
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
                          size={15}
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
                          size={15}
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

                  {/* Food Timing Row */}
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
                        <Ionicons
                          name="time-outline"
                          size={15}
                          color={morningTiming.foodTiming === 'before' ? '#FFFFFF' : '#64748B'}
                        />
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
                        <Ionicons
                          name="restaurant-outline"
                          size={15}
                          color={morningTiming.foodTiming === 'after' ? '#FFFFFF' : '#64748B'}
                        />
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
                </View>

                {/* 2. AFTERNOON BLOCK */}
                <View style={styles.timingBlock}>
                  <View style={styles.timingBlockHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="partly-sunny-outline" size={18} color="#64748B" />
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

                  {/* Tablet Option Row */}
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
                          size={15}
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
                          size={15}
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

                  {/* Food Timing Row */}
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
                        <Ionicons
                          name="time-outline"
                          size={15}
                          color={afternoonTiming.foodTiming === 'before' ? '#FFFFFF' : '#64748B'}
                        />
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
                        <Ionicons
                          name="restaurant-outline"
                          size={15}
                          color={afternoonTiming.foodTiming === 'after' ? '#FFFFFF' : '#64748B'}
                        />
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
                </View>

                {/* 3. NIGHT BLOCK */}
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

                  {/* Tablet Option Row */}
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
                          size={15}
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
                          size={15}
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

                  {/* Food Timing Row */}
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
                        <Ionicons
                          name="time-outline"
                          size={15}
                          color={nightTiming.foodTiming === 'before' ? '#FFFFFF' : '#64748B'}
                        />
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
                        <Ionicons
                          name="restaurant-outline"
                          size={15}
                          color={nightTiming.foodTiming === 'after' ? '#FFFFFF' : '#64748B'}
                        />
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
                </View>

                {/* SAVE TIMING BUTTON */}
                <TouchableOpacity
                  style={styles.timingSaveBtn}
                  onPress={() => setIsTimingModalOpen(false)}
                  activeOpacity={0.88}
                >
                  <Ionicons name="checkmark-circle" size={17} color="#FFFFFF" />
                  <Text style={styles.timingSaveBtnText}>Save Schedule</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ======================================================
            SUB-MODAL 2: CALENDAR PICKER MODAL
        ======================================================= */}
        <Modal
          visible={isCalendarOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsCalendarOpen(false)}
        >
          <View style={styles.timingModalOverlay}>
            <View style={styles.calModalCard}>
              {/* Header */}
              <View style={styles.calHeader}>
                <View>
                  <Text style={styles.calHeaderTitle}>Select Follow-up Date</Text>
                  <Text style={styles.calHeaderSub}>Choose appointment date</Text>
                </View>
                <TouchableOpacity onPress={() => setIsCalendarOpen(false)}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Quick Select Chips */}
              <View style={styles.calQuickRow}>
                {[
                  { label: 'In 3 Days', days: 3 },
                  { label: 'In 7 Days', days: 7 },
                  { label: 'In 15 Days', days: 15 },
                  { label: 'In 1 Month', days: 30 },
                ].map((q) => (
                  <TouchableOpacity
                    key={q.label}
                    style={styles.calQuickChip}
                    onPress={() => handleQuickAddDays(q.days)}
                  >
                    <Text style={styles.calQuickChipText}>{q.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Month Navigation */}
              <View style={styles.calMonthNav}>
                <TouchableOpacity
                  onPress={() => {
                    if (calMonth === 0) {
                      setCalMonth(11);
                      setCalYear((y) => y - 1);
                    } else {
                      setCalMonth((m) => m - 1);
                    }
                  }}
                >
                  <Ionicons name="chevron-back" size={20} color="#071E42" />
                </TouchableOpacity>

                <Text style={styles.calMonthTitle}>
                  {MONTHS_SHORT[calMonth]} {calYear}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (calMonth === 11) {
                      setCalMonth(0);
                      setCalYear((y) => y + 1);
                    } else {
                      setCalMonth((m) => m + 1);
                    }
                  }}
                >
                  <Ionicons name="chevron-forward" size={20} color="#071E42" />
                </TouchableOpacity>
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
                      style={[styles.calDayCell, isSelected && styles.calDayCellSelected]}
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
            </View>
          </View>
        </Modal>

        {/* ======================================================
            SUB-MODAL 3: FINAL CONFIRMATION NOTES DOWN OK
        ======================================================= */}
        <Modal
          visible={isSuccessModalOpen}
          transparent
          animationType="fade"
          onRequestClose={handleFinalOk}
        >
          <View style={styles.timingModalOverlay}>
            <View style={styles.successModalCard}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={44} color="#071E42" />
              </View>

              <Text style={styles.successModalTitle}>Follow-up Notes Recorded</Text>
              <Text style={styles.successModalSubtitle}>
                Follow-up plan for {patient?.name || 'patient'} has been successfully noted down and saved.
              </Text>

              {/* Summary pill box */}
              <View style={styles.successSummaryBox}>
                <View style={styles.successSummaryItem}>
                  <Text style={styles.successSummaryLabel}>Scheduled Date</Text>
                  <Text style={styles.successSummaryVal}>{selectedDate}</Text>
                </View>
                <View style={styles.successSummaryItem}>
                  <Text style={styles.successSummaryLabel}>Mode</Text>
                  <Text style={styles.successSummaryVal}>{consultMode}</Text>
                </View>
                <View style={styles.successSummaryItem}>
                  <Text style={styles.successSummaryLabel}>Prescriptions</Text>
                  <Text style={styles.successSummaryVal}>{prescribedList.length} Items</Text>
                </View>
                <View style={styles.successSummaryItem}>
                  <Text style={styles.successSummaryLabel}>Lab Tests</Text>
                  <Text style={styles.successSummaryVal}>{testsList.length} Items</Text>
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  wizardContainer: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },

  /* HEADER */
  wizardHeader: {
    backgroundColor: '#071E42',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
  },
  wizardHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  wizardTitleWrap: {
    flex: 1,
  },
  wizardHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  wizardHeaderSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* STEP PROGRESS BAR */
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepNode: {
    alignItems: 'center',
  },
  stepNodeActive: {},
  stepNodePast: {},
  stepNodeText: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#CBD5E1',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 26,
  },
  stepNodeTextActive: {
    backgroundColor: '#00B894',
    color: '#FFFFFF',
  },
  stepNodeLabel: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 3,
  },
  stepNodeLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 14,
    marginHorizontal: 6,
  },
  stepLineActive: {
    backgroundColor: '#00B894',
  },

  /* BODY */
  wizardScrollBody: {
    maxHeight: 520,
  },
  wizardScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  stepSection: {},
  sectionHeaderRow: {
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
  stepIconWrap: {
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

  /* INPUTS */
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
    marginTop: 10,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#071E42',
    marginBottom: 4,
  },
  textAreaInput: {
    minHeight: 75,
    textAlignVertical: 'top',
  },

  /* SEARCH & DROPDOWN */
  searchDropdownWrap: {
    position: 'relative',
    zIndex: 20,
  },
  searchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#071E42',
    paddingVertical: 0,
  },
  dropdownBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#071E42',
    fontWeight: '600',
  },

  /* DURATION CHIPS */
  durationChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 6,
  },
  durationChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  durationChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  durationChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  durationChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* TIMING TRIGGER BUTTON */
  timingTriggerBtn: {
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
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timingTriggerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  timingTriggerSubtitle: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  timingBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },

  /* ADD BUTTONS & PRESCRIBED LIST */
  addMedicineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#071E42',
    borderRadius: 10,
    paddingVertical: 11,
    marginTop: 8,
    marginBottom: 10,
  },
  addMedicineBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  prescribedListWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  prescribedListHeader: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
    marginBottom: 8,
  },
  prescribedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 6,
  },
  prescribedName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  prescribedSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  prescribedInst: {
    fontSize: 11,
    color: '#00B894',
    marginTop: 2,
    fontWeight: '600',
  },

  /* PRESET BUTTONS FOR TESTING */
  presetButtonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 8,
  },
  presetChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF4FC',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  presetChipBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  presetChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#071E42',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* STEP 4 MODE & DATE PICKER */
  modeToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  modeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
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
  datePickerBtn: {
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
  datePickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  datePickerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#071E42',
  },
  datePickerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  dateChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dateChangeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },

  /* SUMMARY CARD */
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    marginTop: 8,
    marginBottom: 12,
  },
  summaryCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#071E42',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },

  /* NAVIGATION BUTTONS */
  navButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  btnSkip: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  btnSkipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#071E42',
  },
  btnPrimaryText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ==========================================================
     TIMING SUB-MODAL (MATCHING IMAGE)
  ========================================================== */
  timingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  timingModalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#00B89430',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  timingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  timingCardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#071E42',
  },
  timingBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  timingBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timingBlockTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#071E42',
  },
  timingStatusBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timingStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  timingControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timingControlLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    width: 95,
  },
  toggleButtonsGroup: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  toggleBtnActiveNavy: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  timingSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#071E42',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  timingSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* CALENDAR MODAL */
  calModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
  },
  calHeader: {
    backgroundColor: '#071E42',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calHeaderSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  calQuickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 10,
    backgroundColor: '#EEF4FC',
  },
  calQuickChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  calQuickChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
  },
  calMonthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  calMonthTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#071E42',
  },
  calWeekHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  calWeekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  calDayCell: {
    width: `${100 / 7}%`,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayCellSelected: {
    backgroundColor: '#071E42',
    borderRadius: 19,
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

  /* SUCCESS CONFIRMATION MODAL ("notes down ok") */
  successModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
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
  successSummaryItem: {
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
});
