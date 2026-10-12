import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';

export default function DoctorConsultationPage({
  selectedConsultation,
  setActiveTab,
}) {
  const [activeTabSub, setActiveTabSub] = useState('patient'); // 'patient' | 'tests' | 'notes' | 'prescription'
  const [callDuration, setCallDuration] = useState(1394); // 23:14 in seconds
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDocRequestModal, setShowDocRequestModal] = useState(false);
  const [showReportPreviewModal, setShowReportPreviewModal] = useState(false);
  const [requestedDocName, setRequestedDocName] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'Rohan Mehta', text: 'Good morning Dr. Rao, can you hear me clearly?', time: '10:30 AM' },
    { sender: 'You', text: 'Good morning Rohan, yes loud and clear! Let us review your BP readings.', time: '10:31 AM' },
  ]);

  // Form states for clinical workstation
  const [chiefComplaints, setChiefComplaints] = useState('Mild headaches in the evening this week, routine BP checkup.');
  const [clinicalNotes, setClinicalNotes] = useState('Routine BP review. S1, S2 heard normal. Chest clear bilaterally. Vitals stable. Advised low sodium diet.');
  const [diagnosis, setDiagnosis] = useState('Essential Stage 1 Hypertension — controlled with pharmacotherapy');
  const [adviceNotes, setAdviceNotes] = useState('Limit salt intake to < 5g/day. Regular 30 min morning walk. Avoid caffeine in the evening.');
  const [selectedTests, setSelectedTests] = useState(['Lipid Profile', 'Serum Creatinine']);
  const [prescriptions, setPrescriptions] = useState([
    { name: 'Amlodipine 5mg', dosage: '1 tablet', freq: 'OD (Once Daily)', timing: 'Morning after food', duration: '14 days' },
    { name: 'Telmisartan 40mg', dosage: '1 tablet', freq: 'OD (Once Daily)', timing: 'Night after food', duration: '14 days' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tablet');
  const [newMedFreq, setNewMedFreq] = useState('OD');

  // Live Call Timer incrementing
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const patient = {
    name: selectedConsultation?.patient || 'Rohan Mehta',
    age: 34,
    gender: 'Male',
    phone: '+91 98860 11234',
    bloodGroup: 'B+',
    status: 'Follow-up',
    reason: 'Routine BP review. Mild headaches in the evening this week.',
    visitTiming: 'Today, 10:30 AM',
    fee: '₹450',
    visitType: 'Video Consultation',
    vitals: {
      bp: '138 / 88',
      weight: '72 kg',
      bpm: '74 bpm',
      bloodSugar: '110 mg/dL',
      spo2: '99%',
      temp: '98.4 °F',
    },
    allergies: 'None reported',
    visitsCount: '6 total',
    chronicConditions: 'Stage 1 Essential Hypertension',
    currentMedicines: 'Amlodipine 5mg (OD), Telmisartan 40mg (OD)',
    uploadedReports: [
      { id: 'rep-1', title: 'Lab report - Comprehensive Metabolic Panel', date: '22 Sep', type: 'PDF' },
      { id: 'rep-2', title: 'Previous Prescription', date: '4 Sep', type: 'PDF' },
    ],
    privacyDocuments: [
      { id: 'doc-1', title: 'Government ID · Aadhaar', status: 'Verified', date: '10 Aug' },
      { id: 'doc-2', title: 'Medical Insurance Card', status: 'Active', date: '10 Aug' },
    ],
    consultationHistory: [
      { date: '22 Sep', mode: 'Video', reason: 'BP review · Prescribed Telmisartan' },
      { date: '4 Sep', mode: 'In-person', reason: 'Routine check · Blood panel ordered' },
      { date: '12 Aug', mode: 'Video', reason: 'Initial diagnosis & prescription renewal' },
    ],
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end this consultation call?')) {
      alert('Consultation call ended. Notes and summary preserved.');
      setActiveTab('appointments');
    }
  };

  const handleCompleteConsultation = () => {
    alert(`Consultation finalized and e-prescription sent to ${patient.name} via SMS and WhatsApp!`);
    setActiveTab('appointments');
  };

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { sender: 'You', text: chatMessage.trim(), time: 'Just now' }]);
    setChatMessage('');
  };

  const handleRequestDocument = () => {
    if (!requestedDocName.trim()) return;
    alert(`Document request for "${requestedDocName}" sent to ${patient.name}! Patient can upload immediately via patient app.`);
    setShowDocRequestModal(false);
    setRequestedDocName('');
  };

  const addMedicine = () => {
    if (!newMedName.trim()) return;
    setPrescriptions([...prescriptions, {
      name: newMedName.trim(),
      dosage: newMedDosage,
      freq: newMedFreq,
      timing: 'After food',
      duration: '14 days',
    }]);
    setNewMedName('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* 1. Top Navbar matching Screenshot */}
      <View style={styles.topNavbar}>
        {/* Left: Back to Appointments */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setActiveTab('appointments')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={15} color="#FFFFFF" />
          <Text style={styles.backBtnText}>Appointments</Text>
        </TouchableOpacity>

        {/* Center: MediUnify Brand Logo */}
        <View style={styles.brandRow}>
          <WebLogo size={32} style={styles.brandLogoBox} />
          <Text style={styles.brandTitle}>Medi<Text style={styles.brandAccent}>Unify</Text></Text>
        </View>

        {/* Right: In consultation + Timer */}
        <View style={styles.topRightControls}>
          <View style={styles.inConsultationPill}>
            <View style={styles.greenLiveDot} />
            <Text style={styles.inConsultationText}>In consultation</Text>
          </View>
          <Text style={styles.timerText}>{formatTime(callDuration)}</Text>
        </View>
      </View>

      {/* 2. Main Video Stream Area (Deep Navy Screen) */}
      <View style={styles.videoStreamContainer}>
        {/* Top-Left Patient Overlay */}
        <View style={styles.patientOverlayTopLeft}>
          <View style={styles.overlayAvatar}>
            <Text style={styles.overlayAvatarText}>RM</Text>
          </View>
          <View>
            <Text style={styles.overlayPatientName}>{patient.name}, {patient.age}</Text>
            <Text style={styles.overlayPatientSub}>Follow-up · BP review</Text>
          </View>
        </View>

        {/* Top-Right Network Badge + PIP Self View */}
        <View style={styles.overlayTopRightCol}>
          <View style={styles.connectionBadge}>
            <Ionicons name="cellular-outline" size={12} color="#00B894" />
            <Text style={styles.connectionText}>Good connection</Text>
          </View>

          {/* Picture-in-Picture Doctor Self View */}
          <View style={styles.pipSelfViewBox}>
            <View style={styles.pipAvatarCircle}>
              <Text style={styles.pipAvatarText}>AR</Text>
            </View>
            <Text style={styles.pipLabel}>You</Text>
            {isVideoOff && (
              <View style={styles.cameraOffOverlay}>
                <Ionicons name="videocam-off" size={16} color="#DC2626" />
              </View>
            )}
          </View>
        </View>

        {/* Center Patient Avatar Silhouette / Video Feed */}
        <View style={styles.centerVideoTarget}>
          <View style={styles.silhouetteHead} />
          <View style={styles.silhouetteBody} />
        </View>

        {/* Bottom-Left Patient Name Pill */}
        <View style={styles.bottomLeftNamePill}>
          <Ionicons name="person" size={12} color="#CBD5E1" />
          <Text style={styles.bottomLeftNameText}>{patient.name}</Text>
        </View>

        {/* Bottom Control Actions Bar */}
        <View style={styles.callControlsRow}>
          {/* Mic */}
          <TouchableOpacity
            style={[styles.callControlCircle, isMicMuted && styles.controlCircleMuted]}
            onPress={() => setIsMicMuted(!isMicMuted)}
          >
            <Ionicons name={isMicMuted ? 'mic-off' : 'mic'} size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Camera */}
          <TouchableOpacity
            style={[styles.callControlCircle, isVideoOff && styles.controlCircleMuted]}
            onPress={() => setIsVideoOff(!isVideoOff)}
          >
            <Ionicons name={isVideoOff ? 'videocam-off' : 'videocam'} size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Screen Share */}
          <TouchableOpacity
            style={[styles.callControlCircle, isScreenSharing && styles.controlCircleActive]}
            onPress={() => {
              setIsScreenSharing(!isScreenSharing);
              alert(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing active. Patient can view clinical dossier.');
            }}
          >
            <Ionicons name="share-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* In-Call Chat */}
          <TouchableOpacity
            style={styles.callControlCircle}
            onPress={() => setShowChatModal(true)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* More options */}
          <TouchableOpacity
            style={styles.callControlCircle}
            onPress={() => alert('Call Settings: Audio Source, HD Video, Background Blur available.')}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity
            style={styles.endCallBtn}
            onPress={handleEndCall}
            activeOpacity={0.85}
          >
            <Ionicons name="call" size={16} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
            <Text style={styles.endCallBtnText}>End call</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Bottom Clinician Dossier & Workstation Container */}
      <View style={styles.workstationCard}>
        {/* Navigation Tabs Header */}
        <View style={styles.workstationTabsBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTabSub === 'patient' && styles.tabBtnActive]}
            onPress={() => setActiveTabSub('patient')}
          >
            <Ionicons
              name="person-outline"
              size={15}
              color={activeTabSub === 'patient' ? '#00B894' : '#64748B'}
            />
            <Text style={[styles.tabBtnText, activeTabSub === 'patient' && styles.tabBtnTextActive]}>
              Patient
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTabSub === 'tests' && styles.tabBtnActive]}
            onPress={() => setActiveTabSub('tests')}
          >
            <Ionicons
              name="flask-outline"
              size={15}
              color={activeTabSub === 'tests' ? '#00B894' : '#64748B'}
            />
            <Text style={[styles.tabBtnText, activeTabSub === 'tests' && styles.tabBtnTextActive]}>
              Tests
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTabSub === 'notes' && styles.tabBtnActive]}
            onPress={() => setActiveTabSub('notes')}
          >
            <Ionicons
              name="document-text-outline"
              size={15}
              color={activeTabSub === 'notes' ? '#00B894' : '#64748B'}
            />
            <Text style={[styles.tabBtnText, activeTabSub === 'notes' && styles.tabBtnTextActive]}>
              Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTabSub === 'prescription' && styles.tabBtnActive]}
            onPress={() => setActiveTabSub('prescription')}
          >
            <Ionicons
              name="medkit-outline"
              size={15}
              color={activeTabSub === 'prescription' ? '#00B894' : '#64748B'}
            />
            <Text style={[styles.tabBtnText, activeTabSub === 'prescription' && styles.tabBtnTextActive]}>
              Prescription
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTabSub === 'notes'
                ? { backgroundColor: '#0284C7', borderColor: '#0284C7', borderWidth: 1, marginLeft: 'auto' }
                : { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD', borderWidth: 1, marginLeft: 'auto' },
            ]}
            onPress={() => setActiveTabSub('notes')}
          >
            <Ionicons
              name="document-text"
              size={15}
              color={activeTabSub === 'notes' ? '#FFFFFF' : '#0284C7'}
            />
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTabSub === 'notes' ? '#FFFFFF' : '#0284C7', fontWeight: '700' },
              ]}
            >
              Consult Notes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Patient Details */}
        {activeTabSub === 'patient' && (
          <View style={styles.tabBodyContent}>
            {/* Patient Header Row */}
            <View style={styles.patientProfileRow}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>RM</Text>
              </View>
              <View style={styles.profileMetaCol}>
                <Text style={styles.profileName}>{patient.name}</Text>
                <Text style={styles.profileSub}>
                  {patient.age} yrs · {patient.gender} · {patient.phone} · Blood Group: <Text style={styles.bloodTagBold}>{patient.bloodGroup}</Text>
                </Text>
              </View>
              <View style={styles.followUpBadgePill}>
                <Text style={styles.followUpBadgeText}>{patient.status}</Text>
              </View>
            </View>

            {/* Visit Details Row (Today, Timing, Fees, Video) */}
            <View style={styles.visitDetailsRow}>
              <View style={styles.visitChip}>
                <Ionicons name="calendar-outline" size={13} color="#00B894" />
                <Text style={styles.visitChipText}>{patient.visitTiming}</Text>
              </View>

              <View style={styles.visitChip}>
                <Ionicons name="videocam-outline" size={13} color="#00B894" />
                <Text style={styles.visitChipText}>{patient.visitType}</Text>
              </View>

              <View style={styles.visitChip}>
                <Ionicons name="cash-outline" size={13} color="#00B894" />
                <Text style={styles.visitChipText}>Fee: {patient.fee}</Text>
              </View>
            </View>

            {/* 4 Metric Boxes (Vitals) */}
            <View style={styles.vitalsGrid}>
              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Blood pressure</Text>
                <Text style={styles.vitalValue}>{patient.vitals.bp}</Text>
              </View>

              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Weight</Text>
                <Text style={styles.vitalValue}>{patient.vitals.weight}</Text>
              </View>

              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Heart rate (BPM)</Text>
                <Text style={styles.vitalValue}>{patient.vitals.bpm}</Text>
              </View>

              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Blood sugar</Text>
                <Text style={styles.vitalValue}>{patient.vitals.bloodSugar}</Text>
              </View>

              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Allergies</Text>
                <Text style={styles.vitalValue}>{patient.allergies}</Text>
              </View>

              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Visits</Text>
                <Text style={styles.vitalValue}>{patient.visitsCount}</Text>
              </View>
            </View>

            {/* Medical Information: Chronic conditions & Current medicines */}
            <View style={styles.medicalInfoCard}>
              <Text style={styles.sectionHeaderTitle}>Medical Information</Text>
              <View style={styles.medInfoTwoCol}>
                <View style={styles.medInfoCol}>
                  <Text style={styles.medInfoLabel}>Chronic Conditions</Text>
                  <Text style={styles.medInfoValue}>{patient.chronicConditions}</Text>
                </View>

                <View style={styles.medInfoCol}>
                  <Text style={styles.medInfoLabel}>Current Medicines</Text>
                  <Text style={styles.medInfoValue}>{patient.currentMedicines}</Text>
                </View>
              </View>
            </View>

            {/* Reason for Visit */}
            <View style={styles.sectionGroup}>
              <Text style={styles.sectionHeaderTitle}>Reason for visit</Text>
              <View style={styles.reasonBox}>
                <Text style={styles.reasonText}>{patient.reason}</Text>
              </View>
            </View>

            {/* Uploaded Reports & Medical Records */}
            <View style={styles.sectionGroup}>
              <View style={styles.sectionHeaderBetween}>
                <Text style={styles.sectionHeaderTitle}>Uploaded reports & Medical records</Text>
                <TouchableOpacity onPress={() => setShowReportPreviewModal(true)}>
                  <Text style={styles.viewHistoryLink}>View all (2)</Text>
                </TouchableOpacity>
              </View>

              {patient.uploadedReports.map(rep => (
                <View key={rep.id} style={styles.reportRow}>
                  <View style={styles.docIconBox}>
                    <Ionicons name="document-text-outline" size={18} color="#00B894" />
                  </View>
                  <View style={styles.reportMeta}>
                    <Text style={styles.reportTitle}>{rep.title}</Text>
                    <Text style={styles.reportSub}>{rep.date} · {rep.type}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewReportBtn}
                    onPress={() => setShowReportPreviewModal(true)}
                  >
                    <Text style={styles.viewReportBtnText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Privacy Documents & Doctor Document Request */}
            <View style={styles.sectionGroup}>
              <View style={styles.sectionHeaderBetween}>
                <Text style={styles.sectionHeaderTitle}>Privacy Documents</Text>
                <TouchableOpacity
                  style={styles.requestDocActionBtn}
                  onPress={() => setShowDocRequestModal(true)}
                >
                  <Ionicons name="add-circle-outline" size={14} color="#00B894" />
                  <Text style={styles.requestDocActionText}>Request document from patient</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.privacyDocsList}>
                {patient.privacyDocuments.map(doc => (
                  <View key={doc.id} style={styles.privacyDocRow}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#00B894" />
                    <Text style={styles.privacyDocTitle}>{doc.title}</Text>
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedBadgeText}>{doc.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Consultation History (In-Person with date & Video with date) */}
            <View style={styles.sectionGroup}>
              <Text style={styles.sectionHeaderTitle}>Previous visits & Consultation history</Text>
              <View style={styles.historyTimelineList}>
                {patient.consultationHistory.map((hist, i) => (
                  <View key={i} style={styles.historyTimelineItem}>
                    <View style={styles.timelineDot} />
                    <Text style={styles.historyDate}>{hist.date}</Text>
                    <View style={styles.modeBadgeSmall}>
                      <Text style={styles.modeBadgeSmallText}>{hist.mode}</Text>
                    </View>
                    <Text style={styles.historyReason}>{hist.reason}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomWorkstationActions}>
              <TouchableOpacity
                style={styles.previewBtn}
                onPress={() => alert('Opening consultation dossier preview sheet.')}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-outline" size={16} color="#0A2342" />
                <Text style={styles.previewBtnText}>Preview</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.completeBtn}
                onPress={handleCompleteConsultation}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-done" size={17} color="#FFFFFF" />
                <Text style={styles.completeBtnText}>Complete consultation</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tab 2: Tests */}
        {activeTabSub === 'tests' && (
          <View style={styles.tabBodyContent}>
            <Text style={styles.sectionHeaderTitle}>Select Diagnostic Tests</Text>
            <Text style={styles.sectionSub}>Recommended laboratory and radiological examinations for this consultation</Text>

            <View style={styles.testsListGrid}>
              {[
                'Complete Blood Count (CBC) with Platelets',
                'Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)',
                'Serum Creatinine & Kidney Function',
                'HbA1c (Glycated Hemoglobin)',
                'Thyroid Stimulating Hormone (TSH)',
                'Chest X-Ray (PA View)',
                '12-Lead ECG / Electrocardiogram',
                'Echocardiogram (2D Echo)',
              ].map(test => {
                const isChecked = selectedTests.includes(test);
                return (
                  <TouchableOpacity
                    key={test}
                    style={[styles.testCheckTile, isChecked && styles.testCheckTileActive]}
                    onPress={() => {
                      if (isChecked) {
                        setSelectedTests(selectedTests.filter(t => t !== test));
                      } else {
                        setSelectedTests([...selectedTests, test]);
                      }
                    }}
                  >
                    <Ionicons
                      name={isChecked ? 'checkbox' : 'square-outline'}
                      size={18}
                      color={isChecked ? '#00B894' : '#94A3B8'}
                    />
                    <Text style={[styles.testName, isChecked && styles.testNameActive]}>{test}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.bottomWorkstationActions}>
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => {
                  alert(`${selectedTests.length} tests added to electronic order!`);
                  setActiveTabSub('prescription');
                }}
              >
                <Text style={styles.completeBtnText}>Confirm Tests & Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tab 3: Notes */}
        {activeTabSub === 'notes' && (
          <View style={styles.tabBodyContent}>
            <Text style={styles.sectionHeaderTitle}>Clinical Notes & Diagnosis</Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
              Type clinical consultation notes directly here during the video call
            </Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Chief Complaint & Symptoms</Text>
              <TextInput
                style={styles.multilineInput}
                multiline
                numberOfLines={2}
                placeholder="Type patient symptoms e.g. Mild headaches, fatigue, dizziness..."
                placeholderTextColor="#94A3B8"
                value={chiefComplaints}
                onChangeText={setChiefComplaints}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Clinical Assessment & Diagnosis</Text>
              <TextInput
                style={styles.multilineInput}
                multiline
                numberOfLines={2}
                placeholder="e.g. Essential Stage 1 Hypertension..."
                placeholderTextColor="#94A3B8"
                value={diagnosis}
                onChangeText={setDiagnosis}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Doctor's Consult Notes & Examination</Text>
              <TextInput
                style={styles.multilineInput}
                multiline
                numberOfLines={3}
                placeholder="Detailed clinical consult notes, physical findings, discussion..."
                placeholderTextColor="#94A3B8"
                value={clinicalNotes}
                onChangeText={setClinicalNotes}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Advice & Lifestyle Guidelines</Text>
              <TextInput
                style={styles.multilineInput}
                multiline
                numberOfLines={2}
                placeholder="Dietary instructions, exercise advice, precautions..."
                placeholderTextColor="#94A3B8"
                value={adviceNotes}
                onChangeText={setAdviceNotes}
              />
            </View>

            <View style={styles.bottomWorkstationActions}>
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => {
                  alert('Clinical consult notes saved successfully in consultation record!');
                  setActiveTabSub('prescription');
                }}
              >
                <Text style={styles.completeBtnText}>Save Notes & Continue to Rx</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tab 4: Prescription */}
        {activeTabSub === 'prescription' && (
          <View style={styles.tabBodyContent}>
            <Text style={styles.sectionHeaderTitle}>e-Prescription & Pharmacotherapy</Text>

            {/* Prescribed List */}
            <View style={styles.prescriptionsList}>
              {prescriptions.map((med, idx) => (
                <View key={idx} style={styles.medCardRow}>
                  <Ionicons name="medical" size={18} color="#00B894" />
                  <View style={styles.medMeta}>
                    <Text style={styles.medName}>{med.name} · {med.dosage}</Text>
                    <Text style={styles.medSub}>{med.freq} · {med.timing} · {med.duration}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}
                  >
                    <Ionicons name="trash-outline" size={17} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Add New Medicine */}
            <View style={styles.addMedBox}>
              <Text style={styles.addMedHeading}>+ Add Medication</Text>
              <View style={styles.addMedRow}>
                <TextInput
                  style={[styles.inputField, { flex: 2 }]}
                  placeholder="Medicine name (e.g. Paracetamol 650mg)"
                  value={newMedName}
                  onChangeText={setNewMedName}
                />
                <TextInput
                  style={[styles.inputField, { flex: 1 }]}
                  placeholder="Dosage (e.g. 1 tab)"
                  value={newMedDosage}
                  onChangeText={setNewMedDosage}
                />
                <TouchableOpacity style={styles.addMedBtn} onPress={addMedicine}>
                  <Text style={styles.addMedBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomWorkstationActions}>
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={handleCompleteConsultation}
              >
                <Text style={styles.completeBtnText}>Generate e-Prescription & Finalize</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Chat Modal */}
      <Modal visible={showChatModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.chatModalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>In-Call Chat with {patient.name}</Text>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <Ionicons name="close" size={20} color="#0A2342" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatScroll}>
              {chatHistory.map((c, i) => (
                <View key={i} style={[styles.chatBubble, c.sender === 'You' ? styles.bubbleRight : styles.bubbleLeft]}>
                  <Text style={styles.chatSender}>{c.sender} • {c.time}</Text>
                  <Text style={styles.chatText}>{c.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type message to patient..."
                value={chatMessage}
                onChangeText={setChatMessage}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChatMessage}>
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Doctor Request Document Modal */}
      <Modal visible={showDocRequestModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.requestDocModalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Document from Patient</Text>
              <TouchableOpacity onPress={() => setShowDocRequestModal(false)}>
                <Ionicons name="close" size={20} color="#0A2342" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Type the specific document, lab report, or diagnostic scan you need {patient.name} to upload.
            </Text>

            <TextInput
              style={styles.docNameInput}
              placeholder="e.g. Previous Echocardiogram Report, Blood Sugar Log"
              value={requestedDocName}
              onChangeText={setRequestedDocName}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowDocRequestModal(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitDocRequestBtn}
                onPress={handleRequestDocument}
              >
                <Text style={styles.submitDocRequestBtnText}>Send Request to Patient</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Lab Report Preview Modal */}
      <Modal visible={showReportPreviewModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.reportPreviewModalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lab report - Comprehensive Metabolic Panel</Text>
              <TouchableOpacity onPress={() => setShowReportPreviewModal(false)}>
                <Ionicons name="close" size={20} color="#0A2342" />
              </TouchableOpacity>
            </View>

            <View style={styles.reportPreviewContent}>
              <View style={styles.reportFieldRow}>
                <Text style={styles.reportFieldKey}>Patient Name:</Text>
                <Text style={styles.reportFieldValue}>Rohan Mehta (34 / M)</Text>
              </View>
              <View style={styles.reportFieldRow}>
                <Text style={styles.reportFieldKey}>Sample Date:</Text>
                <Text style={styles.reportFieldValue}>22 Sep 2026</Text>
              </View>
              <View style={styles.reportFieldRow}>
                <Text style={styles.reportFieldKey}>Serum Sodium:</Text>
                <Text style={styles.reportFieldValue}>139 mEq/L (Normal)</Text>
              </View>
              <View style={styles.reportFieldRow}>
                <Text style={styles.reportFieldKey}>Serum Potassium:</Text>
                <Text style={styles.reportFieldValue}>4.2 mEq/L (Normal)</Text>
              </View>
              <View style={styles.reportFieldRow}>
                <Text style={styles.reportFieldKey}>Serum Creatinine:</Text>
                <Text style={styles.reportFieldValue}>0.9 mg/dL (Normal)</Text>
              </View>
              <View style={styles.reportFieldRow}>
                <Text style={styles.reportFieldKey}>eGFR:</Text>
                <Text style={styles.reportFieldValue}>98 mL/min/1.73m² (Normal)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closePreviewBtn}
              onPress={() => setShowReportPreviewModal(false)}
            >
              <Text style={styles.closePreviewBtnText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051326',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#081E3E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogoBox: {
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  brandAccent: {
    color: '#00B894',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inConsultationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.3)',
  },
  greenLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00B894',
  },
  inConsultationText: {
    color: '#00B894',
    fontSize: 11,
    fontWeight: '700',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  videoStreamContainer: {
    height: 480,
    backgroundColor: '#0B2244',
    margin: 20,
    borderRadius: 18,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  patientOverlayTopLeft: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 10,
  },
  overlayAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  overlayPatientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  overlayPatientSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  overlayTopRightCol: {
    position: 'absolute',
    top: 18,
    right: 18,
    alignItems: 'flex-end',
    gap: 10,
    zIndex: 10,
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  connectionText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  pipSelfViewBox: {
    width: 110,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#081E3E',
    borderWidth: 2,
    borderColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    position: 'relative',
  },
  pipAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  pipLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraOffOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  centerVideoTarget: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  silhouetteHead: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E3A66',
    borderWidth: 2,
    borderColor: '#2A4E87',
  },
  silhouetteBody: {
    width: 220,
    height: 120,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 110,
    backgroundColor: '#1E3A66',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#2A4E87',
  },
  bottomLeftNamePill: {
    position: 'absolute',
    bottom: 22,
    left: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bottomLeftNameText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  callControlsRow: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  callControlCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(30, 58, 102, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlCircleMuted: {
    backgroundColor: '#DC2626',
  },
  controlCircleActive: {
    backgroundColor: '#00B894',
  },
  endCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 21,
  },
  endCallBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  workstationCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },
  workstationTabsBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#00B894',
    backgroundColor: '#FFFFFF',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0A2342',
    fontWeight: '800',
  },
  tabBodyContent: {
    padding: 24,
    gap: 20,
  },
  patientProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileMetaCol: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A2342',
  },
  profileSub: {
    fontSize: 12,
    color: '#64748B',
  },
  bloodTagBold: {
    fontWeight: '800',
    color: '#DC2626',
  },
  followUpBadgePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  followUpBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  visitDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  visitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  visitChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A2342',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalCard: {
    width: '31%',
    minWidth: 150,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  vitalLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  vitalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0A2342',
  },
  medicalInfoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  medInfoTwoCol: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  medInfoCol: {
    flex: 1,
    minWidth: 200,
    gap: 2,
  },
  medInfoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  medInfoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2342',
  },
  sectionGroup: {
    gap: 10,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A2342',
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewHistoryLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B894',
  },
  reasonBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
  },
  reasonText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportMeta: {
    flex: 1,
    gap: 2,
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2342',
  },
  reportSub: {
    fontSize: 11,
    color: '#64748B',
  },
  viewReportBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewReportBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A2342',
  },
  requestDocActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestDocActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B894',
  },
  privacyDocsList: {
    gap: 8,
  },
  privacyDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  privacyDocTitle: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0A2342',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  historyTimelineList: {
    gap: 8,
  },
  historyTimelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B894',
  },
  historyDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  modeBadgeSmall: {
    backgroundColor: '#E8EEF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modeBadgeSmallText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0A2342',
  },
  historyReason: {
    fontSize: 12,
    color: '#475569',
  },
  bottomWorkstationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  previewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
  },
  previewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2342',
  },
  completeBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#081E3E',
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: -8,
  },
  testsListGrid: {
    gap: 8,
  },
  testCheckTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
  },
  testCheckTileActive: {
    borderColor: '#00B894',
    backgroundColor: '#F0FDF9',
  },
  testName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  testNameActive: {
    color: '#0A2342',
    fontWeight: '700',
  },
  fieldBlock: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  multilineInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: '#0A2342',
    outlineStyle: 'none',
  },
  prescriptionsList: {
    gap: 8,
  },
  medCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medMeta: {
    flex: 1,
    gap: 2,
  },
  medName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2342',
  },
  medSub: {
    fontSize: 11,
    color: '#64748B',
  },
  addMedBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    gap: 10,
  },
  addMedHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  addMedRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0A2342',
    outlineStyle: 'none',
  },
  addMedBtn: {
    backgroundColor: '#00B894',
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMedBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  chatModalBox: {
    width: '100%',
    maxWidth: 480,
    height: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A2342',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginVertical: 12,
  },
  chatScroll: {
    flex: 1,
    marginVertical: 10,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  bubbleLeft: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    backgroundColor: '#081E3E',
    alignSelf: 'flex-end',
  },
  chatSender: {
    fontSize: 9,
    color: '#94A3B8',
    marginBottom: 2,
  },
  chatText: {
    fontSize: 12,
    color: '#0A2342',
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0A2342',
    outlineStyle: 'none',
  },
  chatSendBtn: {
    backgroundColor: '#00B894',
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestDocModalBox: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  docNameInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#0A2342',
    outlineStyle: 'none',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  cancelModalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  cancelModalBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  submitDocRequestBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: '#00B894',
  },
  submitDocRequestBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reportPreviewModalBox: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  reportPreviewContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reportFieldKey: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  reportFieldValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0A2342',
  },
  closePreviewBtn: {
    backgroundColor: '#081E3E',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closePreviewBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
