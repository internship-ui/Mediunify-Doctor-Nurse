import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/Logo';
import Card from '../../components/Card';
import CallModal from '../components/CallModal';
import { colors, spacing, typography, radius } from '../../theme/colors';
import { useHomeNursing } from '../context/HomeNursingContext';

export default function HomeNursingProfileScreen({ navigation }) {
  const {
    nurseProfile,
    updateNurseProfile,
    setRegistrationStatus,
    setIsNurseAuthenticated,
  } = useHomeNursing();

  /* =========================================================
     MODAL STATES
  ========================================================= */
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [personalModal, setPersonalModal] = useState(false);
  const [professionalModal, setProfessionalModal] = useState(false);
  const [certPreviewModal, setCertPreviewModal] = useState(false);
  const [certUploadModal, setCertUploadModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);

  /* =========================================================
     FORM EDIT STATES
  ========================================================= */
  const [personalForm, setPersonalForm] = useState({
    fullName: nurseProfile.fullName || '',
    dob: nurseProfile.dob || '14/08/1996',
    gender: nurseProfile.gender || 'Female',
    phoneNumber: nurseProfile.phoneNumber || '',
    altPhone: nurseProfile.altPhone || '+91 98450 11234',
    email: nurseProfile.email || '',
    residentialAddress: nurseProfile.residentialAddress || '',
    cityArea: nurseProfile.cityArea || '',
    pincode: nurseProfile.pincode || '',
  });

  const [professionalForm, setProfessionalForm] = useState({
    qualification: nurseProfile.qualification || '',
    licenseNumber: nurseProfile.licenseNumber || '',
    registrationAuthority: nurseProfile.registrationAuthority || '',
    yearsOfExperience: nurseProfile.yearsOfExperience || '',
    specialization: Array.isArray(nurseProfile.specialization)
      ? nurseProfile.specialization.join(', ')
      : nurseProfile.specialization || '',
    workExperience: nurseProfile.workExperience || 'Apollo Hospitals (4 yrs), Senior Home Care Nurse (2 yrs)',
  });

  const openPersonalEdit = () => {
    setPersonalForm({
      fullName: nurseProfile.fullName || '',
      dob: nurseProfile.dob || '14/08/1996',
      gender: nurseProfile.gender || 'Female',
      phoneNumber: nurseProfile.phoneNumber || '',
      altPhone: nurseProfile.altPhone || '+91 98450 11234',
      email: nurseProfile.email || '',
      residentialAddress: nurseProfile.residentialAddress || '',
      cityArea: nurseProfile.cityArea || '',
      pincode: nurseProfile.pincode || '',
    });
    setPersonalModal(true);
  };

  const savePersonalEdit = () => {
    if (!personalForm.fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return;
    }
    if (!personalForm.phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Phone Number is required.');
      return;
    }
    updateNurseProfile({
      fullName: personalForm.fullName.trim(),
      dob: personalForm.dob.trim(),
      gender: personalForm.gender.trim(),
      phoneNumber: personalForm.phoneNumber.trim(),
      altPhone: personalForm.altPhone.trim(),
      email: personalForm.email.trim(),
      residentialAddress: personalForm.residentialAddress.trim(),
      cityArea: personalForm.cityArea.trim(),
      pincode: personalForm.pincode.trim(),
    });
    setPersonalModal(false);
    Alert.alert('Profile Updated', 'Personal information has been updated successfully.');
  };

  const openProfessionalEdit = () => {
    setProfessionalForm({
      qualification: nurseProfile.qualification || '',
      licenseNumber: nurseProfile.licenseNumber || '',
      registrationAuthority: nurseProfile.registrationAuthority || '',
      yearsOfExperience: nurseProfile.yearsOfExperience || '',
      specialization: Array.isArray(nurseProfile.specialization)
        ? nurseProfile.specialization.join(', ')
        : nurseProfile.specialization || '',
      workExperience: nurseProfile.workExperience || 'Apollo Hospitals (4 yrs), Senior Home Care Nurse (2 yrs)',
    });
    setProfessionalModal(true);
  };

  const saveProfessionalEdit = () => {
    if (!professionalForm.licenseNumber.trim()) {
      Alert.alert('Validation Error', 'Nursing License Number is required.');
      return;
    }
    const specArray = professionalForm.specialization
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateNurseProfile({
      qualification: professionalForm.qualification.trim(),
      licenseNumber: professionalForm.licenseNumber.trim(),
      registrationAuthority: professionalForm.registrationAuthority.trim(),
      yearsOfExperience: professionalForm.yearsOfExperience.trim(),
      specialization: specArray.length > 0 ? specArray : [professionalForm.specialization.trim()],
      workExperience: professionalForm.workExperience.trim(),
    });
    setProfessionalModal(false);
    Alert.alert('Credentials Updated', 'Professional nursing details updated successfully.');
  };

  const handleUpdateCertificate = (newDoc) => {
    updateNurseProfile({
      registrationCertificate: {
        name: newDoc.name,
        size: newDoc.size,
        uploadedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Verified',
        council: newDoc.council,
        issueDate: newDoc.issueDate,
      },
    });
    setCertUploadModal(false);
    Alert.alert('Document Updated', `${newDoc.name} has been uploaded and verified.`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from the Home Nursing portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            setIsNurseAuthenticated(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'HomeNursingLogin' }],
            });
          },
        },
      ]
    );
  };

  const certData = nurseProfile.registrationCertificate || {
    name: 'KNC_Registration_Certificate_2019.pdf',
    size: '1.8 MB',
    uploadedDate: '12 Jan 2026',
    status: 'Verified',
    council: nurseProfile.registrationAuthority || 'Karnataka State Nursing Council',
    issueDate: '14 May 2019',
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* =========================================================
          HEADER (MATCHING DOCTOR PROFILE THEME & STYLING)
      ========================================================= */}
      <View style={styles.header}>
        {/* TOP ROW: BRAND LOGO + CALL + ALERTS */}
        <View style={styles.topRow}>
          {/* BRAND LOGO */}
          <View style={styles.brandRow}>
            <Logo size={30} withBorder={false} />
            <Text style={styles.brandName}>
              <Text style={styles.brandMedi}>Medi</Text>
              <Text style={styles.brandUnify}>Unify</Text>
            </Text>
          </View>

          {/* CALL + NOTIFICATIONS ICONS */}
          <View style={styles.iconsRow}>
            {/* CALL */}
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => setCallModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            {/* ALERTS / NOTIFICATIONS */}
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => navigation.navigate('HomeNursingNotifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications" size={18} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* NURSE PROFILE IDENTITY (CENTERED - NO EDIT BUTTON NEAR AVATAR) */}
        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>
              {nurseProfile.initials || 'KR'}
            </Text>
          </View>

          <Text style={styles.name}>
            {nurseProfile.fullName || 'Nurse Kavitha R.'}
          </Text>

          <Text style={styles.spec}>
            {nurseProfile.qualification
              ? `Registered Home Care Nurse · ${nurseProfile.qualification}`
              : 'Registered Home Care Practitioner'}
          </Text>

          <View style={styles.regBadge}>
            <Ionicons
              name={
                nurseProfile.registrationStatus === 'Approved'
                  ? 'checkmark-circle'
                  : 'shield-checkmark'
              }
              size={13}
              color="#38BDF8"
            />
            <Text style={styles.regText}>
              {nurseProfile.licenseNumber || 'KNC-2019-88421'} ·{' '}
              {nurseProfile.registrationStatus || 'Approved'}
            </Text>
          </View>
        </View>
      </View>

      {/* =========================================================
          MAIN SCROLL CONTENT
      ========================================================= */}
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================
            1. PERSONAL INFORMATION (EDIT BUTTON AT TOP OF SECTION)
        ========================================================= */}
        <SectionTitle
          icon="person-outline"
          label="Personal Information"
          action="Edit"
          onAction={openPersonalEdit}
        />

        <Card>
          <InfoRow label="Full Name" value={nurseProfile.fullName} />
          <InfoRow label="Date of Birth" value={nurseProfile.dob || '14/08/1996'} />
          <InfoRow label="Gender" value={nurseProfile.gender || 'Female'} />
          <InfoRow
            label="Mobile Number"
            value={nurseProfile.phoneNumber}
            isVerified={true}
          />
          <InfoRow
            label="Alternate Number"
            value={nurseProfile.altPhone || '+91 98450 11234'}
          />
          <InfoRow label="Email Address" value={nurseProfile.email} />
          <InfoRow
            label="Residential Address"
            value={nurseProfile.residentialAddress}
          />
          <InfoRow label="City / Area" value={nurseProfile.cityArea} />
          <InfoRow label="Pincode" value={nurseProfile.pincode} last />
        </Card>

        {/* =========================================================
            2. PROFESSIONAL DETAILS (EDIT BUTTON AT TOP OF SECTION)
        ========================================================= */}
        <SectionTitle
          icon="medkit-outline"
          label="Professional Details"
          action="Edit"
          onAction={openProfessionalEdit}
        />

        <Card>
          <InfoRow
            label="Highest Qualification"
            value={nurseProfile.qualification}
          />
          <InfoRow
            label="Nursing License No."
            value={nurseProfile.licenseNumber}
          />
          <InfoRow
            label="Registration Authority / Council"
            value={nurseProfile.registrationAuthority}
          />
          <InfoRow
            label="Years of Experience"
            value={nurseProfile.yearsOfExperience}
          />

          {/* Clinical Skills / Specializations */}
          <View style={styles.skillsSection}>
            <Text style={styles.infoLabel}>Clinical Skills & Specializations</Text>
            <View style={styles.skillChipsWrap}>
              {Array.isArray(nurseProfile.specialization) ? (
                nurseProfile.specialization.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Ionicons name="medkit-outline" size={12} color="#071E42" />
                    <Text style={styles.skillChipText}>{skill}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.infoValue}>
                  {nurseProfile.specialization || 'Home Care, Wound Dressing, Post-Op Care'}
                </Text>
              )}
            </View>
          </View>

          <InfoRow
            label="Work Experience Summary"
            value={
              nurseProfile.workExperience ||
              'Apollo Hospitals (4 yrs), Senior Home Care Nurse (2 yrs)'
            }
            last
          />
        </Card>

        {/* =========================================================
            3. REGISTRATION CERTIFICATE & DOCUMENTS (UPDATE BUTTON AT TOP)
        ========================================================= */}
        <SectionTitle
          icon="ribbon-outline"
          label="Registration Certificate"
          action="Update"
          onAction={() => setCertUploadModal(true)}
        />

        <Card style={styles.certCard}>
          <View style={styles.certCardTop}>
            <View style={styles.certIconWrap}>
              <Ionicons name="document-text" size={26} color="#071E42" />
              <View style={styles.certTypePill}>
                <Text style={styles.certTypePillText}>PDF</Text>
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.certCouncilHeader}>
                {certData.council || 'Karnataka State Nursing Council'}
              </Text>
              <Text style={styles.certFileName} numberOfLines={1}>
                {certData.name || 'Nursing_Registration_Certificate.pdf'}
              </Text>
              <Text style={styles.certFileMeta}>
                {certData.size || '1.8 MB'} • {certData.uploadedDate || '12 Jan 2026'}
              </Text>
            </View>

            <View
              style={[
                styles.certStatusPill,
                nurseProfile.registrationStatus === 'Approved'
                  ? styles.certStatusVerified
                  : styles.certStatusPending,
              ]}
            >
              <Ionicons
                name={
                  nurseProfile.registrationStatus === 'Approved'
                    ? 'checkmark-circle'
                    : 'time-outline'
                }
                size={13}
                color={
                  nurseProfile.registrationStatus === 'Approved'
                    ? '#15803d'
                    : '#b45309'
                }
              />
              <Text
                style={[
                  styles.certStatusPillText,
                  {
                    color:
                      nurseProfile.registrationStatus === 'Approved'
                        ? '#15803d'
                        : '#b45309',
                  },
                ]}
              >
                {nurseProfile.registrationStatus === 'Approved'
                  ? 'Verified'
                  : 'Pending'}
              </Text>
            </View>
          </View>

          {/* Certificate Quick Info Strip */}
          <View style={styles.certInfoStrip}>
            <View style={styles.certStripCol}>
              <Text style={styles.certStripLabel}>LICENSE NO.</Text>
              <Text style={styles.certStripVal}>
                {nurseProfile.licenseNumber || 'KNC-2019-88421'}
              </Text>
            </View>
            <View style={styles.certStripDivider} />
            <View style={styles.certStripCol}>
              <Text style={styles.certStripLabel}>ISSUE DATE</Text>
              <Text style={styles.certStripVal}>
                {certData.issueDate || '14 May 2019'}
              </Text>
            </View>
            <View style={styles.certStripDivider} />
            <View style={styles.certStripCol}>
              <Text style={styles.certStripLabel}>COUNCIL</Text>
              <Text style={styles.certStripVal} numberOfLines={1}>
                {certData.council ? (certData.council.includes('Karnataka') ? 'KSNC' : 'INC') : 'KSNC'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.certCardBtnRow}>
            <TouchableOpacity
              style={styles.certPreviewBtn}
              onPress={() => setCertPreviewModal(true)}
              activeOpacity={0.75}
            >
              <Ionicons
                name="eye-outline"
                size={16}
                color="#071E42"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.certPreviewBtnText}>View Certificate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.certUpdateBtn}
              onPress={() => setCertUploadModal(true)}
              activeOpacity={0.75}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={16}
                color={colors.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.certUpdateBtnText}>Update Document</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Additional Documents Row */}
        <View style={{ marginTop: 10 }}>
          <DocumentItem
            title="Qualification Certificate"
            filename={nurseProfile.qualificationCertificate?.name || 'BSc_Nursing_Degree.pdf'}
            subtitle="Academic Nursing Degree / Diploma"
            status="Verified"
            onPress={() => setCertPreviewModal(true)}
          />
          <DocumentItem
            title="Government Photo ID"
            filename={nurseProfile.govtIdProof?.name || 'Aadhaar_Card_Verified.pdf'}
            subtitle="Government Identity Proof"
            status="Verified"
            onPress={() => setCertPreviewModal(true)}
          />
        </View>

        {/* =========================================================
            4. ADMIN APPROVAL STATUS (CHANGE OPTION AT TOP)
        ========================================================= */}
        <SectionTitle
          icon="shield-checkmark-outline"
          label="Registration Approval Status"
          action="Change"
          onAction={() => setStatusModal(true)}
        />

        <Card>
          <View
            style={[
              styles.statusBanner,
              nurseProfile.registrationStatus === 'Approved'
                ? styles.statusBannerApproved
                : nurseProfile.registrationStatus === 'Pending'
                ? styles.statusBannerPending
                : styles.statusBannerRejected,
            ]}
          >
            <Ionicons
              name={
                nurseProfile.registrationStatus === 'Approved'
                  ? 'shield-checkmark'
                  : nurseProfile.registrationStatus === 'Pending'
                  ? 'time'
                  : 'close-circle'
              }
              size={22}
              color={
                nurseProfile.registrationStatus === 'Approved'
                  ? '#15803d'
                  : nurseProfile.registrationStatus === 'Pending'
                  ? '#b45309'
                  : '#b91c1c'
              }
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[
                  styles.statusBannerTitle,
                  {
                    color:
                      nurseProfile.registrationStatus === 'Approved'
                        ? '#15803d'
                        : nurseProfile.registrationStatus === 'Pending'
                        ? '#b45309'
                        : '#b91c1c',
                  },
                ]}
              >
                {nurseProfile.registrationStatus}
              </Text>
              <Text style={styles.statusBannerDesc}>
                {nurseProfile.registrationStatus === 'Approved'
                  ? 'Super Admin verified credentials. Full access to patient nursing assignments granted.'
                  : nurseProfile.registrationStatus === 'Pending'
                  ? 'Application is currently under Super Admin review. Patient requests locked.'
                  : 'Application requires document correction or re-submission before login access.'}
              </Text>
            </View>
          </View>
        </Card>

        {/* =========================================================
            5. MANAGE (MATCHING DOCTOR PROFILE: AVAILABILITY, NOTIFICATIONS, SERVICE HISTORY)
        ========================================================= */}
        <SectionTitle icon="apps-outline" label="Manage" />

        <Card style={{ paddingVertical: 4 }}>
          <MenuRow
            icon="time-outline"
            label="Availability & Schedule"
            onPress={() => navigation.navigate('HomeNursingSchedule')}
          />

          <MenuRow
            icon="medkit-outline"
            label="Assigned Nursing Services"
            onPress={() => navigation.navigate('HomeNursingServices')}
          />

          <MenuRow
            icon="document-text-outline"
            label="Service History & Records"
            onPress={() => navigation.navigate('HomeNursingHistory')}
          />

          <MenuRow
            icon="notifications-outline"
            label="Notifications & Alerts"
            onPress={() => navigation.navigate('HomeNursingNotifications')}
            last
          />
        </Card>

        {/* =========================================================
            6. SETTINGS
        ========================================================= */}
        <SectionTitle icon="settings-outline" label="Settings" />

        <Card style={{ paddingVertical: 4 }}>
          <MenuRow
            icon="shield-checkmark-outline"
            label="Security & Privacy"
            onPress={() =>
              Alert.alert(
                'Security & Privacy',
                'Your credentials and medical documents are encrypted with 256-bit HIPAA compliance.'
              )
            }
          />

          <MenuRow
            icon="help-circle-outline"
            label="Help & Direct Support"
            onPress={() => setCallModalVisible(true)}
            last
          />
        </Card>

        {/* =========================================================
            7. LOG OUT
        ========================================================= */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={colors.danger}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>MediUnify Home Nursing · v1.0.0</Text>
      </ScrollView>

      {/* =========================================================
          PERSONAL INFORMATION MODAL
      ========================================================= */}
      <Modal
        visible={personalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPersonalModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContainer}>
            <ModalHeader
              title="Edit Personal Information"
              subtitle="Update your contact and residential details"
              onClose={() => setPersonalModal(false)}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <FormField
                label="Full Name"
                value={personalForm.fullName}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, fullName: text })
                }
                placeholder="Nurse Full Name"
              />

              <FormField
                label="Date of Birth"
                value={personalForm.dob}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, dob: text })
                }
                placeholder="DD/MM/YYYY"
              />

              <FormField
                label="Gender"
                value={personalForm.gender}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, gender: text })
                }
                placeholder="Female / Male / Other"
              />

              <FormField
                label="Mobile Number"
                value={personalForm.phoneNumber}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, phoneNumber: text })
                }
                placeholder="+91 Mobile Number"
                keyboardType="phone-pad"
              />

              <FormField
                label="Alternate Contact Number"
                value={personalForm.altPhone}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, altPhone: text })
                }
                placeholder="+91 Alternate Number"
                keyboardType="phone-pad"
              />

              <FormField
                label="Email Address"
                value={personalForm.email}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, email: text })
                }
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <FormField
                label="Residential Address"
                value={personalForm.residentialAddress}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, residentialAddress: text })
                }
                placeholder="House No., Street Name, Area"
                multiline
              />

              <FormField
                label="City / Area"
                value={personalForm.cityArea}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, cityArea: text })
                }
                placeholder="e.g. Indiranagar, Bangalore"
              />

              <FormField
                label="Pincode"
                value={personalForm.pincode}
                onChangeText={(text) =>
                  setPersonalForm({ ...personalForm, pincode: text })
                }
                placeholder="6-digit Pincode"
                keyboardType="number-pad"
              />

              <SaveButton
                title="Save Personal Information"
                onPress={savePersonalEdit}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* =========================================================
          PROFESSIONAL DETAILS MODAL
      ========================================================= */}
      <Modal
        visible={professionalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setProfessionalModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContainer}>
            <ModalHeader
              title="Edit Professional Details"
              subtitle="Update your nursing qualification and registration"
              onClose={() => setProfessionalModal(false)}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <FormField
                label="Highest Nursing Qualification"
                value={professionalForm.qualification}
                onChangeText={(text) =>
                  setProfessionalForm({ ...professionalForm, qualification: text })
                }
                placeholder="e.g. B.Sc Nursing / GNM"
              />

              <FormField
                label="Nursing License / Registration No."
                value={professionalForm.licenseNumber}
                onChangeText={(text) =>
                  setProfessionalForm({ ...professionalForm, licenseNumber: text })
                }
                placeholder="e.g. KNC-2019-88421"
                autoCapitalize="characters"
              />

              <FormField
                label="Registration Authority / Council"
                value={professionalForm.registrationAuthority}
                onChangeText={(text) =>
                  setProfessionalForm({
                    ...professionalForm,
                    registrationAuthority: text,
                  })
                }
                placeholder="e.g. Karnataka State Nursing Council"
              />

              <FormField
                label="Years of Experience"
                value={professionalForm.yearsOfExperience}
                onChangeText={(text) =>
                  setProfessionalForm({
                    ...professionalForm,
                    yearsOfExperience: text,
                  })
                }
                placeholder="e.g. 6+ years"
              />

              <FormField
                label="Specializations & Skills (comma separated)"
                value={professionalForm.specialization}
                onChangeText={(text) =>
                  setProfessionalForm({
                    ...professionalForm,
                    specialization: text,
                  })
                }
                placeholder="ICU Care, Wound Dressing, Post-Op Care"
                multiline
              />

              <FormField
                label="Work Experience Summary"
                value={professionalForm.workExperience}
                onChangeText={(text) =>
                  setProfessionalForm({
                    ...professionalForm,
                    workExperience: text,
                  })
                }
                placeholder="Brief summary of hospital and home care background"
                multiline
              />

              <SaveButton
                title="Save Professional Details"
                onPress={saveProfessionalEdit}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* =========================================================
          REGISTRATION CERTIFICATE PREVIEW MODAL
      ========================================================= */}
      <Modal
        visible={certPreviewModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCertPreviewModal(false)}
      >
        <View style={styles.certModalOverlay}>
          <View style={styles.certModalBox}>
            <View style={styles.certModalTopBar}>
              <View style={styles.certModalTopLeft}>
                <Ionicons name="shield-checkmark" size={20} color="#071E42" />
                <Text style={styles.certModalTitle}>Official Certificate</Text>
              </View>
              <TouchableOpacity
                onPress={() => setCertPreviewModal(false)}
                style={styles.certModalCloseBtn}
              >
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.certDocPaper}>
                <View style={styles.certDocInnerBorder}>
                  <View style={styles.certSealBadge}>
                    <Ionicons name="ribbon" size={22} color="#b45309" />
                  </View>

                  <Text style={styles.certGovtTitle}>
                    NURSING & MIDWIFERY REGISTRATION
                  </Text>
                  <Text style={styles.certCouncilSub}>
                    {certData.council || 'Karnataka State Nursing Council'}
                  </Text>

                  <Text style={styles.certMainHeading}>
                    CERTIFICATE OF REGISTRATION
                  </Text>

                  <View style={styles.certDividerLine} />

                  <Text style={styles.certCertifiesThat}>
                    This is to officially certify that
                  </Text>
                  <Text style={styles.certNurseName}>
                    {nurseProfile.fullName || 'Nurse Kavitha R.'}
                  </Text>
                  <Text style={styles.certCertifiesText}>
                    has been duly registered as a Registered Nurse & Midwife with
                    the State Nursing Council, entitled to practice home nursing
                    and clinical care.
                  </Text>

                  <View style={styles.certInfoRow}>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>REGISTRATION NO.</Text>
                      <Text style={styles.certInfoVal}>
                        {nurseProfile.licenseNumber || 'KNC-2019-88421'}
                      </Text>
                    </View>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>QUALIFICATION</Text>
                      <Text style={styles.certInfoVal}>
                        {nurseProfile.qualification || 'B.Sc Nursing'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.certInfoRow}>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>COUNCIL</Text>
                      <Text style={styles.certInfoVal}>
                        {certData.council || 'State Nursing Council'}
                      </Text>
                    </View>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>REGISTRATION DATE</Text>
                      <Text style={styles.certInfoVal}>
                        {certData.issueDate || '14 May 2019'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.certInfoRow}>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>STATUS</Text>
                      <Text
                        style={[
                          styles.certInfoVal,
                          {
                            color:
                              nurseProfile.registrationStatus === 'Approved'
                                ? '#15803d'
                                : '#b45309',
                          },
                        ]}
                      >
                        {nurseProfile.registrationStatus || 'Approved'}
                      </Text>
                    </View>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>FILE</Text>
                      <Text style={styles.certInfoVal} numberOfLines={1}>
                        {certData.name || 'Certificate.pdf'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.certSealRow}>
                    <View style={styles.certOfficialStamp}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#16a34a"
                      />
                      <Text style={styles.certStampText}>
                        SUPER ADMIN VERIFIED CREDENTIALS
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.certModalDoneBtn}
                onPress={() => setCertPreviewModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.certModalDoneBtnText}>Close Preview</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          CERTIFICATE UPDATE / UPLOAD MODAL
      ========================================================= */}
      <Modal
        visible={certUploadModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCertUploadModal(false)}
      >
        <View style={styles.certSheetOverlay}>
          <View style={styles.certSheetContainer}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>
                  Update Registration Certificate
                </Text>
                <Text style={styles.sheetSubtitle}>
                  Upload or select replacement council certificate
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCertUploadModal(false)}
                style={styles.sheetCloseBtn}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetOptions}>
              <TouchableOpacity
                style={styles.sheetOptionCard}
                onPress={() =>
                  handleUpdateCertificate({
                    name: `${(nurseProfile.licenseNumber || 'KNC_NURSE').replace(
                      /[^a-zA-Z0-9]/g,
                      '_'
                    )}_State_Council_Cert.pdf`,
                    size: '2.1 MB',
                    council: 'Karnataka State Nursing Council (KSNC)',
                    issueDate: '14 May 2019',
                  })
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.sheetOptionIcon,
                    { backgroundColor: '#e0f2fe' },
                  ]}
                >
                  <Ionicons name="document-text" size={22} color="#0284c7" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.sheetOptionTitle}>
                    State Nursing Council (KSNC / TNC)
                  </Text>
                  <Text style={styles.sheetOptionDesc}>
                    Official state council registration certificate (PDF)
                  </Text>
                </View>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetOptionCard}
                onPress={() =>
                  handleUpdateCertificate({
                    name: `${(nurseProfile.licenseNumber || 'INC_NURSE').replace(
                      /[^a-zA-Z0-9]/g,
                      '_'
                    )}_INC_Central_Cert.pdf`,
                    size: '2.5 MB',
                    council: 'Indian Nursing Council (INC)',
                    issueDate: '10 Aug 2021',
                  })
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.sheetOptionIcon,
                    { backgroundColor: '#fef3c7' },
                  ]}
                >
                  <Ionicons name="ribbon" size={22} color="#d97706" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.sheetOptionTitle}>
                    Indian Nursing Council (INC)
                  </Text>
                  <Text style={styles.sheetOptionDesc}>
                    Central national nursing registration proof
                  </Text>
                </View>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetOptionCard}
                onPress={() =>
                  handleUpdateCertificate({
                    name: `${(nurseProfile.fullName || 'Nurse').replace(
                      /[^a-zA-Z0-9]/g,
                      '_'
                    )}_Scanned_Certificate.png`,
                    size: '1.4 MB',
                    council: 'State Nursing Council',
                    issueDate: '12 Jan 2024',
                  })
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.sheetOptionIcon,
                    { backgroundColor: '#dcfce7' },
                  ]}
                >
                  <Ionicons name="image" size={22} color="#16a34a" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.sheetOptionTitle}>
                    Physical Certificate Scan (PNG / JPG)
                  </Text>
                  <Text style={styles.sheetOptionDesc}>
                    High-resolution scanned council document
                  </Text>
                </View>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setCertUploadModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          ADMIN REGISTRATION STATUS SWITCHER MODAL (FOR TESTING)
      ========================================================= */}
      <Modal
        visible={statusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ModalHeader
              title="Change Registration Status"
              subtitle="Test Admin approval gate workflows"
              onClose={() => setStatusModal(false)}
            />

            <View style={{ gap: 10, paddingVertical: 14 }}>
              {[
                {
                  status: 'Approved',
                  color: '#15803d',
                  bg: '#dcfce7',
                  desc: 'Super Admin Approved — Full access to patient nursing assignments',
                },
                {
                  status: 'Pending',
                  color: '#b45309',
                  bg: '#fef3c7',
                  desc: 'Under Review — Patient assignments gated until verification',
                },
                {
                  status: 'Rejected',
                  color: '#b91c1c',
                  bg: '#fee2e2',
                  desc: 'Registration Rejected — Requires document correction and re-submission',
                },
              ].map((item) => (
                <TouchableOpacity
                  key={item.status}
                  style={[
                    styles.statusOptionRow,
                    nurseProfile.registrationStatus === item.status && {
                      borderColor: item.color,
                      backgroundColor: item.bg,
                    },
                  ]}
                  onPress={() => {
                    setRegistrationStatus(item.status);
                    setStatusModal(false);
                    Alert.alert(
                      'Status Updated',
                      `Registration status changed to "${item.status}".`
                    );
                  }}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={
                      item.status === 'Approved'
                        ? 'checkmark-circle'
                        : item.status === 'Pending'
                        ? 'time'
                        : 'close-circle'
                    }
                    size={22}
                    color={item.color}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={[styles.statusOptionTitle, { color: item.color }]}
                    >
                      {item.status}
                    </Text>
                    <Text style={styles.statusOptionDesc}>{item.desc}</Text>
                  </View>
                  {nurseProfile.registrationStatus === item.status && (
                    <Ionicons
                      name="radio-button-on"
                      size={20}
                      color={item.color}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* QUICK CALL / EMERGENCY MODAL */}
      <CallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        patientName={nurseProfile.fullName}
        patientPhone={nurseProfile.phoneNumber}
      />
    </View>
  );
}

/* =========================================================
   HELPER SUB-COMPONENTS (MATCHING DOCTOR PROFILE SCREEN)
========================================================= */

function SectionTitle({ icon, label, action, onAction }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionTitleLeft}>
        <Ionicons name={icon} size={15} color="#071E42" />
        <Text style={styles.sectionTitle}>{label}</Text>
      </View>

      {action && (
        <TouchableOpacity
          style={styles.sectionEditButton}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={14} color="#071E42" />
          <Text style={styles.sectionEditText}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function InfoRow({ label, value, last, isVerified }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueWrap}>
        <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
        {isVerified && (
          <View style={styles.inlineVerifiedPill}>
            <Ionicons name="checkmark-circle" size={12} color="#15803d" />
            <Text style={styles.inlineVerifiedText}>Verified</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function MenuRow({ icon, label, onPress, last }) {
  return (
    <TouchableOpacity
      style={[styles.menuRow, !last && styles.menuRowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconWrap}>
        <Ionicons name={icon} size={17} color="#071E42" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

function DocumentItem({ title, filename, subtitle, status, onPress }) {
  return (
    <TouchableOpacity
      style={styles.docItemCard}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.docItemIconWrap}>
        <Ionicons name="document-text" size={18} color="#071E42" />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.docItemTitle}>{title}</Text>
        <Text style={styles.docItemFilename} numberOfLines={1}>
          {filename}
        </Text>
        <Text style={styles.docItemSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.docItemRight}>
        <View style={styles.docVerifiedTag}>
          <Ionicons name="checkmark-circle" size={12} color="#15803d" />
          <Text style={styles.docVerifiedText}>{status}</Text>
        </View>
        <Ionicons
          name="eye-outline"
          size={16}
          color="#071E42"
          style={{ marginTop: 4 }}
        />
      </View>
    </TouchableOpacity>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <View style={styles.modalHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  multiline,
}) {
  return (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'sentences'}
        multiline={multiline}
        style={[styles.formInput, multiline && styles.multilineInput]}
      />
    </View>
  );
}

function SaveButton({ title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.saveButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name="checkmark-circle-outline"
        size={20}
        color={colors.white}
      />
      <Text style={styles.saveButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   STYLES (MATCHING DOCTOR PROFILE STYLING EXACTLY)
========================================================= */

const styles = StyleSheet.create({
  /* HEADER */
  header: {
    backgroundColor: '#061A3A',
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 56,
    paddingBottom: 28,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  brandName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  brandMedi: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  brandUnify: {
    color: '#38BDF8',
    fontWeight: '800',
  },

  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#061A3A',
  },

  /* NURSE PROFILE AVATAR BLOCK (NO EDIT BUTTON HERE) */
  avatarBlock: {
    alignItems: 'center',
    marginTop: spacing.md,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#38BDF8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  name: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 20,
  },

  spec: {
    ...typography.small,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },

  regBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    marginTop: 10,
  },

  regText: {
    ...typography.tiny,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  /* SECTION TITLE WITH EDIT BUTTON */
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  sectionTitle: {
    ...typography.h3,
    fontSize: 15,
    color: '#071E42',
    fontWeight: '700',
  },

  sectionEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: '#EEF4FC',
  },

  sectionEditText: {
    ...typography.smallBold,
    color: '#071E42',
    fontSize: 12,
  },

  /* INFO ROWS */
  infoRow: {
    paddingVertical: 10,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  infoLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },

  infoValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },

  infoValue: {
    ...typography.smallBold,
    color: colors.textPrimary,
    flex: 1,
  },

  inlineVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: radius.pill,
  },

  inlineVerifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },

  /* SKILLS & CHIPS */
  skillsSection: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  skillChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },

  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },

  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#071E42',
  },

  /* CERTIFICATE CARD (MATCHING DOCTOR CERTIFICATE) */
  certCard: {
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: radius.lg,
  },

  certCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  certIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    position: 'relative',
  },

  certTypePill: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#071E42',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },

  certTypePillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  certCouncilHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  certFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },

  certFileMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  certStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
  },

  certStatusVerified: {
    backgroundColor: '#DCFCE7',
  },

  certStatusPending: {
    backgroundColor: '#FEF3C7',
  },

  certStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  certInfoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },

  certStripCol: {
    flex: 1,
    alignItems: 'center',
  },

  certStripDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },

  certStripLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },

  certStripVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#071E42',
    marginTop: 2,
  },

  certCardBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },

  certPreviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 9,
    borderRadius: radius.md,
  },

  certPreviewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },

  certUpdateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 9,
    borderRadius: radius.md,
  },

  certUpdateBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* ADDITIONAL DOCUMENT CARDS */
  docItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    padding: 10,
    marginBottom: 8,
  },

  docItemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  docItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },

  docItemFilename: {
    fontSize: 11,
    color: colors.textPrimary,
    marginTop: 1,
  },

  docItemSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },

  docItemRight: {
    alignItems: 'flex-end',
  },

  docVerifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
  },

  docVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },

  /* STATUS BANNER */
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  statusBannerApproved: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },

  statusBannerPending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },

  statusBannerRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },

  statusBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },

  statusBannerDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },

  /* MENU ROWS (MATCHING DOCTOR PROFILE) */
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },

  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuLabel: {
    flex: 1,
    ...typography.small,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  /* LOGOUT & FOOTER */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.xl,
    paddingVertical: 14,
  },

  logoutText: {
    ...typography.bodyBold,
    color: colors.danger,
  },

  version: {
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },

  /* MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '85%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  modalSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },

  closeButton: {
    padding: 4,
  },

  formField: {
    marginBottom: spacing.md,
  },

  fieldLabel: {
    ...typography.smallBold,
    color: colors.textPrimary,
    marginBottom: 6,
  },

  formInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },

  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  saveButton: {
    backgroundColor: '#071E42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },

  saveButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },

  /* CERTIFICATE PREVIEW MODAL STYLES */
  certModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 33, 31, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  certModalBox: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxHeight: '90%',
  },

  certModalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  certModalTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  certModalTitle: {
    ...typography.bodyBold,
    color: '#071E42',
  },

  certModalCloseBtn: {
    padding: 4,
  },

  certDocPaper: {
    backgroundColor: '#fffdf7',
    borderWidth: 2,
    borderColor: '#d4af37',
    borderRadius: 8,
    padding: 8,
  },

  certDocInnerBorder: {
    borderWidth: 1,
    borderColor: '#e8d595',
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: spacing.md,
    alignItems: 'center',
  },

  certSealBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },

  certGovtTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#92400e',
  },

  certCouncilSub: {
    fontSize: 9,
    color: '#b45309',
    marginTop: 2,
    letterSpacing: 0.5,
  },

  certMainHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 8,
    letterSpacing: 1,
  },

  certDividerLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#e8d595',
    marginVertical: 10,
  },

  certCertifiesThat: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },

  certNurseName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#071E42',
    marginVertical: 4,
    textAlign: 'center',
  },

  certCertifiesText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },

  certInfoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1ebd2',
  },

  certInfoCol: {
    flex: 1,
  },

  certInfoKey: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },

  certInfoVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },

  certSealRow: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },

  certOfficialStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#86efac',
  },

  certStampText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803d',
    marginLeft: 4,
    letterSpacing: 0.5,
  },

  certModalDoneBtn: {
    backgroundColor: '#071E42',
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },

  certModalDoneBtnText: {
    color: colors.white,
    ...typography.bodyBold,
  },

  /* SHEET MODAL (UPLOAD / SELECT CERTIFICATE) */
  certSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 33, 31, 0.65)',
    justifyContent: 'flex-end',
  },

  certSheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },

  sheetTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  sheetSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },

  sheetCloseBtn: {
    padding: 4,
  },

  sheetOptions: {
    gap: spacing.sm,
  },

  sheetOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    padding: spacing.md,
  },

  sheetOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sheetOptionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
  },

  sheetOptionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  sheetCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  sheetCancelBtnText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },

  /* STATUS OPTION ROWS */
  statusOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },

  statusOptionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },

  statusOptionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
