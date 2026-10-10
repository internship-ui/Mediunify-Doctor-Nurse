import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import Logo from '../components/Logo';
import Card from '../components/Card';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, spacing, typography, radius } from '../theme/colors';
import { doctor, patients } from '../data/mockData';

const REPORT_TYPE_OPTIONS = [
  { type: 'Blood Test', icon: 'water', desc: 'CBC, Sugar, Lipid, Thyroid profile', color: '#DC2626' },
  { type: 'Lab Test', icon: 'flask', desc: 'Biochemistry, Pathology, Urine test', color: '#7C3AED' },
  { type: 'X-Ray / Scan', icon: 'scan', desc: 'Chest X-Ray, Bone scan, Ultrasound', color: '#0284C7' },
  { type: 'ECG / Echo', icon: 'pulse', desc: 'Electrocardiogram, 2D Echocardiogram', color: '#08317C' },
  { type: 'Prescription', icon: 'medical', desc: 'Previous doctor or pharmacy Rx', color: colors.primary },
  { type: 'MRI / CT Scan', icon: 'fitness', desc: 'Brain, Spine or Abdomen imaging', color: '#4F46E5' },
  { type: 'Discharge Summary', icon: 'document-text', desc: 'Hospital / Clinic discharge notes', color: '#059669' },
  { type: 'Other Document', icon: 'folder-open', desc: 'Vaccination, specialized test notes', color: '#64748B' },
];

export default function DirectPatientScreen({ navigation }) {
  const handleEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Initiate an emergency call for an urgent patient case?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', style: 'destructive', onPress: () => {} },
      ]
    );
  };
  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'list'

  // Direct patient intake form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [isBloodGroupDropdownOpen, setIsBloodGroupDropdownOpen] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');

  // Scroll, layout position, and keyboard state for preventing overlap
  const scrollViewRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [cardY, setCardY] = useState(0);
  const [notesY, setNotesY] = useState(0);

  const scrollToTreatmentNotes = () => {
    // Scroll directly to the notes field so it sits comfortably in view below the header
    // Prevents overshooting ("going too high") and prevents keyboard overlap on 1st, 2nd, and 3rd click
    const targetY = cardY > 0 && notesY > 0 ? cardY + notesY - 30 : 680;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, targetY),
        animated: true,
      });
    }, 100);
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setIsKeyboardOpen(true);
      setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : 280);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardOpen(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Medical reports state (replaces follow-up)
  const [uploadedReports, setUploadedReports] = useState([]);
  const [selectedReportType, setSelectedReportType] = useState('Blood Test');
  const [customReportName, setCustomReportName] = useState('');

  // Active report option details
  const currentReportOption =
    REPORT_TYPE_OPTIONS.find((opt) => opt.type === selectedReportType) ||
    REPORT_TYPE_OPTIONS[0];

  // Zoom-in / Zoom-out popup modal for report type selection
  const [reportTypeModalVisible, setReportTypeModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const openReportTypeModal = () => {
    setReportTypeModalVisible(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeReportTypeModal = (newType) => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.3,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setReportTypeModalVisible(false);
      if (newType) {
        setSelectedReportType(newType);
      }
    });
  };

  // Creation & WhatsApp notification popup state
  const [isCreating, setIsCreating] = useState(false);
  const [whatsAppNotification, setWhatsAppNotification] = useState(null);

  // Keep track of direct patients added
  const [directPatientsList, setDirectPatientsList] = useState([
    {
      id: 'dp1',
      name: 'Vikas Sharma',
      phone: '+91 98765 43210',
      age: 38,
      gender: 'Male',
      bloodGroup: 'B+',
      diagnosis: 'Acute Gastritis',
      reportsCount: 2,
      inviteStatus: 'WhatsApp Notify Sent',
    },
    {
      id: 'dp2',
      name: 'Meera Nair',
      phone: '+91 91234 56789',
      age: 42,
      gender: 'Female',
      bloodGroup: 'A+',
      diagnosis: 'Seasonal Bronchitis',
      reportsCount: 1,
      inviteStatus: 'WhatsApp Notify Sent',
    },
  ]);

  // Search state for direct patients
  const [directSearchQuery, setDirectSearchQuery] = useState('');

  const filteredDirectPatients = directPatientsList.filter((p) => {
    const q = directSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.phone && p.phone.toLowerCase().includes(q)) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(q)) ||
      (p.bloodGroup && p.bloodGroup.toLowerCase().includes(q)) ||
      String(p.age).includes(q)
    );
  });

  // Handle uploading/attaching a medical report
  const handleAttachReport = (presetType) => {
    const typeToAdd = presetType || selectedReportType;
    const reportTitle =
      customReportName.trim() ||
      `${typeToAdd} - ${new Date().toLocaleDateString('en-GB')}`;

    const newDoc = {
      id: `rep_${Date.now()}`,
      name: reportTitle,
      type: typeToAdd,
      date: 'Today',
      fileSize: '1.4 MB',
    };

    setUploadedReports((prev) => [...prev, newDoc]);
    setCustomReportName('');
  };

  const handleRemoveReport = (id) => {
    setUploadedReports((prev) => prev.filter((r) => r.id !== id));
  };

  // Handle patient creation and automatic WhatsApp notification popup
  const handleCreatePatient = () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter the patient’s full name.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert(
        'Required Field',
        'Please enter the patient mobile number for WhatsApp notification.'
      );
      return;
    }

    setIsCreating(true);

    // Wait few seconds to simulate profile creation & WhatsApp notification delivery
    setTimeout(() => {
      setIsCreating(false);

      const newPatientId = `p_direct_${Date.now()}`;
      const newEntry = {
        id: newPatientId,
        name: name.trim(),
        phone: phone.trim(),
        age: parseInt(age, 10) || 30,
        gender,
        bloodGroup,
        allergies: ['None known'],
        conditions: complaint ? [complaint] : [],
        medications: treatmentNotes ? [treatmentNotes] : [],
        vitals: { bpm: 75, bp: '120/80', sugar: '95 mg/dL' },
        lastVisit: 'Today (Direct Visit)',
        records: {
          notes: 1,
          labReports: uploadedReports.length,
          prescriptions: 1,
        },
        documents: uploadedReports.map((r) => ({
          name: r.name,
          date: r.date,
        })),
        consultationHistory: [
          {
            date: 'Today (Direct Visit)',
            type: 'In-Person',
            diagnosis: diagnosis || complaint || 'General Consultation',
          },
        ],
        accessAuthorized: true,
        reportsCount: uploadedReports.length,
        inviteStatus: 'WhatsApp Notify Sent',
        isDirectWalkIn: true,
      };

      // Save into global mockData patients array
      patients.unshift(newEntry);

      // Save into direct patients local state
      setDirectPatientsList((prev) => [newEntry, ...prev]);

      // Pop the WhatsApp notification as requested
      const notifyMessage = `Hello ${newEntry.name}, Dr. ${doctor.name} has created your profile. Please use the MediUnify app to consult the doctor, view your prescriptions, and check uploaded medical reports.`;

      setWhatsAppNotification({
        patientName: newEntry.name,
        phone: newEntry.phone,
        message: notifyMessage,
        patientId: newEntry.id,
      });

      // Clear form inputs
      setName('');
      setPhone('');
      setAge('');
      setComplaint('');
      setDiagnosis('');
      setTreatmentNotes('');
      setUploadedReports([]);
    }, 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* ======================================================
          DARK NAVY HEADER (MATCHING APPOINTMENTS & USER IMAGE)
      ======================================================= */}
      <View style={styles.headerNavy}>
        {/* TOP BRAND ROW: LOGO & "MediUnify" + ACTIONS */}
        <View style={styles.topBrandRow}>
          <View style={styles.brandRow}>
            <Logo size={34} />
            <Text style={styles.brandName}>
              <Text style={styles.brandMedi}>Medi</Text>
              <Text style={styles.brandUnify}>Unify</Text>
            </Text>
          </View>

          <View style={styles.headerIconsRow}>
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={handleEmergency}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={17} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => navigation && navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION ROW AS SHOWN IN IMAGE: (←) Direct patient */}
        <View style={styles.navHeaderRow}>
          <TouchableOpacity
            style={styles.headerNavCircleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.screenMainTitle}>Direct patient</Text>

          {/* Right Spacer for balance */}
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* TOP TABS: ADD PATIENT & DIRECT PATIENTS LIST */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'add' && styles.tabBtnActive]}
          onPress={() => setActiveTab('add')}
        >
          <Ionicons
            name="person-add"
            size={16}
            color={activeTab === 'add' ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'add' && styles.tabBtnTextActive,
            ]}
          >
            + Add Direct Patient
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'list' && styles.tabBtnActive]}
          onPress={() => setActiveTab('list')}
        >
          <Ionicons
            name="people"
            size={16}
            color={activeTab === 'list' ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'list' && styles.tabBtnTextActive,
            ]}
          >
            Direct Patients Lists ({directPatientsList.length})
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: isKeyboardOpen ? (keyboardHeight > 0 ? keyboardHeight + 80 : 340) : 100,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* ====================================================
            TAB 1: ADD DIRECT PATIENT INTAKE FORM
        ==================================================== */}
        {activeTab === 'add' && (
          <View>
            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>Direct Patient Registration</Text>
              <Text style={styles.sectionSubtitle}>
                Manually record walk-in patient information, upload medical reports, and automatically notify via WhatsApp to use MediUnify
              </Text>
            </View>

            <Card
              style={styles.formCard}
              onLayout={(e) => setCardY(e.nativeEvent.layout.y)}
            >
              <AppInput
                label="Patient Full Name *"
                placeholder="your name"
                icon="person-outline"
                value={name}
                onChangeText={setName}
                borderColor="#475569"
              />

              <AppInput
                label="WhatsApp / Mobile Number *"
                placeholder="your phone number"
                icon="call-outline"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                borderColor="#475569"
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <AppInput
                  label="Age"
                  placeholder="your age"
                  icon="calendar-outline"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                  style={{ flex: 1 }}
                  borderColor="#475569"
                />

                <View style={{ flex: 1, marginBottom: spacing.lg }}>
                  <Text style={styles.fieldLabel}>Blood Group</Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdownBtn,
                      isBloodGroupDropdownOpen && styles.dropdownBtnActive,
                    ]}
                    onPress={() =>
                      setIsBloodGroupDropdownOpen(!isBloodGroupDropdownOpen)
                    }
                    activeOpacity={0.8}
                  >
                    <View style={styles.dropdownLeftWrap}>
                      <Ionicons
                        name="water"
                        size={16}
                        color={colors.danger || '#DC2626'}
                      />
                      <Text style={styles.dropdownSelectedText}>
                        {bloodGroup}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        isBloodGroupDropdownOpen
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={18}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>

                  {/* DROPDOWN MENU */}
                  {isBloodGroupDropdownOpen && (
                    <View style={styles.dropdownMenuBox}>
                      <View style={styles.dropdownGrid}>
                        {[
                          'A+',
                          'A-',
                          'B+',
                          'B-',
                          'O+',
                          'O-',
                          'AB+',
                          'AB-',
                        ].map((bg) => {
                          const isSelected = bloodGroup === bg;
                          return (
                            <TouchableOpacity
                              key={bg}
                              style={[
                                styles.dropdownOptionItem,
                                isSelected &&
                                styles.dropdownOptionItemActive,
                              ]}
                              onPress={() => {
                                setBloodGroup(bg);
                                setIsBloodGroupDropdownOpen(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  isSelected &&
                                  styles.dropdownOptionTextActive,
                                ]}
                              >
                                {bg}
                              </Text>
                              {isSelected && (
                                <Ionicons
                                  name="checkmark"
                                  size={13}
                                  color={colors.white}
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* GENDER SELECTOR */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderChip,
                        gender === g && styles.genderChipActive,
                      ]}
                      onPress={() => setGender(g)}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          gender === g && styles.genderChipTextActive,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* CLINICAL SYMPTOMS & DIAGNOSIS */}
              <AppInput
                label="Chief Complaint / Symptoms"
                placeholder="EX: Persistent cough, fever, chest congestion"
                value={complaint}
                onChangeText={setComplaint}
                borderColor="#475569"
              />

              <AppInput
                label="Diagnosis / Clinical Impression"
                placeholder="Ex: Acute Bronchitis"
                value={diagnosis}
                onChangeText={setDiagnosis}
                borderColor="#475569"
              />

              {/* ==================================================
                  UPLOAD MEDICAL REPORT SECTION (REPLACES FOLLOW-UP)
              =================================================== */}
              <View style={styles.reportSectionBox}>
                <View style={styles.reportHeaderRow}>
                  <View style={styles.reportIconCircle}>
                    <Ionicons
                      name="document-attach"
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.reportSectionTitle}>
                      Upload Medical Reports
                    </Text>
                    <Text style={styles.reportSectionSubtitle}>
                      Attach patient's Reports
                    </Text>
                  </View>
                </View>

                {/* REPORT TYPE SELECTOR WITH ZOOM-IN POPUP TRIGGER */}
                <View style={styles.reportTypeSelectorBlock}>
                  <Text style={styles.reportChipHeader}>Report Category:</Text>
                  <TouchableOpacity
                    style={styles.zoomTriggerBtn}
                    onPress={openReportTypeModal}
                    activeOpacity={0.8}
                  >
                    <View style={styles.zoomTriggerLeft}>
                      <View
                        style={[
                          styles.zoomTriggerIconBadge,
                          {
                            backgroundColor: currentReportOption.color + '15',
                          },
                        ]}
                      >
                        <Ionicons
                          name={currentReportOption.icon}
                          size={18}
                          color={currentReportOption.color}
                        />
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.zoomTriggerLabel}>Category:</Text>
                        <Text style={styles.zoomTriggerValue}>
                          {selectedReportType}
                        </Text>
                      </View>
                    </View>

                    {/* WHAT DOCTOR CHOSE BADGE (REPLACES CHOOSE / ZOOM IN) */}
                    <View
                      style={[
                        styles.chosenReportBadge,
                        {
                          backgroundColor: currentReportOption.color + '15',
                          borderColor: currentReportOption.color + '40',
                        },
                      ]}
                    >
                      <Ionicons
                        name={currentReportOption.icon}
                        size={14}
                        color={currentReportOption.color}
                      />
                      <Text
                        style={[
                          styles.chosenReportText,
                          { color: currentReportOption.color },
                        ]}
                      >
                        {selectedReportType}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={14}
                        color={currentReportOption.color}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* REPORT TITLE INPUT */}
                <View style={styles.reportInputRow}>
                  <TextInput
                    style={styles.reportNameInput}
                    placeholder={`Optional report title`}
                    placeholderTextColor={colors.textMuted}
                    value={customReportName}
                    onChangeText={setCustomReportName}
                  />

                  <TouchableOpacity
                    style={styles.uploadBtn}
                    onPress={() => handleAttachReport()}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={16}
                      color={colors.white}
                    />
                    <Text style={styles.uploadBtnText}>Upload File</Text>
                  </TouchableOpacity>
                </View>

                {/* UPLOADED REPORTS LIST */}
                {uploadedReports.length > 0 ? (
                  <View style={styles.uploadedListWrap}>
                    <Text style={styles.uploadedListTitle}>
                      Attached Reports ({uploadedReports.length}):
                    </Text>
                    {uploadedReports.map((report) => (
                      <View key={report.id} style={styles.reportItemRow}>
                        <View style={styles.fileIconBadge}>
                          <Ionicons
                            name="document"
                            size={16}
                            color={colors.primary}
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.reportItemName}>
                            {report.name}
                          </Text>
                          <Text style={styles.reportItemMeta}>
                            {report.type} · {report.fileSize} · {report.date}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveReport(report.id)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color={colors.danger || '#DC2626'}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyReportBox}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={24}
                      color={colors.textMuted}
                    />
                    <Text style={styles.emptyReportText}>
                      No reports attached yet. Tap "Upload File" to add files.
                    </Text>
                  </View>
                )}
              </View>

              {/* TREATMENT / INITIAL NOTES */}
              <View onLayout={(e) => setNotesY(e.nativeEvent.layout.y)}>
                <AppInput
                  label="Prescription / Treatment Plan Notes"
                  placeholder="EX: Paracetamol 650mg, Vitamin C, Steam inhalation"
                  value={treatmentNotes}
                  onChangeText={setTreatmentNotes}
                  onFocus={scrollToTreatmentNotes}
                  onTouchStart={scrollToTreatmentNotes}
                  multiline
                  style={{ marginBottom: spacing.md }}
                  borderColor="#475569"
                />
              </View>

              {/* SUBMIT BUTTON */}
              {isCreating ? (
                <View style={styles.loadingBtnWrap}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.loadingBtnText}>
                    Creating Patient Profile & Sending WhatsApp Notification...
                  </Text>
                </View>
              ) : (
                <AppButton
                  title="Create Patient Profile"
                  variant="accent"
                  icon="checkmark-circle-outline"
                  onPress={handleCreatePatient}
                  style={{ marginTop: spacing.sm }}
                />
              )}
            </Card>
          </View>
        )}

        {/* ====================================================
            TAB 2: DIRECT PATIENTS LIST
        ==================================================== */}
        {activeTab === 'list' && (
          <View>
            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>Direct Walk-in Patients</Text>
              <Text style={styles.sectionSubtitle}>
                Patients registered directly at your clinic with MediUnify notification status
              </Text>
            </View>

            {/* SEARCH BAR FOR DIRECT PATIENTS */}
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.primary}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search direct patients by name, phone, diagnosis..."
                placeholderTextColor={colors.textMuted}
                value={directSearchQuery}
                onChangeText={setDirectSearchQuery}
                autoCorrect={false}
              />
              {directSearchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setDirectSearchQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* SEARCH STATS */}
            {directSearchQuery.length > 0 && (
              <View style={styles.searchStatsRow}>
                <Text style={styles.searchStatsText}>
                  Found {filteredDirectPatients.length} of {directPatientsList.length} direct patient(s)
                </Text>
                <TouchableOpacity onPress={() => setDirectSearchQuery('')}>
                  <Text style={styles.clearSearchLink}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}

            {filteredDirectPatients.length === 0 ? (
              <View style={styles.noMatchCard}>
                <Ionicons
                  name="search-outline"
                  size={28}
                  color={colors.textMuted}
                />
                <Text style={styles.noMatchTitle}>No direct patients found</Text>
                <Text style={styles.noMatchSubtitle}>
                  No patient matches "{directSearchQuery}"
                </Text>
                <TouchableOpacity
                  style={styles.clearSearchBtn}
                  onPress={() => setDirectSearchQuery('')}
                >
                  <Text style={styles.clearSearchBtnText}>Clear Search</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredDirectPatients.map((p) => (
                <Card key={p.id} style={styles.patientItemCard}>
                  <View style={styles.patientCardTop}>
                    <View style={styles.patientAvatarWrap}>
                      <Text style={styles.patientAvatarText}>
                        {p.name.charAt(0)}
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text style={styles.patientName}>{p.name}</Text>
                        <View style={styles.directBadge}>
                          <Text style={styles.directBadgeText}>Direct Walk-in</Text>
                        </View>
                      </View>

                      <Text style={styles.patientMeta}>
                        {p.age} yrs · {p.gender} · Blood: {p.bloodGroup} · {p.phone}
                      </Text>

                      {p.diagnosis ? (
                        <Text style={styles.patientDiagnosis}>
                          Diagnosis: {p.diagnosis}
                        </Text>
                      ) : null}

                      {p.reportsCount !== undefined ? (
                        <Text style={styles.reportsCountText}>
                          📄 {p.reportsCount} medical report(s) attached
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* NOTIFICATION STATUS & ACTION BUTTONS */}
                  <View style={styles.cardActionRow}>
                    <View style={styles.inviteStatusWrap}>
                      <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
                      <Text style={styles.inviteStatusText}>
                        WhatsApp Notify Sent
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        style={styles.miniActionBtn}
                        onPress={() =>
                          navigation.navigate('Prescription', { patientId: p.id })
                        }
                      >
                        <Ionicons
                          name="medical-outline"
                          size={14}
                          color={colors.primary}
                        />
                        <Text style={styles.miniActionText}>Prescribe Rx</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              ))
            )}

            <AppButton
              title="+ Add Another Direct Patient"
              variant="outline"
              icon="person-add-outline"
              onPress={() => setActiveTab('add')}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>

      {/* ====================================================
          WHATSAPP NOTIFICATION POPUP MODAL
      ==================================================== */}
      <Modal
        visible={!!whatsAppNotification}
        transparent
        animationType="fade"
        onRequestClose={() => setWhatsAppNotification(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.notifyPopCard}>
            {/* WHATSAPP POPUP HEADER */}
            <View style={styles.notifyPopHeader}>
              <View style={styles.whatsappIconCircle}>
                <Ionicons name="logo-whatsapp" size={26} color={colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.notifyPopHeaderTitle}>
                  WhatsApp Notification Sent!
                </Text>
                <Text style={styles.notifyPopHeaderSubtitle}>
                  Delivered to {whatsAppNotification?.patientName} (
                  {whatsAppNotification?.phone})
                </Text>
              </View>
            </View>

            {/* MESSAGE PREVIEW BUBBLE */}
            <View style={styles.messageBubbleBox}>
              <View style={styles.bubbleHeaderRow}>
                <Text style={styles.bubbleHeaderSender}>
                  MediUnify Notification Service
                </Text>
                <Text style={styles.bubbleHeaderTime}>Just now</Text>
              </View>
              <Text style={styles.bubbleBodyText}>
                "{whatsAppNotification?.message}"
              </Text>

              <View style={styles.bubbleLinkCard}>
                <Ionicons
                  name="link-outline"
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.bubbleLinkText}>
                  https://mediunify.com/patient/join
                </Text>
              </View>
            </View>

            <Text style={styles.notifySentFootnote}>
              ✓ The patient has been directed to consult Dr. {doctor.name} and book future visits through the MediUnify App.
            </Text>

            {/* ACTION BUTTONS IN MODAL */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalDismissBtn}
                onPress={() => setWhatsAppNotification(null)}
              >
                <Text style={styles.modalDismissBtnText}>Done</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrescribeBtn}
                onPress={() => {
                  const pid = whatsAppNotification?.patientId;
                  setWhatsAppNotification(null);
                  if (pid) {
                    navigation.navigate('Prescription', { patientId: pid });
                  }
                }}
              >
                <Ionicons name="medical" size={16} color={colors.white} />
                <Text style={styles.modalPrescribeBtnText}>
                  Write Prescription
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================================================
          ZOOM IN / OUT REPORT TYPE SELECTION MODAL
      ==================================================== */}
      <Modal
        visible={reportTypeModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => closeReportTypeModal()}
      >
        <View style={styles.zoomModalOverlay}>
          <Animated.View
            style={[
              styles.zoomModalCard,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* ZOOM MODAL HEADER */}
            <View style={styles.zoomModalHeader}>
              <View style={styles.zoomModalHeaderLeft}>
                <View style={styles.zoomModalIconCircle}>
                  <Ionicons name="documents" size={22} color={colors.primary} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.zoomModalTitle}>Select Report Type</Text>
                  <Text style={styles.zoomModalSubtitle}>
                    Choose diagnostic document category
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => closeReportTypeModal()}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="close-circle"
                  size={26}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* REPORT TYPE CARDS GRID */}
            <ScrollView
              style={{ maxHeight: 380 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.reportGrid}>
                {REPORT_TYPE_OPTIONS.map((item) => {
                  const isSelected = selectedReportType === item.type;
                  return (
                    <TouchableOpacity
                      key={item.type}
                      style={[
                        styles.reportGridCard,
                        isSelected && styles.reportGridCardActive,
                      ]}
                      onPress={() => closeReportTypeModal(item.type)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.reportGridIconWrap,
                          { backgroundColor: item.color + '15' },
                          isSelected && { backgroundColor: colors.white },
                        ]}
                      >
                        <Ionicons
                          name={item.icon}
                          size={20}
                          color={isSelected ? colors.primary : item.color}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text
                          style={[
                            styles.reportGridCardTitle,
                            isSelected && styles.reportGridCardTitleActive,
                          ]}
                        >
                          {item.type}
                        </Text>
                        <Text
                          style={[
                            styles.reportGridCardDesc,
                            isSelected && styles.reportGridCardDescActive,
                          ]}
                        >
                          {item.desc}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.white}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  /* Dark Navy Header (matching Appointments & user image) */
  headerNavy: {
    backgroundColor: '#061A3A',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  brandMedi: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  brandUnify: {
    color: '#00B894',
    fontWeight: '800',
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00B894',
    borderWidth: 1,
    borderColor: '#061A3A',
  },
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 4,
  },
  headerNavCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenMainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  /* TAB BAR */
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surface || '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#475569',
  },
  tabBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#061A3A',
  },
  tabBtnText: {
    ...typography.smallBold,
    color: colors.textSecondary,
    fontSize: 13,
  },
  tabBtnTextActive: {
    color: colors.white,
  },

  /* SECTION HEADER */
  sectionHeaderWrap: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 16,
  },
  sectionSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formCard: {
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#475569',
    borderLeftWidth: 4,
    borderLeftColor: '#475569',
  },
  fieldLabel: {
    ...typography.smallBold,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  /* BLOOD GROUP DROPDOWN */
  dropdownBtn: {
    height: 48,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#475569',
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dropdownBtnActive: {
    borderColor: colors.primaryDark || colors.primary,
  },
  dropdownLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dropdownSelectedText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  dropdownMenuBox: {
    marginTop: 6,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#475569',
    padding: 8,
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dropdownOptionItem: {
    width: '23%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.surface || '#F8FAFC',
    borderWidth: 1,
    borderColor: '#475569',
  },
  dropdownOptionItemActive: {
    backgroundColor: '#071E42',
    borderColor: '#061A3A',
  },
  dropdownOptionText: {
    ...typography.smallBold,
    color: colors.textSecondary,
    fontSize: 12,
  },
  dropdownOptionTextActive: {
    color: colors.white,
  },

  /* GENDER */
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#475569',
    backgroundColor: colors.surface || '#F8FAFC',
  },
  genderChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#061A3A',
  },
  genderChipText: {
    ...typography.smallBold,
    color: colors.textSecondary,
  },
  genderChipTextActive: {
    color: colors.white,
  },

  /* ==================================================
      REPORT SECTION
  =================================================== */
  reportSectionBox: {
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#475569',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reportHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reportIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  reportSectionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
  },
  reportSectionSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 1,
  },
  reportTypeSelectorBlock: {
    marginBottom: 8,
  },
  zoomTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#475569',
    padding: 10,
    marginTop: 4,
  },
  zoomTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomTriggerIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomTriggerLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  zoomTriggerValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  chosenReportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1.2,
  },
  chosenReportText: {
    ...typography.smallBold,
    fontSize: 13,
  },
  reportChipHeader: {
    ...typography.tiny,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },
  reportInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  reportNameInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#475569',
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...typography.small,
    color: colors.textPrimary,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    borderRadius: radius.md,
  },
  uploadBtnText: {
    ...typography.smallBold,
    color: colors.white,
    fontSize: 13,
  },
  uploadedListWrap: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.primary + '30',
    paddingTop: 8,
  },
  uploadedListTitle: {
    ...typography.tiny,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  reportItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1.2,
    borderColor: '#475569',
  },
  fileIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportItemName: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },
  reportItemMeta: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 1,
  },
  emptyReportBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radius.md,
    marginTop: 8,
  },
  emptyReportText: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 4,
  },

  /* LOADING BUTTON */
  loadingBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#071E42',
    paddingVertical: 14,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  loadingBtnText: {
    ...typography.smallBold,
    color: colors.white,
  },

  /* DIRECT PATIENTS LIST */
  patientItemCard: {
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: '#475569',
    borderLeftWidth: 4,
    borderLeftColor: '#475569',
    padding: spacing.md,
  },
  patientCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  patientAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#475569',
  },
  patientAvatarText: {
    ...typography.h3,
    color: '#071E42', // Navy Blue
    fontWeight: '700',
  },
  patientName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  directBadge: {
    backgroundColor: colors.accentSurface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.accentLight,
  },
  directBadgeText: {
    ...typography.tiny,
    color: colors.accent,
    fontWeight: '700',
  },
  patientMeta: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  patientDiagnosis: {
    ...typography.smallBold,
    color: colors.primary,
    marginTop: 3,
  },
  reportsCountText: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inviteStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inviteStatusText: {
    ...typography.tiny,
    color: '#15803D',
    fontWeight: '700',
  },
  miniActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1.2,
    borderColor: '#475569',
    backgroundColor: colors.primarySurface,
  },
  miniActionText: {
    ...typography.tiny,
    fontWeight: '700',
    color: colors.primary,
  },

  /* ==================================================
      WHATSAPP NOTIFICATION MODAL
  =================================================== */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  notifyPopCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  notifyPopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  whatsappIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyPopHeaderTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  notifyPopHeaderSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messageBubbleBox: {
    backgroundColor: '#DCF8C6',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C3E6A8',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bubbleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bubbleHeaderSender: {
    ...typography.tiny,
    fontWeight: '700',
    color: '#075E54',
  },
  bubbleHeaderTime: {
    ...typography.tiny,
    color: '#555',
  },
  bubbleBodyText: {
    ...typography.small,
    color: '#111827',
    lineHeight: 18,
  },
  bubbleLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  bubbleLinkText: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '600',
  },
  notifySentFootnote: {
    ...typography.tiny,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.md,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalDismissBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface || '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#475569',
  },
  modalDismissBtnText: {
    ...typography.smallBold,
    color: colors.textSecondary,
  },
  modalPrescribeBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  modalPrescribeBtnText: {
    ...typography.smallBold,
    color: colors.white,
  },

  /* SEARCH BAR & EMPTY STATE */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#475569',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  searchStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  searchStatsText: {
    ...typography.tiny,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  clearSearchLink: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '700',
  },
  noMatchCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface || '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#475569',
    marginBottom: spacing.md,
  },
  noMatchTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: 8,
  },
  noMatchSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  clearSearchBtn: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySurface,
    borderWidth: 1,
    borderColor: '#475569',
  },
  clearSearchBtnText: {
    ...typography.smallBold,
    color: colors.primary,
  },

  /* ==================================================
      ZOOM IN / OUT MODAL STYLES
  =================================================== */
  zoomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  zoomModalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  zoomModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  zoomModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomModalIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  zoomModalTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  zoomModalSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reportGrid: {
    gap: 8,
    paddingVertical: 4,
  },
  reportGridCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1.2,
    borderColor: '#475569',
    backgroundColor: colors.surface || '#F8FAFC',
  },
  reportGridCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark || colors.primary,
  },
  reportGridIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportGridCardTitle: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  reportGridCardTitleActive: {
    color: colors.white,
  },
  reportGridCardDesc: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 1,
  },
  reportGridCardDescActive: {
    color: 'rgba(255, 255, 255, 0.88)',
  },
});
