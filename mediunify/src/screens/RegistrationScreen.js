import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, radius, spacing, typography } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Gynecologist',
  'Neurologist',
  'ENT Specialist',
  'Psychiatrist',
  'Ophthalmologist',
];

export default function RegistrationScreen({ navigation }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCertPickerModal, setShowCertPickerModal] = useState(false);
  const [showCertPreviewModal, setShowCertPreviewModal] = useState(false);
  const [showSpecPickerModal, setShowSpecPickerModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    regNo: '',
    regCertificate: null,
    password: '',
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSelectCertificate = (preset) => {
    const regPrefix = form.regNo ? form.regNo.replace(/[^a-zA-Z0-9]/g, '_') : 'MCI_DOC';
    const cert = {
      name: preset?.name || `${regPrefix}_Registration_Certificate.pdf`,
      size: preset?.size || '1.8 MB',
      uploadedDate: 'Uploaded just now',
      status: 'Ready for Super Admin Verification',
      council: preset?.council || 'Medical Council of India',
      issueDate: preset?.issueDate || '14 May 2019',
    };
    update('regCertificate', cert);
    setShowCertPickerModal(false);
  };

  const handleRemoveCertificate = () => {
    update('regCertificate', null);
  };

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.regNo.trim() || !form.password.trim()) {
      Alert.alert('Required Fields', 'Please fill in all doctor details.');
      return;
    }

    setLoading(true);
    const certToSave = form.regCertificate || (form.regNo ? {
      name: `${form.regNo.replace(/[^a-zA-Z0-9]/g, '_')}_Registration_Certificate.pdf`,
      size: '2.1 MB',
      uploadedDate: 'Uploaded during registration',
      status: 'Under Super Admin Review',
      council: 'Medical Council of India',
      issueDate: 'Recently Registered',
    } : null);

    await register({ ...form, regCertificate: certToSave });
    setLoading(false);
    setShowPopup(true);
  };

  const handlePopupOk = () => {
    setShowPopup(false);
    navigation.replace('Login', { justRegistered: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* TOP BAR / BACK BUTTON */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#08317C" style={{ top: 35 }} />
            </TouchableOpacity>
          </View>

          {/* BRAND LOGO & TITLE */}
          <View style={styles.headerSection}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Create Doctor Account</Text>
            <Text style={styles.subtitle}>Join MediUnify and start your journey.</Text>
          </View>

          {/* FORM FIELDS */}
          <View style={styles.formContainer}>
            {/* 1. Full Name */}
            <AppInput
              icon="person-outline"
              placeholder="Full Name"
              value={form.name}
              onChangeText={(v) => update('name', v)}
              style={{ marginBottom: 14 }}
              inputWrapperStyle={styles.inputWrapper}
            />

            {/* 2. Email Address */}
            <AppInput
              icon="mail-outline"
              placeholder="Email Address"
              value={form.email}
              onChangeText={(v) => update('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 14 }}
              inputWrapperStyle={styles.inputWrapper}
            />

            {/* 3. Phone Number */}
            <AppInput
              icon="call-outline"
              placeholder="Phone Number"
              value={form.phone}
              onChangeText={(v) => update('phone', v)}
              keyboardType="phone-pad"
              style={{ marginBottom: 14 }}
              inputWrapperStyle={styles.inputWrapper}
            />

            {/* 4. Specialization */}
            <TouchableOpacity
              onPress={() => setShowSpecPickerModal(true)}
              activeOpacity={0.8}
              style={{ marginBottom: 14 }}
            >
              <View style={[styles.inputWrapper, styles.specWrapper]}>
                <Ionicons name="medkit-outline" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
                <Text style={[styles.specText, !form.specialization && { color: colors.textMuted }]}>
                  {form.specialization || 'Specialization'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
              </View>
            </TouchableOpacity>

            {/* 5. Medical Registration Number */}
            <AppInput
              icon="card-outline"
              placeholder="Medical Registration Number"
              value={form.regNo}
              onChangeText={(v) => update('regNo', v)}
              autoCapitalize="characters"
              style={{ marginBottom: 14 }}
              inputWrapperStyle={styles.inputWrapper}
            />

            {/* 6. Upload Registration Certificate */}
            <View style={styles.certUploadSection}>
              <View style={styles.certHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.certLabel}>Registration Certificate</Text>
                </View>
                <View style={styles.certRequiredBadge}>
                  <Text style={styles.certRequiredText}>Required*</Text>
                </View>
              </View>

              {!form.regCertificate ? (
                <TouchableOpacity
                  style={styles.uploadBox}
                  onPress={() => setShowCertPickerModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="cloud-upload-outline" size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.uploadMainText}>Upload Registration Certificate</Text>
                  <Text style={styles.uploadHintText}>Tap to choose PDF or Image certificate</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.certAttachedCard}>
                  <View style={styles.certAttachedTop}>
                    <View style={styles.fileIconWrap}>
                      <Ionicons name="document-text" size={24} color={colors.primary} />
                      <View style={styles.fileTypeBadge}>
                        <Text style={styles.fileTypeText}>PDF</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.certFileName} numberOfLines={1}>
                        {form.regCertificate.name}
                      </Text>
                      <Text style={styles.certFileSize}>{form.regCertificate.size} · {form.regCertificate.uploadedDate}</Text>
                    </View>
                    <TouchableOpacity onPress={handleRemoveCertificate} style={styles.certDeleteBtn}>
                      <Ionicons name="close-circle" size={20} color="#DC2626" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.certActionsRow}>
                    <TouchableOpacity
                      style={styles.previewBtn}
                      onPress={() => setShowCertPreviewModal(true)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={15} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.previewBtnText}>Preview Certificate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.changeBtn}
                      onPress={() => setShowCertPickerModal(true)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="sync-outline" size={15} color="#08317C" style={{ marginRight: 4 }} />
                      <Text style={styles.changeBtnText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* 7. Password */}
            <AppInput
              icon="lock-closed-outline"
              placeholder="Password"
              secure
              value={form.password}
              onChangeText={(v) => update('password', v)}
              style={{ marginBottom: 20 }}
              inputWrapperStyle={styles.inputWrapper}
            />

            {/* CREATE ACCOUNT BUTTON */}
            <TouchableOpacity
              style={styles.createBtn}
              onPress={handleRegister}
              activeOpacity={0.88}
              disabled={loading}
            >
              <Text style={styles.createBtnText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* SIGN IN LINK */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTTOM WAVES */}
          <View style={styles.bottomArea} pointerEvents="none">
            <View style={styles.waveLayer1} />
            <View style={styles.waveLayer2} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Specialization Picker Modal */}
      <Modal
        visible={showSpecPickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSpecPickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Specialization</Text>
              <TouchableOpacity onPress={() => setShowSpecPickerModal(false)}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 350 }}>
              {SPECIALIZATIONS.map((spec) => (
                <TouchableOpacity
                  key={spec}
                  style={[styles.specOptionItem, form.specialization === spec && styles.specOptionSelected]}
                  onPress={() => {
                    update('specialization', spec);
                    setShowSpecPickerModal(false);
                  }}
                >
                  <Text style={[styles.specOptionText, form.specialization === spec && styles.specOptionTextSelected]}>
                    {spec}
                  </Text>
                  {form.specialization === spec && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Certificate Picker Modal */}
      <Modal
        visible={showCertPickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCertPickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Attach Registration Document</Text>
              <TouchableOpacity onPress={() => setShowCertPickerModal(false)}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sheetOptionCard}
              onPress={() => handleSelectCertificate({
                name: `MCI_${(form.regNo || '2026').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Copy.pdf`,
                size: '1.8 MB',
                council: 'National Medical Commission (NMC / MCI)',
                issueDate: '14 May 2019',
              })}
              activeOpacity={0.7}
            >
              <View style={[styles.sheetOptionIcon, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="document-text" size={22} color="#0284c7" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.sheetOptionTitle}>Medical Council Certificate (PDF)</Text>
                <Text style={styles.sheetOptionDesc}>Official MCI / NMC registration certificate copy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetOptionCard}
              onPress={() => handleSelectCertificate({
                name: `${(form.regNo || 'SMC_2026').replace(/[^a-zA-Z0-9]/g, '_')}_State_Council_Cert.pdf`,
                size: '2.3 MB',
                council: 'State Medical Council (Karnataka / Delhi)',
                issueDate: '08 Aug 2021',
              })}
              activeOpacity={0.7}
            >
              <View style={[styles.sheetOptionIcon, { backgroundColor: '#EEF4FC' }]}>
                <Ionicons name="ribbon" size={22} color="#08317C" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.sheetOptionTitle}>State Medical Council Certificate</Text>
                <Text style={styles.sheetOptionDesc}>State council practitioner license & registration</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Certificate Preview Modal */}
      <Modal
        visible={showCertPreviewModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCertPreviewModal(false)}
      >
        <View style={styles.certPreviewOverlay}>
          <View style={styles.certPreviewCard}>
            <View style={styles.certPreviewHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="ribbon-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.certPreviewTitle}>Certificate Preview</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCertPreviewModal(false)}>
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.md }}>
              <View style={styles.certPaper}>
                <View style={styles.certInnerBorder}>
                  <View style={styles.certCouncilHeader}>
                    <View style={styles.certSealBadge}>
                      <Ionicons name="shield-checkmark" size={28} color="#08317C" />
                    </View>
                    <Text style={styles.certGovtTitle}>NATIONAL MEDICAL COMMISSION</Text>
                    <Text style={styles.certCouncilSub}>GOVERNMENT OF INDIA · MEDICAL COUNCIL</Text>
                    <Text style={styles.certMainHeading}>CERTIFICATE OF REGISTRATION</Text>
                  </View>

                  <View style={styles.certDividerLine} />
                  <Text style={styles.certCertifiesThat}>This is to certify that</Text>
                  <Text style={styles.certDoctorName}>
                    {form.name ? (form.name.startsWith('Dr.') ? form.name : `Dr. ${form.name}`) : 'Dr. Doctor'}
                  </Text>
                  <Text style={styles.certCertifiesText}>
                    has been duly registered as a Medical Practitioner under the Indian Medical Council Act with all privileges appertaining thereto.
                  </Text>

                  <View style={styles.certInfoRow}>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>REGISTRATION NO.</Text>
                      <Text style={styles.certInfoVal}>{form.regNo || 'MCI-2019-887341'}</Text>
                    </View>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>DATE OF ISSUE</Text>
                      <Text style={styles.certInfoVal}>{form.regCertificate?.issueDate || '14 May 2019'}</Text>
                    </View>
                  </View>

                  <View style={styles.certFooterBadge}>
                    <Ionicons name="checkmark-done-circle" size={16} color={colors.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.certVerifiedStamp}>AUTHENTICATED MEDICAL LICENSE</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Account Creation Popup Modal */}
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={handlePopupOk}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="shield-checkmark" size={36} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Verification Submitted</Text>
            <Text style={styles.modalMessage}>
              Thanks doctor! Your credentials have been submitted for super admin verification. We will notify you once your profile is approved.
            </Text>
            <AppButton
              title="OK"
              variant="primary"
              onPress={handlePopupOk}
              style={styles.modalOkBtn}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  /* Top Bar */
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Brand Header */
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  logoWrap: {
    width: Math.min(width * 0.7, 260),
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.small,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },

  /* Form Container */
  formContainer: {
    paddingHorizontal: 24,
    width: '100%',
  },
  inputWrapper: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
  },
  specWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },

  /* Certificate Upload */
  certUploadSection: {
    marginBottom: 14,
  },
  certHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  certLabel: {
    ...typography.smallBold,
    color: '#334155',
  },
  certRequiredBadge: {
    backgroundColor: colors.primarySurface,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  certRequiredText: {
    ...typography.tinyBold,
    color: colors.primary,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#00B89445',
    borderStyle: 'dashed',
    borderRadius: 14,
    backgroundColor: '#F7FCFB',
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  uploadMainText: {
    ...typography.smallBold,
    color: '#08317C',
    textAlign: 'center',
  },
  uploadHintText: {
    ...typography.tiny,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },

  /* Attached certificate card */
  certAttachedCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  certAttachedTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fileTypeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#08317C',
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  fileTypeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  certFileName: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },
  certFileSize: {
    ...typography.tiny,
    color: '#64748B',
    marginTop: 2,
  },
  certDeleteBtn: {
    padding: 4,
  },
  certActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  previewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySurface,
    borderRadius: radius.pill,
    paddingVertical: 6,
  },
  previewBtnText: {
    ...typography.tinyBold,
    color: colors.primary,
  },
  changeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FC',
    borderRadius: radius.pill,
    paddingVertical: 6,
  },
  changeBtnText: {
    ...typography.tinyBold,
    color: '#08317C',
  },

  /* Create Account Button */
  createBtn: {
    backgroundColor: '#00B894',
    height: 50,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  createBtnText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Footer Link */
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 13,
    color: '#00B894',
    fontWeight: '700',
  },

  /* Bottom Waves */
  bottomArea: {
    height: 90,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 16,
  },
  waveLayer1: {
    position: 'absolute',
    width: width * 1.6,
    height: 120,
    borderRadius: width * 0.8,
    backgroundColor: '#E6FAF6',
    bottom: -60,
    left: -width * 0.3,
    transform: [{ rotate: '-8deg' }],
  },
  waveLayer2: {
    position: 'absolute',
    width: width * 1.5,
    height: 110,
    borderRadius: width * 0.75,
    backgroundColor: '#B2EFE6',
    bottom: -65,
    left: -width * 0.1,
    transform: [{ rotate: '6deg' }],
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    ...typography.h3,
    color: '#08317C',
    fontWeight: '700',
  },
  sheetOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  sheetOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOptionTitle: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },
  sheetOptionDesc: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  specOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specOptionSelected: {
    backgroundColor: colors.primarySurface,
    borderRadius: 8,
  },
  specOptionText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  specOptionTextSelected: {
    fontWeight: '700',
    color: colors.primary,
  },

  /* Preview Modal Paper */
  certPreviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  certPreviewCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  certPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  certPreviewTitle: {
    ...typography.bodyBold,
    color: '#08317C',
  },
  certPaper: {
    backgroundColor: '#FFFDF9',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#08317C',
    padding: 14,
  },
  certInnerBorder: {
    borderWidth: 1,
    borderColor: '#08317C55',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  certCouncilHeader: {
    alignItems: 'center',
  },
  certSealBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  certGovtTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: 1,
  },
  certCouncilSub: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  certMainHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  certDividerLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#08317C35',
    marginVertical: 10,
  },
  certCertifiesThat: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#64748B',
  },
  certDoctorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
    marginVertical: 4,
  },
  certCertifiesText: {
    fontSize: 10,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 15,
  },
  certInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  certInfoCol: {
    alignItems: 'center',
  },
  certInfoKey: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: '700',
  },
  certInfoVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  certFooterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: colors.primarySurface,
  },
  certVerifiedStamp: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
  },

  /* Alert modal */
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: '#08317C',
    marginBottom: spacing.sm,
  },
  modalMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  modalOkBtn: {
    width: '100%',
  },
});
