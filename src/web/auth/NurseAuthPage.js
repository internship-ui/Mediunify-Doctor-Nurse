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
import WebLogo from '../components/WebLogo';
import { useHomeNursing } from '../../homeNursing/context/HomeNursingContext';

// Available Nursing Degrees for search & dropdown
const DEGREE_OPTIONS = [
  'B.Sc Nursing (Bachelor of Science in Nursing)',
  'GNM (General Nursing and Midwifery)',
  'Post Basic B.Sc Nursing',
  'M.Sc Nursing (Master of Science in Nursing)',
  'ANM (Auxiliary Nursing Midwifery)',
  'Diploma in Critical Care Nursing',
  'Diploma in General Nursing',
  'Others (Manual Entry)',
];

// Available Years of Experience
const EXPERIENCE_OPTIONS = [
  '< 1 Year (Fresher / Trainee)',
  '1 - 2 Years',
  '3 - 5 Years',
  '6 - 8 Years',
  '9 - 12 Years',
  '12+ Years (Senior Lead Nurse)',
];

// Available Clinical Skills for Pop-up Search & Selection
const CLINICAL_SKILLS_CATALOG = [
  'Wound Care & Advanced Dressing',
  'Geriatric & Elderly Bedside Care',
  'Post-Operative & Surgical Recovery',
  'IV Cannulation & Infusion Therapy',
  'Tracheostomy Care & Suctioning',
  'Catheterization & Bladder Care',
  'ICU & Critical Care Nursing',
  'Vital Signs Monitoring & Medication Admin',
  'Diabetes Care & Insulin Injections',
  'Palliative & Hospice Care',
  'Pediatric & Neonatal Nursing',
  'Stoma & Colostomy Management',
  'Nebulization & Oxygen Therapy',
  'Ryle Tube & PEG Feeding',
  'Phlebotomy & Lab Sample Collection',
  'Pain Management & Symptom Relief',
];

export default function NurseAuthPage({ onNavigate, initialMode = 'signin' }) {
  const {
    nurseProfile,
    saveNurseRegistration,
    setIsNurseAuthenticated,
    setRegistrationStatus,
  } = useHomeNursing();

  const [isRegister, setIsRegister] = useState(initialMode === 'signup');

  // Sync mode whenever initialMode prop updates
  React.useEffect(() => {
    setIsRegister(initialMode === 'signup');
    if (initialMode === 'signup') {
      setRegStep(1);
    }
  }, [initialMode]);

  const [regStep, setRegStep] = useState(1); // 1: Personal, 2: PUC, 3: Degree, 4: Years & Clinical, 5: Photo & Sign, 6: Password & Agreement

  // Login Form State
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('kavitha.r@mediunify.com');
  const [loginPassword, setLoginPassword] = useState('nurse123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // -------------------------------------------------------------------------
  // SLIDE 1: PERSONAL DETAILS
  // -------------------------------------------------------------------------
  const [fullName, setFullName] = useState(nurseProfile?.fullName?.replace(/^Nurse\s*/i, '') || 'Kavitha');
  const [lastName, setLastName] = useState('Rao');
  const [phone, setPhone] = useState(nurseProfile?.phoneNumber || '+91 97312 44821');
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [phoneOtpInput, setPhoneOtpInput] = useState('5192');

  const [email, setEmail] = useState(nurseProfile?.email || 'kavitha.r@mediunify.com');
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('8304');

  // -------------------------------------------------------------------------
  // SLIDE 2: PROFESSIONAL DETAILS - PUC DETAILS
  // -------------------------------------------------------------------------
  const [pucCollege, setPucCollege] = useState("St. Joseph's Pre-University College, Bengaluru");
  const [pucStream, setPucStream] = useState('Science (PCMB)');
  const [pucBoard, setPucBoard] = useState('Karnataka State Pre-University Examination Board');
  const [pucYear, setPucYear] = useState('2014');
  const [pucPercentage, setPucPercentage] = useState('84.5%');
  const [pucCertificate, setPucCertificate] = useState({
    name: 'PUC_HigherSecondary_Certificate.pdf',
    size: '1.4 MB',
    date: 'Uploaded',
  });

  // -------------------------------------------------------------------------
  // SLIDE 3: PROFESSIONAL DETAILS - NURSING DEGREE
  // -------------------------------------------------------------------------
  const [selectedDegree, setSelectedDegree] = useState('B.Sc Nursing (Bachelor of Science in Nursing)');
  const [degreeSearchQuery, setDegreeSearchQuery] = useState('');
  const [showDegreeDropdown, setShowDegreeDropdown] = useState(false);
  const [manualDegreeInput, setManualDegreeInput] = useState('');
  const [regNumber, setRegNumber] = useState(nurseProfile?.licenseNumber || 'KNC-2018-99412');
  const [regAuthority, setRegAuthority] = useState(nurseProfile?.registrationAuthority || 'Karnataka State Nursing Council (KSNC)');
  const [degreeCertificate, setDegreeCertificate] = useState({
    name: 'KNC_Nursing_Registration_Degree_Certificate.pdf',
    size: '2.4 MB',
    date: 'Uploaded',
  });

  // -------------------------------------------------------------------------
  // SLIDE 4: YEARS AND CLINICAL
  // -------------------------------------------------------------------------
  const [yearsOfExp, setYearsOfExp] = useState(nurseProfile?.yearsOfExperience || '6 - 8 Years');
  const [showExpDropdown, setShowExpDropdown] = useState(false);
  const [hospitalExperience, setHospitalExperience] = useState('Manipal Hospitals (3 yrs), Apollo HomeCare (3 yrs)');

  // Clinical skills pop-up state
  const [selectedSkills, setSelectedSkills] = useState(
    nurseProfile?.specialization || [
      'Wound Care & Advanced Dressing',
      'Geriatric & Elderly Bedside Care',
      'Post-Operative & Surgical Recovery',
      'IV Cannulation & Infusion Therapy',
      'Vital Signs Monitoring & Medication Admin',
    ]
  );
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');

  // -------------------------------------------------------------------------
  // SLIDE 5: PHOTO AND SIGN
  // -------------------------------------------------------------------------
  const [photoUri, setPhotoUri] = useState(
    'https://images.unsplash.com/photo-1594824813576-928646b14299?auto=format&fit=crop&q=80&w=400'
  );
  const [signatureData, setSignatureData] = useState({
    name: 'Digital_Signature_Kavitha.png',
    size: '420 KB',
    date: 'Digitally Verified',
  });

  // -------------------------------------------------------------------------
  // SLIDE 6: PASSWORD AND AGREEMENT CHECK
  // -------------------------------------------------------------------------
  const [password, setPassword] = useState('Nurse@Secure2026');
  const [confirmPassword, setConfirmPassword] = useState('Nurse@Secure2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeAuthenticity, setAgreeAuthenticity] = useState(true);

  // Post-submit Account Verification pop-up modal
  const [showVerifiedPopUp, setShowVerifiedPopUp] = useState(false);

  // -------------------------------------------------------------------------
  // NAVIGATION & ACTIONS (Bypass every field without trying for demo only)
  // -------------------------------------------------------------------------
  const handleLoginSubmit = () => {
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      setIsNurseAuthenticated(true);
      onNavigate('nurse-portal');
    }, 400);
  };

  // Slide 1 -> 2
  const handleStep1Continue = () => {
    setRegStep(2);
  };

  // Slide 2 -> 3
  const handleStep2Continue = () => {
    setRegStep(3);
  };

  // Slide 3 -> 4
  const handleStep3Continue = () => {
    setRegStep(4);
  };

  // Slide 4 -> 5
  const handleStep4Continue = () => {
    setRegStep(5);
  };

  // Slide 5 -> 6
  const handleStep5Continue = () => {
    setRegStep(6);
  };

  // Slide 6 Submit -> Pop-up note "Your account will be verified"
  const handleStep6Submit = () => {
    setShowVerifiedPopUp(true);
  };

  // Pop-up OK button click -> Enters nurse portal
  const handleConfirmVerifiedOk = () => {
    setShowVerifiedPopUp(false);
    const finalDegree = selectedDegree.includes('Others') ? (manualDegreeInput || 'Diploma in Nursing') : selectedDegree;
    saveNurseRegistration({
      fullName: `Nurse ${fullName.trim()} ${lastName.trim()}`,
      phoneNumber: phone,
      email,
      qualification: finalDegree,
      licenseNumber: regNumber,
      registrationAuthority: regAuthority,
      yearsOfExperience: yearsOfExp,
      specialization: selectedSkills,
      workExperience: hospitalExperience,
      registrationStatus: 'Approved',
    });
    setRegistrationStatus('Approved');
    setIsNurseAuthenticated(true);
    onNavigate('nurse-portal');
  };

  // Toggle skill selection in pop-up modal
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Cycle photo options for mock upload
  const handleCyclePhoto = () => {
    const photos = [
      'https://images.unsplash.com/photo-1594824813576-928646b14299?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400',
    ];
    const next = photos[(photos.indexOf(photoUri) + 1) % photos.length];
    setPhotoUri(next);
  };

  // Filter degrees
  const filteredDegrees = DEGREE_OPTIONS.filter((deg) =>
    deg.toLowerCase().includes(degreeSearchQuery.toLowerCase())
  );

  // Filter skills
  const filteredSkills = CLINICAL_SKILLS_CATALOG.filter((sk) =>
    sk.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* ======================================================== */}
      {/* 1 & 3: TOP HEADER WITH LOGO AND "medi" WHITE + "unify" GREEN */}
      {/* ======================================================== */}
      <View style={styles.navBar}>
        {/* Back to Home & Change Role */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => onNavigate('landing')}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={15} color="#CBD5E1" />
            <Text style={styles.backBtnText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => onNavigate(isRegister ? 'role-signup' : 'role-signin')}
            activeOpacity={0.7}
          >
            <Ionicons name="people-outline" size={15} color="#CBD5E1" />
            <Text style={styles.backBtnText}>Roles</Text>
          </TouchableOpacity>
        </View>

        {/* Center Logo and Brand: "medi" in white and "unify" in green */}
        <View style={styles.logoRow}>
          <WebLogo size={36} style={styles.logoBox} />
          <Text style={styles.brandTitle}>
            <Text style={styles.brandMedi}>medi</Text>
            <Text style={styles.brandUnify}>unify</Text>
          </Text>
          <View style={styles.nurseBadgePill}>
            <Ionicons name="heart" size={12} color="#00B894" />
            <Text style={styles.nurseBadgeText}>Home Nursing Portal</Text>
          </View>
        </View>

        {/* Right switch role button */}
        <TouchableOpacity
          onPress={() => onNavigate('doctor-login')}
          style={styles.switchRoleBtn}
          activeOpacity={0.75}
        >
          <Text style={styles.switchRoleText}>Are you a Doctor? Go to Doctor Portal →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.authCard}>
          {/* Card Top Title Banner */}
          <View style={styles.cardHeader}>
            <View style={styles.roleBadge}>
              <Ionicons name="heart" size={14} color="#00B894" />
              <Text style={styles.roleBadgeText}>
                {isRegister ? 'NURSE REGISTRATION' : 'NURSE SIGN IN'}
              </Text>
            </View>
            <Text style={styles.cardTitle}>
              {isRegister ? 'Nurse Partner Registration' : 'Welcome back, Nurse'}
            </Text>
            <Text style={styles.cardSub}>
              {isRegister
                ? 'Join MediUnify Home Nursing network to receive verified patient service assignments.'
                : 'Sign in to access your daily nursing assignments and patient shift queue.'}
            </Text>
          </View>

          {/* ======================================================== */}
          {/* SIGN IN VIEW (Item 2: Demo button removed) */}
          {/* ======================================================== */}
          {!isRegister && (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>MOBILE NUMBER OR EMAIL</Text>
                <View style={styles.inputIconRow}>
                  <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.iconInput}
                    value={loginPhoneOrEmail}
                    onChangeText={setLoginPhoneOrEmail}
                    placeholder="kavitha.r@mediunify.com"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <View style={styles.labelBetween}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <TouchableOpacity onPress={() => alert('Password reset dispatched to your registered email.')}>
                    <Text style={styles.forgotLink}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputIconRow}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.iconInput}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry={!showLoginPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    <Ionicons
                      name={showLoginPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={styles.primarySubmitBtn}
                onPress={handleLoginSubmit}
                activeOpacity={0.85}
                disabled={loginLoading}
              >
                <Text style={styles.primarySubmitBtnText}>
                  {loginLoading ? 'Verifying...' : 'Sign In to Nurse Portal'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Notice: Demo button removed as requested */}
            </View>
          )}

          {/* ======================================================== */}
          {/* SIGN UP MULTI-STEP (Item 4 & 5: Demo & status buttons removed) */}
          {/* Slides: 1: Personal -> 2: PUC -> 3: Degree -> 4: Years & Clinical -> 5: Photo & Sign -> 6: Security */}
          {/* ======================================================== */}
          {isRegister && (
            <View style={styles.form}>
              {/* Stepper Progress Bar */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stepperScrollContainer}
              >
                {[
                  { step: 1, label: 'Personal' },
                  { step: 2, label: 'PUC Details' },
                  { step: 3, label: 'Degree' },
                  { step: 4, label: 'Experience' },
                  { step: 5, label: 'Photo & Sign' },
                  { step: 6, label: 'Security' },
                ].map((s, index, arr) => {
                  const isActive = regStep === s.step;
                  const isDone = regStep > s.step;
                  return (
                    <React.Fragment key={s.step}>
                      <TouchableOpacity
                        style={styles.stepItem}
                        onPress={() => setRegStep(s.step)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.stepCircle,
                            isActive && styles.stepCircleActive,
                            isDone && styles.stepCircleDone,
                          ]}
                        >
                          {isDone ? (
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                          ) : (
                            <Text
                              style={[
                                styles.stepCircleText,
                                isActive && styles.stepCircleTextActive,
                              ]}
                            >
                              {s.step}
                            </Text>
                          )}
                        </View>
                        <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                          {s.label}
                        </Text>
                      </TouchableOpacity>
                      {index < arr.length - 1 && (
                        <View
                          style={[
                            styles.stepLine,
                            isDone && styles.stepLineDone,
                          ]}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </ScrollView>

              {/* Demo Notice: Bypass without error blocks */}
              <View style={styles.demoBypassNoticeBar}>
                <Ionicons name="sparkles" size={14} color="#00B894" />
                <Text style={styles.demoBypassNoticeText}>
                  Demo Mode Active: Fields are pre-populated and can be bypassed smoothly.
                </Text>
              </View>

              {/* ---------------------------------------------------- */}
              {/* SLIDE 1: PERSONAL DETAILS */}
              {/* FULL NAME, last name, phone number verify otp, email verify email -> continue button */}
              {/* ---------------------------------------------------- */}
              {regStep === 1 && (
                <View style={styles.slideCard}>
                  <View style={styles.slideHeader}>
                    <Text style={styles.slideTitle}>Slide 1: Personal Details</Text>
                    <Text style={styles.slideSub}>Verify your identity and primary contact credentials.</Text>
                  </View>

                  {/* FULL NAME */}
                  <View style={styles.field}>
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="e.g. Kavitha"
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
                          <Text style={styles.verifiedBadgeText}>OTP Verified ✓</Text>
                        </View>
                      ) : (
                        <Text style={styles.unverifiedTag}>Verification required</Text>
                      )}
                    </View>
                    <View style={styles.inputWithActionRow}>
                      <TextInput
                        style={styles.inputFlex}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+91 97312 44821"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                      />
                      <TouchableOpacity
                        style={[styles.actionBtn, isPhoneVerified && styles.actionSuccessBtn]}
                        onPress={() => setShowPhoneOtpModal(true)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={isPhoneVerified ? 'checkmark-circle' : 'chatbox-ellipses-outline'}
                          size={14}
                          color={isPhoneVerified ? '#047857' : '#0A2342'}
                        />
                        <Text
                          style={[styles.actionBtnText, isPhoneVerified && styles.actionSuccessBtnText]}
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
                          <Text style={styles.verifiedBadgeText}>Email Verified ✓</Text>
                        </View>
                      ) : (
                        <Text style={styles.unverifiedTag}>Verification required</Text>
                      )}
                    </View>
                    <View style={styles.inputWithActionRow}>
                      <TextInput
                        style={styles.inputFlex}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="kavitha.r@mediunify.com"
                        placeholderTextColor="#94A3B8"
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                      <TouchableOpacity
                        style={[styles.actionBtn, isEmailVerified && styles.actionSuccessBtn]}
                        onPress={() => setShowEmailOtpModal(true)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={isEmailVerified ? 'checkmark-circle' : 'mail-unread-outline'}
                          size={14}
                          color={isEmailVerified ? '#047857' : '#0A2342'}
                        />
                        <Text
                          style={[styles.actionBtnText, isEmailVerified && styles.actionSuccessBtnText]}
                        >
                          {isEmailVerified ? 'Verified ✓' : 'Verify Email'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Continue Button */}
                  <TouchableOpacity
                    style={styles.primaryContinueBtn}
                    onPress={handleStep1Continue}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryContinueBtnText}>Continue to PUC Details</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* ---------------------------------------------------- */}
              {/* SLIDE 2: PROFESSIONAL DETAILS -> PUC DETAILS */}
              {/* puc details 1 slide -> continue button */}
              {/* in professional details add puc study , upload certicate also */}
              {/* ---------------------------------------------------- */}
              {regStep === 2 && (
                <View style={styles.slideCard}>
                  <View style={styles.slideHeader}>
                    <Text style={styles.slideTitle}>Slide 2: PUC Details</Text>
                    <Text style={styles.slideSub}>
                      Higher Secondary / Pre-University college education background.
                    </Text>
                  </View>

                  {/* PUC Study */}
                  <View style={styles.field}>
                    <Text style={styles.label}>PUC STUDY / COLLEGE NAME</Text>
                    <TextInput
                      style={styles.input}
                      value={pucCollege}
                      onChangeText={setPucCollege}
                      placeholder="e.g. St. Joseph's Pre-University College"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Stream & Board */}
                  <View style={styles.field}>
                    <Text style={styles.label}>STREAM & SPECIALIZATION</Text>
                    <View style={styles.pillWrapRow}>
                      {['Science (PCMB)', 'Science (PCB)', 'Science (PCMC)', 'General Science'].map(
                        (str) => (
                          <TouchableOpacity
                            key={str}
                            style={[styles.streamPill, pucStream === str && styles.streamPillActive]}
                            onPress={() => setPucStream(str)}
                          >
                            <Text
                              style={[
                                styles.streamPillText,
                                pucStream === str && styles.streamPillTextActive,
                              ]}
                            >
                              {str}
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>

                  <View style={styles.twoFieldsRow}>
                    <View style={[styles.field, { flex: 1.5 }]}>
                      <Text style={styles.label}>BOARD NAME</Text>
                      <TextInput
                        style={styles.input}
                        value={pucBoard}
                        onChangeText={setPucBoard}
                        placeholder="State Board / CBSE"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                    <View style={[styles.field, { flex: 1 }]}>
                      <Text style={styles.label}>PASSING YEAR</Text>
                      <TextInput
                        style={styles.input}
                        value={pucYear}
                        onChangeText={setPucYear}
                        placeholder="2014"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  {/* Upload Certificate */}
                  <View style={styles.field}>
                    <Text style={styles.label}>UPLOAD PUC CERTIFICATE / MARKS CARD</Text>
                    <View style={styles.certCard}>
                      <View style={styles.certIconCircle}>
                        <Ionicons name="document-text" size={24} color="#00B894" />
                      </View>
                      <View style={styles.certInfoCol}>
                        <Text style={styles.certName}>{pucCertificate.name}</Text>
                        <Text style={styles.certMeta}>
                          {pucCertificate.size} • Verified Pre-University Certificate
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.certChangeBtn}
                        onPress={() =>
                          setPucCertificate({
                            name: 'PUC_Marks_Card_Updated.pdf',
                            size: '1.6 MB',
                            date: 'Updated',
                          })
                        }
                      >
                        <Ionicons name="cloud-upload-outline" size={14} color="#0A2342" />
                        <Text style={styles.certChangeText}>Replace</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Back and Continue */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.backStepBtn}
                      onPress={() => setRegStep(1)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="arrow-back" size={15} color="#475569" />
                      <Text style={styles.backStepBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.flexContinueBtn}
                      onPress={handleStep2Continue}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryContinueBtnText}>Continue to Nursing Degree</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ---------------------------------------------------- */}
              {/* SLIDE 3: PROFESSIONAL DETAILS -> NURSING DEGREE */}
              {/* in degree search with dropdown of degree others means manual entry of degree take */}
              {/* ---------------------------------------------------- */}
              {regStep === 3 && (
                <View style={styles.slideCard}>
                  <View style={styles.slideHeader}>
                    <Text style={styles.slideTitle}>Slide 3: Nursing Degree & Council License</Text>
                    <Text style={styles.slideSub}>
                      Select your nursing degree or manually enter your qualification.
                    </Text>
                  </View>

                  {/* Degree with search and dropdown */}
                  <View style={styles.field}>
                    <Text style={styles.label}>NURSING DEGREE QUALIFICATION</Text>

                    {/* Trigger Box */}
                    <TouchableOpacity
                      style={styles.dropdownTriggerBox}
                      onPress={() => setShowDegreeDropdown(!showDegreeDropdown)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="school-outline" size={18} color="#00B894" />
                      <Text style={styles.dropdownTriggerText} numberOfLines={1}>
                        {selectedDegree}
                      </Text>
                      <Ionicons
                        name={showDegreeDropdown ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>

                    {/* Dropdown Box with Search */}
                    {showDegreeDropdown && (
                      <View style={styles.dropdownListBox}>
                        <View style={styles.dropdownSearchRow}>
                          <Ionicons name="search" size={16} color="#94A3B8" />
                          <TextInput
                            style={styles.dropdownSearchInput}
                            value={degreeSearchQuery}
                            onChangeText={setDegreeSearchQuery}
                            placeholder="Search nursing degree..."
                            placeholderTextColor="#94A3B8"
                            autoFocus
                          />
                        </View>
                        <ScrollView style={styles.dropdownOptionsScroll} nestedScrollEnabled>
                          {filteredDegrees.map((deg) => (
                            <TouchableOpacity
                              key={deg}
                              style={[
                                styles.dropdownOptionItem,
                                selectedDegree === deg && styles.dropdownOptionActive,
                              ]}
                              onPress={() => {
                                setSelectedDegree(deg);
                                setShowDegreeDropdown(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  selectedDegree === deg && styles.dropdownOptionTextActive,
                                ]}
                              >
                                {deg}
                              </Text>
                              {selectedDegree === deg && (
                                <Ionicons name="checkmark" size={16} color="#00B894" />
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* If 'Others' is selected -> Manual Entry Input */}
                    {selectedDegree.includes('Others') && (
                      <View style={styles.manualEntryWrap}>
                        <Text style={styles.manualEntryLabel}>
                          SPECIFY NURSING DEGREE (MANUAL ENTRY)
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={manualDegreeInput}
                          onChangeText={setManualDegreeInput}
                          placeholder="Type your degree name (e.g. B.Sc Critical Care Nursing)"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                    )}
                  </View>

                  {/* License and Council */}
                  <View style={styles.field}>
                    <Text style={styles.label}>NURSING COUNCIL REGISTRATION NO.</Text>
                    <TextInput
                      style={styles.input}
                      value={regNumber}
                      onChangeText={setRegNumber}
                      placeholder="e.g. KNC-2018-99412"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>REGISTRATION COUNCIL AUTHORITY</Text>
                    <TextInput
                      style={styles.input}
                      value={regAuthority}
                      onChangeText={setRegAuthority}
                      placeholder="e.g. Karnataka State Nursing Council (KSNC)"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Upload Degree Certificate */}
                  <View style={styles.field}>
                    <Text style={styles.label}>UPLOAD NURSING DEGREE / REGISTRATION CERTIFICATE</Text>
                    <View style={styles.certCard}>
                      <View style={styles.certIconCircle}>
                        <Ionicons name="ribbon" size={24} color="#00B894" />
                      </View>
                      <View style={styles.certInfoCol}>
                        <Text style={styles.certName}>{degreeCertificate.name}</Text>
                        <Text style={styles.certMeta}>
                          {degreeCertificate.size} • State Nursing Council Certified
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.certChangeBtn}
                        onPress={() =>
                          setDegreeCertificate({
                            name: 'Updated_Nursing_Registration_Certificate.pdf',
                            size: '2.5 MB',
                            date: 'Updated',
                          })
                        }
                      >
                        <Ionicons name="cloud-upload-outline" size={14} color="#0A2342" />
                        <Text style={styles.certChangeText}>Replace</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Back and Continue */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.backStepBtn}
                      onPress={() => setRegStep(2)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="arrow-back" size={15} color="#475569" />
                      <Text style={styles.backStepBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.flexContinueBtn}
                      onPress={handleStep3Continue}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryContinueBtnText}>Continue to Experience</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ---------------------------------------------------- */}
              {/* SLIDE 4: YEARS AND CLINICAL */}
              {/* year of exper search with dropdown */}
              {/* clincical skills & specification --> pop up--->inside it search with dropdown */}
              {/* ---------------------------------------------------- */}
              {regStep === 4 && (
                <View style={styles.slideCard}>
                  <View style={styles.slideHeader}>
                    <Text style={styles.slideTitle}>Slide 4: Experience & Clinical Competencies</Text>
                    <Text style={styles.slideSub}>
                      Set your clinical experience and pick specialized care competencies.
                    </Text>
                  </View>

                  {/* Years of Experience search with dropdown */}
                  <View style={styles.field}>
                    <Text style={styles.label}>YEARS OF EXPERIENCE</Text>
                    <TouchableOpacity
                      style={styles.dropdownTriggerBox}
                      onPress={() => setShowExpDropdown(!showExpDropdown)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="time-outline" size={18} color="#00B894" />
                      <Text style={styles.dropdownTriggerText}>{yearsOfExp}</Text>
                      <Ionicons
                        name={showExpDropdown ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>

                    {showExpDropdown && (
                      <View style={styles.dropdownListBox}>
                        {EXPERIENCE_OPTIONS.map((exp) => (
                          <TouchableOpacity
                            key={exp}
                            style={[
                              styles.dropdownOptionItem,
                              yearsOfExp === exp && styles.dropdownOptionActive,
                            ]}
                            onPress={() => {
                              setYearsOfExp(exp);
                              setShowExpDropdown(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                yearsOfExp === exp && styles.dropdownOptionTextActive,
                              ]}
                            >
                              {exp}
                            </Text>
                            {yearsOfExp === exp && (
                              <Ionicons name="checkmark" size={16} color="#00B894" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Clinical Hospital History */}
                  <View style={styles.field}>
                    <Text style={styles.label}>HOSPITAL / CLINICAL WORK SUMMARY</Text>
                    <TextInput
                      style={styles.input}
                      value={hospitalExperience}
                      onChangeText={setHospitalExperience}
                      placeholder="e.g. Manipal Hospitals (3 yrs), HomeCare (3 yrs)"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Clinical Skills & Specification -> POP-UP */}
                  <View style={styles.field}>
                    <View style={styles.labelBetween}>
                      <Text style={styles.label}>CLINICAL SKILLS & SPECIALIZATIONS</Text>
                      <Text style={styles.selectedCountBadge}>
                        {selectedSkills.length} Skills Selected
                      </Text>
                    </View>

                    {/* Pop-up trigger button */}
                    <TouchableOpacity
                      style={styles.openSkillsPopupBtn}
                      onPress={() => setShowSkillsModal(true)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.openSkillsIconWrap}>
                        <Ionicons name="medkit" size={16} color="#00B894" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.openSkillsTitle}>
                          Select Clinical Skills & Specializations
                        </Text>
                        <Text style={styles.openSkillsSub}>
                          Click to open pop-up search & check skills
                        </Text>
                      </View>
                      <Ionicons name="open-outline" size={18} color="#00B894" />
                    </TouchableOpacity>

                    {/* Display Selected Skills as interactive tag chips */}
                    <View style={styles.skillsTagWrap}>
                      {selectedSkills.map((sk) => (
                        <View key={sk} style={styles.skillTag}>
                          <Ionicons name="checkmark-circle" size={13} color="#00B894" />
                          <Text style={styles.skillTagText}>{sk}</Text>
                          <TouchableOpacity onPress={() => toggleSkill(sk)}>
                            <Ionicons name="close" size={14} color="#64748B" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Back and Continue */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.backStepBtn}
                      onPress={() => setRegStep(3)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="arrow-back" size={15} color="#475569" />
                      <Text style={styles.backStepBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.flexContinueBtn}
                      onPress={handleStep4Continue}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryContinueBtnText}>Continue to Photo & Sign</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ---------------------------------------------------- */}
              {/* SLIDE 5: PHOTO AND SIGN */}
              {/* photo and sign 1 slide --------> continue button */}
              {/* ---------------------------------------------------- */}
              {regStep === 5 && (
                <View style={styles.slideCard}>
                  <View style={styles.slideHeader}>
                    <Text style={styles.slideTitle}>Slide 5: Profile Photo & Signature</Text>
                    <Text style={styles.slideSub}>
                      Upload your clinical identity photo and digital authorization signature.
                    </Text>
                  </View>

                  {/* Photo Upload */}
                  <View style={styles.field}>
                    <Text style={styles.label}>NURSE PROFILE PHOTO</Text>
                    <View style={styles.photoUploadRow}>
                      <View style={styles.photoAvatarWrap}>
                        <Image source={{ uri: photoUri }} style={styles.photoAvatar} />
                        <View style={styles.photoCameraBadge}>
                          <Ionicons name="camera" size={12} color="#FFFFFF" />
                        </View>
                      </View>
                      <View style={{ flex: 1, gap: 5 }}>
                        <TouchableOpacity
                          style={styles.uploadPhotoBtn}
                          onPress={handleCyclePhoto}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="cloud-upload-outline" size={15} color="#0A2342" />
                          <Text style={styles.uploadPhotoBtnText}>Change Nurse Photo</Text>
                        </TouchableOpacity>
                        <Text style={styles.photoHint}>
                          Professional healthcare portrait recommended. Square format (PNG/JPG).
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Digital Signature */}
                  <View style={styles.field}>
                    <Text style={styles.label}>DIGITAL SIGNATURE</Text>
                    <View style={styles.signatureCard}>
                      <View style={styles.signatureCanvasPreview}>
                        <Text style={styles.signatureSimulatedText}>
                          Kavitha R.
                        </Text>
                        <Text style={styles.signatureDateWatermark}>
                          MediUnify e-Signed • 2026
                        </Text>
                      </View>
                      <View style={styles.signatureInfoRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.sigFileName}>{signatureData.name}</Text>
                          <Text style={styles.sigFileMeta}>
                            {signatureData.size} • {signatureData.date}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.sigReplaceBtn}
                          onPress={() =>
                            setSignatureData({
                              name: 'Digital_Signature_Replaced.png',
                              size: '480 KB',
                              date: 'Updated Just Now',
                            })
                          }
                        >
                          <Ionicons name="brush-outline" size={14} color="#0A2342" />
                          <Text style={styles.sigReplaceText}>Re-Sign / Replace</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Back and Continue */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.backStepBtn}
                      onPress={() => setRegStep(4)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="arrow-back" size={15} color="#475569" />
                      <Text style={styles.backStepBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.flexContinueBtn}
                      onPress={handleStep5Continue}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryContinueBtnText}>Continue to Security & Terms</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ---------------------------------------------------- */}
              {/* SLIDE 6: PASSWORD AND AGREEMENT CHECK */}
              {/* password and agreement check 1 slide */}
              {/* ---------------------------------------------------- */}
              {regStep === 6 && (
                <View style={styles.slideCard}>
                  <View style={styles.slideHeader}>
                    <Text style={styles.slideTitle}>Slide 6: Account Security & Agreement</Text>
                    <Text style={styles.slideSub}>
                      Set your account password and review MediUnify partner commitments.
                    </Text>
                  </View>

                  {/* Password */}
                  <View style={styles.field}>
                    <Text style={styles.label}>PASSWORD</Text>
                    <View style={styles.inputIconRow}>
                      <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                      <TextInput
                        style={styles.iconInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholder="At least 8 characters"
                        placeholderTextColor="#94A3B8"
                      />
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={18}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirm Password */}
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

                  {/* Agreement Checkboxes */}
                  <View style={styles.agreementBox}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => setAgreeTerms(!agreeTerms)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                        {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        I agree to the <Text style={styles.boldText}>MediUnify Clinical Practice Code of Conduct</Text> and Home Nursing Terms of Service.
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => setAgreeAuthenticity(!agreeAuthenticity)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.checkbox, agreeAuthenticity && styles.checkboxActive]}>
                        {agreeAuthenticity && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        I verify that all Nursing Council certifications, PUC details, and documents provided are genuine and true.
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Summary Review */}
                  <View style={styles.registrationSummaryCard}>
                    <Text style={styles.regSummaryTitle}>Onboarding Summary</Text>
                    <Text style={styles.regSummaryRow}>
                      • Nurse: <Text style={styles.boldText}>Nurse {fullName} {lastName}</Text>
                    </Text>
                    <Text style={styles.regSummaryRow}>
                      • Qualification: {selectedDegree.includes('Others') ? (manualDegreeInput || 'Other Degree') : selectedDegree}
                    </Text>
                    <Text style={styles.regSummaryRow}>
                      • Council Reg: {regNumber} ({regAuthority})
                    </Text>
                    <Text style={styles.regSummaryRow}>
                      • Experience: {yearsOfExp} • {selectedSkills.length} Verified Skills
                    </Text>
                  </View>

                  {/* Back and Submit */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.backStepBtn}
                      onPress={() => setRegStep(5)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="arrow-back" size={15} color="#475569" />
                      <Text style={styles.backStepBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.submitFinalBtn}
                      onPress={handleStep6Submit}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                      <Text style={styles.submitFinalBtnText}>Submit Registration</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Notice: Demo button and Check status button are removed from signup */}
            </View>
          )}

          {/* Toggle between Sign In and Sign Up */}
          <View style={styles.footerToggle}>
            <Text style={styles.footerToggleText}>
              {isRegister ? 'Already registered as a Nurse?' : "Don't have a Nurse account yet?"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsRegister(!isRegister);
                setRegStep(1);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.footerToggleLink}>
                {isRegister ? 'Nurse Sign In' : 'Sign Up as Nurse'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ======================================================== */}
      {/* MODAL: CLINICAL SKILLS & SPECIFICATION POP-UP */}
      {/* "clincical skills & specification --> pop up--->inside it search with dropdown" */}
      {/* ======================================================== */}
      <Modal visible={showSkillsModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.skillsModalBox}>
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.modalIconWrap}>
                  <Ionicons name="medkit" size={22} color="#00B894" />
                </View>
                <View>
                  <Text style={styles.skillsModalTitle}>Clinical Skills & Specializations</Text>
                  <Text style={styles.skillsModalSub}>
                    Search and select your clinical proficiencies
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowSkillsModal(false)}
                style={styles.modalCloseIconBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Search Bar inside pop-up */}
            <View style={styles.skillsSearchRow}>
              <Ionicons name="search" size={18} color="#00B894" />
              <TextInput
                style={styles.skillsSearchInput}
                value={skillSearchQuery}
                onChangeText={setSkillSearchQuery}
                placeholder="Search clinical skills (e.g. Wound, IV, ICU, Geriatric)..."
                placeholderTextColor="#94A3B8"
              />
              {skillSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSkillSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* List of Skills with Checkboxes */}
            <ScrollView style={styles.skillsScrollList} showsVerticalScrollIndicator>
              {filteredSkills.map((skill) => {
                const isChecked = selectedSkills.includes(skill);
                return (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.skillCheckItem, isChecked && styles.skillCheckItemActive]}
                    onPress={() => toggleSkill(skill)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.skillCheckbox, isChecked && styles.skillCheckboxActive]}>
                      {isChecked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                    <Text
                      style={[
                        styles.skillCheckText,
                        isChecked && styles.skillCheckTextActive,
                      ]}
                    >
                      {skill}
                    </Text>
                    {isChecked && (
                      <View style={styles.skillSelectedPill}>
                        <Text style={styles.skillSelectedPillText}>Selected</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Pop-up Footer */}
            <View style={styles.skillsModalFooter}>
              <Text style={styles.skillsCountText}>
                {selectedSkills.length} skills selected
              </Text>
              <TouchableOpacity
                style={styles.skillsDoneBtn}
                onPress={() => setShowSkillsModal(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.skillsDoneBtnText}>Save & Apply Skills</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL: POST-SUBMIT POP-UP NOTE "the your account will be verficed" BELOW OK BUTTON */}
      {/* ======================================================== */}
      <Modal visible={showVerifiedPopUp} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.verifiedModalCard}>
            {/* Green Shield Icon */}
            <View style={styles.verifiedIconCircle}>
              <Ionicons name="shield-checkmark" size={40} color="#00B894" />
            </View>

            {/* Requested Note */}
            <Text style={styles.verifiedModalMainNote}>Your account will be verified</Text>

            <Text style={styles.verifiedModalSubNote}>
              Your nursing application, PUC education record, Nursing Council certificate, and clinical specialization have been securely submitted to the MediUnify Clinical Compliance Panel.
            </Text>

            {/* Application Summary Box */}
            <View style={styles.verifiedMetaBox}>
              <View style={styles.verifiedMetaRow}>
                <Ionicons name="person-circle-outline" size={16} color="#0A2342" />
                <Text style={styles.verifiedMetaText}>Nurse {fullName} {lastName}</Text>
              </View>
              <View style={styles.verifiedMetaRow}>
                <Ionicons name="ribbon-outline" size={16} color="#00B894" />
                <Text style={styles.verifiedMetaText}>
                  {selectedDegree.includes('Others') ? (manualDegreeInput || 'Nursing Degree') : selectedDegree}
                </Text>
              </View>
              <View style={styles.verifiedMetaRow}>
                <Ionicons name="checkmark-done-circle-outline" size={16} color="#10B981" />
                <Text style={styles.verifiedMetaText}>
                  License: {regNumber} • {yearsOfExp}
                </Text>
              </View>
            </View>

            {/* OK Button */}
            <TouchableOpacity
              style={styles.verifiedOkBtn}
              onPress={handleConfirmVerifiedOk}
              activeOpacity={0.85}
            >
              <Text style={styles.verifiedOkBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL: PHONE OTP DEMO POP-UP */}
      {/* ======================================================== */}
      <Modal visible={showPhoneOtpModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.otpModalCard}>
            <View style={styles.otpIconCircle}>
              <Ionicons name="chatbubbles" size={26} color="#00B894" />
            </View>
            <Text style={styles.otpModalTitle}>Phone OTP Verification</Text>
            <Text style={styles.otpModalSub}>
              Enter the 4-digit code sent to <Text style={{ fontWeight: '700', color: '#0A2342' }}>{phone}</Text>
            </Text>
            <TextInput
              style={styles.otpInputBox}
              value={phoneOtpInput}
              onChangeText={setPhoneOtpInput}
              keyboardType="number-pad"
              maxLength={6}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowPhoneOtpModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => {
                  setIsPhoneVerified(true);
                  setShowPhoneOtpModal(false);
                }}
              >
                <Text style={styles.modalConfirmText}>Verify Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL: EMAIL OTP DEMO POP-UP */}
      {/* ======================================================== */}
      <Modal visible={showEmailOtpModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.otpModalCard}>
            <View style={styles.otpIconCircle}>
              <Ionicons name="mail" size={26} color="#00B894" />
            </View>
            <Text style={styles.otpModalTitle}>Email Verification</Text>
            <Text style={styles.otpModalSub}>
              Enter the verification code sent to <Text style={{ fontWeight: '700', color: '#0A2342' }}>{email}</Text>
            </Text>
            <TextInput
              style={styles.otpInputBox}
              value={emailOtpInput}
              onChangeText={setEmailOtpInput}
              keyboardType="number-pad"
              maxLength={6}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowEmailOtpModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => {
                  setIsEmailVerified(true);
                  setShowEmailOtpModal(false);
                }}
              >
                <Text style={styles.modalConfirmText}>Verify Email</Text>
              </TouchableOpacity>
            </View>
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
  nurseBadgePill: {
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
  nurseBadgeText: {
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

  /* ---------------- Scroll & Auth Card ---------------- */
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  authCard: {
    width: '100%',
    maxWidth: 580,
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
    maxWidth: 460,
  },

  /* ---------------- Form Common ---------------- */
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
  primarySubmitBtn: {
    backgroundColor: '#0A2342',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  primarySubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },

  /* ---------------- STEPPER ---------------- */
  stepperScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 6,
  },
  stepItem: {
    alignItems: 'center',
    gap: 5,
    minWidth: 70,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  stepCircleDone: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  stepCircleText: {
    fontSize: 11,
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
    width: 20,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  stepLineDone: {
    backgroundColor: '#00B894',
  },

  demoBypassNoticeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  demoBypassNoticeText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
    flex: 1,
  },

  /* ---------------- SLIDE CARD ---------------- */
  slideCard: {
    gap: 15,
  },
  slideHeader: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 3,
  },
  slideTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A2342',
  },
  slideSub: {
    fontSize: 11.5,
    color: '#64748B',
  },

  /* Action Buttons in inputs */
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
  actionBtn: {
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
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A2342',
  },
  actionSuccessBtn: {
    backgroundColor: '#E8F8F5',
    borderColor: '#A7F3D0',
  },
  actionSuccessBtnText: {
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

  /* Slide 2: PUC Details */
  pillWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  streamPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
  },
  streamPillActive: {
    backgroundColor: '#E8F8F5',
    borderColor: '#00B894',
  },
  streamPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  streamPillTextActive: {
    color: '#00B894',
  },
  twoFieldsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  /* Certificate Cards */
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 10,
    padding: 12,
  },
  certIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certInfoCol: {
    flex: 1,
    gap: 2,
  },
  certName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  certMeta: {
    fontSize: 11,
    color: '#15803D',
  },
  certChangeBtn: {
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
  certChangeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A2342',
  },

  /* Dropdown Styles (Degree & Experience) */
  dropdownTriggerBox: {
    height: 44,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  dropdownTriggerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  dropdownListBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 8,
    gap: 6,
    marginTop: 4,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
  dropdownSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 7,
    paddingHorizontal: 10,
    height: 38,
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  dropdownOptionsScroll: {
    maxHeight: 180,
  },
  dropdownOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dropdownOptionActive: {
    backgroundColor: '#E8F8F5',
  },
  dropdownOptionText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  dropdownOptionTextActive: {
    color: '#00B894',
    fontWeight: '700',
  },
  manualEntryWrap: {
    marginTop: 6,
    gap: 5,
  },
  manualEntryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00B894',
    letterSpacing: 0.5,
  },

  /* Slide 4: Skills Trigger & Tags */
  selectedCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  openSkillsPopupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 10,
    padding: 12,
  },
  openSkillsIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openSkillsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2342',
  },
  openSkillsSub: {
    fontSize: 11,
    color: '#15803D',
  },
  skillsTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },
  skillTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },

  /* Slide 5: Photo & Signature */
  photoUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
  },
  photoAvatarWrap: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  photoAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  photoCameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploadPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 7,
  },
  uploadPhotoBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0A2342',
  },
  photoHint: {
    fontSize: 10.5,
    color: '#64748B',
  },

  signatureCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  signatureCanvasPreview: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureSimulatedText: {
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#0A2342',
    fontFamily: 'serif',
  },
  signatureDateWatermark: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  signatureInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sigFileName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  sigFileMeta: {
    fontSize: 11,
    color: '#059669',
  },
  sigReplaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  sigReplaceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A2342',
  },

  /* Slide 6: Agreement & Summary */
  agreementBox: {
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  checkboxLabel: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
    color: '#0A2342',
  },
  registrationSummaryCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  regSummaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  regSummaryRow: {
    fontSize: 11.5,
    color: '#15803D',
  },

  /* Navigation Buttons */
  primaryContinueBtn: {
    backgroundColor: '#0A2342',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  primaryContinueBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  backStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#F1F5F9',
    borderRadius: 9,
  },
  backStepBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  flexContinueBtn: {
    flex: 1,
    backgroundColor: '#0A2342',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitFinalBtn: {
    flex: 1,
    backgroundColor: '#00B894',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitFinalBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  /* Footer Toggle */
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

  /* Skills Pop-up Modal */
  skillsModalBox: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    gap: 14,
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillsModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A2342',
  },
  skillsModalSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  modalCloseIconBtn: {
    padding: 6,
  },
  skillsSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    paddingHorizontal: 12,
    height: 42,
  },
  skillsSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  skillsScrollList: {
    maxHeight: 320,
  },
  skillCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  skillCheckItemActive: {
    backgroundColor: '#F0FDF4',
  },
  skillCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillCheckboxActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  skillCheckText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  skillCheckTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  skillSelectedPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  skillSelectedPillText: {
    fontSize: 10,
    color: '#15803D',
    fontWeight: '700',
  },
  skillsModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  skillsCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  skillsDoneBtn: {
    backgroundColor: '#00B894',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 9,
  },
  skillsDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Verified Success Pop-up Modal */
  verifiedModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 24px 50px rgba(0, 0, 0, 0.35)',
  },
  verifiedIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F8F5',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedModalMainNote: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0A2342',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  verifiedModalSubNote: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  verifiedMetaBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginVertical: 4,
  },
  verifiedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  verifiedOkBtn: {
    width: '100%',
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    boxShadow: '0 4px 14px rgba(0, 184, 148, 0.4)',
  },
  verifiedOkBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* OTP Modals */
  otpModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  otpIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0A2342',
  },
  otpModalSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
  },
  otpInputBox: {
    width: '100%',
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
    marginVertical: 4,
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
});
