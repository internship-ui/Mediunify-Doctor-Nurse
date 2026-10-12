import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme/colors';
import { patients } from '../data/mockData';
import RescheduleModal from '../components/RescheduleModal';

const COMMON_DOC_TYPES = [
  'Blood Test / CBC',
  'ECG 12-Lead Report',
  'Discharge Summary',
  'Prior Prescriptions',
  'X-Ray / MRI Imaging',
  'Lipid Profile',
];

export default function AppointmentDetailScreen({ navigation, route }) {
  const appointment = route?.params?.appointment || {
    id: 'a2',
    patientId: 'p2',
    patient: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    time: '11:30 AM',
    date: 'Today',
    type: 'In-Person',
    reason: 'Seasonal allergy symptoms',
    status: 'confirmed',
    fee: 500,
  };

  const mode = route?.params?.mode || appointment.type || 'In-Person';
  const isInPerson = mode === 'In-Person';

  const [accepted, setAccepted] = useState(appointment.status === 'confirmed');
  const [currentDate, setCurrentDate] = useState(appointment.date);
  const [currentTime, setCurrentTime] = useState(appointment.time);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);

  // Find detailed patient record
  const patientRecord =
    patients.find((p) => p.id === appointment.patientId) ||
    patients.find((p) => p.name === appointment.patient) ||
    patients[0];

  // Active sub-tab for Medical Records
  const [recordsTab, setRecordsTab] = useState('notes'); // 'notes' | 'reports' | 'prescriptions'

  // Privacy Documents State (already uploaded + requested)
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

  const handleStartConsultation = () => {
    if (isInPerson) {
      navigation.navigate('Consultation', {
        patientId: patientRecord.id,
        appointmentId: appointment.id,
      });
    } else {
      navigation.navigate('VideoConsultation', {
        patientId: patientRecord.id,
        appointmentId: appointment.id,
      });
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    Alert.alert(
      'Appointment Accepted',
      `Consultation with ${appointment.patient} is confirmed.`
    );
  };

  const handleReschedule = () => {
    setRescheduleModalVisible(true);
  };

  const handleConfirmReschedule = (rescheduledData) => {
    setCurrentDate(rescheduledData.date);
    setCurrentTime(rescheduledData.time);
    setRescheduleModalVisible(false);
    Alert.alert(
      'Consultation Rescheduled',
      `Appointment for ${appointment.patient} has been successfully rescheduled to ${rescheduledData.date} at ${rescheduledData.time}.${rescheduledData.reason ? '\n\nReason: ' + rescheduledData.reason : ''}${rescheduledData.note ? '\nNote: ' + rescheduledData.note : ''}`
    );
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

    setPrivacyDocs((prev) => [newDocRequest, ...prev]);
    setRequestModalVisible(false);
    setManualDocType('');
    setDocInstructions('');
    setDocError('');

    Alert.alert(
      'Document Requested',
      `A request for "${trimmed}" has been sent to ${appointment.patient}. They will receive an upload prompt on their app.`
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* ========================================================
          DARK NAVY SCREEN HEADER
      ======================================================== */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Appointment Details</Text>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() =>
              navigation.navigate('PatientProfile', {
                patientId: patientRecord.id,
              })
            }
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Mode Tag & Subtitle */}
        <View style={styles.headerMetaRow}>
          <View
            style={[
              styles.headerModePill,
              isInPerson ? styles.headerModeInPerson : styles.headerModeVideo,
            ]}
          >
            <Ionicons
              name={isInPerson ? 'business' : 'videocam'}
              size={13}
              color="#FFFFFF"
            />
            <Text style={styles.headerModePillText}>
              {isInPerson ? 'In-Person Consultation' : 'Video Consultation'}
            </Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Patient: {appointment.patient}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================
            STATUS BANNER (WAITING ROOM FOR VIDEO / ARRIVED FOR IN-PERSON)
        ======================================================== */}
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
                {appointment.patient} checked in at reception desk and is waiting in the clinic lounge.
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
                {appointment.patient} has joined the video consultation room and is waiting to connect.
              </Text>
            </View>
          </View>
        )}

        {/* ========================================================
            1. VISIT DETAILS (TODAY, TIMING, FEES, IN-PERSON / VIDEO)
        ======================================================== */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="calendar-outline" size={17} color="#071E42" />
            </View>
            <Text style={styles.cardHeaderTitle}>Visit Details</Text>
          </View>

          <View style={styles.gridRow}>
            {/* Visiting Date */}
            <View style={styles.gridItem}>
              <View style={[styles.gridIconWrap, { backgroundColor: '#E6FAF6' }]}>
                <Ionicons name="calendar" size={17} color="#00B894" />
              </View>
              <Text style={styles.gridLabel}>Visiting Date</Text>
              <Text style={styles.gridValue}>
                {currentDate === 'Today' ? 'Today, 30 Sep 2026' : currentDate}
              </Text>
            </View>

            {/* Timing */}
            <View style={styles.gridItem}>
              <View style={[styles.gridIconWrap, { backgroundColor: '#EEF4FC' }]}>
                <Ionicons name="time" size={17} color="#071E42" />
              </View>
              <Text style={styles.gridLabel}>Timing</Text>
              <Text style={styles.gridValue}>{currentTime || '11:30 AM'}</Text>
            </View>
          </View>

          <View style={[styles.gridRow, { marginTop: 12 }]}>
            {/* Mode: In-Person or Video */}
            <View style={styles.gridItem}>
              <View
                style={[
                  styles.gridIconWrap,
                  { backgroundColor: isInPerson ? '#EEF4FC' : '#E6FAF6' },
                ]}
              >
                <Ionicons
                  name={isInPerson ? 'business' : 'videocam'}
                  size={17}
                  color={isInPerson ? '#071E42' : '#00B894'}
                />
              </View>
              <Text style={styles.gridLabel}>Consultation Mode</Text>
              <Text style={styles.gridValue}>
                {isInPerson ? 'In-Person (Clinic)' : 'Video Consultation'}
              </Text>
            </View>

            {/* Fees */}
            <View style={styles.gridItem}>
              <View style={[styles.gridIconWrap, { backgroundColor: '#E6FAF6' }]}>
                <Ionicons name="wallet" size={17} color="#00B894" />
              </View>
              <Text style={styles.gridLabel}>Consultation Fees</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.gridValue}>₹{appointment.fee || 500}</Text>
                <View style={styles.paidBadge}>
                  <Text style={styles.paidBadgeText}>Paid</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================
            2. MEDICAL INFORMATION: NAME, GENDER, AGE, BLOOD GROUP,
               ALLERGIES, CURRENT MEDICINES, CHRONIC CONDITIONS
        ======================================================== */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="medkit-outline" size={17} color="#071E42" />
            </View>
            <Text style={styles.cardHeaderTitle}>Medical Information</Text>
          </View>

          {/* Profile Header */}
          <View style={styles.patientProfileRow}>
            <View style={styles.patientAvatar}>
              <Text style={styles.patientAvatarText}>
                {appointment.patient ? appointment.patient.charAt(0) : 'P'}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.patientName}>{appointment.patient}</Text>
              <View style={styles.patientBadgeRow}>
                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>
                    {appointment.age} yrs · {appointment.gender}
                  </Text>
                </View>
                <View style={[styles.miniBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.miniBadgeText, { color: '#B91C1C', fontWeight: '800' }]}>
                    🩸 {patientRecord.bloodGroup || 'B+'}
                  </Text>
                </View>
              </View>
              <Text style={styles.patientContact}>
                📞 {patientRecord.phone || '+91 98452 34567'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Reason for Visit */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reason for Visit:</Text>
            <Text style={styles.infoValueBold}>
              {appointment.reason || 'General medical follow-up'}
            </Text>
          </View>

          {/* Allergies */}
          <View style={styles.clinicalSection}>
            <Text style={styles.clinicalLabel}>Known Allergies</Text>
            <View style={styles.tagWrap}>
              {(patientRecord.allergies && patientRecord.allergies.length > 0
                ? patientRecord.allergies
                : ['None known']
              ).map((allergy, idx) => (
                <View key={`al-${idx}`} style={styles.allergyTag}>
                  <Ionicons name="warning-outline" size={14} color="#B45309" />
                  <Text style={styles.allergyTagText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Current Medicines */}
          <View style={styles.clinicalSection}>
            <Text style={styles.clinicalLabel}>Current Medicines</Text>
            <View style={styles.medsWrap}>
              {(patientRecord.medications && patientRecord.medications.length > 0
                ? patientRecord.medications
                : ['Amlodipine 5mg (1-0-0)', 'Paracetamol 650mg (SOS)']
              ).map((med, idx) => (
                <View key={`med-${idx}`} style={styles.medItem}>
                  <Ionicons name="medical" size={14} color="#071E42" />
                  <Text style={styles.medItemText}>{med}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Chronic Conditions */}
          <View style={styles.clinicalSection}>
            <Text style={styles.clinicalLabel}>Chronic Conditions</Text>
            <View style={styles.tagWrap}>
              {(patientRecord.conditions && patientRecord.conditions.length > 0
                ? patientRecord.conditions
                : ['Hypertension (Stage 1)']
              ).map((cond, idx) => (
                <View key={`cond-${idx}`} style={styles.conditionTag}>
                  <Ionicons name="pulse" size={14} color="#00897B" />
                  <Text style={styles.conditionTagText}>{cond}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ========================================================
            3. VITALS: BPM, BLOOD SUGAR, BLOOD PRESSURE
        ======================================================== */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="heart-pulse-outline" size={17} color="#071E42" />
            </View>
            <Text style={styles.cardHeaderTitle}>Patient Vitals</Text>
          </View>

          <View style={styles.vitalsRow}>
            {/* BPM */}
            <View style={styles.vitalBox}>
              <View style={[styles.vitalIconWrap, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="heart" size={16} color="#EF4444" />
              </View>
              <Text style={styles.vitalLabel}>Heart Rate (BPM)</Text>
              <Text style={styles.vitalVal}>
                {patientRecord.vitals?.bpm || 76} <Text style={styles.vitalUnit}>bpm</Text>
              </Text>
              <Text style={styles.vitalStatus}>Normal</Text>
            </View>

            {/* Blood Sugar */}
            <View style={styles.vitalBox}>
              <View style={[styles.vitalIconWrap, { backgroundColor: '#E6FAF6' }]}>
                <Ionicons name="water" size={16} color="#00B894" />
              </View>
              <Text style={styles.vitalLabel}>Blood Sugar</Text>
              <Text style={styles.vitalVal}>
                {patientRecord.vitals?.sugar ? patientRecord.vitals.sugar.split(' ')[0] : '98'}{' '}
                <Text style={styles.vitalUnit}>mg/dL</Text>
              </Text>
              <Text style={styles.vitalStatus}>Fasting</Text>
            </View>

            {/* BP */}
            <View style={styles.vitalBox}>
              <View style={[styles.vitalIconWrap, { backgroundColor: '#EEF4FC' }]}>
                <Ionicons name="speedometer" size={16} color="#071E42" />
              </View>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalVal}>
                {patientRecord.vitals?.bp || '122/80'}
              </Text>
              <Text style={styles.vitalStatus}>mmHg</Text>
            </View>
          </View>
        </View>

        {/* ========================================================
            4. MEDICAL RECORDS: CONSULTATION NOTES, LAB REPORTS, PRESCRIPTION
        ======================================================== */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="folder-open-outline" size={17} color="#071E42" />
            </View>
            <Text style={styles.cardHeaderTitle}>Medical Records</Text>
          </View>

          {/* Sub-Tabs for Medical Records */}
          <View style={styles.recordsTabTrack}>
            <TouchableOpacity
              style={[
                styles.recordsTabBtn,
                recordsTab === 'notes' && styles.recordsTabBtnActive,
              ]}
              onPress={() => setRecordsTab('notes')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="document-text-outline"
                size={14}
                color={recordsTab === 'notes' ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.recordsTabBtnText,
                  recordsTab === 'notes' && styles.recordsTabBtnTextActive,
                ]}
              >
                Notes (3)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recordsTabBtn,
                recordsTab === 'reports' && styles.recordsTabBtnActive,
              ]}
              onPress={() => setRecordsTab('reports')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="flask-outline"
                size={14}
                color={recordsTab === 'reports' ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.recordsTabBtnText,
                  recordsTab === 'reports' && styles.recordsTabBtnTextActive,
                ]}
              >
                Lab Reports (3)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recordsTabBtn,
                recordsTab === 'prescriptions' && styles.recordsTabBtnActive,
              ]}
              onPress={() => setRecordsTab('prescriptions')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="medkit-outline"
                size={14}
                color={recordsTab === 'prescriptions' ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.recordsTabBtnText,
                  recordsTab === 'prescriptions' && styles.recordsTabBtnTextActive,
                ]}
              >
                Prescription (3)
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

              <View style={styles.recordItemCard}>
                <View style={styles.recordItemHeader}>
                  <Text style={styles.recordItemTitle}>Annual Wellness Review</Text>
                  <Text style={styles.recordItemDate}>15 May 2026</Text>
                </View>
                <Text style={styles.recordItemBody}>
                  Routine systemic checkup. Vitals stable. Advised continuing regular lifestyle and hydration.
                </Text>
                <Text style={styles.recordDoctorSign}>Signed by Dr. Ananya Rao</Text>
              </View>
            </View>
          )}

          {recordsTab === 'reports' && (
            <View style={styles.recordsList}>
              <View style={styles.fileRecordCard}>
                <View style={styles.fileIconWrap}>
                  <Ionicons name="document-attach" size={20} color="#00B894" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.fileName}>ECG 12-Lead Diagnostic Strip</Text>
                  <Text style={styles.fileMeta}>15 Aug 2026 · Normal Sinus Rhythm</Text>
                </View>
                <TouchableOpacity
                  style={styles.fileActionBtn}
                  onPress={() => Alert.alert('Lab Report', 'Opening ECG 12-Lead Diagnostic Report.')}
                >
                  <Text style={styles.fileActionBtnText}>View</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fileRecordCard}>
                <View style={styles.fileIconWrap}>
                  <Ionicons name="document-attach" size={20} color="#00B894" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.fileName}>Complete Blood Count (CBC Panel)</Text>
                  <Text style={styles.fileMeta}>12 Aug 2026 · All metrics normal</Text>
                </View>
                <TouchableOpacity
                  style={styles.fileActionBtn}
                  onPress={() => Alert.alert('Lab Report', 'Opening CBC Panel Report.')}
                >
                  <Text style={styles.fileActionBtnText}>View</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fileRecordCard}>
                <View style={styles.fileIconWrap}>
                  <Ionicons name="document-attach" size={20} color="#00B894" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.fileName}>HbA1c & Fasting Plasma Glucose</Text>
                  <Text style={styles.fileMeta}>18 Aug 2026 · HbA1c: 6.2% (Good control)</Text>
                </View>
                <TouchableOpacity
                  style={styles.fileActionBtn}
                  onPress={() => Alert.alert('Lab Report', 'Opening HbA1c & Fasting Glucose Report.')}
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

              <View style={styles.rxCard}>
                <View style={styles.rxHeaderRow}>
                  <View style={styles.rxBadge}>
                    <Text style={styles.rxBadgeText}>Rx #2026-612</Text>
                  </View>
                  <Text style={styles.rxDate}>15 May 2026</Text>
                </View>
                <Text style={styles.rxMedName}>Tab. Multivitamin & Zinc</Text>
                <Text style={styles.rxInstructions}>1 tablet once daily after lunch · 30 Days</Text>
              </View>
            </View>
          )}
        </View>

        {/* ========================================================
            5. CONSULTATION HISTORY: IN-PERSON WITH DATE & VIDEO WITH DATE LISTS
        ======================================================== */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="time-outline" size={17} color="#071E42" />
            </View>
            <Text style={styles.cardHeaderTitle}>Consultation History</Text>
          </View>

          {/* Section: In-Person Consultation History with Dates */}
          <View style={styles.historySubSection}>
            <View style={styles.historyTypeHeader}>
              <Ionicons name="business" size={15} color="#071E42" />
              <Text style={styles.historyTypeTitle}>In-Person Visits with Dates</Text>
            </View>

            <View style={styles.historyItemCard}>
              <View style={styles.historyItemTop}>
                <Text style={styles.historyDate}>02 Jul 2026</Text>
                <View style={[styles.historyTypePill, { backgroundColor: '#EEF4FC' }]}>
                  <Text style={[styles.historyTypePillText, { color: '#071E42' }]}>
                    In-Person · Room 102
                  </Text>
                </View>
              </View>
              <Text style={styles.historyDiagnosis}>
                Diagnosis: Initial hypertension diagnosis & ECG evaluation
              </Text>
              <Text style={styles.historyAction}>
                Prescribed baseline medications and lifestyle guidelines.
              </Text>
            </View>

            <View style={styles.historyItemCard}>
              <View style={styles.historyItemTop}>
                <Text style={styles.historyDate}>15 May 2026</Text>
                <View style={[styles.historyTypePill, { backgroundColor: '#EEF4FC' }]}>
                  <Text style={[styles.historyTypePillText, { color: '#071E42' }]}>
                    In-Person · Room 104
                  </Text>
                </View>
              </View>
              <Text style={styles.historyDiagnosis}>
                Diagnosis: Routine annual health screening & physical examination
              </Text>
              <Text style={styles.historyAction}>
                All physical exams normal. Advised periodic vitals monitoring.
              </Text>
            </View>
          </View>

          {/* Section: Video Consultation History with Dates */}
          <View style={[styles.historySubSection, { marginTop: 16 }]}>
            <View style={styles.historyTypeHeader}>
              <Ionicons name="videocam" size={15} color="#00B894" />
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
              <Text style={styles.historyAction}>
                Reviewed home blood pressure log. Verified treatment response.
              </Text>
            </View>

            <View style={styles.historyItemCard}>
              <View style={styles.historyItemTop}>
                <Text style={styles.historyDate}>10 Jun 2026</Text>
                <View style={[styles.historyTypePill, { backgroundColor: '#E6FAF6' }]}>
                  <Text style={[styles.historyTypePillText, { color: '#00B894' }]}>
                    Video Call · 12 mins
                  </Text>
                </View>
              </View>
              <Text style={styles.historyDiagnosis}>
                Diagnosis: Seasonal allergy follow-up & symptom assessment
              </Text>
              <Text style={styles.historyAction}>
                Advised nasal spray and antihistamines as needed.
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================
            6. PRIVACY DOCUMENTS: ALREADY UPLOADED DOCUMENTS REQUEST
               & MANUAL DOCUMENT TYPE BY DOCTOR REQUEST DOCUMENT REPORT
        ======================================================== */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="shield-checkmark-outline" size={17} color="#071E42" />
            </View>
            <Text style={styles.cardHeaderTitle}>Privacy & Health Documents</Text>
          </View>

          <Text style={styles.privacyCardSubtitle}>
            End-to-end encrypted medical files and doctor record requests.
          </Text>

          {/* Action to Request Document Report */}
          <TouchableOpacity
            style={styles.requestDocBtn}
            onPress={() => setRequestModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="cloud-upload-outline" size={17} color="#FFFFFF" />
            <Text style={styles.requestDocBtnText}>Request Document Report</Text>
          </TouchableOpacity>

          {/* Document List (Uploaded + Doctor Requested) */}
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
                    doc.isRequested
                      ? { backgroundColor: '#FEF3C7' }
                      : { backgroundColor: '#E6FAF6' },
                  ]}
                >
                  <Ionicons
                    name={doc.isRequested ? 'hourglass-outline' : 'document-text'}
                    size={18}
                    color={doc.isRequested ? '#D97706' : '#00B894'}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.docItemName}>{doc.name}</Text>
                  <Text style={styles.docItemMeta}>
                    {doc.date} • {doc.size}
                  </Text>
                  {doc.note ? (
                    <Text style={styles.docItemNote}>Instructions: "{doc.note}"</Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.docStatusBadge,
                    doc.isRequested
                      ? { backgroundColor: '#FEF3C7' }
                      : { backgroundColor: '#E6FAF6' },
                  ]}
                >
                  <Text
                    style={[
                      styles.docStatusBadgeText,
                      doc.isRequested
                        ? { color: '#B45309' }
                        : { color: '#00B894' },
                    ]}
                  >
                    {doc.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Space at bottom for scrolling above fixed footer */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ========================================================
          BOTTOM ACTIONS FOOTER:
          - If In-Person: Start Consultation
          - If Video: Start Video Call
          - Reschedule and Accept buttons
      ======================================================== */}
      <View style={styles.footerActionsBar}>
        {/* Accept Button (disabled/green once accepted) */}
        <TouchableOpacity
          style={[styles.footerAcceptBtn, accepted && styles.footerAcceptedBtnDisabled]}
          onPress={handleAccept}
          disabled={accepted}
          activeOpacity={0.8}
        >
          <Ionicons
            name={accepted ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={18}
            color={accepted ? '#00B894' : '#071E42'}
          />
          <Text
            style={[
              styles.footerAcceptBtnText,
              accepted && { color: '#00B894' },
            ]}
          >
            {accepted ? 'Accepted' : 'Accept'}
          </Text>
        </TouchableOpacity>

        {/* Reschedule Button */}
        <TouchableOpacity
          style={styles.footerRescheduleBtn}
          onPress={handleReschedule}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={17} color="#475569" />
          <Text style={styles.footerRescheduleBtnText}>Reschedule</Text>
        </TouchableOpacity>

        {/* Primary Action Button (Start Consultation for In-Person, Start Video Call for Video) */}
        <TouchableOpacity
          style={styles.footerPrimaryBtn}
          onPress={handleStartConsultation}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isInPerson ? 'play' : 'videocam'}
            size={17}
            color="#FFFFFF"
          />
          <Text style={styles.footerPrimaryBtnText}>
            {isInPerson ? 'Star Consult' : 'Start Video Call'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ========================================================
          DOCTOR REQUEST DOCUMENT REPORT MODAL (MANUAL TYPE OR QUICK)
      ======================================================== */}
      <Modal
        visible={requestModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.requestDocCard}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Request Document Report</Text>
                <Text style={styles.modalSubtitle}>
                  Request patient to upload required records
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setRequestModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Quick Common Types */}
            <Text style={styles.modalFieldLabel}>Select Standard Document Type</Text>
            <View style={styles.quickChipsWrap}>
              {COMMON_DOC_TYPES.map((type) => {
                const isSelected = manualDocType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.quickChip,
                      isSelected && styles.quickChipActive,
                    ]}
                    onPress={() => handleSelectQuickDoc(type)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.quickChipText,
                        isSelected && styles.quickChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Manual Type by Doctor */}
            <Text style={[styles.modalFieldLabel, { marginTop: 14 }]}>
              Or Type Custom Document / Report Name
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Thyroid Panel (T3, T4, TSH), Chest X-Ray..."
              placeholderTextColor="#94A3B8"
              value={manualDocType}
              onChangeText={(t) => {
                setManualDocType(t);
                setDocError('');
              }}
            />

            {/* Doctor Instructions */}
            <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>
              Clinical Instructions / Note (Optional)
            </Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="e.g. Please upload latest fasting reports prior to consultation..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={docInstructions}
              onChangeText={setDocInstructions}
            />

            {docError ? <Text style={styles.modalErrorText}>{docError}</Text> : null}

            {/* Modal Actions */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRequestModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSendDocRequest}
                activeOpacity={0.85}
              >
                <Ionicons name="send" size={15} color="#FFFFFF" />
                <Text style={styles.modalSubmitBtnText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================
          RESCHEDULE APPOINTMENT MODAL (NAVY BLUE THEME)
      ======================================================== */}
      <RescheduleModal
        visible={rescheduleModalVisible}
        appointment={{
          ...appointment,
          date: currentDate,
          time: currentTime,
        }}
        onClose={() => setRescheduleModalVisible(false)}
        onConfirmReschedule={handleConfirmReschedule}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* Header */
  header: {
    backgroundColor: '#061A3A',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    paddingBottom: 18,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerModePill: {
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
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },

  scrollContent: {
    padding: spacing.lg,
  },

  /* Status Banners */
  waitingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6FAF6',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  pulseDotWrapper: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pulseDotOuter: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 184, 148, 0.25)',
  },
  pulseDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00B894',
  },
  clinicArrivalBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF4FC',
    borderWidth: 1.5,
    borderColor: '#071E42',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
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
    fontSize: 14.5,
    fontWeight: '700',
    color: '#071E42',
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
    fontSize: 14.5,
    fontWeight: '700',
    color: '#071E42',
  },
  arrivalBadge: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#071E42',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  arrivalSubtitle: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },

  /* Card Container */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#071E42',
  },

  /* Grid */
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#071E42',
  },
  paidBadge: {
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
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
  patientAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF2F6',
    borderWidth: 2,
    borderColor: '#071E42', // Navy Blue border
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#071E42', // Navy Blue text
  },
  patientName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#071E42',
  },
  patientBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  miniBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  miniBadgeText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
  },
  patientContact: {
    fontSize: 12.5,
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
    marginBottom: 3,
  },
  infoValueBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#071E42',
  },

  /* Clinical Information Section */
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
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
    borderRadius: 10,
    gap: 6,
  },
  medItemText: {
    fontSize: 13,
    color: '#071E42',
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
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vitalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  vitalLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
  },
  vitalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#071E42',
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

  /* Medical Records Tab Track */
  recordsTabTrack: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  recordsTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 12,
    gap: 4,
  },
  recordsTabBtnActive: {
    backgroundColor: '#071E42',
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
    borderRadius: 12,
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
    fontSize: 13.5,
    fontWeight: '700',
    color: '#071E42',
  },
  recordItemDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  recordItemBody: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginTop: 2,
  },
  recordDoctorSign: {
    fontSize: 11,
    color: '#00897B',
    fontWeight: '700',
    marginTop: 6,
  },
  fileRecordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  fileMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  fileActionBtn: {
    backgroundColor: '#071E42',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fileActionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rxCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
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
    borderRadius: 6,
  },
  rxBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
  },
  rxDate: {
    fontSize: 11,
    color: '#64748B',
  },
  rxMedName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#071E42',
    marginTop: 2,
  },
  rxInstructions: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },

  /* Consultation History */
  historySubSection: {},
  historyTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  historyTypeTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#071E42',
  },
  historyItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
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
    color: '#071E42',
  },
  historyTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  historyTypePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyDiagnosis: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 18,
  },
  historyAction: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
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
    backgroundColor: '#071E42',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 6,
    marginBottom: 14,
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
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docItemRequestedCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  docItemIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
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
    borderRadius: 8,
  },
  docStatusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* Footer Actions */
  footerActionsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.2,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerAcceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    gap: 5,
  },
  footerAcceptedBtnDisabled: {
    backgroundColor: '#E6FAF6',
    borderColor: '#00B894',
  },
  footerAcceptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  footerRescheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  footerRescheduleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  footerPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 14,
    backgroundColor: '#071E42', // Dark Navy Blue primary
    gap: 6,
  },
  footerPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  requestDocCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#071E42',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalFieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  quickChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  quickChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#071E42',
  },
  modalTextArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  modalErrorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 6,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSubmitBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#071E42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalSubmitBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
