import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorClaimProfilePage({ onNavigate }) {
  // Stepper state: 1: Profile Confirmation, 2: Verification, 3: Review & Submit
  const [currentStep, setCurrentStep] = useState(1);

  // Profile Status option (Unclaimed / Claim Pending / Claimed and Verified / Inactive)
  const [profileStatus, setProfileStatus] = useState('Unclaimed');

  // Step 2 Form States
  const [email, setEmail] = useState('name@clinic.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('Doctor@Secure2026');
  const [showPassword, setShowPassword] = useState(false);

  // Verification states
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [activeVerificationModal, setActiveVerificationModal] = useState(null); // 'email' | 'phone' | null
  const [otpCode, setOtpCode] = useState('4829');

  // Step 3 Agreement state
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Pop-up modal after submission ("your profile is claim sucessfull")
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Compute password strength segments (1 to 5)
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strengthCount = getPasswordStrength();

  // Handlers for Verify buttons
  const handleStartVerifyEmail = () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address first.');
      return;
    }
    setOtpCode('5824');
    setActiveVerificationModal('email');
  };

  const handleStartVerifyPhone = () => {
    if (!phone || phone.trim().length < 6) {
      alert('Please enter a valid phone number first.');
      return;
    }
    setOtpCode('8931');
    setActiveVerificationModal('phone');
  };

  const handleConfirmOtp = () => {
    if (activeVerificationModal === 'email') {
      setIsEmailVerified(true);
    } else if (activeVerificationModal === 'phone') {
      setIsPhoneVerified(true);
    }
    setActiveVerificationModal(null);
  };

  // Step navigation handlers
  const handleStep1YesItIsMyProfile = () => {
    setCurrentStep(2);
  };

  const handleStep2Continue = () => {
    if (!email.trim() || !phone.trim()) {
      alert('Please enter both your email address and phone number.');
      return;
    }
    if (!password || password.length < 6) {
      alert('Please set a secure password of at least 6 characters.');
      return;
    }
    if (!isEmailVerified) setIsEmailVerified(true);
    if (!isPhoneVerified) setIsPhoneVerified(true);
    setCurrentStep(3);
  };

  const handleStep3SubmitClaim = () => {
    if (!agreedToTerms) {
      alert('Please agree to the declaration and terms before claiming your profile.');
      return;
    }
    // Directs to pop-up: "your profile is claim sucessfull"
    setShowSuccessModal(true);
  };

  // Modal actions
  const handleModalOkDashboard = () => {
    setShowSuccessModal(false);
    if (onNavigate) {
      onNavigate('doctor-portal');
    }
  };

  const handleModalGoHome = () => {
    setShowSuccessModal(false);
    if (onNavigate) {
      onNavigate('landing');
    }
  };

  return (
    <View style={styles.outerContainer}>
      {/* ============================================================== */}
      {/* 1. TOP HEADER: Navy background colour                           */}
      {/* Left: Logo and Medi (white) Unify (teal green)                 */}
      {/* Right: Home button and Sign up button                           */}
      {/* ============================================================== */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.brandRow}
          onPress={() => onNavigate && onNavigate('landing')}
          activeOpacity={0.8}
        >
          <View style={styles.logoSquare}>
            <Text style={styles.logoSquareText}>M</Text>
          </View>
          <Text style={styles.brandText}>
            Medi <Text style={styles.brandAccent}>Unify</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {/* Home Button: Navy pill with subtle white border */}
          <TouchableOpacity
            style={styles.headerHomeBtn}
            onPress={() => onNavigate && onNavigate('landing')}
            activeOpacity={0.85}
          >
            <Text style={styles.headerHomeBtnText}>Home</Text>
          </TouchableOpacity>

          {/* Sign up Button: Teal green pill */}
          <TouchableOpacity
            style={styles.headerSignUpBtn}
            onPress={() => onNavigate && onNavigate('role-signup')}
            activeOpacity={0.85}
          >
            <Text style={styles.headerSignUpBtnText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 2. BODY SCROLL: Below header white gap                         */}
      {/* ============================================================== */}
      <ScrollView
        style={styles.bodyScrollView}
        contentContainerStyle={styles.bodyContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================== */}
        {/* 3. MEDIUM WIDTH SCREEN WITH NAVY BLUE BACKGROUND               */}
        {/* EMBEDDED WITH PROFILE PICTURE INSIDE PERSON ICONS              */}
        {/* WITHIN IT STEPPER UI WITH TOGGLES FILLING LIKE DESIGNS         */}
        {/* ============================================================== */}
        <View style={styles.mediumCardContainer}>
          {/* Top Navy Section */}
          <View style={styles.cardNavyTopSection}>
            {/* Upper-right dark teal circular overlay from image */}
            <View style={styles.decorativeCircle} />

            {/* Embedded Profile Picture inside Person Icons */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person-outline" size={44} color="#00897B" />
              </View>
              {/* Camera icon badge at bottom-right of avatar */}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={13} color="#FFFFFF" />
              </View>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.claimTitle}>Claim your profile</Text>
            <Text style={styles.claimSubtitle}>
              Verify your details to take control of your profile
            </Text>
          </View>

          {/* ============================================================ */}
          {/* STEPPER UI: Interconnected Overlapping Pill (Matches Image)   */}
          {/* ============================================================ */}
          <View style={styles.capsuleStepperWrapper}>
            <View style={styles.capsuleStepperTrack}>
              {/* Step 1 Segment */}
              <TouchableOpacity
                style={[
                  styles.capsuleSegment,
                  styles.capsuleSegment1,
                  currentStep > 1 && styles.capsuleSegmentDone,
                  currentStep === 1 && styles.capsuleSegmentActive,
                  currentStep < 1 && styles.capsuleSegmentUpcoming,
                ]}
                onPress={() => setCurrentStep(1)}
                activeOpacity={0.85}
              >
                <View style={styles.capsuleWhiteCircle}>
                  {currentStep > 1 ? (
                    <Ionicons name="checkmark" size={17} color="#00B894" />
                  ) : (
                    <Text
                      style={[
                        styles.capsuleCircleNumber,
                        currentStep === 1 && styles.capsuleCircleNumberActive,
                      ]}
                    >
                      1
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Step 2 Segment */}
              <TouchableOpacity
                style={[
                  styles.capsuleSegment,
                  styles.capsuleSegment2,
                  currentStep > 2 && styles.capsuleSegmentDone,
                  currentStep === 2 && styles.capsuleSegmentActive,
                  currentStep < 2 && styles.capsuleSegmentUpcoming,
                ]}
                onPress={() => setCurrentStep(2)}
                activeOpacity={0.85}
              >
                <View style={styles.capsuleWhiteCircle}>
                  {currentStep > 2 ? (
                    <Ionicons name="checkmark" size={17} color="#00B894" />
                  ) : (
                    <Text
                      style={[
                        styles.capsuleCircleNumber,
                        currentStep === 2 && styles.capsuleCircleNumberActive,
                      ]}
                    >
                      2
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Step 3 Segment */}
              <TouchableOpacity
                style={[
                  styles.capsuleSegment,
                  styles.capsuleSegment3,
                  currentStep > 3 && styles.capsuleSegmentDone,
                  currentStep === 3 && styles.capsuleSegmentActive,
                  currentStep < 3 && styles.capsuleSegmentUpcoming,
                ]}
                onPress={() => setCurrentStep(3)}
                activeOpacity={0.85}
              >
                <View style={styles.capsuleWhiteCircle}>
                  {currentStep > 3 ? (
                    <Ionicons name="checkmark" size={17} color="#00B894" />
                  ) : (
                    <Text
                      style={[
                        styles.capsuleCircleNumber,
                        currentStep === 3 && styles.capsuleCircleNumberActive,
                      ]}
                    >
                      3
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Step Subtitle / Indicator */}
            <View style={styles.stepInfoRow}>
              <Text style={styles.stepBadgeText}>STEP {currentStep} OF 3</Text>
              <Text style={styles.stepNameText}>
                {currentStep === 1 && 'Confirm Doctor Profile'}
                {currentStep === 2 && 'Verify Contact & Set Password'}
                {currentStep === 3 && 'Doctor Details & Submit Claim'}
              </Text>
            </View>
          </View>

          {/* ============================================================ */}
          {/* STEP 1: MOCK PROFILE DATA (ONLY SPECIFIED FIELDS)            */}
          {/* Doctor Name, Specialization, Qualifications,                */}
          {/* Clinic/Hospital Name, City and Location, Profile Status     */}
          {/* Below it: Yes it's my profile button -> direct to step 2     */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <View style={styles.cardFormSection}>
              {/* Doctor Details Box */}
              <View style={styles.mockProfileCard}>
                {/* Field 1: Doctor Name */}
                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileFieldLabel}>Doctor Name</Text>
                  <Text style={styles.profileFieldValueBold}>Dr. Ananya Rao</Text>
                </View>

                {/* Field 2: Specialization */}
                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileFieldLabel}>Specialization</Text>
                  <Text style={styles.profileFieldValue}>General Medicine & Cardiology</Text>
                </View>

                {/* Field 3: Qualifications */}
                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileFieldLabel}>Qualifications</Text>
                  <Text style={styles.profileFieldValue}>MBBS, MD (Internal Medicine)</Text>
                </View>

                {/* Field 4: Clinic/Hospital Name */}
                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileFieldLabel}>Clinic/Hospital Name</Text>
                  <Text style={styles.profileFieldValue}>Mediunify Multi-Speciality Clinic</Text>
                </View>

                {/* Field 5: City and Location */}
                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileFieldLabel}>City and Location</Text>
                  <Text style={styles.profileFieldValue}>Indiranagar, Bengaluru, Karnataka</Text>
                </View>

                {/* Field 6: Profile Status (Unclaimed / Claim Pending / Claimed and Verified / Inactive) */}
                <View style={[styles.profileDetailRow, { borderBottomWidth: 0, paddingBottom: 2 }]}>
                  <Text style={styles.profileFieldLabel}>Profile Status</Text>
                  <View style={styles.statusToggleContainer}>
                    {[
                      { id: 'Unclaimed', label: 'Unclaimed', color: '#F59E0B', bg: '#FEF3C7' },
                      { id: 'Claim Pending', label: 'Claim Pending', color: '#0284C7', bg: '#E0F2FE' },
                      { id: 'Claimed and Verified', label: 'Claimed and Verified', color: '#059669', bg: '#D1FAE5' },
                      { id: 'Inactive', label: 'Inactive', color: '#64748B', bg: '#F1F5F9' },
                    ].map((status) => {
                      const isSelected = profileStatus === status.id;
                      return (
                        <TouchableOpacity
                          key={status.id}
                          style={[
                            styles.statusPillBtn,
                            isSelected && {
                              backgroundColor: status.bg,
                              borderColor: status.color,
                            },
                          ]}
                          onPress={() => setProfileStatus(status.id)}
                          activeOpacity={0.8}
                        >
                          {isSelected && (
                            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                          )}
                          <Text
                            style={[
                              styles.statusPillBtnText,
                              isSelected && { color: status.color, fontWeight: '700' },
                            ]}
                          >
                            {status.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Action Button: "Yes, it's my profile" -> directs to step 2 */}
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleStep1YesItIsMyProfile}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryActionBtnText}>Yes, it's my profile</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* ============================================================ */}
          {/* STEP 2: EXACTLY AS SHOWN IN THE IMAGE                        */}
          {/* Email + Verify, Phone + Verify, Set Password, Continue      */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <View style={styles.cardFormSection}>
              {/* 1. Email Address + Verify */}
              <Text style={styles.inputLabel}>Email address</Text>
              <View
                style={[
                  styles.inputPillBox,
                  isEmailVerified && styles.inputPillBoxVerified,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@clinic.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (isEmailVerified) setIsEmailVerified(false);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity
                  style={[
                    styles.verifyBtn,
                    isEmailVerified && styles.verifyBtnSuccess,
                  ]}
                  onPress={isEmailVerified ? null : handleStartVerifyEmail}
                  activeOpacity={0.8}
                >
                  {isEmailVerified ? (
                    <View style={styles.verifiedRow}>
                      <Ionicons name="checkmark-circle" size={15} color="#00B894" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  ) : (
                    <Text style={styles.verifyBtnText}>Verify</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* 2. Phone Number + Verify */}
              <Text style={[styles.inputLabel, { marginTop: 18 }]}>Phone number</Text>
              <View
                style={[
                  styles.inputPillBox,
                  isPhoneVerified && styles.inputPillBoxVerified,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#94A3B8"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (isPhoneVerified) setIsPhoneVerified(false);
                  }}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity
                  style={[
                    styles.verifyBtn,
                    isPhoneVerified && styles.verifyBtnSuccess,
                  ]}
                  onPress={isPhoneVerified ? null : handleStartVerifyPhone}
                  activeOpacity={0.8}
                >
                  {isPhoneVerified ? (
                    <View style={styles.verifiedRow}>
                      <Ionicons name="checkmark-circle" size={15} color="#00B894" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  ) : (
                    <Text style={styles.verifyBtnText}>Verify</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* 3. Set Password */}
              <Text style={[styles.inputLabel, { marginTop: 18 }]}>Set password</Text>
              <View style={styles.inputPillBox}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={19}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator Bars */}
              <View style={styles.passwordBarsRow}>
                {[1, 2, 3, 4, 5].map((seg) => (
                  <View
                    key={`seg-${seg}`}
                    style={[
                      styles.passwordBarSegment,
                      strengthCount >= seg && styles.passwordBarSegmentActive,
                    ]}
                  />
                ))}
              </View>

              {/* Big Black Button: "Continue" (directs to step 3) */}
              <TouchableOpacity
                style={styles.blackActionBtn}
                onPress={handleStep2Continue}
                activeOpacity={0.88}
              >
                <Text style={styles.blackActionBtnText}>Continue</Text>
              </TouchableOpacity>

              {/* Helper text below button as shown in image */}
              <View style={styles.helperTextWrapper}>
                {!isEmailVerified ? (
                  <TouchableOpacity onPress={handleStartVerifyEmail}>
                    <Text style={styles.verifyEmailFirstText}>Verify your email first</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.verifiedNoticeText}>✓ Contact verified. Ready to proceed!</Text>
                )}
              </View>

              {/* Step Navigation Back Link */}
              <TouchableOpacity
                style={styles.backStepLink}
                onPress={() => setCurrentStep(1)}
                activeOpacity={0.75}
              >
                <Ionicons name="arrow-back" size={15} color="#64748B" />
                <Text style={styles.backStepLinkText}>Back to doctor details</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ============================================================ */}
          {/* STEP 3: ONLY DOCTOR DETAILS SPECIFIED + UPLOADED DOCUMENTS    */}
          {/* Doctor Name, email, phone no, Specialization, Qualifications, */}
          {/* Clinic/Hospital Name, City and Location                      */}
          {/* Documents uploaded (minimum 2), Checkbox agreement, Claim     */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <View style={styles.cardFormSection}>
              {/* Doctor Details Summary Box (Only requested fields) */}
              <View style={styles.reviewDocSummaryCard}>
                <View style={styles.reviewHeaderRow}>
                  <View style={styles.reviewAvatarCircle}>
                    <Text style={styles.reviewAvatarInitials}>AR</Text>
                  </View>
                  <View style={styles.reviewDocInfo}>
                    <Text style={styles.reviewDocName}>Dr. Ananya Rao</Text>
                    <Text style={styles.reviewDocSpec}>General Medicine & Cardiology</Text>
                  </View>
                </View>

                <View style={styles.reviewDivider} />

                {/* Email & Phone */}
                <View style={styles.reviewMetaRow}>
                  <View style={styles.reviewMetaItem}>
                    <Text style={styles.reviewMetaLabel}>Email</Text>
                    <Text style={styles.reviewMetaValue}>{email || 'name@clinic.com'}</Text>
                  </View>
                  <View style={styles.reviewMetaItem}>
                    <Text style={styles.reviewMetaLabel}>Phone No</Text>
                    <Text style={styles.reviewMetaValue}>{phone || '+91 98765 43210'}</Text>
                  </View>
                </View>

                {/* Specialization & Qualifications */}
                <View style={[styles.reviewMetaRow, { marginTop: 10 }]}>
                  <View style={styles.reviewMetaItem}>
                    <Text style={styles.reviewMetaLabel}>Specialization</Text>
                    <Text style={styles.reviewMetaValue}>General Medicine & Cardiology</Text>
                  </View>
                  <View style={styles.reviewMetaItem}>
                    <Text style={styles.reviewMetaLabel}>Qualifications</Text>
                    <Text style={styles.reviewMetaValue}>MBBS, MD</Text>
                  </View>
                </View>

                {/* Clinic/Hospital Name & City/Location */}
                <View style={[styles.reviewMetaRow, { marginTop: 10 }]}>
                  <View style={styles.reviewMetaItem}>
                    <Text style={styles.reviewMetaLabel}>Clinic/Hospital Name</Text>
                    <Text style={styles.reviewMetaValue}>Mediunify Multi-Speciality Clinic</Text>
                  </View>
                  <View style={styles.reviewMetaItem}>
                    <Text style={styles.reviewMetaLabel}>City and Location</Text>
                    <Text style={styles.reviewMetaValue}>Indiranagar, Bengaluru, Karnataka</Text>
                  </View>
                </View>
              </View>

              {/* Uploaded Documents (Minimum 2) */}
              <Text style={styles.sectionHeaderTitle}>Uploaded Documents (2)</Text>
              <View style={styles.documentsListWrap}>
                {[
                  {
                    id: 'doc-1',
                    name: 'MCI Medical Council Registration Certificate',
                    type: 'PDF · Verified Medical Certificate',
                    size: '1.8 MB',
                    icon: 'document-text',
                  },
                  {
                    id: 'doc-2',
                    name: 'MD Degree Certificate (General Medicine)',
                    type: 'PDF · Verified Degree Document',
                    size: '2.4 MB',
                    icon: 'school',
                  },
                ].map((doc) => (
                  <View key={doc.id} style={styles.documentItemRow}>
                    <View style={styles.docIconBox}>
                      <Ionicons name={doc.icon} size={18} color="#00B894" />
                    </View>
                    <View style={styles.docDetailsCol}>
                      <Text style={styles.docNameTitle} numberOfLines={1}>
                        {doc.name}
                      </Text>
                      <Text style={styles.docSubMeta}>
                        {doc.type} · {doc.size}
                      </Text>
                    </View>
                    <View style={styles.docVerifiedTag}>
                      <Ionicons name="checkmark-circle" size={13} color="#059669" />
                      <Text style={styles.docVerifiedTagText}>Verified</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Checkbox Agreement */}
              <TouchableOpacity
                style={styles.agreementRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.customCheckbox,
                    agreedToTerms && styles.customCheckboxActive,
                  ]}
                >
                  {agreedToTerms && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.agreementText}>
                  I declare that all information and credentials provided are authentic and belong to me.
                  I agree to Mediunify's Terms of Service and Doctor Verification Policy.
                </Text>
              </TouchableOpacity>

              {/* Claim Profile Button */}
              <TouchableOpacity
                style={[
                  styles.blackActionBtn,
                  !agreedToTerms && styles.submitBtnDisabled,
                ]}
                onPress={handleStep3SubmitClaim}
                activeOpacity={0.88}
              >
                <Text style={styles.blackActionBtnText}>Claim profile</Text>
              </TouchableOpacity>

              {/* Auxiliary navigation buttons */}
              <View style={styles.step3AuxLinksRow}>
                <TouchableOpacity
                  style={styles.step3AuxBtn}
                  onPress={() => setCurrentStep(2)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={15} color="#64748B" />
                  <Text style={styles.step3AuxBtnText}>Back</Text>
                </TouchableOpacity>

                {/* When clicked claim Profile direct to home page */}
                <TouchableOpacity
                  style={styles.step3AuxBtn}
                  onPress={() => onNavigate && onNavigate('landing')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="home-outline" size={15} color="#00897B" />
                  <Text style={[styles.step3AuxBtnText, { color: '#00897B', fontWeight: '700' }]}>
                    Return to Home
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* ============================================================== */}
      {/* 4. POP-UP MODAL: "your profile is claim sucessfull"            */}
      {/* Below that: OK button direct to doctor dashboard               */}
      {/* And link direct to home page                                   */}
      {/* ============================================================== */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalOkDashboard}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={48} color="#00B894" />
            </View>

            <Text style={styles.successModalTitle}>
              Your profile is claim sucessfull!
            </Text>
            <Text style={styles.successModalMessage}>
              Welcome Dr. Ananya Rao! Your profile has been verified and claimed. You can now access your doctor dashboard.
            </Text>

            {/* OK button direct to doctor dashboard */}
            <TouchableOpacity
              style={styles.successOkBtn}
              onPress={handleModalOkDashboard}
              activeOpacity={0.88}
            >
              <Text style={styles.successOkBtnText}>OK</Text>
            </TouchableOpacity>

            {/* Link direct to home page */}
            <TouchableOpacity
              style={styles.successHomeLinkBtn}
              onPress={handleModalGoHome}
              activeOpacity={0.8}
            >
              <Text style={styles.successHomeLinkText}>Go to Home Page</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 5. VERIFICATION OTP MODAL                                      */}
      {/* ============================================================== */}
      <Modal
        visible={activeVerificationModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveVerificationModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.otpModalCard}>
            <View style={styles.otpIconCircle}>
              <Ionicons
                name={activeVerificationModal === 'email' ? 'mail' : 'phone-portrait'}
                size={26}
                color="#00B894"
              />
            </View>

            <Text style={styles.otpModalTitle}>
              Verify {activeVerificationModal === 'email' ? 'Email Address' : 'Phone Number'}
            </Text>
            <Text style={styles.otpModalSub}>
              Enter the 4-digit code sent to{' '}
              <Text style={{ fontWeight: '700', color: '#081E3E' }}>
                {activeVerificationModal === 'email' ? email : phone}
              </Text>
            </Text>

            <TextInput
              style={styles.otpInputBox}
              placeholder="e.g. 5824"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
              autoFocus
            />

            <View style={styles.otpBtnsRow}>
              <TouchableOpacity
                style={styles.otpCancelBtn}
                onPress={() => setActiveVerificationModal(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.otpCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.otpConfirmBtn}
                onPress={handleConfirmOtp}
                activeOpacity={0.85}
              >
                <Text style={styles.otpConfirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },

  /* 1. Header Styles: Navy background colour */
  header: {
    width: '100%',
    height: 72,
    backgroundColor: '#081E3E', // Navy background colour
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSquareText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#081E3E',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF', // Medi in white
    letterSpacing: -0.4,
  },
  brandAccent: {
    color: '#00B894', // Unify in teal green
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerHomeBtn: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
  },
  headerHomeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSignUpBtn: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#00B894',
  },
  headerSignUpBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* 2. Body Scroll: Below header white gap */
  bodyScrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  bodyContentContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 48,
  },

  /* 3. Medium Width Screen Card */
  mediumCardContainer: {
    width: '100%',
    maxWidth: 520, // Medium width screen as shown in image
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 12px 38px rgba(8, 30, 62, 0.12)',
  },

  /* Navy Blue Top Section embedded with profile picture */
  cardNavyTopSection: {
    width: '100%',
    backgroundColor: '#081E3E', // Navy blue background
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -35,
    right: -35,
    width: 175,
    height: 175,
    borderRadius: 88,
    backgroundColor: '#0D384D', // Dark teal circle overlay from image
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#D7F3ED', // Soft teal circle from image
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#00B894', // Teal green badge
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#081E3E',
  },
  claimTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  claimSubtitle: {
    fontSize: 13.5,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 380,
  },

  /* Stepper UI: Interconnected Overlapping Pill as shown in reference image */
  capsuleStepperWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 28,
    paddingBottom: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  capsuleStepperTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 4px 14px rgba(8, 30, 62, 0.08)',
  },
  capsuleSegment: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  capsuleSegment1: {
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    marginRight: -16,
    zIndex: 3,
    borderRightWidth: 1.5,
    borderRightColor: 'rgba(255, 255, 255, 0.45)',
    paddingRight: 4,
  },
  capsuleSegment2: {
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    marginRight: -16,
    zIndex: 2,
    borderRightWidth: 1.5,
    borderRightColor: 'rgba(255, 255, 255, 0.45)',
    paddingLeft: 12,
    paddingRight: 4,
  },
  capsuleSegment3: {
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1,
    paddingLeft: 12,
  },

  /* Segment Status Colors */
  capsuleSegmentDone: {
    backgroundColor: '#00B894', // Teal green completed background
  },
  capsuleSegmentActive: {
    backgroundColor: '#081E3E', // Deep navy active background
  },
  capsuleSegmentUpcoming: {
    backgroundColor: '#E2E8F0', // Soft slate upcoming background
  },

  /* Centered White Circle Badge */
  capsuleWhiteCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  capsuleCircleNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#94A3B8',
  },
  capsuleCircleNumberActive: {
    color: '#081E3E', // Deep navy bold number
    fontWeight: '900',
  },

  /* Step info text below capsule */
  stepInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#00897B',
    backgroundColor: '#E6F4F1',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  stepNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  /* Form Body Section */
  cardFormSection: {
    padding: 28,
    backgroundColor: '#FFFFFF',
  },

  /* Step 1: Mock Profile Card with only specified fields */
  mockProfileCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  profileDetailRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  profileFieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  profileFieldValueBold: {
    fontSize: 17,
    fontWeight: '800',
    color: '#081E3E',
  },
  profileFieldValue: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E293B',
  },

  /* Status Toggle Pills */
  statusToggleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statusPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillBtnText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },

  /* Primary Action Button ("Yes, it's my profile") */
  primaryActionBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#00B894',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 14px rgba(0, 184, 148, 0.28)',
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Step 2 Inputs: Exactly as shown in the image */
  inputLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#081E3E',
    marginBottom: 8,
  },
  inputPillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 24, // Rounded pill as shown in image
    paddingHorizontal: 16,
    height: 50,
  },
  inputPillBoxVerified: {
    borderColor: '#00B894',
    backgroundColor: '#F8FCFA',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#081E3E',
    outlineStyle: 'none',
  },
  verifyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  verifyBtnSuccess: {
    backgroundColor: 'transparent',
  },
  verifyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8', // Muted verify text as shown in image
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#00B894',
  },
  eyeBtn: {
    padding: 6,
  },
  passwordBarsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  passwordBarSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  passwordBarSegmentActive: {
    backgroundColor: '#00B894',
  },

  /* Black Action Button as shown in image */
  blackActionBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#111827', // Black rounded button as shown in image
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
  },
  blackActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  /* Helper text below button */
  helperTextWrapper: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyEmailFirstText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#E11D48', // Red text: "Verify your email first"
  },
  verifiedNoticeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#00B894',
  },
  backStepLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    paddingVertical: 6,
  },
  backStepLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Step 3: Review Details (Only specified fields) */
  reviewDocSummaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  reviewAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00B894',
  },
  reviewAvatarInitials: {
    fontSize: 17,
    fontWeight: '800',
    color: '#00B894',
  },
  reviewDocInfo: {
    flex: 1,
  },
  reviewDocName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  reviewDocSpec: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#00B894',
    marginTop: 2,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  reviewMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  reviewMetaItem: {
    flex: 1,
  },
  reviewMetaLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  reviewMetaValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
    marginTop: 2,
  },

  sectionHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#081E3E',
    marginBottom: 10,
  },
  documentsListWrap: {
    gap: 10,
    marginBottom: 20,
  },
  documentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docDetailsCol: {
    flex: 1,
  },
  docNameTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  docSubMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  docVerifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  docVerifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },

  /* Agreement Row */
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  customCheckboxActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  agreementText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },

  /* Step 3 Aux Links Row */
  step3AuxLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  step3AuxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  step3AuxBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Pop-up Modals */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#081E3E',
    marginBottom: 8,
    textAlign: 'center',
  },
  successModalMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  successOkBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successOkBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successHomeLinkBtn: {
    marginTop: 14,
    paddingVertical: 6,
  },
  successHomeLinkText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#081E3E',
  },

  /* OTP Modal */
  otpModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
  },
  otpIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  otpModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
    marginBottom: 6,
    textAlign: 'center',
  },
  otpModalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  otpInputBox: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#00B894',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#081E3E',
    letterSpacing: 4,
    marginBottom: 20,
    outlineStyle: 'none',
  },
  otpBtnsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  otpCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  otpConfirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
