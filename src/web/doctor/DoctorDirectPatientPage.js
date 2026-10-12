import React, { useState } from 'react';
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

export default function DoctorDirectPatientPage({ setActiveTab }) {
  // Toggle between 'add' (+ Add Direct Patient) and 'list' (Direct Patients Lists)
  const [activeToggle, setActiveToggle] = useState('add'); // 'add' | 'list'

  // Pre-seeded Direct Patients List (matching the screenshot showing "(2)")
  const [directPatients, setDirectPatients] = useState([
    {
      id: 'dp-1',
      name: 'Kavya Srinivas',
      phone: '+91 98860 12345',
      age: '32',
      gender: 'Female',
      bloodGroup: 'B+',
      consultNotes: 'Mild allergic rhinitis and dry nocturnal cough for 3 days. Throat mildly congested, lungs clear.',
      reports: ['Allergy_Panel_Summary.pdf'],
      prescription: 'Tab. Montelukast 10mg (OD at night x 5 days)\nSteam inhalation twice daily\nWarm salt water gargle',
      whatsappSent: true,
      whatsappSentTime: 'Today, 10:15 AM',
      initials: 'KS',
      avatarBg: '#E0E7FF',
      avatarColor: '#3730A3',
    },
    {
      id: 'dp-2',
      name: 'Ramesh Verma',
      phone: '+91 97412 88901',
      age: '45',
      gender: 'Male',
      bloodGroup: 'O+',
      consultNotes: 'Routine post-meal glycemic check. Mild fatigue after prolonged work hours. BP 130/84 mmHg.',
      reports: ['HbA1c_Fasting_Lab.pdf'],
      prescription: 'Tab. Metformin 500mg (BD after meals x 30 days)\nTab. Telmisartan 40mg (OD morning after food)',
      whatsappSent: true,
      whatsappSentTime: 'Today, 11:45 AM',
      initials: 'RV',
      avatarBg: '#E6FAF6',
      avatarColor: '#00B894',
    },
  ]);

  // Form State for "Add Direct Patient"
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male'); // 'Male' | 'Female' | 'Other'
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [showBloodDropdown, setShowBloodDropdown] = useState(false);
  const [consultNotes, setConsultNotes] = useState('');
  const [uploadedReports, setUploadedReports] = useState([]);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  // Form validation error state
  const [formError, setFormError] = useState('');

  // WhatsApp Notification Popup Modal State
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [latestPatientSummary, setLatestPatientSummary] = useState(null);

  // Prescribe Typing Modal State (Accessible from Direct Patients List)
  const [prescribeModalTarget, setPrescribeModalTarget] = useState(null);
  const [prescribeText, setPrescribeText] = useState('');
  const [prescribeSuccessModal, setPrescribeSuccessModal] = useState(null);

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Handle Attach Report (Simulated upload)
  const handleAttachReport = () => {
    const reportOptions = [
      'Lab_CBC_Biochemistry.pdf',
      'Diagnostic_Scan_Report.jpg',
      'Blood_Glucose_Panel.pdf',
      'ECG_12_Lead_Tracing.pdf',
    ];
    const randomReport = reportOptions[uploadedReports.length % reportOptions.length];
    if (!uploadedReports.includes(randomReport)) {
      setUploadedReports(prev => [...prev, randomReport]);
    }
  };

  const handleRemoveReport = (nameToRemove) => {
    setUploadedReports(prev => prev.filter(r => r !== nameToRemove));
  };

  // Handle Direct Patient Submit
  const handleSubmitDirectPatient = () => {
    if (!fullName.trim()) {
      setFormError('Please enter the patient full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setFormError('Please enter the mobile phone number for WhatsApp notification.');
      return;
    }

    setFormError('');

    const names = fullName.trim().split(' ');
    const initials = names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0].slice(0, 2).toUpperCase();

    const newPatient = {
      id: `dp-${Date.now()}`,
      name: fullName.trim(),
      phone: phoneNumber.trim().startsWith('+91') ? phoneNumber.trim() : `+91 ${phoneNumber.trim()}`,
      age: age.trim() || '30',
      gender,
      bloodGroup,
      consultNotes: consultNotes.trim() || 'Direct walk-in consultation completed.',
      reports: uploadedReports,
      prescription: prescriptionNotes.trim() || 'Prescription notes not provided.',
      whatsappSent: true,
      whatsappSentTime: 'Just now',
      initials,
      avatarBg: '#E6FAF6',
      avatarColor: '#00B894',
    };

    setDirectPatients(prev => [newPatient, ...prev]);
    setLatestPatientSummary(newPatient);

    // Reset Form
    setFullName('');
    setPhoneNumber('');
    setAge('');
    setConsultNotes('');
    setUploadedReports([]);
    setPrescriptionNotes('');

    // Trigger WhatsApp notification popup modal
    setWhatsappModalVisible(true);
  };

  // Open Prescribe Modal for an existing patient
  const handleOpenPrescribeModal = (patient) => {
    setPrescribeModalTarget(patient);
    setPrescribeText(patient.prescription || '');
  };

  // Send typed prescription via WhatsApp
  const handleSendPrescriptionViaWhatsapp = () => {
    if (!prescribeModalTarget) return;

    // Update patient prescription in state
    setDirectPatients(prev =>
      prev.map(p =>
        p.id === prescribeModalTarget.id
          ? {
              ...p,
              prescription: prescribeText.trim(),
              whatsappSent: true,
              whatsappSentTime: 'Just now (Updated Rx)',
            }
          : p
      )
    );

    const targetPatient = prescribeModalTarget;
    setPrescribeModalTarget(null);
    setPrescribeSuccessModal({
      name: targetPatient.name,
      phone: targetPatient.phone,
      rxSummary: prescribeText.trim(),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ============================================================== */}
      {/* 1. TOP HEADER                                                  */}
      {/* ============================================================== */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Direct patient</Text>
          <Text style={styles.pageSubtitle}>
            Register walk-in consultations, record clinical notes, and dispatch digital prescriptions via WhatsApp.
          </Text>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 2. TOGGLES MATCHING USER SCREENSHOT                            */}
      {/* [ + Add Direct Patient ]   [ Direct Patients Lists (2) ]       */}
      {/* ============================================================== */}
      <View style={styles.togglesContainer}>
        {/* Toggle 1: + Add Direct Patient */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            activeToggle === 'add' ? styles.toggleBtnActive : styles.toggleBtnInactive,
          ]}
          onPress={() => setActiveToggle('add')}
          activeOpacity={0.85}
        >
          <Ionicons
            name="person-add"
            size={16}
            color={activeToggle === 'add' ? '#FFFFFF' : '#081E3E'}
          />
          <Text
            style={[
              styles.toggleBtnText,
              activeToggle === 'add' ? styles.toggleBtnTextActive : styles.toggleBtnTextInactive,
            ]}
          >
            + Add Direct Patient
          </Text>
        </TouchableOpacity>

        {/* Toggle 2: Direct Patients Lists */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            activeToggle === 'list' ? styles.toggleBtnActive : styles.toggleBtnInactive,
          ]}
          onPress={() => setActiveToggle('list')}
          activeOpacity={0.85}
        >
          <Ionicons
            name="people"
            size={17}
            color={activeToggle === 'list' ? '#FFFFFF' : '#081E3E'}
          />
          <Text
            style={[
              styles.toggleBtnText,
              activeToggle === 'list' ? styles.toggleBtnTextActive : styles.toggleBtnTextInactive,
            ]}
          >
            Direct Patients Lists ({directPatients.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================== */}
      {/* 3. VIEW A: ADD DIRECT PATIENT FORM                             */}
      {/* ============================================================== */}
      {activeToggle === 'add' && (
        <View style={styles.formCard}>
          <View style={styles.formCardHeader}>
            <View style={styles.formCardHeaderIconWrap}>
              <Ionicons name="create-outline" size={20} color="#00B894" />
            </View>
            <View>
              <Text style={styles.formCardTitle}>Direct Patient Registration & Consult</Text>
              <Text style={styles.formCardSubtitle}>
                Complete patient vitals, diagnosis, and prescription details. A WhatsApp notification will be automatically generated upon submission.
              </Text>
            </View>
          </View>

          {/* Error Banner */}
          {!!formError && (
            <View style={styles.formErrorBanner}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          )}

          {/* Row 1: Full Name & Phone Number */}
          <View style={styles.formRowTwoCol}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Full Name <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={16} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor="#94A3B8"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Phone Number (WhatsApp) <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. +91 98860 12345"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>
          </View>

          {/* Row 2: Age, Gender, Blood Group */}
          <View style={styles.formRowThreeCol}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>Age</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 34"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
            </View>

            {/* Gender Selection */}
            <View style={[styles.formGroup, { flex: 1.5 }]}>
              <Text style={styles.formLabel}>Gender</Text>
              <View style={styles.genderPillsGroup}>
                {['Male', 'Female', 'Other'].map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderPill,
                      gender === g && styles.genderPillActive,
                    ]}
                    onPress={() => setGender(g)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.genderPillText,
                        gender === g && styles.genderPillTextActive,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Blood Group Dropdown */}
            <View style={[styles.formGroup, { flex: 1.2, position: 'relative', zIndex: 100 }]}>
              <Text style={styles.formLabel}>Blood Group</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setShowBloodDropdown(!showBloodDropdown)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownBtnText}>{bloodGroup}</Text>
                <Ionicons name="chevron-down" size={15} color="#081E3E" />
              </TouchableOpacity>

              {showBloodDropdown && (
                <View style={styles.dropdownMenu}>
                  {BLOOD_GROUPS.map(bg => (
                    <TouchableOpacity
                      key={bg}
                      style={[
                        styles.dropdownMenuItem,
                        bloodGroup === bg && styles.dropdownMenuItemActive,
                      ]}
                      onPress={() => {
                        setBloodGroup(bg);
                        setShowBloodDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownMenuText,
                          bloodGroup === bg && styles.dropdownMenuTextActive,
                        ]}
                      >
                        {bg}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Row 3: Consult Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Consult Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Type chief complaints, observed symptoms, vitals (BP/pulse), and clinical diagnosis..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={consultNotes}
              onChangeText={setConsultNotes}
            />
          </View>

          {/* Row 4: Upload Medical Reports (Not much required - clean dropzone) */}
          <View style={styles.formGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.formLabel}>Upload Medical Reports (Optional)</Text>
              <Text style={styles.optionalNote}>Diagnostic scans, previous prescriptions, or lab panels</Text>
            </View>

            <TouchableOpacity
              style={styles.uploadDropzone}
              onPress={handleAttachReport}
              activeOpacity={0.8}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#00B894" />
              <Text style={styles.uploadDropzoneTitle}>Click to Attach Medical Document / Report</Text>
              <Text style={styles.uploadDropzoneSubtitle}>Supports PDF, JPG, PNG formats up to 10MB</Text>
            </TouchableOpacity>

            {uploadedReports.length > 0 && (
              <View style={styles.attachedFilesList}>
                {uploadedReports.map(file => (
                  <View key={file} style={styles.attachedFileChip}>
                    <Ionicons name="document-attach" size={14} color="#00B894" />
                    <Text style={styles.attachedFileName}>{file}</Text>
                    <TouchableOpacity onPress={() => handleRemoveReport(file)}>
                      <Ionicons name="close-circle" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Row 5: Prescription / Treatment Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Prescription / Treatment Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. Tab. Paracetamol 650mg TDS x 3 days, Tab. Cetirizine 10mg OD at night..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={prescriptionNotes}
              onChangeText={setPrescriptionNotes}
            />
          </View>

          {/* Form Action Submit Button */}
          <View style={styles.formSubmitRow}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmitDirectPatient}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Submit & Send WhatsApp Notification</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ============================================================== */}
      {/* 4. VIEW B: DIRECT PATIENTS LISTS                               */}
      {/* ============================================================== */}
      {activeToggle === 'list' && (
        <View style={styles.listContainer}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listHeaderTitle}>
              Direct Patients ({directPatients.length})
            </Text>
            <Text style={styles.listHeaderSub}>
              All walk-in patients registered with live WhatsApp notification logs.
            </Text>
          </View>

          {directPatients.length === 0 ? (
            <View style={styles.emptyListCard}>
              <Ionicons name="people-outline" size={42} color="#94A3B8" />
              <Text style={styles.emptyListTitle}>No Direct Patients Registered Yet</Text>
              <Text style={styles.emptyListSub}>
                Click "+ Add Direct Patient" toggle to register your first walk-in patient.
              </Text>
            </View>
          ) : (
            <View style={styles.patientCardsGrid}>
              {directPatients.map((patient) => (
                <View key={patient.id} style={styles.patientProfileCard}>
                  {/* Card Header: Avatar + Meta */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardProfileInfo}>
                      <View style={[styles.cardAvatar, { backgroundColor: patient.avatarBg }]}>
                        <Text style={[styles.cardAvatarText, { color: patient.avatarColor }]}>
                          {patient.initials}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.cardPatientName}>{patient.name}</Text>
                        <Text style={styles.cardPatientMeta}>
                          {patient.gender} • {patient.age} yrs • Blood Group:{' '}
                          <Text style={{ fontWeight: '800', color: '#081E3E' }}>{patient.bloodGroup}</Text>
                        </Text>
                      </View>
                    </View>

                    {/* WhatsApp Sent Live Status Badge */}
                    <View style={styles.whatsappSentBadge}>
                      <Ionicons name="logo-whatsapp" size={13} color="#16A34A" />
                      <Text style={styles.whatsappSentBadgeText}>WhatsApp Sent</Text>
                    </View>
                  </View>

                  {/* Phone & Contact Row */}
                  <View style={styles.cardPhoneRow}>
                    <Ionicons name="call-outline" size={13} color="#64748B" />
                    <Text style={styles.cardPhoneText}>{patient.phone}</Text>
                    <Text style={styles.cardTimeText}>• Dispatched: {patient.whatsappSentTime}</Text>
                  </View>

                  {/* Consult Notes Box */}
                  <View style={styles.cardNotesBox}>
                    <View style={styles.cardBoxHeader}>
                      <Ionicons name="document-text-outline" size={13} color="#081E3E" />
                      <Text style={styles.cardBoxTitle}>Consult Notes</Text>
                    </View>
                    <Text style={styles.cardBoxBodyText} numberOfLines={3}>
                      {patient.consultNotes}
                    </Text>
                  </View>

                  {/* Medical Reports Box if attached */}
                  {patient.reports && patient.reports.length > 0 && (
                    <View style={styles.cardReportsBox}>
                      <Ionicons name="attach" size={13} color="#00B894" />
                      <Text style={styles.cardReportsText}>
                        {patient.reports.length} Report Attached: {patient.reports.join(', ')}
                      </Text>
                    </View>
                  )}

                  {/* Current Prescription Box */}
                  <View style={styles.cardPrescriptionBox}>
                    <View style={styles.cardBoxHeader}>
                      <Ionicons name="medkit-outline" size={13} color="#00B894" />
                      <Text style={[styles.cardBoxTitle, { color: '#00B894' }]}>Prescription / Treatment</Text>
                    </View>
                    <Text style={styles.cardPrescriptionText} numberOfLines={3}>
                      {patient.prescription}
                    </Text>
                  </View>

                  {/* Card Bottom Action Bar: WhatsApp status note + Prescribe button */}
                  <View style={styles.cardBottomActionBar}>
                    <View style={styles.whatsappDispatchRow}>
                      <Ionicons name="checkmark-done" size={15} color="#16A34A" />
                      <Text style={styles.whatsappDispatchText}>WhatsApp notification delivered</Text>
                    </View>

                    {/* Prescribe Button -> Opens Prescribe Typing Modal */}
                    <TouchableOpacity
                      style={styles.cardPrescribeBtn}
                      onPress={() => handleOpenPrescribeModal(patient)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="create-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.cardPrescribeBtnText}>Prescribe</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL 1: WHATSAPP NOTIFICATION SENT CONFIRMATION POPUP      */}
      {/* (TRIGGERED ON FORM SUBMISSION)                                 */}
      {/* ============================================================== */}
      <Modal visible={whatsappModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* WhatsApp Green Icon Circle */}
            <View style={styles.modalWhatsappIconCircle}>
              <Ionicons name="logo-whatsapp" size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.modalTitle}>WhatsApp Notification Sent!</Text>

            {latestPatientSummary && (
              <View style={styles.modalSummaryBox}>
                <Text style={styles.modalSummaryPatientName}>
                  Patient: {latestPatientSummary.name} ({latestPatientSummary.gender}, {latestPatientSummary.age} y.o.)
                </Text>
                <Text style={styles.modalSummaryPhone}>
                  📱 Dispatched to WhatsApp Number: <Text style={{ fontWeight: '800' }}>{latestPatientSummary.phone}</Text>
                </Text>
                <View style={styles.modalSummaryDivider} />
                <Text style={styles.modalSummaryRxTitle}>Included in WhatsApp Message:</Text>
                <Text style={styles.modalSummaryRxText}>• Clinical Consultation Summary & Notes</Text>
                <Text style={styles.modalSummaryRxText}>• Digital Prescription & Medication Dosage</Text>
                <Text style={styles.modalSummaryRxText}>• Direct Doctor Follow-up & Care Instructions</Text>
              </View>
            )}

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalOkBtn}
                onPress={() => {
                  setWhatsappModalVisible(false);
                  setActiveToggle('list'); // Direct to list tab to see new patient
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalOkBtnText}>OK • View in Patients List</Text>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 6. MODAL 2: PRESCRIBE TYPING MODAL (SEND VIA WHATSAPP)         */}
      {/* ============================================================== */}
      <Modal visible={!!prescribeModalTarget} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxWidth: 540 }]}>
            <View style={styles.prescribeModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.prescribeIconBadge}>
                  <Ionicons name="medkit" size={18} color="#00B894" />
                </View>
                <View>
                  <Text style={styles.prescribeModalTitle}>
                    Prescribe for {prescribeModalTarget?.name}
                  </Text>
                  <Text style={styles.prescribeModalSubtitle}>
                    WhatsApp: {prescribeModalTarget?.phone} • {prescribeModalTarget?.gender}, {prescribeModalTarget?.age} y.o.
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setPrescribeModalTarget(null)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Quick Medicine Suggestions Chips */}
            <View style={styles.quickMedChipsRow}>
              <Text style={styles.quickMedLabel}>Quick Add:</Text>
              {[
                'Tab. Paracetamol 650mg TDS',
                'Tab. Amoxicillin 500mg BD',
                'Tab. Pantoprazole 40mg OD',
                'Tab. Cetirizine 10mg OD',
              ].map(med => (
                <TouchableOpacity
                  key={med}
                  style={styles.quickMedChip}
                  onPress={() => {
                    setPrescribeText(prev => prev ? `${prev}\n${med}` : med);
                  }}
                >
                  <Text style={styles.quickMedChipText}>+ {med.split(' ')[1]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Typing Box */}
            <View style={styles.prescribeInputBox}>
              <Text style={styles.prescribeBoxLabel}>Type Prescription & Dosage Instructions</Text>
              <TextInput
                style={styles.prescribeTextArea}
                placeholder="Type medicines, dosage timings (morning/afternoon/night), food instructions, and duration..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={5}
                value={prescribeText}
                onChangeText={setPrescribeText}
              />
            </View>

            {/* Modal Bottom Actions */}
            <View style={styles.prescribeActionsRow}>
              <TouchableOpacity
                style={styles.prescribeCancelBtn}
                onPress={() => setPrescribeModalTarget(null)}
              >
                <Text style={styles.prescribeCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.prescribeSendWhatsappBtn}
                onPress={handleSendPrescriptionViaWhatsapp}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-whatsapp" size={17} color="#FFFFFF" />
                <Text style={styles.prescribeSendWhatsappText}>Send via WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 7. MODAL 3: PRESCRIBE WHATSAPP SENT CONFIRMATION               */}
      {/* ============================================================== */}
      <Modal visible={!!prescribeSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalWhatsappIconCircle}>
              <Ionicons name="checkmark-done" size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.modalTitle}>Prescription Sent via WhatsApp!</Text>
            <Text style={styles.modalSubMessage}>
              The updated prescription has been transmitted to{' '}
              <Text style={{ fontWeight: '800', color: '#081E3E' }}>
                {prescribeSuccessModal?.name}
              </Text>{' '}
              at{' '}
              <Text style={{ fontWeight: '800', color: '#16A34A' }}>
                {prescribeSuccessModal?.phone}
              </Text>
              .
            </Text>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalOkBtn}
                onPress={() => setPrescribeSuccessModal(null)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalOkBtnText}>OK • Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    gap: 20,
    maxWidth: 1200,
  },

  /* HEADER */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    marginTop: 4,
    fontWeight: '500',
  },

  /* TOGGLES MATCHING USER SCREENSHOT */
  togglesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 4,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 9999, // Pill shape
    borderWidth: 1.5,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  toggleBtnActive: {
    backgroundColor: '#081E3E', // Navy active
    borderColor: '#081E3E',
    shadowColor: '#081E3E',
  },
  toggleBtnInactive: {
    backgroundColor: '#FFFFFF', // White inactive
    borderColor: '#CBD5E1',
    shadowColor: '#CBD5E1',
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  toggleBtnTextInactive: {
    color: '#081E3E',
  },

  /* FORM CARD */
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    gap: 18,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  formCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formCardHeaderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
  },
  formCardSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 720,
    lineHeight: 18,
  },
  formErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
    padding: 10,
    borderRadius: 10,
  },
  formErrorText: {
    fontSize: 12.5,
    color: '#DC2626',
    fontWeight: '600',
  },
  formRowTwoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  formRowThreeCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'flex-start',
  },
  formGroup: {
    flex: 1,
    minWidth: 240,
    gap: 6,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  requiredStar: {
    color: '#DC2626',
    fontWeight: '800',
  },
  optionalNote: {
    fontSize: 11.5,
    color: '#64748B',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    fontSize: 13.5,
    color: '#081E3E',
    outlineWidth: 0,
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 13.5,
    color: '#081E3E',
    minHeight: 85,
    textAlignVertical: 'top',
    outlineWidth: 0,
  },

  /* GENDER PILLS */
  genderPillsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  genderPill: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderPillActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  genderPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  genderPillTextActive: {
    color: '#FFFFFF',
  },

  /* BLOOD GROUP DROPDOWN */
  dropdownBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  dropdownBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    padding: 4,
  },
  dropdownMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownMenuItemActive: {
    backgroundColor: '#E6FAF6',
  },
  dropdownMenuText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  dropdownMenuTextActive: {
    color: '#00B894',
    fontWeight: '800',
  },

  /* UPLOAD DROPZONE */
  uploadDropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#00B894',
    backgroundColor: '#F0FDF9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadDropzoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  uploadDropzoneSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  attachedFilesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  attachedFileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  attachedFileName: {
    fontSize: 12,
    color: '#081E3E',
    fontWeight: '600',
  },

  /* SUBMIT BUTTON */
  formSubmitRow: {
    marginTop: 6,
    alignItems: 'flex-start',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#081E3E',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  /* LIST VIEW */
  listContainer: {
    gap: 16,
  },
  listHeaderRow: {
    gap: 4,
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
  },
  listHeaderSub: {
    fontSize: 12.5,
    color: '#64748B',
  },
  emptyListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyListTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  emptyListSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  /* PATIENT CARDS IN LIST */
  patientCardsGrid: {
    gap: 16,
  },
  patientProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 12,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardProfileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardPatientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  cardPatientMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  whatsappSentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  whatsappSentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  cardPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardPhoneText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  cardTimeText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  cardNotesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardBoxTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#081E3E',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cardBoxBodyText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  cardReportsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF9',
    padding: 8,
    borderRadius: 8,
  },
  cardReportsText: {
    fontSize: 11.5,
    color: '#047857',
    fontWeight: '600',
  },
  cardPrescriptionBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  cardPrescriptionText: {
    fontSize: 12.5,
    color: '#166534',
    lineHeight: 18,
    fontWeight: '500',
  },
  cardBottomActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexWrap: 'wrap',
  },
  whatsappDispatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  whatsappDispatchText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '700',
  },
  cardPrescribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#081E3E',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9,
  },
  cardPrescribeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* MODALS COMMON */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backdropFilter: 'blur(4px)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  modalWhatsappIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#25D366', // WhatsApp green
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#081E3E',
    textAlign: 'center',
  },
  modalSubMessage: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
  },
  modalSummaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalSummaryPatientName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalSummaryPhone: {
    fontSize: 12.5,
    color: '#047857',
  },
  modalSummaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  modalSummaryRxTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },
  modalSummaryRxText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  modalActionsRow: {
    width: '100%',
    marginTop: 6,
  },
  modalOkBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#081E3E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalOkBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* PRESCRIBE TYPING MODAL */
  prescribeModalHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  prescribeIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prescribeModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  prescribeModalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  quickMedChipsRow: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  quickMedLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  quickMedChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickMedChipText: {
    fontSize: 11,
    color: '#081E3E',
    fontWeight: '600',
  },
  prescribeInputBox: {
    width: '100%',
    gap: 6,
  },
  prescribeBoxLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  prescribeTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#081E3E',
    minHeight: 110,
    textAlignVertical: 'top',
    outlineWidth: 0,
  },
  prescribeActionsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  prescribeCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  prescribeCancelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  prescribeSendWhatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#25D366', // WhatsApp green
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  prescribeSendWhatsappText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
