import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorFollowUpsPage({
  setActiveTab,
  onStartConsultation,
  onStartConsultNotes,
  onStartPrescription,
  initialPatientId,
  initialOpenSlideDrawer,
  onCloseDrawer,
}) {
  // Main page filter controls
  const [channelMode, setChannelMode] = useState('In-Person'); // 'In-Person' | 'Video'
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Today' | 'Upcoming' | 'Overdue'
  const [searchQuery, setSearchQuery] = useState('');

  // Right-side slide drawer state (covers right to center of screen - 50% width)
  const [isSlideDrawerOpen, setIsSlideDrawerOpen] = useState(!!initialOpenSlideDrawer);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || 'p1');

  // Stepper state inside the right-side slide drawer: 1 | 2 | 3 | 4 | 5
  // Step 1: Patient Details
  // Step 2: Consult Notes
  // Step 3: Prescribe
  // Step 4: Lab Tests
  // Step 5: Date & Time
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Medical Records sub-tab
  const [recordsTab, setRecordsTab] = useState('notes'); // 'notes' | 'reports' | 'prescriptions'

  // Step 2: Consult Notes state
  const [consultChiefComplaint, setConsultChiefComplaint] = useState(
    'Follow-up visit to review clinical symptoms, medication response, and blood pressure control.'
  );
  const [consultSymptoms, setConsultSymptoms] = useState(
    'Occasional mild occipital heaviness after stressful work hours. No chest pain or dyspnea.'
  );
  const [consultDiagnosis, setConsultDiagnosis] = useState(
    'Stage 1 Essential Hypertension — stable on current therapy.'
  );
  const [consultNotesText, setConsultNotesText] = useState(
    'Maintain daily medication routine. Restrict dietary sodium to less than 2g/day. Hydrate well and monitor home readings.'
  );

  // Step 3: Prescribe state
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'rx-1',
      name: 'Tab. Amlodipine 5mg',
      timing: 'Morning (After Food)',
      morningOn: true,
      morningFood: 'After Food',
      afternoonOn: false,
      afternoonFood: 'After Food',
      nightOn: false,
      nightFood: 'After Food',
      duration: '30 Days',
      instructions: 'After breakfast with water',
    },
    {
      id: 'rx-2',
      name: 'Tab. Telmisartan 40mg',
      timing: 'Night (After Food)',
      morningOn: false,
      morningFood: 'After Food',
      afternoonOn: false,
      afternoonFood: 'After Food',
      nightOn: true,
      nightFood: 'After Food',
      duration: '30 Days',
      instructions: 'After dinner',
    },
  ]);
  const [manualMedName, setManualMedName] = useState('');
  const [manualMedTiming, setManualMedTiming] = useState('Morning (After Food) · Night (After Food)');
  const [manualMedDuration, setManualMedDuration] = useState('30 Days');
  const [manualMedInstructions, setManualMedInstructions] = useState('After Food');
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');
  const [showMedDropdown, setShowMedDropdown] = useState(false);

  // Medicine Schedule Modal State (Morning, Afternoon, Night with On/Off & Before/After Food)
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [scheduleTargetMed, setScheduleTargetMed] = useState(null); // null if for manual entry, or prescription item
  const [morningOn, setMorningOn] = useState(true);
  const [morningFood, setMorningFood] = useState('After Food'); // 'Before Food' | 'After Food'
  const [afternoonOn, setAfternoonOn] = useState(false);
  const [afternoonFood, setAfternoonFood] = useState('After Food'); // 'Before Food' | 'After Food'
  const [nightOn, setNightOn] = useState(true);
  const [nightFood, setNightFood] = useState('After Food'); // 'Before Food' | 'After Food'

  const COMMON_MEDICINES = [
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
  ];

  // Step 4: Test Requirements state (Search dropdown + Manual typing + Fasting & Drinking water only toggles)
  const [selectedTests, setSelectedTests] = useState([
    { id: 't-1', name: 'Serum Creatinine & eGFR', notes: 'Routine renal check', fasting: false, waterOnly: false },
    { id: 't-2', name: 'Lipid Profile (Fasting)', notes: 'Overnight 10-12 hrs fasting', fasting: true, waterOnly: true },
    { id: 't-3', name: '12-Lead Resting ECG', notes: 'Assess baseline rhythm', fasting: false, waterOnly: false },
  ]);
  const [manualTestName, setManualTestName] = useState('');
  const [manualTestInstructions, setManualTestInstructions] = useState('');
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [testFasting, setTestFasting] = useState(false);
  const [testWaterOnly, setTestWaterOnly] = useState(false);

  const COMMON_TESTS = [
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

  // Step 5: Date & Time state + Calendar Pop-up Modal
  const [selectedFollowUpDate, setSelectedFollowUpDate] = useState('05 Oct 2026');
  const [selectedFollowUpDay, setSelectedFollowUpDay] = useState(5); // Default day 5 as in user calendar screenshot
  const [selectedFollowUpTime, setSelectedFollowUpTime] = useState('11:30 AM');
  const [selectedFollowUpMode, setSelectedFollowUpMode] = useState('In-Person'); // 'In-Person' | 'Video'
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  // Theme-matched Confirmation Modal (Center of Screen)
  const [confirmationModal, setConfirmationModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // Follow-Up Patients Database (for In-Person & Video, covering All, Today, Upcoming, Overdue)
  const [followUpPatients, setFollowUpPatients] = useState([
    {
      id: 'p-diane',
      initials: 'DC',
      name: 'Diane Cruz',
      age: 54,
      gender: 'Female',
      bloodGroup: 'B+',
      phone: '+91 98451 88201',
      idTag: '#DC-991',
      statusTag: 'Today',
      statusType: 'today',
      channel: 'In-Person',
      timeSlot: 'Today, 09:30 AM',
      objective: 'Dyslipidemia follow-up & statin dose titration',
      allergies: ['Sulfa Drugs'],
      medications: ['Atorvastatin 20mg (0-0-1)', 'Aspirin 75mg (0-1-0)'],
      chronicConditions: ['Dyslipidemia', 'Mild Hypertension'],
      vitals: { bpm: 72, bp: '126/82', sugar: '104 mg/dL' },
      consultHistory: [
        { date: '15 Sep 2026', mode: 'In-Person', title: 'Lipid Panel Review', notes: 'LDL decreased to 110 mg/dL.' },
      ],
    },
    {
      id: 'p-roosevelt',
      initials: 'RC',
      name: 'Roosevelt Chase',
      age: 35,
      gender: 'Male',
      bloodGroup: 'AB+',
      phone: '+91 97412 33419',
      idTag: '#RC-442',
      statusTag: 'Today',
      statusType: 'today',
      channel: 'Video',
      timeSlot: 'Today, 03:00 PM',
      objective: 'Routine ECG Review & Vitals Check',
      allergies: ['Aspirin'],
      medications: ['Multivitamin (1-0-0)'],
      chronicConditions: ['None recorded'],
      vitals: { bpm: 68, bp: '118/76', sugar: '90 mg/dL' },
      consultHistory: [
        { date: '20 Sep 2026', mode: 'Video', title: 'Pre-ECG Tele-consult', notes: 'Advised 12-lead baseline test.' },
      ],
    },
    {
      id: 'p-jakub',
      initials: 'JT',
      name: 'Jakub Tucker',
      age: 43,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98860 11984',
      idTag: '#JT-331',
      statusTag: 'Today',
      statusType: 'today',
      channel: 'In-Person',
      timeSlot: 'Today, 10:15 AM',
      objective: 'Post-MI Rehabilitation & Cardiac Conditioning',
      allergies: ['None'],
      medications: ['Metoprolol 25mg (1-0-0)', 'Clopidogrel 75mg (0-1-0)'],
      chronicConditions: ['Post-MI Status', 'Coronary Artery Disease'],
      vitals: { bpm: 70, bp: '120/78', sugar: '96 mg/dL' },
      consultHistory: [
        { date: '10 Sep 2026', mode: 'In-Person', title: 'Cardiac Rehab Check', notes: 'Tolerating 30min brisk walk.' },
      ],
    },
    {
      id: 'p-tiffany',
      initials: 'TF',
      name: 'Tiffany Fowler',
      age: 38,
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+91 99014 55102',
      idTag: '#TF-882',
      statusTag: 'Today',
      statusType: 'today',
      channel: 'In-Person',
      timeSlot: 'Today, 11:45 AM',
      objective: 'Arrhythmia Palpitations & Holter Monitor Review',
      allergies: ['Penicillin'],
      medications: ['Bisoprolol 2.5mg (1-0-0)'],
      chronicConditions: ['Benign PACs / Arrhythmia'],
      vitals: { bpm: 78, bp: '122/80', sugar: '94 mg/dL' },
      consultHistory: [
        { date: '05 Sep 2026', mode: 'In-Person', title: 'Holter Review', notes: 'Rare supraventricular ectopic beats.' },
      ],
    },
    {
      id: 'p-andre',
      initials: 'AM',
      name: 'Andre Merritt',
      age: 27,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+91 98452 77013',
      idTag: '#AM-112',
      statusTag: 'Today',
      statusType: 'today',
      channel: 'Video',
      timeSlot: 'Today, 11:00 AM',
      objective: 'Cardiac Telehealth Consult & Resting Pulse Rate',
      allergies: ['Penicillin'],
      medications: ['None recorded'],
      chronicConditions: ['None recorded'],
      vitals: { bpm: 74, bp: '120/80', sugar: '92 mg/dL' },
      consultHistory: [
        { date: '01 Sep 2026', mode: 'Video', title: 'Telehealth Intake', notes: 'Reported occasional chest flutter after caffeine.' },
      ],
    },
    {
      id: 'p1',
      initials: 'RK',
      name: 'Rahul Kumar',
      age: 34,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98450 12345',
      idTag: '#P102',
      statusTag: 'Today',
      statusType: 'today',
      channel: 'In-Person',
      timeSlot: 'Today, 04:30 PM',
      objective: 'Recheck blood pressure after medication adjustment',
      allergies: ['Penicillin'],
      medications: ['Amlodipine 5mg (1-0-0)'],
      chronicConditions: ['Stage 1 Essential Hypertension'],
      vitals: { bpm: 76, bp: '122/80', sugar: '98 mg/dL' },
      consultHistory: [
        { date: '22 Sep 2026', mode: 'In-Person', title: 'Clinic BP Review', notes: 'Resting BP 136/88. Titrated Amlodipine.' },
        { date: '12 Aug 2026', mode: 'Video', title: 'Tele-Consult Follow-up', notes: 'Initial symptoms review.' },
      ],
    },
    {
      id: 'p2',
      initials: 'PS',
      name: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '+91 98452 34567',
      idTag: '#P103',
      statusTag: 'Today',
      statusType: 'today',
      channel: 'In-Person',
      timeSlot: 'Today, 06:00 PM',
      objective: 'Evaluate migraine response to prophylactic therapy',
      allergies: ['None known'],
      medications: ['Propranolol 20mg (1-0-0)', 'Naproxen 500mg (SOS)'],
      chronicConditions: ['Chronic Migraine with Aura'],
      vitals: { bpm: 72, bp: '116/74', sugar: '92 mg/dL' },
      consultHistory: [
        { date: '18 Sep 2026', mode: 'In-Person', title: 'Migraine Diary Review', notes: 'Episodes reduced significantly.' },
      ],
    },
    {
      id: 'p3',
      initials: 'AM',
      name: 'Arjun Menon',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98860 33412',
      idTag: '#P104',
      statusTag: 'Upcoming',
      statusType: 'upcoming',
      channel: 'In-Person',
      timeSlot: '05 Oct 2026 · 11:30 AM',
      objective: 'Review HbA1c trend and diabetic foot ulcer healing',
      allergies: ['Sulfa Drugs'],
      medications: ['Metformin 1000mg', 'Empagliflozin 10mg'],
      chronicConditions: ['Type 2 Diabetes, Neuropathy'],
      vitals: { bpm: 80, bp: '130/84', sugar: '138 mg/dL' },
      consultHistory: [
        { date: '15 Sep 2026', mode: 'In-Person', title: 'Wound Dressing & Foot Check', notes: 'Plantar ulcer granulating well.' },
      ],
    },
    {
      id: 'p4',
      initials: 'SP',
      name: 'Sunita Patel',
      age: 31,
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+91 97412 55678',
      idTag: '#P105',
      statusTag: 'Upcoming',
      statusType: 'upcoming',
      channel: 'In-Person',
      timeSlot: '08 Oct 2026 · 02:00 PM',
      objective: 'Post-partum recovery review and thyroid re-check',
      allergies: ['None known'],
      medications: ['Thyronorm 25mcg (1-0-0)'],
      chronicConditions: ['Post-Partum Thyroiditis'],
      vitals: { bpm: 74, bp: '118/76', sugar: '90 mg/dL' },
      consultHistory: [
        { date: '10 Sep 2026', mode: 'In-Person', title: '6-Week Postnatal Follow-up', notes: 'Recovery on track.' },
      ],
    },
    {
      id: 'p5',
      initials: 'SK',
      name: 'Suresh Kumar',
      age: 58,
      gender: 'Male',
      bloodGroup: 'AB+',
      phone: '+91 98450 77119',
      idTag: '#P106',
      statusTag: 'Overdue',
      statusType: 'overdue',
      channel: 'In-Person',
      timeSlot: 'Overdue: Was 28 Sep · 10:00 AM',
      objective: 'Overdue for hypertensive review and medication renewal',
      allergies: ['Aspirin'],
      medications: ['Telmisartan 40mg', 'Atorvastatin 10mg'],
      chronicConditions: ['Hypertension, Dyslipidemia'],
      vitals: { bpm: 84, bp: '142/90', sugar: '118 mg/dL' },
      consultHistory: [
        { date: '28 Aug 2026', mode: 'In-Person', title: 'Hypertension Review', notes: 'BP elevated at 144/92.' },
      ],
    },

    // Video Consultation Patients
    {
      id: 'p6',
      initials: 'VP',
      name: 'Vikram Patel',
      age: 42,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98860 12345',
      idTag: '#P107',
      statusTag: 'Today',
      statusType: 'today',
      channel: 'Video',
      timeSlot: 'Today, 03:00 PM',
      objective: 'Cardiac follow-up & 12-Lead ECG Review via video',
      allergies: ['None known'],
      medications: ['Atorvastatin 10mg', 'Aspirin 75mg'],
      chronicConditions: ['Post-Angioplasty Monitoring'],
      vitals: { bpm: 72, bp: '120/78', sugar: '104 mg/dL' },
      consultHistory: [
        { date: '20 Sep 2026', mode: 'Video', title: 'Tele-Cardiology Review', notes: 'ECG showed normal sinus rhythm.' },
      ],
    },
    {
      id: 'p7',
      initials: 'AS',
      name: 'Ananya Sen',
      age: 29,
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '+91 98452 77013',
      idTag: '#P108',
      statusTag: 'Upcoming',
      statusType: 'upcoming',
      channel: 'Video',
      timeSlot: '06 Oct 2026 · 04:30 PM',
      objective: 'Routine allergy check and antihistamine step-down',
      allergies: ['Penicillin'],
      medications: ['Montelukast 10mg'],
      chronicConditions: ['Allergic Rhinitis'],
      vitals: { bpm: 78, bp: '112/70', sugar: '88 mg/dL' },
      consultHistory: [
        { date: '14 Sep 2026', mode: 'Video', title: 'Allergy Follow-up', notes: 'Nasal congestion improved.' },
      ],
    },
    {
      id: 'p8',
      initials: 'RP',
      name: 'Ramesh Pillai',
      age: 61,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 99014 33221',
      idTag: '#P109',
      statusTag: 'Overdue',
      statusType: 'overdue',
      channel: 'Video',
      timeSlot: 'Overdue: Was 27 Sep · 05:00 PM',
      objective: 'Diabetic peripheral neuropathy & glycemic check',
      allergies: ['None recorded'],
      medications: ['Metformin 500mg', 'Glimepiride 1mg'],
      chronicConditions: ['Type 2 Diabetes'],
      vitals: { bpm: 82, bp: '136/84', sugar: '162 mg/dL' },
      consultHistory: [
        { date: '25 Aug 2026', mode: 'Video', title: 'Diabetes Management Call', notes: 'Morning blood sugar high.' },
      ],
    },
  ]);

  // Filtered patients for main list
  const filteredPatients = followUpPatients.filter((p) => {
    const matchesChannel = p.channel === channelMode;
    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Today'
        ? p.statusType === 'today'
        : activeFilter === 'Upcoming'
        ? p.statusType === 'upcoming'
        : p.statusType === 'overdue';

    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.idTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.objective.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesChannel && matchesFilter && matchesSearch;
  });

  // Synchronize incoming initial patient from Dashboard
  useEffect(() => {
    if (initialPatientId) {
      const targetStr = String(initialPatientId).toLowerCase().trim();
      const match = followUpPatients.find((p) => {
        if (!p) return false;
        if (p.id && p.id.toLowerCase() === targetStr) return true;
        if (p.name && p.name.toLowerCase() === targetStr) return true;
        if (p.name && (targetStr.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(targetStr))) return true;
        return false;
      });

      if (match) {
        setSelectedPatientId(match.id);
        if (match.channel) setChannelMode(match.channel);
      } else {
        setSelectedPatientId(initialPatientId);
      }
    }
    if (initialOpenSlideDrawer) {
      setIsSlideDrawerOpen(true);
      setCurrentStep(1);
    }
  }, [initialPatientId, initialOpenSlideDrawer]);

  const selectedPatient =
    followUpPatients.find((p) => p.id === selectedPatientId) ||
    filteredPatients[0] ||
    followUpPatients[0];

  // Actions
  const handleOpenPatientDrawer = (patientId) => {
    setSelectedPatientId(patientId);
    setCurrentStep(1); // Start at Step 1: Patient Details
    setIsSlideDrawerOpen(true);
  };

  // Helper to format schedule text
  const formatScheduleText = (mOn, mFood, aOn, aFood, nOn, nFood) => {
    const list = [];
    if (mOn) list.push(`Morning (${mFood})`);
    if (aOn) list.push(`Afternoon (${aFood})`);
    if (nOn) list.push(`Night (${nFood})`);
    if (list.length === 0) return 'As needed (PRN)';
    return list.join(' · ');
  };

  const handleOpenScheduleModal = (med = null) => {
    setScheduleTargetMed(med);
    if (med) {
      setMorningOn(med.morningOn ?? (med.timing?.includes('Morning') ? true : false));
      setMorningFood(med.morningFood || 'After Food');
      setAfternoonOn(med.afternoonOn ?? (med.timing?.includes('Afternoon') ? true : false));
      setAfternoonFood(med.afternoonFood || 'After Food');
      setNightOn(med.nightOn ?? (med.timing?.includes('Night') ? true : false));
      setNightFood(med.nightFood || 'After Food');
    } else {
      // Opening for manual form: use current schedule states
      setMorningOn(true);
      setMorningFood('After Food');
      setAfternoonOn(false);
      setAfternoonFood('After Food');
      setNightOn(true);
      setNightFood('After Food');
    }
    setScheduleModalVisible(true);
  };

  const handleSaveSchedule = () => {
    const text = formatScheduleText(morningOn, morningFood, afternoonOn, afternoonFood, nightOn, nightFood);
    if (scheduleTargetMed) {
      setPrescriptions((prev) =>
        prev.map((item) =>
          item.id === scheduleTargetMed.id
            ? {
                ...item,
                timing: text,
                morningOn,
                morningFood,
                afternoonOn,
                afternoonFood,
                nightOn,
                nightFood,
              }
            : item
        )
      );
    } else {
      setManualMedTiming(text);
    }
    setScheduleModalVisible(false);
    setScheduleTargetMed(null);
  };

  const handleAddMedicine = () => {
    if (!manualMedName.trim()) return;
    const timing = manualMedTiming || formatScheduleText(morningOn, morningFood, afternoonOn, afternoonFood, nightOn, nightFood);
    const newRx = {
      id: `rx-${Date.now()}`,
      name: manualMedName.trim(),
      timing,
      morningOn,
      morningFood,
      afternoonOn,
      afternoonFood,
      nightOn,
      nightFood,
      duration: manualMedDuration || '30 Days',
      instructions: manualMedInstructions || 'After Food',
    };
    setPrescriptions((prev) => [...prev, newRx]);
    setManualMedName('');
    setMedicineSearchQuery('');
    setShowMedDropdown(false);
  };

  const handleRemoveMedicine = (id) => {
    setPrescriptions((prev) => prev.filter((m) => m.id !== id));
  };

  // Step 4 Handlers: Tests & Investigations
  const handleSelectDropdownTest = (testName) => {
    setManualTestName(testName);
    setTestSearchQuery(testName);
    setShowTestDropdown(false);
  };

  const handleAddTest = () => {
    if (!manualTestName.trim()) return;
    const testItem = {
      id: `test-${Date.now()}`,
      name: manualTestName.trim(),
      notes: manualTestInstructions.trim(),
      fasting: testFasting,
      waterOnly: testWaterOnly,
    };
    setSelectedTests((prev) => [...prev, testItem]);
    setManualTestName('');
    setManualTestInstructions('');
    setTestFasting(false);
    setTestWaterOnly(false);
    setTestSearchQuery('');
    setShowTestDropdown(false);
  };

  const handleToggleTest = (testName) => {
    const exists = selectedTests.find((t) => (typeof t === 'string' ? t === testName : t.name === testName));
    if (exists) {
      setSelectedTests((prev) => prev.filter((t) => (typeof t === 'string' ? t !== testName : t.name !== testName)));
    } else {
      const isFasting = testName.toLowerCase().includes('fasting') || testName.toLowerCase().includes('lipid') || testName.toLowerCase().includes('glucose');
      setSelectedTests((prev) => [
        ...prev,
        {
          id: `test-${Date.now()}`,
          name: testName,
          notes: isFasting ? 'Fasting required (8-12 hrs)' : '',
          fasting: isFasting,
          waterOnly: isFasting,
        },
      ]);
    }
  };

  const handleFinalSubmit = () => {
    setConfirmationModal({
      visible: true,
      title: 'Follow-up Scheduled & Dispatched',
      message: `Comprehensive follow-up completed for ${selectedPatient.name}. Consultation notes have been saved, e-prescription dispatched, ${selectedTests.length} diagnostic test(s) ordered, and next ${selectedFollowUpMode} appointment scheduled for ${selectedFollowUpDate} at ${selectedFollowUpTime}.`,
    });
  };

  // Calendar dates matrix (October 2026)
  const calendarDaysMatrix = [
    [null, null, null, null, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31],
  ];

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* ============================================================== */}
        {/* 1. TOP SECTION: HEADING & NOTE (TOP BAR & COUNTS REMOVED)      */}
        {/* ============================================================== */}
        <View style={styles.headingSection}>
          <Text style={styles.pageMainHeading}>Patients Follow-up</Text>
          <Text style={styles.pageSubNote}>
            Review clinical progress, prescribe medications, order lab tests, and schedule upcoming care.
          </Text>
        </View>

        {/* ============================================================== */}
        {/* 2. PROMINENT HIGHLIGHTED SEARCH BAR                            */}
        {/* ============================================================== */}
        <View style={styles.highlightSearchBar}>
          <Ionicons name="search" size={18} color="#00B894" />
          <TextInput
            style={styles.highlightSearchInput}
            placeholder="Search patient name, ID, clinical objective, or diagnosis..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ============================================================== */}
        {/* 3. IN-PERSON VS VIDEO CONSULTATION TOGGLES                     */}
        {/* ============================================================== */}
        <View style={styles.channelToggleWrap}>
          <TouchableOpacity
            style={[
              styles.channelToggleBtn,
              channelMode === 'In-Person' && styles.channelToggleBtnActive,
            ]}
            onPress={() => setChannelMode('In-Person')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="business-outline"
              size={16}
              color={channelMode === 'In-Person' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.channelToggleText,
                channelMode === 'In-Person' && styles.channelToggleTextActive,
              ]}
            >
              In-Person Follow-up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.channelToggleBtn,
              channelMode === 'Video' && styles.channelToggleBtnActive,
            ]}
            onPress={() => setChannelMode('Video')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="videocam-outline"
              size={16}
              color={channelMode === 'Video' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.channelToggleText,
                channelMode === 'Video' && styles.channelToggleTextActive,
              ]}
            >
              Video Consultation Follow-up
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* 4. CATEGORY FILTERS: ALL, TODAY, UPCOMING, OVERDUE             */}
        {/* ============================================================== */}
        <View style={styles.filtersPillRow}>
          {[
            { id: 'All', label: 'All Patients', icon: 'people-outline' },
            { id: 'Today', label: 'Today', icon: 'today-outline' },
            { id: 'Upcoming', label: 'Upcoming', icon: 'calendar-outline' },
            { id: 'Overdue', label: 'Overdue', icon: 'alert-circle-outline' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            const isOverdue = tab.id === 'Overdue';
            const count = followUpPatients.filter((p) => {
              if (p.channel !== channelMode) return false;
              if (tab.id === 'All') return true;
              if (tab.id === 'Today') return p.statusType === 'today';
              if (tab.id === 'Upcoming') return p.statusType === 'upcoming';
              return p.statusType === 'overdue';
            }).length;

            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                  isOverdue && !isActive && styles.filterPillOverdue,
                ]}
                onPress={() => setActiveFilter(tab.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={tab.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : isOverdue ? '#DC2626' : '#475569'}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                    isOverdue && !isActive && { color: '#DC2626' },
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.filterBadge,
                    isActive ? styles.filterBadgeActive : styles.filterBadgeInactive,
                    isOverdue && !isActive && { backgroundColor: '#FEE2E2' },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBadgeText,
                      isActive && styles.filterBadgeTextActive,
                      isOverdue && !isActive && { color: '#DC2626' },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ============================================================== */}
        {/* 5. PATIENTS LIST (WITH ARROW ON RIGHT SIDE OF EACH CARD)       */}
        {/* ============================================================== */}
        <View style={styles.patientsListWrap}>
          {filteredPatients.length === 0 ? (
            <View style={styles.emptyFollowUpsCard}>
              <Ionicons name="folder-open-outline" size={34} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No {activeFilter.toLowerCase()} {channelMode.toLowerCase()} follow-ups</Text>
              <Text style={styles.emptySubtitle}>Try choosing another filter tab or search for another patient.</Text>
            </View>
          ) : (
            filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatient?.id && isSlideDrawerOpen;
              return (
                <TouchableOpacity
                  key={patient.id}
                  style={[styles.patientCard, isSelected && styles.patientCardSelected]}
                  onPress={() => handleOpenPatientDrawer(patient.id)}
                  activeOpacity={0.88}
                >
                  {/* Left: Avatar & Initials */}
                  <View style={styles.patientAvatarWrap}>
                    <Text style={styles.patientAvatarText}>{patient.initials}</Text>
                  </View>

                  {/* Middle: Patient Metadata & Objective */}
                  <View style={styles.patientInfoCol}>
                    <View style={styles.patientNameHeaderRow}>
                      <Text style={styles.patientNameText}>{patient.name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          patient.statusType === 'today'
                            ? styles.statusBadgeToday
                            : patient.statusType === 'upcoming'
                            ? styles.statusBadgeUpcoming
                            : styles.statusBadgeOverdue,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            patient.statusType === 'today'
                              ? styles.statusTextToday
                              : patient.statusType === 'upcoming'
                              ? styles.statusTextUpcoming
                              : styles.statusTextOverdue,
                          ]}
                        >
                          {patient.statusTag}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.patientMetaText}>
                      {patient.age} yrs · {patient.gender} · {patient.bloodGroup} · ID {patient.idTag}
                    </Text>

                    {/* Time slot row */}
                    <View style={styles.timeSlotRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={13}
                        color={patient.statusType === 'overdue' ? '#DC2626' : '#00B894'}
                      />
                      <Text
                        style={[
                          styles.timeSlotText,
                          patient.statusType === 'overdue' && { color: '#DC2626', fontWeight: '700' },
                        ]}
                      >
                        {patient.timeSlot}
                      </Text>
                    </View>

                    {/* Clinical Objective */}
                    <Text style={styles.patientObjectiveText}>
                      {patient.objective}
                    </Text>
                  </View>

                  {/* Right Side: Arrow Icon */}
                  <View style={styles.arrowIconWrap}>
                    <Ionicons name="chevron-forward" size={18} color="#081E3E" />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ============================================================== */}
      {/* 6. RIGHT-SIDE SLIDE-OVER DRAWER (COVERS RIGHT TO CENTER - 50%) */}
      {/*    WITH DIMMED BACKGROUND & 5-STEP WORKFLOW AS SHOWN IN IMAGES */}
      {/* ============================================================== */}
      {isSlideDrawerOpen && selectedPatient && (
        <View style={styles.slideDrawerOverlay} className="doctor-slide-drawer-overlay">
          {/* Dimmed Background Overlay */}
          <TouchableOpacity
            style={styles.slideDrawerBackdrop}
            onPress={() => setIsSlideDrawerOpen(false)}
            activeOpacity={1}
          />

          {/* Right Slide Sheet (Extends from right to center of screen: 50% width) */}
          <View style={styles.slideDrawerSheet} className="doctor-slide-drawer-sheet">
            {/* Top Bar with Close '✕' Button */}
            <View style={styles.drawerTopBar}>
              <View style={styles.drawerTitleGroup}>
                <Text style={styles.drawerTitleText}>Clinical Follow-up</Text>
                <Text style={styles.drawerPatientSubText}>
                  {selectedPatient.name} ({selectedPatient.age} yrs, {selectedPatient.gender})
                </Text>
              </View>

              <TouchableOpacity
                style={styles.drawerCloseBtn}
                onPress={() => setIsSlideDrawerOpen(false)}
              >
                <Ionicons name="close" size={20} color="#081E3E" />
              </TouchableOpacity>
            </View>

            {/* Stepper Header (1 -> 2 -> 3 -> 4 -> 5 on top till submit) */}
            <View style={styles.stepperContainer}>
              {[
                { step: 1, label: 'Patient Details' },
                { step: 2, label: 'Consult Notes' },
                { step: 3, label: 'Prescribe' },
                { step: 4, label: 'Lab Tests' },
                { step: 5, label: 'Date & Time' },
              ].map((s, idx) => {
                const isCompleted = currentStep > s.step;
                const isActive = currentStep === s.step;

                return (
                  <React.Fragment key={`step-${s.step}`}>
                    {idx > 0 && (
                      <View
                        style={[
                          styles.stepperLine,
                          currentStep >= s.step && styles.stepperLineActive,
                        ]}
                      />
                    )}
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
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        ) : (
                          <Text
                            style={[
                              styles.stepCircleText,
                              isActive && styles.stepCircleTextActive,
                            ]}
                          >
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
                        numberOfLines={1}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>

            {/* Scrollable Step Content Body */}
            <ScrollView
              style={styles.stepScrollBody}
              className="doctor-drawer-scroll-body"
              contentContainerStyle={styles.stepScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* ======================================================== */}
              {/* STEP 1: PATIENT DETAILS                                  */}
              {/* ======================================================== */}
              {currentStep === 1 && (
                <View style={styles.stepInnerWrap}>
                  {/* Medical Information Card */}
                  <View style={styles.clinicalCard}>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.cardHeaderIcon}>
                        <Ionicons name="medkit-outline" size={16} color="#081E3E" />
                      </View>
                      <Text style={styles.cardHeaderTitle}>Medical Information</Text>
                    </View>

                    {/* Patient Profile */}
                    <View style={styles.profileRow}>
                      <View style={styles.profileAvatar}>
                        <Text style={styles.profileAvatarText}>{selectedPatient.initials}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.profileName}>{selectedPatient.name}</Text>
                        <View style={styles.badgesRow}>
                          <View style={styles.miniBadge}>
                            <Text style={styles.miniBadgeText}>
                              {selectedPatient.age} yrs · {selectedPatient.gender}
                            </Text>
                          </View>
                          <View style={[styles.miniBadge, { backgroundColor: '#FEE2E2' }]}>
                            <Text style={[styles.miniBadgeText, { color: '#B91C1C', fontWeight: '800' }]}>
                              🩸 {selectedPatient.bloodGroup}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.profileContact}>📞 {selectedPatient.phone}</Text>
                      </View>
                    </View>

                    <View style={styles.cardDivider} />

                    {/* Known Allergies */}
                    <View style={styles.clinicalFieldSection}>
                      <Text style={styles.clinicalFieldTitle}>Known Allergies</Text>
                      <View style={styles.tagWrap}>
                        {selectedPatient.allergies.map((al, idx) => (
                          <View key={`al-${idx}`} style={styles.allergyTag}>
                            <Ionicons name="warning-outline" size={13} color="#B45309" />
                            <Text style={styles.allergyTagText}>{al}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Current Medicines */}
                    <View style={styles.clinicalFieldSection}>
                      <Text style={styles.clinicalFieldTitle}>Current Medicines</Text>
                      <View style={styles.tagWrap}>
                        {selectedPatient.medications.map((med, idx) => (
                          <View key={`med-${idx}`} style={styles.medItem}>
                            <Ionicons name="medical" size={13} color="#081E3E" />
                            <Text style={styles.medItemText}>{med}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Chronic Conditions */}
                    <View style={styles.clinicalFieldSection}>
                      <Text style={styles.clinicalFieldTitle}>Chronic Conditions</Text>
                      <View style={styles.tagWrap}>
                        {selectedPatient.chronicConditions.map((cond, idx) => (
                          <View key={`cond-${idx}`} style={styles.conditionTag}>
                            <Ionicons name="pulse" size={13} color="#00897B" />
                            <Text style={styles.conditionTagText}>{cond}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Patient Vitals Card */}
                  <View style={styles.clinicalCard}>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.cardHeaderIcon}>
                        <Ionicons name="heart-pulse-outline" size={16} color="#081E3E" />
                      </View>
                      <Text style={styles.cardHeaderTitle}>Patient Vitals</Text>
                    </View>

                    <View style={styles.vitalsRow}>
                      <View style={styles.vitalBox}>
                        <View style={[styles.vitalIconWrap, { backgroundColor: '#FEE2E2' }]}>
                          <Ionicons name="heart" size={15} color="#EF4444" />
                        </View>
                        <Text style={styles.vitalLabel}>Heart Rate</Text>
                        <Text style={styles.vitalVal}>
                          {selectedPatient.vitals.bpm} <Text style={styles.vitalUnit}>bpm</Text>
                        </Text>
                        <Text style={styles.vitalStatus}>Normal</Text>
                      </View>

                      <View style={styles.vitalBox}>
                        <View style={[styles.vitalIconWrap, { backgroundColor: '#E6FAF6' }]}>
                          <Ionicons name="water" size={15} color="#00B894" />
                        </View>
                        <Text style={styles.vitalLabel}>Blood Sugar</Text>
                        <Text style={styles.vitalVal}>
                          {selectedPatient.vitals.sugar.split(' ')[0]}{' '}
                          <Text style={styles.vitalUnit}>mg/dL</Text>
                        </Text>
                        <Text style={styles.vitalStatus}>Fasting</Text>
                      </View>

                      <View style={styles.vitalBox}>
                        <View style={[styles.vitalIconWrap, { backgroundColor: '#EEF4FC' }]}>
                          <Ionicons name="speedometer" size={15} color="#081E3E" />
                        </View>
                        <Text style={styles.vitalLabel}>Blood Pressure</Text>
                        <Text style={styles.vitalVal}>{selectedPatient.vitals.bp}</Text>
                        <Text style={styles.vitalStatus}>mmHg</Text>
                      </View>
                    </View>
                  </View>

                  {/* Medical Records Card (Notes, Lab Reports, Prescriptions) */}
                  <View style={styles.clinicalCard}>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.cardHeaderIcon}>
                        <Ionicons name="folder-open-outline" size={16} color="#081E3E" />
                      </View>
                      <Text style={styles.cardHeaderTitle}>Medical Records</Text>
                    </View>

                    <View style={styles.recordsTabTrack}>
                      <TouchableOpacity
                        style={[styles.recordsTabBtn, recordsTab === 'notes' && styles.recordsTabBtnActive]}
                        onPress={() => setRecordsTab('notes')}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={13}
                          color={recordsTab === 'notes' ? '#FFFFFF' : '#475569'}
                        />
                        <Text style={[styles.recordsTabBtnText, recordsTab === 'notes' && styles.recordsTabBtnTextActive]}>
                          Notes (3)
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.recordsTabBtn, recordsTab === 'reports' && styles.recordsTabBtnActive]}
                        onPress={() => setRecordsTab('reports')}
                      >
                        <Ionicons
                          name="flask-outline"
                          size={13}
                          color={recordsTab === 'reports' ? '#FFFFFF' : '#475569'}
                        />
                        <Text style={[styles.recordsTabBtnText, recordsTab === 'reports' && styles.recordsTabBtnTextActive]}>
                          Reports (2)
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.recordsTabBtn, recordsTab === 'prescriptions' && styles.recordsTabBtnActive]}
                        onPress={() => setRecordsTab('prescriptions')}
                      >
                        <Ionicons
                          name="medkit-outline"
                          size={13}
                          color={recordsTab === 'prescriptions' ? '#FFFFFF' : '#475569'}
                        />
                        <Text style={[styles.recordsTabBtnText, recordsTab === 'prescriptions' && styles.recordsTabBtnTextActive]}>
                          Rx (2)
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {recordsTab === 'notes' && (
                      <View style={styles.recordsList}>
                        <View style={styles.recordItemCard}>
                          <Text style={styles.recordItemTitle}>Clinical Follow-up Note (28 Aug 2026)</Text>
                          <Text style={styles.recordItemBody}>
                            Blood pressure recorded at 134/86. Recommended low-sodium diet and walking routine.
                          </Text>
                          <Text style={styles.recordDocSign}>Signed by Dr. Ananya Rao</Text>
                        </View>
                      </View>
                    )}

                    {recordsTab === 'reports' && (
                      <View style={styles.recordsList}>
                        <View style={styles.fileRecordCard}>
                          <Ionicons name="document-attach" size={18} color="#00B894" />
                          <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.fileName}>ECG 12-Lead Diagnostic Strip</Text>
                            <Text style={styles.fileMeta}>15 Aug 2026 · Normal Sinus Rhythm</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {recordsTab === 'prescriptions' && (
                      <View style={styles.recordsList}>
                        <View style={styles.rxCard}>
                          <Text style={styles.rxMedName}>Tab. Amlodipine 5mg</Text>
                          <Text style={styles.rxInstructions}>1 tablet once daily in morning (1-0-0) · 30 Days</Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Consultation History Card */}
                  <View style={styles.clinicalCard}>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.cardHeaderIcon}>
                        <Ionicons name="time-outline" size={16} color="#081E3E" />
                      </View>
                      <Text style={styles.cardHeaderTitle}>Consultation History</Text>
                    </View>

                    {selectedPatient.consultHistory.map((item, idx) => (
                      <View key={`hist-${idx}`} style={styles.historyCard}>
                        <View style={styles.historyTopRow}>
                          <Text style={styles.historyDate}>{item.date}</Text>
                          <View
                            style={[
                              styles.historyModePill,
                              item.mode === 'Video' ? styles.historyModeVideo : styles.historyModeInPerson,
                            ]}
                          >
                            <Text style={styles.historyModePillText}>{item.mode}</Text>
                          </View>
                        </View>
                        <Text style={styles.historyTitle}>{item.title}</Text>
                        <Text style={styles.historyNotes}>{item.notes}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* ======================================================== */}
              {/* STEP 2: CONSULT NOTES                                    */}
              {/* ======================================================== */}
              {currentStep === 2 && (
                <View style={styles.stepInnerWrap}>
                  <View style={styles.stepSectionHeader}>
                    <Text style={styles.stepSectionTitle}>Consultation Notes</Text>
                    <Text style={styles.stepSectionSub}>Record present clinical findings and diagnosis</Text>
                  </View>

                  {/* Chief Complaint */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Chief Complaint</Text>
                    <TextInput
                      style={styles.textInputBox}
                      value={consultChiefComplaint}
                      onChangeText={setConsultChiefComplaint}
                      placeholder="Enter chief complaint..."
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Symptoms */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Present Symptoms & Clinical History</Text>
                    <TextInput
                      style={[styles.textInputBox, styles.textAreaBox]}
                      multiline
                      numberOfLines={3}
                      value={consultSymptoms}
                      onChangeText={setConsultSymptoms}
                      placeholder="Describe symptoms, duration, severity..."
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Diagnosis */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Working Diagnosis</Text>
                    <TextInput
                      style={styles.textInputBox}
                      value={consultDiagnosis}
                      onChangeText={setConsultDiagnosis}
                      placeholder="e.g. Essential Hypertension (Stage 1)"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Clinical Observations / Plan */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Clinical Treatment Remarks & Notes</Text>
                    <TextInput
                      style={[styles.textInputBox, styles.textAreaLarge]}
                      multiline
                      numberOfLines={5}
                      value={consultNotesText}
                      onChangeText={setConsultNotesText}
                      placeholder="Enter detailed physician notes, lifestyle advice, recommendations..."
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
              )}

              {/* ======================================================== */}
              {/* STEP 3: PRESCRIBE                                        */}
              {/* ======================================================== */}
              {currentStep === 3 && (
                <View style={styles.stepInnerWrap}>
                  <View style={styles.stepSectionHeader}>
                    <Text style={styles.stepSectionTitle}>e-Prescription</Text>
                    <Text style={styles.stepSectionSub}>Search medicines or manually enter prescription details</Text>
                  </View>

                  {/* Search Medicine with Dropdown */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Search Medicine Catalog</Text>
                    <View style={styles.medSearchBox}>
                      <Ionicons name="search-outline" size={16} color="#00B894" />
                      <TextInput
                        style={styles.medSearchInput}
                        placeholder="Search standard medicine catalog..."
                        placeholderTextColor="#94A3B8"
                        value={medicineSearchQuery}
                        onChangeText={(t) => {
                          setMedicineSearchQuery(t);
                          setShowMedDropdown(true);
                        }}
                        onFocus={() => setShowMedDropdown(true)}
                      />
                      {medicineSearchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setMedicineSearchQuery(''); setShowMedDropdown(false); }}>
                          <Ionicons name="close-circle" size={16} color="#94A3B8" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {showMedDropdown && (
                      <View style={styles.medDropdownCard}>
                        {COMMON_MEDICINES.filter((m) =>
                          !medicineSearchQuery || m.toLowerCase().includes(medicineSearchQuery.toLowerCase())
                        ).map((med) => (
                          <TouchableOpacity
                            key={med}
                            style={styles.medDropdownItem}
                            onPress={() => {
                              setManualMedName(med);
                              setMedicineSearchQuery(med);
                              setShowMedDropdown(false);
                            }}
                          >
                            <Ionicons name="medical-outline" size={14} color="#00B894" />
                            <Text style={styles.medDropdownItemText}>{med}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Manual Entry Form */}
                  <View style={styles.manualEntryCard}>
                    <Text style={styles.manualEntryTitle}>Manual Medicine Entry</Text>

                    <View style={styles.formRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputMiniLabel}>Medicine Name & Strength</Text>
                        <TextInput
                          style={styles.textInputBox}
                          placeholder="e.g. Tab. Telmisartan 40mg"
                          placeholderTextColor="#94A3B8"
                          value={manualMedName}
                          onChangeText={setManualMedName}
                        />
                      </View>
                    </View>

                    <View style={[styles.formRow, { marginTop: 10 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputMiniLabel}>Duration</Text>
                        <TextInput
                          style={styles.textInputBox}
                          placeholder="e.g. 30 Days"
                          placeholderTextColor="#94A3B8"
                          value={manualMedDuration}
                          onChangeText={setManualMedDuration}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.inputMiniLabel}>Instructions</Text>
                        <TextInput
                          style={styles.textInputBox}
                          placeholder="e.g. Take with water"
                          placeholderTextColor="#94A3B8"
                          value={manualMedInstructions}
                          onChangeText={setManualMedInstructions}
                        />
                      </View>
                    </View>

                    {/* Medicine Schedule Button */}
                    <Text style={[styles.inputMiniLabel, { marginTop: 10 }]}>Dosage Timing & Schedule</Text>
                    <TouchableOpacity
                      style={styles.medScheduleTriggerBtn}
                      onPress={() => handleOpenScheduleModal(null)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.scheduleBtnLeft}>
                        <View style={styles.scheduleBtnIconCircle}>
                          <Ionicons name="time" size={16} color="#00B894" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.scheduleBtnTitle}>Medicine Schedule</Text>
                          <Text style={styles.scheduleBtnVal} numberOfLines={1}>
                            {manualMedTiming || 'Morning (After Food) · Night (After Food)'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.scheduleBtnBadge}>
                        <Text style={styles.scheduleBtnBadgeText}>Edit Schedule</Text>
                        <Ionicons name="chevron-forward" size={13} color="#00B894" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.addMedBtn}
                      onPress={handleAddMedicine}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                      <Text style={styles.addMedBtnText}>Add Medication to Rx</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Current Prescribed Medicines List */}
                  <Text style={styles.rxListHeader}>Prescribed Medicines ({prescriptions.length})</Text>
                  <View style={styles.prescriptionsList}>
                    {prescriptions.map((m) => (
                      <View key={m.id} style={styles.prescribedItemCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.prescribedMedName}>{m.name}</Text>
                          <Text style={styles.prescribedMedSub}>
                            {m.duration} · {m.instructions}
                          </Text>

                          {/* Medicine Schedule Button under each added medicine */}
                          <TouchableOpacity
                            style={styles.itemScheduleBtn}
                            onPress={() => handleOpenScheduleModal(m)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="time-outline" size={13} color="#081E3E" />
                            <Text style={styles.itemScheduleBtnText}>
                              Schedule: {m.timing}
                            </Text>
                            <Ionicons name="create-outline" size={13} color="#00B894" />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          style={styles.removeRxBtn}
                          onPress={() => handleRemoveMedicine(m.id)}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* ======================================================== */}
              {/* STEP 4: LAB TESTS                                        */}
              {/* ======================================================== */}
              {currentStep === 4 && (
                <View style={styles.stepInnerWrap}>
                  <View style={styles.stepSectionHeader}>
                    <Text style={styles.stepSectionTitle}>Diagnostic Test Requirements</Text>
                    <Text style={styles.stepSectionSub}>Search test catalog or manually enter diagnostic orders</Text>
                  </View>

                  {/* Search Test Catalog with Dropdown */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Search Diagnostic Tests Catalog</Text>
                    <View style={styles.medSearchBox}>
                      <Ionicons name="search-outline" size={16} color="#00B894" />
                      <TextInput
                        style={styles.medSearchInput}
                        placeholder="Search standard lab tests (CBC, Lipid, HbA1c...)"
                        placeholderTextColor="#94A3B8"
                        value={testSearchQuery}
                        onChangeText={(t) => {
                          setTestSearchQuery(t);
                          setShowTestDropdown(true);
                        }}
                        onFocus={() => setShowTestDropdown(true)}
                      />
                      {testSearchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setTestSearchQuery(''); setShowTestDropdown(false); }}>
                          <Ionicons name="close-circle" size={16} color="#94A3B8" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {showTestDropdown && (
                      <View style={styles.medDropdownCard}>
                        {COMMON_TESTS.filter((t) =>
                          !testSearchQuery || t.toLowerCase().includes(testSearchQuery.toLowerCase())
                        ).map((test) => (
                          <TouchableOpacity
                            key={test}
                            style={styles.medDropdownItem}
                            onPress={() => handleSelectDropdownTest(test)}
                          >
                            <Ionicons name="flask-outline" size={14} color="#00B894" />
                            <Text style={styles.medDropdownItemText}>{test}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Standard Test Quick Chips */}
                  <Text style={[styles.inputLabel, { marginTop: 6 }]}>Quick Select Standard Diagnostic Panels</Text>
                  <View style={styles.quickTestsWrap}>
                    {COMMON_TESTS.slice(0, 8).map((t) => {
                      const isSelected = selectedTests.some((item) => (typeof item === 'string' ? item === t : item.name === t));
                      return (
                        <TouchableOpacity
                          key={t}
                          style={[styles.testChip, isSelected && styles.testChipSelected]}
                          onPress={() => handleToggleTest(t)}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                            size={14}
                            color={isSelected ? '#FFFFFF' : '#081E3E'}
                          />
                          <Text style={[styles.testChipText, isSelected && styles.testChipTextSelected]}>
                            {t}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Manual Test Entry Form */}
                  <View style={[styles.manualEntryCard, { marginTop: 10 }]}>
                    <Text style={styles.manualEntryTitle}>Manual Diagnostic Test Order</Text>
                    
                    <Text style={styles.inputMiniLabel}>Test / Investigation Name</Text>
                    <TextInput
                      style={styles.textInputBox}
                      placeholder="e.g. 2D-Echocardiogram with Color Doppler..."
                      placeholderTextColor="#94A3B8"
                      value={manualTestName}
                      onChangeText={setManualTestName}
                    />

                    {/* Manual Consults Notes Typing Box */}
                    <Text style={[styles.inputMiniLabel, { marginTop: 10 }]}>Physician Notes & Clinical Instructions</Text>
                    <TextInput
                      style={[styles.textInputBox, { height: 60, textAlignVertical: 'top' }]}
                      placeholder="Enter specific instructions (e.g. Sample collection at 8:00 AM, bring prior reports)..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      value={manualTestInstructions}
                      onChangeText={setManualTestInstructions}
                    />

                    {/* Fasting & Drinking Only Water Toggles Down that Notes Box */}
                    <Text style={[styles.inputMiniLabel, { marginTop: 10 }]}>Patient Fasting & Hydration Protocol</Text>
                    <View style={styles.prepTogglesRow}>
                      <TouchableOpacity
                        style={[styles.prepToggleBtn, testFasting && styles.prepToggleBtnActiveFasting]}
                        onPress={() => setTestFasting(!testFasting)}
                        activeOpacity={0.85}
                      >
                        <Ionicons
                          name="nutrition-outline"
                          size={15}
                          color={testFasting ? '#FFFFFF' : '#D97706'}
                        />
                        <Text style={[styles.prepToggleText, testFasting && styles.prepToggleTextActive]}>
                          Fasting (10-12h)
                        </Text>
                        <View style={[styles.prepPillBadge, testFasting && styles.prepPillBadgeActive]}>
                          <Text style={[styles.prepPillBadgeText, testFasting && styles.prepPillBadgeTextActive]}>
                            {testFasting ? 'ON' : 'OFF'}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.prepToggleBtn, testWaterOnly && styles.prepToggleBtnActiveWater]}
                        onPress={() => setTestWaterOnly(!testWaterOnly)}
                        activeOpacity={0.85}
                      >
                        <Ionicons
                          name="water-outline"
                          size={15}
                          color={testWaterOnly ? '#FFFFFF' : '#0284C7'}
                        />
                        <Text style={[styles.prepToggleText, testWaterOnly && styles.prepToggleTextActive]}>
                          Drinking Only Water
                        </Text>
                        <View style={[styles.prepPillBadge, testWaterOnly && styles.prepPillBadgeActive]}>
                          <Text style={[styles.prepPillBadgeText, testWaterOnly && styles.prepPillBadgeTextActive]}>
                            {testWaterOnly ? 'ON' : 'OFF'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.addMedBtn}
                      onPress={handleAddTest}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                      <Text style={styles.addMedBtnText}>Add Diagnostic Order</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Selected Tests List */}
                  <Text style={styles.rxListHeader}>Selected Diagnostic Orders ({selectedTests.length})</Text>
                  <View style={styles.prescriptionsList}>
                    {selectedTests.map((item) => {
                      const name = typeof item === 'string' ? item : item.name;
                      const notes = typeof item === 'object' ? item.notes : '';
                      const isFasting = typeof item === 'object' ? item.fasting : name.toLowerCase().includes('fasting');
                      const isWaterOnly = typeof item === 'object' ? item.waterOnly : false;

                      return (
                        <View key={typeof item === 'object' ? item.id : item} style={styles.testItemCard}>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Ionicons name="flask" size={15} color="#00B894" />
                              <Text style={styles.testItemName}>{name}</Text>
                            </View>
                            {notes ? <Text style={styles.testItemNotes}>{notes}</Text> : null}
                            <View style={styles.testTagsRow}>
                              {isFasting && (
                                <View style={styles.testTagFasting}>
                                  <Ionicons name="nutrition" size={11} color="#D97706" />
                                  <Text style={styles.testTagFastingText}>Fasting</Text>
                                </View>
                              )}
                              {isWaterOnly && (
                                <View style={styles.testTagWater}>
                                  <Ionicons name="water" size={11} color="#0284C7" />
                                  <Text style={styles.testTagWaterText}>Drinking Only Water</Text>
                                </View>
                              )}
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.removeRxBtn}
                            onPress={() => handleToggleTest(name)}
                          >
                            <Ionicons name="close-circle" size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* ======================================================== */}
              {/* STEP 5: DATE & TIME + CALENDAR POP-UP                    */}
              {/* ======================================================== */}
              {currentStep === 5 && (
                <View style={styles.stepInnerWrap}>
                  <View style={styles.stepSectionHeader}>
                    <Text style={styles.stepSectionTitle}>Schedule Next Follow-up</Text>
                    <Text style={styles.stepSectionSub}>Choose date and time slot for next consultation review</Text>
                  </View>

                  {/* Consultation Mode Toggle */}
                  <Text style={styles.inputLabel}>Consultation Mode</Text>
                  <View style={styles.modePillRow}>
                    <TouchableOpacity
                      style={[
                        styles.modePill,
                        selectedFollowUpMode === 'In-Person' && styles.modePillActive,
                      ]}
                      onPress={() => setSelectedFollowUpMode('In-Person')}
                    >
                      <Ionicons
                        name="business-outline"
                        size={15}
                        color={selectedFollowUpMode === 'In-Person' ? '#FFFFFF' : '#081E3E'}
                      />
                      <Text
                        style={[
                          styles.modePillText,
                          selectedFollowUpMode === 'In-Person' && styles.modePillTextActive,
                        ]}
                      >
                        In-Person Clinic Visit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modePill,
                        selectedFollowUpMode === 'Video' && styles.modePillActive,
                      ]}
                      onPress={() => setSelectedFollowUpMode('Video')}
                    >
                      <Ionicons
                        name="videocam-outline"
                        size={15}
                        color={selectedFollowUpMode === 'Video' ? '#FFFFFF' : '#081E3E'}
                      />
                      <Text
                        style={[
                          styles.modePillText,
                          selectedFollowUpMode === 'Video' && styles.modePillTextActive,
                        ]}
                      >
                        Video Consultation
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Date & Schedule Card with Calendar Trigger Button */}
                  <Text style={[styles.inputLabel, { marginTop: 12 }]}>Date and Schedule</Text>
                  <View style={styles.dateSelectorBox}>
                    <View style={styles.dateBoxLeft}>
                      <View style={styles.calendarSquareIcon}>
                        <Ionicons name="calendar" size={18} color="#FFFFFF" />
                      </View>
                      <View>
                        <Text style={styles.dateFullSub}>Selected Follow-up Date</Text>
                        <Text style={styles.dateBoldMain}>{selectedFollowUpDate}</Text>
                      </View>
                    </View>

                    {/* Calendar Button (triggers Calendar Pop-up) */}
                    <TouchableOpacity
                      style={styles.calendarTriggerBtn}
                      onPress={() => setCalendarModalVisible(true)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="calendar-outline" size={15} color="#081E3E" />
                      <Text style={styles.calendarTriggerBtnText}>Calendar</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Time Slots */}
                  <Text style={[styles.inputLabel, { marginTop: 14 }]}>Available Time Slots</Text>
                  <View style={styles.timeSlotsRow}>
                    {['10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'].map((time) => {
                      const isTimeSelected = selectedFollowUpTime === time;
                      return (
                        <TouchableOpacity
                          key={time}
                          style={[styles.timeSlotPill, isTimeSelected && styles.timeSlotPillSelected]}
                          onPress={() => setSelectedFollowUpTime(time)}
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

                  {/* Follow-up Summary Card */}
                  <View style={styles.summaryBox}>
                    <Ionicons name="checkmark-circle" size={18} color="#00B894" />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.summaryTitle}>Follow-up Appointment Confirmed Slot</Text>
                      <Text style={styles.summaryText}>
                        {selectedFollowUpDate} · {selectedFollowUpTime} · {selectedFollowUpMode}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Static Action Bar at Bottom of Slide Drawer */}
            <View style={styles.drawerBottomBar} className="doctor-drawer-static-footer">
              {currentStep > 1 && (
                <TouchableOpacity
                  style={styles.prevStepBtn}
                  onPress={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={15} color="#081E3E" />
                  <Text style={styles.prevStepBtnText}>Back</Text>
                </TouchableOpacity>
              )}

              {currentStep === 1 && (
                <TouchableOpacity
                  style={styles.primaryStepBtn}
                  onPress={() => setCurrentStep(2)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryStepBtnText}>Follow-up Required</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              {currentStep === 2 && (
                <TouchableOpacity
                  style={styles.primaryStepBtn}
                  onPress={() => setCurrentStep(3)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryStepBtnText}>Continue to Prescribe</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              {currentStep === 3 && (
                <TouchableOpacity
                  style={styles.primaryStepBtn}
                  onPress={() => setCurrentStep(4)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryStepBtnText}>Continue to Tests</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              {currentStep === 4 && (
                <TouchableOpacity
                  style={styles.primaryStepBtn}
                  onPress={() => setCurrentStep(5)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryStepBtnText}>Continue to Date & Time</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              {currentStep === 5 && (
                <TouchableOpacity
                  style={[styles.primaryStepBtn, { backgroundColor: '#00B894' }]}
                  onPress={handleFinalSubmit}
                  activeOpacity={0.85}
                >
                  <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryStepBtnText}>Submit Follow-up</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* ============================================================== */}
      {/* 7. CONFIRMATION MODAL IN CENTER OF SCREEN (THEME-MATCHED)      */}
      {/* ============================================================== */}
      <Modal
        visible={confirmationModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmationModal({ visible: false, title: '', message: '' })}
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
                setIsSlideDrawerOpen(false); // Close the drawer smoothly after submission
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmOkBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 8. MEDICINE SCHEDULE POP-UP MODAL                             */}
      {/* ============================================================== */}
      <Modal
        visible={scheduleModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.scheduleModalCard}>
            {/* Header */}
            <View style={styles.scheduleModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleModalTitle}>Medicine Schedule</Text>
                <Text style={styles.scheduleModalSub} numberOfLines={1}>
                  {scheduleTargetMed ? scheduleTargetMed.name : manualMedName || 'Prescribed Medicine'}
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
                    <Ionicons name="sunny" size={16} color="#D97706" />
                  </View>
                  <Text style={styles.timeSlotName}>Morning</Text>
                </View>

                {/* On / Off Toggle */}
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

              {/* After Food and Before Food Toggles */}
              {morningOn && (
                <View style={styles.foodToggleRow}>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, morningFood === 'Before Food' && styles.foodToggleBtnActive]}
                    onPress={() => setMorningFood('Before Food')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="restaurant-outline"
                      size={13}
                      color={morningFood === 'Before Food' ? '#FFFFFF' : '#64748B'}
                    />
                    <Text style={[styles.foodToggleText, morningFood === 'Before Food' && styles.foodToggleTextActive]}>
                      Before Food
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.foodToggleBtn, morningFood === 'After Food' && styles.foodToggleBtnActive]}
                    onPress={() => setMorningFood('After Food')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="restaurant"
                      size={13}
                      color={morningFood === 'After Food' ? '#FFFFFF' : '#64748B'}
                    />
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
                    <Ionicons name="partly-sunny" size={16} color="#0284C7" />
                  </View>
                  <Text style={styles.timeSlotName}>Afternoon</Text>
                </View>

                {/* On / Off Toggle */}
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

              {/* After Food and Before Food Toggles */}
              {afternoonOn && (
                <View style={styles.foodToggleRow}>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, afternoonFood === 'Before Food' && styles.foodToggleBtnActive]}
                    onPress={() => setAfternoonFood('Before Food')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="restaurant-outline"
                      size={13}
                      color={afternoonFood === 'Before Food' ? '#FFFFFF' : '#64748B'}
                    />
                    <Text style={[styles.foodToggleText, afternoonFood === 'Before Food' && styles.foodToggleTextActive]}>
                      Before Food
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.foodToggleBtn, afternoonFood === 'After Food' && styles.foodToggleBtnActive]}
                    onPress={() => setAfternoonFood('After Food')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="restaurant"
                      size={13}
                      color={afternoonFood === 'After Food' ? '#FFFFFF' : '#64748B'}
                    />
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
                    <Ionicons name="moon" size={16} color="#7C3AED" />
                  </View>
                  <Text style={styles.timeSlotName}>Night</Text>
                </View>

                {/* On / Off Toggle */}
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

              {/* After Food and Before Food Toggles */}
              {nightOn && (
                <View style={styles.foodToggleRow}>
                  <TouchableOpacity
                    style={[styles.foodToggleBtn, nightFood === 'Before Food' && styles.foodToggleBtnActive]}
                    onPress={() => setNightFood('Before Food')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="restaurant-outline"
                      size={13}
                      color={nightFood === 'Before Food' ? '#FFFFFF' : '#64748B'}
                    />
                    <Text style={[styles.foodToggleText, nightFood === 'Before Food' && styles.foodToggleTextActive]}>
                      Before Food
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.foodToggleBtn, nightFood === 'After Food' && styles.foodToggleBtnActive]}
                    onPress={() => setNightFood('After Food')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="restaurant"
                      size={13}
                      color={nightFood === 'After Food' ? '#FFFFFF' : '#64748B'}
                    />
                    <Text style={[styles.foodToggleText, nightFood === 'After Food' && styles.foodToggleTextActive]}>
                      After Food
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Schedule Summary Preview */}
            <View style={styles.scheduleSummaryPill}>
              <Ionicons name="checkmark-circle" size={15} color="#00B894" />
              <Text style={styles.scheduleSummaryText} numberOfLines={1}>
                {formatScheduleText(morningOn, morningFood, afternoonOn, afternoonFood, nightOn, nightFood)}
              </Text>
            </View>

            {/* Modal Actions */}
            <View style={styles.scheduleModalFooter}>
              <TouchableOpacity
                style={styles.scheduleCancelBtn}
                onPress={() => setScheduleModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.scheduleCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scheduleSaveBtn}
                onPress={handleSaveSchedule}
                activeOpacity={0.85}
              >
                <Text style={styles.scheduleSaveBtnText}>Save Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 9. CALENDAR POP-UP MODAL                                      */}
      {/* ============================================================== */}
      <Modal
        visible={calendarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.calendarModalCard}>
            {/* Modal Header */}
            <View style={styles.calModalHeader}>
              <View>
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

            {/* Month Navigation */}
            <View style={styles.calendarMonthHeader}>
              <TouchableOpacity style={styles.calNavBtn}>
                <Ionicons name="chevron-back" size={16} color="#475569" />
              </TouchableOpacity>
              <Text style={styles.calMonthTitle}>October 2026</Text>
              <TouchableOpacity style={styles.calNavBtn}>
                <Ionicons name="chevron-forward" size={16} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* Weekdays Row */}
            <View style={styles.calWeekdaysRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <Text key={d} style={styles.calWeekdayLabel}>{d}</Text>
              ))}
            </View>

            {/* Days Matrix Grid */}
            <View style={styles.calDaysGrid}>
              {calendarDaysMatrix.map((week, wIdx) => (
                <View key={`w-${wIdx}`} style={styles.calWeekRow}>
                  {week.map((dayNum, dIdx) => {
                    if (!dayNum) {
                      return <View key={`blank-${dIdx}`} style={styles.calDayCell} />;
                    }
                    const isDaySelected = selectedFollowUpDay === dayNum;
                    return (
                      <TouchableOpacity
                        key={`d-${dayNum}`}
                        style={[
                          styles.calDayCell,
                          isDaySelected && styles.calDayCellSelected,
                        ]}
                        onPress={() => {
                          setSelectedFollowUpDay(dayNum);
                          setSelectedFollowUpDate(
                            `${String(dayNum).padStart(2, '0')} Oct 2026`
                          );
                        }}
                      >
                        <Text
                          style={[
                            styles.calDayCellText,
                            isDaySelected && styles.calDayCellTextSelected,
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

            {/* Modal Footer with Chosen Date and Confirm Button */}
            <View style={styles.calModalFooter}>
              <View>
                <Text style={styles.calModalSelectedSub}>Chosen Date</Text>
                <Text style={styles.calModalSelectedMain}>{selectedFollowUpDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.calModalConfirmBtn}
                onPress={() => setCalendarModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.calModalConfirmBtnText}>Confirm Date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    padding: 24,
    gap: 16,
  },

  /* 1. Heading Section */
  headingSection: {
    marginBottom: 4,
  },
  pageMainHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.5,
  },
  pageSubNote: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  /* 2. Highlighted Search Bar */
  highlightSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00B894', // Highlighted with Teal theme border
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    maxWidth: 900,
  },
  highlightSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#081E3E',
    outlineStyle: 'none',
  },

  /* 3. In-Person vs Video Toggle */
  channelToggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#E8EEF5',
    borderRadius: 12,
    padding: 4,
    maxWidth: 520,
  },
  channelToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  channelToggleBtnActive: {
    backgroundColor: '#081E3E',
  },
  channelToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  channelToggleTextActive: {
    color: '#FFFFFF',
  },

  /* 4. Filters Pill Row */
  filtersPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterPillActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  filterPillOverdue: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
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
  filterBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  filterBadgeActive: {
    backgroundColor: '#00B894',
  },
  filterBadgeInactive: {
    backgroundColor: '#E8F8F5',
  },
  filterBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#00B894',
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },

  /* 5. Patients List Cards */
  patientsListWrap: {
    gap: 12,
    width: '100%',
    maxWidth: 1050,
  },
  emptyFollowUpsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#081E3E',
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
  },

  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 14,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  patientCardSelected: {
    borderColor: '#00B894',
    borderWidth: 2,
    shadowColor: '#00B894',
    shadowOpacity: 0.12,
  },
  patientAvatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EEF2F6',
    borderWidth: 1.5,
    borderColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  patientInfoCol: {
    flex: 1,
    gap: 3,
  },
  patientNameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patientNameText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeToday: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeUpcoming: {
    backgroundColor: '#E6F8F4',
  },
  statusBadgeOverdue: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  statusTextToday: {
    color: '#15803D',
  },
  statusTextUpcoming: {
    color: '#00B894',
  },
  statusTextOverdue: {
    color: '#DC2626',
  },
  patientMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00B894',
  },
  patientObjectiveText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 3,
    lineHeight: 16,
  },
  arrowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ================================================================ */
  /* RIGHT-SIDE SLIDE DRAWER (COVERS RIGHT TO CENTER - 50% WIDTH)     */
  /* ================================================================ */
  slideDrawerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    maxHeight: '100%',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  slideDrawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.58)', // Deep Dimmed Background
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  },
  slideDrawerSheet: {
    width: '50%',
    minWidth: 540,
    maxWidth: 840,
    height: '100%',
    maxHeight: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000000',
    shadowOffset: { width: -14, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 36,
    elevation: 30,
    overflow: 'hidden',
    zIndex: 10000,
  },

  /* Top Bar */
  drawerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  drawerTitleGroup: {},
  drawerTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#081E3E',
  },
  drawerPatientSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  drawerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Stepper Progress Bar (1 -> 2 -> 3 -> 4 -> 5 on top) */
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexShrink: 0,
  },
  stepperLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  stepperLineActive: {
    backgroundColor: '#00B894',
  },
  stepNode: {
    alignItems: 'center',
    gap: 4,
    width: 72,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#081E3E',
  },
  stepCircleCompleted: {
    backgroundColor: '#00B894',
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  stepCircleTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#081E3E',
    fontWeight: '800',
  },
  stepLabelCompleted: {
    color: '#00B894',
    fontWeight: '700',
  },

  /* Step Content Scroll Area */
  stepScrollBody: {
    flex: 1,
    minHeight: 0,
    flexShrink: 1,
  },
  stepScrollContent: {
    padding: 20,
  },
  stepInnerWrap: {
    gap: 16,
  },

  /* Step Section Header */
  stepSectionHeader: {
    marginBottom: 6,
  },
  stepSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
  },
  stepSectionSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* Clinical Cards in Step 1 */
  clinicalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardHeaderIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2F6',
    borderWidth: 1.5,
    borderColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  miniBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  profileContact: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  clinicalFieldSection: {
    marginTop: 8,
  },
  clinicalFieldTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  allergyTagText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#92400E',
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  medItemText: {
    fontSize: 12,
    color: '#081E3E',
    fontWeight: '600',
  },
  conditionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  conditionTagText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#00897B',
  },

  /* Vitals */
  vitalsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vitalBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vitalIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  vitalLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
    textAlign: 'center',
  },
  vitalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  vitalUnit: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },
  vitalStatus: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#00B894',
    marginTop: 2,
  },

  /* Records Sub-tabs */
  recordsTabTrack: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  recordsTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  recordsTabBtnActive: {
    backgroundColor: '#081E3E',
  },
  recordsTabBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  recordsTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  recordsList: {
    gap: 6,
  },
  recordItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordItemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  recordItemBody: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    marginTop: 2,
  },
  recordDocSign: {
    fontSize: 10.5,
    color: '#00B894',
    fontWeight: '700',
    marginTop: 4,
  },
  fileRecordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fileName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  fileMeta: {
    fontSize: 10.5,
    color: '#64748B',
  },
  rxCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rxMedName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  rxInstructions: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },

  /* History */
  historyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  historyModePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  historyModeInPerson: {
    backgroundColor: '#EEF4FC',
  },
  historyModeVideo: {
    backgroundColor: '#E6FAF6',
  },
  historyModePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#081E3E',
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
    marginTop: 3,
  },
  historyNotes: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* Step Form Inputs */
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  inputMiniLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 2,
  },
  textInputBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#081E3E',
  },
  textAreaBox: {
    height: 70,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: 110,
    textAlignVertical: 'top',
  },

  /* Step 3: Prescriptions */
  medSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#00B894',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  medSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#081E3E',
    outlineStyle: 'none',
  },
  medDropdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
    maxHeight: 180,
    overflow: 'scroll',
    shadowColor: '#081E3E',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  medDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medDropdownItemText: {
    fontSize: 12.5,
    color: '#081E3E',
    fontWeight: '600',
  },
  manualEntryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 8,
  },
  manualEntryTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  formRow: {
    flexDirection: 'row',
  },
  addMedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#081E3E',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 6,
  },
  addMedBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rxListHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
    marginTop: 8,
  },
  prescriptionsList: {
    gap: 8,
  },
  prescribedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prescribedMedName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  prescribedMedSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  removeRxBtn: {
    padding: 4,
  },

  /* Step 4: Lab Tests */
  quickTestsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  testChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testChipSelected: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  testChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#081E3E',
  },
  testChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  testItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testItemName: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#081E3E',
    marginLeft: 8,
  },

  /* Step 5: Date & Time + Calendar */
  modePillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 9,
  },
  modePillActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  modePillTextActive: {
    color: '#FFFFFF',
  },

  /* Calendar Widget */
  calendarWidgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 10,
  },
  calendarMonthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calNavBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMonthTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  calInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6FAF6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 10,
  },
  calInfoBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D9488',
  },
  calWeekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  calWeekdayLabel: {
    width: 30,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  calDaysGrid: {
    gap: 4,
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calDayCell: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayCellSelected: {
    backgroundColor: '#081E3E',
  },
  calDayCellText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  calDayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* Time Slots */
  timeSlotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeSlotPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeSlotPillSelected: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  timeSlotPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  timeSlotPillTextSelected: {
    color: '#FFFFFF',
  },

  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FAF6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00B894',
    padding: 12,
    marginTop: 14,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00B894',
    marginTop: 2,
  },

  /* Static Bottom Bar inside Drawer */
  drawerBottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.2,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  prevStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    gap: 5,
  },
  prevStepBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  primaryStepBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#081E3E',
    gap: 8,
  },
  primaryStepBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Confirmation Modal (Center of Screen) */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.52)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 20000,
  },
  confirmModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  confirmIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6FAF6',
    borderWidth: 2,
    borderColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmMessage: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  confirmOkBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#081E3E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmOkBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Step 3: Medicine Schedule Trigger & Pills */
  medScheduleTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  scheduleBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  scheduleBtnIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  scheduleBtnVal: {
    fontSize: 11.5,
    color: '#166534',
    marginTop: 1,
    fontWeight: '600',
  },
  scheduleBtnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  scheduleBtnBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  itemScheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemScheduleBtnText: {
    fontSize: 11,
    color: '#081E3E',
    fontWeight: '600',
  },

  /* Step 4: Diagnostic Test Preparation Toggles & Tags */
  prepTogglesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  prepToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  prepToggleBtnActiveFasting: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  prepToggleBtnActiveWater: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  prepToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  prepToggleTextActive: {
    color: '#081E3E',
  },
  prepPillBadge: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10,
  },
  prepPillBadgeActive: {
    backgroundColor: '#081E3E',
  },
  prepPillBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
  },
  prepPillBadgeTextActive: {
    color: '#FFFFFF',
  },
  testItemNotes: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
    fontStyle: 'italic',
  },
  testTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 5,
  },
  testTagFasting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  testTagFastingText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B45309',
  },
  testTagWater: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  testTagWaterText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0369A1',
  },

  /* Step 5: Date Selector Box & Calendar Trigger Button */
  dateSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 6,
  },
  dateBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarSquareIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateFullSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  dateBoldMain: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
    marginTop: 2,
  },
  calendarTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#081E3E',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  calendarTriggerBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#081E3E',
  },

  /* Modal 8: Medicine Schedule Modal */
  scheduleModalCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  scheduleModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scheduleModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#081E3E',
  },
  scheduleModalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  timeSlotCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  timeSlotCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00B894',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  timeSlotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSlotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  timeSlotIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  togglePillBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 54,
    alignItems: 'center',
  },
  togglePillOn: {
    backgroundColor: '#00B894',
  },
  togglePillOff: {
    backgroundColor: '#E2E8F0',
  },
  togglePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  togglePillTextOn: {
    color: '#FFFFFF',
  },
  togglePillTextOff: {
    color: '#64748B',
  },
  foodToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  foodToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6.5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  foodToggleBtnActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  foodToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  foodToggleTextActive: {
    color: '#FFFFFF',
  },
  scheduleSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  scheduleSummaryText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '700',
    flex: 1,
  },
  scheduleModalFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  scheduleCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  scheduleSaveBtn: {
    flex: 2,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleSaveBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Modal 9: Calendar Pop-up Modal */
  calendarModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  calModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  calModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#081E3E',
  },
  calModalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  calModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  calModalSelectedSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  calModalSelectedMain: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
    marginTop: 1,
  },
  calModalConfirmBtn: {
    backgroundColor: '#081E3E',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  calModalConfirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
