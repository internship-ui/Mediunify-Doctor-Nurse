import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';

const MEDICINE_CATALOG = [
  { name: 'Paracetamol 650mg (Dolo)', category: 'Antipyretic / Analgesic', dosage: '1 tablet', freq: '3 daily', duration: '5 days' },
  { name: 'Augmentin 625mg (Amoxicillin + Clavulanic)', category: 'Antibiotic', dosage: '1 tablet', freq: '2 daily', duration: '5 days' },
  { name: 'Azithromycin 500mg (Azithral)', category: 'Antibiotic', dosage: '1 tablet', freq: '1 daily', duration: '3 days' },
  { name: 'Pantoprazole 40mg (Pan-40)', category: 'Antacid / PPI', dosage: '1 tablet', freq: '1 daily', duration: '7 days' },
  { name: 'Amlodipine 5mg', category: 'Antihypertensive', dosage: '1 tablet', freq: '1 daily', duration: '30 days' },
  { name: 'Telmisartan 40mg', category: 'Antihypertensive', dosage: '1 tablet', freq: '1 daily', duration: '30 days' },
  { name: 'Metformin 500mg', category: 'Antidiabetic', dosage: '1 tablet', freq: '2 daily', duration: '30 days' },
  { name: 'Cetirizine 10mg', category: 'Antihistamine', dosage: '1 tablet', freq: '1 daily', duration: '5 days' },
  { name: 'Montair LC (Montelukast + Levocetirizine)', category: 'Anti-allergy', dosage: '1 tablet', freq: '1 daily', duration: '7 days' },
  { name: 'Ibuprofen 400mg', category: 'NSAID / Pain relief', dosage: '1 tablet', freq: '2 daily', duration: '3 days' },
  { name: 'Cough Syrup (Ascoril LS)', category: 'Bronchodilator', dosage: '10 ml', freq: '3 daily', duration: '5 days' },
  { name: 'Vitamin C 500mg (Limcee)', category: 'Supplement', dosage: '1 tablet', freq: '1 daily', duration: '15 days' },
  { name: 'B-Complex with B12 (Becadexamin)', category: 'Multivitamin', dosage: '1 capsule', freq: '1 daily', duration: '30 days' },
];

const TEST_CATALOG = [
  { name: 'Complete Blood Count (CBC)', category: 'Hematology', prep: 'Random / No fasting needed', note: 'Routine processing with differential' },
  { name: 'Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)', category: 'Cardiology', prep: 'Fasting 10-12 hrs', note: 'Serum sample - protect from light' },
  { name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetes Profile', prep: 'Random / No fasting needed', note: 'EDTA whole blood tube' },
  { name: 'Fasting Blood Sugar (FBS)', category: 'Diabetes', prep: 'Fasting 8-10 hrs (drinking only water)', note: 'Fluoride plasma' },
  { name: 'Liver Function Test (LFT)', category: 'Biochemistry', prep: 'Fasting 8 hrs', note: 'Serum bilirubin and enzymes' },
  { name: 'Kidney Function Test (KFT / Serum Creatinine)', category: 'Nephrology', prep: 'Hydrated / Normal fasting', note: 'Urea and Creatinine' },
  { name: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', prep: 'Morning sample / fasting', note: 'Serum TSH sensitive' },
  { name: '12-Lead Electrocardiogram (ECG)', category: 'Cardiology', prep: 'Rest 10 min prior', note: 'Standard 12-lead diagnostic tracing' },
  { name: 'Chest X-Ray (PA View)', category: 'Radiology', prep: 'Remove metallic items', note: 'Full inspiration PA view' },
  { name: 'Ultrasound Whole Abdomen (USG)', category: 'Sonography', prep: 'Full bladder, 6 hrs fasting', note: 'Hepatic and renal evaluation' },
  { name: 'Serum Electrolytes (Na+, K+, Cl-)', category: 'Biochemistry', prep: 'Random / No fasting needed', note: 'Electrolytes ISE method' },
];

export default function DoctorConsultationPage({
  selectedConsultation,
  setActiveTab,
}) {
  // Top 4 Toggles: 'notes' | 'prescribe' | 'tests' | 'submit'
  const [activeToggle, setActiveToggle] = useState('notes');

  // Video call controls & live timer
  const [callDuration, setCallDuration] = useState(39); // 00:39 initial as shown in image
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Live timer increment
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const patientName = selectedConsultation?.name || selectedConsultation?.patient || 'Rohan Mehta';
  const consultSubtitle = selectedConsultation?.reason || 'Video consultation - Hypertension and BP review';

  // ----------------------------------------------------
  // TOGGLE 1: CONSULT NOTES
  // ----------------------------------------------------
  const [consultNotes, setConsultNotes] = useState(
    'Patient presents for follow-up review of hypertension. Reports occasional evening headaches. BP recorded at 134/86 mmHg. Vitals stable. Advised continuing low sodium intake.'
  );

  // ----------------------------------------------------
  // TOGGLE 2: PRESCRIBE (e-Prescription)
  // ----------------------------------------------------
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [isMedDropdownOpen, setIsMedDropdownOpen] = useState(false);
  const [medicineName, setMedicineName] = useState('Amlodipine 5mg');
  const [dosage, setDosage] = useState('1 tablet');
  const [frequency, setFrequency] = useState('1 daily');
  const [duration, setDuration] = useState('30 days');

  // Schedule timings state
  const [morningTiming, setMorningTiming] = useState({ active: true, food: 'After food' });
  const [afternoonTiming, setAfternoonTiming] = useState({ active: false, food: 'After food' });
  const [nightTiming, setNightTiming] = useState({ active: true, food: 'After food' });
  const [isTimingModalVisible, setIsTimingModalVisible] = useState(false);

  // Prescriptions list
  const [prescriptionsList, setPrescriptionsList] = useState([
    {
      id: 'rx-1',
      name: 'Amlodipine 5mg',
      dosage: '1 tablet',
      freq: '1 daily',
      duration: '30 days',
      timingSummary: 'Morning: ON (After food) · Night: ON (After food)',
    },
    {
      id: 'rx-2',
      name: 'Telmisartan 40mg',
      dosage: '1 tablet',
      freq: '1 daily',
      duration: '30 days',
      timingSummary: 'Morning: ON (After food) · Night: OFF',
    },
  ]);

  const filteredMedicines = MEDICINE_CATALOG.filter(
    (m) =>
      !medSearchQuery ||
      m.name.toLowerCase().includes(medSearchQuery.toLowerCase().trim()) ||
      m.category.toLowerCase().includes(medSearchQuery.toLowerCase().trim())
  );

  const handleSelectMedicine = (selectedMed) => {
    setMedicineName(selectedMed.name);
    if (selectedMed.dosage) setDosage(selectedMed.dosage);
    if (selectedMed.freq) setFrequency(selectedMed.freq);
    if (selectedMed.duration) setDuration(selectedMed.duration);
    setMedSearchQuery(''); // Clears search field on select as requested!
    setIsMedDropdownOpen(false);
  };

  const handleAddPrescription = () => {
    if (!medicineName.trim()) {
      alert('Please enter or select a medicine name.');
      return;
    }

    const timingSummary = `M: ${morningTiming.active ? 'ON (' + morningTiming.food + ')' : 'OFF'} · A: ${
      afternoonTiming.active ? 'ON (' + afternoonTiming.food + ')' : 'OFF'
    } · N: ${nightTiming.active ? 'ON (' + nightTiming.food + ')' : 'OFF'}`;

    const newRx = {
      id: `rx-${Date.now()}`,
      name: medicineName.trim(),
      dosage: dosage.trim() || '1 tablet',
      freq: frequency.trim() || '1 daily',
      duration: duration.trim() || '5 days',
      timingSummary,
    };

    setPrescriptionsList((prev) => [...prev, newRx]);
    setMedicineName('');
    alert(`"${newRx.name}" added to prescription.`);
  };

  const handleRemovePrescription = (id) => {
    setPrescriptionsList((prev) => prev.filter((item) => item.id !== id));
  };

  // ----------------------------------------------------
  // TOGGLE 3: TESTS (Lab Investigations)
  // ----------------------------------------------------
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [testName, setTestName] = useState('Lipid Profile');
  const [patientPrep, setPatientPrep] = useState('Fasting 10-12 hrs, drinking only water');
  const [labInstructions, setLabInstructions] = useState('Serum sample - protect from light. Check cholesterol & triglycerides.');

  const [testsList, setTestsList] = useState([
    {
      id: 'test-1',
      name: 'Lipid Profile',
      prep: 'Fasting 10-12 hrs, drinking only water',
      instructions: 'Serum sample - protect from light. Check cholesterol & triglycerides.',
    },
    {
      id: 'test-2',
      name: 'Kidney Function Test (Serum Creatinine)',
      prep: 'Random / No fasting needed',
      instructions: 'Standard diagnostic routine',
    },
  ]);

  const filteredTests = TEST_CATALOG.filter(
    (t) =>
      !testSearchQuery ||
      t.name.toLowerCase().includes(testSearchQuery.toLowerCase().trim()) ||
      t.category.toLowerCase().includes(testSearchQuery.toLowerCase().trim())
  );

  const handleSelectTest = (selectedT) => {
    setTestName(selectedT.name);
    if (selectedT.prep) setPatientPrep(selectedT.prep);
    if (selectedT.note) setLabInstructions(selectedT.note);
    setTestSearchQuery(''); // Clears search field on select as requested!
    setIsTestDropdownOpen(false);
  };

  const handleAddTest = () => {
    if (!testName.trim()) {
      alert('Please enter or select a test name.');
      return;
    }

    const newTest = {
      id: `test-${Date.now()}`,
      name: testName.trim(),
      prep: patientPrep.trim() || 'Standard diagnostic routine',
      instructions: labInstructions.trim() || 'Routine diagnostic protocol',
    };

    setTestsList((prev) => [...prev, newTest]);
    setTestName('');
    setPatientPrep('');
    setLabInstructions('');
    alert(`"${newTest.name}" added to test requirements.`);
  };

  const handleRemoveTest = (id) => {
    setTestsList((prev) => prev.filter((item) => item.id !== id));
  };

  // ----------------------------------------------------
  // TOGGLE 4: SUBMIT & POP-UP SENT TO PATIENT
  // ----------------------------------------------------
  const [isSubmittedModalVisible, setIsSubmittedModalVisible] = useState(false);

  const handleSubmitConsultation = () => {
    setIsSubmittedModalVisible(true);
  };

  const handleFinalOk = () => {
    setIsSubmittedModalVisible(false);
    if (setActiveTab) setActiveTab('appointments');
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end this video consultation call?')) {
      if (setActiveTab) setActiveTab('appointments');
    }
  };

  return (
    <View style={styles.pageContainer}>
      {/* ============================================================== */}
      {/* 1. TOP HEADER (MATCHING SCREENSHOT)                           */}
      {/* Navy background, Back Button, Logo MediUnify, Patient, Live    */}
      {/* ============================================================== */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          {/* Back button at top direct to appointments screen */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveTab && setActiveTab('appointments')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
            <Text style={styles.backBtnText}>Appointments</Text>
          </TouchableOpacity>

          {/* MediUnify Logo */}
          <View style={styles.brandLogoWrap}>
            <WebLogo size={28} style={styles.brandIcon} />
            <Text style={styles.brandTitleText}>
              Medi<Text style={styles.brandAccentText}>Unify</Text>
            </Text>
          </View>

          <View style={styles.headerPatientInfo}>
            <Text style={styles.headerPatientName}>{patientName}</Text>
            <Text style={styles.headerConsultSubtitle}>{consultSubtitle}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Live Pill Badge as in image */}
          <View style={styles.liveBadgePill}>
            <Text style={styles.liveBadgeText}>Live</Text>
          </View>

          {/* Exit / Back to appointments */}
          <TouchableOpacity
            style={styles.exitCallBtn}
            onPress={handleEndCall}
            activeOpacity={0.8}
            title="Exit Consultation"
          >
            <Ionicons name="close" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 2. MAIN SPLIT BODY: LEFT WORKSTATION & RIGHT VIDEO CALL        */}
      {/* ============================================================== */}
      <View style={styles.mainSplitBody}>
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: 4 TOGGLES WORKSTATION                          */}
        {/* ------------------------------------------------------------ */}
        <View style={styles.leftWorkstationCol}>
          {/* 4 TOGGLES PILL BAR: [ Consult notes ] [ Prescribe ] [ Tests ] [ Submit ] */}
          <View style={styles.togglesPillBar}>
            <TouchableOpacity
              style={[
                styles.togglePillItem,
                activeToggle === 'notes' && styles.togglePillItemActive,
              ]}
              onPress={() => setActiveToggle('notes')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.togglePillText,
                  activeToggle === 'notes' && styles.togglePillTextActive,
                ]}
              >
                Consult notes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.togglePillItem,
                activeToggle === 'prescribe' && styles.togglePillItemActive,
              ]}
              onPress={() => setActiveToggle('prescribe')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.togglePillText,
                  activeToggle === 'prescribe' && styles.togglePillTextActive,
                ]}
              >
                Prescribe
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.togglePillItem,
                activeToggle === 'tests' && styles.togglePillItemActive,
              ]}
              onPress={() => setActiveToggle('tests')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.togglePillText,
                  activeToggle === 'tests' && styles.togglePillTextActive,
                ]}
              >
                Tests
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.togglePillItem,
                activeToggle === 'submit' && styles.togglePillItemActive,
              ]}
              onPress={() => setActiveToggle('submit')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.togglePillText,
                  activeToggle === 'submit' && styles.togglePillTextActive,
                ]}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>

          {/* TOGGLE CONTENT VIEWER */}
          <ScrollView
            style={styles.workstationScroll}
            contentContainerStyle={styles.workstationScrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* ---------------------------------------------------- */}
            {/* 1. CONSULT NOTES TOGGLE CONTENT                      */}
            {/* ---------------------------------------------------- */}
            {activeToggle === 'notes' && (
              <View style={styles.toggleContentSection}>
                <Text style={styles.sectionHeading}>Consult notes</Text>
                {/* Large dark typing field matching screenshot */}
                <TextInput
                  style={styles.darkTextareaBox}
                  placeholder="Type symptoms, observations and diagnosis..."
                  placeholderTextColor="#64748B"
                  value={consultNotes}
                  onChangeText={setConsultNotes}
                  multiline
                  numberOfLines={10}
                />
              </View>
            )}

            {/* ---------------------------------------------------- */}
            {/* 2. PRESCRIBE TOGGLE CONTENT (e-Prescription)         */}
            {/* ---------------------------------------------------- */}
            {activeToggle === 'prescribe' && (
              <View style={styles.toggleContentSection}>
                <Text style={styles.sectionHeading}>e-Prescription</Text>

                {/* SEARCH MEDICINE (Height increased & Highlighted Select in Dropdown) */}
                <Text style={styles.fieldLabel}>Search Medicine</Text>
                <View style={styles.searchBoxWrap}>
                  <View style={styles.searchRowIncreased}>
                    <Ionicons name="search" size={18} color="#071E42" />
                    <TextInput
                      style={styles.searchInputIncreased}
                      placeholder="Search medicine (e.g. Paracetamol, Augmentin, Amlodipine)..."
                      placeholderTextColor="#94A3B8"
                      value={medSearchQuery}
                      onChangeText={(t) => {
                        setMedSearchQuery(t);
                        setIsMedDropdownOpen(true);
                      }}
                      onFocus={() => setIsMedDropdownOpen(true)}
                    />
                    {medSearchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setMedSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Dropdown with Highlighted Select Button */}
                  {isMedDropdownOpen && (
                    <View style={styles.dropdownListBox}>
                      <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                        {filteredMedicines.map((m) => (
                          <View key={m.name} style={styles.dropdownItemRow}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                              <Text style={styles.dropdownItemTitle}>{m.name}</Text>
                              <Text style={styles.dropdownItemSub}>{m.category}</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.highlightSelectBtn}
                              onPress={() => handleSelectMedicine(m)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.highlightSelectBtnText}>Select</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* MEDICINE NAME (Fetched from search selection) */}
                <Text style={styles.fieldLabel}>Medicine Name</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. Paracetamol 650mg, Amlodipine 5mg..."
                  placeholderTextColor="#94A3B8"
                  value={medicineName}
                  onChangeText={setMedicineName}
                />

                {/* DOSAGE FIELD WITH ADD-UP BUTTONS */}
                <Text style={styles.fieldLabel}>Dosage</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. 1 tablet, 2 tablets, 5 ml..."
                  placeholderTextColor="#94A3B8"
                  value={dosage}
                  onChangeText={setDosage}
                />
                <View style={styles.addUpPillsRow}>
                  {['1 tablet', '2 tablets', '3 tablets', '5 tablets', '7 tablets', '1 capsule', '5 ml', '10 ml'].map(
                    (d) => (
                      <TouchableOpacity
                        key={d}
                        style={[
                          styles.addUpPillBtn,
                          dosage === d && styles.addUpPillBtnActive,
                        ]}
                        onPress={() => setDosage(d)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={dosage === d ? 'checkmark-circle' : 'add-circle-outline'}
                          size={13}
                          color={dosage === d ? '#FFFFFF' : '#071E42'}
                        />
                        <Text
                          style={[
                            styles.addUpPillText,
                            dosage === d && styles.addUpPillTextActive,
                          ]}
                        >
                          {d}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                {/* FREQUENCY FIELD WITH ADD-UP BUTTONS */}
                <Text style={styles.fieldLabel}>Frequency</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. 1 daily, 2 daily..."
                  placeholderTextColor="#94A3B8"
                  value={frequency}
                  onChangeText={setFrequency}
                />
                <View style={styles.addUpPillsRow}>
                  {['1 daily', '2 daily', '3 daily', 'OD (Once Daily)', 'BD (Twice Daily)', 'TDS (Thrice Daily)', 'SOS (As needed)'].map(
                    (f) => (
                      <TouchableOpacity
                        key={f}
                        style={[
                          styles.addUpPillBtn,
                          frequency === f && styles.addUpPillBtnActive,
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
                            styles.addUpPillText,
                            frequency === f && styles.addUpPillTextActive,
                          ]}
                        >
                          {f}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                {/* DURATION FIELD WITH ADD-UP BUTTONS */}
                <Text style={styles.fieldLabel}>Duration</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. 3 days, 5 days, 14 days..."
                  placeholderTextColor="#94A3B8"
                  value={duration}
                  onChangeText={setDuration}
                />
                <View style={styles.addUpPillsRow}>
                  {['3 days', '5 days', '7 days', '10 days', '14 days', '30 days', '1 month'].map((dur) => (
                    <TouchableOpacity
                      key={dur}
                      style={[
                        styles.addUpPillBtn,
                        duration === dur && styles.addUpPillBtnActive,
                      ]}
                      onPress={() => setDuration(dur)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={duration === dur ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={duration === dur ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.addUpPillText,
                          duration === dur && styles.addUpPillTextActive,
                        ]}
                      >
                        {dur}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* SCHEDULE TIMINGS (With Configure Pop-up Trigger) */}
                <Text style={styles.fieldLabel}>Schedule Timings</Text>
                <TouchableOpacity
                  style={styles.scheduleTimingCard}
                  onPress={() => setIsTimingModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <View style={styles.scheduleCardLeft}>
                    <Ionicons name="time-outline" size={18} color="#00B894" />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={styles.scheduleCardTitle}>Tablet Timings & Food Rule</Text>
                      <Text style={styles.scheduleCardSub}>
                        M: {morningTiming.active ? 'ON (' + morningTiming.food + ')' : 'OFF'} ·
                        A: {afternoonTiming.active ? 'ON (' + afternoonTiming.food + ')' : 'OFF'} ·
                        N: {nightTiming.active ? 'ON (' + nightTiming.food + ')' : 'OFF'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.configurePillBadge}>
                    <Text style={styles.configurePillText}>Configure</Text>
                    <Ionicons name="chevron-forward" size={13} color="#071E42" />
                  </View>
                </TouchableOpacity>

                {/* ADD TO PRESCRIPTION BUTTON */}
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={handleAddPrescription}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>+ Add to Prescription</Text>
                </TouchableOpacity>

                {/* PRESCRIPTION LIST */}
                <View style={styles.savedListContainer}>
                  <Text style={styles.savedListHeaderTitle}>
                    Prescribed Medicines ({prescriptionsList.length})
                  </Text>
                  {prescriptionsList.map((item) => (
                    <View key={item.id} style={styles.savedItemCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.savedItemTitle}>{item.name}</Text>
                        <Text style={styles.savedItemDetails}>
                          Dosage: {item.dosage} · Frequency: {item.freq} · Duration: {item.duration}
                        </Text>
                        <Text style={styles.savedItemTiming}>{item.timingSummary}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.trashBtn}
                        onPress={() => handleRemovePrescription(item.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ---------------------------------------------------- */}
            {/* 3. TESTS TOGGLE CONTENT                              */}
            {/* ---------------------------------------------------- */}
            {activeToggle === 'tests' && (
              <View style={styles.toggleContentSection}>
                <Text style={styles.sectionHeading}>Diagnostic Lab Tests</Text>

                {/* SEARCH TESTS (Height increased & Highlighted Select in Dropdown) */}
                <Text style={styles.fieldLabel}>Search Tests</Text>
                <View style={styles.searchBoxWrap}>
                  <View style={styles.searchRowIncreased}>
                    <Ionicons name="search" size={18} color="#071E42" />
                    <TextInput
                      style={styles.searchInputIncreased}
                      placeholder="Search diagnostic test (e.g. Complete Blood Count, Lipid Profile)..."
                      placeholderTextColor="#94A3B8"
                      value={testSearchQuery}
                      onChangeText={(t) => {
                        setTestSearchQuery(t);
                        setIsTestDropdownOpen(true);
                      }}
                      onFocus={() => setIsTestDropdownOpen(true)}
                    />
                    {testSearchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setTestSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Dropdown with Highlighted Select Button */}
                  {isTestDropdownOpen && (
                    <View style={styles.dropdownListBox}>
                      <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                        {filteredTests.map((t) => (
                          <View key={t.name} style={styles.dropdownItemRow}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                              <Text style={styles.dropdownItemTitle}>{t.name}</Text>
                              <Text style={styles.dropdownItemSub}>{t.category}</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.highlightSelectBtn}
                              onPress={() => handleSelectTest(t)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.highlightSelectBtnText}>Select</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* TEST NAME FIELD (Fetched from selection or typed) WITH ADD-UP BUTTONS */}
                <Text style={styles.fieldLabel}>Test Name</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. Complete Blood Count (CBC), Lipid Profile..."
                  placeholderTextColor="#94A3B8"
                  value={testName}
                  onChangeText={setTestName}
                />
                <View style={styles.addUpPillsRow}>
                  {[
                    'Complete Blood Count (CBC)',
                    'Lipid Profile',
                    'HbA1c',
                    'Liver Function Test (LFT)',
                    'Kidney Function Test (KFT)',
                    'Thyroid Profile (TSH)',
                    'Chest X-Ray',
                    'ECG 12-Lead',
                  ].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.addUpPillBtn,
                        testName === t && styles.addUpPillBtnActive,
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
                          styles.addUpPillText,
                          testName === t && styles.addUpPillTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* PATIENT PREPARATION / DIET REQUIREMENT WITH ADD-UP BUTTONS */}
                <Text style={styles.fieldLabel}>Patient Preparation / Diet Requirement</Text>
                <TextInput
                  style={[styles.inputBox, styles.textareaBoxSmall]}
                  placeholder="e.g. Fasting 10-12 hrs, drinking only water..."
                  placeholderTextColor="#94A3B8"
                  value={patientPrep}
                  onChangeText={setPatientPrep}
                  multiline
                />
                <View style={styles.addUpPillsRow}>
                  {[
                    'Fasting 10-12 hrs',
                    'Fasting 8 hrs',
                    'Drinking only water',
                    'Random / No fasting needed',
                    'Drink 1L water 1 hr prior',
                    'Postprandial (2 hrs after meal)',
                  ].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.addUpPillBtn,
                        patientPrep.includes(p) && styles.addUpPillBtnActive,
                      ]}
                      onPress={() =>
                        setPatientPrep((prev) => (prev ? `${prev}; ${p}` : p))
                      }
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={patientPrep.includes(p) ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={patientPrep.includes(p) ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.addUpPillText,
                          patientPrep.includes(p) && styles.addUpPillTextActive,
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* CLINICAL INSTRUCTIONS FOR LAB TECHNICIAN WITH ADD-UP BUTTONS */}
                <Text style={styles.fieldLabel}>Clinical Instructions for Lab Technician</Text>
                <TextInput
                  style={[styles.inputBox, styles.textareaBoxSmall]}
                  placeholder="e.g. Stat / Urgent processing, collect fasting sample..."
                  placeholderTextColor="#94A3B8"
                  value={labInstructions}
                  onChangeText={setLabInstructions}
                  multiline
                />
                <View style={styles.addUpPillsRow}>
                  {[
                    'Stat / Urgent processing',
                    'Serum sample - protect from light',
                    'EDTA whole blood',
                    'Collect fasting & PP samples',
                    'Include differential count',
                    'Standard diagnostic routine',
                  ].map((inst) => (
                    <TouchableOpacity
                      key={inst}
                      style={[
                        styles.addUpPillBtn,
                        labInstructions.includes(inst) && styles.addUpPillBtnActive,
                      ]}
                      onPress={() =>
                        setLabInstructions((prev) => (prev ? `${prev}; ${inst}` : inst))
                      }
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={labInstructions.includes(inst) ? 'checkmark-circle' : 'add-circle-outline'}
                        size={13}
                        color={labInstructions.includes(inst) ? '#FFFFFF' : '#071E42'}
                      />
                      <Text
                        style={[
                          styles.addUpPillText,
                          labInstructions.includes(inst) && styles.addUpPillTextActive,
                        ]}
                      >
                        {inst}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* ADD TO TEST REQUIRED BUTTON */}
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={handleAddTest}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>+ Add to Test Required</Text>
                </TouchableOpacity>

                {/* ORDERED TESTS LIST */}
                <View style={styles.savedListContainer}>
                  <Text style={styles.savedListHeaderTitle}>
                    Required Lab Tests ({testsList.length})
                  </Text>
                  {testsList.map((item) => (
                    <View key={item.id} style={styles.savedItemCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.savedItemTitle}>{item.name}</Text>
                        <Text style={styles.savedItemDetails}>Prep: {item.prep}</Text>
                        <Text style={styles.savedItemTiming}>Note: {item.instructions}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.trashBtn}
                        onPress={() => handleRemoveTest(item.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ---------------------------------------------------- */}
            {/* 4. SUBMIT TOGGLE CONTENT                             */}
            {/* ---------------------------------------------------- */}
            {activeToggle === 'submit' && (
              <View style={styles.toggleContentSection}>
                <Text style={styles.sectionHeading}>Consultation Plan Summary</Text>

                {/* Summary Card */}
                <View style={styles.summaryOverviewCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Patient Name:</Text>
                    <Text style={styles.summaryValue}>{patientName}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Consultation Notes:</Text>
                    <Text style={styles.summaryValue} numberOfLines={2}>
                      {consultNotes || 'No notes added'}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Prescribed Medicines:</Text>
                    <Text style={styles.summaryValue}>
                      {prescriptionsList.length} medications
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Required Lab Tests:</Text>
                    <Text style={styles.summaryValue}>
                      {testsList.length} investigations
                    </Text>
                  </View>
                </View>

                {/* Final Submit Button */}
                <TouchableOpacity
                  style={[styles.primaryActionBtn, { backgroundColor: '#071E42', marginTop: 18 }]}
                  onPress={handleSubmitConsultation}
                  activeOpacity={0.88}
                >
                  <Ionicons name="send" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Submit & Send to Patient</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: VIDEO CALL SCREEN (MATCHING SCREENSHOT)       */}
        {/* ------------------------------------------------------------ */}
        <View style={styles.rightVideoScreenCol}>
          {/* Top badges inside video */}
          <View style={styles.videoTopOverlay}>
            <View style={styles.videoPatientBadge}>
              <Text style={styles.videoPatientBadgeText}>{patientName}</Text>
            </View>

            <View style={styles.videoTimerBadge}>
              <View style={styles.redDot} />
              <Text style={styles.videoTimerText}>{formatTimer(callDuration)}</Text>
            </View>
          </View>

          {/* Central Patient Avatar in Video Screen */}
          <View style={styles.videoCenterAvatarBox}>
            <View style={styles.videoLargeAvatarCircle}>
              <Ionicons name="person" size={72} color="#00CBA9" />
            </View>
          </View>

          {/* Picture-in-Picture (PiP) Self Camera preview in Bottom-Right */}
          <View style={styles.pipCameraBox}>
            <Ionicons name="person" size={26} color="#FFFFFF" />
          </View>

          {/* Bottom Floating Control Bar */}
          <View style={styles.videoControlsBar}>
            {/* Mic Button */}
            <TouchableOpacity
              style={[
                styles.controlCircleBtn,
                isMicMuted && styles.controlCircleBtnOff,
              ]}
              onPress={() => setIsMicMuted(!isMicMuted)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isMicMuted ? 'mic-off' : 'mic'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* Video Camera Button */}
            <TouchableOpacity
              style={[
                styles.controlCircleBtn,
                isVideoOff && styles.controlCircleBtnOff,
              ]}
              onPress={() => setIsVideoOff(!isVideoOff)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isVideoOff ? 'videocam-off' : 'videocam'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* Screen Share Button */}
            <TouchableOpacity
              style={[
                styles.controlCircleBtn,
                isScreenSharing && styles.controlCircleBtnActive,
              ]}
              onPress={() => setIsScreenSharing(!isScreenSharing)}
              activeOpacity={0.8}
            >
              <Ionicons name="desktop-outline" size={19} color="#FFFFFF" />
            </TouchableOpacity>

            {/* End Call Button (Red Hangup) */}
            <TouchableOpacity
              style={styles.endCallCircleBtn}
              onPress={handleEndCall}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={20} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ============================================================== */}
      {/* SCHEDULE TIMINGS POP-UP MODAL (MATCHING REFERENCE IMAGE)       */}
      {/* ============================================================== */}
      <Modal
        visible={isTimingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTimingModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="time" size={20} color="#00B894" />
                <Text style={styles.modalTitle}>Daily Tablet Schedule & Food Timing</Text>
              </View>
              <TouchableOpacity onPress={() => setIsTimingModalVisible(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* MORNING */}
            <View style={styles.timingConfigBlock}>
              <Text style={styles.timingPeriodLabel}>Morning (Breakfast)</Text>
              <View style={styles.timingRowOptions}>
                {/* ON / OFF */}
                <TouchableOpacity
                  style={[
                    styles.toggleOptionBtn,
                    morningTiming.active && styles.toggleOptionBtnActive,
                  ]}
                  onPress={() =>
                    setMorningTiming((prev) => ({ ...prev, active: !prev.active }))
                  }
                >
                  <Text
                    style={[
                      styles.toggleOptionText,
                      morningTiming.active && styles.toggleOptionTextActive,
                    ]}
                  >
                    {morningTiming.active ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>

                {/* FOOD TIMING */}
                {['Before food', 'After food'].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.foodOptionBtn,
                      morningTiming.food === opt && styles.foodOptionBtnActive,
                    ]}
                    onPress={() => setMorningTiming((prev) => ({ ...prev, food: opt }))}
                  >
                    <Text
                      style={[
                        styles.foodOptionText,
                        morningTiming.food === opt && styles.foodOptionTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* AFTERNOON */}
            <View style={styles.timingConfigBlock}>
              <Text style={styles.timingPeriodLabel}>Afternoon (Lunch)</Text>
              <View style={styles.timingRowOptions}>
                {/* ON / OFF */}
                <TouchableOpacity
                  style={[
                    styles.toggleOptionBtn,
                    afternoonTiming.active && styles.toggleOptionBtnActive,
                  ]}
                  onPress={() =>
                    setAfternoonTiming((prev) => ({ ...prev, active: !prev.active }))
                  }
                >
                  <Text
                    style={[
                      styles.toggleOptionText,
                      afternoonTiming.active && styles.toggleOptionTextActive,
                    ]}
                  >
                    {afternoonTiming.active ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>

                {/* FOOD TIMING */}
                {['Before food', 'After food'].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.foodOptionBtn,
                      afternoonTiming.food === opt && styles.foodOptionBtnActive,
                    ]}
                    onPress={() => setAfternoonTiming((prev) => ({ ...prev, food: opt }))}
                  >
                    <Text
                      style={[
                        styles.foodOptionText,
                        afternoonTiming.food === opt && styles.foodOptionTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* NIGHT */}
            <View style={styles.timingConfigBlock}>
              <Text style={styles.timingPeriodLabel}>Night (Dinner)</Text>
              <View style={styles.timingRowOptions}>
                {/* ON / OFF */}
                <TouchableOpacity
                  style={[
                    styles.toggleOptionBtn,
                    nightTiming.active && styles.toggleOptionBtnActive,
                  ]}
                  onPress={() =>
                    setNightTiming((prev) => ({ ...prev, active: !prev.active }))
                  }
                >
                  <Text
                    style={[
                      styles.toggleOptionText,
                      nightTiming.active && styles.toggleOptionTextActive,
                    ]}
                  >
                    {nightTiming.active ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>

                {/* FOOD TIMING */}
                {['Before food', 'After food'].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.foodOptionBtn,
                      nightTiming.food === opt && styles.foodOptionBtnActive,
                    ]}
                    onPress={() => setNightTiming((prev) => ({ ...prev, food: opt }))}
                  >
                    <Text
                      style={[
                        styles.foodOptionText,
                        nightTiming.food === opt && styles.foodOptionTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity
              style={[styles.primaryActionBtn, { marginTop: 14 }]}
              onPress={() => setIsTimingModalVisible(false)}
            >
              <Text style={styles.primaryActionBtnText}>Save Schedule Timings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* SUBMIT CONFIRMATION POP-UP: SENT TO PATIENTS                    */}
      {/* ============================================================== */}
      <Modal
        visible={isSubmittedModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSubmittedModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { alignItems: 'center', textAlign: 'center' }]}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.successModalTitle}>Sent to Patient</Text>
            <Text style={styles.successModalSubtitle}>
              Consultation notes, e-prescription, and required diagnostic tests have been sent to{' '}
              <Text style={{ fontWeight: '700', color: '#071E42' }}>{patientName}</Text> via SMS & WhatsApp.
            </Text>

            <View style={styles.sentSummaryBox}>
              <Text style={styles.sentSummaryItem}>
                ✓ <Text style={{ fontWeight: '700' }}>Prescriptions:</Text> {prescriptionsList.length} medications
              </Text>
              <Text style={styles.sentSummaryItem}>
                ✓ <Text style={{ fontWeight: '700' }}>Lab Tests:</Text> {testsList.length} diagnostic orders
              </Text>
              <Text style={styles.sentSummaryItem}>
                ✓ <Text style={{ fontWeight: '700' }}>Consultation Notes:</Text> Logged in patient EHR
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryActionBtn, { width: '100%', marginTop: 16 }]}
              onPress={handleFinalOk}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryActionBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: '100%',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    maxHeight: Platform.OS === 'web' ? '100vh' : '100%',
    overflow: 'hidden',
    backgroundColor: '#071E42',
  },

  /* 1. TOP HEADER (MATCHING SCREENSHOT) */
  topHeader: {
    height: 64,
    backgroundColor: '#071E42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  brandLogoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    borderRadius: 8,
  },
  brandTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  brandAccentText: {
    color: '#00CBA9',
  },
  headerPatientInfo: {
    marginLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    paddingLeft: 14,
  },
  headerPatientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  headerConsultSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveBadgePill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00B894',
  },
  exitCallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 2. MAIN SPLIT BODY */
  mainSplitBody: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  /* LEFT WORKSTATION COLUMN */
  leftWorkstationCol: {
    flex: 0.95,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  togglesPillBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  togglePillItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePillItemActive: {
    backgroundColor: '#071E42',
  },
  togglePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  togglePillTextActive: {
    color: '#FFFFFF',
  },

  workstationScroll: {
    flex: 1,
  },
  workstationScrollContent: {
    paddingBottom: 30,
  },
  toggleContentSection: {
    width: '100%',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },

  /* DARK TEXTAREA FOR CONSULT NOTES (MATCHING SCREENSHOT) */
  darkTextareaBox: {
    backgroundColor: '#1E1E1E',
    color: '#F8FAFC',
    borderRadius: 10,
    padding: 16,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 240,
    textAlignVertical: 'top',
  },

  /* FIELD LABELS & INPUTS */
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
    marginTop: 12,
    marginBottom: 5,
  },
  inputBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 9,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#071E42',
    marginBottom: 6,
  },
  textareaBoxSmall: {
    minHeight: 56,
    textAlignVertical: 'top',
  },

  /* SEARCH BAR INCREASED HEIGHT */
  searchBoxWrap: {
    position: 'relative',
    zIndex: 20,
    marginBottom: 6,
  },
  searchRowIncreased: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#071E42',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInputIncreased: {
    flex: 1,
    fontSize: 13.5,
    color: '#071E42',
    paddingVertical: 8,
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
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  dropdownItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  highlightSelectBtn: {
    backgroundColor: '#00B894',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 7,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  highlightSelectBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  /* ADD-UP PILLS */
  addUpPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  addUpPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  addUpPillBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  addUpPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#071E42',
  },
  addUpPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* SCHEDULE TIMINGS TRIGGER CARD */
  scheduleTimingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF4FC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#071E42',
    padding: 10,
    marginBottom: 8,
  },
  scheduleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleCardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
  },
  scheduleCardSub: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  configurePillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  configurePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
  },

  /* PRIMARY ACTION BUTTON (+ ADD TO PRESCRIPTION / + ADD TO TEST) */
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    paddingVertical: 11,
    borderRadius: 9,
    marginTop: 6,
    marginBottom: 12,
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },

  /* SAVED LISTS CARDS (PRESCRIBED & TESTS) */
  savedListContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 4,
  },
  savedListHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#071E42',
    marginBottom: 8,
  },
  savedItemCard: {
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
  savedItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  savedItemDetails: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 2,
  },
  savedItemTiming: {
    fontSize: 11,
    color: '#00897B',
    fontWeight: '600',
    marginTop: 2,
  },
  trashBtn: {
    padding: 6,
  },

  /* SUMMARY OVERVIEW CARD */
  summaryOverviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },

  /* ------------------------------------------------------------ */
  /* RIGHT COLUMN: VIDEO CALL SCREEN (MATCHING SCREENSHOT)       */
  /* ------------------------------------------------------------ */
  rightVideoScreenCol: {
    flex: 1.05,
    backgroundColor: '#0F264A',
    borderRadius: 16,
    margin: 16,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  videoTopOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  videoPatientBadge: {
    backgroundColor: 'rgba(5, 15, 35, 0.65)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  videoPatientBadgeText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  redDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },
  videoTimerText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* CENTRAL AVATAR IN VIDEO SCREEN */
  videoCenterAvatarBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoLargeAvatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E3A6B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* PiP SELF CAMERA PREVIEW (BOTTOM-RIGHT) */
  pipCameraBox: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 90,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  /* VIDEO CONTROLS BAR (BOTTOM CENTER) */
  videoControlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingBottom: 20,
  },
  controlCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1B3B6F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlCircleBtnOff: {
    backgroundColor: '#475569',
  },
  controlCircleBtnActive: {
    backgroundColor: '#00B894',
  },
  endCallCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* MODALS (SCHEDULE TIMING & SUBMIT CONFIRMATION) */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 15, 35, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#071E42',
  },
  timingConfigBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  timingPeriodLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#071E42',
    marginBottom: 8,
  },
  timingRowOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleOptionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  toggleOptionBtnActive: {
    backgroundColor: '#00B894',
  },
  toggleOptionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  toggleOptionTextActive: {
    color: '#FFFFFF',
  },
  foodOptionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  foodOptionBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  foodOptionText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  foodOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* SUCCESS MODAL */
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#071E42',
    marginBottom: 8,
  },
  successModalSubtitle: {
    fontSize: 13.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  sentSummaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  sentSummaryItem: {
    fontSize: 12.5,
    color: '#1E293B',
  },
});
