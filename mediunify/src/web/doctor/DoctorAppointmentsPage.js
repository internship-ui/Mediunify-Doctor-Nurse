import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { patients } from '../../data/mockData';

const COMMON_DOC_TYPES = [
  'Blood Test / CBC',
  'ECG 12-Lead Report',
  'Discharge Summary',
  'Prior Prescriptions',
  'X-Ray / MRI Imaging',
  'Lipid Profile',
];

const MEDICINE_CATALOG = [
  { name: 'Paracetamol 650mg (Dolo)', category: 'Antipyretic / Analgesic', dosage: '1 Tablet', freq: 'TDS (Thrice daily)', duration: '5 days' },
  { name: 'Amoxicillin + Clavulanic 625mg (Augmentin)', category: 'Antibiotic', dosage: '1 Tablet', freq: 'BD (Twice daily)', duration: '5 days' },
  { name: 'Azithromycin 500mg (Azithral)', category: 'Antibiotic', dosage: '1 Tablet', freq: 'OD (Once daily)', duration: '3 days' },
  { name: 'Pantoprazole 40mg (Pan-40)', category: 'Antacid / PPI', dosage: '1 Tablet', freq: 'OD (Morning before food)', duration: '7 days' },
  { name: 'Cetirizine 10mg', category: 'Antihistamine', dosage: '1 Tablet', freq: 'Night OD', duration: '5 days' },
  { name: 'Montelukast 10mg + Levocetirizine 5mg (Montair LC)', category: 'Anti-allergy / Respiratory', dosage: '1 Tablet', freq: 'Night OD', duration: '7 days' },
  { name: 'Metformin 500mg', category: 'Antidiabetic', dosage: '1 Tablet', freq: 'BD (With meals)', duration: '30 days' },
  { name: 'Amlodipine 5mg', category: 'Antihypertensive', dosage: '1 Tablet', freq: 'OD (Morning)', duration: '30 days' },
  { name: 'Telmisartan 40mg', category: 'Antihypertensive', dosage: '1 Tablet', freq: 'OD (Morning)', duration: '30 days' },
  { name: 'Ibuprofen 400mg', category: 'NSAID / Pain relief', dosage: '1 Tablet', freq: 'BD (After food)', duration: '3 days' },
  { name: 'Cough Syrup (Ascoril LS)', category: 'Bronchodilator / Mucolytic', dosage: '10 ml', freq: 'TDS (Thrice daily)', duration: '5 days' },
  { name: 'Oral Rehydration Salts (ORS)', category: 'Hydration Electrolytes', dosage: '1 Sachet in 1L water', freq: 'SOS (As needed)', duration: '3 days' },
  { name: 'Vitamin C 500mg + Zinc (Limcee)', category: 'Immune Supplement', dosage: '1 Chewable Tab', freq: 'OD (Once daily)', duration: '15 days' },
  { name: 'B-Complex with B12 (Becadexamin)', category: 'Multivitamin', dosage: '1 Capsule', freq: 'OD (After food)', duration: '30 days' },
];

const TEST_CATALOG = [
  { name: 'Complete Blood Count (CBC)', category: 'Hematology', defaultInstructions: 'Random / No fasting needed' },
  { name: 'Fasting Blood Sugar (FBS)', category: 'Diabetes / Biochemistry', defaultInstructions: 'Fasting 8-10 hrs (drinking only water)' },
  { name: 'Postprandial Blood Sugar (PPBS)', category: 'Diabetes / Biochemistry', defaultInstructions: 'Post-meal 2 hrs exactly' },
  { name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetes Profile', defaultInstructions: 'Random / No fasting needed' },
  { name: 'Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)', category: 'Cardiology', defaultInstructions: 'Fasting 10-12 hrs' },
  { name: 'Liver Function Test (LFT)', category: 'Biochemistry', defaultInstructions: 'Fasting 8 hrs' },
  { name: 'Kidney Function Test (KFT / Serum Creatinine)', category: 'Nephrology', defaultInstructions: 'Hydrated / Normal fasting' },
  { name: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', defaultInstructions: 'Morning sample / fasting' },
  { name: 'Urine Routine & Microscopy', category: 'Pathology', defaultInstructions: 'Clean catch midstream morning urine' },
  { name: '12-Lead Electrocardiogram (ECG)', category: 'Cardiology', defaultInstructions: 'Rest 10 min prior' },
  { name: 'Chest X-Ray (PA View)', category: 'Radiology', defaultInstructions: 'Remove metallic items' },
  { name: 'Ultrasound Whole Abdomen (USG)', category: 'Sonography', defaultInstructions: 'Full bladder, 6 hrs fasting' },
  { name: 'Serum Electrolytes (Na+, K+, Cl-)', category: 'Biochemistry', defaultInstructions: 'Random / No fasting needed' },
  { name: 'Vitamin D3 & Vitamin B12', category: 'Vitamins Profile', defaultInstructions: 'Random / No fasting needed' },
];

export default function DoctorAppointmentsPage({
  setActiveTab,
  onStartConsultation,
  onStartConsultNotes,
  initialAppointmentId,
  initialOpenSlideDrawer,
  targetAppointment,
  onCloseDrawer,
}) {
  // Right side panel state
  const [recordsTab, setRecordsTab] = useState('notes'); // 'notes' | 'reports' | 'prescriptions'
  const [privacyDocs, setPrivacyDocs] = useState([
    {
      id: 'doc-1',
      name: 'Previous Discharge Summary.pdf',
      date: '02 Jul 2026',
      size: '2.1 MB',
      type: 'Hospital Record',
      status: 'Verified',
      isRequested: false,
    },
    {
      id: 'doc-2',
      name: 'Baseline 12-Lead ECG Report.pdf',
      date: '15 Aug 2026',
      size: '1.4 MB',
      type: 'Diagnostic Report',
      status: 'Verified',
      isRequested: false,
    },
    {
      id: 'doc-3',
      name: 'Digital Health Locker Consent (#HL-9921)',
      date: '30 Sep 2026',
      size: 'Encrypted Token',
      type: 'Consent Token',
      status: 'Active',
      isRequested: false,
    },
  ]);

  // Request Document Modal State
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [manualDocType, setManualDocType] = useState('');
  const [docInstructions, setDocInstructions] = useState('');
  const [docError, setDocError] = useState('');

  // Reschedule Calendar Modal State (matches user calendar screenshot)
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [rescheduleTargetPatient, setRescheduleTargetPatient] = useState(null);
  const [calendarNavTab, setCalendarNavTab] = useState('Date'); // 'Today' | 'Date' | 'Week' | 'Month' | 'Year'
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(5); // Default day 5 as in screenshot
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState('October 2026');
  const [selectedCalendarTime, setSelectedCalendarTime] = useState('11:30 AM');

  // Modals state for card interactions (centered in screen with theme matched)
  const [upcomingModalPatient, setUpcomingModalPatient] = useState(null);
  const [awaitingModalPatient, setAwaitingModalPatient] = useState(null);
  const [overdueModalPatient, setOverdueModalPatient] = useState(null);

  // Theme-matched in-app Notification / Alert Modal (centered, no native browser alerts!)
  const [themeModalAlert, setThemeModalAlert] = useState(null);

  const showThemeAlert = (title, message, icon = 'checkmark-circle-outline', onOk = null) => {
    setThemeModalAlert({ title, message, icon, onOk });
  };

  // ========================================================================
  // IN-PERSON 4-STEP CONSULTATION WORKFLOW STATES
  // Step 1: Patient details & static Start Consult
  // Step 2: Consult Notes (new right side slide page, no external navigation)
  // Step 3: Prescribe (Rx) with manual entry + search dropdown + timing toggles
  // Step 4: Test Requirements with manual entry + search dropdown + prep options
  // ========================================================================
  const [inPersonStep, setInPersonStep] = useState(1);

  // Step 2: Consult Notes
  const [inPersonSymptoms, setInPersonSymptoms] = useState('Mild fever and dry persistent cough for 3 days');
  const [inPersonDiagnosis, setInPersonDiagnosis] = useState('Acute Upper Respiratory Tract Infection (URTI)');
  const [inPersonExamNotes, setInPersonExamNotes] = useState('Chest clear bilaterally. Pharynx mildly congested. No wheezing. Normal heart sounds S1, S2.');
  const [inPersonAdvice, setInPersonAdvice] = useState('Warm saline gargles twice daily. Plenty of warm fluids. Adequate rest.');

  // Step 3: Prescriptions
  const [inPersonPrescriptions, setInPersonPrescriptions] = useState([
    {
      id: 'med-1',
      name: 'Paracetamol 650mg (Dolo)',
      dosage: '1 Tablet',
      freq: 'TDS (Thrice daily)',
      duration: '5 days',
      timing: { morning: true, afternoon: true, night: true, food: 'after' },
    },
    {
      id: 'med-2',
      name: 'Pantoprazole 40mg (Pan-40)',
      dosage: '1 Tablet',
      freq: 'OD (Once daily)',
      duration: '5 days',
      timing: { morning: true, afternoon: false, night: false, food: 'before' },
    },
  ]);
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [medDropdownVisible, setMedDropdownVisible] = useState(false);
  const [manualMedName, setManualMedName] = useState('');
  const [manualMedDosage, setManualMedDosage] = useState('1 Tablet');
  const [manualMedFreq, setManualMedFreq] = useState('BD (Twice daily)');
  const [manualMedDuration, setManualMedDuration] = useState('5 days');
  const [manualMedMorning, setManualMedMorning] = useState(true);
  const [manualMedAfternoon, setManualMedAfternoon] = useState(false);
  const [manualMedNight, setManualMedNight] = useState(true);
  const [manualMedFoodTiming, setManualMedFoodTiming] = useState('after'); // 'after' | 'before'

  // Step 4: Test Requirements
  const [inPersonTests, setInPersonTests] = useState([
    {
      id: 't-1',
      name: 'Complete Blood Count (CBC)',
      instructions: 'Random / No fasting needed',
      notes: 'Check TLC and platelet count',
    },
  ]);
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [testDropdownVisible, setTestDropdownVisible] = useState(false);
  const [manualTestName, setManualTestName] = useState('');
  const [manualTestInstructions, setManualTestInstructions] = useState('Random / No fasting needed');
  const [manualTestNotes, setManualTestNotes] = useState('');

  // Step 4: Follow-up Date & Time Modal
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [followUpInterval, setFollowUpInterval] = useState('1 Week');
  const [followUpDate, setFollowUpDate] = useState('07 Oct 2026');
  const [followUpTime, setFollowUpTime] = useState('11:30 AM');
  const [followUpMode, setFollowUpMode] = useState('In-Person');
  const [followUpNotes, setFollowUpNotes] = useState('Review with CBC report and symptom progression');

  // Appointments dataset
  const [appointments, setAppointments] = useState([
    // 1. TODAY
    {
      id: 'apt-today-rohan',
      tab: 'Today',
      initials: 'RM',
      avatarBg: '#E0F2FE',
      avatarColor: '#0284C7',
      name: 'Rohan Mehta',
      age: 34,
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: 'None recorded',
      medications: 'Amlodipine 5mg',
      reason: 'Hypertension & BP Review',
      time: 'Today, 10:30 AM',
      date: 'Today, 30 Sep 2026',
      slotTime: '10:30 AM',
      dueIn: 'in 10 min',
      type: 'Video',
      visitType: 'Follow-up',
      status: 'Confirmed',
      phone: '+91 98860 11234',
      fee: 600,
    },
    {
      id: 'apt-today-1',
      tab: 'Today',
      initials: 'PS',
      avatarBg: '#E0E7FF',
      avatarColor: '#3730A3',
      name: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      bloodGroup: 'O+',
      allergies: 'None known',
      medications: 'None recorded',
      reason: 'Seasonal allergy symptoms & sinus congestion',
      time: 'Today, 11:30 AM',
      date: 'Today, 30 Sep 2026',
      slotTime: '11:30 AM',
      dueIn: 'in 25 min',
      type: 'In-Person',
      visitType: 'First visit',
      status: 'Pending',
      phone: '+91 98452 34567',
      fee: 500,
    },
    {
      id: 'apt-today-2',
      tab: 'Today',
      initials: 'AM',
      avatarBg: '#E6F8F4',
      avatarColor: '#00B894',
      name: 'Andre Merritt',
      age: 27,
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: 'Penicillin',
      medications: 'None recorded',
      reason: 'New Patient • Cardiac Consult & Chest Flutter',
      time: 'Today, 01:15 PM',
      date: 'Today, 30 Sep 2026',
      slotTime: '01:15 PM',
      dueIn: 'in 2 hrs',
      type: 'Video',
      visitType: 'Consultation',
      status: 'Confirmed',
      phone: '+91 98452 77013',
      fee: 600,
    },
    {
      id: 'apt-today-3',
      tab: 'Today',
      initials: 'SI',
      avatarBg: '#DCFCE7',
      avatarColor: '#15803D',
      name: 'Sneha Iyer',
      age: 31,
      gender: 'Female',
      bloodGroup: 'A+',
      allergies: 'None known',
      medications: 'None recorded',
      reason: 'Routine BP Check & Lipid Profile Review',
      time: 'Today, 04:30 PM',
      date: 'Today, 30 Sep 2026',
      slotTime: '04:30 PM',
      type: 'In-Person',
      visitType: 'Routine check',
      status: 'Confirmed',
      phone: '+91 98860 99451',
      fee: 500,
    },
    {
      id: 'apt-today-meera',
      tab: 'Today',
      initials: 'MN',
      avatarBg: '#FEF3C7',
      avatarColor: '#D97706',
      name: 'Meera Nair',
      age: 48,
      gender: 'Female',
      bloodGroup: 'A+',
      allergies: 'Sulfa drugs',
      medications: 'Atorvastatin 10mg',
      reason: 'Chest Discomfort Review • Follow-up',
      time: 'Today, 11:30 AM',
      date: 'Today, 30 Sep 2026',
      slotTime: '11:30 AM',
      dueIn: 'in 40 min',
      type: 'In-Person',
      visitType: 'Follow-up',
      status: 'Confirmed',
      phone: '+91 98451 44521',
      fee: 500,
    },
    {
      id: 'apt-today-jakub',
      tab: 'Today',
      initials: 'JT',
      avatarBg: '#F1F5F9',
      avatarColor: '#475569',
      name: 'Jakub Tucker',
      age: 43,
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: 'None',
      medications: 'Metoprolol 25mg',
      reason: 'Post-MI Rehabilitation & ECG Check',
      time: 'Today, 01:00 PM',
      date: 'Today, 30 Sep 2026',
      slotTime: '01:00 PM',
      dueIn: 'in 1.5 hrs',
      type: 'In-Person',
      visitType: 'Specialist Consult',
      status: 'Confirmed',
      phone: '+91 98860 11984',
      fee: 750,
    },
    {
      id: 'apt-today-roosevelt',
      tab: 'Today',
      initials: 'RC',
      avatarBg: '#E6F8F4',
      avatarColor: '#00B894',
      name: 'Roosevelt Chase',
      age: 35,
      gender: 'Male',
      bloodGroup: 'AB+',
      allergies: 'Aspirin',
      medications: 'None recorded',
      reason: 'Routine ECG Review & Vitals Check',
      time: 'Today, 03:00 PM',
      date: 'Today, 30 Sep 2026',
      slotTime: '03:00 PM',
      dueIn: 'in 3.5 hrs',
      type: 'Video',
      visitType: 'Routine check',
      status: 'Confirmed',
      phone: '+91 97412 33419',
      fee: 600,
    },

    // 2. UPCOMING
    {
      id: 'apt-up-1',
      tab: 'Upcoming',
      initials: 'VP',
      avatarBg: '#E0F2FE',
      avatarColor: '#0284C7',
      name: 'Vikram Patel',
      age: 42,
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: 'None known',
      medications: 'Atorvastatin 10mg',
      reason: 'Cardiac follow-up & 12-Lead ECG Review',
      time: 'Tomorrow, 01 Oct · 10:30 AM',
      date: 'Tomorrow, 01 Oct 2026',
      slotTime: '10:30 AM',
      type: 'Video',
      visitType: 'Follow-up',
      status: 'Upcoming',
      phone: '+91 98860 12345',
      fee: 600,
    },
    {
      id: 'apt-up-2',
      tab: 'Upcoming',
      initials: 'AS',
      avatarBg: '#FEF3C7',
      avatarColor: '#D97706',
      name: 'Ananya Sen',
      age: 29,
      gender: 'Female',
      bloodGroup: 'O+',
      allergies: 'Penicillin',
      medications: 'None recorded',
      reason: 'Routine annual wellness physical & vitals check',
      time: 'Thu, 02 Oct · 02:00 PM',
      date: 'Thu, 02 Oct 2026',
      slotTime: '02:00 PM',
      type: 'In-Person',
      visitType: 'Annual Checkup',
      status: 'Upcoming',
      phone: '+91 97412 55678',
      fee: 500,
    },
    {
      id: 'apt-up-3',
      tab: 'Upcoming',
      initials: 'DJ',
      avatarBg: '#EDE9FE',
      avatarColor: '#7C3AED',
      name: 'Devendra Joshi',
      age: 52,
      gender: 'Male',
      bloodGroup: 'A+',
      allergies: 'None known',
      medications: 'Aspirin 75mg, Metoprolol 25mg',
      reason: 'Post-CABG recovery assessment & rehabilitation',
      time: 'Fri, 03 Oct · 11:15 AM',
      date: 'Fri, 03 Oct 2026',
      slotTime: '11:15 AM',
      type: 'In-Person',
      visitType: 'Specialist Consult',
      status: 'Upcoming',
      phone: '+91 98451 99012',
      fee: 750,
    },

    // 3. PENDING
    {
      id: 'apt-pend-1',
      tab: 'Pending',
      initials: 'RK',
      avatarBg: '#FEE2E2',
      avatarColor: '#DC2626',
      name: 'Rajesh Kumar',
      age: 38,
      gender: 'Male',
      bloodGroup: 'AB+',
      allergies: 'Sulfa drugs',
      medications: 'None recorded',
      reason: 'Chest heaviness on moderate exertion & dyspnea',
      time: 'Today, 05:15 PM',
      date: 'Today, 30 Sep 2026',
      slotTime: '05:15 PM',
      type: 'In-Person',
      visitType: 'First visit',
      status: 'Pending',
      phone: '+91 98860 44556',
      fee: 500,
    },
    {
      id: 'apt-pend-2',
      tab: 'Pending',
      initials: 'SR',
      avatarBg: '#E0F2FE',
      avatarColor: '#0284C7',
      name: 'Sunita Rao',
      age: 46,
      gender: 'Female',
      bloodGroup: 'O-',
      allergies: 'None',
      medications: 'Thyroxine 50mcg',
      reason: 'Palpitations and recurring evening dizziness',
      time: 'Tomorrow, 01 Oct · 04:00 PM',
      date: 'Tomorrow, 01 Oct 2026',
      slotTime: '04:00 PM',
      type: 'Video',
      visitType: 'Consultation',
      status: 'Pending',
      phone: '+91 99014 33221',
      fee: 600,
    },
    {
      id: 'apt-pend-3',
      tab: 'Pending',
      initials: 'TS',
      avatarBg: '#FEF3C7',
      avatarColor: '#D97706',
      name: 'Tanvi Shah',
      age: 33,
      gender: 'Female',
      bloodGroup: 'B+',
      allergies: 'Iodine contrast',
      medications: 'None recorded',
      reason: 'Thyroid enlargement & tachycardia check',
      time: 'Thu, 02 Oct · 11:00 AM',
      date: 'Thu, 02 Oct 2026',
      slotTime: '11:00 AM',
      type: 'In-Person',
      visitType: 'Follow-up',
      status: 'Pending',
      phone: '+91 98453 11889',
      fee: 500,
    },

    // 4. RESCHEDULED
    {
      id: 'apt-resched-1',
      tab: 'Rescheduled',
      initials: 'DV',
      avatarBg: '#FEF3C7',
      avatarColor: '#D97706',
      name: 'Deepak Verma',
      age: 50,
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: 'None',
      medications: 'Rosuvastatin 20mg',
      reason: 'Dyslipidemia follow-up & statin dose adjustment',
      time: 'Rescheduled to 03 Oct · 03:00 PM',
      prevTime: 'Was 29 Sep, 11:00 AM',
      date: '03 Oct 2026',
      slotTime: '03:00 PM',
      type: 'Video',
      visitType: 'Follow-up',
      status: 'Rescheduled',
      rescheduleStatus: 'Awaiting Patient Accept',
      phone: '+91 98452 88990',
      fee: 600,
    },
    {
      id: 'apt-resched-2',
      tab: 'Rescheduled',
      initials: 'NJ',
      avatarBg: '#EDE9FE',
      avatarColor: '#7C3AED',
      name: 'Neha Joshi',
      age: 34,
      gender: 'Female',
      bloodGroup: 'A+',
      allergies: 'Penicillin',
      medications: 'Labetalol 100mg',
      reason: 'Post-partum blood pressure monitoring',
      time: 'Rescheduled to 04 Oct · 01:30 PM',
      prevTime: 'Was 30 Sep, 02:30 PM',
      date: '04 Oct 2026',
      slotTime: '01:30 PM',
      type: 'In-Person',
      visitType: 'Follow-up',
      status: 'Rescheduled',
      rescheduleStatus: 'Awaiting Patient Accept',
      phone: '+91 98861 22334',
      fee: 500,
    },
    {
      id: 'apt-resched-3',
      tab: 'Rescheduled',
      initials: 'AS',
      avatarBg: '#E0F2FE',
      avatarColor: '#0284C7',
      name: 'Amit Saxena',
      age: 44,
      gender: 'Male',
      bloodGroup: 'O+',
      allergies: 'None',
      medications: 'None recorded',
      reason: 'Post-treadmill stress test review',
      time: 'Rescheduled to 05 Oct · 10:00 AM',
      prevTime: 'Was 01 Oct, 09:30 AM',
      date: '05 Oct 2026',
      slotTime: '10:00 AM',
      type: 'Video',
      visitType: 'Review',
      status: 'Rescheduled',
      rescheduleStatus: 'Awaiting Patient Accept',
      phone: '+91 98450 77119',
      fee: 600,
    },

    // 5. OVERDUE
    {
      id: 'apt-overdue-1',
      tab: 'Overdue',
      initials: 'KN',
      avatarBg: '#FEE2E2',
      avatarColor: '#DC2626',
      name: 'Karthik Nambiar',
      age: 49,
      gender: 'Male',
      bloodGroup: 'O+',
      allergies: 'Dust mites',
      medications: 'Budecort Inhaler',
      reason: 'Severe nocturnal asthma & recurrent cough review',
      time: 'Overdue: Yesterday, 29 Sep · 04:30 PM',
      overdueSince: 'Overdue by 1 day',
      date: '29 Sep 2026',
      slotTime: '04:30 PM',
      type: 'In-Person',
      visitType: 'First visit',
      status: 'Overdue',
      phone: '+91 97410 88776',
      fee: 500,
    },
    {
      id: 'apt-overdue-2',
      tab: 'Overdue',
      initials: 'RP',
      avatarBg: '#FEE2E2',
      avatarColor: '#DC2626',
      name: 'Ramesh Pillai',
      age: 61,
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: 'None recorded',
      medications: 'Metformin, Glimepiride',
      reason: 'Diabetic peripheral neuropathy & BP control',
      time: 'Overdue: Mon, 28 Sep · 10:00 AM',
      overdueSince: 'Overdue by 2 days',
      date: '28 Sep 2026',
      slotTime: '10:00 AM',
      type: 'Video',
      visitType: 'Follow-up',
      status: 'Overdue',
      phone: '+91 98450 11223',
      fee: 600,
    },
    {
      id: 'apt-overdue-3',
      tab: 'Overdue',
      initials: 'MS',
      avatarBg: '#FEE2E2',
      avatarColor: '#DC2626',
      name: 'Meenakshi Sundaram',
      age: 56,
      gender: 'Female',
      bloodGroup: 'A+',
      allergies: 'Aspirin',
      medications: 'Clopidogrel 75mg',
      reason: 'Post-stent medication compliance check',
      time: 'Overdue: Sun, 27 Sep · 11:30 AM',
      overdueSince: 'Overdue by 3 days',
      date: '27 Sep 2026',
      slotTime: '11:30 AM',
      type: 'In-Person',
      visitType: 'Specialist Consult',
      status: 'Overdue',
      phone: '+91 99011 44558',
      fee: 500,
    },
  ]);

  // Synchronous resolution of target appointment from props for instant frame-zero sync
  const resolveTargetMatch = (query, list = appointments) => {
    if (!query) return null;
    const targetStr = String(
      typeof query === 'object'
        ? query?.appointmentId || query?.id || query?.name || query?.patient || ''
        : query
    ).toLowerCase().trim();

    if (!targetStr) return null;

    return list.find(a => {
      if (!a) return false;
      const aId = String(a.id || '').toLowerCase();
      const aName = String(a.name || '').toLowerCase();
      if (aId === targetStr) return true;
      if (aName === targetStr) return true;
      if (aName.includes(targetStr) || targetStr.includes(aName)) return true;
      // Schedule ID mappings
      if (targetStr === 'sc-1' && (aName.includes('rohan') || aId.includes('rohan'))) return true;
      if (targetStr === 'sc-2' && (aName.includes('andre') || aId === 'apt-today-2')) return true;
      if (targetStr === 'sc-3' && (aName.includes('meera') || aId.includes('meera'))) return true;
      if (targetStr === 'sc-4' && (aName.includes('jakub') || aId.includes('jakub'))) return true;
      if (targetStr === 'sc-5' && (aName.includes('priya') || aId === 'apt-today-1')) return true;
      if (targetStr === 'sc-6' && (aName.includes('roosevelt') || aId.includes('roosevelt'))) return true;
      return false;
    });
  };

  const initialTargetMatch = resolveTargetMatch(initialAppointmentId || targetAppointment);

  const [channelMode, setChannelMode] = useState(initialTargetMatch?.type || targetAppointment?.type || 'In-Person');
  const [statusTab, setStatusTab] = useState(initialTargetMatch?.tab || 'Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(
    initialTargetMatch?.id || (typeof initialAppointmentId === 'string' ? initialAppointmentId : 'apt-today-1')
  );
  const [isSlideDrawerOpen, setIsSlideDrawerOpen] = useState(
    !!(initialOpenSlideDrawer && (initialAppointmentId || targetAppointment))
  );

  // Handler to close slide drawer
  const handleCloseSlideDrawer = () => {
    setIsSlideDrawerOpen(false);
    setInPersonStep(1);
    if (onCloseDrawer) {
      onCloseDrawer();
    }
  };

  // Tab counts
  const getTabCount = (tabId) => {
    return appointments.filter(a => a.tab === tabId && a.type === channelMode).length;
  };

  // Synchronize incoming target appointment & slide drawer state
  useEffect(() => {
    if (initialOpenSlideDrawer && (initialAppointmentId || targetAppointment)) {
      const match = resolveTargetMatch(initialAppointmentId || targetAppointment);
      if (match) {
        setSelectedAppointmentId(match.id);
        if (match.type) setChannelMode(match.type);
        if (match.tab) setStatusTab(match.tab);
        setIsSlideDrawerOpen(true);
      } else if (targetAppointment) {
        const newApt = {
          id: targetAppointment.appointmentId || targetAppointment.id || `apt-${Date.now()}`,
          tab: 'Today',
          initials: targetAppointment.initials || (targetAppointment.name ? targetAppointment.name.split(' ').map(n => n[0]).join('') : 'PT'),
          avatarBg: targetAppointment.avatarBg || '#E0F2FE',
          avatarColor: targetAppointment.avatarColor || '#0284C7',
          name: targetAppointment.name || targetAppointment.patient || 'Patient',
          age: targetAppointment.age || 35,
          gender: targetAppointment.gender || 'Other',
          bloodGroup: targetAppointment.bloodGroup || 'O+',
          allergies: targetAppointment.allergies || 'None recorded',
          medications: targetAppointment.medications || 'None recorded',
          reason: targetAppointment.reason || 'Consultation Review',
          time: targetAppointment.time || 'Today, 10:30 AM',
          date: 'Today, 30 Sep 2026',
          slotTime: targetAppointment.time || '10:30 AM',
          type: targetAppointment.type || 'In-Person',
          visitType: targetAppointment.visitType || 'Follow-up',
          status: 'Confirmed',
          phone: targetAppointment.phone || '+91 98860 11234',
          fee: targetAppointment.fee || 500,
        };
        setAppointments(prev => [newApt, ...prev]);
        setSelectedAppointmentId(newApt.id);
        setChannelMode(newApt.type);
        setStatusTab('Today');
        setIsSlideDrawerOpen(true);
      }
    } else {
      setIsSlideDrawerOpen(false);
    }
  }, [initialAppointmentId, initialOpenSlideDrawer, targetAppointment]);

  // Filtered list
  const filteredAppointments = appointments.filter(a => {
    const matchesChannel = a.type === channelMode;
    const matchesTab = a.tab === statusTab;
    const matchesSearch = !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesTab && matchesSearch;
  });

  const selectedAppointment =
    filteredAppointments.find(a => a.id === selectedAppointmentId) ||
    appointments.find(a => a.id === selectedAppointmentId) ||
    filteredAppointments[0] ||
    appointments.find(a => a.type === channelMode) ||
    appointments[0];

  const currentPatientIndex = filteredAppointments.findIndex(a => a.id === selectedAppointment?.id);

  const handleNextPatient = () => {
    if (currentPatientIndex < filteredAppointments.length - 1) {
      setSelectedAppointmentId(filteredAppointments[currentPatientIndex + 1].id);
    }
  };

  const handlePrevPatient = () => {
    if (currentPatientIndex > 0) {
      setSelectedAppointmentId(filteredAppointments[currentPatientIndex - 1].id);
    }
  };

  // Find detailed patient record matching selected appointment
  const patientRecord =
    patients.find(p => p.id === selectedAppointment?.patientId) ||
    patients.find(p => p.name?.toLowerCase() === selectedAppointment?.name?.toLowerCase()) ||
    patients[0];

  const isInPerson = (selectedAppointment?.type || channelMode) === 'In-Person';
  const isAccepted = selectedAppointment?.status === 'Confirmed';

  // Actions
  // Click Accept -> pop-up -> click OK -> THEN right side slide shows!
  const handleAccept = (id) => {
    const targetId = id || selectedAppointment?.id;
    const apt = appointments.find(a => a.id === targetId);
    setAppointments(prev => prev.map(a => (a.id === targetId ? { ...a, status: 'Confirmed' } : a)));
    setSelectedAppointmentId(targetId);

    // Show theme-matched pop-up in center of screen
    // When user clicks OK, open the right slide drawer at Step 1!
    showThemeAlert(
      'Appointment Accepted',
      `Consultation with ${apt?.name || 'patient'} has been confirmed.`,
      'checkmark-circle',
      () => {
        // Open the right slide drawer extending till center of screen at Step 1!
        setInPersonStep(1);
        setIsSlideDrawerOpen(true);
      }
    );
  };

  const handleStartConsultationAction = () => {
    if (!selectedAppointment) return;
    if (isInPerson) {
      // Step 1 -> Step 2: Open Consult Notes inside the right side slide (NO navigation away)
      setInPersonStep(2);
    } else {
      if (onStartConsultation) {
        onStartConsultation(selectedAppointment);
      } else {
        setActiveTab('consultation');
      }
    }
  };

  const handleOpenRescheduleModal = (apt) => {
    const target = apt || selectedAppointment;
    setRescheduleTargetPatient(target);
    setSelectedCalendarDay(5); // Default matching screenshot Oct 5
    setSelectedCalendarTime(target?.slotTime || '11:30 AM');
    setCalendarNavTab('Date');
    setCalendarModalVisible(true);
  };

  const handleConfirmCalendarReschedule = () => {
    if (!rescheduleTargetPatient) return;
    const newFormattedDate = `${selectedCalendarDay} Oct 2026`;
    const newSlotStr = `Rescheduled to ${newFormattedDate} · ${selectedCalendarTime}`;
    const pName = rescheduleTargetPatient.name;

    setAppointments(prev => prev.map(a =>
      a.id === rescheduleTargetPatient.id
        ? {
            ...a,
            tab: 'Rescheduled',
            status: 'Rescheduled',
            date: newFormattedDate,
            slotTime: selectedCalendarTime,
            time: newSlotStr,
            prevTime: `Was ${a.time}`,
            rescheduleStatus: 'Awaiting Patient Accept',
          }
        : a
    ));
    setCalendarModalVisible(false);
    showThemeAlert(
      'Appointment Rescheduled',
      `Appointment for ${pName} has been rescheduled to ${newFormattedDate} at ${selectedCalendarTime}. Awaiting patient acceptance.`,
      'sync-circle'
    );
  };

  const handleRequestAgain = (apt) => {
    setOverdueModalPatient(null);
    showThemeAlert(
      'Re-Booking Request Sent',
      `Re-booking request sent to ${apt.name} via SMS. The patient has been prompted to choose a new consultation slot.`,
      'paper-plane'
    );
  };

  const handleSendReminder = (apt) => {
    setAwaitingModalPatient(null);
    showThemeAlert(
      'Reminder Alert Sent',
      `Reminder notification sent to ${apt.name} via SMS & WhatsApp.`,
      'notifications'
    );
  };

  const handleCardClick = (apt) => {
    setSelectedAppointmentId(apt.id);
    if (statusTab === 'Upcoming') {
      setUpcomingModalPatient(apt);
    } else if (statusTab === 'Overdue') {
      setOverdueModalPatient(apt);
    } else if (apt.status === 'Confirmed') {
      setIsSlideDrawerOpen(true);
    }
  };

  const handleSelectQuickDoc = (type) => {
    setManualDocType(type);
    setDocError('');
  };

  const handleSendDocRequest = () => {
    const trimmed = manualDocType.trim();
    if (!trimmed) {
      setDocError('Please enter or select a document type to request');
      return;
    }

    const newDocRequest = {
      id: `req-${Date.now()}`,
      name: trimmed,
      date: 'Requested Today',
      size: 'Pending upload',
      type: 'Doctor Requested',
      status: 'Pending Upload',
      note: docInstructions.trim(),
      isRequested: true,
    };

    setPrivacyDocs(prev => [newDocRequest, ...prev]);
    setRequestModalVisible(false);
    setManualDocType('');
    setDocInstructions('');
    setDocError('');

    showThemeAlert(
      'Document Requested',
      `A request for "${trimmed}" has been sent to ${selectedAppointment.name}. They will receive an upload prompt on their app.`,
      'cloud-upload'
    );
  };

  // Helper to add medicine
  const handleAddMedicine = () => {
    const trimmed = manualMedName.trim();
    if (!trimmed) {
      showThemeAlert('Medicine Name Required', 'Please type or select a medicine name before adding to prescription.', 'alert-circle');
      return;
    }
    const newMed = {
      id: `med-${Date.now()}`,
      name: trimmed,
      dosage: manualMedDosage,
      freq: manualMedFreq,
      duration: manualMedDuration,
      timing: {
        morning: manualMedMorning,
        afternoon: manualMedAfternoon,
        night: manualMedNight,
        food: manualMedFoodTiming,
      },
    };
    setInPersonPrescriptions(prev => [...prev, newMed]);
    setManualMedName('');
    setMedSearchQuery('');
    setMedDropdownVisible(false);
  };

  const handleDeleteMedicine = (id) => {
    setInPersonPrescriptions(prev => prev.filter(m => m.id !== id));
  };

  // Helper to add test
  const handleAddTest = () => {
    const trimmed = manualTestName.trim();
    if (!trimmed) {
      showThemeAlert('Test Name Required', 'Please type or select a lab investigation name before adding.', 'alert-circle');
      return;
    }
    const newTest = {
      id: `t-${Date.now()}`,
      name: trimmed,
      instructions: manualTestInstructions,
      notes: manualTestNotes.trim() || 'Routine evaluation',
    };
    setInPersonTests(prev => [...prev, newTest]);
    setManualTestName('');
    setTestSearchQuery('');
    setManualTestNotes('');
    setTestDropdownVisible(false);
  };

  const handleDeleteTest = (id) => {
    setInPersonTests(prev => prev.filter(t => t.id !== id));
  };

  // Finalize in-person consultation & save follow-up
  const handleConfirmFollowUpAndComplete = () => {
    if (!selectedAppointment) return;
    setAppointments(prev =>
      prev.map(a =>
        a.id === selectedAppointment.id
          ? {
              ...a,
              status: 'Completed',
              isConsulted: true,
              consultationSummary: {
                symptoms: inPersonSymptoms,
                diagnosis: inPersonDiagnosis,
                notes: inPersonExamNotes,
                advice: inPersonAdvice,
                prescriptionsCount: inPersonPrescriptions.length,
                testsCount: inPersonTests.length,
                followUpDate,
                followUpTime,
              },
            }
          : a
      )
    );
    setFollowUpModalVisible(false);

    // After submit pop-up: Have sent the details to patient (with OK button)
    showThemeAlert(
      'Sent to Patient',
      'Have sent the details to patient.',
      'checkmark-circle',
      () => {
        setIsSlideDrawerOpen(false);
        setInPersonStep(1);
      }
    );
  };

  const handleSubmitConsultation = handleConfirmFollowUpAndComplete;

  const filteredMedicines = MEDICINE_CATALOG.filter(m =>
    !medSearchQuery ||
    m.name.toLowerCase().includes(medSearchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(medSearchQuery.toLowerCase())
  );

  const filteredTests = TEST_CATALOG.filter(t =>
    !testSearchQuery ||
    t.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(testSearchQuery.toLowerCase())
  );

  // Calendar dates matrix (October 2026: starts Thursday, 31 days)
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
        {/* 1. TOP HEADER                                                  */}
        {/* ============================================================== */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Appointments</Text>
            <Text style={styles.pageSubtitle}>Booked by your patients</Text>
          </View>

          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.navArrowBtn}>
              <Ionicons name="chevron-back" size={16} color="#475569" />
            </TouchableOpacity>

            <View style={styles.dateSelectorPill}>
              <Ionicons name="calendar-outline" size={15} color="#081E3E" />
              <Text style={styles.dateSelectorText}>Today, 30 Sep 2026</Text>
            </View>

            <TouchableOpacity style={styles.navArrowBtn}>
              <Ionicons name="chevron-forward" size={16} color="#475569" />
            </TouchableOpacity>

            {selectedAppointment && (
              <TouchableOpacity
                style={styles.openDrawerBadgeBtn}
                onPress={() => setIsSlideDrawerOpen(true)}
              >
                <Ionicons name="newspaper-outline" size={15} color="#00B894" />
                <Text style={styles.openDrawerBadgeText}>Patient Dossier</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ============================================================== */}
        {/* 2. IN-PERSON VS VIDEO CONSULTATION TOGGLE                      */}
        {/* ============================================================== */}
        <View style={styles.channelToggleContainer}>
          <TouchableOpacity
            style={[styles.channelToggleBtn, channelMode === 'In-Person' && styles.channelToggleBtnActive]}
            onPress={() => setChannelMode('In-Person')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="business-outline"
              size={16}
              color={channelMode === 'In-Person' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.channelToggleText, channelMode === 'In-Person' && styles.channelToggleTextActive]}>
              In-Person
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.channelToggleBtn, channelMode === 'Video' && styles.channelToggleBtnActive]}
            onPress={() => setChannelMode('Video')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="videocam-outline"
              size={16}
              color={channelMode === 'Video' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.channelToggleText, channelMode === 'Video' && styles.channelToggleTextActive]}>
              Video Consultation
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* 3. STATUS FILTER BUTTONS ROW (TODAY, UPCOMING, PENDING,        */}
        {/*    RESCHEDULED, OVERDUE) + SEARCH BAR                          */}
        {/* ============================================================== */}
        <View style={styles.statusAndSearchRow}>
          <View style={styles.statusFiltersGroup}>
            {[
              { id: 'Today', label: 'Today', icon: 'today-outline', count: getTabCount('Today') },
              { id: 'Upcoming', label: 'Upcoming', icon: 'calendar-outline', count: getTabCount('Upcoming') },
              { id: 'Pending', label: 'Pending', icon: 'time-outline', count: getTabCount('Pending') },
              { id: 'Rescheduled', label: 'Rescheduled', icon: 'sync-outline', count: getTabCount('Rescheduled') },
              { id: 'Overdue', label: 'Overdue', icon: 'alert-circle-outline', count: getTabCount('Overdue') },
            ].map(tab => {
              const isActive = statusTab === tab.id;
              const isOverdue = tab.id === 'Overdue';
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.statusFilterPill,
                    isActive && styles.statusFilterPillActive,
                    isOverdue && !isActive && styles.statusFilterPillOverdue,
                  ]}
                  onPress={() => setStatusTab(tab.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={tab.icon}
                    size={14}
                    color={isActive ? '#FFFFFF' : (isOverdue ? '#DC2626' : '#475569')}
                  />
                  <Text
                    style={[
                      styles.statusFilterText,
                      isActive && styles.statusFilterTextActive,
                      isOverdue && !isActive && { color: '#DC2626' },
                    ]}
                  >
                    {tab.label}
                  </Text>
                  <View
                    style={[
                      styles.statusCountBadge,
                      isActive ? styles.countBadgeActive : styles.countBadgeInactive,
                      isOverdue && !isActive && { backgroundColor: '#FEE2E2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.countBadgeText,
                        isActive ? styles.countBadgeTextActive : styles.countBadgeTextInactive,
                        isOverdue && !isActive && { color: '#DC2626' },
                      ]}
                    >
                      {tab.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Search Patient Bar */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search patient or symptoms..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* ============================================================== */}
        {/* 4. MAIN APPOINTMENTS CARDS LIST (FULL WIDTH CLEAN LAYOUT)      */}
        {/* ============================================================== */}
        <View style={styles.cardsListContainer}>
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyAppointmentsCard}>
              <Ionicons name="calendar-outline" size={32} color="#94A3B8" />
              <Text style={styles.emptyTitleText}>No {statusTab.toLowerCase()} {channelMode.toLowerCase()} appointments</Text>
              <Text style={styles.emptySubText}>Try switching to another category or check your patient bookings.</Text>
            </View>
          ) : (
            filteredAppointments.map((apt) => {
              const isSelected = apt.id === selectedAppointment?.id;
              return (
                <TouchableOpacity
                  key={apt.id}
                  style={[styles.appointmentCard, isSelected && styles.appointmentCardSelected]}
                  onPress={() => handleCardClick(apt)}
                  activeOpacity={0.88}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.patientAvatar, { backgroundColor: apt.avatarBg }]}>
                      <Text style={[styles.avatarLetter, { color: apt.avatarColor }]}>{apt.initials}</Text>
                    </View>

                    <View style={styles.patientInfoCol}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.patientName}>{apt.name}</Text>
                        {apt.dueIn && (
                          <View style={styles.inOneBadge}>
                            <Text style={styles.inOneText}>{apt.dueIn}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.patientAgeGender}>{apt.age} yrs · {apt.gender} · {apt.phone}</Text>
                      <Text style={styles.patientSymptoms}>{apt.reason}</Text>
                    </View>

                    {/* Status Tag Pill */}
                    <View
                      style={[
                        styles.statusPillBadge,
                        apt.status === 'Confirmed' ? styles.statusBadgeCompleted :
                        apt.status === 'Upcoming' ? styles.statusBadgeUpcoming :
                        apt.status === 'Overdue' ? styles.statusBadgeOverdue :
                        apt.status === 'Rescheduled' ? styles.statusBadgeRescheduled :
                        styles.statusBadgePending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillBadgeText,
                          apt.status === 'Confirmed' ? styles.statusTextCompleted :
                          apt.status === 'Upcoming' ? styles.statusTextUpcoming :
                          apt.status === 'Overdue' ? styles.statusTextOverdue :
                          apt.status === 'Rescheduled' ? styles.statusTextRescheduled :
                          styles.statusTextPending,
                        ]}
                      >
                        {apt.status}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom Row with Timing and Contextual Action Buttons */}
                  <View style={styles.cardBottomRow}>
                    <View style={styles.timeTagRow}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={apt.status === 'Overdue' ? '#DC2626' : '#64748B'}
                      />
                      <Text
                        style={[
                          styles.timeTagText,
                          apt.status === 'Overdue' && { color: '#DC2626', fontWeight: '700' },
                        ]}
                      >
                        {apt.time}
                      </Text>
                    </View>

                    {/* --- ACTIONS FOR TODAY TAB --- */}
                    {statusTab === 'Today' && (
                      <View style={styles.actionBtnsGroup}>
                        <TouchableOpacity
                          style={styles.rescheduleBtn}
                          onPress={() => handleOpenRescheduleModal(apt)}
                        >
                          <Ionicons name="calendar-outline" size={13} color="#081E3E" />
                          <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.acceptBtn, apt.status === 'Confirmed' && styles.acceptedBtnState]}
                          onPress={() => {
                            setSelectedAppointmentId(apt.id);
                            if (apt.status === 'Confirmed') {
                              setIsSlideDrawerOpen(true);
                            } else {
                              handleAccept(apt.id);
                            }
                          }}
                        >
                          <Ionicons
                            name={apt.status === 'Confirmed' ? 'checkmark-circle' : 'checkmark'}
                            size={13}
                            color="#FFFFFF"
                          />
                          <Text style={styles.acceptBtnText}>
                            {apt.status === 'Confirmed' ? 'Accepted' : 'Accept'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* --- ACTIONS FOR UPCOMING TAB --- */}
                    {statusTab === 'Upcoming' && (
                      <View style={styles.actionBtnsGroup}>
                        <TouchableOpacity
                          style={styles.rescheduleBtn}
                          onPress={() => handleOpenRescheduleModal(apt)}
                        >
                          <Ionicons name="calendar-outline" size={13} color="#081E3E" />
                          <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.upcomingProfileBtn}
                          onPress={() => setUpcomingModalPatient(apt)}
                        >
                          <Ionicons name="person-circle-outline" size={14} color="#00B894" />
                          <Text style={styles.upcomingProfileBtnText}>See Patient Profile</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* --- ACTIONS FOR PENDING TAB --- */}
                    {statusTab === 'Pending' && (
                      <View style={styles.actionBtnsGroup}>
                        <TouchableOpacity
                          style={styles.rescheduleBtn}
                          onPress={() => handleOpenRescheduleModal(apt)}
                        >
                          <Ionicons name="calendar-outline" size={13} color="#081E3E" />
                          <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.acceptBtn}
                          onPress={() => handleAccept(apt.id)}
                        >
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                          <Text style={styles.acceptBtnText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* --- ACTIONS FOR RESCHEDULED TAB --- */}
                    {statusTab === 'Rescheduled' && (
                      <View style={styles.actionBtnsGroup}>
                        <TouchableOpacity
                          style={styles.rescheduleBtn}
                          onPress={() => handleOpenRescheduleModal(apt)}
                        >
                          <Ionicons name="sync-outline" size={13} color="#081E3E" />
                          <Text style={styles.rescheduleBtnText}>Re-reschedule</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.awaitingAcceptBtn}
                          onPress={() => setAwaitingModalPatient(apt)}
                        >
                          <Ionicons name="time-outline" size={13} color="#B45309" />
                          <Text style={styles.awaitingAcceptBtnText}>Awaiting Patient Accept</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* --- ACTIONS FOR OVERDUE TAB --- */}
                    {statusTab === 'Overdue' && (
                      <View style={styles.actionBtnsGroup}>
                        <TouchableOpacity
                          style={styles.overdueProfileBtn}
                          onPress={() => setOverdueModalPatient(apt)}
                        >
                          <Ionicons name="person-outline" size={13} color="#475569" />
                          <Text style={styles.overdueProfileBtnText}>Overdue Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.requestAgainBtn}
                          onPress={() => handleRequestAgain(apt)}
                        >
                          <Ionicons name="paper-plane" size={12} color="#FFFFFF" />
                          <Text style={styles.requestAgainBtnText}>Request Again</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ============================================================== */}
      {/* 5. RIGHT SIDE SLIDE PAGE POP-UP DRAWER (AS SHOWN IN IMAGE)      */}
      {/* EXTENDS TILL CENTER OF SCREEN (50% WIDTH) WITH DIMMED BACKDROP  */}
      {/* ONLY OPENS AFTER CLICKING OK OR EXPLICITLY VIEWING DOSSIER!    */}
      {/* ============================================================== */}
      {isSlideDrawerOpen && selectedAppointment && (
        <View style={styles.slideDrawerOverlay}>
          {/* Dimmed backdrop area - Dims the entire background & highlights drawer */}
          <TouchableOpacity
            style={styles.slideDrawerBackdrop}
            onPress={handleCloseSlideDrawer}
            activeOpacity={1}
          />

          {/* Slide-in Sheet from Right edge: Width extends till center of screen */}
          <View style={styles.slideDrawerSheet}>
            {/* Top Navigation Row matching image: ∨ ∧ counter ⋮ ✕ */}
            <View style={styles.drawerTopNavRow}>
              <View style={styles.drawerArrowsGroup}>
                <TouchableOpacity
                  style={[styles.drawerNavChevronBtn, currentPatientIndex <= 0 && { opacity: 0.4 }]}
                  onPress={handlePrevPatient}
                  disabled={currentPatientIndex <= 0}
                >
                  <Ionicons name="chevron-up" size={16} color="#081E3E" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.drawerNavChevronBtn, currentPatientIndex >= filteredAppointments.length - 1 && { opacity: 0.4 }]}
                  onPress={handleNextPatient}
                  disabled={currentPatientIndex >= filteredAppointments.length - 1}
                >
                  <Ionicons name="chevron-down" size={16} color="#081E3E" />
                </TouchableOpacity>

                <Text style={styles.drawerCounterText}>
                  {currentPatientIndex >= 0 ? currentPatientIndex + 1 : 1} of {filteredAppointments.length} patients
                </Text>
              </View>

              <View style={styles.drawerRightActionIcons}>
                <TouchableOpacity
                  style={styles.drawerIconBtn}
                  onPress={() => showThemeAlert('Patient Actions', `Clinical actions menu for ${selectedAppointment.name}`, 'ellipsis-horizontal')}
                >
                  <Ionicons name="ellipsis-vertical" size={18} color="#64748B" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.drawerCloseIconBtn}
                  onPress={handleCloseSlideDrawer}
                >
                  <Ionicons name="close" size={20} color="#081E3E" />
                </TouchableOpacity>
              </View>
            </View>

            {/* IN-PERSON 5-STEP PROGRESS INDICATOR BAR */}
            {isInPerson && (
              <View style={styles.inPersonStepIndicatorBar}>
                <TouchableOpacity
                  style={[styles.inPersonStepItem, inPersonStep === 1 && styles.inPersonStepItemActive]}
                  onPress={() => setInPersonStep(1)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.inPersonStepCircle, inPersonStep >= 1 && styles.inPersonStepCircleActive]}>
                    {inPersonStep > 1 ? (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.inPersonStepCircleText, inPersonStep >= 1 && styles.inPersonStepCircleTextActive]}>1</Text>
                    )}
                  </View>
                  <Text style={[styles.inPersonStepLabel, inPersonStep >= 1 && styles.inPersonStepLabelActive]}>1. Patient</Text>
                </TouchableOpacity>

                <View style={[styles.inPersonStepLine, inPersonStep >= 2 && styles.inPersonStepLineActive]} />

                <TouchableOpacity
                  style={[styles.inPersonStepItem, inPersonStep === 2 && styles.inPersonStepItemActive]}
                  onPress={() => setInPersonStep(2)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.inPersonStepCircle, inPersonStep >= 2 && styles.inPersonStepCircleActive]}>
                    {inPersonStep > 2 ? (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.inPersonStepCircleText, inPersonStep >= 2 && styles.inPersonStepCircleTextActive]}>2</Text>
                    )}
                  </View>
                  <Text style={[styles.inPersonStepLabel, inPersonStep >= 2 && styles.inPersonStepLabelActive]}>2. Notes</Text>
                </TouchableOpacity>

                <View style={[styles.inPersonStepLine, inPersonStep >= 3 && styles.inPersonStepLineActive]} />

                <TouchableOpacity
                  style={[styles.inPersonStepItem, inPersonStep === 3 && styles.inPersonStepItemActive]}
                  onPress={() => setInPersonStep(3)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.inPersonStepCircle, inPersonStep >= 3 && styles.inPersonStepCircleActive]}>
                    {inPersonStep > 3 ? (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.inPersonStepCircleText, inPersonStep >= 3 && styles.inPersonStepCircleTextActive]}>3</Text>
                    )}
                  </View>
                  <Text style={[styles.inPersonStepLabel, inPersonStep >= 3 && styles.inPersonStepLabelActive]}>3. Prescribe</Text>
                </TouchableOpacity>

                <View style={[styles.inPersonStepLine, inPersonStep >= 4 && styles.inPersonStepLineActive]} />

                <TouchableOpacity
                  style={[styles.inPersonStepItem, inPersonStep === 4 && styles.inPersonStepItemActive]}
                  onPress={() => setInPersonStep(4)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.inPersonStepCircle, inPersonStep >= 4 && styles.inPersonStepCircleActive]}>
                    {inPersonStep > 4 ? (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.inPersonStepCircleText, inPersonStep >= 4 && styles.inPersonStepCircleTextActive]}>4</Text>
                    )}
                  </View>
                  <Text style={[styles.inPersonStepLabel, inPersonStep >= 4 && styles.inPersonStepLabelActive]}>4. Tests</Text>
                </TouchableOpacity>

                <View style={[styles.inPersonStepLine, inPersonStep >= 5 && styles.inPersonStepLineActive]} />

                <TouchableOpacity
                  style={[styles.inPersonStepItem, inPersonStep === 5 && styles.inPersonStepItemActive]}
                  onPress={() => setInPersonStep(5)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.inPersonStepCircle, inPersonStep >= 5 && styles.inPersonStepCircleActive]}>
                    <Text style={[styles.inPersonStepCircleText, inPersonStep >= 5 && styles.inPersonStepCircleTextActive]}>5</Text>
                  </View>
                  <Text style={[styles.inPersonStepLabel, inPersonStep >= 5 && styles.inPersonStepLabelActive]}>5. Date & Time</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 1: PATIENT DOSSIER & STATIC ACTION BUTTONS */}
            {(!isInPerson || inPersonStep === 1) && (
              <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Dark Navy Workstation Header */}
                <View style={styles.wsHeader}>
              <View style={styles.wsHeaderTopRow}>
                <Text style={styles.wsHeaderTitle}>Appointment Details</Text>
                <View
                  style={[
                    styles.wsHeaderModePill,
                    isInPerson ? styles.headerModeInPerson : styles.headerModeVideo,
                  ]}
                >
                  <Ionicons
                    name={isInPerson ? 'business' : 'videocam'}
                    size={12}
                    color="#FFFFFF"
                  />
                  <Text style={styles.headerModePillText}>
                    {isInPerson ? 'In-Person Consultation' : 'Video Consultation'}
                  </Text>
                </View>
              </View>

              <Text style={styles.wsHeaderSubtitle}>
                Patient: {selectedAppointment.name}
              </Text>
            </View>

            {/* Scrollable Clinical Dossier Content */}
            <ScrollView
              style={styles.wsScrollBody}
              contentContainerStyle={styles.wsScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Status Banner */}
              {isInPerson ? (
                <View style={styles.clinicArrivalBanner}>
                  <View style={styles.clinicArrivalIconWrap}>
                    <Ionicons name="checkmark-done-circle" size={22} color="#00B894" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.bannerHeaderRow}>
                      <Text style={styles.arrivalTitle}>Patient Arrived at Clinic</Text>
                      <Text style={styles.arrivalBadge}>Room 102</Text>
                    </View>
                    <Text style={styles.arrivalSubtitle}>
                      {selectedAppointment.name} checked in at reception desk and is waiting in the clinic lounge.
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.waitingBanner}>
                  <View style={styles.pulseDotWrapper}>
                    <View style={styles.pulseDotOuter} />
                    <View style={styles.pulseDotInner} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.bannerHeaderRow}>
                      <Text style={styles.waitingTitle}>Patient in Waiting Room</Text>
                      <Text style={styles.waitingTime}>Joined 2 mins ago</Text>
                    </View>
                    <Text style={styles.waitingSubtitle}>
                      {selectedAppointment.name} has joined the video consultation room and is waiting to connect.
                    </Text>
                  </View>
                </View>
              )}

              {/* SECTION 1: VISIT DETAILS */}
              <View style={styles.detailSectionCard}>
                <View style={styles.cardHeaderRowCustom}>
                  <View style={styles.cardHeaderIcon}>
                    <Ionicons name="calendar-outline" size={16} color="#081E3E" />
                  </View>
                  <Text style={styles.cardHeaderTitle}>Visit Details</Text>
                </View>

                <View style={styles.gridRow}>
                  <View style={styles.gridItem}>
                    <View style={[styles.gridIconWrap, { backgroundColor: '#E6FAF6' }]}>
                      <Ionicons name="calendar" size={15} color="#00B894" />
                    </View>
                    <Text style={styles.gridLabel}>Visiting Date</Text>
                    <Text style={styles.gridValue}>
                      {selectedAppointment.date || 'Today, 30 Sep 2026'}
                    </Text>
                  </View>

                  <View style={styles.gridItem}>
                    <View style={[styles.gridIconWrap, { backgroundColor: '#EEF4FC' }]}>
                      <Ionicons name="time" size={15} color="#081E3E" />
                    </View>
                    <Text style={styles.gridLabel}>Timing</Text>
                    <Text style={styles.gridValue}>
                      {selectedAppointment.slotTime || '11:30 AM'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.gridRow, { marginTop: 10 }]}>
                  <View style={styles.gridItem}>
                    <View
                      style={[
                        styles.gridIconWrap,
                        { backgroundColor: isInPerson ? '#EEF4FC' : '#E6FAF6' },
                      ]}
                    >
                      <Ionicons
                        name={isInPerson ? 'business' : 'videocam'}
                        size={15}
                        color={isInPerson ? '#081E3E' : '#00B894'}
                      />
                    </View>
                    <Text style={styles.gridLabel}>Consultation Mode</Text>
                    <Text style={styles.gridValue}>
                      {isInPerson ? 'In-Person (Clinic)' : 'Video Consultation'}
                    </Text>
                  </View>

                  <View style={styles.gridItem}>
                    <View style={[styles.gridIconWrap, { backgroundColor: '#E6FAF6' }]}>
                      <Ionicons name="wallet" size={15} color="#00B894" />
                    </View>
                    <Text style={styles.gridLabel}>Consultation Fees</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.gridValue}>₹{selectedAppointment.fee || 500}</Text>
                      <View style={styles.paidBadge}>
                        <Text style={styles.paidBadgeText}>Paid</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* SECTION 2: MEDICAL INFORMATION */}
              <View style={styles.detailSectionCard}>
                <View style={styles.cardHeaderRowCustom}>
                  <View style={styles.cardHeaderIcon}>
                    <Ionicons name="medkit-outline" size={16} color="#081E3E" />
                  </View>
                  <Text style={styles.cardHeaderTitle}>Medical Information</Text>
                </View>

                {/* Profile Header */}
                <View style={styles.patientProfileRow}>
                  <View style={styles.wsPatientAvatar}>
                    <Text style={styles.wsPatientAvatarText}>
                      {selectedAppointment.name ? selectedAppointment.name.charAt(0) : 'P'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.wsPatientName}>{selectedAppointment.name}</Text>
                    <View style={styles.patientBadgeRow}>
                      <View style={styles.miniBadge}>
                        <Text style={styles.miniBadgeText}>
                          {selectedAppointment.age} yrs · {selectedAppointment.gender}
                        </Text>
                      </View>
                      <View style={[styles.miniBadge, { backgroundColor: '#FEE2E2' }]}>
                        <Text style={[styles.miniBadgeText, { color: '#B91C1C', fontWeight: '800' }]}>
                          🩸 {selectedAppointment.bloodGroup || patientRecord?.bloodGroup || 'B+'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.patientContact}>
                      📞 {selectedAppointment.phone || '+91 98452 34567'}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Reason for Visit */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Reason for Visit:</Text>
                  <Text style={styles.infoValueBold}>
                    {selectedAppointment.reason || 'General medical follow-up'}
                  </Text>
                </View>

                {/* Allergies */}
                <View style={styles.clinicalSection}>
                  <Text style={styles.clinicalLabel}>Known Allergies</Text>
                  <View style={styles.tagWrap}>
                    {(selectedAppointment.allergies
                      ? [selectedAppointment.allergies]
                      : (patientRecord?.allergies?.length ? patientRecord.allergies : ['None known'])
                    ).map((allergy, idx) => (
                      <View key={`al-${idx}`} style={styles.allergyTag}>
                        <Ionicons name="warning-outline" size={13} color="#B45309" />
                        <Text style={styles.allergyTagText}>{allergy}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Current Medicines */}
                <View style={styles.clinicalSection}>
                  <Text style={styles.clinicalLabel}>Current Medicines</Text>
                  <View style={styles.medsWrap}>
                    {(patientRecord?.medications?.length
                      ? patientRecord.medications
                      : ['Amlodipine 5mg (1-0-0)', 'Paracetamol 650mg (SOS)']
                    ).map((med, idx) => (
                      <View key={`med-${idx}`} style={styles.medItem}>
                        <Ionicons name="medical" size={13} color="#081E3E" />
                        <Text style={styles.medItemText}>{med}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Chronic Conditions */}
                <View style={styles.clinicalSection}>
                  <Text style={styles.clinicalLabel}>Chronic Conditions</Text>
                  <View style={styles.tagWrap}>
                    {(patientRecord?.conditions?.length
                      ? patientRecord.conditions
                      : ['Hypertension (Stage 1)']
                    ).map((cond, idx) => (
                      <View key={`cond-${idx}`} style={styles.conditionTag}>
                        <Ionicons name="pulse" size={13} color="#00897B" />
                        <Text style={styles.conditionTagText}>{cond}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* SECTION 3: PATIENT VITALS */}
              <View style={styles.detailSectionCard}>
                <View style={styles.cardHeaderRowCustom}>
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
                      {patientRecord?.vitals?.bpm || 76} <Text style={styles.vitalUnit}>bpm</Text>
                    </Text>
                    <Text style={styles.vitalStatus}>Normal</Text>
                  </View>

                  <View style={styles.vitalBox}>
                    <View style={[styles.vitalIconWrap, { backgroundColor: '#E6FAF6' }]}>
                      <Ionicons name="water" size={15} color="#00B894" />
                    </View>
                    <Text style={styles.vitalLabel}>Blood Sugar</Text>
                    <Text style={styles.vitalVal}>
                      {patientRecord?.vitals?.sugar ? patientRecord.vitals.sugar.split(' ')[0] : '98'}{' '}
                      <Text style={styles.vitalUnit}>mg/dL</Text>
                    </Text>
                    <Text style={styles.vitalStatus}>Fasting</Text>
                  </View>

                  <View style={styles.vitalBox}>
                    <View style={[styles.vitalIconWrap, { backgroundColor: '#EEF4FC' }]}>
                      <Ionicons name="speedometer" size={15} color="#081E3E" />
                    </View>
                    <Text style={styles.vitalLabel}>Blood Pressure</Text>
                    <Text style={styles.vitalVal}>
                      {patientRecord?.vitals?.bp || '122/80'}
                    </Text>
                    <Text style={styles.vitalStatus}>mmHg</Text>
                  </View>
                </View>
              </View>

              {/* SECTION 4: MEDICAL RECORDS (NOTES / REPORTS / PRESCRIPTIONS) */}
              <View style={styles.detailSectionCard}>
                <View style={styles.cardHeaderRowCustom}>
                  <View style={styles.cardHeaderIcon}>
                    <Ionicons name="folder-open-outline" size={16} color="#081E3E" />
                  </View>
                  <Text style={styles.cardHeaderTitle}>Medical Records</Text>
                </View>

                {/* Sub-Tabs */}
                <View style={styles.recordsTabTrack}>
                  <TouchableOpacity
                    style={[styles.recordsTabBtn, recordsTab === 'notes' && styles.recordsTabBtnActive]}
                    onPress={() => setRecordsTab('notes')}
                    activeOpacity={0.8}
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
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="flask-outline"
                      size={13}
                      color={recordsTab === 'reports' ? '#FFFFFF' : '#475569'}
                    />
                    <Text style={[styles.recordsTabBtnText, recordsTab === 'reports' && styles.recordsTabBtnTextActive]}>
                      Reports (3)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.recordsTabBtn, recordsTab === 'prescriptions' && styles.recordsTabBtnActive]}
                    onPress={() => setRecordsTab('prescriptions')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="medkit-outline"
                      size={13}
                      color={recordsTab === 'prescriptions' ? '#FFFFFF' : '#475569'}
                    />
                    <Text style={[styles.recordsTabBtnText, recordsTab === 'prescriptions' && styles.recordsTabBtnTextActive]}>
                      Rx (3)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Records Tab Content */}
                {recordsTab === 'notes' && (
                  <View style={styles.recordsList}>
                    <View style={styles.recordItemCard}>
                      <View style={styles.recordItemHeader}>
                        <Text style={styles.recordItemTitle}>Clinical Follow-up Note</Text>
                        <Text style={styles.recordItemDate}>28 Aug 2026</Text>
                      </View>
                      <Text style={styles.recordItemBody}>
                        Patient presented with mild morning headaches. Blood pressure recorded at 134/86. Recommended low-sodium diet and daily walking routine.
                      </Text>
                      <Text style={styles.recordDoctorSign}>Signed by Dr. Ananya Rao</Text>
                    </View>

                    <View style={styles.recordItemCard}>
                      <View style={styles.recordItemHeader}>
                        <Text style={styles.recordItemTitle}>Initial Cardiology Assessment</Text>
                        <Text style={styles.recordItemDate}>02 Jul 2026</Text>
                      </View>
                      <Text style={styles.recordItemBody}>
                        Initial hypertension workup. Advised baseline 12-lead ECG and comprehensive lipid profile. Prescribed Tab Amlodipine 5mg OD.
                      </Text>
                      <Text style={styles.recordDoctorSign}>Signed by Dr. Ananya Rao</Text>
                    </View>
                  </View>
                )}

                {recordsTab === 'reports' && (
                  <View style={styles.recordsList}>
                    <View style={styles.fileRecordCard}>
                      <View style={styles.fileIconWrap}>
                        <Ionicons name="document-attach" size={18} color="#00B894" />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.fileName}>ECG 12-Lead Diagnostic Strip</Text>
                        <Text style={styles.fileMeta}>15 Aug 2026 · Normal Sinus Rhythm</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.fileActionBtn}
                        onPress={() => showThemeAlert('Diagnostic Report', 'Opening ECG 12-Lead Diagnostic Strip in medical viewer.', 'document-text')}
                      >
                        <Text style={styles.fileActionBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.fileRecordCard}>
                      <View style={styles.fileIconWrap}>
                        <Ionicons name="document-attach" size={18} color="#00B894" />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.fileName}>CBC Panel & Lipid Profile</Text>
                        <Text style={styles.fileMeta}>12 Aug 2026 · All metrics normal</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.fileActionBtn}
                        onPress={() => showThemeAlert('Lab Results', 'Opening Complete Blood Count (CBC Panel) report.', 'flask')}
                      >
                        <Text style={styles.fileActionBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {recordsTab === 'prescriptions' && (
                  <View style={styles.recordsList}>
                    <View style={styles.rxCard}>
                      <View style={styles.rxHeaderRow}>
                        <View style={styles.rxBadge}>
                          <Text style={styles.rxBadgeText}>Rx #2026-891</Text>
                        </View>
                        <Text style={styles.rxDate}>28 Aug 2026</Text>
                      </View>
                      <Text style={styles.rxMedName}>Tab. Amlodipine 5mg</Text>
                      <Text style={styles.rxInstructions}>1 tablet once daily in the morning (1-0-0) · 30 Days</Text>
                    </View>

                    <View style={styles.rxCard}>
                      <View style={styles.rxHeaderRow}>
                        <View style={styles.rxBadge}>
                          <Text style={styles.rxBadgeText}>Rx #2026-754</Text>
                        </View>
                        <Text style={styles.rxDate}>02 Jul 2026</Text>
                      </View>
                      <Text style={styles.rxMedName}>Tab. Pantoprazole 40mg</Text>
                      <Text style={styles.rxInstructions}>1 tablet before breakfast (1-0-0) · 14 Days</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* SECTION 5: CONSULTATION HISTORY */}
              <View style={styles.detailSectionCard}>
                <View style={styles.cardHeaderRowCustom}>
                  <View style={styles.cardHeaderIcon}>
                    <Ionicons name="time-outline" size={16} color="#081E3E" />
                  </View>
                  <Text style={styles.cardHeaderTitle}>Consultation History</Text>
                </View>

                {/* In-Person History */}
                <View style={styles.historySubSection}>
                  <View style={styles.historyTypeHeader}>
                    <Ionicons name="business" size={14} color="#081E3E" />
                    <Text style={styles.historyTypeTitle}>In-Person Visits with Dates</Text>
                  </View>

                  <View style={styles.historyItemCard}>
                    <View style={styles.historyItemTop}>
                      <Text style={styles.historyDate}>02 Jul 2026</Text>
                      <View style={[styles.historyTypePill, { backgroundColor: '#EEF4FC' }]}>
                        <Text style={[styles.historyTypePillText, { color: '#081E3E' }]}>
                          In-Person · Room 102
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.historyDiagnosis}>
                      Diagnosis: Initial hypertension diagnosis & ECG evaluation
                    </Text>
                  </View>
                </View>

                {/* Video History */}
                <View style={[styles.historySubSection, { marginTop: 12 }]}>
                  <View style={styles.historyTypeHeader}>
                    <Ionicons name="videocam" size={14} color="#00B894" />
                    <Text style={[styles.historyTypeTitle, { color: '#00897B' }]}>
                      Video Consultations with Dates
                    </Text>
                  </View>

                  <View style={styles.historyItemCard}>
                    <View style={styles.historyItemTop}>
                      <Text style={styles.historyDate}>28 Aug 2026</Text>
                      <View style={[styles.historyTypePill, { backgroundColor: '#E6FAF6' }]}>
                        <Text style={[styles.historyTypePillText, { color: '#00B894' }]}>
                          Video Call · 18 mins
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.historyDiagnosis}>
                      Diagnosis: Hypertension review — BP stable at 122/80, continue medication
                    </Text>
                  </View>
                </View>
              </View>

              {/* SECTION 6: PRIVACY & HEALTH DOCUMENTS */}
              <View style={styles.detailSectionCard}>
                <View style={styles.cardHeaderRowCustom}>
                  <View style={styles.cardHeaderIcon}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#081E3E" />
                  </View>
                  <Text style={styles.cardHeaderTitle}>Privacy & Health Documents</Text>
                </View>

                <Text style={styles.privacyCardSubtitle}>
                  End-to-end encrypted medical files and doctor record requests.
                </Text>

                <TouchableOpacity
                  style={styles.requestDocBtn}
                  onPress={() => setRequestModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.requestDocBtnText}>Request Document Report</Text>
                </TouchableOpacity>

                <View style={styles.docListWrap}>
                  {privacyDocs.map((doc) => (
                    <View
                      key={doc.id}
                      style={[
                        styles.docItemCard,
                        doc.isRequested && styles.docItemRequestedCard,
                      ]}
                    >
                      <View
                        style={[
                          styles.docItemIconWrap,
                          doc.isRequested ? { backgroundColor: '#FEF3C7' } : { backgroundColor: '#E6FAF6' },
                        ]}
                      >
                        <Ionicons
                          name={doc.isRequested ? 'hourglass-outline' : 'document-text'}
                          size={16}
                          color={doc.isRequested ? '#D97706' : '#00B894'}
                        />
                      </View>

                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.docItemName}>{doc.name}</Text>
                        <Text style={styles.docItemMeta}>{doc.date} • {doc.size}</Text>
                        {doc.note ? <Text style={styles.docItemNote}>Instructions: "{doc.note}"</Text> : null}
                      </View>

                      <View
                        style={[
                          styles.docStatusBadge,
                          doc.isRequested ? { backgroundColor: '#FEF3C7' } : { backgroundColor: '#E6FAF6' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.docStatusBadgeText,
                            doc.isRequested ? { color: '#B45309' } : { color: '#00B894' },
                          ]}
                        >
                          {doc.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ height: 16 }} />
            </ScrollView>

            {/* STATIC BOTTOM ACTION BUTTONS */}
            {/* Accepted, Reschedule, Start Consult (In-Person) / Join Call (Video) */}
            <View style={styles.wsStaticFooter}>
              {/* Accept / Accepted Button */}
              <TouchableOpacity
                style={[
                  styles.wsFooterAcceptBtn,
                  isAccepted && styles.wsFooterAcceptedBtnDisabled,
                ]}
                onPress={() => handleAccept(selectedAppointment.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isAccepted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={16}
                  color={isAccepted ? '#00B894' : '#081E3E'}
                />
                <Text
                  style={[
                    styles.wsFooterAcceptBtnText,
                    isAccepted && { color: '#00B894' },
                  ]}
                >
                  {isAccepted ? 'Accepted' : 'Accept'}
                </Text>
              </TouchableOpacity>

              {/* Reschedule Button */}
              <TouchableOpacity
                style={styles.wsFooterRescheduleBtn}
                onPress={() => handleOpenRescheduleModal(selectedAppointment)}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={15} color="#475569" />
                <Text style={styles.wsFooterRescheduleBtnText}>Reschedule</Text>
              </TouchableOpacity>

              {/* Primary Action Button: Start Consult (In-Person) / Join Call (Video) */}
              <TouchableOpacity
                style={styles.wsFooterPrimaryBtn}
                onPress={handleStartConsultationAction}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={isInPerson ? 'document-text-outline' : 'videocam'}
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.wsFooterPrimaryBtnText}>
                  {isInPerson ? 'Start Consult' : 'Join Call'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 2: CONSULT NOTES SLIDE PAGE */}
        {isInPerson && inPersonStep === 2 && (
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={styles.stepHeader}>
              <View style={styles.stepHeaderTopRow}>
                <TouchableOpacity
                  style={styles.stepBackBtn}
                  onPress={() => setInPersonStep(1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                  <Text style={styles.stepBackBtnText}>Patient Details</Text>
                </TouchableOpacity>
                <View style={styles.stepBadgePill}>
                  <Text style={styles.stepBadgePillText}>Step 2 of 4</Text>
                </View>
              </View>
              <Text style={styles.stepHeaderTitle}>Consultation Notes</Text>
              <Text style={styles.stepHeaderSubtitle}>
                Patient: {selectedAppointment.name} · Clinical Evaluation & Notes
              </Text>
            </View>

            <ScrollView style={styles.wsScrollBody} contentContainerStyle={styles.wsScrollContent} showsVerticalScrollIndicator={false}>
              {/* Patient Brief Strip */}
              <View style={styles.patientBriefStrip}>
                <View style={styles.briefAvatar}>
                  <Text style={styles.briefAvatarText}>{selectedAppointment.name ? selectedAppointment.name.charAt(0) : 'P'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.briefName}>{selectedAppointment.name}</Text>
                  <Text style={styles.briefMeta}>
                    {selectedAppointment.age} yrs · {selectedAppointment.gender} · 🩸 {selectedAppointment.bloodGroup || 'B+'}
                  </Text>
                </View>
                <View style={styles.briefVitalsBadge}>
                  <Text style={styles.briefVitalsText}>BP: 120/80 · SpO2: 99%</Text>
                </View>
              </View>

              {/* Card 1: Symptoms & Chief Complaints */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Chief Complaints & Symptoms</Text>
                </View>
                <TextInput
                  style={styles.stepInputMultiline}
                  multiline
                  numberOfLines={2}
                  placeholder="Type patient symptoms e.g. Fever, persistent cough, headache..."
                  placeholderTextColor="#94A3B8"
                  value={inPersonSymptoms}
                  onChangeText={setInPersonSymptoms}
                />
                <Text style={styles.quickChipLabel}>Quick Symptoms:</Text>
                <View style={styles.quickChipsWrap}>
                  {['Fever', 'Dry Cough', 'Sore Throat', 'Headache', 'Body Aches', 'Acidity', 'Chest Congestion', 'Fatigue'].map((chip) => (
                        <TouchableOpacity
                      key={chip}
                      style={styles.quickChipItem}
                      onPress={() => {
                        setInPersonSymptoms(prev => (prev ? `${prev}, ${chip}` : chip));
                      }}
                    >
                      <Ionicons name="add" size={12} color="#00B894" />
                      <Text style={styles.quickChipText}>{chip}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Card 2: Vitals & Clinical Examination */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="pulse-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Vitals & Examination Findings</Text>
                </View>
                <View style={styles.vitalsRowGrid}>
                  <View style={styles.vitalMiniBox}>
                    <Text style={styles.vitalMiniLabel}>BP (mmHg)</Text>
                    <Text style={styles.vitalMiniVal}>120 / 80</Text>
                  </View>
                  <View style={styles.vitalMiniBox}>
                    <Text style={styles.vitalMiniLabel}>Pulse</Text>
                    <Text style={styles.vitalMiniVal}>76 bpm</Text>
                  </View>
                  <View style={styles.vitalMiniBox}>
                    <Text style={styles.vitalMiniLabel}>Temp</Text>
                    <Text style={styles.vitalMiniVal}>98.6 °F</Text>
                  </View>
                  <View style={styles.vitalMiniBox}>
                    <Text style={styles.vitalMiniLabel}>SpO2</Text>
                    <Text style={styles.vitalMiniVal}>99%</Text>
                  </View>
                </View>
                <TextInput
                  style={[styles.stepInputMultiline, { marginTop: 10 }]}
                  multiline
                  numberOfLines={2}
                  placeholder="Physical exam findings: chest clear, heart sounds normal..."
                  placeholderTextColor="#94A3B8"
                  value={inPersonExamNotes}
                  onChangeText={setInPersonExamNotes}
                />
              </View>

              {/* Card 3: Clinical Diagnosis */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="fitness-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Clinical Assessment & Diagnosis</Text>
                </View>
                <TextInput
                  style={styles.stepInputSingle}
                  placeholder="Enter primary clinical diagnosis..."
                  placeholderTextColor="#94A3B8"
                  value={inPersonDiagnosis}
                  onChangeText={setInPersonDiagnosis}
                />
                <Text style={styles.quickChipLabel}>Common Diagnoses:</Text>
                <View style={styles.quickChipsWrap}>
                  {[
                    'Acute URTI / Viral Fever',
                    'Essential Hypertension',
                    'Type 2 Diabetes Review',
                    'Allergic Rhinitis',
                    'Acute Bronchitis',
                    'Acid Peptic Disease',
                  ].map((diag) => (
                    <TouchableOpacity
                      key={diag}
                      style={[
                        styles.quickChipItem,
                        inPersonDiagnosis === diag && styles.quickChipItemActive,
                      ]}
                      onPress={() => setInPersonDiagnosis(diag)}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          inPersonDiagnosis === diag && styles.quickChipTextActive,
                        ]}
                      >
                        {diag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Card 4: Doctor's Advice & Patient Instructions */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="information-circle-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Advice & Lifestyle Guidelines</Text>
                </View>
                <TextInput
                  style={styles.stepInputMultiline}
                  multiline
                  numberOfLines={2}
                  placeholder="Patient advice, dietary guidelines, fluid intake, rest..."
                  placeholderTextColor="#94A3B8"
                  value={inPersonAdvice}
                  onChangeText={setInPersonAdvice}
                />
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Step 2 Static Bottom Footer */}
            <View style={styles.wsStaticFooter}>
              <TouchableOpacity
                style={styles.wsFooterRescheduleBtn}
                onPress={() => setInPersonStep(1)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#475569" />
                <Text style={styles.wsFooterRescheduleBtnText}>Back to Patient</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.wsFooterPrimaryBtn}
                onPress={() => setInPersonStep(3)}
                activeOpacity={0.88}
              >
                <Ionicons name="medkit-outline" size={16} color="#FFFFFF" />
                <Text style={styles.wsFooterPrimaryBtnText}>Prescribe</Text>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: PRESCRIBE (RX) SLIDE PAGE */}
        {isInPerson && inPersonStep === 3 && (
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={styles.stepHeader}>
              <View style={styles.stepHeaderTopRow}>
                <TouchableOpacity
                  style={styles.stepBackBtn}
                  onPress={() => setInPersonStep(2)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                  <Text style={styles.stepBackBtnText}>Consult Notes</Text>
                </TouchableOpacity>
                <View style={styles.stepBadgePill}>
                  <Text style={styles.stepBadgePillText}>Step 3 of 4</Text>
                </View>
              </View>
              <Text style={styles.stepHeaderTitle}>e-Prescription (Rx)</Text>
              <Text style={styles.stepHeaderSubtitle}>
                Patient: {selectedAppointment.name} · Digital Medication Order
              </Text>
            </View>

            <ScrollView style={styles.wsScrollBody} contentContainerStyle={styles.wsScrollContent} showsVerticalScrollIndicator={false}>
              {/* Patient Brief Strip */}
              <View style={styles.patientBriefStrip}>
                <View style={styles.briefAvatar}>
                  <Text style={styles.briefAvatarText}>{selectedAppointment.name ? selectedAppointment.name.charAt(0) : 'P'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.briefName}>{selectedAppointment.name}</Text>
                  <Text style={styles.briefMeta}>
                    Diagnosis: {inPersonDiagnosis}
                  </Text>
                </View>
                <View style={[styles.briefVitalsBadge, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}>
                  <Text style={[styles.briefVitalsText, { color: '#4338CA' }]}>
                    {inPersonPrescriptions.length} Meds
                  </Text>
                </View>
              </View>

              {/* Card 1: Search Medicine with Dropdown */}
              <View style={[styles.stepSectionCard, { zIndex: 120 }]}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="search-outline" size={16} color="#00B894" />
                  <Text style={styles.stepCardTitle}>Search Medicine Library</Text>
                </View>
                <View style={styles.searchDropdownContainer}>
                  <Ionicons name="search" size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.searchDropdownInput}
                    placeholder="Search medicine e.g. Paracetamol, Augmentin..."
                    placeholderTextColor="#94A3B8"
                    value={medSearchQuery}
                    onChangeText={(t) => {
                      setMedSearchQuery(t);
                      setMedDropdownVisible(true);
                    }}
                    onFocus={() => setMedDropdownVisible(true)}
                  />
                  <TouchableOpacity
                    style={styles.searchDropdownChevronBtn}
                    onPress={() => setMedDropdownVisible(!medDropdownVisible)}
                  >
                    <Ionicons
                      name={medDropdownVisible ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#081E3E"
                    />
                  </TouchableOpacity>
                </View>

                {/* Medicine Dropdown Menu */}
                {medDropdownVisible && (
                  <View style={styles.catalogDropdownMenu}>
                    <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                      {filteredMedicines.length === 0 ? (
                        <View style={{ padding: 12, alignItems: 'center' }}>
                          <Text style={{ fontSize: 12, color: '#94A3B8' }}>No exact match. Enter manually below.</Text>
                        </View>
                      ) : (
                        filteredMedicines.map((item, idx) => (
                          <TouchableOpacity
                            key={idx}
                            style={styles.catalogDropdownItem}
                            onPress={() => {
                              setManualMedName(item.name);
                              setManualMedDosage(item.dosage || '1 Tablet');
                              setManualMedFreq(item.freq || 'BD (Twice daily)');
                              setManualMedDuration(item.duration || '5 days');
                              setMedSearchQuery(item.name);
                              setMedDropdownVisible(false);
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={styles.catalogItemTitle}>{item.name}</Text>
                              <Text style={styles.catalogItemSub}>{item.category} · {item.dosage}</Text>
                            </View>
                            <View style={styles.catalogSelectPill}>
                              <Text style={styles.catalogSelectPillText}>Select</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Card 2: Manual Medicine Entry */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="create-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Manual Medicine Entry</Text>
                </View>

                <Text style={styles.fieldSubLabel}>Medicine Name</Text>
                <TextInput
                  style={styles.stepInputSingle}
                  placeholder="e.g. Paracetamol 650mg, Amoxicillin 500mg..."
                  placeholderTextColor="#94A3B8"
                  value={manualMedName}
                  onChangeText={setManualMedName}
                />

                <View style={styles.formRowTwoCol}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldSubLabel}>Dosage</Text>
                    <TextInput
                      style={styles.stepInputSingle}
                      placeholder="e.g. 1 Tablet"
                      placeholderTextColor="#94A3B8"
                      value={manualMedDosage}
                      onChangeText={setManualMedDosage}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.fieldSubLabel}>Frequency</Text>
                    <TextInput
                      style={styles.stepInputSingle}
                      placeholder="e.g. BD (Twice daily)"
                      placeholderTextColor="#94A3B8"
                      value={manualMedFreq}
                      onChangeText={setManualMedFreq}
                    />
                  </View>
                </View>

                <Text style={styles.fieldSubLabel}>Duration</Text>
                <View style={styles.quickChipsWrap}>
                  {['3 days', '5 days', '7 days', '14 days', '1 month'].map((dur) => (
                    <TouchableOpacity
                      key={dur}
                      style={[
                        styles.quickChipItem,
                        manualMedDuration === dur && styles.quickChipItemActive,
                      ]}
                      onPress={() => setManualMedDuration(dur)}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          manualMedDuration === dur && styles.quickChipTextActive,
                        ]}
                      >
                        {dur}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.fieldSubLabel, { marginTop: 10 }]}>Schedule Timings</Text>
                <View style={styles.timingTogglesRow}>
                  <TouchableOpacity
                    style={[styles.timingToggleBtn, manualMedMorning && styles.timingToggleBtnActive]}
                    onPress={() => setManualMedMorning(!manualMedMorning)}
                  >
                    <Ionicons name="sunny-outline" size={14} color={manualMedMorning ? '#FFFFFF' : '#475569'} />
                    <Text style={[styles.timingToggleText, manualMedMorning && styles.timingToggleTextActive]}>
                      Morning
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.timingToggleBtn, manualMedAfternoon && styles.timingToggleBtnActive]}
                    onPress={() => setManualMedAfternoon(!manualMedAfternoon)}
                  >
                    <Ionicons name="partly-sunny-outline" size={14} color={manualMedAfternoon ? '#FFFFFF' : '#475569'} />
                    <Text style={[styles.timingToggleText, manualMedAfternoon && styles.timingToggleTextActive]}>
                      Afternoon
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.timingToggleBtn, manualMedNight && styles.timingToggleBtnActive]}
                    onPress={() => setManualMedNight(!manualMedNight)}
                  >
                    <Ionicons name="moon-outline" size={14} color={manualMedNight ? '#FFFFFF' : '#475569'} />
                    <Text style={[styles.timingToggleText, manualMedNight && styles.timingToggleTextActive]}>
                      Night
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.foodTimingToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.foodTogglePill,
                      manualMedFoodTiming === 'after' && styles.foodTogglePillActive,
                    ]}
                    onPress={() => setManualMedFoodTiming('after')}
                  >
                    <Ionicons name="restaurant-outline" size={13} color={manualMedFoodTiming === 'after' ? '#FFFFFF' : '#475569'} />
                    <Text style={[styles.foodToggleText, manualMedFoodTiming === 'after' && styles.foodToggleTextActive]}>
                      After Food
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.foodTogglePill,
                      manualMedFoodTiming === 'before' && styles.foodTogglePillActive,
                    ]}
                    onPress={() => setManualMedFoodTiming('before')}
                  >
                    <Ionicons name="time-outline" size={13} color={manualMedFoodTiming === 'before' ? '#FFFFFF' : '#475569'} />
                    <Text style={[styles.foodToggleText, manualMedFoodTiming === 'before' && styles.foodToggleTextActive]}>
                      Before Food
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.addMedicineActionBtn}
                  onPress={handleAddMedicine}
                  activeOpacity={0.88}
                >
                  <Ionicons name="add-circle" size={17} color="#FFFFFF" />
                  <Text style={styles.addMedicineActionBtnText}>Add to Prescription</Text>
                </TouchableOpacity>
              </View>

              {/* Card 3: Prescribed Medicines List */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="receipt-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>
                    Prescribed Medicines ({inPersonPrescriptions.length})
                  </Text>
                </View>

                {inPersonPrescriptions.length === 0 ? (
                  <View style={styles.emptyListPlaceholder}>
                    <Ionicons name="medkit-outline" size={28} color="#94A3B8" />
                    <Text style={styles.emptyListText}>No medicines added yet.</Text>
                    <Text style={styles.emptyListSubText}>Search library or use manual entry above.</Text>
                  </View>
                ) : (
                  inPersonPrescriptions.map((med, index) => (
                    <View key={med.id || index} style={styles.prescribedItemCard}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.medIndexNum}>{index + 1}.</Text>
                          <Text style={styles.prescribedMedName}>{med.name}</Text>
                        </View>
                        <View style={styles.prescribedBadgesRow}>
                          <View style={styles.medBadgePill}>
                            <Text style={styles.medBadgePillText}>{med.dosage}</Text>
                          </View>
                          <View style={styles.medBadgePill}>
                            <Text style={styles.medBadgePillText}>{med.freq}</Text>
                          </View>
                          <View style={[styles.medBadgePill, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                            <Text style={[styles.medBadgePillText, { color: '#166534' }]}>
                              {med.timing?.food === 'before' ? 'Before food' : 'After food'}
                            </Text>
                          </View>
                          <View style={[styles.medBadgePill, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                            <Text style={[styles.medBadgePillText, { color: '#1D4ED8' }]}>{med.duration}</Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteMedBtn}
                        onPress={() => handleDeleteMedicine(med.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Step 3 Static Bottom Footer */}
            <View style={styles.wsStaticFooter}>
              <TouchableOpacity
                style={styles.wsFooterRescheduleBtn}
                onPress={() => setInPersonStep(2)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#475569" />
                <Text style={styles.wsFooterRescheduleBtnText}>Back to Notes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.wsFooterPrimaryBtn}
                onPress={() => setInPersonStep(4)}
                activeOpacity={0.88}
              >
                <Ionicons name="flask-outline" size={16} color="#FFFFFF" />
                <Text style={styles.wsFooterPrimaryBtnText}>Continue to Test</Text>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 4: TEST REQUIREMENTS SLIDE PAGE */}
        {isInPerson && inPersonStep === 4 && (
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={styles.stepHeader}>
              <View style={styles.stepHeaderTopRow}>
                <TouchableOpacity
                  style={styles.stepBackBtn}
                  onPress={() => setInPersonStep(3)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                  <Text style={styles.stepBackBtnText}>Prescriptions</Text>
                </TouchableOpacity>
                <View style={styles.stepBadgePill}>
                  <Text style={styles.stepBadgePillText}>Step 4 of 4</Text>
                </View>
              </View>
              <Text style={styles.stepHeaderTitle}>Test Requirements</Text>
              <Text style={styles.stepHeaderSubtitle}>
                Patient: {selectedAppointment.name} · Diagnostic & Lab Orders
              </Text>
            </View>

            <ScrollView style={styles.wsScrollBody} contentContainerStyle={styles.wsScrollContent} showsVerticalScrollIndicator={false}>
              {/* Patient Brief Strip */}
              <View style={styles.patientBriefStrip}>
                <View style={styles.briefAvatar}>
                  <Text style={styles.briefAvatarText}>{selectedAppointment.name ? selectedAppointment.name.charAt(0) : 'P'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.briefName}>{selectedAppointment.name}</Text>
                  <Text style={styles.briefMeta}>
                    Rx: {inPersonPrescriptions.length} Meds Prescribed
                  </Text>
                </View>
                <View style={[styles.briefVitalsBadge, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                  <Text style={[styles.briefVitalsText, { color: '#166534' }]}>
                    {inPersonTests.length} Tests
                  </Text>
                </View>
              </View>

              {/* Card 1: Search Tests with Dropdown */}
              <View style={[styles.stepSectionCard, { zIndex: 120 }]}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="search-outline" size={16} color="#00B894" />
                  <Text style={styles.stepCardTitle}>Search Lab Diagnostics Library</Text>
                </View>
                <View style={styles.searchDropdownContainer}>
                  <Ionicons name="search" size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.searchDropdownInput}
                    placeholder="Search test e.g. CBC, Lipid Profile, HbA1c, ECG..."
                    placeholderTextColor="#94A3B8"
                    value={testSearchQuery}
                    onChangeText={(t) => {
                      setTestSearchQuery(t);
                      setTestDropdownVisible(true);
                    }}
                    onFocus={() => setTestDropdownVisible(true)}
                  />
                  <TouchableOpacity
                    style={styles.searchDropdownChevronBtn}
                    onPress={() => setTestDropdownVisible(!testDropdownVisible)}
                  >
                    <Ionicons
                      name={testDropdownVisible ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#081E3E"
                    />
                  </TouchableOpacity>
                </View>

                {/* Test Dropdown Menu */}
                {testDropdownVisible && (
                  <View style={styles.catalogDropdownMenu}>
                    <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                      {filteredTests.length === 0 ? (
                        <View style={{ padding: 12, alignItems: 'center' }}>
                          <Text style={{ fontSize: 12, color: '#94A3B8' }}>No exact match. Enter manually below.</Text>
                        </View>
                      ) : (
                        filteredTests.map((item, idx) => (
                          <TouchableOpacity
                            key={idx}
                            style={styles.catalogDropdownItem}
                            onPress={() => {
                              setManualTestName(item.name);
                              setManualTestInstructions(item.defaultInstructions || 'Random / No fasting needed');
                              setTestSearchQuery(item.name);
                              setTestDropdownVisible(false);
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={styles.catalogItemTitle}>{item.name}</Text>
                              <Text style={styles.catalogItemSub}>{item.category} · {item.defaultInstructions}</Text>
                            </View>
                            <View style={styles.catalogSelectPill}>
                              <Text style={styles.catalogSelectPillText}>Select</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Card 2: Manual Test Entry Form */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="create-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Manual Test Requirement Entry</Text>
                </View>

                <Text style={styles.fieldSubLabel}>Test / Investigation Name</Text>
                <TextInput
                  style={styles.stepInputSingle}
                  placeholder="e.g. Complete Blood Count (CBC), Serum Creatinine..."
                  placeholderTextColor="#94A3B8"
                  value={manualTestName}
                  onChangeText={setManualTestName}
                />

                <Text style={[styles.fieldSubLabel, { marginTop: 10 }]}>Patient Preparation / Diet Requirement</Text>
                <View style={styles.quickChipsWrap}>
                  {[
                    'Fasting 8-10 hrs',
                    'Drinking only water',
                    'Random / No fasting needed',
                    'Post-meal 2 hrs',
                    'Morning sample only',
                  ].map((prep) => (
                    <TouchableOpacity
                      key={prep}
                      style={[
                        styles.quickChipItem,
                        manualTestInstructions === prep && styles.quickChipItemActive,
                      ]}
                      onPress={() => setManualTestInstructions(prep)}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          manualTestInstructions === prep && styles.quickChipTextActive,
                        ]}
                      >
                        {prep}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.fieldSubLabel, { marginTop: 10 }]}>Clinical Instructions for Lab Technician</Text>
                <TextInput
                  style={styles.stepInputMultiline}
                  multiline
                  numberOfLines={2}
                  placeholder="e.g. Urgent processing requested, check platelet count..."
                  placeholderTextColor="#94A3B8"
                  value={manualTestNotes}
                  onChangeText={setManualTestNotes}
                />

                <TouchableOpacity
                  style={styles.addMedicineActionBtn}
                  onPress={handleAddTest}
                  activeOpacity={0.88}
                >
                  <Ionicons name="add-circle" size={17} color="#FFFFFF" />
                  <Text style={styles.addMedicineActionBtnText}>Add Test Requirement</Text>
                </TouchableOpacity>
              </View>

              {/* Card 3: Prescribed Tests List */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="document-text-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>
                    Ordered Diagnostic Tests ({inPersonTests.length})
                  </Text>
                </View>

                {inPersonTests.length === 0 ? (
                  <View style={styles.emptyListPlaceholder}>
                    <Ionicons name="flask-outline" size={28} color="#94A3B8" />
                    <Text style={styles.emptyListText}>No test requirements added yet.</Text>
                    <Text style={styles.emptyListSubText}>Search catalog or use manual entry above.</Text>
                  </View>
                ) : (
                  inPersonTests.map((t, index) => (
                    <View key={t.id || index} style={styles.prescribedItemCard}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.medIndexNum}>{index + 1}.</Text>
                          <Text style={styles.prescribedMedName}>{t.name}</Text>
                        </View>
                        <View style={styles.prescribedBadgesRow}>
                          <View style={[styles.medBadgePill, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                            <Text style={[styles.medBadgePillText, { color: '#B45309' }]}>
                              {t.instructions}
                            </Text>
                          </View>
                          {t.notes && (
                            <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                              Note: {t.notes}
                            </Text>
                          )}
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteMedBtn}
                        onPress={() => handleDeleteTest(t.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Step 4 Static Bottom Footer */}
            <View style={styles.wsStaticFooter}>
              <TouchableOpacity
                style={styles.wsFooterRescheduleBtn}
                onPress={() => setInPersonStep(3)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#475569" />
                <Text style={styles.wsFooterRescheduleBtnText}>Back to Prescribe</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.wsFooterPrimaryBtn}
                onPress={() => setInPersonStep(5)}
                activeOpacity={0.88}
              >
                <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
                <Text style={styles.wsFooterPrimaryBtnText}>Continue to Date & Time</Text>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 5: DATE & TIME SCHEDULE SLIDE PAGE */}
        {isInPerson && inPersonStep === 5 && (
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <View style={styles.stepHeader}>
              <View style={styles.stepHeaderTopRow}>
                <TouchableOpacity
                  style={styles.stepBackBtn}
                  onPress={() => setInPersonStep(4)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                  <Text style={styles.stepBackBtnText}>Test Requirements</Text>
                </TouchableOpacity>
                <View style={styles.stepBadgePill}>
                  <Text style={styles.stepBadgePillText}>Step 5 of 5</Text>
                </View>
              </View>
              <Text style={styles.stepHeaderTitle}>Date & Time Schedule</Text>
              <Text style={styles.stepHeaderSubtitle}>
                Patient: {selectedAppointment.name} · Follow-up Appointment & Finalize
              </Text>
            </View>

            <ScrollView style={styles.wsScrollBody} contentContainerStyle={styles.wsScrollContent} showsVerticalScrollIndicator={false}>
              {/* Patient Brief Strip */}
              <View style={styles.patientBriefStrip}>
                <View style={styles.briefAvatar}>
                  <Text style={styles.briefAvatarText}>{selectedAppointment.name ? selectedAppointment.name.charAt(0) : 'P'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.briefName}>{selectedAppointment.name}</Text>
                  <Text style={styles.briefMeta}>
                    Diagnosis: {inPersonDiagnosis}
                  </Text>
                </View>
                <View style={[styles.briefVitalsBadge, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                  <Text style={[styles.briefVitalsText, { color: '#166534' }]}>
                    Ready to Submit
                  </Text>
                </View>
              </View>

              {/* Consultation Summary Banner */}
              <View style={styles.followUpSummaryBanner}>
                <View style={styles.summaryBadgePill}>
                  <Text style={styles.summaryBadgeText}>Clinical Assessment: {inPersonDiagnosis}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                  <Text style={styles.summaryCountText}>
                    💊 {inPersonPrescriptions.length} Medicines Prescribed
                  </Text>
                  <Text style={styles.summaryCountText}>
                    🧪 {inPersonTests.length} Tests Ordered
                  </Text>
                </View>
              </View>

              {/* Interval Selection */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="time-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Recommended Review Interval</Text>
                </View>
                <View style={styles.quickChipsWrap}>
                  {['3 Days', '5 Days', '1 Week', '2 Weeks', '1 Month'].map((interval) => (
                    <TouchableOpacity
                      key={interval}
                      style={[
                        styles.quickChipItem,
                        followUpInterval === interval && styles.quickChipItemActive,
                      ]}
                      onPress={() => {
                        setFollowUpInterval(interval);
                        if (interval === '3 Days') setFollowUpDate('03 Oct 2026');
                        else if (interval === '5 Days') setFollowUpDate('05 Oct 2026');
                        else if (interval === '1 Week') setFollowUpDate('07 Oct 2026');
                        else if (interval === '2 Weeks') setFollowUpDate('14 Oct 2026');
                        else if (interval === '1 Month') setFollowUpDate('30 Oct 2026');
                      }}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          followUpInterval === interval && styles.quickChipTextActive,
                        ]}
                      >
                        {interval}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Follow-up Date Field */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="calendar-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Follow-up Appointment Date</Text>
                </View>
                <TouchableOpacity
                  style={styles.followUpDateBox}
                  onPress={() => setCalendarModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="calendar" size={16} color="#00B894" />
                  <Text style={styles.followUpDateText}>{followUpDate}</Text>
                  <View style={styles.autoCalcBadge}>
                    <Text style={styles.autoCalcBadgeText}>{followUpInterval}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Preferred Time Slot */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="alarm-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Preferred Time Slot</Text>
                </View>
                <View style={styles.quickChipsWrap}>
                  {['10:00 AM', '11:30 AM', '02:30 PM', '04:30 PM', '06:00 PM'].map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.quickChipItem,
                        followUpTime === slot && styles.quickChipItemActive,
                      ]}
                      onPress={() => setFollowUpTime(slot)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={followUpTime === slot ? '#00B894' : '#475569'}
                      />
                      <Text
                        style={[
                          styles.quickChipText,
                          followUpTime === slot && styles.quickChipTextActive,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Consultation Mode */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="medkit-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Follow-up Consultation Mode</Text>
                </View>
                <View style={styles.foodTimingToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.foodTogglePill,
                      followUpMode === 'In-Person' && styles.foodTogglePillActive,
                    ]}
                    onPress={() => setFollowUpMode('In-Person')}
                  >
                    <Ionicons
                      name="business-outline"
                      size={13}
                      color={followUpMode === 'In-Person' ? '#FFFFFF' : '#475569'}
                    />
                    <Text style={[styles.foodToggleText, followUpMode === 'In-Person' && styles.foodToggleTextActive]}>
                      In-Person (Clinic)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.foodTogglePill,
                      followUpMode === 'Video' && styles.foodTogglePillActive,
                    ]}
                    onPress={() => setFollowUpMode('Video')}
                  >
                    <Ionicons
                      name="videocam-outline"
                      size={13}
                      color={followUpMode === 'Video' ? '#FFFFFF' : '#475569'}
                    />
                    <Text style={[styles.foodToggleText, followUpMode === 'Video' && styles.foodToggleTextActive]}>
                      Video Consultation
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Doctor's Notes for Follow-up */}
              <View style={styles.stepSectionCard}>
                <View style={styles.stepCardHeader}>
                  <Ionicons name="document-text-outline" size={16} color="#081E3E" />
                  <Text style={styles.stepCardTitle}>Instructions for Follow-up</Text>
                </View>
                <TextInput
                  style={styles.stepInputMultiline}
                  multiline
                  numberOfLines={2}
                  placeholder="e.g. Review test reports and symptom progression on next visit..."
                  placeholderTextColor="#94A3B8"
                  value={followUpNotes}
                  onChangeText={setFollowUpNotes}
                />
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Step 5 Static Bottom Footer with SUBMIT BUTTON */}
            <View style={styles.wsStaticFooter}>
              <TouchableOpacity
                style={styles.wsFooterRescheduleBtn}
                onPress={() => setInPersonStep(4)}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={15} color="#475569" />
                <Text style={styles.wsFooterRescheduleBtnText}>Back to Tests</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.wsFooterPrimaryBtn, { backgroundColor: '#00B894' }]}
                onPress={handleSubmitConsultation}
                activeOpacity={0.88}
              >
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                <Text style={styles.wsFooterPrimaryBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  )}

  {/* ============================================================== */}
  {/* FOLLOW-UP DATE & TIME MODAL                                    */}
  {/* ============================================================== */}
  <Modal
    visible={followUpModalVisible}
    transparent={true}
    animationType="fade"
    onRequestClose={() => setFollowUpModalVisible(false)}
  >
    <View style={styles.modalBackdrop}>
      <View style={[styles.modalCardBox, { maxWidth: 480 }]}>
        {/* Header */}
        <View style={styles.modalHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.calendarModalIconWrap}>
              <Ionicons name="calendar" size={18} color="#00B894" />
            </View>
            <View>
              <Text style={styles.modalHeadingText}>Follow-up Date & Time</Text>
              <Text style={styles.modalSubheadingText}>
                Schedule next review for {selectedAppointment?.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setFollowUpModalVisible(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color="#081E3E" />
          </TouchableOpacity>
        </View>

        {/* Clinical Summary Banner */}
        <View style={styles.followUpSummaryBanner}>
          <View style={styles.summaryBadgePill}>
            <Text style={styles.summaryBadgeText}>Diagnosis: {inPersonDiagnosis}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
            <Text style={styles.summaryCountText}>
              💊 {inPersonPrescriptions.length} Meds Prescribed
            </Text>
            <Text style={styles.summaryCountText}>
              🧪 {inPersonTests.length} Tests Ordered
            </Text>
          </View>
        </View>

        {/* Interval Selector */}
        <Text style={styles.modalLabelSmall}>Recommended Review Interval</Text>
        <View style={styles.quickChipsWrap}>
          {['3 Days', '5 Days', '1 Week', '2 Weeks', '1 Month'].map((interval) => (
            <TouchableOpacity
              key={interval}
              style={[
                styles.quickChipItem,
                followUpInterval === interval && styles.quickChipItemActive,
              ]}
              onPress={() => {
                setFollowUpInterval(interval);
                if (interval === '3 Days') setFollowUpDate('03 Oct 2026');
                else if (interval === '5 Days') setFollowUpDate('05 Oct 2026');
                else if (interval === '1 Week') setFollowUpDate('07 Oct 2026');
                else if (interval === '2 Weeks') setFollowUpDate('14 Oct 2026');
                else if (interval === '1 Month') setFollowUpDate('30 Oct 2026');
              }}
            >
              <Text
                style={[
                  styles.quickChipText,
                  followUpInterval === interval && styles.quickChipTextActive,
                ]}
              >
                {interval}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Field Display */}
        <Text style={[styles.modalLabelSmall, { marginTop: 12 }]}>Follow-up Date</Text>
        <View style={styles.followUpDateBox}>
          <Ionicons name="calendar-outline" size={16} color="#081E3E" />
          <Text style={styles.followUpDateText}>{followUpDate}</Text>
          <View style={styles.autoCalcBadge}>
            <Text style={styles.autoCalcBadgeText}>{followUpInterval}</Text>
          </View>
        </View>

        {/* Time Slot Selector */}
        <Text style={[styles.modalLabelSmall, { marginTop: 12 }]}>Preferred Time Slot</Text>
        <View style={styles.quickChipsWrap}>
          {['10:00 AM', '11:30 AM', '02:30 PM', '04:30 PM', '06:00 PM'].map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.quickChipItem,
                followUpTime === slot && styles.quickChipItemActive,
              ]}
              onPress={() => setFollowUpTime(slot)}
            >
              <Ionicons
                name="time-outline"
                size={12}
                color={followUpTime === slot ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.quickChipText,
                  followUpTime === slot && styles.quickChipTextActive,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Follow-up Consultation Mode */}
        <Text style={[styles.modalLabelSmall, { marginTop: 12 }]}>Review Mode</Text>
        <View style={styles.foodTimingToggleRow}>
          <TouchableOpacity
            style={[
              styles.foodTogglePill,
              followUpMode === 'In-Person' && styles.foodTogglePillActive,
            ]}
            onPress={() => setFollowUpMode('In-Person')}
          >
            <Ionicons
              name="business-outline"
              size={13}
              color={followUpMode === 'In-Person' ? '#FFFFFF' : '#475569'}
            />
            <Text style={[styles.foodToggleText, followUpMode === 'In-Person' && styles.foodToggleTextActive]}>
              In-Person (Clinic)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.foodTogglePill,
              followUpMode === 'Video' && styles.foodTogglePillActive,
            ]}
            onPress={() => setFollowUpMode('Video')}
          >
            <Ionicons
              name="videocam-outline"
              size={13}
              color={followUpMode === 'Video' ? '#FFFFFF' : '#475569'}
            />
            <Text style={[styles.foodToggleText, followUpMode === 'Video' && styles.foodToggleTextActive]}>
              Video Consultation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={[styles.modalButtonsRow, { marginTop: 18 }]}>
          <TouchableOpacity
            style={styles.modalCancelBtn}
            onPress={() => setFollowUpModalVisible(false)}
          >
            <Text style={styles.modalCancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalConfirmBtn}
            onPress={handleSubmitConsultation}
            activeOpacity={0.88}
          >
            <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
            <Text style={styles.modalConfirmBtnText}>Submit Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>

      {/* ============================================================== */}
      {/* 6. POP-UP MODAL: UPCOMING APPOINTMENT PATIENT PROFILE          */}
      {/* (CENTER OF SCREEN WITH MATCHED THEME & ONLY 'OK' BUTTON)       */}
      {/* ============================================================== */}
      <Modal
        visible={!!upcomingModalPatient}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUpcomingModalPatient(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCardBox, { maxWidth: 460 }]}>
            {upcomingModalPatient && (
              <>
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalHeaderInfo}>
                    <View style={[styles.modalAvatar, { backgroundColor: upcomingModalPatient.avatarBg }]}>
                      <Text style={[styles.modalAvatarText, { color: upcomingModalPatient.avatarColor }]}>
                        {upcomingModalPatient.initials}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.modalPatientName}>{upcomingModalPatient.name}</Text>
                      <Text style={styles.modalPatientMeta}>
                        {upcomingModalPatient.age} yrs · {upcomingModalPatient.gender} · {upcomingModalPatient.phone}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setUpcomingModalPatient(null)}
                    style={styles.modalCloseBtn}
                  >
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  {/* Scheduled Date and Timing Box */}
                  <View style={styles.upcomingHighlightBox}>
                    <View style={styles.upcomingTimingHeader}>
                      <Ionicons name="calendar" size={16} color="#00B894" />
                      <Text style={styles.upcomingTimingTitle}>Upcoming Scheduled Slot</Text>
                    </View>
                    <Text style={styles.upcomingDateVal}>{upcomingModalPatient.date}</Text>
                    <View style={styles.upcomingTimeRow}>
                      <Ionicons name="time" size={14} color="#081E3E" />
                      <Text style={styles.upcomingTimeVal}>{upcomingModalPatient.slotTime}</Text>
                      <View style={styles.upcomingTypePill}>
                        <Text style={styles.upcomingTypePillText}>{upcomingModalPatient.type}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalFieldBox}>
                    <Text style={styles.modalFieldLabel}>Chief Complaint / Symptoms</Text>
                    <Text style={styles.modalFieldValue}>{upcomingModalPatient.reason}</Text>
                  </View>

                  <View style={styles.vitalsRowGrid}>
                    <View style={styles.vitalMiniCell}>
                      <Text style={styles.vitalMiniTag}>Blood Group</Text>
                      <Text style={styles.vitalMiniVal}>{upcomingModalPatient.bloodGroup}</Text>
                    </View>
                    <View style={styles.vitalMiniCell}>
                      <Text style={styles.vitalMiniTag}>Allergies</Text>
                      <Text style={styles.vitalMiniVal}>{upcomingModalPatient.allergies}</Text>
                    </View>
                    <View style={styles.vitalMiniCell}>
                      <Text style={styles.vitalMiniTag}>Status</Text>
                      <Text style={[styles.vitalMiniVal, { color: '#00B894' }]}>Confirmed</Text>
                    </View>
                  </View>
                </View>

                {/* ONLY OK BUTTON AS REQUESTED */}
                <View style={styles.modalActionsRowOnlyOk}>
                  <TouchableOpacity
                    style={styles.modalOnlyOkBtn}
                    onPress={() => setUpcomingModalPatient(null)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalOnlyOkBtnText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 7. POP-UP MODAL: RESCHEDULE CALENDAR AS SHOWN IN SCREENSHOT    */}
      {/* (CENTER OF SCREEN WITH MATCHED THEME)                          */}
      {/* ============================================================== */}
      <Modal
        visible={calendarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.calendarModalCard}>
            {/* Modal Header: "Select Date", "Select date or date range", "✕" */}
            <View style={styles.calendarHeaderRow}>
              <View>
                <Text style={styles.calendarHeaderTitle}>Select Date</Text>
                <Text style={styles.calendarHeaderSubtitle}>Select date or date range</Text>
              </View>
              <TouchableOpacity
                onPress={() => setCalendarModalVisible(false)}
                style={styles.calendarCloseBtn}
              >
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Inner Content: Left Vertical Nav + Right Calendar Body */}
            <View style={styles.calendarBodyRow}>
              {/* Left Vertical Nav Bar */}
              <View style={styles.calendarLeftNav}>
                <TouchableOpacity
                  style={[styles.calendarNavItem, calendarNavTab === 'Today' && styles.calendarNavItemActive]}
                  onPress={() => setCalendarNavTab('Today')}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={calendarNavTab === 'Today' ? '#00B894' : '#64748B'}
                  />
                  <Text style={[styles.calendarNavText, calendarNavTab === 'Today' && styles.calendarNavTextActive]}>
                    Today
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.calendarNavItem, calendarNavTab === 'Date' && styles.calendarNavItemActive]}
                  onPress={() => setCalendarNavTab('Date')}
                >
                  <Ionicons
                    name="grid-outline"
                    size={20}
                    color={calendarNavTab === 'Date' ? '#00B894' : '#64748B'}
                  />
                  <Text style={[styles.calendarNavText, calendarNavTab === 'Date' && styles.calendarNavTextActive]}>
                    Date
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.calendarNavItem, calendarNavTab === 'Week' && styles.calendarNavItemActive]}
                  onPress={() => setCalendarNavTab('Week')}
                >
                  <Ionicons
                    name="calendar"
                    size={20}
                    color={calendarNavTab === 'Week' ? '#00B894' : '#64748B'}
                  />
                  <Text style={[styles.calendarNavText, calendarNavTab === 'Week' && styles.calendarNavTextActive]}>
                    Week
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.calendarNavItem, calendarNavTab === 'Month' && styles.calendarNavItemActive]}
                  onPress={() => setCalendarNavTab('Month')}
                >
                  <Ionicons
                    name="calendar-number-outline"
                    size={20}
                    color={calendarNavTab === 'Month' ? '#00B894' : '#64748B'}
                  />
                  <Text style={[styles.calendarNavText, calendarNavTab === 'Month' && styles.calendarNavTextActive]}>
                    Month
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.calendarNavItem, calendarNavTab === 'Year' && styles.calendarNavItemActive]}
                  onPress={() => setCalendarNavTab('Year')}
                >
                  <Ionicons
                    name="options-outline"
                    size={20}
                    color={calendarNavTab === 'Year' ? '#00B894' : '#64748B'}
                  />
                  <Text style={[styles.calendarNavText, calendarNavTab === 'Year' && styles.calendarNavTextActive]}>
                    Year
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Right Calendar Area */}
              <View style={styles.calendarRightArea}>
                {/* Month Navigation Bar */}
                <View style={styles.calendarMonthBar}>
                  <TouchableOpacity style={styles.calendarMonthChevronBtn}>
                    <Ionicons name="chevron-back" size={16} color="#475569" />
                  </TouchableOpacity>

                  <Text style={styles.calendarMonthTitle}>{selectedCalendarMonth}</Text>

                  <TouchableOpacity style={styles.calendarMonthChevronBtn}>
                    <Ionicons name="chevron-forward" size={16} color="#475569" />
                  </TouchableOpacity>
                </View>

                {/* Info Alert Banner */}
                <View style={styles.calendarInfoPill}>
                  <Ionicons name="information-circle-outline" size={16} color="#00B894" />
                  <Text style={styles.calendarInfoPillText}>
                    Select date or tap another date for range
                  </Text>
                </View>

                {/* Weekday Labels Header */}
                <View style={styles.calendarWeekdaysRow}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Text key={day} style={styles.calendarWeekdayLabel}>{day}</Text>
                  ))}
                </View>

                {/* Calendar Days Matrix (October 2026) */}
                <View style={styles.calendarDaysGrid}>
                  {calendarDaysMatrix.map((week, wIdx) => (
                    <View key={`week-${wIdx}`} style={styles.calendarWeekRow}>
                      {week.map((dayNum, dIdx) => {
                        if (!dayNum) {
                          return <View key={`empty-${dIdx}`} style={styles.calendarDayCell} />;
                        }
                        const isDaySelected = selectedCalendarDay === dayNum;
                        return (
                          <TouchableOpacity
                            key={`day-${dayNum}`}
                            style={[
                              styles.calendarDayCell,
                              isDaySelected && styles.calendarDayCellSelected,
                            ]}
                            onPress={() => setSelectedCalendarDay(dayNum)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.calendarDayText,
                                isDaySelected && styles.calendarDayTextSelected,
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

                {/* Time Slots Selection Row */}
                <Text style={styles.calendarTimeSectionLabel}>Choose Consultation Slot</Text>
                <View style={styles.calendarTimeSlotsRow}>
                  {['10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'].map(time => {
                    const isTimeSelected = selectedCalendarTime === time;
                    return (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.calendarTimePill,
                          isTimeSelected && styles.calendarTimePillSelected,
                        ]}
                        onPress={() => setSelectedCalendarTime(time)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.calendarTimePillText,
                            isTimeSelected && styles.calendarTimePillTextSelected,
                          ]}
                        >
                          {time}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Bottom Done Action Button */}
            <View style={styles.calendarFooterRow}>
              <TouchableOpacity
                style={styles.calendarDoneBtn}
                onPress={handleConfirmCalendarReschedule}
                activeOpacity={0.88}
              >
                <Text style={styles.calendarDoneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 8. POP-UP MODAL: WAIT FOR PATIENT ACCEPTED                    */}
      {/* ============================================================== */}
      <Modal
        visible={!!awaitingModalPatient}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAwaitingModalPatient(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCardBox, { maxWidth: 460 }]}>
            {awaitingModalPatient && (
              <>
                <View style={styles.modalHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={styles.awaitingIconCircle}>
                      <Ionicons name="hourglass-outline" size={20} color="#D97706" />
                    </View>
                    <Text style={styles.modalHeadingText}>Wait for Patient Accepted</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setAwaitingModalPatient(null)}
                    style={styles.modalCloseBtn}
                  >
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.awaitingNoticeCard}>
                    <Text style={styles.awaitingNoticePatient}>
                      Patient: <Text style={{ fontWeight: '800', color: '#081E3E' }}>{awaitingModalPatient.name}</Text>
                    </Text>
                    <Text style={styles.awaitingNoticeTime}>
                      Proposed Slot: <Text style={{ fontWeight: '800', color: '#081E3E' }}>{awaitingModalPatient.time}</Text>
                    </Text>
                    <Text style={styles.awaitingNoticeDescription}>
                      This appointment was rescheduled. We are currently waiting for the patient to confirm and accept this new slot.
                      Automated reminder alerts have been sent to their registered contact number ({awaitingModalPatient.phone}).
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    style={styles.modalBtnSecondary}
                    onPress={() => setAwaitingModalPatient(null)}
                  >
                    <Text style={styles.modalBtnSecondaryText}>OK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtnPrimary, { backgroundColor: '#D97706' }]}
                    onPress={() => handleSendReminder(awaitingModalPatient)}
                  >
                    <Ionicons name="notifications-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.modalBtnPrimaryText}>Send Reminder Alert</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 9. POP-UP MODAL: OVERDUE PATIENT PROFILE                      */}
      {/* ============================================================== */}
      <Modal
        visible={!!overdueModalPatient}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOverdueModalPatient(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardBox}>
            {overdueModalPatient && (
              <>
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalHeaderInfo}>
                    <View style={[styles.modalAvatar, { backgroundColor: '#FEE2E2' }]}>
                      <Ionicons name="alert-circle" size={24} color="#DC2626" />
                    </View>
                    <View>
                      <Text style={styles.modalPatientName}>{overdueModalPatient.name}</Text>
                      <Text style={[styles.modalPatientMeta, { color: '#DC2626', fontWeight: '700' }]}>
                        Overdue / Missed Consultation
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setOverdueModalPatient(null)}
                    style={styles.modalCloseBtn}
                  >
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.overdueHighlightBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="time" size={16} color="#DC2626" />
                      <Text style={styles.overdueSlotTitle}>Original Scheduled Slot</Text>
                    </View>
                    <Text style={styles.overdueSlotVal}>{overdueModalPatient.time}</Text>
                    <Text style={styles.overdueSlotSub}>
                      Patient did not join or check in for this slot. You can send a direct reconnection request.
                    </Text>
                  </View>

                  <View style={styles.modalFieldBox}>
                    <Text style={styles.modalFieldLabel}>Chief Complaint / Symptoms</Text>
                    <Text style={styles.modalFieldValue}>{overdueModalPatient.reason}</Text>
                  </View>

                  <View style={styles.vitalsRowGrid}>
                    <View style={styles.vitalMiniCell}>
                      <Text style={styles.vitalMiniTag}>Age / Gender</Text>
                      <Text style={styles.vitalMiniVal}>{overdueModalPatient.age} yrs · {overdueModalPatient.gender}</Text>
                    </View>
                    <View style={styles.vitalMiniCell}>
                      <Text style={styles.vitalMiniTag}>Phone Number</Text>
                      <Text style={styles.vitalMiniVal}>{overdueModalPatient.phone}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    style={styles.modalBtnSecondary}
                    onPress={() => setOverdueModalPatient(null)}
                  >
                    <Text style={styles.modalBtnSecondaryText}>OK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtnPrimary, { backgroundColor: '#DC2626' }]}
                    onPress={() => handleRequestAgain(overdueModalPatient)}
                  >
                    <Ionicons name="paper-plane" size={15} color="#FFFFFF" />
                    <Text style={styles.modalBtnPrimaryText}>Request Again</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 10. DOCTOR REQUEST DOCUMENT REPORT MODAL                       */}
      {/* ============================================================== */}
      <Modal
        visible={requestModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.requestDocCard}>
            <View style={styles.modalHeaderRowNoBorder}>
              <View>
                <Text style={styles.requestDocTitle}>Request Document Report</Text>
                <Text style={styles.requestDocSubtitle}>
                  Request patient to upload required records
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setRequestModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.requestFieldLabel}>Select Standard Document Type</Text>
            <View style={styles.quickChipsWrap}>
              {COMMON_DOC_TYPES.map((type) => {
                const isSelected = manualDocType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.quickChip, isSelected && styles.quickChipActive]}
                    onPress={() => handleSelectQuickDoc(type)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.quickChipText, isSelected && styles.quickChipTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.requestFieldLabel, { marginTop: 14 }]}>
              Or Type Custom Document / Report Name
            </Text>
            <TextInput
              style={styles.requestModalInput}
              placeholder="e.g. Thyroid Panel (T3, T4, TSH), Chest X-Ray..."
              placeholderTextColor="#94A3B8"
              value={manualDocType}
              onChangeText={(t) => {
                setManualDocType(t);
                setDocError('');
              }}
            />

            <Text style={[styles.requestFieldLabel, { marginTop: 12 }]}>
              Clinical Instructions / Note (Optional)
            </Text>
            <TextInput
              style={[styles.requestModalInput, styles.requestModalTextArea]}
              placeholder="e.g. Please upload latest fasting reports prior to consultation..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={docInstructions}
              onChangeText={setDocInstructions}
            />

            {docError ? <Text style={styles.requestErrorText}>{docError}</Text> : null}

            <View style={styles.requestModalActionsRow}>
              <TouchableOpacity
                style={styles.requestCancelBtn}
                onPress={() => setRequestModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.requestCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.requestSubmitBtn}
                onPress={handleSendDocRequest}
                activeOpacity={0.85}
              >
                <Ionicons name="send" size={15} color="#FFFFFF" />
                <Text style={styles.requestSubmitBtnText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 11. THEME-MATCHED IN-APP NOTIFICATION POP-UP IN CENTER         */}
      {/* CLICKING OK OPENS THE RIGHT SLIDE DRAWER!                      */}
      {/* ============================================================== */}
      <Modal
        visible={!!themeModalAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setThemeModalAlert(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.themeAlertCard}>
            <View style={styles.themeAlertIconCircle}>
              <Ionicons
                name={themeModalAlert?.icon || 'checkmark-circle-outline'}
                size={32}
                color="#00B894"
              />
            </View>
            <Text style={styles.themeAlertTitle}>{themeModalAlert?.title}</Text>
            <Text style={styles.themeAlertMessage}>{themeModalAlert?.message}</Text>
            <TouchableOpacity
              style={styles.themeAlertOkBtn}
              onPress={() => {
                const callback = themeModalAlert?.onOk;
                setThemeModalAlert(null);
                if (callback) {
                  callback();
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.themeAlertOkBtnText}>OK</Text>
            </TouchableOpacity>
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
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  dateSelectorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  openDrawerBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6FAF6',
    borderWidth: 1,
    borderColor: '#00B894',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  openDrawerBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#00B894',
  },

  /* Channel Mode Toggle */
  channelToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8EEF5',
    borderRadius: 12,
    padding: 4,
    maxWidth: 500,
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

  /* Status Filter Bar */
  statusAndSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 14,
  },
  statusFiltersGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusFilterPillActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  statusFilterPillOverdue: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  statusFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  statusFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: '#00B894',
  },
  countBadgeInactive: {
    backgroundColor: '#E8F8F5',
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  countBadgeTextActive: {
    color: '#FFFFFF',
  },
  countBadgeTextInactive: {
    color: '#00B894',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 230,
    flex: 1,
    maxWidth: 340,
  },
  searchInput: {
    fontSize: 13,
    color: '#081E3E',
    outlineStyle: 'none',
    flex: 1,
  },

  /* Cards List Container */
  cardsListContainer: {
    gap: 14,
    width: '100%',
    maxWidth: 1100,
  },

  /* Appointment Cards */
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 18,
    gap: 14,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  appointmentCardSelected: {
    borderColor: '#00B894',
    borderWidth: 2,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 15,
    fontWeight: '800',
  },
  patientInfoCol: {
    flex: 1,
    gap: 2,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  patientAgeGender: {
    fontSize: 12,
    color: '#64748B',
  },
  patientSymptoms: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  statusPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeUpcoming: {
    backgroundColor: '#E6F8F4',
  },
  statusBadgeRescheduled: {
    backgroundColor: '#EDE9FE',
  },
  statusBadgeOverdue: {
    backgroundColor: '#FEE2E2',
  },
  statusPillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextCompleted: {
    color: '#15803D',
  },
  statusTextUpcoming: {
    color: '#00B894',
  },
  statusTextRescheduled: {
    color: '#7C3AED',
  },
  statusTextOverdue: {
    color: '#DC2626',
  },

  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeTagText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  inOneBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inOneText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },

  actionBtnsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rescheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rescheduleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00B894',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  acceptedBtnState: {
    backgroundColor: '#0A3066',
  },
  acceptBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  upcomingProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E6F8F4',
    borderWidth: 1,
    borderColor: '#00B894',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  upcomingProfileBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  awaitingAcceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  awaitingAcceptBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  overdueProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  overdueProfileBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  requestAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  requestAgainBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Empty state */
  emptyAppointmentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },
  emptySubText: {
    fontSize: 12,
    color: '#64748B',
  },

  /* ================================================================ */
  /* SLIDE-OVER DRAWER OVERLAY (RIGHT SIDE POP-UP AS SHOWN IN IMAGE)  */
  /* EXTENDS TILL CENTER OF SCREEN (50% WIDTH) WITH DIMMED BACKDROP   */
  /* ================================================================ */
  slideDrawerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  slideDrawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.58)', // Deep Dimmed background
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  },
  slideDrawerSheet: {
    width: '50%',
    minWidth: 540,
    maxWidth: 820,
    height: '100%',
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

  /* Top Navigation Row (matching the image) */
  drawerTopNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  drawerArrowsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerNavChevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCounterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 6,
  },
  drawerRightActionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drawerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCloseIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Header */
  wsHeader: {
    backgroundColor: '#061A3A',
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  wsHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  wsHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  wsHeaderModePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    gap: 5,
  },
  headerModeInPerson: {
    backgroundColor: '#0A3066',
    borderWidth: 1,
    borderColor: '#1D4ED8',
  },
  headerModeVideo: {
    backgroundColor: '#00897B',
    borderWidth: 1,
    borderColor: '#00B894',
  },
  headerModePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  wsHeaderSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },

  /* Scrollable Body */
  wsScrollBody: {
    flex: 1,
  },
  wsScrollContent: {
    padding: 20,
    gap: 14,
  },

  /* Status Banners */
  waitingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6FAF6',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 16,
    padding: 14,
  },
  pulseDotWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pulseDotOuter: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 184, 148, 0.25)',
  },
  pulseDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B894',
  },
  clinicArrivalBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF4FC',
    borderWidth: 1.5,
    borderColor: '#081E3E',
    borderRadius: 16,
    padding: 14,
  },
  clinicArrivalIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  waitingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },
  waitingTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B894',
  },
  waitingSubtitle: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  arrivalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },
  arrivalBadge: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  arrivalSubtitle: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },

  /* Detail Section Cards */
  detailSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  cardHeaderRowCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardHeaderIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#081E3E',
  },

  /* Grids */
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 3,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  paidBadge: {
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00B894',
  },
  paidBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#00B894',
  },

  /* Patient Profile Row */
  patientProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wsPatientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2F6',
    borderWidth: 2,
    borderColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wsPatientAvatarText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#081E3E',
  },
  wsPatientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  patientBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  miniBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
  },
  patientContact: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValueBold: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#081E3E',
  },
  clinicalSection: {
    marginTop: 10,
  },
  clinicalLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  allergyTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  conditionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  conditionTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00897B',
  },
  medsWrap: {
    gap: 6,
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  medItemText: {
    fontSize: 12.5,
    color: '#081E3E',
    fontWeight: '600',
  },

  /* Vitals */
  vitalsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  vitalBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vitalIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  vitalLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 3,
    textAlign: 'center',
  },
  vitalVal: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  vitalUnit: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#64748B',
  },
  vitalStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00B894',
    marginTop: 2,
  },

  /* Records Tab Track */
  recordsTabTrack: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  recordsTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  recordsTabBtnActive: {
    backgroundColor: '#081E3E',
  },
  recordsTabBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  recordsTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  recordsList: {
    gap: 10,
  },
  recordItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  recordItemDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  recordItemBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginTop: 2,
  },
  recordDoctorSign: {
    fontSize: 11,
    color: '#00897B',
    fontWeight: '700',
    marginTop: 5,
  },
  fileRecordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fileIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  fileMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  fileActionBtn: {
    backgroundColor: '#081E3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  fileActionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rxCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rxBadge: {
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  rxBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  rxDate: {
    fontSize: 11,
    color: '#64748B',
  },
  rxMedName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
    marginTop: 2,
  },
  rxInstructions: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 2,
  },

  /* History */
  historySubSection: {},
  historyTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 7,
  },
  historyTypeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  historyItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  historyTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  historyTypePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyDiagnosis: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },

  /* Privacy Documents */
  privacyCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    marginTop: -4,
  },
  requestDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#081E3E',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    gap: 6,
    marginBottom: 12,
  },
  requestDocBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  docListWrap: {
    gap: 8,
  },
  docItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docItemRequestedCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  docItemIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docItemName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  docItemMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  docItemNote: {
    fontSize: 11,
    color: '#92400E',
    fontStyle: 'italic',
    marginTop: 2,
  },
  docStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  docStatusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* Static Bottom Footer Actions */
  wsStaticFooter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.2,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wsFooterAcceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  wsFooterAcceptedBtnDisabled: {
    backgroundColor: '#E6FAF6',
    borderColor: '#00B894',
  },
  wsFooterAcceptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  wsFooterRescheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  wsFooterRescheduleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  wsFooterPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#081E3E',
    gap: 7,
  },
  wsFooterPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Modals Base (Center of Screen with Matched Theme) */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.52)', // Dimmed dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 20000,
  },
  modalCardBox: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  modalHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalHeadingText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  modalPatientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalPatientMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBody: {
    padding: 16,
    gap: 12,
  },
  modalFieldBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  modalFieldLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  modalFieldValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  vitalsRowGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  vitalMiniCell: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  vitalMiniTag: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  vitalMiniVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#081E3E',
  },

  /* Only OK Button for Upcoming Appointment Modal */
  modalActionsRowOnlyOk: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  modalOnlyOkBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#081E3E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOnlyOkBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Standard Modal Action Row */
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  modalBtnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalBtnSecondaryText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  modalBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#00B894',
  },
  modalBtnPrimaryText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Upcoming Highlight Box */
  upcomingHighlightBox: {
    backgroundColor: '#E6F8F4',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#00B894',
    padding: 14,
    gap: 6,
  },
  upcomingTimingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upcomingTimingTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00B894',
    textTransform: 'uppercase',
  },
  upcomingDateVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  upcomingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upcomingTimeVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  upcomingTypePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00B894',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  upcomingTypePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00B894',
  },

  /* Awaiting notice */
  awaitingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  awaitingNoticeCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  awaitingNoticePatient: {
    fontSize: 13,
    color: '#92400E',
  },
  awaitingNoticeTime: {
    fontSize: 13,
    color: '#92400E',
  },
  awaitingNoticeDescription: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
    marginTop: 4,
  },

  /* Overdue Highlight */
  overdueHighlightBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    padding: 14,
    gap: 4,
  },
  overdueSlotTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    textTransform: 'uppercase',
  },
  overdueSlotVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  overdueSlotSub: {
    fontSize: 11.5,
    color: '#7F1D1D',
    marginTop: 3,
  },

  /* ================================================================ */
  /* RESCHEDULE CALENDAR MODAL (CENTER OF SCREEN)                     */
  /* ================================================================ */
  calendarModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 14,
    padding: 20,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  calendarHeaderTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#081E3E',
  },
  calendarHeaderSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  calendarCloseBtn: {
    padding: 4,
  },
  calendarBodyRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  /* Left Vertical Nav */
  calendarLeftNav: {
    width: 62,
    alignItems: 'center',
    gap: 14,
    paddingTop: 6,
  },
  calendarNavItem: {
    width: 54,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    gap: 3,
  },
  calendarNavItemActive: {
    backgroundColor: '#E6FAF6',
  },
  calendarNavText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarNavTextActive: {
    color: '#00B894',
    fontWeight: '800',
  },
  /* Right Calendar Main */
  calendarRightArea: {
    flex: 1,
  },
  calendarMonthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarMonthChevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonthTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  calendarInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6FAF6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 14,
  },
  calendarInfoPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0D9488',
    flex: 1,
  },
  calendarWeekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  calendarWeekdayLabel: {
    width: 32,
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarDaysGrid: {
    gap: 6,
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarDayCell: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayCellSelected: {
    backgroundColor: '#081E3E',
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  calendarTimeSectionLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
    marginTop: 16,
    marginBottom: 8,
  },
  calendarTimeSlotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  calendarTimePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  calendarTimePillSelected: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  calendarTimePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  calendarTimePillTextSelected: {
    color: '#FFFFFF',
  },
  calendarFooterRow: {
    marginTop: 20,
  },
  calendarDoneBtn: {
    width: '100%',
    height: 46,
    backgroundColor: '#081E3E',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDoneBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Request Doc Modal */
  requestDocCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  modalHeaderRowNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  requestDocTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#081E3E',
  },
  requestDocSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  requestFieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  quickChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickChipActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  quickChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  quickChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  requestModalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#081E3E',
  },
  requestModalTextArea: {
    height: 65,
    textAlignVertical: 'top',
  },
  requestErrorText: {
    fontSize: 11.5,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 6,
  },
  requestModalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  requestCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestCancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  requestSubmitBtn: {
    flex: 1.5,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#081E3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  requestSubmitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ================================================================ */
  /* THEME-MATCHED IN-APP NOTIFICATION POP-UP IN CENTER               */
  /* ================================================================ */
  themeAlertCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  themeAlertIconCircle: {
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
  themeAlertTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  themeAlertMessage: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  themeAlertOkBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#081E3E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeAlertOkBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ================================================================ */
  /* IN-PERSON 4-STEP CONSULTATION WORKFLOW STYLES                    */
  /* ================================================================ */
  inPersonStepIndicatorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F274E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A8A',
  },
  inPersonStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.6,
  },
  inPersonStepItemActive: {
    opacity: 1,
  },
  inPersonStepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inPersonStepCircleActive: {
    backgroundColor: '#00B894',
  },
  inPersonStepCircleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
  },
  inPersonStepCircleTextActive: {
    color: '#FFFFFF',
  },
  inPersonStepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  inPersonStepLabelActive: {
    color: '#FFFFFF',
  },
  inPersonStepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#1E3A8A',
    marginHorizontal: 6,
  },
  inPersonStepLineActive: {
    backgroundColor: '#00B894',
  },

  /* Step Header */
  stepHeader: {
    backgroundColor: '#081E3E',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  stepHeaderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepBackBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepBadgePill: {
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    borderWidth: 1,
    borderColor: '#00B894',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stepBadgePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00B894',
  },
  stepHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepHeaderSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* Patient Brief Strip */
  patientBriefStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  briefAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  briefAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0284C7',
  },
  briefName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  briefMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  briefVitalsBadge: {
    backgroundColor: '#E6FAF6',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  briefVitalsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },

  /* Step Section Card */
  stepSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  stepCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  stepInputSingle: {
    height: 40,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#081E3E',
  },
  stepInputMultiline: {
    minHeight: 65,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#081E3E',
    textAlignVertical: 'top',
  },
  quickChipLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 8,
    marginBottom: 6,
  },
  quickChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickChipItemActive: {
    backgroundColor: '#E6FAF6',
    borderColor: '#00B894',
  },
  quickChipText: {
    fontSize: 11.5,
    color: '#334155',
    fontWeight: '600',
  },
  quickChipTextActive: {
    color: '#00B894',
    fontWeight: '700',
  },

  /* Vitals Row Grid */
  vitalsRowGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  vitalMiniBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    alignItems: 'center',
  },
  vitalMiniLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  vitalMiniVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#081E3E',
    marginTop: 2,
  },

  /* Search Dropdown Styles */
  searchDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
  },
  searchDropdownInput: {
    flex: 1,
    fontSize: 13,
    color: '#081E3E',
    marginLeft: 6,
  },
  searchDropdownChevronBtn: {
    padding: 4,
  },
  catalogDropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  catalogDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  catalogItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  catalogItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  catalogSelectPill: {
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catalogSelectPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },

  /* Form Helpers */
  fieldSubLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    marginTop: 6,
  },
  formRowTwoCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingTogglesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timingToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timingToggleBtnActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  timingToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  timingToggleTextActive: {
    color: '#FFFFFF',
  },
  foodTimingToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  foodTogglePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  foodTogglePillActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  foodToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  foodToggleTextActive: {
    color: '#FFFFFF',
  },
  addMedicineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#081E3E',
    marginTop: 14,
  },
  addMedicineActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Prescribed Item Cards */
  emptyListPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  emptyListText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginTop: 6,
  },
  emptyListSubText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  prescribedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  medIndexNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  prescribedMedName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#081E3E',
  },
  prescribedBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  medBadgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medBadgePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  deleteMedBtn: {
    padding: 8,
    marginLeft: 6,
  },

  /* Follow-up Modal Styles */
  followUpSummaryBanner: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
  },
  summaryBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  summaryBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#166534',
  },
  summaryCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  followUpDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 4,
  },
  followUpDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
    flex: 1,
    marginLeft: 8,
  },
  autoCalcBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  autoCalcBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
});
