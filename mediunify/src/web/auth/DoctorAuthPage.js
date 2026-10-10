import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { doctor } from '../../data/mockData';
import WebLogo from '../components/WebLogo';

export default function DoctorAuthPage({ onNavigate }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Sign In State
  const [signInEmailOrPhone, setSignInEmailOrPhone] = useState('ananya.rao@mediunify.com');
  const [signInPassword, setSignInPassword] = useState('doctor123');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign Up Multi-Step State (1 -> 2 -> 3)
  const [signUpStep, setSignUpStep] = useState(1);

  // Step 1: Personal Info & Verifications
  const [firstName, setFirstName] = useState(doctor.name ? doctor.name.replace(/^Dr\.\s*/i, '').split(' ')[0] : 'Ananya');
  const [lastName, setLastName] = useState(doctor.name ? doctor.name.replace(/^Dr\.\s*/i, '').split(' ').slice(1).join(' ') : 'Rao');
  const [phone, setPhone] = useState(doctor.phone || '+91 98450 12345');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [phoneOtpInput, setPhoneOtpInput] = useState('');
  const [phoneOtpError, setPhoneOtpError] = useState('');

  const [email, setEmail] = useState(doctor.email || 'ananya.rao@mediunify.com');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [emailOtpError, setEmailOtpError] = useState('');

  // Step 2: Medical Credentials & Certificate
  const [specialization, setSpecialization] = useState(doctor.specialization || 'General Physician');
  const [regNo, setRegNo] = useState(doctor.regNo || 'MCI-2019-887341');
  const [uploadedCertificate, setUploadedCertificate] = useState(
    doctor.regCertificate
      ? {
          name: doctor.regCertificate.name || 'MCI_Registration_Certificate_2019.pdf',
          size: doctor.regCertificate.size || '1.8 MB',
          date: doctor.regCertificate.uploadedDate || '12 Jan 2026',
        }
      : {
          name: 'MCI_Medical_Council_Certificate.pdf',
          size: '2.1 MB',
          date: 'Just now',
        }
  );

  // Step 3: Photo & Password
  const [photoUri, setPhotoUri] = useState(
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
  );
  const [newPassword, setNewPassword] = useState('Doctor@Secure2026');
  const [confirmPassword, setConfirmPassword] = useState('Doctor@Secure2026');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Post-submit pop-up modal state
  const [showVerifiedSuccessModal, setShowVerifiedSuccessModal] = useState(false);

  // ---------------- Handlers ----------------

  // Handle Sign In (No Demo button)
  const handleSignIn = async () => {
    if (!signInEmailOrPhone.trim()) {
      alert('Please enter your email or phone number.');
      return;
    }
    if (!signInPassword) {
      alert('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: signInEmailOrPhone, password: signInPassword });
      setLoading(false);
      onNavigate('doctor-portal');
    } catch {
      setLoading(false);
      onNavigate('doctor-portal');
    }
  };

  // Step 1: Verify OTP for Phone
  const handleTriggerPhoneOtp = () => {
    if (!phone.trim()) {
      alert('Please enter your phone number first.');
      return;
    }
    setPhoneOtpInput('4829'); // prefill convenient demo OTP
    setPhoneOtpError('');
    setShowPhoneOtpModal(true);
  };

  const handleConfirmPhoneOtp = () => {
    if (phoneOtpInput.trim().length < 4) {
      setPhoneOtpError('Please enter a valid 4-digit OTP code.');
      return;
    }
    setIsPhoneVerified(true);
    setShowPhoneOtpModal(false);
  };

  // Step 1: Verify Email
  const handleTriggerEmailOtp = () => {
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setEmailOtpInput('7193'); // prefill convenient demo OTP
    setEmailOtpError('');
    setShowEmailOtpModal(true);
  };

  const handleConfirmEmailOtp = () => {
    if (emailOtpInput.trim().length < 4) {
      setEmailOtpError('Please enter a valid verification code.');
      return;
    }
    setIsEmailVerified(true);
    setShowEmailOtpModal(false);
  };

  // Step 1 Continue
  const handleStep1Continue = () => {
    if (!firstName.trim()) {
      alert('Please enter your Full Name / First Name.');
      return;
    }
    if (!lastName.trim()) {
      alert('Please enter your Last Name.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your Phone Number.');
      return;
    }
    if (!email.trim()) {
      alert('Please enter your Email Address.');
      return;
    }
    setSignUpStep(2);
  };

  // Step 2 Continue
  const handleStep2Continue = () => {
    if (!specialization.trim()) {
      alert('Please enter or select your Specialization.');
      return;
    }
    if (!regNo.trim()) {
      alert('Please enter your Medical Council Registration Number.');
      return;
    }
    if (!uploadedCertificate) {
      alert('Please upload your Medical Council Registration Certificate.');
      return;
    }
    setSignUpStep(3);
  };

  // Step 3 Submit Registration
  const handleStep3Submit = () => {
    if (!newPassword) {
      alert('Please enter a password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please re-enter.');
      return;
    }
    // Show the requested pop-up: "the your account will be verficed" below that ok button
    setShowVerifiedSuccessModal(true);
  };

  // OK button on post-submit pop-up modal
  const handleConfirmAccountVerified = async () => {
    setShowVerifiedSuccessModal(false);
    setLoading(true);
    const fullName = `Dr. ${firstName.trim()} ${lastName.trim()}`;
    await register({
      name: fullName,
      email: email.trim(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      regNo: regNo.trim(),
      regCertificate: uploadedCertificate,
    });
    setLoading(false);
    onNavigate('doctor-portal');
  };

  // Mock certificate upload
  const handleUploadCertificate = () => {
    setUploadedCertificate({
      name: `MCI_Registration_Cert_${regNo.replace(/[^a-zA-Z0-9]/g, '') || '2026'}.pdf`,
      size: '2.4 MB',
      date: 'Uploaded just now',
    });
  };

  // Mock photo upload
  const handleUploadPhoto = () => {
    const photoOptions = [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    ];
    const nextPhoto = photoOptions[(photoOptions.indexOf(photoUri) + 1) % photoOptions.length];
    setPhotoUri(nextPhoto);
  };

  return (
    <View style={styles.container}>
      {/* ======================================================== */}
      {/* 1 & 3: TOP HEADER WITH LOGO AND "medi" WHITE + "unify" GREEN */}
      {/* ======================================================== */}
      <View style={styles.navBar}>
        {/* Back to Home */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => onNavigate('landing')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={17} color="#CBD5E1" />
          <Text style={styles.backBtnText}>Back to Home</Text>
        </TouchableOpacity>

        {/* Center Logo and Brand: "medi" in white and "unify" in green */}
        <View style={styles.logoRow}>
          <WebLogo size={36} style={styles.logoBox} />
          <Text style={styles.brandTitle}>
            <Text style={styles.brandMedi}>medi</Text>
            <Text style={styles.brandUnify}>unify</Text>
          </Text>
          <View style={styles.doctorBadgePill}>
            <Ionicons name="pulse" size={12} color="#00B894" />
            <Text style={styles.doctorBadgeText}>Doctor Portal</Text>
          </View>
        </View>

        {/* Right switch role button */}
        <TouchableOpacity
          onPress={() => onNavigate('nurse-login')}
          style={styles.switchRoleBtn}
          activeOpacity={0.75}
        >
          <Text style={styles.switchRoleText}>Are you a Nurse? Go to Nurse Portal →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.authCard}>
          {/* Card Top Title Banner */}
          <View style={styles.cardHeader}>
            <View style={styles.roleBadge}>
              <Ionicons name="medkit" size={14} color="#00B894" />
              <Text style={styles.roleBadgeText}>
                {isRegister ? 'CLINICIAN ONBOARDING' : 'DOCTOR SIGN IN'}
              </Text>
            </View>
            <Text style={styles.cardTitle}>
              {isRegister ? 'Doctor Sign Up' : 'Welcome back, Doctor'}
            </Text>
            <Text style={styles.cardSub}>
              {isRegister
                ? 'Register your medical credentials to join MediUnify network.'
                : 'Sign in to access your clinical dashboard, patients, and appointment queue.'}
            </Text>
          </View>

          {/* ======================================================== */}
          {/* SIGN IN VIEW (Item 2: Demo button removed) */}
          {/* ======================================================== */}
          {!isRegister && (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>EMAIL ADDRESS / PHONE NUMBER</Text>
                <View style={styles.inputIconRow}>
                  <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.iconInput}
                    value={signInEmailOrPhone}
                    onChangeText={setSignInEmailOrPhone}
                    placeholder="doctor@mediunify.com"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <View style={styles.labelBetween}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <TouchableOpacity onPress={() => alert('Password reset link has been dispatched to your email.')}>
                    <Text style={styles.forgotLink}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputIconRow}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.iconInput}
                    value={signInPassword}
                    onChangeText={setSignInPassword}
                    secureTextEntry={!showSignInPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowSignInPassword(!showSignInPassword)}
                  >
                    <Ionicons
                      name={showSignInPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Primary Sign In Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSignIn}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.submitBtnText}>
                  {loading ? 'Authenticating...' : 'Sign In to Doctor Dashboard'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Notice: Demo button has been completely removed as requested */}
            </View>
          )}

          {/* ======================================================== */}
          {/* SIGN UP MULTI-STEP (Item 5: 1 -> 2 -> 3 + Demo button removed) */}
          {/* ======================================================== */}
          {isRegister && (
            <View style={styles.form}>
              {/* Stepper Progress Bar */}
              <View style={styles.stepperContainer}>
                {/* Step 1 Indicator */}
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      signUpStep === 1 && styles.stepCircleActive,
                      signUpStep > 1 && styles.stepCircleCompleted,
                    ]}
                  >
                    {signUpStep > 1 ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepCircleText,
                          signUpStep === 1 && styles.stepCircleTextActive,
                        ]}
                      >
                        1
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      signUpStep === 1 && styles.stepLabelActive,
                    ]}
                  >
                    Personal Info
                  </Text>
                </View>

                {/* Connector Line 1-2 */}
                <View
                  style={[
                    styles.stepLine,
                    signUpStep > 1 && styles.stepLineCompleted,
                  ]}
                />

                {/* Step 2 Indicator */}
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      signUpStep === 2 && styles.stepCircleActive,
                      signUpStep > 2 && styles.stepCircleCompleted,
                    ]}
                  >
                    {signUpStep > 2 ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepCircleText,
                          signUpStep === 2 && styles.stepCircleTextActive,
                        ]}
                      >
                        2
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      signUpStep === 2 && styles.stepLabelActive,
                    ]}
                  >
                    Credentials
                  </Text>
                </View>

                {/* Connector Line 2-3 */}
                <View
                  style={[
                    styles.stepLine,
                    signUpStep > 2 && styles.stepLineCompleted,
                  ]}
                />

                {/* Step 3 Indicator */}
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      signUpStep === 3 && styles.stepCircleActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepCircleText,
                        signUpStep === 3 && styles.stepCircleTextActive,
                      ]}
                    >
                      3
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      signUpStep === 3 && styles.stepLabelActive,
                    ]}
                  >
                    Photo & Security
                  </Text>
                </View>
              </View>

              {/* ----------------- STEP 1 ----------------- */}
              {/* FULL NAME, last name, phone number verify otp, email verify email -> continue button */}
              {signUpStep === 1 && (
                <View style={styles.stepCardContent}>
                  <View style={styles.stepHeaderRow}>
                    <Text style={styles.stepTitleText}>Step 1: Personal & Contact Details</Text>
                    <Text style={styles.stepSubtitleText}>Verify your mobile number and email to proceed.</Text>
                  </View>

                  {/* FULL NAME */}
                  <View style={styles.field}>
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                      style={styles.input}
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="e.g. Dr. Ananya"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* LAST NAME */}
                  <View style={styles.field}>
                    <Text style={styles.label}>LAST NAME</Text>
                    <TextInput
                      style={styles.input}
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="e.g. Rao"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* PHONE NUMBER + VERIFY OTP */}
                  <View style={styles.field}>
                    <View style={styles.labelBetween}>
                      <Text style={styles.label}>PHONE NUMBER</Text>
                      {isPhoneVerified ? (
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="checkmark-circle" size={13} color="#00B894" />
                          <Text style={styles.verifiedBadgeText}>OTP Verified</Text>
                        </View>
                      ) : (
                        <Text style={styles.unverifiedTag}>Verification required</Text>
                      )}
                    </View>
                    <View style={styles.inputWithActionRow}>
                      <TextInput
                        style={styles.inputFlex}
                        value={phone}
                        onChangeText={(txt) => {
                          setPhone(txt);
                          setIsPhoneVerified(false);
                        }}
                        placeholder="+91 98450 12345"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                      />
                      <TouchableOpacity
                        style={[
                          styles.actionVerifyBtn,
                          isPhoneVerified && styles.actionVerifiedSuccessBtn,
                        ]}
                        onPress={handleTriggerPhoneOtp}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={isPhoneVerified ? 'checkmark-circle' : 'chatbox-ellipses-outline'}
                          size={14}
                          color={isPhoneVerified ? '#047857' : '#0A2342'}
                        />
                        <Text
                          style={[
                            styles.actionVerifyText,
                            isPhoneVerified && styles.actionVerifiedSuccessText,
                          ]}
                        >
                          {isPhoneVerified ? 'Verified ✓' : 'Verify OTP'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* EMAIL + VERIFY EMAIL */}
                  <View style={styles.field}>
                    <View style={styles.labelBetween}>
                      <Text style={styles.label}>EMAIL ADDRESS</Text>
                      {isEmailVerified ? (
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="checkmark-circle" size={13} color="#00B894" />
                          <Text style={styles.verifiedBadgeText}>Email Verified</Text>
                        </View>
                      ) : (
                        <Text style={styles.unverifiedTag}>Verification required</Text>
                      )}
                    </View>
                    <View style={styles.inputWithActionRow}>
                      <TextInput
                        style={styles.inputFlex}
                        value={email}
                        onChangeText={(txt) => {
                          setEmail(txt);
                          setIsEmailVerified(false);
                        }}
                        placeholder="doctor@mediunify.com"
                        placeholderTextColor="#94A3B8"
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                      <TouchableOpacity
                        style={[
                          styles.actionVerifyBtn,
                          isEmailVerified && styles.actionVerifiedSuccessBtn,
                        ]}
                        onPress={handleTriggerEmailOtp}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={isEmailVerified ? 'checkmark-circle' : 'mail-unread-outline'}
                          size={14}
                          color={isEmailVerified ? '#047857' : '#0A2342'}
                        />
                        <Text
                          style={[
                            styles.actionVerifyText,
                            isEmailVerified && styles.actionVerifiedSuccessText,
                          ]}
                        >
                          {isEmailVerified ? 'Verified ✓' : 'Verify Email'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Continue Button */}
                  <TouchableOpacity
                    style={styles.stepContinueBtn}
                    onPress={handleStep1Continue}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.stepContinueBtnText}>Continue to Step 2</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* ----------------- STEP 2 ----------------- */}
              {/* SPECIALIZATION, MEDICAL COUNCIL REGISTRATION NO, with upload certificate -> continue button */}
              {signUpStep === 2 && (
                <View style={styles.stepCardContent}>
                  <View style={styles.stepHeaderRow}>
                    <Text style={styles.stepTitleText}>Step 2: Medical Credentials</Text>
                    <Text style={styles.stepSubtitleText}>
                      Provide your official medical license and registration certificate.
                    </Text>
                  </View>

                  {/* SPECIALIZATION */}
                  <View style={styles.field}>
                    <Text style={styles.label}>SPECIALIZATION</Text>
                    <TextInput
                      style={styles.input}
                      value={specialization}
                      onChangeText={setSpecialization}
                      placeholder="e.g. General Physician, Cardiologist, Pediatrician"
                      placeholderTextColor="#94A3B8"
                    />
                    {/* Quick suggestion pills */}
                    <View style={styles.pillRow}>
                      {['General Physician', 'Cardiologist', 'Pediatrician', 'Dermatologist'].map(
                        (spec) => (
                          <TouchableOpacity
                            key={spec}
                            style={[
                              styles.specPill,
                              specialization === spec && styles.specPillActive,
                            ]}
                            onPress={() => setSpecialization(spec)}
                          >
                            <Text
                              style={[
                                styles.specPillText,
                                specialization === spec && styles.specPillTextActive,
                              ]}
                            >
                              {spec}
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>

                  {/* MEDICAL COUNCIL REGISTRATION NO */}
                  <View style={styles.field}>
                    <Text style={styles.label}>MEDICAL COUNCIL REGISTRATION NO.</Text>
                    <TextInput
                      style={styles.input}
                      value={regNo}
                      onChangeText={setRegNo}
                      placeholder="e.g. MCI-2019-887341 / NMC-KA-2024-9982"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* UPLOAD CERTIFICATE */}
                  <View style={styles.field}>
                    <Text style={styles.label}>UPLOAD MEDICAL COUNCIL CERTIFICATE</Text>

                    {uploadedCertificate ? (
                      <View style={styles.certificatePreviewBox}>
                        <View style={styles.certIconWrap}>
                          <Ionicons name="document-text" size={26} color="#00B894" />
                        </View>
                        <View style={styles.certMetaCol}>
                          <Text style={styles.certTitleText}>{uploadedCertificate.name}</Text>
                          <Text style={styles.certMetaInfo}>
                            {uploadedCertificate.size} • Verified Format (PDF)
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.certReuploadBtn}
                          onPress={handleUploadCertificate}
                        >
                          <Ionicons name="refresh-outline" size={14} color="#0A2342" />
                          <Text style={styles.certReuploadText}>Replace</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.uploadDropZone}
                        onPress={handleUploadCertificate}
                        activeOpacity={0.8}
                      >
                        <View style={styles.uploadIconCircle}>
                          <Ionicons name="cloud-upload-outline" size={24} color="#00B894" />
                        </View>
                        <Text style={styles.uploadMainTitle}>Click to upload Certificate</Text>
                        <Text style={styles.uploadHint}>
                          Supports PDF, JPG, PNG (Max 15MB file size)
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Navigation row: Back & Continue */}
                  <View style={styles.stepBtnRow}>
                    <TouchableOpacity
                      style={styles.stepBackBtn}
                      onPress={() => setSignUpStep(1)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="arrow-back" size={15} color="#475569" />
                      <Text style={styles.stepBackBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.stepContinueFlexBtn}
                      onPress={handleStep2Continue}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.stepContinueBtnText}>Continue to Step 3</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ----------------- STEP 3 ----------------- */}
              {/* upload photo, PASSWORD -> submit button -> pop-up note "the your account will be verficed" below ok button */}
              {signUpStep === 3 && (
                <View style={styles.stepCardContent}>
                  <View style={styles.stepHeaderRow}>
                    <Text style={styles.stepTitleText}>Step 3: Profile Photo & Password</Text>
                    <Text style={styles.stepSubtitleText}>
                      Upload your clinician photo and set up account security.
                    </Text>
                  </View>

                  {/* UPLOAD PHOTO */}
                  <View style={styles.field}>
                    <Text style={styles.label}>UPLOAD DOCTOR PHOTO</Text>
                    <View style={styles.photoUploadRow}>
                      <View style={styles.photoPreviewWrapper}>
                        {photoUri ? (
                          <Image source={{ uri: photoUri }} style={styles.photoAvatar} />
                        ) : (
                          <Ionicons name="person" size={36} color="#94A3B8" />
                        )}
                        <View style={styles.cameraBadge}>
                          <Ionicons name="camera" size={12} color="#FFFFFF" />
                        </View>
                      </View>

                      <View style={styles.photoActionCol}>
                        <TouchableOpacity
                          style={styles.choosePhotoBtn}
                          onPress={handleUploadPhoto}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="cloud-upload-outline" size={15} color="#0A2342" />
                          <Text style={styles.choosePhotoText}>Change Doctor Photo</Text>
                        </TouchableOpacity>
                        <Text style={styles.photoHintText}>
                          Square JPG or PNG, minimum 400x400 px. Professional clinical photo recommended.
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* PASSWORD */}
                  <View style={styles.field}>
                    <Text style={styles.label}>PASSWORD</Text>
                    <View style={styles.inputIconRow}>
                      <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                      <TextInput
                        style={styles.iconInput}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                        placeholder="At least 8 characters with numbers"
                        placeholderTextColor="#94A3B8"
                      />
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Ionicons
                          name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={18}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* CONFIRM PASSWORD */}
                  <View style={styles.field}>
                    <Text style={styles.label}>CONFIRM PASSWORD</Text>
                    <View style={styles.inputIconRow}>
                      <Ionicons name="shield-checkmark-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                      <TextInput
                        style={styles.iconInput}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        placeholder="Re-enter password"
                        placeholderTextColor="#94A3B8"
                      />
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={18}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Navigation row: Back & Submit */}
                  <View style={styles.stepBtnRow}>
                    <TouchableOpacity
                      style={styles.stepBackBtn}
                      onPress={() => setSignUpStep(2)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="arrow-back" size={15} color="#475569" />
                      <Text style={styles.stepBackBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.stepSubmitFlexBtn}
                      onPress={handleStep3Submit}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                      <Text style={styles.stepSubmitBtnText}>Submit Registration</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Notice: Demo button removed completely from signup as requested */}
            </View>
          )}

          {/* Card Footer Toggle: Switch between Sign In and Sign Up */}
          <View style={styles.footerToggle}>
            <Text style={styles.footerToggleText}>
              {isRegister ? 'Already registered as a Doctor?' : "Don't have an account yet?"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsRegister(!isRegister);
                setSignUpStep(1);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.footerToggleLink}>
                {isRegister ? 'Doctor Sign In' : 'Sign Up as Doctor'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ======================================================== */}
      {/* MODAL 1: PHONE OTP VERIFICATION MODAL */}
      {/* ======================================================== */}
      <Modal visible={showPhoneOtpModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="chatbubbles" size={26} color="#00B894" />
            </View>
            <Text style={styles.modalTitle}>Phone OTP Verification</Text>
            <Text style={styles.modalSub}>
              We sent a 4-digit verification code to <Text style={{ fontWeight: '700', color: '#0A2342' }}>{phone}</Text>
            </Text>

            <View style={styles.otpInputRow}>
              <TextInput
                style={styles.otpInputBox}
                value={phoneOtpInput}
                onChangeText={setPhoneOtpInput}
                placeholder="1234"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            </View>
            {phoneOtpError ? <Text style={styles.modalErrorText}>{phoneOtpError}</Text> : null}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowPhoneOtpModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmPhoneOtp}
              >
                <Text style={styles.modalConfirmText}>Verify Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: EMAIL VERIFICATION MODAL */}
      {/* ======================================================== */}
      <Modal visible={showEmailOtpModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="mail" size={26} color="#00B894" />
            </View>
            <Text style={styles.modalTitle}>Email Verification</Text>
            <Text style={styles.modalSub}>
              Enter the verification code sent to <Text style={{ fontWeight: '700', color: '#0A2342' }}>{email}</Text>
            </Text>

            <View style={styles.otpInputRow}>
              <TextInput
                style={styles.otpInputBox}
                value={emailOtpInput}
                onChangeText={setEmailOtpInput}
                placeholder="7193"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            </View>
            {emailOtpError ? <Text style={styles.modalErrorText}>{emailOtpError}</Text> : null}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowEmailOtpModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmEmailOtp}
              >
                <Text style={styles.modalConfirmText}>Verify Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 3: POST-SUBMIT SUCCESS MODAL */}
      {/* Note: "the your account will be verficed" below that ok button */}
      {/* ======================================================== */}
      <Modal visible={showVerifiedSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successModalCard}>
            {/* Green Shield Success Icon */}
            <View style={styles.successIconCircle}>
              <Ionicons name="shield-checkmark" size={38} color="#00B894" />
            </View>

            {/* Note specifically requested by user */}
            <Text style={styles.verifiedMainNote}>Your account will be verified</Text>

            <Text style={styles.verifiedSubNote}>
              Your registration details and medical council certificate have been securely submitted.
              Our medical compliance team will review your credentials and verify your account.
            </Text>

            {/* Verification summary pills */}
            <View style={styles.verifiedSummaryBox}>
              <View style={styles.verifiedRow}>
                <Ionicons name="person-circle-outline" size={16} color="#0A2342" />
                <Text style={styles.verifiedRowText}>
                  Dr. {firstName} {lastName}
                </Text>
              </View>
              <View style={styles.verifiedRow}>
                <Ionicons name="ribbon-outline" size={16} color="#00B894" />
                <Text style={styles.verifiedRowText}>
                  {specialization} • Reg: {regNo}
                </Text>
              </View>
              <View style={styles.verifiedRow}>
                <Ionicons name="document-attach-outline" size={16} color="#64748B" />
                <Text style={styles.verifiedRowText}>
                  {uploadedCertificate?.name || 'Certificate Uploaded'}
                </Text>
              </View>
            </View>

            {/* OK Button */}
            <TouchableOpacity
              style={styles.okModalBtn}
              onPress={handleConfirmAccountVerified}
              activeOpacity={0.85}
            >
              <Text style={styles.okModalBtnText}>OK</Text>
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
    backgroundColor: '#081E3E', // deep navy background
  },

  /* ---------------- 1 & 3: TOP HEADER ---------------- */
  navBar: {
    height: 68,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A2342', // dark navy header
    borderBottomWidth: 1,
    borderBottomColor: '#163863',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00B894',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandMedi: {
    color: '#FFFFFF', // medi in white
    fontWeight: '900',
  },
  brandUnify: {
    color: '#00B894', // unify in green
    fontWeight: '900',
  },
  doctorBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 184, 148, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.35)',
    marginLeft: 4,
  },
  doctorBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00B894',
    letterSpacing: 0.3,
  },
  switchRoleBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 184, 148, 0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.3)',
  },
  switchRoleText: {
    fontSize: 12,
    color: '#00B894',
    fontWeight: '700',
  },

  /* ---------------- Scroll Body & Auth Card ---------------- */
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  authCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 34,
    gap: 20,
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
  },
  cardHeader: {
    alignItems: 'center',
    gap: 7,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 999,
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#00B894',
    letterSpacing: 0.6,
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0A2342',
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 420,
  },

  /* ---------------- Form Styles ---------------- */
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  labelBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 11,
    color: '#00B894',
    fontWeight: '700',
  },
  input: {
    height: 44,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  inputIconRow: {
    height: 44,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  fieldIcon: {
    marginRight: 8,
  },
  iconInput: {
    flex: 1,
    height: '100%',
    fontSize: 13.5,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    backgroundColor: '#0A2342',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },

  /* ---------------- STEPPER BAR ---------------- */
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  stepItem: {
    alignItems: 'center',
    gap: 5,
    minWidth: 80,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#0A2342',
    borderColor: '#0A2342',
  },
  stepCircleCompleted: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  stepCircleTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepLabelActive: {
    color: '#0A2342',
    fontWeight: '800',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  stepLineCompleted: {
    backgroundColor: '#00B894',
  },

  /* ---------------- STEP CARD BODY ---------------- */
  stepCardContent: {
    gap: 15,
  },
  stepHeaderRow: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 3,
  },
  stepTitleText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0A2342',
  },
  stepSubtitleText: {
    fontSize: 11.5,
    color: '#64748B',
  },

  /* Input with action (Verify OTP / Verify Email) */
  inputWithActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputFlex: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  actionVerifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 9,
    justifyContent: 'center',
  },
  actionVerifyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  actionVerifiedSuccessBtn: {
    backgroundColor: '#E8F8F5',
    borderColor: '#A7F3D0',
  },
  actionVerifiedSuccessText: {
    color: '#047857',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  unverifiedTag: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
  },

  /* Specialization Pills */
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  specPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  specPillActive: {
    backgroundColor: '#E8F8F5',
    borderColor: '#00B894',
  },
  specPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  specPillTextActive: {
    color: '#00B894',
  },

  /* Certificate Upload */
  certificatePreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 10,
    padding: 12,
  },
  certIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certMetaCol: {
    flex: 1,
    gap: 2,
  },
  certTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  certMetaInfo: {
    fontSize: 11,
    color: '#15803D',
  },
  certReuploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  certReuploadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A2342',
  },
  uploadDropZone: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadMainTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2342',
  },
  uploadHint: {
    fontSize: 11,
    color: '#94A3B8',
  },

  /* Doctor Photo Upload */
  photoUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
  },
  photoPreviewWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  photoAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoActionCol: {
    flex: 1,
    gap: 6,
  },
  choosePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
  },
  choosePhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  photoHintText: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14,
  },

  /* Stepper Buttons */
  stepContinueBtn: {
    backgroundColor: '#0A2342',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  stepContinueBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  stepBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  stepBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#F1F5F9',
    borderRadius: 9,
  },
  stepBackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  stepContinueFlexBtn: {
    flex: 1,
    backgroundColor: '#0A2342',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  stepSubmitFlexBtn: {
    flex: 1,
    backgroundColor: '#00B894',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  stepSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  /* ---------------- Toggle Sign In / Register ---------------- */
  footerToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  footerToggleText: {
    fontSize: 12,
    color: '#64748B',
  },
  footerToggleLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00B894',
  },

  /* ---------------- MODALS ---------------- */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 17, 36, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  modalIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0A2342',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  otpInputRow: {
    width: '100%',
    marginVertical: 4,
  },
  otpInputBox: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 8,
    color: '#0A2342',
    backgroundColor: '#F8FAFC',
    outlineStyle: 'none',
  },
  modalErrorText: {
    fontSize: 11.5,
    color: '#EF4444',
    fontWeight: '600',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 6,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0A2342',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Success Modal */
  successModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 24px 50px rgba(0, 0, 0, 0.35)',
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F8F5',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedMainNote: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0A2342',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  verifiedSubNote: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  verifiedSummaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginVertical: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedRowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  okModalBtn: {
    width: '100%',
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    boxShadow: '0 4px 14px rgba(0, 184, 148, 0.4)',
  },
  okModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
