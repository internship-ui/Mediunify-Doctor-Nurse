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
import FollowBottomSlidePanel from '../components/FollowBottomSlidePanel';

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
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Today' | 'Upcoming' | 'Overdue'
  const [searchQuery, setSearchQuery] = useState('');

  // Upcoming & Overdue pop-up modal states
  const [upcomingModalPatient, setUpcomingModalPatient] = useState(null);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [upcomingStep, setUpcomingStep] = useState('initial'); // 'initial' | 'confirmed'
  const [overdueModalPatient, setOverdueModalPatient] = useState(null);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [overdueStep, setOverdueStep] = useState('initial'); // 'initial' | 'confirmed'

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

  // Step 1: Medical Records sub-tab & Payment Questionnaire Modal
  const [recordsTab, setRecordsTab] = useState('notes'); // 'notes' | 'reports' | 'prescriptions'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);

  // Step 2: Consult Notes state (single notes field with Add On quick phrases)
  const [consultNotesText, setConsultNotesText] = useState(
    'Maintain daily medication routine. Restrict dietary sodium to less than 2g/day. Hydrate well and monitor home readings.'
  );
  const [showAddOnModal, setShowAddOnModal] = useState(false);

  // Step 3: Prescriptions list (both search and manual entries populate here)
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'rx-1',
      name: 'Tab. Amlodipine 5mg',
      dosage: '1 tablet',
      frequency: '1 daily',
      duration: '30 Days',
      timing: 'Morning (After Food)',
      morningOn: true,
      morningFood: 'After Food',
      afternoonOn: false,
      afternoonFood: 'After Food',
      nightOn: false,
      nightFood: 'After Food',
      source: 'search',
    },
    {
      id: 'rx-2',
      name: 'Tab. Telmisartan 40mg',
      dosage: '1 tablet',
      frequency: '1 daily',
      duration: '30 Days',
      timing: 'Night (After Food)',
      morningOn: false,
      morningFood: 'After Food',
      afternoonOn: false,
      afternoonFood: 'After Food',
      nightOn: true,
      nightFood: 'After Food',
      source: 'manual',
    },
  ]);

  // Step 3 - Card 1: Search & Add Medicine State
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [searchMedName, setSearchMedName] = useState('');
  const [searchMedDosage, setSearchMedDosage] = useState('1 tablet');
  const [searchMedFrequency, setSearchMedFrequency] = useState('1 daily');
  const [searchMedDuration, setSearchMedDuration] = useState('30 days');
  const [searchMedTiming, setSearchMedTiming] = useState('Morning (After Food) · Night (After Food)');

  // Step 3 - Card 2: Manual Medicine Entry State
  const [manualMedName, setManualMedName] = useState('');
  const [manualMedDosage, setManualMedDosage] = useState('1 tablet');
  const [manualMedFrequency, setManualMedFrequency] = useState('1 daily');
  const [manualMedDuration, setManualMedDuration] = useState('14 days');
  const [manualMedTiming, setManualMedTiming] = useState('Morning (After Food) · Night (After Food)');

  // Medicine Schedule Modal State (Morning, Afternoon, Night with On/Off & Before/After Food)
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [scheduleTargetCard, setScheduleTargetCard] = useState('search'); // 'search' | 'manual' | med object
  const [morningOn, setMorningOn] = useState(true);
  const [morningFood, setMorningFood] = useState('After Food'); // 'Before Food' | 'After Food'
  const [afternoonOn, setAfternoonOn] = useState(false);
  const [afternoonFood, setAfternoonFood] = useState('After Food'); // 'Before Food' | 'After Food'
  const [nightOn, setNightOn] = useState(true);
  const [nightFood, setNightFood] = useState('After Food'); // 'Before Food' | 'After Food'

  // Accept -> OK Confirmation flow states & Bottom Slide Panel states
  const [acceptConfirmationPatient, setAcceptConfirmationPatient] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [isFollowUpRequired, setIsFollowUpRequired] = useState(true);
  const [activeTestCategory, setActiveTestCategory] = useState('lab'); // 'lab' | 'radiology'
  const [showSaveToast, setShowSaveToast] = useState(false);

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

  const COMMON_RADIOLOGY_TESTS = [
    'Chest X-Ray PA View',
    '2D Echocardiogram with Doppler',
    'CT Coronary Angiogram',
    'MRI Brain with Contrast',
    'Ultrasound Abdomen & Pelvis',
    '12-Lead Resting ECG',
    'Doppler Ultrasound Carotid',
    'Bone Mineral Density (DEXA Scan)',
  ];

  // Step 4: Test Requirements state (Search dropdown + Manual typing + Prep + Instructions)
  const [selectedTests, setSelectedTests] = useState([
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
  ]);

  // Step 4 - Card 1: Search & Add Test State
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [searchTestName, setSearchTestName] = useState('');
  const [searchTestPrep, setSearchTestPrep] = useState('Fasting 10 hrs');
  const [searchTestInstructions, setSearchTestInstructions] = useState('Routine Serum sample');

  // Step 4 - Card 2: Manual Diagnostic Test Entry State
  const [manualTestName, setManualTestName] = useState('');
  const [manualTestPrep, setManualTestPrep] = useState('Fasting 10 hrs');
  const [manualTestInstructions, setManualTestInstructions] = useState('Clinical evaluation & serum analysis');

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

  // Filtered patients for main list (in-person and video combined)
  const filteredPatients = followUpPatients.filter((p) => {
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

    return matchesFilter && matchesSearch;
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
    setCurrentStep(1); // Start at Step 1: Consult Notes
    setIsSlideDrawerOpen(true);
  };

  const handleAcceptFollowUp = (patientId) => {
    setFollowUpPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, isAccepted: true } : p))
    );
    setSelectedPatientId(patientId);
    setCurrentStep(1); // Start at Step 1: Consult Notes
    setIsSlideDrawerOpen(true);
  };

  const handleInitiateAccept = (patient) => {
    setAcceptConfirmationPatient(patient);
    setShowAcceptModal(true);
  };

  const handleConfirmAcceptOk = () => {
    if (acceptConfirmationPatient) {
      setFollowUpPatients((prev) =>
        prev.map((p) =>
          p.id === acceptConfirmationPatient.id ? { ...p, isAccepted: true } : p
        )
      );
      setSelectedPatientId(acceptConfirmationPatient.id);
      setCurrentStep(1); // Step 1: Consult Notes
      setShowAcceptModal(false);
      setIsSlideDrawerOpen(true); // Open bottom slide panel
    }
  };

  const handleQuickSave = () => {
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 2000);
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

  const handleOpenScheduleModal = (target = 'search') => {
    setScheduleTargetCard(target);
    if (typeof target === 'object' && target !== null) {
      setMorningOn(target.morningOn ?? (target.timing?.includes('Morning') ? true : false));
      setMorningFood(target.morningFood || 'After Food');
      setAfternoonOn(target.afternoonOn ?? (target.timing?.includes('Afternoon') ? true : false));
      setAfternoonFood(target.afternoonFood || 'After Food');
      setNightOn(target.nightOn ?? (target.timing?.includes('Night') ? true : false));
      setNightFood(target.nightFood || 'After Food');
    } else {
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
    if (typeof scheduleTargetCard === 'object' && scheduleTargetCard !== null) {
      setPrescriptions((prev) =>
        prev.map((item) =>
          item.id === scheduleTargetCard.id
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
    } else if (scheduleTargetCard === 'manual') {
      setManualMedTiming(text);
    } else {
      setSearchMedTiming(text);
    }
    setScheduleModalVisible(false);
    setScheduleTargetCard('search');
  };

  // Step 3: Select from search dropdown -> empties search input and sets searchMedName
  const handleSelectDropdownMedicine = (med) => {
    setSearchMedName(med);
    setMedicineSearchQuery(''); // Clears search box so it is empty!
    setShowMedDropdown(false);
  };

  const handleAddSearchMedicine = () => {
    if (!searchMedName.trim()) return;
    const timing = searchMedTiming || formatScheduleText(morningOn, morningFood, afternoonOn, afternoonFood, nightOn, nightFood);
    const newRx = {
      id: `rx-${Date.now()}`,
      name: searchMedName.trim(),
      dosage: searchMedDosage.trim() || '1 tablet',
      frequency: searchMedFrequency.trim() || '1 daily',
      duration: searchMedDuration.trim() || '30 days',
      timing,
      source: 'search',
    };
    setPrescriptions((prev) => [...prev, newRx]);
    setSearchMedName('');
    setMedicineSearchQuery('');
    setShowMedDropdown(false);
  };

  const handleAddManualMedicine = () => {
    if (!manualMedName.trim()) return;
    const timing = manualMedTiming || formatScheduleText(morningOn, morningFood, afternoonOn, afternoonFood, nightOn, nightFood);
    const newRx = {
      id: `rx-${Date.now()}`,
      name: manualMedName.trim(),
      dosage: manualMedDosage.trim() || '1 tablet',
      frequency: manualMedFrequency.trim() || '1 daily',
      duration: manualMedDuration.trim() || '14 days',
      timing,
      source: 'manual',
    };
    setPrescriptions((prev) => [...prev, newRx]);
    setManualMedName('');
    setManualMedDosage('1 tablet');
    setManualMedFrequency('1 daily');
    setManualMedDuration('14 days');
  };

  const handleRemoveMedicine = (id) => {
    setPrescriptions((prev) => prev.filter((m) => m.id !== id));
  };

  // Step 4 Handlers: Tests & Diagnostics
  const handleSelectDropdownTest = (testName) => {
    setSearchTestName(testName);
    setTestSearchQuery(''); // Clears search box so it is empty!
    setShowTestDropdown(false);
  };

  const handleAddSearchTest = () => {
    if (!searchTestName.trim()) return;
    const testItem = {
      id: `test-${Date.now()}`,
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

  const handleAddManualTest = () => {
    if (!manualTestName.trim()) return;
    const testItem = {
      id: `test-${Date.now()}`,
      name: manualTestName.trim(),
      prep: manualTestPrep.trim() || 'Normal diet',
      instructions: manualTestInstructions.trim() || 'Clinical evaluation',
      source: 'manual',
    };
    setSelectedTests((prev) => [...prev, testItem]);
    setManualTestName('');
    setManualTestPrep('Fasting 10 hrs');
    setManualTestInstructions('Clinical evaluation');
  };

  const handleRemoveTest = (id) => {
    setSelectedTests((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFinalSubmit = () => {
    const rxSummary = prescriptions.length > 0 ? `e-prescription (${prescriptions.length} medicine(s)) dispatched` : 'e-prescription saved';
    const testSummary = selectedTests.length > 0 ? `${selectedTests.length} diagnostic test(s) ordered` : 'no lab tests required';
    const schedSummary = isFollowUpRequired
      ? `next ${selectedFollowUpMode} follow-up scheduled for ${selectedFollowUpDate} at ${selectedFollowUpTime}`
      : 'no return follow-up required';
    setConfirmationModal({
      visible: true,
      title: 'Consultation Details Sent',
      message: `Consultation details have been sent to ${selectedPatient.name}. Consultation notes have been saved, ${rxSummary}, ${testSummary}, and ${schedSummary}.`,
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
        {/* 3. CATEGORY FILTERS: ALL, TODAY, UPCOMING, OVERDUE             */}
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
              <Text style={styles.emptyTitle}>No {activeFilter.toLowerCase()} follow-ups</Text>
              <Text style={styles.emptySubtitle}>Try choosing another filter tab or search for another patient.</Text>
            </View>
          ) : (
            filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatient?.id && isSlideDrawerOpen;
              return (
                <TouchableOpacity
                  key={patient.id}
                  style={[styles.patientCard, isSelected && styles.patientCardSelected]}
                  onPress={() => {
                    if (patient.statusType === 'upcoming') {
                      setUpcomingModalPatient(patient);
                      setShowUpcomingModal(true);
                    } else if (patient.statusType === 'overdue') {
                      setOverdueModalPatient(patient);
                      setShowOverdueModal(true);
                    } else {
                      // Today appointment (In-Person and Video Call)
                      if (patient.isAccepted) {
                        handleOpenPatientDrawer(patient.id);
                      } else {
                        handleInitiateAccept(patient);
                      }
                    }
                  }}
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

                  {/* Right Side: Accept Button for Today and Arrow Icon */}
                  <View style={styles.cardActionsRight}>
                    {patient.statusType === 'today' && (
                      <TouchableOpacity
                        style={[
                          styles.acceptBtn,
                          patient.isAccepted && styles.acceptedBtnState,
                        ]}
                        onPress={(e) => {
                          e?.stopPropagation?.();
                          if (patient.isAccepted) {
                            handleOpenPatientDrawer(patient.id);
                          } else {
                            handleInitiateAccept(patient);
                          }
                        }}
                        activeOpacity={0.85}
                      >
                        <Ionicons
                          name={patient.isAccepted ? 'checkmark-circle' : 'checkmark'}
                          size={14}
                          color="#FFFFFF"
                        />
                        <Text style={styles.acceptBtnText}>
                          {patient.isAccepted ? 'Accepted' : 'Accept'}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <View style={styles.arrowIconWrap}>
                      <Ionicons name="chevron-forward" size={18} color="#081E3E" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 6. LARGE BOTTOM SLIDE PANEL (EXTRACTED COMPONENT)              */}
      {/*    FollowBottomSlidePanel (followbottomslidepanel.js)          */}
      {/* ============================================================== */}
      {isSlideDrawerOpen && selectedPatient && (
        <FollowBottomSlidePanel
          isOpen={isSlideDrawerOpen}
          patient={selectedPatient}
          onClose={() => setIsSlideDrawerOpen(false)}
          setActiveTab={setActiveTab}
          onCloseDrawer={onCloseDrawer}
          onFinalSubmit={() => {
            // Consultation completed
          }}
        />
      )}

      {/* ============================================================== */}
      {/* ACCEPT CONFIRMATION POP-UP MODAL (Accept -> OK Flow)           */}
      {/* ============================================================== */}
      <Modal
        visible={showAcceptModal && !!acceptConfirmationPatient}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAcceptModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.acceptConfirmationCard}>
            <View style={styles.acceptIconBadge}>
              <Ionicons name="checkmark-circle" size={36} color="#00B894" />
            </View>

            <Text style={styles.acceptModalHeading}>Accept Follow-up Appointment</Text>
            <Text style={styles.acceptModalSubText}>
              Please confirm that you wish to accept this follow-up consultation with the patient.
            </Text>

            {acceptConfirmationPatient && (
              <View style={styles.acceptPatientBox}>
                <View style={styles.acceptPatientRow}>
                  <View style={styles.acceptPatientAvatar}>
                    <Text style={styles.acceptPatientAvatarText}>
                      {acceptConfirmationPatient.initials}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.acceptPatientName}>{acceptConfirmationPatient.name}</Text>
                    <Text style={styles.acceptPatientMeta}>
                      {acceptConfirmationPatient.age} yrs · {acceptConfirmationPatient.gender} · {acceptConfirmationPatient.bloodGroup} · ID {acceptConfirmationPatient.idTag}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.channelBadge,
                      acceptConfirmationPatient.channel === 'Video'
                        ? styles.channelBadgeVideo
                        : styles.channelBadgeInPerson,
                    ]}
                  >
                    <Ionicons
                      name={acceptConfirmationPatient.channel === 'Video' ? 'videocam' : 'people'}
                      size={12}
                      color={acceptConfirmationPatient.channel === 'Video' ? '#7C3AED' : '#0284C7'}
                    />
                    <Text
                      style={[
                        styles.channelBadgeText,
                        acceptConfirmationPatient.channel === 'Video'
                          ? styles.channelTextVideo
                          : styles.channelTextInPerson,
                      ]}
                    >
                      {acceptConfirmationPatient.channel === 'Video' ? 'Video' : 'In-Person'}
                    </Text>
                  </View>
                </View>

                <View style={styles.acceptDivider} />

                <View style={styles.acceptDetailLine}>
                  <Ionicons name="time-outline" size={14} color="#00B894" />
                  <Text style={styles.acceptDetailText}>
                    Slot: <Text style={{ fontWeight: '700', color: '#081E3E' }}>{acceptConfirmationPatient.timeSlot}</Text>
                  </Text>
                </View>
                <View style={[styles.acceptDetailLine, { marginTop: 4 }]}>
                  <Ionicons name="medical-outline" size={14} color="#64748B" />
                  <Text style={styles.acceptDetailText} numberOfLines={2}>
                    {acceptConfirmationPatient.objective}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.acceptActionBtnsRow}>
              <TouchableOpacity
                style={styles.acceptCancelBtn}
                onPress={() => setShowAcceptModal(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.acceptCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptOkBtn}
                onPress={handleConfirmAcceptOk}
                activeOpacity={0.88}
              >
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                <Text style={styles.acceptOkBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 7. QUESTIONNAIRE MODAL: "FOR NEXT FOLLOW-UP NEED PAYMENT?"     */}
      {/* ============================================================== */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.paymentModalCard}>
            <View style={styles.paymentIconCircle}>
              <Ionicons name="card-outline" size={28} color="#00B894" />
            </View>
            <Text style={styles.paymentModalHeaderTitle}>Follow-up Protocol</Text>
            <Text style={styles.paymentModalQuestion}>for Next follow-up need payment?</Text>
            <Text style={styles.paymentModalSub}>
              Select whether the upcoming consultation requires patient fee payment or is complimentary.
            </Text>

            <View style={styles.paymentBtnsRow}>
              <TouchableOpacity
                style={styles.paymentOptionBtnNo}
                onPress={() => {
                  setPaymentRequired(false);
                  setShowPaymentModal(false);
                  setCurrentStep(2);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="close-circle" size={17} color="#64748B" />
                <Text style={styles.paymentOptionBtnNoText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentOptionBtnYes}
                onPress={() => {
                  setPaymentRequired(true);
                  setShowPaymentModal(false);
                  setCurrentStep(2);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={17} color="#FFFFFF" />
                <Text style={styles.paymentOptionBtnYesText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 10. UPCOMING FOLLOW-UP POP-UP MODAL                            */}
      {/* for upcoming --> clicked on patient profile --> pop-up -->      */}
      {/* request see the patients profile ---> ok                       */}
      {/* ============================================================== */}
      <Modal
        visible={showUpcomingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUpcomingModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.followUpRequestModalCard}>
            <View style={[styles.followUpModalIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="calendar" size={32} color="#0284C7" />
            </View>

            <Text style={styles.followUpModalTitle}>Upcoming Follow-Up</Text>
            <Text style={styles.followUpModalSub}>
              Scheduled consultation details for upcoming review
            </Text>

            {upcomingModalPatient && (
              <View style={styles.followUpModalPatientBox}>
                <View style={styles.modalPatientHeaderRow}>
                  <View style={styles.modalPatientAvatar}>
                    <Text style={styles.modalPatientAvatarText}>
                      {upcomingModalPatient.initials}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalPatientName}>{upcomingModalPatient.name}</Text>
                    <Text style={styles.modalPatientMeta}>
                      {upcomingModalPatient.age} yrs · {upcomingModalPatient.gender} · ID {upcomingModalPatient.idTag}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalPatientDivider} />

                <View style={styles.modalPatientDetailRow}>
                  <Ionicons name="time-outline" size={14} color="#0284C7" />
                  <Text style={styles.modalPatientDetailText}>
                    Scheduled: {upcomingModalPatient.timeSlot}
                  </Text>
                </View>
                <View style={[styles.modalPatientDetailRow, { marginTop: 4 }]}>
                  <Ionicons name="medical-outline" size={14} color="#64748B" />
                  <Text style={styles.modalPatientDetailText}>
                    {upcomingModalPatient.objective}
                  </Text>
                </View>
              </View>
            )}

            {/* Just below that OK button directing to follow-ups page */}
            <TouchableOpacity
              style={[styles.followUpModalActionBtn, { backgroundColor: '#00B894', marginTop: 16 }]}
              onPress={() => setShowUpcomingModal(false)}
              activeOpacity={0.88}
            >
              <Text style={styles.followUpModalActionBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 11. OVERDUE FOLLOW-UP POP-UP MODAL                             */}
      {/* for overdue --> clicked on patient profile --> pop-up -->       */}
      {/* request again --> just ok                                      */}
      {/* ============================================================== */}
      <Modal
        visible={showOverdueModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOverdueModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.followUpRequestModalCard}>
            {overdueStep === 'initial' ? (
              <>
                <View style={[styles.followUpModalIconWrap, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="alert-circle" size={32} color="#DC2626" />
                </View>

                <Text style={styles.followUpModalTitle}>Overdue Follow-Up</Text>
                <Text style={styles.followUpModalSub}>
                  This patient has missed their follow-up window. Send a prompt to request again.
                </Text>

                {overdueModalPatient && (
                  <View style={[styles.followUpModalPatientBox, { borderColor: '#FECACA' }]}>
                    <View style={styles.modalPatientHeaderRow}>
                      <View style={[styles.modalPatientAvatar, { backgroundColor: '#FEE2E2' }]}>
                        <Text style={[styles.modalPatientAvatarText, { color: '#DC2626' }]}>
                          {overdueModalPatient.initials}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalPatientName}>{overdueModalPatient.name}</Text>
                        <Text style={styles.modalPatientMeta}>
                          {overdueModalPatient.age} yrs · {overdueModalPatient.gender} · ID {overdueModalPatient.idTag}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalPatientDivider} />

                    <View style={styles.modalPatientDetailRow}>
                      <Ionicons name="alert-circle-outline" size={14} color="#DC2626" />
                      <Text style={[styles.modalPatientDetailText, { color: '#DC2626', fontWeight: '700' }]}>
                        Overdue: {overdueModalPatient.timeSlot}
                      </Text>
                    </View>
                    <View style={[styles.modalPatientDetailRow, { marginTop: 4 }]}>
                      <Ionicons name="medical-outline" size={14} color="#64748B" />
                      <Text style={styles.modalPatientDetailText}>
                        {overdueModalPatient.objective}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Button: Request again */}
                <TouchableOpacity
                  style={[styles.followUpModalActionBtn, { backgroundColor: '#DC2626' }]}
                  onPress={() => setOverdueStep('confirmed')}
                  activeOpacity={0.88}
                >
                  <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.followUpModalActionBtnText}>Request again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.followUpModalCancelBtn}
                  onPress={() => setShowOverdueModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.followUpModalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={[styles.followUpModalIconWrap, { backgroundColor: '#E6FAF6' }]}>
                  <Ionicons name="checkmark-circle" size={40} color="#00B894" />
                </View>

                <Text style={styles.followUpModalTitle}>Request Sent</Text>
                <Text style={styles.followUpModalSub}>
                  Follow-up consultation request has been sent to {overdueModalPatient?.name} again.
                </Text>

                {/* Just OK button as requested */}
                <TouchableOpacity
                  style={[styles.followUpModalActionBtn, { backgroundColor: '#00B894', marginTop: 12 }]}
                  onPress={() => setShowOverdueModal(false)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.followUpModalActionBtnText}>OK</Text>
                </TouchableOpacity>
              </>
            )}
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
    boxSizing: 'border-box',
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
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    boxSizing: 'border-box',
  },
  cardActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#00B894',
  },
  acceptedBtnState: {
    backgroundColor: '#059669',
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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

  /* Common Input Box */
  textInputBox: {
    height: 42,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#081E3E',
  },

  /* Step 2: Consult Notes */
  consultNoteCardBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  consultNoteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  consultNoteCardHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  addOnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addOnBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addOnChipsContainer: {
    backgroundColor: '#F0FDF9',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  addOnChipsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 8,
  },
  addOnChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  addOnChipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addOnChipPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#065F46',
  },
  consultNoteTextarea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    fontSize: 13.5,
    color: '#1E293B',
    minHeight: 140,
    textAlignVertical: 'top',
  },

  /* Step 3 & 4: Dual Card Boxes & Search/Manual Entry */
  dualCardBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  dualCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 10,
  },
  dualCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  tallerSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  tallerSearchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#081E3E',
    outlineStyle: 'none',
  },
  highlightedDropdownCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 10,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  highlightedDropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownMedItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  dropdownHighlightedSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#00B894',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dropdownHighlightedSelectText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  fieldSubTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  addUpChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginBottom: 8,
  },
  addUpChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addUpChipActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  addUpChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  addUpChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scheduleRowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  scheduleRowValueText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
  },
  scheduleAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  scheduleAddBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    backgroundColor: '#081E3E',
    borderRadius: 10,
    marginTop: 8,
  },
  primaryActionBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Rx & Test Lists and Badges */
  rxItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sourceBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sourceBadgeSearch: {
    backgroundColor: '#E6FFFA',
  },
  sourceBadgeManual: {
    backgroundColor: '#EFF6FF',
  },
  sourceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#081E3E',
  },
  rxMetaDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  rxTimingText: {
    fontSize: 11.5,
    color: '#00B894',
    fontWeight: '700',
    marginTop: 3,
  },
  rxRemoveBtn: {
    padding: 6,
  },
  testMetaDetail: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* Step 5: Date & Time + Payment Banner */
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 10,
  },
  modeToggleBtnActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  modeToggleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  paymentStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
  },
  paymentStatusBannerYes: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  paymentStatusBannerNo: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  paymentStatusBannerText: {
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
  },
  paymentStatusBannerTextYes: {
    color: '#92400E',
  },
  paymentStatusBannerTextNo: {
    color: '#065F46',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  dateDisplayBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  dateDisplayText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  calendarTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  calendarTriggerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  summarySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* Static Drawer Bottom Bar & Step 1 Buttons */
  step1BottomBarWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  step1BottomPromptText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  step1BtnsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  step1NoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  step1NoBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  step1YesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: '#00B894',
    borderRadius: 10,
  },
  step1YesBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepNavBtnsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  skipStepBtn: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skipStepBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },

  /* Payment Questionnaire Modal */
  paymentModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
  paymentIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6FFFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  paymentModalHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00B894',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  paymentModalQuestion: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  paymentModalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  paymentBtnsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  paymentOptionBtnNo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentOptionBtnNoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  paymentOptionBtnYes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    backgroundColor: '#00B894',
    borderRadius: 10,
  },
  paymentOptionBtnYesText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 10 & 11. Follow-Up Request Pop-up Modals (Upcoming / Overdue) */
  followUpRequestModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
    boxShadow: '0 12px 36px rgba(8, 30, 62, 0.22)',
  },
  followUpModalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  followUpModalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#081E3E',
    marginBottom: 6,
    textAlign: 'center',
  },
  followUpModalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  followUpModalPatientBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 20,
  },
  modalPatientHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalPatientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPatientAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0284C7',
  },
  modalPatientName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalPatientMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalPatientDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  modalPatientDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  modalPatientDetailText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
  },
  followUpModalActionBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
  },
  followUpModalActionBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  followUpModalCancelBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  followUpModalCancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  /* ================================================================ */
  /* BOTTOM SLIDE PANEL LAYOUT (92vh Height, Navy & Teal Accents)     */
  /* ================================================================ */
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
    maxHeight: '95vh',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  panelHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  panelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  panelHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
  },
  panelHeaderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
    flexWrap: 'wrap',
  },
  panelHeaderPatientName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00B894',
  },
  panelHeaderMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  channelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  channelPillInPerson: {
    backgroundColor: '#E0F2FE',
  },
  channelPillVideo: {
    backgroundColor: '#EDE9FE',
  },
  channelPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  channelPillTextInPerson: {
    color: '#0284C7',
  },
  channelPillTextVideo: {
    color: '#7C3AED',
  },
  panelCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /* Two Column Layout */
  panelTwoColWrap: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  panelLeftCol: {
    width: '32%',
    minWidth: 280,
    maxWidth: 380,
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
    overflowY: 'auto',
  },
  panelRightCol: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflowY: 'auto',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 48,
  },

  /* Left Guidance Components */
  stepHeaderPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 10,
  },
  stepHeaderPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  leftStepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  leftStepIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftStepTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#081E3E',
  },
  leftStepGuidanceText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  leftGuidanceBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  leftGuidanceBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  guidanceBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  guidanceBulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B894',
  },
  guidanceBulletText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  leftPatientSummaryBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  leftPatientSummaryTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  leftPatientSummaryText: {
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 16,
  },
  leftQuickActionsWrap: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  leftQuickActionsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  leftQuickActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickActionBtnPrimary: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  quickActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  quickActionBtnTextPrimary: {
    color: '#FFFFFF',
  },
  quickActionBtnDisabled: {
    opacity: 0.45,
  },

  /* Right Section Components */
  rightSectionHeader: {
    marginBottom: 18,
  },
  rightSectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#081E3E',
  },
  rightSectionSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  categoryTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
    gap: 6,
  },
  categoryTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoryTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  categoryTabText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryTabTextActive: {
    color: '#081E3E',
  },
  boolToggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  boolToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    minWidth: 100,
  },
  boolToggleBtnActiveYes: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  boolToggleBtnActiveNo: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  boolToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  boolToggleTextActive: {
    color: '#FFFFFF',
  },
  noFollowUpNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  noFollowUpNoticeText: {
    fontSize: 12.5,
    color: '#1E40AF',
    lineHeight: 18,
    flex: 1,
  },

  /* Review Summary Components */
  reviewSummarySection: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  reviewSummaryHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
    marginBottom: 12,
  },
  reviewSummaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
  },
  reviewSummaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  reviewSummaryCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#081E3E',
  },
  reviewSummaryCardBody: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  finalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 14,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  finalSubmitBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Fixed Bottom Action Bar */
  panelBottomActionBar: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    borderTopWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  bottomBarBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  bottomBarBackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  bottomBarSkipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  bottomBarSkipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  bottomBarPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#081E3E',
    gap: 8,
  },
  bottomBarPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Empty State for Lists */
  emptyItemsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  emptyItemsText: {
    fontSize: 12,
    color: '#94A3B8',
  },

  /* Accept Confirmation Modal */
  acceptConfirmationCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  acceptIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#00B894',
  },
  acceptModalHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
    textAlign: 'center',
    marginBottom: 6,
  },
  acceptModalSubText: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  acceptPatientBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  acceptPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  acceptPatientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptPatientAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  acceptPatientName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  acceptPatientMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  acceptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  acceptDetailLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  acceptDetailText: {
    fontSize: 12,
    color: '#475569',
  },
  acceptActionBtnsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  acceptCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptCancelBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  acceptOkBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#00B894',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  acceptOkBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Save Toast */
  saveToastPill: {
    position: 'fixed',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#081E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 2000000,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  saveToastText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
