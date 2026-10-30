import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { doctor } from '../data/mockData';

export default function ClaimProfileScreen({ navigation }) {
  const { login, skipVerification } = useAuth();

  // 3-Step Flow: 1: Profile Confirmation, 2: Contact Verification, 3: Review & Submit
  const [currentStep, setCurrentStep] = useState(1);

  // Step 2 Fields
  const [email, setEmail] = useState('dr.ananya@mediunify.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('Doctor@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);

  // Step 3 Checkbox Agreement
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Success Claim Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password strength calculation (0 to 4)
  const passwordStrength = (() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  })();

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      return;
    }
    try {
      navigation.navigate('RoleSelectionScreen');
    } catch (e) {
      try {
        navigation.navigate('RoleSelection');
      } catch (err) {
        navigation.goBack();
      }
    }
  };

  const handleVerifyEmail = () => {
    setIsEmailVerified(true);
    Alert.alert('Email Verified', 'Email address verified successfully for demo.');
  };

  const handleVerifyPhone = () => {
    setIsPhoneVerified(true);
    Alert.alert('Phone Verified', 'Mobile number verified successfully for demo.');
  };

  const handleStep1YesItIsMyProfile = () => {
    setCurrentStep(2);
  };

  const handleStep2Continue = () => {
    setCurrentStep(3);
  };

  const handleStep3Submit = () => {
    if (!agreedToTerms) {
      Alert.alert('Agreement Required', 'Please accept the declaration before claiming your profile.');
      return;
    }
    // Show pop-up "your profile is claim successfully"
    setShowSuccessModal(true);
  };

  const handleSuccessOk = async () => {
    setShowSuccessModal(false);
    setLoading(true);
    try {
      const demoEmail = (email && email.trim()) || 'dr.ananya@mediunify.com';
      const demoPhone = (phone && phone.trim()) || '+91 98765 43210';
      const demoPassword = (password && password.trim()) || 'Doctor@2026';

      if (doctor) {
        doctor.email = demoEmail;
        doctor.phone = demoPhone;
      }

      await login({
        email: demoEmail,
        phone: demoPhone,
        password: demoPassword,
      });

      // Direct to doctor dashboard
      try {
        navigation.navigate('MainTabs');
      } catch (err) {
        try {
          navigation.navigate('DashboardScreen');
        } catch (e2) {}
      }
    } catch (e) {
      if (skipVerification) {
        skipVerification();
      }
      try {
        navigation.navigate('MainTabs');
      } catch (err) {
        try {
          navigation.navigate('DashboardScreen');
        } catch (e2) {}
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* HEADER SECTION (Deep Navy Blue #061A3A) */}
      <View style={styles.header}>
        <View style={styles.decorativeCircle} />

        {/* Back to profile button row */}
        <TouchableOpacity style={styles.backRow} onPress={handleBack} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backText}>
            {currentStep === 1 ? 'Back to role selection' : 'Back'}
          </Text>
        </TouchableOpacity>

        {/* Doctor Avatar / Icon with Camera Badge */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={44} color="#00897B" />
          </View>
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={13} color="#FFFFFF" />
          </View>
        </View>

        {/* Stepper Progress Indicator */}
        <View style={styles.stepperWrap}>
          <View style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, currentStep >= 1 && styles.stepDotTextActive]}>1</Text>
          </View>
          <View style={[styles.stepTrack, currentStep >= 2 && styles.stepTrackActive]} />
          <View style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, currentStep >= 2 && styles.stepDotTextActive]}>2</Text>
          </View>
          <View style={[styles.stepTrack, currentStep >= 3 && styles.stepTrackActive]} />
          <View style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, currentStep >= 3 && styles.stepDotTextActive]}>3</Text>
          </View>
        </View>
      </View>

      {/* WHITE CARD CONTENT SECTION */}
      <View style={styles.bodyCard}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ========================================================== */}
          {/* STEP 1: SHOW MOCK PROFILE DATA + "YES IT'S MY PROFILE"      */}
          {/* ========================================================== */}
          {currentStep === 1 && (
            <View style={styles.stepContentWrap}>
              <Text style={styles.title}>Is this your doctor profile?</Text>
              <Text style={styles.subtitle}>
                We found your existing clinical profile in the Mediunify network.
              </Text>

              {/* Mock Doctor Profile Box */}
              <View style={styles.mockProfileBox}>
                <View style={styles.mockHeaderRow}>
                  <View style={styles.mockAvatarCircle}>
                    <Text style={styles.mockAvatarInitials}>AR</Text>
                  </View>
                  <View style={styles.mockInfoCol}>
                    <Text style={styles.mockDocName}>Dr. Ananya Rao</Text>
                    <Text style={styles.mockDocSpec}>MBBS, MD - General Medicine</Text>
                    <Text style={styles.mockDocReg}>MCI: MCI-84920-KA (KMC)</Text>
                  </View>
                </View>

                <View style={styles.mockDivider} />

                <View style={styles.mockClinicRow}>
                  <Ionicons name="business-outline" size={16} color="#00B894" />
                  <Text style={styles.mockClinicText}>
                    Mediunify Multi-Speciality Clinic, Indiranagar, Bengaluru
                  </Text>
                </View>

                <View style={styles.mockStatsRow}>
                  <View style={styles.mockStatItem}>
                    <Text style={styles.mockStatNum}>12+ Yrs</Text>
                    <Text style={styles.mockStatLbl}>Experience</Text>
                  </View>
                  <View style={styles.statSep} />
                  <View style={styles.mockStatItem}>
                    <Text style={styles.mockStatNum}>4.9 ★</Text>
                    <Text style={styles.mockStatLbl}>1,240 Reviews</Text>
                  </View>
                  <View style={styles.statSep} />
                  <View style={styles.mockStatItem}>
                    <Text style={styles.mockStatNum}>Verified</Text>
                    <Text style={styles.mockStatLbl}>MCI Council</Text>
                  </View>
                </View>
              </View>

              {/* Action: "Yes, it's my profile" button */}
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleStep1YesItIsMyProfile}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Yes, it's my profile</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* ========================================================== */}
          {/* STEP 2: EMAIL & PHONE (VERIFY BUTTONS) -> CONTINUE         */}
          {/* ========================================================== */}
          {currentStep === 2 && (
            <View style={styles.stepContentWrap}>
              <Text style={styles.title}>Claim your profile</Text>
              <Text style={styles.subtitle}>
                Verify your email and phone to take control of your MediUnify profile.
              </Text>

              {/* EMAIL ADDRESS FIELD WITH VERIFY BUTTON */}
              <Text style={styles.label}>Email address</Text>
              <View style={[styles.inputBox, isEmailVerified && styles.inputBoxVerified]}>
                <Ionicons name="mail-outline" size={18} color="#4A5568" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@clinic.com"
                  placeholderTextColor="#A0AEC0"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (isEmailVerified) setIsEmailVerified(false);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity
                  style={[styles.verifyBtn, isEmailVerified && styles.verifyBtnSuccess]}
                  onPress={handleVerifyEmail}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.verifyText, isEmailVerified && styles.verifyTextSuccess]}>
                    {isEmailVerified ? 'Verified ✓' : 'Verify'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* PHONE NUMBER FIELD WITH VERIFY BUTTON */}
              <Text style={styles.label}>Phone number</Text>
              <View style={[styles.inputBox, isPhoneVerified && styles.inputBoxVerified]}>
                <Ionicons name="call-outline" size={18} color="#4A5568" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#A0AEC0"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (isPhoneVerified) setIsPhoneVerified(false);
                  }}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity
                  style={[styles.verifyBtn, isPhoneVerified && styles.verifyBtnSuccess]}
                  onPress={handleVerifyPhone}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.verifyText, isPhoneVerified && styles.verifyTextSuccess]}>
                    {isPhoneVerified ? 'Verified ✓' : 'Verify'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* SET PASSWORD FIELD */}
              <Text style={styles.label}>Set password</Text>
              <View style={styles.inputBox}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#4A5568"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#A0AEC0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#4A5568"
                  />
                </TouchableOpacity>
              </View>

              {/* PASSWORD STRENGTH 4 BARS */}
              <View style={styles.strengthRow}>
                {[1, 2, 3, 4].map((bar) => (
                  <View
                    key={bar}
                    style={[
                      styles.strengthBar,
                      passwordStrength >= bar && styles.strengthBarActive,
                    ]}
                  />
                ))}
              </View>

              {/* STEP 2 ACTION: CONTINUE BUTTON */}
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleStep2Continue}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* ========================================================== */}
          {/* STEP 3: DETAILS + DOCUMENTS + AGREEMENT + SUBMIT           */}
          {/* ========================================================== */}
          {currentStep === 3 && (
            <View style={styles.stepContentWrap}>
              <Text style={styles.title}>Review & Confirm</Text>
              <Text style={styles.subtitle}>
                Review your doctor details and uploaded documents to claim your profile.
              </Text>

              {/* Doctor Details Summary Box */}
              <View style={styles.reviewBox}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewInitialsBox}>
                    <Text style={styles.reviewInitialsText}>AR</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewDocName}>Dr. Ananya Rao</Text>
                    <Text style={styles.reviewDocSpec}>MBBS, MD - General Medicine</Text>
                    <Text style={styles.reviewDocClinic}>Indiranagar, Bengaluru</Text>
                  </View>
                </View>
              </View>

              {/* Uploaded Documents List */}
              <Text style={styles.label}>Uploaded Documents</Text>
              <View style={styles.docsListWrap}>
                {[
                  { id: '1', title: 'MCI Registration Certificate', meta: 'Verified • PDF' },
                  { id: '2', title: 'MD Degree Certificate', meta: 'Verified • PDF' },
                  { id: '3', title: 'Clinic Establishment License', meta: 'Verified • PDF' },
                  { id: '4', title: 'Govt ID Proof (Aadhaar)', meta: 'Verified • PDF' },
                ].map((docItem) => (
                  <View key={docItem.id} style={styles.docItemRow}>
                    <Ionicons name="document-text" size={18} color="#00B894" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.docItemTitle}>{docItem.title}</Text>
                      <Text style={styles.docItemMeta}>{docItem.meta}</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  </View>
                ))}
              </View>

              {/* Checkbox Agreement */}
              <TouchableOpacity
                style={styles.agreementRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
                  {agreedToTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.agreementText}>
                  I declare that all information and credentials provided are authentic and belong to me.
                  I agree to Mediunify's Terms and Verification Policy.
                </Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.primaryBtn, !agreedToTerms && { opacity: 0.5 }]}
                onPress={handleStep3Submit}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Submit & Claim Profile</Text>
                <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* SUCCESS MODAL: "Your profile is claimed successfully" */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessOk}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="checkmark-circle" size={48} color="#00B894" />
            </View>

            <Text style={styles.modalTitle}>Your profile is claimed successfully!</Text>
            <Text style={styles.modalMessage}>
              Welcome Dr. Ananya Rao! Your profile has been linked and your doctor dashboard is ready.
            </Text>

            <TouchableOpacity
              style={styles.modalOkBtn}
              onPress={handleSuccessOk}
              activeOpacity={0.85}
            >
              <Text style={styles.modalOkBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061A3A',
  },
  header: {
    backgroundColor: '#061A3A',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(0, 184, 148, 0.1)',
  },
  backRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00B894',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#061A3A',
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    width: 160,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#00B894',
  },
  stepDotText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  stepDotTextActive: {
    color: '#FFFFFF',
  },
  stepTrack: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 6,
  },
  stepTrackActive: {
    backgroundColor: '#00B894',
  },

  /* Body Card */
  bodyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  stepContentWrap: {
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#061A3A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },

  /* Step 1 Mock Box */
  mockProfileBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  mockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mockAvatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#061A3A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00B894',
  },
  mockAvatarInitials: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00B894',
  },
  mockInfoCol: {
    flex: 1,
  },
  mockDocName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#061A3A',
  },
  mockDocSpec: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00B894',
    marginTop: 2,
  },
  mockDocReg: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  mockDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  mockClinicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
  },
  mockClinicText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    fontWeight: '500',
  },
  mockStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mockStatItem: {
    alignItems: 'center',
  },
  mockStatNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#061A3A',
  },
  mockStatLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  statSep: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },

  /* Primary Button */
  primaryBtn: {
    backgroundColor: '#00B894',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Step 2 Inputs */
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#061A3A',
    marginBottom: 8,
    marginTop: 14,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  inputBoxVerified: {
    borderColor: '#00B894',
    backgroundColor: '#F0FDF9',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#061A3A',
  },
  verifyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  verifyBtnSuccess: {
    backgroundColor: '#E6FAF6',
  },
  verifyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#061A3A',
  },
  verifyTextSuccess: {
    color: '#00B894',
  },
  eyeBtn: {
    padding: 6,
  },
  strengthRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  strengthBarActive: {
    backgroundColor: '#00B894',
  },

  /* Step 3 Review */
  reviewBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewInitialsBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#061A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewInitialsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#00B894',
  },
  reviewDocName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#061A3A',
  },
  reviewDocSpec: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B894',
    marginTop: 1,
  },
  reviewDocClinic: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  docsListWrap: {
    gap: 8,
    marginBottom: 16,
  },
  docItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    borderRadius: 10,
  },
  docItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#061A3A',
  },
  docItemMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  agreementText: {
    flex: 1,
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },

  /* Success Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 26, 58, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#061A3A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalOkBtn: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOkBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
