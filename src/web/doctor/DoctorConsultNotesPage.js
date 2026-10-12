import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';
import ResponseModal from '../components/ResponseModal';

export default function DoctorConsultNotesPage({
  selectedConsultation,
  setActiveTab,
}) {
  // Patient info derived from selected appointment or default
  const patient = {
    name: selectedConsultation?.name || selectedConsultation?.patient || 'Priya Sharma',
    age: selectedConsultation?.age || 35,
    gender: selectedConsultation?.gender || 'Female',
    bloodGroup: selectedConsultation?.bloodGroup || 'O+',
    allergies: selectedConsultation?.allergies || 'None known',
    medications: selectedConsultation?.medications || 'None recorded',
    initials: selectedConsultation?.initials || (selectedConsultation?.name ? selectedConsultation.name.charAt(0) : 'P'),
    visitType: selectedConsultation?.type || 'In-Person',
  };

  // Follow-Up Form State
  const [followUpEnabled, setFollowUpEnabled] = useState(true);
  const [followUpDate, setFollowUpDate] = useState('07 Oct 2026');
  const [followUpType, setFollowUpType] = useState('Video'); // 'Video' | 'In-Person'

  // Consultation Notes State
  const [chiefComplaint, setChiefComplaint] = useState(
    selectedConsultation?.reason || 'Persistent seasonal allergy symptoms and nasal congestion'
  );
  const [symptoms, setSymptoms] = useState('Mild dry cough, sneezing episodes in morning, clear rhinorrhea');
  const [diagnosis, setDiagnosis] = useState('Allergic Rhinitis with mild pharyngeal irritation');
  const [treatmentPlan, setTreatmentPlan] = useState(
    'Prescribed antihistamine and nasal spray for 5 days. Steam inhalation twice daily. Follow up if symptoms worsen.'
  );

  // Prescription Drawer/Modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([
    { name: 'Levocetirizine 5mg', dosage: '1 tablet', timing: 'Night after food', duration: '5 days' },
    { name: 'Fluticasone Nasal Spray', dosage: '1 puff each nostril', timing: 'Morning & Night', duration: '7 days' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tab');
  const [newMedTiming, setNewMedTiming] = useState('After food');
  const [newMedDuration, setNewMedDuration] = useState('5 days');

  // Lab Tests Drawer/Modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTests, setSelectedTests] = useState(['Complete Blood Count (CBC)', 'Absolute Eosinophil Count']);
  const ALL_TESTS = [
    'Complete Blood Count (CBC)',
    'Absolute Eosinophil Count',
    'Serum IgE Level',
    'Chest X-Ray (PA View)',
    'Allergy Skin Prick Panel',
    'RBS (Random Blood Sugar)',
  ];

  // Response Screen Popup
  const [responseModal, setResponseModal] = useState({
    visible: false,
    title: '',
    message: '',
    details: null,
    type: 'success',
    onCloseAction: null,
  });

  const showResponse = (title, message, details = null, type = 'success', onCloseAction = null) => {
    setResponseModal({
      visible: true,
      title,
      message,
      details,
      type,
      onCloseAction,
    });
  };

  const handleSaveFollowUp = () => {
    showResponse(
      'Follow-Up Scheduled',
      `Follow-up visit for ${patient.name} has been booked.`,
      [
        `Patient: ${patient.name} (${patient.age} yrs · ${patient.gender})`,
        `Follow-Up Date: ${followUpDate}`,
        `Consultation Mode: ${followUpType}`,
        'Patient Notification: Sent via SMS & WhatsApp calendar reminder',
      ],
      'success'
    );
  };

  const handleSaveDraft = () => {
    showResponse(
      'Consultation Notes Saved as Draft',
      'The clinical notes, diagnosis, and treatment plan have been safely preserved in the patient record.',
      [
        `Patient: ${patient.name}`,
        `Complaint: ${chiefComplaint || 'Recorded'}`,
        `Diagnosis: ${diagnosis || 'Drafted'}`,
        'Status: Draft · You can resume and finalize anytime',
      ],
      'info'
    );
  };

  const handleComplete = () => {
    showResponse(
      'Consultation Completed Successfully',
      `Clinical consultation with ${patient.name} has been finalized and signed.`,
      [
        `Patient: ${patient.name} (${patient.gender}, ${patient.age} yrs)`,
        `Diagnosis: ${diagnosis || 'Allergic Rhinitis'}`,
        `Treatment Plan: ${treatmentPlan || 'Recorded'}`,
        `Prescription: ${prescriptions.length} medicine(s) generated`,
        `Tests Ordered: ${selectedTests.length > 0 ? selectedTests.join(', ') : 'None'}`,
        `Follow-Up: ${followUpEnabled ? `${followUpDate} (${followUpType})` : 'Not required'}`,
        'Status: Closed & Synced to MediUnify Central EHR',
      ],
      'success',
      () => setActiveTab('appointments')
    );
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    setPrescriptions(prev => [
      ...prev,
      {
        name: newMedName.trim(),
        dosage: newMedDosage,
        timing: newMedTiming,
        duration: newMedDuration,
      },
    ]);
    setNewMedName('');
  };

  const toggleTest = (testName) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter(t => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
    }
  };

  return (
    <View style={styles.pageRoot}>
      {/* 1. TOP HEADER (Deep Navy Header Matching Screenshot) */}
      <View style={styles.topHeader}>
        {/* Left: Back Button & Logo */}
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity
            style={styles.backCircleBtn}
            onPress={() => setActiveTab('appointments')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={17} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandGroup}>
            <WebLogo size={28} style={styles.brandLogoBox} />
            <Text style={styles.brandTitle}>
              Medi<Text style={styles.brandAccent}>Unify</Text>
            </Text>
          </View>
        </View>

        {/* Center: Consultation Title & Patient Name */}
        <View style={styles.headerCenterGroup}>
          <Text style={styles.headerTitle}>Consultation</Text>
          <Text style={styles.headerPatientSub}>{patient.name}</Text>
        </View>

        {/* Right: Phone, Bell & Profile */}
        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={styles.headerIconCircle}
            onPress={() => alert(`Calling patient ${patient.name}...`)}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={15} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconCircle}
            onPress={() => alert('No new notifications')}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerAvatarBadge}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.headerAvatarText}>AR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* CARD 1: Follow-Up */}
        <View style={styles.card}>
          <View style={styles.followUpHeaderRow}>
            <Text style={styles.cardTitle}>Schedule a follow-up for this patient</Text>
            <Switch
              value={followUpEnabled}
              onValueChange={setFollowUpEnabled}
              trackColor={{ false: '#CBD5E1', true: '#00B894' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {followUpEnabled && (
            <View style={styles.followUpBody}>
              {/* Date Input */}
              <TouchableOpacity
                style={styles.datePickerInput}
                onPress={() => {
                  const dates = ['Tomorrow', '3 Days later', '1 Week later (13 Oct)', '15 Oct 2026'];
                  const next = dates[(dates.indexOf(followUpDate) + 1) % dates.length] || dates[0];
                  setFollowUpDate(next);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.datePickerLeft}>
                  <Ionicons name="calendar-outline" size={16} color="#64748B" />
                  <Text style={styles.datePickerText}>
                    {followUpDate ? `Follow-up date: ${followUpDate}` : 'Select follow-up date (tap for calendar)'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </TouchableOpacity>

              {/* Segmented Selector: Video vs In-Person */}
              <View style={styles.channelSegmentRow}>
                <TouchableOpacity
                  style={[
                    styles.channelSegmentBtn,
                    followUpType === 'Video' && styles.channelSegmentBtnActive,
                  ]}
                  onPress={() => setFollowUpType('Video')}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.channelSegmentText,
                      followUpType === 'Video' && styles.channelSegmentTextActive,
                    ]}
                  >
                    Video
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.channelSegmentBtn,
                    followUpType === 'In-Person' && styles.channelSegmentBtnActive,
                  ]}
                  onPress={() => setFollowUpType('In-Person')}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.channelSegmentText,
                      followUpType === 'In-Person' && styles.channelSegmentTextActive,
                    ]}
                  >
                    In-Person
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Save Follow-Up Button Bar */}
              <TouchableOpacity
                style={styles.saveFollowUpBtn}
                onPress={handleSaveFollowUp}
                activeOpacity={0.88}
              >
                <View style={styles.saveFollowUpLeft}>
                  <Ionicons name="calendar" size={16} color="#FFFFFF" />
                  <Text style={styles.saveFollowUpText}>Save Follow-Up</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* CARD 2: Patient Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Patient Details</Text>

          <View style={styles.patientRow}>
            <View style={styles.patientAvatarCircle}>
              <Text style={styles.patientAvatarLetter}>{patient.initials}</Text>
            </View>

            <View style={styles.patientMetaCol}>
              <Text style={styles.patientNameText}>{patient.name}</Text>
              <Text style={styles.patientMetaSub}>
                {patient.age} yrs · {patient.gender} · {patient.bloodGroup}
              </Text>
            </View>
          </View>

          <View style={styles.patientFieldRow}>
            <Text style={styles.fieldSmallLabel}>Known Allergies</Text>
            <Text style={styles.fieldValueText}>{patient.allergies}</Text>
          </View>

          <View style={styles.patientFieldRow}>
            <Text style={styles.fieldSmallLabel}>Current Medications</Text>
            <Text style={styles.fieldValueText}>{patient.medications}</Text>
          </View>
        </View>

        {/* CARD 3: Consultation Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Consultation Notes</Text>

          {/* 1. Chief Complaint */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Chief Complaint</Text>
            <TextInput
              style={styles.textInputBox}
              value={chiefComplaint}
              onChangeText={setChiefComplaint}
              placeholder="What is the patient presenting with?"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* 2. Symptoms */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Symptoms</Text>
            <TextInput
              style={styles.textInputBox}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Describe symptoms observed / reported"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* 3. Diagnosis / Clinical Perception */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Diagnosis / Clinical Perception</Text>
            <TextInput
              style={styles.textInputBox}
              value={diagnosis}
              onChangeText={setDiagnosis}
              placeholder="Clinical diagnosis"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* 4. Treatment Plan */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Treatment Plan</Text>
            <TextInput
              style={styles.textInputBox}
              value={treatmentPlan}
              onChangeText={setTreatmentPlan}
              placeholder="Add treatment plan and clinical notes"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* 4. QUICK ACTION PILLS (Add Prescription & Test Requirement) */}
        <View style={styles.quickActionsRow}>
          {/* Add Prescription Pill */}
          <TouchableOpacity
            style={styles.quickActionPill}
            onPress={() => setShowPrescriptionModal(true)}
            activeOpacity={0.85}
          >
            <View style={styles.quickActionLeft}>
              <Ionicons name="receipt-outline" size={17} color="#0284C7" />
              <Text style={styles.quickActionText}>
                Add Prescription ({prescriptions.length})
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color="#0284C7" />
          </TouchableOpacity>

          {/* Test Requirement Pill */}
          <TouchableOpacity
            style={styles.quickActionPill}
            onPress={() => setShowTestModal(true)}
            activeOpacity={0.85}
          >
            <View style={styles.quickActionLeft}>
              <Ionicons name="flask-outline" size={17} color="#0284C7" />
              <Text style={styles.quickActionText}>
                Test Requirement ({selectedTests.length})
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color="#0284C7" />
          </TouchableOpacity>
        </View>

        {/* 5. BOTTOM ACTION BUTTONS (Save Draft & Complete) */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.saveDraftBtn}
            onPress={handleSaveDraft}
            activeOpacity={0.85}
          >
            <Text style={styles.saveDraftBtnText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.completeBtn}
            onPress={handleComplete}
            activeOpacity={0.88}
          >
            <Text style={styles.completeBtnText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* PRESCRIPTION DRAWER / MODAL */}
      <Modal visible={showPrescriptionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add e-Prescription</Text>
                <Text style={styles.modalSub}>Patient: {patient.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPrescriptionModal(false)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            {/* List of current medicines */}
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              {prescriptions.map((med, idx) => (
                <View key={idx} style={styles.medRowItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medNameText}>{med.name}</Text>
                    <Text style={styles.medMetaText}>{med.dosage} · {med.timing} · {med.duration}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}
                  >
                    <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Add new medicine */}
            <View style={styles.addMedForm}>
              <TextInput
                style={styles.medInput}
                placeholder="Medicine Name (e.g. Paracetamol 650mg)"
                value={newMedName}
                onChangeText={setNewMedName}
              />
              <View style={styles.medInputRow}>
                <TextInput
                  style={[styles.medInput, { flex: 1 }]}
                  placeholder="Dosage (1 tab)"
                  value={newMedDosage}
                  onChangeText={setNewMedDosage}
                />
                <TextInput
                  style={[styles.medInput, { flex: 1 }]}
                  placeholder="Duration (5 days)"
                  value={newMedDuration}
                  onChangeText={setNewMedDuration}
                />
              </View>
              <TouchableOpacity style={styles.addMedSubmitBtn} onPress={handleAddMedicine}>
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.addMedSubmitBtnText}>Add to Prescription</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setShowPrescriptionModal(false)}
            >
              <Text style={styles.modalDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LAB TEST REQUIREMENT MODAL */}
      <Modal visible={showTestModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Test Requirement</Text>
                <Text style={styles.modalSub}>Select diagnostic tests for {patient.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowTestModal(false)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 280, marginVertical: 12 }}>
              {ALL_TESTS.map((test, idx) => {
                const isSelected = selectedTests.includes(test);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.testCheckItem, isSelected && styles.testCheckItemActive]}
                    onPress={() => toggleTest(test)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isSelected ? '#00B894' : '#94A3B8'}
                    />
                    <Text style={[styles.testCheckText, isSelected && styles.testCheckTextActive]}>
                      {test}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setShowTestModal(false)}
            >
              <Text style={styles.modalDoneBtnText}>Confirm Tests ({selectedTests.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RESPONSE SCREEN MODAL WITH OK BUTTON */}
      <ResponseModal
        visible={responseModal.visible}
        title={responseModal.title}
        message={responseModal.message}
        details={responseModal.details}
        type={responseModal.type}
        buttonText="OK"
        onOk={() => {
          const action = responseModal.onCloseAction;
          setResponseModal(prev => ({ ...prev, visible: false }));
          if (action) action();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pageRoot: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  // Top Header
  topHeader: {
    height: 64,
    backgroundColor: '#081E3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 3,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  brandAccent: {
    color: '#00B894',
  },
  headerCenterGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerPatientSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  headerAvatarBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Scroll Container
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },

  // Generic Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },

  // Follow-Up Card
  followUpHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  followUpBody: {
    gap: 12,
    marginTop: 2,
  },
  datePickerInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  datePickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  datePickerText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  channelSegmentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  channelSegmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelSegmentBtnActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  channelSegmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#081E3E',
  },
  channelSegmentTextActive: {
    color: '#FFFFFF',
  },
  saveFollowUpBtn: {
    backgroundColor: '#081E3E',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveFollowUpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveFollowUpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Patient Details Card
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  patientAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  patientAvatarLetter: {
    fontSize: 15,
    fontWeight: '700',
    color: '#081E3E',
  },
  patientMetaCol: {
    gap: 2,
  },
  patientNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },
  patientMetaSub: {
    fontSize: 12,
    color: '#64748B',
  },
  patientFieldRow: {
    gap: 2,
  },
  fieldSmallLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  fieldValueText: {
    fontSize: 12,
    color: '#081E3E',
    fontWeight: '500',
  },

  // Consultation Notes Card
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#081E3E',
  },
  textInputBox: {
    borderWidth: 1,
    borderColor: '#081E3E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#081E3E',
    backgroundColor: '#FFFFFF',
  },

  // Quick Action Pills
  quickActionsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  quickActionPill: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },

  // Bottom Buttons Row
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  saveDraftBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00B894',
  },
  completeBtn: {
    flex: 1,
    backgroundColor: '#081E3E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
  },
  medRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  medMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
  addMedForm: {
    gap: 8,
    marginTop: 6,
  },
  medInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#081E3E',
  },
  medInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addMedSubmitBtn: {
    backgroundColor: '#081E3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addMedSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalDoneBtn: {
    backgroundColor: '#00B894',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  testCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testCheckItemActive: {
    borderColor: '#00B894',
    backgroundColor: '#E8F8F5',
  },
  testCheckText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  testCheckTextActive: {
    color: '#081E3E',
    fontWeight: '700',
  },
});
