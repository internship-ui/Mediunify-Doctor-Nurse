import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const COMMON_MEDICINES = [
  'Tab. Paracetamol 650mg',
  'Tab. Amlodipine 5mg',
  'Tab. Telmisartan 40mg',
  'Tab. Metformin 500mg',
  'Tab. Pantoprazole 40mg',
  'Tab. Atorvastatin 10mg',
  'Tab. Rosuvastatin 20mg',
  'Tab. Montelukast 10mg',
  'Cap. Omeprazole 20mg',
  'Tab. Azithromycin 500mg',
  'Tab. Clopidogrel 75mg',
  'Tab. Aspirin 75mg',
  'Tab. Metoprolol 25mg',
  'Tab. Losartan 50mg',
  'Tab. Ciprofloxacin 500mg',
];

export const COMMON_RADIOLOGY_TESTS = [
  'Chest X-Ray PA View',
  '2D Echocardiogram with Doppler',
  'CT Coronary Angiogram',
  'MRI Brain with Contrast',
  'Ultrasound Abdomen & Pelvis',
  '12-Lead Resting ECG',
  'Doppler Ultrasound Carotid',
  'Bone Mineral Density (DEXA Scan)',
];

export const COMMON_TESTS = [
  'Complete Blood Count (CBC)',
  'Lipid Profile (Fasting)',
  'HbA1c Glycated Hemoglobin',
  'Serum Creatinine & eGFR',
  '12-Lead Resting ECG',
  'Thyroid Profile (T3, T4, TSH)',
  'Urine Routine & Microalbumin',
  'Liver Function Test (LFT)',
  'Serum Electrolytes (Na+, K+)',
  '2D Echocardiogram with Doppler',
  'Fasting Blood Sugar (FBS)',
  'Post-Prandial Blood Sugar (PPBS)',
];

export const calendarDaysMatrix = [
  [null, null, null, null, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
];

export default function FollowBottomSlidePanel({
  isOpen = true,
  patient,
  onClose,
  setActiveTab,
  onCloseDrawer,
  onFinalSubmit,
  initialStep = 1,
  initialConsultNotes,
  initialPrescriptions,
  initialTests,
}) {
  if (!isOpen || !patient) return null;

  const selectedPatient = patient;

  const handleClose = () => {
    if (typeof onClose === 'function') onClose();
    if (typeof onCloseDrawer === 'function') onCloseDrawer();
  };

  // Step state: 1: Appointment Details, 2: Consult Notes, 3: Prescribe, 4: Tests, 5: Schedule
  const [currentStep, setCurrentStep] = useState(initialStep || 1);

  // Step 1: Privacy Documents & Record Preview Modal State
  const [requestedDocs, setRequestedDocs] = useState([
    { id: 'req-init', name: 'Recent Echo Doppler Report', status: 'Requested from Patient', date: 'Today' },
  ]);
  const [manualDocInput, setManualDocInput] = useState('');
  const [recordPreviewModal, setRecordPreviewModal] = useState({
    visible: false,
    title: '',
    type: '',
    content: '',
  });

  const handleRequestDocument = () => {
    if (!manualDocInput.trim()) return;
    const newReq = {
      id: 'req-' + Date.now(),
      name: manualDocInput.trim(),
      status: 'Requested from Patient',
      date: 'Today',
    };
    setRequestedDocs((prev) => [newReq, ...prev]);
    setManualDocInput('');
  };

  // Step 2: Consult notes state
  const [consultNotesText, setConsultNotesText] = useState(
    initialConsultNotes ||
      'Maintain daily medication routine. Restrict dietary sodium to less than 2g/day. Hydrate well and monitor home readings.'
  );

  // Step 3: Prescriptions list
  const [prescriptions, setPrescriptions] = useState(
    initialPrescriptions || [
      {
        id: 'rx-1',
        name: 'Tab. Amlodipine 5mg',
        dosage: '1 tablet',
        frequency: '1 daily',
        duration: '30 Days',
        timing: 'Morning (After Food)',
        source: 'search',
      },
      {
        id: 'rx-2',
        name: 'Tab. Telmisartan 40mg',
        dosage: '1 tablet',
        frequency: '1 daily',
        duration: '30 Days',
        timing: 'Night (After Food)',
        source: 'search',
      },
    ]
  );
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [searchMedName, setSearchMedName] = useState('');
  const [searchMedDosage, setSearchMedDosage] = useState('1 tablet');
  const [searchMedFrequency, setSearchMedFrequency] = useState('1 daily');
  const [searchMedDuration, setSearchMedDuration] = useState('30 days');
  const [searchMedTiming, setSearchMedTiming] = useState('Morning (After Food) · Night (After Food)');

  // Medicine Timing Popup Modal
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [morningOn, setMorningOn] = useState(true);
  const [morningFood, setMorningFood] = useState('After Food');
  const [afternoonOn, setAfternoonOn] = useState(false);
  const [afternoonFood, setAfternoonFood] = useState('After Food');
  const [nightOn, setNightOn] = useState(true);
  const [nightFood, setNightFood] = useState('After Food');

  // Step 4: Tests
  const [activeTestCategory, setActiveTestCategory] = useState('lab');
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [searchTestName, setSearchTestName] = useState('');
  const [searchTestPrep, setSearchTestPrep] = useState('Fasting 10 hrs');
  const [searchTestInstructions, setSearchTestInstructions] = useState('Routine Serum sample');

  const [selectedTests, setSelectedTests] = useState(
    initialTests || [
      {
        id: 't-1',
        name: 'Serum Creatinine & eGFR',
        prep: 'Normal diet',
        instructions: 'Routine renal check & report by evening',
        source: 'search',
      },
      {
        id: 't-2',
        name: 'Lipid Profile (Fasting)',
        prep: 'Fasting 10 hrs, drinking only water',
        instructions: 'Overnight fasting serum sample',
        source: 'search',
      },
      {
        id: 't-3',
        name: '12-Lead Resting ECG',
        prep: 'No special preparation',
        instructions: 'Resting strip baseline rhythm check',
        source: 'manual',
      },
    ]
  );

  // Step 5: Schedule
  const [isFollowUpRequired, setIsFollowUpRequired] = useState(true);
  const [selectedFollowUpMode, setSelectedFollowUpMode] = useState(
    patient?.channel === 'Video' ? 'Video' : 'In-Person'
  );
  const [selectedFollowUpDate, setSelectedFollowUpDate] = useState('05 Oct 2026');
  const [selectedFollowUpDay, setSelectedFollowUpDay] = useState(5);
  const [selectedFollowUpTime, setSelectedFollowUpTime] = useState('11:30 AM');
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  // Final Confirmation Modal
  const [confirmationModal, setConfirmationModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const formatScheduleText = (mOn, mFood, aOn, aFood, nOn, nFood) => {
    const list = [];
    if (mOn) list.push('Morning (' + mFood + ')');
    if (aOn) list.push('Afternoon (' + aFood + ')');
    if (nOn) list.push('Night (' + nFood + ')');
    if (list.length === 0) return 'As needed (PRN)';
    return list.join(' · ');
  };

  const handleOpenScheduleModal = () => {
    setMorningOn(true);
    setMorningFood('After Food');
    setAfternoonOn(false);
    setAfternoonFood('After Food');
    setNightOn(true);
    setNightFood('After Food');
    setScheduleModalVisible(true);
  };

  const handleSaveSchedule = () => {
    const text = formatScheduleText(morningOn, morningFood, afternoonOn, afternoonFood, nightOn, nightFood);
    setSearchMedTiming(text);
    setScheduleModalVisible(false);
  };

  // Step 3 Select medicine: empty search typing field and reflect in medicine name
  const handleSelectDropdownMedicine = (med) => {
    setSearchMedName(med);
    setMedicineSearchQuery('');
    setShowMedDropdown(false);
  };

  const handleAddMedicine = () => {
    if (!searchMedName.trim()) return;
    const newRx = {
      id: 'rx-' + Date.now(),
      name: searchMedName.trim(),
      dosage: searchMedDosage.trim() || '1 tablet',
      frequency: searchMedFrequency.trim() || '1 daily',
      duration: searchMedDuration.trim() || '30 days',
      timing: searchMedTiming || 'Morning (After Food)',
      source: 'search',
    };
    setPrescriptions((prev) => [...prev, newRx]);
    setSearchMedName('');
    setMedicineSearchQuery('');
    setShowMedDropdown(false);
  };

  const handleRemoveMedicine = (id) => {
    setPrescriptions((prev) => prev.filter((m) => m.id !== id));
  };

  // Step 4 Select test: empty search typing field and reflect in test name
  const handleSelectDropdownTest = (testName) => {
    setSearchTestName(testName);
    setTestSearchQuery('');
    setShowTestDropdown(false);
  };

  const handleAddTest = () => {
    if (!searchTestName.trim()) return;
    const testItem = {
      id: 'test-' + Date.now(),
      name: searchTestName.trim(),
      prep: searchTestPrep.trim() || 'Normal diet',
      instructions: searchTestInstructions.trim() || 'Routine check',
      source: 'search',
    };
    setSelectedTests((prev) => [...prev, testItem]);
    setSearchTestName('');
    setSearchTestPrep('Fasting 10 hrs');
    setSearchTestInstructions('Routine Serum sample');
    setTestSearchQuery('');
    setShowTestDropdown(false);
  };

  const handleRemoveTest = (id) => {
    setSelectedTests((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFinalSubmit = () => {
    const rxSummary =
      prescriptions.length > 0
        ? 'e-prescription (' + prescriptions.length + ' medicines) dispatched'
        : 'e-prescription saved';
    const testSummary =
      selectedTests.length > 0 ? selectedTests.length + ' diagnostic tests ordered' : 'no lab tests required';
    const schedSummary = isFollowUpRequired
      ? 'next ' + selectedFollowUpMode + ' follow-up scheduled for ' + selectedFollowUpDate + ' at ' + selectedFollowUpTime
      : 'no return follow-up required';

    setConfirmationModal({
      visible: true,
      title: 'Consultation Details Sent to Patient',
      message:
        'Consultation details have been sent to ' +
        selectedPatient.name +
        '. Consultation notes saved, ' +
        rxSummary +
        ', ' +
        testSummary +
        ', and ' +
        schedSummary +
        '.',
    });

    if (typeof onFinalSubmit === 'function') {
      onFinalSubmit({
        patient: selectedPatient,
        consultNotesText,
        prescriptions,
        selectedTests,
        isFollowUpRequired,
        selectedFollowUpMode,
        selectedFollowUpDate,
        selectedFollowUpTime,
      });
    }
  };

  const stepsList = [
    { step: 1, label: 'Appointment Details', icon: 'person-circle' },
    { step: 2, label: 'Consult Notes', icon: 'document-text' },
    { step: 3, label: 'Prescribe', icon: 'medkit' },
    { step: 4, label: 'Tests', icon: 'flask' },
    { step: 5, label: 'Schedule', icon: 'calendar' },
  ];

  return (
    <View style={styles.bottomSlidePanelOverlay} className="doctor-bottom-panel-overlay">
      {/* Dimmed Background Overlay */}
      <TouchableOpacity
        style={styles.bottomSlidePanelBackdrop}
        onPress={handleClose}
        activeOpacity={1}
      />

      {/* Web Animation CSS */}
      {Platform.OS === 'web' && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes slideUpBottomPanelWeb {
            0% {
              transform: translateY(100%);
              opacity: 0.95;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .doctor-bottom-slide-panel {
            animation: slideUpBottomPanelWeb 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
            box-sizing: border-box !important;
          }
          .split-scrollable-col {
            scrollbar-width: thin !important;
            scrollbar-color: #CBD5E1 #F8FAFC !important;
          }
          .split-scrollable-col::-webkit-scrollbar {
            width: 6px !important;
            background: #F8FAFC !important;
          }
          .split-scrollable-col::-webkit-scrollbar-thumb {
            background: #CBD5E1 !important;
            border-radius: 4px !important;
          }
        `,
          }}
        />
      )}

      {/* Large Bottom Slide Panel (92vh height, rounded top corners) */}
      <View
        id="doctor-bottom-slide-panel"
        style={[
          styles.bottomSlidePanelSheet,
          Platform.OS === 'web' && {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100vw',
            maxWidth: '100vw',
            height: '92vh',
            maxHeight: '94vh',
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1.5,
            borderColor: '#CBD5E1',
            zIndex: 1000000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
          },
        ]}
        className="doctor-bottom-slide-panel"
      >
        {/* Top Drag Indicator */}
        <View style={styles.panelTopDragHandle} />

        {/* Top Header Bar */}
        <View style={styles.panelHeaderBar}>
          <View style={styles.panelHeaderLeft}>
            <Text style={styles.panelHeaderTitle}>Follow-up Consultation</Text>
            <View style={styles.panelHeaderMetaRow}>
              <Text style={styles.panelHeaderPatientName}>{selectedPatient.name}</Text>
              <Text style={styles.panelHeaderMetaText}>
                {selectedPatient.age} yrs · {selectedPatient.gender} · {selectedPatient.bloodGroup} · ID {selectedPatient.idTag || '#DC-991'}
              </Text>
              <View
                style={[
                  styles.channelPill,
                  selectedPatient.channel === 'Video' ? styles.channelPillVideo : styles.channelPillInPerson,
                ]}
              >
                <Ionicons
                  name={selectedPatient.channel === 'Video' ? 'videocam' : 'people'}
                  size={12}
                  color={selectedPatient.channel === 'Video' ? '#7C3AED' : '#0284C7'}
                />
                <Text
                  style={[
                    styles.channelPillText,
                    selectedPatient.channel === 'Video' ? styles.channelPillTextVideo : styles.channelPillTextInPerson,
                  ]}
                >
                  {selectedPatient.channel === 'Video' ? 'Video Call' : 'In-Person'}
                </Text>
              </View>
              <View style={styles.slotTimePill}>
                <Ionicons name="time-outline" size={12} color="#00B894" />
                <Text style={styles.slotTimePillText}>{selectedPatient.timeSlot || 'Today, 10:30 AM'}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.panelTopCloseBtn}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#081E3E" />
          </TouchableOpacity>
        </View>

        {/* 5-Step Stepper Progress Bar */}
        <View style={styles.stepperContainer}>
          {stepsList.map((s, idx) => {
            const isCompleted = s.step < currentStep;
            const isActive = s.step === currentStep;
            return (
              <React.Fragment key={'step-' + s.step}>
                <TouchableOpacity
                  style={styles.stepNode}
                  onPress={() => setCurrentStep(s.step)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isActive && styles.stepCircleActive,
                      isCompleted && styles.stepCircleCompleted,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.stepCircleText, isActive && styles.stepCircleTextActive]}>
                        {s.step}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.stepLabelActive,
                      isCompleted && styles.stepLabelCompleted,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>

                {idx < stepsList.length - 1 && (
                  <View
                    style={[
                      styles.stepperLine,
                      s.step < currentStep && styles.stepperLineActive,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* ============================================================== */}
        {/* MAIN BODY AREA                                                */}
        {/* ============================================================== */}
        <View style={styles.panelBodyContainer}>

          {/* ------------------------------------------------------------ */}
          {/* STEP 1: APPOINTMENT DETAILS (ZERO-SCROLL FIXED SCREEN FIT)    */}
          {/* ------------------------------------------------------------ */}
          {currentStep === 1 && (
            <View style={styles.step1ZeroScrollContainer}>
              <View style={styles.step1HeaderSmallRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={styles.stepPillBadge}>
                    <Text style={styles.stepPillBadgeText}>Step 1 of 5</Text>
                  </View>
                  <Text style={styles.stepMainHeadingSmall}>Appointment Details</Text>
                </View>
                <Text style={styles.stepSubHeadingSmall}>
                  All clinical info, visit details, vitals, records, history & privacy documents in one view.
                </Text>
              </View>

              {/* 3-Column Dense Layout so user does not need to scroll down */}
              <View style={styles.step1ThreeColGrid}>
                {/* COLUMN 1: Visit Details & Medical Information */}
                <View style={styles.step1Col}>
                  {/* Visit Details Box */}
                  <View style={styles.denseCard}>
                    <View style={styles.denseCardHeader}>
                      <Ionicons name="calendar-outline" size={15} color="#00B894" />
                      <Text style={styles.denseCardTitle}>Visit Details</Text>
                    </View>
                    <View style={styles.denseKeyValRow}>
                      <Text style={styles.denseKey}>Date:</Text>
                      <View style={styles.todayPillBadge}>
                        <Text style={styles.todayPillText}>Today · 28 Oct 2026</Text>
                      </View>
                    </View>
                    <View style={styles.denseKeyValRow}>
                      <Text style={styles.denseKey}>Timing:</Text>
                      <Text style={styles.denseValBold}>{selectedPatient.timeSlot || '10:30 AM - 11:00 AM'}</Text>
                    </View>
                    <View style={styles.denseKeyValRow}>
                      <Text style={styles.denseKey}>Consultation:</Text>
                      <View
                        style={[
                          styles.modeMiniBadge,
                          selectedPatient.channel === 'Video' ? styles.modeMiniVideo : styles.modeMiniInPerson,
                        ]}
                      >
                        <Ionicons
                          name={selectedPatient.channel === 'Video' ? 'videocam' : 'people'}
                          size={11}
                          color={selectedPatient.channel === 'Video' ? '#7C3AED' : '#0284C7'}
                        />
                        <Text
                          style={[
                            styles.modeMiniText,
                            selectedPatient.channel === 'Video' ? { color: '#7C3AED' } : { color: '#0284C7' },
                          ]}
                        >
                          {selectedPatient.channel === 'Video' ? 'Video Call' : 'In-Person'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.denseKeyValRow}>
                      <Text style={styles.denseKey}>Fees:</Text>
                      <Text style={[styles.denseValBold, { color: '#00B894' }]}>₹500 · Paid (Online)</Text>
                    </View>
                  </View>

                  {/* Medical Information Box */}
                  <View style={[styles.denseCard, { marginTop: 8, flex: 1 }]}>
                    <View style={styles.denseCardHeader}>
                      <Ionicons name="person-circle-outline" size={15} color="#1E3A8A" />
                      <Text style={styles.denseCardTitle}>Medical Information</Text>
                    </View>
                    <View style={styles.denseKeyValRow}>
                      <Text style={styles.denseKey}>Patient:</Text>
                      <Text style={styles.denseValBold}>{selectedPatient.name}</Text>
                    </View>
                    <View style={styles.denseKeyValRow}>
                      <Text style={styles.denseKey}>Demographics:</Text>
                      <Text style={styles.denseVal}>
                        {selectedPatient.age} yrs · {selectedPatient.gender} · Blood Group: <Text style={{ fontWeight: '700' }}>{selectedPatient.bloodGroup}</Text>
                      </Text>
                    </View>

                    {/* Allergies Highlight */}
                    <View style={styles.alertPillDense}>
                      <Ionicons name="warning" size={13} color="#DC2626" />
                      <Text style={styles.alertPillDenseText}>
                        Allergies: <Text style={{ fontWeight: '700' }}>{selectedPatient.allergies?.join(', ') || 'Sulfa Drugs'}</Text>
                      </Text>
                    </View>

                    {/* Current Medicines */}
                    <Text style={[styles.subMicroLabel, { marginTop: 6 }]}>Current Medicines:</Text>
                    <View style={styles.medBulletList}>
                      {(selectedPatient.medications || ['Atorvastatin 20mg (0-0-1)', 'Aspirin 75mg (0-1-0)']).map((med, idx) => (
                        <Text key={'cur-m-' + idx} style={styles.microBulletText} numberOfLines={1}>
                          • {med}
                        </Text>
                      ))}
                    </View>

                    {/* Chronic Conditions */}
                    <Text style={[styles.subMicroLabel, { marginTop: 6 }]}>Chronic Conditions:</Text>
                    <View style={styles.chipsMicroWrap}>
                      {(selectedPatient.chronicConditions || ['Dyslipidemia', 'Mild Hypertension']).map((c, cIdx) => (
                        <View key={'c-' + cIdx} style={styles.chronicChip}>
                          <Text style={styles.chronicChipText}>{c}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* COLUMN 2: Vitals & Medical Records */}
                <View style={styles.step1Col}>
                  {/* Clinical Vitals Box */}
                  <View style={styles.denseCard}>
                    <View style={styles.denseCardHeader}>
                      <Ionicons name="pulse" size={15} color="#DC2626" />
                      <Text style={styles.denseCardTitle}>Recorded Vitals</Text>
                    </View>
                    <View style={styles.vitalsRowGridDense}>
                      <View style={styles.vitalMiniBox}>
                        <Text style={styles.vitalMiniLabel}>Heart Rate</Text>
                        <Text style={styles.vitalMiniValue}>{selectedPatient.vitals?.bpm || '72'} <Text style={styles.vitalMiniUnit}>bpm</Text></Text>
                      </View>
                      <View style={styles.vitalMiniBox}>
                        <Text style={styles.vitalMiniLabel}>Blood Sugar</Text>
                        <Text style={styles.vitalMiniValue}>{selectedPatient.vitals?.sugar || '104'} <Text style={styles.vitalMiniUnit}>mg/dL</Text></Text>
                      </View>
                      <View style={styles.vitalMiniBox}>
                        <Text style={styles.vitalMiniLabel}>Blood Pressure</Text>
                        <Text style={styles.vitalMiniValue}>{selectedPatient.vitals?.bp || '126/82'} <Text style={styles.vitalMiniUnit}>mmHg</Text></Text>
                      </View>
                      <View style={styles.vitalMiniBox}>
                        <Text style={styles.vitalMiniLabel}>Weight</Text>
                        <Text style={styles.vitalMiniValue}>68 <Text style={styles.vitalMiniUnit}>kg</Text></Text>
                      </View>
                    </View>
                  </View>

                  {/* Medical Records Box */}
                  <View style={[styles.denseCard, { marginTop: 8, flex: 1 }]}>
                    <View style={styles.denseCardHeader}>
                      <Ionicons name="folder-open-outline" size={15} color="#0284C7" />
                      <Text style={styles.denseCardTitle}>Medical Records</Text>
                    </View>

                    {/* Consultation Notes item */}
                    <View style={styles.recordItemRow}>
                      <View style={styles.recordItemIconBox}>
                        <Ionicons name="document-text" size={14} color="#00B894" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recordItemName}>Previous Consultation Notes</Text>
                        <Text style={styles.recordItemSub} numberOfLines={1}>
                          Last visit: Routine lipid titration & BP stable
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.recordViewBtn}
                        onPress={() =>
                          setRecordPreviewModal({
                            visible: true,
                            title: 'Consultation Notes (15 Sep 2026)',
                            type: 'notes',
                            content:
                              'Patient presented for routine follow-up. Blood pressure controlled at 126/82 mmHg. Pulse 72 bpm. Statin therapy tolerated well without myalgia. Advised sodium restriction and 30 min daily walking.',
                          })
                        }
                      >
                        <Text style={styles.recordViewBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Lab Reports item */}
                    <View style={styles.recordItemRow}>
                      <View style={[styles.recordItemIconBox, { backgroundColor: '#F0F9FF' }]}>
                        <Ionicons name="flask" size={14} color="#0284C7" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recordItemName}>Lab Reports (Lipid Profile & CBC)</Text>
                        <Text style={styles.recordItemSub} numberOfLines={1}>
                          Total Cholesterol 185 mg/dL · HDL 48 mg/dL · Normal
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.recordViewBtn}
                        onPress={() =>
                          setRecordPreviewModal({
                            visible: true,
                            title: 'Diagnostic Lab Reports (15 Sep 2026)',
                            type: 'reports',
                            content:
                              '• Lipid Profile: Total Cholesterol 185 mg/dL, Triglycerides 142 mg/dL, HDL 48 mg/dL, LDL 108 mg/dL.\n• CBC: Hb 14.2 g/dL, WBC 6,800 /uL, Platelets 2.4 Lakhs.\n• Renal Function: Serum Creatinine 0.9 mg/dL, eGFR >90 mL/min.',
                          })
                        }
                      >
                        <Text style={styles.recordViewBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Prescription item */}
                    <View style={styles.recordItemRow}>
                      <View style={[styles.recordItemIconBox, { backgroundColor: '#F5F3FF' }]}>
                        <Ionicons name="medkit" size={14} color="#7C3AED" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recordItemName}>Prescription (Rx #7712)</Text>
                        <Text style={styles.recordItemSub} numberOfLines={1}>
                          2 active medications: Atorvastatin & Aspirin
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.recordViewBtn}
                        onPress={() =>
                          setRecordPreviewModal({
                            visible: true,
                            title: 'Active Prescription (Rx #7712)',
                            type: 'prescriptions',
                            content:
                              '1. Tab. Atorvastatin 20mg — 1 tablet daily at night after food (30 days)\n2. Tab. Aspirin 75mg — 1 tablet daily afternoon after food (30 days)\nPrecautions: Avoid excessive alcohol. Report muscle weakness.',
                          })
                        }
                      >
                        <Text style={styles.recordViewBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* COLUMN 3: Consultation History & Privacy Documents */}
                <View style={styles.step1Col}>
                  {/* Consultation History Box */}
                  <View style={styles.denseCard}>
                    <View style={styles.denseCardHeader}>
                      <Ionicons name="time-outline" size={15} color="#7C3AED" />
                      <Text style={styles.denseCardTitle}>Consultation History</Text>
                    </View>
                    <View style={styles.historyListDense}>
                      {/* In-person with date */}
                      <View style={styles.historyItemDense}>
                        <View style={[styles.modeDot, { backgroundColor: '#0284C7' }]} />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.historyModeTitle}>In-Person Consultation</Text>
                            <Text style={styles.historyDateText}>15 Sep 2026</Text>
                          </View>
                          <Text style={styles.historyDescText} numberOfLines={1}>
                            Clinic visit: Lipid panel review & BP titration
                          </Text>
                        </View>
                      </View>

                      {/* Video with date */}
                      <View style={styles.historyItemDense}>
                        <View style={[styles.modeDot, { backgroundColor: '#7C3AED' }]} />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.historyModeTitle}>Video Consultation</Text>
                            <Text style={styles.historyDateText}>28 Aug 2026</Text>
                          </View>
                          <Text style={styles.historyDescText} numberOfLines={1}>
                            Telehealth call: Routine dosage tolerance check
                          </Text>
                        </View>
                      </View>

                      {/* Additional in-person */}
                      <View style={styles.historyItemDense}>
                        <View style={[styles.modeDot, { backgroundColor: '#0284C7' }]} />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.historyModeTitle}>In-Person Consultation</Text>
                            <Text style={styles.historyDateText}>10 Jul 2026</Text>
                          </View>
                          <Text style={styles.historyDescText} numberOfLines={1}>
                            Initial baseline evaluation & diagnostic panel
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Privacy Documents & Doctor Request Box */}
                  <View style={[styles.denseCard, { marginTop: 8, flex: 1 }]}>
                    <View style={styles.denseCardHeader}>
                      <Ionicons name="shield-checkmark-outline" size={15} color="#00B894" />
                      <Text style={styles.denseCardTitle}>Privacy Documents</Text>
                    </View>

                    {/* Already uploaded documents */}
                    <View style={styles.privacyDocRow}>
                      <Ionicons name="checkmark-circle" size={13} color="#00B894" />
                      <Text style={styles.privacyDocTitle}>Govt ID Proof (Aadhaar / Passport)</Text>
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedBadgeText}>Verified</Text>
                      </View>
                    </View>
                    <View style={styles.privacyDocRow}>
                      <Ionicons name="checkmark-circle" size={13} color="#00B894" />
                      <Text style={styles.privacyDocTitle}>Health Insurance Card</Text>
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedBadgeText}>Verified</Text>
                      </View>
                    </View>

                    {/* Manual document request by doctor */}
                    <Text style={[styles.subMicroLabel, { marginTop: 8 }]}>
                      Doctor Manual Document Request:
                    </Text>
                    <View style={styles.manualDocRequestRow}>
                      <TextInput
                        style={styles.manualDocInput}
                        placeholder="Type doc name (e.g. Echo Report, Discharge Summary)..."
                        placeholderTextColor="#94A3B8"
                        value={manualDocInput}
                        onChangeText={setManualDocInput}
                      />
                      <TouchableOpacity
                        style={[styles.manualDocBtn, !manualDocInput.trim() && { opacity: 0.6 }]}
                        onPress={handleRequestDocument}
                        disabled={!manualDocInput.trim()}
                      >
                        <Ionicons name="send" size={11} color="#FFFFFF" />
                        <Text style={styles.manualDocBtnText}>Request</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Quick doc chips */}
                    <View style={styles.docQuickChipsRow}>
                      {['Echo Doppler', 'Discharge Summary', 'Old ECG Strip'].map((ch) => (
                        <TouchableOpacity
                          key={'ch-' + ch}
                          style={styles.docQuickChip}
                          onPress={() => setManualDocInput(ch)}
                        >
                          <Text style={styles.docQuickChipText}>+ {ch}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Requested list */}
                    {requestedDocs.length > 0 && (
                      <View style={styles.requestedDocsList}>
                        {requestedDocs.map((req) => (
                          <View key={req.id} style={styles.requestedDocItem}>
                            <Ionicons name="hourglass-outline" size={11} color="#D97706" />
                            <Text style={styles.requestedDocName} numberOfLines={1}>
                              {req.name}
                            </Text>
                            <Text style={styles.requestedDocStatus}>Requested</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 2: CONSULT NOTES (SPLIT: LEFT FUNCTIONALITY, RIGHT DETAILS) */}
          {/* ------------------------------------------------------------ */}
          {currentStep === 2 && (
            <View style={styles.splitStepContainer}>
              {/* Left Side: Functionality (Consult Notes Typing Field) */}
              <View style={[styles.splitCol, styles.splitColLeft]}>
                <View style={styles.stepTitleRowCompact}>
                  <View style={styles.stepPillBadge}>
                    <Text style={styles.stepPillBadgeText}>Step 2 of 5</Text>
                  </View>
                  <Text style={styles.stepMainHeading}>Consult Notes</Text>
                </View>
                <Text style={styles.stepSubHeadingCompact}>
                  Enter consultation notes below. What you type will reflect in real-time on the right.
                </Text>

                <View style={styles.typingFieldBox}>
                  <View style={styles.fieldLabelRow}>
                    <Ionicons name="create-outline" size={15} color="#00B894" />
                    <Text style={styles.fieldLabelBold}>Consultation Notes Entry</Text>
                  </View>
                  <TextInput
                    style={styles.consultNotesTextarea}
                    multiline={true}
                    placeholder="Enter detailed consultation notes, clinical findings, symptoms, and recommendations here..."
                    placeholderTextColor="#94A3B8"
                    value={consultNotesText}
                    onChangeText={setConsultNotesText}
                  />
                </View>

                {/* Quick Add-on Clinical Phrase Chips */}
                <Text style={[styles.subHeadingBold, { marginTop: 10, marginBottom: 6 }]}>
                  Quick Clinical Phrases (Tap to Add)
                </Text>
                <View style={styles.chipsWrap}>
                  {[
                    'Normal vitals and stable',
                    'Continue existing medications',
                    'Follow diet & sodium restriction',
                    'Daily blood pressure monitoring',
                    'Return if symptoms worsen',
                    'Hydrate well and regular exercise',
                  ].map((phrase, pIdx) => (
                    <TouchableOpacity
                      key={'p-' + pIdx}
                      style={styles.clinicalAddChip}
                      onPress={() => {
                        setConsultNotesText((prev) =>
                          prev ? prev + '\n• ' + phrase : '• ' + phrase
                        );
                      }}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="add-circle" size={13} color="#00B894" />
                      <Text style={styles.clinicalAddChipText}>{phrase}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.splitVerticalDivider} />

              {/* Right Side: Consult Notes Details (Live Reflection) */}
              <View style={[styles.splitCol, styles.splitColRight]}>
                <View style={styles.rightSectionHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="document-text" size={17} color="#1E3A8A" />
                    <Text style={styles.rightSectionTitle}>Consult Notes Details</Text>
                  </View>
                  <View style={styles.liveBadgePill}>
                    <View style={styles.liveGreenDot} />
                    <Text style={styles.liveBadgeText}>Live Reflection</Text>
                  </View>
                </View>
                <Text style={styles.rightSectionSub}>
                  Live formatted preview of consultation notes entered for {selectedPatient.name}.
                </Text>

                <View style={styles.reflectionCard}>
                  <View style={styles.reflectionCardHeader}>
                    <Ionicons name="medical" size={15} color="#00B894" />
                    <Text style={styles.reflectionDoctorTag}>Dr. Riya · Internal Medicine</Text>
                    <Text style={styles.reflectionDateTag}>Today</Text>
                  </View>

                  <View style={styles.reflectionDivider} />

                  <ScrollView
                    style={{ maxHeight: 340 }}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    showsVerticalScrollIndicator={true}
                    className="split-scrollable-col"
                  >
                    {consultNotesText.trim() ? (
                      <Text style={styles.reflectionBodyText}>{consultNotesText}</Text>
                    ) : (
                      <View style={styles.emptyPreviewBox}>
                        <Ionicons name="document-text-outline" size={28} color="#94A3B8" />
                        <Text style={styles.emptyPreviewText}>
                          Consultation notes typed on the left will reflect here in real-time.
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 3: PRESCRIBE (SPLIT: LEFT FUNCTIONALITY, RIGHT REQUIREMENTS) */}
          {/* ------------------------------------------------------------ */}
          {currentStep === 3 && (
            <View style={styles.splitStepContainer}>
              {/* Left Side: Functionality (Medicine Search, Dosage, Frequency, Duration, Schedule) */}
              <View style={[styles.splitCol, styles.splitColLeft]}>
                <View style={styles.stepTitleRowCompact}>
                  <View style={styles.stepPillBadge}>
                    <Text style={styles.stepPillBadgeText}>Step 3 of 5</Text>
                  </View>
                  <Text style={styles.stepMainHeading}>Prescribe / E-Prescription</Text>
                </View>
                <Text style={styles.stepSubHeadingCompact}>
                  Search medicines or enter details. Added items will appear in the Prescription Requirements on the right.
                </Text>

                {/* Medicine Search Box with increased height and highlighted Select button */}
                <Text style={styles.fieldSubTitle}>Search Formulary Catalogue</Text>
                <View style={styles.tallerSearchBox}>
                  <Ionicons name="search" size={18} color="#00B894" />
                  <TextInput
                    style={styles.tallerSearchInput}
                    placeholder="Search medicine (e.g. Paracetamol, Amlodipine, Telmisartan)..."
                    placeholderTextColor="#94A3B8"
                    value={medicineSearchQuery}
                    onChangeText={(t) => {
                      setMedicineSearchQuery(t);
                      setShowMedDropdown(true);
                    }}
                    onFocus={() => setShowMedDropdown(true)}
                  />
                  {medicineSearchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setMedicineSearchQuery('');
                        setShowMedDropdown(false);
                      }}
                    >
                      <Ionicons name="close-circle" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Dropdown with Highlighted Select Button */}
                {showMedDropdown && (
                  <View style={styles.highlightedDropdownCard}>
                    {COMMON_MEDICINES.filter(
                      (m) => !medicineSearchQuery || m.toLowerCase().includes(medicineSearchQuery.toLowerCase())
                    ).map((med) => (
                      <View key={med} style={styles.highlightedDropdownItemRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                          <Ionicons name="medical" size={14} color="#00B894" />
                          <Text style={styles.dropdownMedItemTitle}>{med}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.dropdownHighlightedSelectBtn}
                          onPress={() => handleSelectDropdownMedicine(med)}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.dropdownHighlightedSelectText}>Select</Text>
                          <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* Medicine Name Field (Fetched from search or manually entered) */}
                <Text style={[styles.fieldSubTitle, { marginTop: 8 }]}>
                  Medicine Name <Text style={{ color: '#DC2626' }}>*</Text>
                </Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={styles.textInputBox}
                    placeholder="Selected medicine from search or type name..."
                    placeholderTextColor="#94A3B8"
                    value={searchMedName}
                    onChangeText={setSearchMedName}
                  />
                  {searchMedName.length > 0 && (
                    <TouchableOpacity
                      style={{ position: 'absolute', right: 10, top: 10 }}
                      onPress={() => setSearchMedName('')}
                    >
                      <Ionicons name="close-circle" size={17} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Dosage & Frequency Two-column dense row */}
                <View style={styles.twoColInputRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldSubTitle}>Dosage</Text>
                    <TextInput
                      style={styles.textInputBox}
                      placeholder="e.g. 1 tablet"
                      placeholderTextColor="#94A3B8"
                      value={searchMedDosage}
                      onChangeText={setSearchMedDosage}
                    />
                    <View style={styles.addUpChipsRow}>
                      {['1 tablet', '3 tablet', '7 tablet', '1 capsule'].map((d) => (
                        <TouchableOpacity
                          key={'dos-' + d}
                          style={[styles.addUpChip, searchMedDosage === d && styles.addUpChipActive]}
                          onPress={() => setSearchMedDosage(d)}
                        >
                          <Text style={[styles.addUpChipText, searchMedDosage === d && styles.addUpChipTextActive]}>
                            + {d}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldSubTitle}>Frequency</Text>
                    <TextInput
                      style={styles.textInputBox}
                      placeholder="e.g. 1 daily"
                      placeholderTextColor="#94A3B8"
                      value={searchMedFrequency}
                      onChangeText={setSearchMedFrequency}
                    />
                    <View style={styles.addUpChipsRow}>
                      {['1 daily', '2 daily', '3 daily'].map((f) => (
                        <TouchableOpacity
                          key={'freq-' + f}
                          style={[styles.addUpChip, searchMedFrequency === f && styles.addUpChipActive]}
                          onPress={() => setSearchMedFrequency(f)}
                        >
                          <Text style={[styles.addUpChipText, searchMedFrequency === f && styles.addUpChipTextActive]}>
                            + {f}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Duration */}
                <Text style={[styles.fieldSubTitle, { marginTop: 6 }]}>Duration</Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="e.g. 3 days, 5 days, 30 days"
                  placeholderTextColor="#94A3B8"
                  value={searchMedDuration}
                  onChangeText={setSearchMedDuration}
                />
                <View style={styles.addUpChipsRow}>
                  {['3 days', '5 days', '7 days', '14 days', '30 days'].map((dur) => (
                    <TouchableOpacity
                      key={'dur-' + dur}
                      style={[styles.addUpChip, searchMedDuration === dur && styles.addUpChipActive]}
                      onPress={() => setSearchMedDuration(dur)}
                    >
                      <Text style={[styles.addUpChipText, searchMedDuration === dur && styles.addUpChipTextActive]}>
                        + {dur}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Schedule Timings with Configure button below */}
                <Text style={[styles.fieldSubTitle, { marginTop: 6 }]}>Schedule Timings</Text>
                <View style={styles.scheduleRowBoxCompact}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scheduleRowValueText} numberOfLines={1}>
                      {searchMedTiming}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.scheduleAddBtn}
                    onPress={handleOpenScheduleModal}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="time" size={13} color="#081E3E" />
                    <Text style={styles.scheduleAddBtnText}>⏱ Configure Timings</Text>
                  </TouchableOpacity>
                </View>

                {/* Add to Prescription Button */}
                <TouchableOpacity
                  style={[styles.primaryActionBtn, !searchMedName.trim() && { opacity: 0.6 }]}
                  onPress={handleAddMedicine}
                  disabled={!searchMedName.trim()}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>+ Add to Prescription</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.splitVerticalDivider} />

              {/* Right Side: Prescription Requirements List */}
              <View style={[styles.splitCol, styles.splitColRight]}>
                <View style={styles.rightSectionHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="medkit" size={17} color="#00B894" />
                    <Text style={styles.rightSectionTitle}>Prescription Requirements ({prescriptions.length})</Text>
                  </View>
                </View>
                <Text style={styles.rightSectionSub}>
                  Medicines added to prescription for {selectedPatient.name}.
                </Text>

                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={true}
                  className="split-scrollable-col"
                >
                  {prescriptions.length === 0 ? (
                    <View style={styles.emptyItemsBox}>
                      <Ionicons name="medkit-outline" size={32} color="#94A3B8" />
                      <Text style={styles.emptyItemsText}>
                        No medicines added yet. Search or enter medicine details on the left and tap "+ Add to Prescription".
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.prescriptionsList}>
                      {prescriptions.map((item) => (
                        <View key={item.id} style={styles.rxItemCard}>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Ionicons name="medical" size={14} color="#00B894" />
                              <Text style={styles.rxMedName}>{item.name}</Text>
                            </View>
                            <Text style={styles.rxMetaDetails}>
                              Dosage: {item.dosage} · Frequency: {item.frequency} · Duration: {item.duration}
                            </Text>
                            <Text style={styles.rxTimingText}>⏱ {item.timing}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.rxRemoveBtn}
                            onPress={() => handleRemoveMedicine(item.id)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="trash-outline" size={15} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 4: TESTS (SPLIT: LEFT FUNCTIONALITY, RIGHT REQUIREMENTS) */}
          {/* ------------------------------------------------------------ */}
          {currentStep === 4 && (
            <View style={styles.splitStepContainer}>
              {/* Left Side: Functionality (Test Search, Preparation, Instructions) */}
              <View style={[styles.splitCol, styles.splitColLeft]}>
                <View style={styles.stepTitleRowCompact}>
                  <View style={styles.stepPillBadge}>
                    <Text style={styles.stepPillBadgeText}>Step 4 of 5</Text>
                  </View>
                  <Text style={styles.stepMainHeading}>Add Diagnostic Tests</Text>
                </View>
                <Text style={styles.stepSubHeadingCompact}>
                  Search laboratory and radiology tests and add preparation & technician instructions.
                </Text>

                {/* Category Selector Tabs */}
                <View style={styles.categoryTabRow}>
                  <TouchableOpacity
                    style={[styles.categoryTabBtn, activeTestCategory === 'lab' && styles.categoryTabBtnActive]}
                    onPress={() => setActiveTestCategory('lab')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="flask"
                      size={14}
                      color={activeTestCategory === 'lab' ? '#00B894' : '#64748B'}
                    />
                    <Text style={[styles.categoryTabText, activeTestCategory === 'lab' && styles.categoryTabTextActive]}>
                      Laboratory Tests
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.categoryTabBtn, activeTestCategory === 'radiology' && styles.categoryTabBtnActive]}
                    onPress={() => setActiveTestCategory('radiology')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="images"
                      size={14}
                      color={activeTestCategory === 'radiology' ? '#00B894' : '#64748B'}
                    />
                    <Text style={[styles.categoryTabText, activeTestCategory === 'radiology' && styles.categoryTabTextActive]}>
                      Radiology Tests
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Search Box with increased height & highlighted Select button */}
                <View style={styles.tallerSearchBox}>
                  <Ionicons name="flask-outline" size={18} color="#00B894" />
                  <TextInput
                    style={styles.tallerSearchInput}
                    placeholder={'Search ' + (activeTestCategory === 'lab' ? 'lab tests (CBC, Lipid, HbA1c)...' : 'radiology (X-Ray, Echo, MRI)...')}
                    placeholderTextColor="#94A3B8"
                    value={testSearchQuery}
                    onChangeText={(t) => {
                      setTestSearchQuery(t);
                      setShowTestDropdown(true);
                    }}
                    onFocus={() => setShowTestDropdown(true)}
                  />
                  {testSearchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setTestSearchQuery('');
                        setShowTestDropdown(false);
                      }}
                    >
                      <Ionicons name="close-circle" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Dropdown with Highlighted Select Button */}
                {showTestDropdown && (
                  <View style={styles.highlightedDropdownCard}>
                    {(activeTestCategory === 'lab' ? COMMON_TESTS : COMMON_RADIOLOGY_TESTS)
                      .filter((t) => !testSearchQuery || t.toLowerCase().includes(testSearchQuery.toLowerCase()))
                      .map((test) => (
                        <View key={test} style={styles.highlightedDropdownItemRow}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                            <Ionicons name="flask" size={14} color="#081E3E" />
                            <Text style={styles.dropdownMedItemTitle}>{test}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.dropdownHighlightedSelectBtn}
                            onPress={() => handleSelectDropdownTest(test)}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.dropdownHighlightedSelectText}>Select</Text>
                            <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ))}
                  </View>
                )}

                {/* Test Name Field (Fetched from search or typed) */}
                <Text style={[styles.fieldSubTitle, { marginTop: 8 }]}>
                  Test Name <Text style={{ color: '#DC2626' }}>*</Text>
                </Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={styles.textInputBox}
                    placeholder="Selected test or enter test name..."
                    placeholderTextColor="#94A3B8"
                    value={searchTestName}
                    onChangeText={setSearchTestName}
                  />
                  {searchTestName.length > 0 && (
                    <TouchableOpacity
                      style={{ position: 'absolute', right: 10, top: 10 }}
                      onPress={() => setSearchTestName('')}
                    >
                      <Ionicons name="close-circle" size={17} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.addUpChipsRow}>
                  {['Blood Panel', 'Serum Tube', 'Urine Sample', 'Imaging / ECG'].map((ch) => (
                    <TouchableOpacity
                      key={'tname-' + ch}
                      style={styles.addUpChip}
                      onPress={() => setSearchTestName((prev) => (prev ? prev + ' - ' + ch : ch))}
                    >
                      <Text style={styles.addUpChipText}>+ {ch}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Patient Preparation / Diet Requirement */}
                <Text style={[styles.fieldSubTitle, { marginTop: 6 }]}>
                  Patient Preparation / Diet Requirement
                </Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="e.g. Fasting 10 hrs, drinking only water..."
                  placeholderTextColor="#94A3B8"
                  value={searchTestPrep}
                  onChangeText={setSearchTestPrep}
                />
                <View style={styles.addUpChipsRow}>
                  {['fasting 10 hrs', 'drinking only water', 'normal diet', 'avoid caffeine'].map((prep) => (
                    <TouchableOpacity
                      key={'prep-' + prep}
                      style={[styles.addUpChip, searchTestPrep === prep && styles.addUpChipActive]}
                      onPress={() => setSearchTestPrep(prep)}
                    >
                      <Text style={[styles.addUpChipText, searchTestPrep === prep && styles.addUpChipTextActive]}>
                        + {prep}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Clinical Instructions for Lab Technician */}
                <Text style={[styles.fieldSubTitle, { marginTop: 6 }]}>
                  Clinical Instructions for Lab Technician
                </Text>
                <TextInput
                  style={styles.textInputBox}
                  placeholder="e.g. Urgent STAT reporting, routine serum sample..."
                  placeholderTextColor="#94A3B8"
                  value={searchTestInstructions}
                  onChangeText={setSearchTestInstructions}
                />
                <View style={styles.addUpChipsRow}>
                  {['Urgent STAT', 'Routine Serum', 'EDTA Vial', 'Report by evening'].map((inst) => (
                    <TouchableOpacity
                      key={'inst-' + inst}
                      style={[styles.addUpChip, searchTestInstructions === inst && styles.addUpChipActive]}
                      onPress={() => setSearchTestInstructions(inst)}
                    >
                      <Text style={[styles.addUpChipText, searchTestInstructions === inst && styles.addUpChipTextActive]}>
                        + {inst}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Add to Test Required Button */}
                <TouchableOpacity
                  style={[styles.primaryActionBtn, !searchTestName.trim() && { opacity: 0.6 }]}
                  onPress={handleAddTest}
                  disabled={!searchTestName.trim()}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>+ Add to Test Required</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.splitVerticalDivider} />

              {/* Right Side: Test Requirement Lists */}
              <View style={[styles.splitCol, styles.splitColRight]}>
                <View style={styles.rightSectionHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="flask" size={17} color="#00B894" />
                    <Text style={styles.rightSectionTitle}>Test Requirement Lists ({selectedTests.length})</Text>
                  </View>
                </View>
                <Text style={styles.rightSectionSub}>
                  Diagnostic investigations requested for {selectedPatient.name}.
                </Text>

                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={true}
                  className="split-scrollable-col"
                >
                  {selectedTests.length === 0 ? (
                    <View style={styles.emptyItemsBox}>
                      <Ionicons name="flask-outline" size={32} color="#94A3B8" />
                      <Text style={styles.emptyItemsText}>
                        No diagnostic tests added yet. Search or enter tests on the left and tap "+ Add to Test Required".
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.prescriptionsList}>
                      {selectedTests.map((item) => (
                        <View key={item.id} style={styles.testItemCard}>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Ionicons name="flask" size={14} color="#00B894" />
                              <Text style={styles.testItemName}>{item.name}</Text>
                            </View>
                            <Text style={styles.testMetaDetail}>
                              Diet / Prep: <Text style={{ color: '#081E3E', fontWeight: '700' }}>{item.prep}</Text>
                            </Text>
                            <Text style={styles.testMetaDetail}>
                              Instructions: <Text style={{ color: '#081E3E' }}>{item.instructions}</Text>
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.rxRemoveBtn}
                            onPress={() => handleRemoveTest(item.id)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="trash-outline" size={15} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 5: SCHEDULE (SPLIT: LEFT FUNCTIONALITY, RIGHT DETAILS)  */}
          {/* ------------------------------------------------------------ */}
          {currentStep === 5 && (
            <View style={styles.splitStepContainer}>
              {/* Left Side: Functionality (Schedule Configuration) */}
              <View style={[styles.splitCol, styles.splitColLeft]}>
                <View style={styles.stepTitleRowCompact}>
                  <View style={styles.stepPillBadge}>
                    <Text style={styles.stepPillBadgeText}>Step 5 of 5</Text>
                  </View>
                  <Text style={styles.stepMainHeading}>Schedule Follow-Up</Text>
                </View>
                <Text style={styles.stepSubHeadingCompact}>
                  Select if a follow-up visit is required and configure return consultation details.
                </Text>

                {/* Is follow-up required? Yes / No */}
                <Text style={[styles.inputLabel, { marginTop: 8 }]}>Is follow-up required?</Text>
                <View style={styles.boolToggleRow}>
                  <TouchableOpacity
                    style={[styles.boolToggleBtn, isFollowUpRequired && styles.boolToggleBtnActiveYes]}
                    onPress={() => setIsFollowUpRequired(true)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={isFollowUpRequired ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={16}
                      color={isFollowUpRequired ? '#FFFFFF' : '#1E3A8A'}
                    />
                    <Text style={[styles.boolToggleText, isFollowUpRequired && styles.boolToggleTextActive]}>
                      Yes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.boolToggleBtn, !isFollowUpRequired && styles.boolToggleBtnActiveNo]}
                    onPress={() => setIsFollowUpRequired(false)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={!isFollowUpRequired ? 'close-circle' : 'close-circle-outline'}
                      size={16}
                      color={!isFollowUpRequired ? '#FFFFFF' : '#64748B'}
                    />
                    <Text style={[styles.boolToggleText, !isFollowUpRequired && styles.boolToggleTextActive]}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* If Follow-up is required, display scheduling controls */}
                {isFollowUpRequired ? (
                  <View style={styles.dualCardBox}>
                    {/* Follow-up Type Mode */}
                    <Text style={styles.fieldSubTitle}>Consultation Type</Text>
                    <View style={styles.modeToggleRow}>
                      <TouchableOpacity
                        style={[styles.modeToggleBtn, selectedFollowUpMode === 'In-Person' && styles.modeToggleBtnActive]}
                        onPress={() => setSelectedFollowUpMode('In-Person')}
                        activeOpacity={0.85}
                      >
                        <Ionicons
                          name="people"
                          size={15}
                          color={selectedFollowUpMode === 'In-Person' ? '#FFFFFF' : '#081E3E'}
                        />
                        <Text
                          style={[
                            styles.modeToggleText,
                            selectedFollowUpMode === 'In-Person' && styles.modeToggleTextActive,
                          ]}
                        >
                          Follow-up Consultation
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modeToggleBtn, selectedFollowUpMode === 'Video' && styles.modeToggleBtnActive]}
                        onPress={() => setSelectedFollowUpMode('Video')}
                        activeOpacity={0.85}
                      >
                        <Ionicons
                          name="videocam"
                          size={15}
                          color={selectedFollowUpMode === 'Video' ? '#FFFFFF' : '#081E3E'}
                        />
                        <Text
                          style={[
                            styles.modeToggleText,
                            selectedFollowUpMode === 'Video' && styles.modeToggleTextActive,
                          ]}
                        >
                          Video Consultation
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Follow-up Date Row with Calendar Trigger Button */}
                    <Text style={[styles.fieldSubTitle, { marginTop: 10 }]}>Follow-up Date</Text>
                    <View style={styles.datePickerRow}>
                      <View style={styles.dateDisplayBox}>
                        <Ionicons name="calendar" size={16} color="#00B894" />
                        <Text style={styles.dateDisplayText}>{selectedFollowUpDate}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.calendarTriggerBtn}
                        onPress={() => setCalendarModalVisible(true)}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="calendar-outline" size={15} color="#081E3E" />
                        <Text style={styles.calendarTriggerBtnText}>📅 Calendar</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Available Time Slots */}
                    <Text style={[styles.fieldSubTitle, { marginTop: 10 }]}>Available Time Slots</Text>
                    <View style={styles.timeSlotsRow}>
                      {['10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'].map((time) => {
                        const isTimeSelected = selectedFollowUpTime === time;
                        return (
                          <TouchableOpacity
                            key={time}
                            style={[styles.timeSlotPill, isTimeSelected && styles.timeSlotPillSelected]}
                            onPress={() => setSelectedFollowUpTime(time)}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.timeSlotPillText,
                                isTimeSelected && styles.timeSlotPillTextSelected,
                              ]}
                            >
                              {time}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : (
                  <View style={styles.noFollowUpNoticeBox}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#00B894" />
                    <Text style={styles.noFollowUpNoticeText}>
                      Follow-up is marked as NOT required. The consultation will be concluded upon submission without a return appointment booking.
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.splitVerticalDivider} />

              {/* Right Side: Details / Review Summary */}
              <View style={[styles.splitCol, styles.splitColRight]}>
                <View style={styles.rightSectionHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="checkmark-done-circle" size={17} color="#00B894" />
                    <Text style={styles.rightSectionTitle}>Details Summary</Text>
                  </View>
                </View>
                <Text style={styles.rightSectionSub}>
                  Complete summary of notes, prescribed medicines, test requirements, and follow-up booking.
                </Text>

                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={true}
                  className="split-scrollable-col"
                >
                  {/* 1. Consultation Notes */}
                  <View style={styles.reviewSummaryCard}>
                    <View style={styles.reviewSummaryCardHeader}>
                      <Ionicons name="document-text" size={15} color="#00B894" />
                      <Text style={styles.reviewSummaryCardTitle}>1. Consultation Notes</Text>
                    </View>
                    <Text style={styles.reviewSummaryCardBody}>
                      {consultNotesText.trim() ? consultNotesText : 'No consultation notes entered.'}
                    </Text>
                  </View>

                  {/* 2. Prescribed Medicines */}
                  <View style={styles.reviewSummaryCard}>
                    <View style={styles.reviewSummaryCardHeader}>
                      <Ionicons name="medkit" size={15} color="#00B894" />
                      <Text style={styles.reviewSummaryCardTitle}>
                        2. Prescribed Medicines ({prescriptions.length})
                      </Text>
                    </View>
                    {prescriptions.length === 0 ? (
                      <Text style={[styles.reviewSummaryCardBody, { fontStyle: 'italic', color: '#94A3B8' }]}>
                        No medications prescribed.
                      </Text>
                    ) : (
                      prescriptions.map((rx, rIdx) => (
                        <Text key={'rev-rx-' + rIdx} style={styles.reviewSummaryCardBody}>
                          • <Text style={{ fontWeight: '700' }}>{rx.name}</Text> — {rx.dosage}, {rx.frequency}, {rx.duration} · {rx.timing}
                        </Text>
                      ))
                    )}
                  </View>

                  {/* 3. Test Requirements */}
                  <View style={styles.reviewSummaryCard}>
                    <View style={styles.reviewSummaryCardHeader}>
                      <Ionicons name="flask" size={15} color="#1E3A8A" />
                      <Text style={styles.reviewSummaryCardTitle}>
                        3. Test Requirements ({selectedTests.length})
                      </Text>
                    </View>
                    {selectedTests.length === 0 ? (
                      <Text style={[styles.reviewSummaryCardBody, { fontStyle: 'italic', color: '#94A3B8' }]}>
                        No diagnostic tests ordered.
                      </Text>
                    ) : (
                      selectedTests.map((t, tIdx) => (
                        <Text key={'rev-test-' + tIdx} style={styles.reviewSummaryCardBody}>
                          • <Text style={{ fontWeight: '700' }}>{t.name}</Text> (Prep: {t.prep} · Inst: {t.instructions})
                        </Text>
                      ))
                    )}
                  </View>

                  {/* 4. Follow-up Details */}
                  <View style={styles.reviewSummaryCard}>
                    <View style={styles.reviewSummaryCardHeader}>
                      <Ionicons name="calendar" size={15} color="#1E3A8A" />
                      <Text style={styles.reviewSummaryCardTitle}>4. Follow-up Booking</Text>
                    </View>
                    <Text style={styles.reviewSummaryCardBody}>
                      {isFollowUpRequired
                        ? 'Follow-up: Yes · ' + selectedFollowUpMode + ' Consultation · Fixed for ' + selectedFollowUpDate + ' at ' + selectedFollowUpTime
                        : 'Follow-up: No (None scheduled)'}
                    </Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

        </View>

        {/* ============================================================== */}
        {/* DEDICATED PERMANENTLY VISIBLE BOTTOM ACTION BAR                */}
        {/* ============================================================== */}
        <View style={styles.panelBottomActionBar}>
          {currentStep === 1 && (
            <>
              <TouchableOpacity
                style={styles.bottomBarBackBtn}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#081E3E" />
                <Text style={styles.bottomBarBackBtnText}>Back</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={styles.bottomBarSkipBtn}
                  onPress={() => setCurrentStep(2)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bottomBarSkipBtnText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBarPrimaryBtn}
                  onPress={() => setCurrentStep(2)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bottomBarPrimaryBtnText}>Save & Continue to Consult</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </>
          )}

          {currentStep === 2 && (
            <>
              <TouchableOpacity
                style={styles.bottomBarBackBtn}
                onPress={() => setCurrentStep(1)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#081E3E" />
                <Text style={styles.bottomBarBackBtnText}>Back</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={styles.bottomBarSkipBtn}
                  onPress={() => setCurrentStep(3)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bottomBarSkipBtnText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBarPrimaryBtn}
                  onPress={() => setCurrentStep(3)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bottomBarPrimaryBtnText}>Save & Continue to Prescribe</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </>
          )}

          {currentStep === 3 && (
            <>
              <TouchableOpacity
                style={styles.bottomBarBackBtn}
                onPress={() => setCurrentStep(2)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#081E3E" />
                <Text style={styles.bottomBarBackBtnText}>Back</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={styles.bottomBarSkipBtn}
                  onPress={() => setCurrentStep(4)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bottomBarSkipBtnText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBarPrimaryBtn}
                  onPress={() => setCurrentStep(4)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bottomBarPrimaryBtnText}>Save & Continue to Tests</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </>
          )}

          {currentStep === 4 && (
            <>
              <TouchableOpacity
                style={styles.bottomBarBackBtn}
                onPress={() => setCurrentStep(3)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#081E3E" />
                <Text style={styles.bottomBarBackBtnText}>Back</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={styles.bottomBarSkipBtn}
                  onPress={() => setCurrentStep(5)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bottomBarSkipBtnText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBarPrimaryBtn}
                  onPress={() => setCurrentStep(5)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bottomBarPrimaryBtnText}>Save & Continue to Schedule</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </>
          )}

          {currentStep === 5 && (
            <>
              <TouchableOpacity
                style={styles.bottomBarBackBtn}
                onPress={() => setCurrentStep(4)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#081E3E" />
                <Text style={styles.bottomBarBackBtnText}>Back</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={styles.bottomBarSkipBtn}
                  onPress={handleFinalSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bottomBarSkipBtnText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bottomBarPrimaryBtn, { backgroundColor: '#00B894' }]}
                  onPress={handleFinalSubmit}
                  activeOpacity={0.88}
                >
                  <Ionicons name="checkmark-done-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.bottomBarPrimaryBtnText}>Submit Consultation</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* ============================================================== */}
      {/* MEDICAL RECORD PREVIEW MODAL                                   */}
      {/* ============================================================== */}
      <Modal
        visible={recordPreviewModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRecordPreviewModal({ visible: false, title: '', type: '', content: '' })}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.recordPreviewCard}>
            <View style={styles.scheduleModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleModalTitle}>{recordPreviewModal.title}</Text>
                <Text style={styles.scheduleModalSub}>Patient: {selectedPatient.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setRecordPreviewModal({ visible: false, title: '', type: '', content: '' })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 280, marginVertical: 12 }}>
              <Text style={styles.recordModalBodyText}>{recordPreviewModal.content}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.confirmOkBtn}
              onPress={() => setRecordPreviewModal({ visible: false, title: '', type: '', content: '' })}
            >
              <Text style={styles.confirmOkBtnText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MEDICINE SCHEDULE POP-UP MODAL                                 */}
      {/* ============================================================== */}
      <Modal
        visible={scheduleModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.scheduleModalCard}>
            <View style={styles.scheduleModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleModalTitle}>Medicine Schedule Timings</Text>
                <Text style={styles.scheduleModalSub} numberOfLines={1}>
                  {searchMedName || 'Formulary Medicine'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setScheduleModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* 1. Morning */}
            <View style={[styles.timeSlotCard, morningOn && styles.timeSlotCardActive]}>
              <View style={styles.timeSlotTopRow}>
                <View style={styles.timeSlotTitleRow}>
                  <View style={[styles.timeSlotIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="sunny" size={15} color="#D97706" />
                  </View>
                  <Text style={styles.timeSlotName}>Morning</Text>
                </View>
                <TouchableOpacity
                  style={[styles.togglePillBtn, morningOn ? styles.togglePillOn : styles.togglePillOff]}
                  onPress={() => setMorningOn(!morningOn)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.togglePillText, morningOn ? styles.togglePillTextOn : styles.togglePillTextOff]}>
                    {morningOn ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              {morningOn && (
                <View style={styles.foodToggleRow}>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, morningFood === 'Before Food' && styles.foodToggleBtnActive]}
                    onPress={() => setMorningFood('Before Food')}
                  >
                    <Text style={[styles.foodToggleText, morningFood === 'Before Food' && styles.foodToggleTextActive]}>
                      Before Food
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, morningFood === 'After Food' && styles.foodToggleBtnActive]}
                    onPress={() => setMorningFood('After Food')}
                  >
                    <Text style={[styles.foodToggleText, morningFood === 'After Food' && styles.foodToggleTextActive]}>
                      After Food
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 2. Afternoon */}
            <View style={[styles.timeSlotCard, afternoonOn && styles.timeSlotCardActive]}>
              <View style={styles.timeSlotTopRow}>
                <View style={styles.timeSlotTitleRow}>
                  <View style={[styles.timeSlotIconBox, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="partly-sunny" size={15} color="#0284C7" />
                  </View>
                  <Text style={styles.timeSlotName}>Afternoon</Text>
                </View>
                <TouchableOpacity
                  style={[styles.togglePillBtn, afternoonOn ? styles.togglePillOn : styles.togglePillOff]}
                  onPress={() => setAfternoonOn(!afternoonOn)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.togglePillText, afternoonOn ? styles.togglePillTextOn : styles.togglePillTextOff]}>
                    {afternoonOn ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              {afternoonOn && (
                <View style={styles.foodToggleRow}>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, afternoonFood === 'Before Food' && styles.foodToggleBtnActive]}
                    onPress={() => setAfternoonFood('Before Food')}
                  >
                    <Text style={[styles.foodToggleText, afternoonFood === 'Before Food' && styles.foodToggleTextActive]}>
                      Before Food
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, afternoonFood === 'After Food' && styles.foodToggleBtnActive]}
                    onPress={() => setAfternoonFood('After Food')}
                  >
                    <Text style={[styles.foodToggleText, afternoonFood === 'After Food' && styles.foodToggleTextActive]}>
                      After Food
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 3. Night */}
            <View style={[styles.timeSlotCard, nightOn && styles.timeSlotCardActive]}>
              <View style={styles.timeSlotTopRow}>
                <View style={styles.timeSlotTitleRow}>
                  <View style={[styles.timeSlotIconBox, { backgroundColor: '#EDE9FE' }]}>
                    <Ionicons name="moon" size={15} color="#7C3AED" />
                  </View>
                  <Text style={styles.timeSlotName}>Night</Text>
                </View>
                <TouchableOpacity
                  style={[styles.togglePillBtn, nightOn ? styles.togglePillOn : styles.togglePillOff]}
                  onPress={() => setNightOn(!nightOn)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.togglePillText, nightOn ? styles.togglePillTextOn : styles.togglePillTextOff]}>
                    {nightOn ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              {nightOn && (
                <View style={styles.foodToggleRow}>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, nightFood === 'Before Food' && styles.foodToggleBtnActive]}
                    onPress={() => setNightFood('Before Food')}
                  >
                    <Text style={[styles.foodToggleText, nightFood === 'Before Food' && styles.foodToggleTextActive]}>
                      Before Food
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, nightFood === 'After Food' && styles.foodToggleBtnActive]}
                    onPress={() => setNightFood('After Food')}
                  >
                    <Text style={[styles.foodToggleText, nightFood === 'After Food' && styles.foodToggleTextActive]}>
                      After Food
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.scheduleSummaryPill}>
              <Ionicons name="information-circle" size={15} color="#00B894" />
              <Text style={styles.scheduleSummaryText} numberOfLines={1}>
                {formatScheduleText(morningOn, morningFood, afternoonOn, afternoonFood, nightOn, nightFood)}
              </Text>
            </View>

            <View style={styles.scheduleModalFooter}>
              <TouchableOpacity
                style={styles.scheduleCancelBtn}
                onPress={() => setScheduleModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.scheduleCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scheduleSaveBtn}
                onPress={handleSaveSchedule}
                activeOpacity={0.88}
              >
                <Ionicons name="checkmark-done" size={15} color="#FFFFFF" />
                <Text style={styles.scheduleSaveBtnText}>Save Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* CALENDAR PICKER POP-UP MODAL                                   */}
      {/* ============================================================== */}
      <Modal
        visible={calendarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.calendarModalCard}>
            <View style={styles.calModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.calModalTitle}>Select Follow-up Date</Text>
                <Text style={styles.calModalSub}>Choose next review consultation date</Text>
              </View>
              <TouchableOpacity
                onPress={() => setCalendarModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarMonthHeader}>
              <TouchableOpacity style={styles.calNavBtn}>
                <Ionicons name="chevron-back" size={16} color="#081E3E" />
              </TouchableOpacity>
              <Text style={styles.calMonthTitle}>October 2026</Text>
              <TouchableOpacity style={styles.calNavBtn}>
                <Ionicons name="chevron-forward" size={16} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.calWeekdaysRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <Text key={d} style={styles.calWeekdayLabel}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.calDaysGrid}>
              {calendarDaysMatrix.map((week, wIdx) => (
                <View key={'week-' + wIdx} style={styles.calWeekRow}>
                  {week.map((dayNum, dIdx) => {
                    if (dayNum === null) {
                      return <View key={'empty-' + dIdx} style={styles.calDayCell} />;
                    }
                    const isSelected = selectedFollowUpDay === dayNum;
                    return (
                      <TouchableOpacity
                        key={'day-' + dayNum}
                        style={[styles.calDayCell, isSelected && styles.calDayCellSelected]}
                        onPress={() => {
                          setSelectedFollowUpDay(dayNum);
                          const paddedDay = dayNum < 10 ? '0' + dayNum : '' + dayNum;
                          setSelectedFollowUpDate(paddedDay + ' Oct 2026');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.calDayCellText,
                            isSelected && styles.calDayCellTextSelected,
                          ]}
                        >
                          {dayNum}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.calModalFooter}>
              <View style={{ flex: 1 }}>
                <Text style={styles.calModalSelectedSub}>Chosen Date</Text>
                <Text style={styles.calModalSelectedMain}>{selectedFollowUpDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.calModalConfirmBtn}
                onPress={() => setCalendarModalVisible(false)}
                activeOpacity={0.88}
              >
                <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                <Text style={styles.calModalConfirmBtnText}>Confirm Date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* SUBMISSION CONFIRMATION POP-UP MODAL (SENT TO PATIENTS)        */}
      {/* ============================================================== */}
      <Modal
        visible={confirmationModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setConfirmationModal({ visible: false, title: '', message: '' });
          handleClose();
          if (typeof setActiveTab === 'function') setActiveTab('followups');
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmModalCard}>
            <View style={styles.confirmIconCircle}>
              <Ionicons name="checkmark-done" size={32} color="#00B894" />
            </View>
            <Text style={styles.confirmTitle}>{confirmationModal.title}</Text>
            <Text style={styles.confirmMessage}>{confirmationModal.message}</Text>
            <TouchableOpacity
              style={styles.confirmOkBtn}
              onPress={() => {
                setConfirmationModal({ visible: false, title: '', message: '' });
                handleClose();
                if (typeof setActiveTab === 'function') {
                  setActiveTab('followups');
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmOkBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSlidePanelOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    maxHeight: '100%',
    zIndex: 999999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bottomSlidePanelBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 30, 62, 0.55)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  },
  bottomSlidePanelSheet: {
    width: '100vw',
    maxWidth: '100vw',
    height: '92vh',
    maxHeight: '94vh',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1.5,
    borderColor: '#CBD5E1',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1000000,
    boxSizing: 'border-box',
    boxShadow: '0 -8px 32px rgba(8, 30, 62, 0.18)',
  },
  panelTopDragHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  panelHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  panelHeaderLeft: {
    flex: 1,
  },
  panelHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  panelHeaderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  panelHeaderPatientName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#00B894',
  },
  panelHeaderMetaText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  channelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  channelPillVideo: {
    backgroundColor: '#F5F3FF',
  },
  channelPillInPerson: {
    backgroundColor: '#F0F9FF',
  },
  channelPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  channelPillTextVideo: {
    color: '#7C3AED',
  },
  channelPillTextInPerson: {
    color: '#0284C7',
  },
  slotTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  slotTimePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#00B894',
  },
  panelTopCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Stepper Progress Bar */
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    flexShrink: 0,
  },
  stepNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#00B894',
  },
  stepCircleCompleted: {
    backgroundColor: '#1E3A8A',
  },
  stepCircleText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  stepCircleTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  stepLabelActive: {
    color: '#081E3E',
    fontWeight: '800',
  },
  stepLabelCompleted: {
    color: '#1E3A8A',
    fontWeight: '700',
  },
  stepperLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 6,
  },
  stepperLineActive: {
    backgroundColor: '#00B894',
  },

  /* Body Container */
  panelBodyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  /* ============================================================== */
  /* STEP 1: ZERO-SCROLL DASHBOARD VIEW                             */
  /* ============================================================== */
  step1ZeroScrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  step1HeaderSmallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexShrink: 0,
  },
  stepPillBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  stepPillBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#00B894',
  },
  stepMainHeadingSmall: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  stepSubHeadingSmall: {
    fontSize: 11.5,
    color: '#64748B',
  },
  step1ThreeColGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
    alignItems: 'stretch',
  },
  step1Col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  denseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  denseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 6,
  },
  denseCardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  denseKeyValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  denseKey: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  denseVal: {
    fontSize: 11.5,
    color: '#081E3E',
  },
  denseValBold: {
    fontSize: 11.5,
    color: '#081E3E',
    fontWeight: '700',
  },
  todayPillBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  todayPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#00B894',
  },
  modeMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modeMiniVideo: {
    backgroundColor: '#F5F3FF',
  },
  modeMiniInPerson: {
    backgroundColor: '#F0F9FF',
  },
  modeMiniText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  alertPillDense: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
  },
  alertPillDenseText: {
    fontSize: 11,
    color: '#DC2626',
  },
  subMicroLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  medBulletList: {
    marginTop: 2,
    gap: 2,
  },
  microBulletText: {
    fontSize: 11,
    color: '#334155',
  },
  chipsMicroWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 3,
  },
  chronicChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chronicChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  vitalsRowGridDense: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vitalMiniBox: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vitalMiniLabel: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  vitalMiniValue: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#081E3E',
    marginTop: 1,
  },
  vitalMiniUnit: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '500',
  },
  recordItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 5,
    gap: 6,
  },
  recordItemIconBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordItemName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  recordItemSub: {
    fontSize: 10,
    color: '#64748B',
  },
  recordViewBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  recordViewBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  historyListDense: {
    gap: 6,
  },
  historyItemDense: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  historyModeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  historyDateText: {
    fontSize: 10,
    color: '#64748B',
  },
  historyDescText: {
    fontSize: 10,
    color: '#475569',
    marginTop: 1,
  },
  privacyDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 4,
  },
  privacyDocTitle: {
    fontSize: 10.5,
    color: '#081E3E',
    fontWeight: '600',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  verifiedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#00B894',
  },
  manualDocRequestRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 3,
  },
  manualDocInput: {
    flex: 1,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 5,
    paddingHorizontal: 8,
    fontSize: 10.5,
    color: '#081E3E',
    outlineStyle: 'none',
  },
  manualDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#00B894',
    paddingHorizontal: 8,
    height: 30,
    borderRadius: 5,
  },
  manualDocBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  docQuickChipsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  docQuickChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docQuickChipText: {
    fontSize: 9.5,
    color: '#475569',
    fontWeight: '600',
  },
  requestedDocsList: {
    marginTop: 5,
    gap: 3,
  },
  requestedDocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  requestedDocName: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  requestedDocStatus: {
    fontSize: 9.5,
    color: '#D97706',
    fontWeight: '700',
  },

  /* ============================================================== */
  /* SPLIT LAYOUT (STEPS 2, 3, 4, 5)                                */
  /* ============================================================== */
  splitStepContainer: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  splitCol: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  splitColLeft: {
    backgroundColor: '#FFFFFF',
  },
  splitColRight: {
    backgroundColor: '#F8FAFC',
  },
  splitVerticalDivider: {
    width: 1.2,
    backgroundColor: '#E2E8F0',
  },
  stepTitleRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  stepMainHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  stepSubHeadingCompact: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 8,
  },
  typingFieldBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    marginTop: 4,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  fieldLabelBold: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  consultNotesTextarea: {
    height: 150,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    fontSize: 12.5,
    color: '#081E3E',
    textAlignVertical: 'top',
    outlineStyle: 'none',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  clinicalAddChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  clinicalAddChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#081E3E',
  },

  /* Right Section Live Reflection */
  rightSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  rightSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  rightSectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  liveBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B894',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00B894',
  },
  reflectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    boxShadow: '0 2px 10px rgba(8, 30, 62, 0.04)',
    flex: 1,
  },
  reflectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reflectionDoctorTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
    flex: 1,
  },
  reflectionDateTag: {
    fontSize: 11,
    color: '#64748B',
  },
  reflectionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  reflectionBodyText: {
    fontSize: 12.5,
    color: '#1E293B',
    lineHeight: 20,
    whiteSpace: 'pre-line',
  },
  emptyPreviewBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  emptyPreviewText: {
    fontSize: 11.5,
    color: '#94A3B8',
    textAlign: 'center',
  },

  /* ============================================================== */
  /* STEP 3 & 4: TALLER SEARCH & HIGHLIGHTED SELECT BUTTON          */
  /* ============================================================== */
  fieldSubTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
    marginBottom: 4,
  },
  tallerSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
    boxShadow: '0 2px 8px rgba(0, 184, 148, 0.12)',
  },
  tallerSearchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12.5,
    color: '#081E3E',
    outlineStyle: 'none',
  },
  highlightedDropdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#00B894',
    marginTop: 4,
    padding: 4,
    boxShadow: '0 8px 24px rgba(8, 30, 62, 0.15)',
    maxHeight: 180,
    overflow: 'auto',
    zIndex: 1000,
  },
  highlightedDropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  dropdownMedItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  dropdownHighlightedSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00B894',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    boxShadow: '0 2px 6px rgba(0, 184, 148, 0.3)',
  },
  dropdownHighlightedSelectText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  textInputBox: {
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#081E3E',
    outlineStyle: 'none',
  },
  twoColInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  addUpChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 4,
  },
  addUpChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addUpChipActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  addUpChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  addUpChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scheduleRowBoxCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  scheduleRowValueText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#081E3E',
  },
  scheduleAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#081E3E',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
  },
  scheduleAddBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    height: 40,
    borderRadius: 8,
    marginTop: 10,
    boxShadow: '0 4px 12px rgba(0, 184, 148, 0.25)',
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Prescription & Test Requirements Lists */
  prescriptionsList: {
    gap: 8,
  },
  rxItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    boxShadow: '0 2px 6px rgba(8, 30, 62, 0.04)',
  },
  rxMedName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  rxMetaDetails: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  rxTimingText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#00B894',
    marginTop: 2,
  },
  rxRemoveBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emptyItemsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyItemsText: {
    fontSize: 11.5,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 260,
  },

  /* Step 4: Category Tabs */
  categoryTabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  categoryTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 7,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  categoryTabBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00B894',
    borderWidth: 1.5,
  },
  categoryTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTabTextActive: {
    color: '#00B894',
    fontWeight: '800',
  },
  testItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    boxShadow: '0 2px 6px rgba(8, 30, 62, 0.04)',
  },
  testItemName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  testMetaDetail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* Step 5: Schedule Styles */
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
    marginBottom: 6,
  },
  boolToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  boolToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  boolToggleBtnActiveYes: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  boolToggleBtnActiveNo: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  boolToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  boolToggleTextActive: {
    color: '#FFFFFF',
  },
  dualCardBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  modeToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  modeToggleBtnActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  modeToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  dateDisplayBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
  },
  dateDisplayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  calendarTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#081E3E',
  },
  calendarTriggerBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  timeSlotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  timeSlotPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  timeSlotPillSelected: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  timeSlotPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#081E3E',
  },
  timeSlotPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  noFollowUpNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  noFollowUpNoticeText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
    flex: 1,
  },

  /* Step 5 Right Side Review Cards */
  reviewSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 8,
  },
  reviewSummaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  reviewSummaryCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#081E3E',
  },
  reviewSummaryCardBody: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 17,
  },

  /* Fixed Bottom Action Bar */
  panelBottomActionBar: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  bottomBarBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    gap: 5,
  },
  bottomBarBackBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  bottomBarSkipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  bottomBarSkipBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  bottomBarPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#1E3A8A',
    gap: 6,
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)',
  },
  bottomBarPrimaryBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Modals: Record Preview, Schedule, Calendar, Confirmation */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  recordPreviewCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    boxShadow: '0 12px 32px rgba(8, 30, 62, 0.25)',
  },
  recordModalBodyText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 20,
    whiteSpace: 'pre-line',
  },
  scheduleModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    boxShadow: '0 12px 32px rgba(8, 30, 62, 0.25)',
  },
  scheduleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  scheduleModalSub: {
    fontSize: 11.5,
    color: '#00B894',
    fontWeight: '700',
    marginTop: 2,
  },
  timeSlotCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  timeSlotCardActive: {
    borderColor: '#00B894',
    backgroundColor: '#F0FDF4',
  },
  timeSlotTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeSlotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeSlotIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  togglePillBtn: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  togglePillOn: {
    backgroundColor: '#00B894',
  },
  togglePillOff: {
    backgroundColor: '#CBD5E1',
  },
  togglePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  togglePillTextOn: {
    color: '#FFFFFF',
  },
  togglePillTextOff: {
    color: '#475569',
  },
  foodToggleRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  foodToggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  foodToggleBtnActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  foodToggleText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  foodToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scheduleSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    padding: 8,
    marginTop: 4,
  },
  scheduleSummaryText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  scheduleModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 14,
  },
  scheduleCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: '#F1F5F9',
  },
  scheduleCancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  scheduleSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: '#00B894',
  },
  scheduleSaveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Calendar Modal */
  calendarModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    boxShadow: '0 12px 32px rgba(8, 30, 62, 0.25)',
  },
  calModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calModalTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  calModalSub: {
    fontSize: 11,
    color: '#64748B',
  },
  calendarMonthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  calNavBtn: {
    padding: 4,
  },
  calMonthTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  calWeekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  calWeekdayLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94A3B8',
    width: 30,
    textAlign: 'center',
  },
  calDaysGrid: {
    gap: 3,
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  calDayCell: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayCellSelected: {
    backgroundColor: '#00B894',
  },
  calDayCellText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#081E3E',
  },
  calDayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  calModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  calModalSelectedSub: {
    fontSize: 10,
    color: '#64748B',
  },
  calModalSelectedMain: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#00B894',
  },
  calModalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: '#081E3E',
  },
  calModalConfirmBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Confirmation Popup Card */
  confirmModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    boxShadow: '0 12px 32px rgba(8, 30, 62, 0.25)',
  },
  confirmIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#081E3E',
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 18,
  },
  confirmOkBtn: {
    width: '100%',
    height: 42,
    backgroundColor: '#00B894',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 184, 148, 0.25)',
  },
  confirmOkBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
