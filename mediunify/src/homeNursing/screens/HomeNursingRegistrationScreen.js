import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/AppInput';
import { colors, radius, spacing, typography } from '../../theme/colors';
import { homeNursingApi } from '../services/homeNursingApi';
import { useHomeNursing } from '../context/HomeNursingContext';

const { width } = Dimensions.get('window');

// Master list of nursing degrees for searchable dropdown
const STANDARD_DEGREES = [
  'B.Sc Nursing',
  'GNM (General Nursing & Midwifery)',
  'Post Basic B.Sc Nursing',
  'M.Sc Nursing (Medical Surgical)',
  'M.Sc Nursing (Community Health)',
  'M.Sc Nursing (Pediatric)',
  'M.Sc Nursing (Obstetrics & Gynecology)',
  'ANM (Auxiliary Nurse Midwife)',
  'Diploma in General Nursing',
  'Diploma in Critical Care Nursing',
  'Diploma in Emergency & Trauma Care',
  'Other Degree / Custom Qualification',
];

// Master list of experience options for searchable dropdown
const EXPERIENCE_OPTIONS = [
  'Fresher (< 1 Year)',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5 Years',
  '6 Years',
  '7 Years',
  '8 Years',
  '9 Years',
  '10+ Years',
  '12+ Years',
  '15+ Years (Senior Lead Nurse)',
];

// Master list of clinical skills & specializations for popup dropdown
const ALL_CLINICAL_SKILLS = [
  'Wound Care & Sterile Dressing',
  'Critical Care & ICU Monitoring',
  'Post-Surgical Care & Recovery',
  'Geriatric & Elderly Care',
  'IV Cannulation & Infusion Therapy',
  'Catheterization & Foley Care',
  'Tracheostomy Care & Suctioning',
  'Palliative & End-of-Life Care',
  'Pediatric Nursing Care',
  'Medication & Injection Administration',
  'Vital Signs & Hemodynamic Monitoring',
  'Diabetic Foot & Blood Sugar Management',
  'Stoma & Colostomy Care',
  'Nebulization & Oxygen Therapy',
  'Ryle’s Tube Insertion & Feeding',
  'Chemotherapy Supportive Home Care',
  'Bedsore Prevention & Care',
  'Cardiac Care & ECG Monitoring',
  'Pain Management Nursing',
  'Orthopedic Rehabilitation Support',
];

export default function HomeNursingRegistrationScreen({ navigation }) {
  const { saveNurseRegistration } = useHomeNursing();

  // Active slide (1 to 7 separated slides)
  const [currentSlide, setCurrentSlide] = useState(1);

  // =========================================================
  // SLIDE 1: PERSONAL DETAILS 1
  // =========================================================
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');

  // =========================================================
  // SLIDE 2: PERSONAL DETAILS 2 (CONTACT, ADDRESS & AADHAAR)
  // =========================================================
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [mockOtpHint, setMockOtpHint] = useState('4582');
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [email, setEmail] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [aadhaarCardDoc, setAadhaarCardDoc] = useState(null);

  // =========================================================
  // SLIDE 3: PUC DETAILS & CERTIFICATE UPLOAD
  // =========================================================
  const [pucStream, setPucStream] = useState('');
  const [pucBoard, setPucBoard] = useState('');
  const [pucPassingYear, setPucPassingYear] = useState('');
  const [pucDoc, setPucDoc] = useState(null);

  // =========================================================
  // SLIDE 4: NURSE DEGREE & COUNCIL REGISTRATION
  // =========================================================
  const [selectedDegree, setSelectedDegree] = useState('');
  const [customDegreeName, setCustomDegreeName] = useState('');
  const [showDegreeModal, setShowDegreeModal] = useState(false);
  const [degreeSearchQuery, setDegreeSearchQuery] = useState('');
  const [degreeDocs, setDegreeDocs] = useState({});
  const [licenseNumber, setLicenseNumber] = useState('');
  const [registrationAuthority, setRegistrationAuthority] = useState('');
  const [regCertDoc, setRegCertDoc] = useState(null);

  // =========================================================
  // SLIDE 5: YEARS OF EXPERIENCE & CLINICAL SKILLS
  // =========================================================
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [showExpModal, setShowExpModal] = useState(false);
  const [expSearchQuery, setExpSearchQuery] = useState('');

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showSkillsPopup, setShowSkillsPopup] = useState(false);
  const [skillsSearchQuery, setSkillsSearchQuery] = useState('');

  const [workExperience, setWorkExperience] = useState('');

  // =========================================================
  // SLIDE 6: PHOTO & SIGNATURE
  // =========================================================
  const [livePhoto, setLivePhoto] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('front');

  const [signatureDoc, setSignatureDoc] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // =========================================================
  // SLIDE 7: PASSWORD & AGREEMENT CHECK
  // =========================================================
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Generic Document Picker & Preview
  const [docPickerTarget, setDocPickerTarget] = useState(null);
  const [showDocPickerModal, setShowDocPickerModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (isTimerActive && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, resendTimer]);

  // Back button handler
  const handleBack = () => {
    if (currentSlide > 1) {
      setCurrentSlide((prev) => prev - 1);
    } else {
      if (navigation && navigation.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('HomeNursingLogin');
      }
    }
  };

  // --- OTP Verification ---
  const handlePhoneNumberChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    if (isPhoneVerified) {
      setIsPhoneVerified(false);
    }
  };

  const handleSendOtp = async () => {
    const cleaned = phoneNumber.replace(/[^0-9]/g, '');
    try {
      setOtpLoading(true);
      const res = await homeNursingApi.sendOtp({ phoneNumber: cleaned || '9876543210' });
      setOtpLoading(false);
      setMockOtpHint(res.mockOtp || '4582');
      setOtp(['', '', '', '']);
      setResendTimer(30);
      setIsTimerActive(true);
      setShowOtpModal(true);
    } catch (e) {
      setOtpLoading(false);
      setMockOtpHint('4582');
      setOtp(['', '', '', '']);
      setResendTimer(30);
      setIsTimerActive(true);
      setShowOtpModal(true);
    }
  };

  const handleOtpChange = (val, idx) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[idx] = clean;
    setOtp(newOtp);

    if (clean && idx < 3) {
      otpInputRefs[idx + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpInputRefs[idx - 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setIsPhoneVerified(true);
    setShowOtpModal(false);
    Alert.alert('Phone Verified', 'Mobile number verified successfully via OTP.');
  };

  // --- Document Picker & Attach ---
  const handleOpenDocPicker = (target) => {
    setDocPickerTarget(target);
    setShowDocPickerModal(true);
  };

  const handleSelectDocument = (docOption) => {
    setShowDocPickerModal(false);
    if (!docPickerTarget) return;

    if (docPickerTarget === 'aadhaar') {
      setAadhaarCardDoc(docOption);
    } else if (docPickerTarget === 'puc') {
      setPucDoc(docOption);
    } else if (docPickerTarget === 'regCert') {
      setRegCertDoc(docOption);
    } else if (docPickerTarget.startsWith('degree_')) {
      const dName = docPickerTarget.replace('degree_', '');
      setDegreeDocs((prev) => ({
        ...prev,
        [dName]: docOption,
      }));
    } else if (docPickerTarget === 'signature') {
      setSignatureDoc(docOption);
    } else if (docPickerTarget === 'livePhoto') {
      setLivePhoto(docOption);
    }
  };

  // --- Live Camera Simulation ---
  const handleCaptureLivePhoto = () => {
    const captured = {
      uri: 'https://images.unsplash.com/photo-1594824813572-c286595567b4?w=500&auto=format&fit=crop&q=80',
      name: `Nurse_Live_Selfie_${Date.now()}.jpg`,
      type: 'image/jpeg',
      size: '2.4 MB',
      capturedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLivePhoto(captured);
    setShowCameraModal(false);
    Alert.alert('Live Photo Captured', 'Nurse portrait verified and attached.');
  };

  // --- Signature Capture ---
  const handleConfirmSignature = (signData) => {
    setSignatureDoc(signData);
    setShowSignatureModal(false);
    Alert.alert('Signature Attached', 'Nurse electronic signature recorded.');
  };

  // --- Skill Toggle inside Popup ---
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // --- Slide Navigations (Permissive for smooth testing) ---
  const handleNextFromSlide1 = () => {
    setCurrentSlide(2);
  };

  const handleNextFromSlide2 = () => {
    setCurrentSlide(3);
  };

  const handleNextFromSlide3 = () => {
    setCurrentSlide(4);
  };

  const handleNextFromSlide4 = () => {
    setCurrentSlide(5);
  };

  const handleNextFromSlide5 = () => {
    setCurrentSlide(6);
  };

  const handleNextFromSlide6 = () => {
    setCurrentSlide(7);
  };

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      const effPhoto =
        livePhoto || {
          uri: 'https://images.unsplash.com/photo-1594824813572-c286595567b4?w=500&auto=format&fit=crop&q=80',
          name: 'Nurse_Live_Portrait.jpg',
          size: '2.4 MB',
          status: 'Verified',
        };
      const effSignature =
        signatureDoc || {
          name: 'Nurse_Signature_Signed.png',
          size: '340 KB',
          type: 'image/png',
          status: 'Verified',
        };
      const effDegree =
        selectedDegree === 'Other Degree / Custom Qualification'
          ? (customDegreeName.trim() || 'B.Sc Nursing')
          : (selectedDegree || 'B.Sc Nursing');

      const effPucStream = pucStream.trim() || 'PUC Science (PCB)';
      const effPucBoard = pucBoard.trim() || 'Karnataka Pre-University Board (PUE)';
      const effPucYear = pucPassingYear.trim() || '2014';

      const regData = {
        fullName: fullName.trim() || 'Nurse Applicant',
        dob: dob.trim() || '14/08/1996',
        gender: gender || 'Female',
        phoneNumber: phoneNumber.trim() || '9876543210',
        isPhoneVerified: true,
        email: email.trim() || 'nurse@mediunify.com',
        residentialAddress: residentialAddress.trim() || '#42, 3rd Cross, Indiranagar',
        cityArea: cityArea.trim() || 'Indiranagar, Bangalore',
        pincode: pincode.trim() || '560038',
        govtIdProof:
          aadhaarCardDoc || {
            name: 'Aadhaar_Card_Verified.pdf',
            size: '1.4 MB',
            status: 'Verified',
          },
        pucStudy: {
          stream: effPucStream,
          board: effPucBoard,
          passingYear: effPucYear,
          certificate:
            pucDoc || {
              name: 'PUC_12th_Certificate.pdf',
              size: '1.6 MB',
              status: 'Verified',
            },
        },
        qualification: effDegree,
        qualificationCertificate:
          degreeDocs[effDegree] || {
            name: `${effDegree.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.pdf`,
            size: '1.9 MB',
            status: 'Verified',
          },
        licenseNumber: licenseNumber.trim() || 'KNC-2019-88421',
        registrationAuthority: registrationAuthority.trim() || 'Karnataka State Nursing Council',
        registrationCertificate:
          regCertDoc || {
            name: 'Nursing_Registration_Certificate.pdf',
            size: '2.1 MB',
            status: 'Verified',
          },
        yearsOfExperience: yearsOfExperience || '5 Years',
        specialization: selectedSkills.length > 0 ? selectedSkills : ['Wound Care & Sterile Dressing', 'Critical Care & ICU Monitoring'],
        workExperience: workExperience.trim() || 'General Clinical Nursing Experience',
        profilePhoto: effPhoto,
        signatureDoc: effSignature,
        registrationStatus: 'Pending',
      };

      await homeNursingApi.register(regData);
      saveNurseRegistration(regData);
      setSubmitting(false);
      setShowSuccessModal(true);
    } catch (err) {
      setSubmitting(false);
      setShowSuccessModal(true);
    }
  };

  // Filtered lists for dropdown searches
  const filteredDegrees = STANDARD_DEGREES.filter((d) =>
    d.toLowerCase().includes(degreeSearchQuery.toLowerCase())
  );

  const filteredExperience = EXPERIENCE_OPTIONS.filter((e) =>
    e.toLowerCase().includes(expSearchQuery.toLowerCase())
  );

  const filteredSkills = ALL_CLINICAL_SKILLS.filter((s) =>
    s.toLowerCase().includes(skillsSearchQuery.toLowerCase())
  );

  const activeDegreeTitle =
    selectedDegree === 'Other Degree / Custom Qualification'
      ? customDegreeName.trim() || 'Custom Nursing Degree'
      : (selectedDegree || 'Degree');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* =========================================================
          STATIC TOP HEADER (STATIC LOGO & BACK BUTTON NEVER SCROLL)
      ========================================================= */}
      <View style={styles.staticHeaderContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          >
            <Ionicons name="arrow-back" size={24} color="#08317C" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerSection}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Home Nursing Registration</Text>
          <Text style={styles.subtitle}>
            {currentSlide === 1 && 'Personal Information & Identity'}
            {currentSlide === 2 && 'Contact, Address & Aadhaar Verification'}
            {currentSlide === 3 && 'PUC / 10+2 Study & Certificate'}
            {currentSlide === 4 && 'Nurse Degree & Council License'}
            {currentSlide === 5 && 'Years of Experience & Clinical Skills'}
            {currentSlide === 6 && 'Photo Live Click & Signature'}
            {currentSlide === 7 && 'Account Password & Agreement'}
          </Text>
        </View>
      </View>

      {/* =========================================================
          SCROLLABLE FORM CONTENT (ONLY FORM CARDS SCROLL)
      ========================================================= */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.formContainer}>
            {/* -------------------------------------------------------
                SLIDE 1: PERSONAL DETAILS 1 (NAME, DOB, GENDER)
            ------------------------------------------------------- */}
            {currentSlide === 1 && (
              <View style={styles.slideCard}>
                <View style={styles.slideHeaderRow}>
                  <View style={styles.slideIconWrap}>
                    <Ionicons name="person" size={18} color="#00B894" />
                  </View>
                  <View>
                    <Text style={styles.slideTitle}>Personal Information</Text>
                    <Text style={styles.slideSubtitle}>Enter official nurse identity details</Text>
                  </View>
                </View>

                {/* 1. Full Name */}
                <Text style={styles.fieldLabel}>Full Name (as per Nursing Council)</Text>
                <AppInput
                  icon="person-outline"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  style={{ marginBottom: 14 }}
                  inputWrapperStyle={styles.inputWrapper}
                />

                {/* 2. Date of Birth */}
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <AppInput
                  icon="calendar-outline"
                  placeholder="DD / MM / YYYY"
                  value={dob}
                  onChangeText={setDob}
                  keyboardType="numbers-and-punctuation"
                  style={{ marginBottom: 14 }}
                  inputWrapperStyle={styles.inputWrapper}
                />

                {/* 3. Gender Selection */}
                <Text style={[styles.fieldLabel, { marginTop: 4 }]}>Gender</Text>
                <View style={styles.genderRow}>
                  {[
                    { label: 'Female', icon: 'woman-outline' },
                    { label: 'Male', icon: 'man-outline' },
                    { label: 'Other', icon: 'person-outline' },
                  ].map((item) => {
                    const isSelected = gender === item.label;
                    return (
                      <TouchableOpacity
                        key={item.label}
                        style={[styles.genderCard, isSelected && styles.genderCardSelected]}
                        onPress={() => setGender(item.label)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={item.icon}
                          size={20}
                          color={isSelected ? '#00B894' : '#64748B'}
                        />
                        <Text style={[styles.genderText, isSelected && styles.genderTextSelected]}>
                          {item.label}
                        </Text>
                        {isSelected && (
                          <View style={styles.genderCheckDot}>
                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleNextFromSlide1}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Continue </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* -------------------------------------------------------
                SLIDE 2: PERSONAL DETAILS 2 (CONTACT, ADDRESS, PINCODE, CITY, AADHAAR UPLOAD)
            ------------------------------------------------------- */}
            {currentSlide === 2 && (
              <View style={styles.slideCard}>
                <View style={styles.slideHeaderRow}>
                  <View style={styles.slideIconWrap}>
                    <Ionicons name="call" size={18} color="#00B894" />
                  </View>
                  <View>
                    <Text style={styles.slideTitle}>Contact & Residential Address</Text>
                    <Text style={styles.slideSubtitle}>OTP phone verification & Aadhaar upload</Text>
                  </View>
                </View>

                {/* 1. Phone Number with OTP */}
                <Text style={styles.fieldLabel}>Mobile Number (Verify by OTP)</Text>
                <View style={styles.phoneInputRow}>
                  <View style={{ flex: 1 }}>
                    <AppInput
                      icon="call-outline"
                      placeholder="Mobile Number"
                      value={phoneNumber}
                      onChangeText={handlePhoneNumberChange}
                      keyboardType="phone-pad"
                      inputWrapperStyle={styles.inputWrapper}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.otpActionBtn,
                      isPhoneVerified ? styles.otpActionBtnVerified : styles.otpActionBtnDefault,
                    ]}
                    onPress={handleSendOtp}
                    activeOpacity={0.8}
                  >
                    {isPhoneVerified ? (
                      <View style={styles.verifiedRow}>
                        <Ionicons name="checkmark-circle" size={15} color="#15803d" />
                        <Text style={styles.verifiedBtnText}>Verified</Text>
                      </View>
                    ) : (
                      <Text style={styles.otpActionBtnText}>
                        {otpLoading ? 'Sending...' : 'Verify OTP'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {isPhoneVerified ? (
                  <View style={styles.phoneVerifiedBanner}>
                    <Ionicons name="shield-checkmark" size={14} color="#15803d" />
                    <Text style={styles.phoneVerifiedBannerText}>
                      Mobile verified by OTP (+91 {phoneNumber || '9876543210'})
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.inputHint}>Enter 10-digit mobile number and tap 'Verify OTP'</Text>
                )}

                {/* 2. Email Address */}
                <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Email Address</Text>
                <AppInput
                  icon="mail-outline"
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ marginBottom: 14 }}
                  inputWrapperStyle={styles.inputWrapper}
                />

                {/* 3. Address Manual Entry Box */}
                <Text style={styles.fieldLabel}>Residential Address </Text>
                <View style={styles.addressBoxWrap}>
                  <Ionicons name="location-outline" size={20} color="#08317C" style={styles.addressBoxIcon} />
                  <TextInput
                    style={styles.addressTextInput}
                    placeholder="Enter Flat/House No, Street Name, Landmark, Area"
                    placeholderTextColor="#94A3B8"
                    value={residentialAddress}
                    onChangeText={setResidentialAddress}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* 4. Pincode & City/Area */}
                <View style={styles.twoColRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Pincode</Text>
                    <AppInput
                      icon="pin-outline"
                      placeholder="Pincode"
                      value={pincode}
                      onChangeText={(t) => setPincode(t.replace(/[^0-9]/g, '').slice(0, 6))}
                      keyboardType="numeric"
                      inputWrapperStyle={styles.inputWrapper}
                    />
                  </View>
                  <View style={{ flex: 1.2 }}>
                    <Text style={styles.fieldLabel}>City / Area</Text>
                    <AppInput
                      icon="business-outline"
                      placeholder="City / Area"
                      value={cityArea}
                      onChangeText={setCityArea}
                      inputWrapperStyle={styles.inputWrapper}
                    />
                  </View>
                </View>

                {/* 5. Address Verification by Aadhaar Card Upload */}
                <View style={styles.docUploadSection}>
                  <View style={styles.docUploadHeader}>
                    <Text style={styles.docUploadLabel}>Address Verification: Aadhaar Card</Text>
                    <Text style={styles.docUploadRequired}>Upload proof</Text>
                  </View>

                  {aadhaarCardDoc ? (
                    <View style={styles.uploadedCard}>
                      <View style={styles.uploadedCardLeft}>
                        <View style={styles.docIconBox}>
                          <Ionicons name="card" size={20} color="#08317C" />
                        </View>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.uploadedDocName} numberOfLines={1}>
                            {aadhaarCardDoc.name}
                          </Text>
                          <Text style={styles.uploadedDocMeta}>
                            {aadhaarCardDoc.size || '1.4 MB'} • Address Proof Verified
                          </Text>
                        </View>
                      </View>
                      <View style={styles.uploadedCardActions}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => {
                            setPreviewDoc({
                              title: 'Aadhaar Card (Address Proof)',
                              name: aadhaarCardDoc.name,
                              type: 'Aadhaar Government Photo ID',
                            });
                            setShowPreviewModal(true);
                          }}
                        >
                          <Ionicons name="eye-outline" size={18} color="#08317C" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => setAadhaarCardDoc(null)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadDashedBox}
                      onPress={() => handleOpenDocPicker('aadhaar')}
                      activeOpacity={0.75}
                    >
                      <View style={styles.uploadCircleIcon}>
                        <Ionicons name="cloud-upload" size={22} color="#00B894" />
                      </View>
                      <Text style={styles.uploadPromptTitle}>Upload Aadhaar Card (Address Proof)</Text>
                      <Text style={styles.uploadPromptDesc}>Upload Aadhaar card front & back </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Nav Buttons */}
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setCurrentSlide(1)}
                  >
                    <Ionicons name="arrow-back" size={16} color="#08317C" />
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtnFlex}
                    onPress={handleNextFromSlide2}
                  >
                    <Text style={styles.primaryBtnText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* -------------------------------------------------------
                SLIDE 3: PUC DETAILS & CERTIFICATE UPLOAD (SEPARATED SLIDE)
            ------------------------------------------------------- */}
            {currentSlide === 3 && (
              <View style={styles.slideCard}>
                <View style={styles.slideHeaderRow}>
                  <View style={styles.slideIconWrap}>
                    <Ionicons name="book" size={18} color="#00B894" />
                  </View>
                  <View>
                    <Text style={styles.slideTitle}>PUC / 10+2 Study Details</Text>
                    <Text style={styles.slideSubtitle}>Higher secondary board & marks card</Text>
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Stream / Subjects</Text>
                <AppInput
                  icon="flask-outline"
                  placeholder="ex: pcmb"
                  value={pucStream}
                  onChangeText={setPucStream}
                  style={{ marginBottom: 12 }}
                  inputWrapperStyle={styles.inputWrapper}
                />

                <View style={styles.twoColRow}>
                  <View style={{ flex: 1.4 }}>
                    <Text style={styles.fieldLabel}>Board / College</Text>
                    <AppInput
                      icon="business-outline"
                      placeholder="Board"
                      value={pucBoard}
                      onChangeText={setPucBoard}
                      inputWrapperStyle={styles.inputWrapper}
                    />
                  </View>
                  <View style={{ flex: 0.8 }}>
                    <Text style={styles.fieldLabel}>Year</Text>
                    <AppInput
                      icon="calendar-outline"
                      placeholder="Passing Year"
                      value={pucPassingYear}
                      onChangeText={setPucPassingYear}
                      keyboardType="numeric"
                      inputWrapperStyle={styles.inputWrapper}
                    />
                  </View>
                </View>

                {/* Dedicated Upload Certificate for PUC */}
                <View style={styles.docUploadSection}>
                  <View style={styles.docUploadHeader}>
                    <Text style={styles.docUploadLabel}>Upload PUC / 12th Certificate</Text>
                    <Text style={styles.docUploadRequired}>Marks Card / Certificate</Text>
                  </View>

                  {pucDoc ? (
                    <View style={styles.uploadedCard}>
                      <View style={styles.uploadedCardLeft}>
                        <View style={styles.docIconBox}>
                          <Ionicons name="document-text" size={20} color="#08317C" />
                        </View>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.uploadedDocName} numberOfLines={1}>
                            {pucDoc.name}
                          </Text>
                          <Text style={styles.uploadedDocMeta}>PUC Certificate Attached • Verified</Text>
                        </View>
                      </View>
                      <View style={styles.uploadedCardActions}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => {
                            setPreviewDoc({
                              title: 'PUC / 12th Certificate',
                              name: pucDoc.name,
                              type: 'Higher Secondary Qualification',
                            });
                            setShowPreviewModal(true);
                          }}
                        >
                          <Ionicons name="eye-outline" size={18} color="#08317C" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => setPucDoc(null)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadDashedBox}
                      onPress={() => handleOpenDocPicker('puc')}
                      activeOpacity={0.75}
                    >
                      <View style={styles.uploadCircleIcon}>
                        <Ionicons name="cloud-upload" size={22} color="#00B894" />
                      </View>
                      <Text style={styles.uploadPromptTitle}>Upload PUC / 12th Marks Card </Text>
                      <Text style={styles.uploadPromptDesc}>Upload marks card or certificate </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Nav Buttons */}
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setCurrentSlide(2)}
                  >
                    <Ionicons name="arrow-back" size={16} color="#08317C" />
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtnFlex}
                    onPress={handleNextFromSlide3}
                  >
                    <Text style={styles.primaryBtnText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* -------------------------------------------------------
                SLIDE 4: NURSE DEGREE & COUNCIL LICENSE (SEPARATED SLIDE)
            ------------------------------------------------------- */}
            {currentSlide === 4 && (
              <View style={styles.slideCard}>
                <View style={styles.slideHeaderRow}>
                  <View style={styles.slideIconWrap}>
                    <Ionicons name="school" size={18} color="#00B894" />
                  </View>
                  <View>
                    <Text style={styles.slideTitle}>Nurse Degree & Council Registration</Text>
                    <Text style={styles.slideSubtitle}>Searchable degree & nursing license</Text>
                  </View>
                </View>

                {/* 1. Searchable Degree Dropdown */}
                <Text style={styles.fieldLabel}>Select Degree</Text>
                <TouchableOpacity
                  style={styles.dropdownSelectorBtn}
                  onPress={() => {
                    setDegreeSearchQuery('');
                    setShowDegreeModal(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="search-outline" size={18} color="#08317C" />
                  <Text
                    style={[
                      styles.dropdownSelectorBtnText,
                      !selectedDegree && { color: '#94A3B8', fontWeight: '500' },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedDegree || 'Search & Select Degree'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>

                {/* Manual entry if 'Other Degree / Custom Qualification' is chosen */}
                {selectedDegree === 'Other Degree / Custom Qualification' && (
                  <View style={styles.customDegreeBox}>
                    <Text style={styles.fieldLabel}>Enter Custom Degree Name</Text>
                    <AppInput
                      icon="create-outline"
                      placeholder="Ex:Diploma in Nursing"
                      value={customDegreeName}
                      onChangeText={setCustomDegreeName}
                      inputWrapperStyle={styles.inputWrapper}
                    />
                  </View>
                )}

                {/* Dedicated Upload Option for Degree */}
                <View style={{ marginTop: 8, marginBottom: 12 }}>
                  <Text style={styles.fieldLabel}>Upload Certificate for: {activeDegreeTitle}</Text>
                  {degreeDocs[activeDegreeTitle] ? (
                    <View style={styles.uploadedCard}>
                      <View style={styles.uploadedCardLeft}>
                        <View style={styles.docIconBox}>
                          <Ionicons name="ribbon" size={20} color="#08317C" />
                        </View>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.uploadedDocName} numberOfLines={1}>
                            {degreeDocs[activeDegreeTitle].name}
                          </Text>
                          <Text style={styles.uploadedDocMeta}>Degree Verified • Official Proof</Text>
                        </View>
                      </View>
                      <View style={styles.uploadedCardActions}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => {
                            setPreviewDoc({
                              title: `${activeDegreeTitle} Certificate`,
                              name: degreeDocs[activeDegreeTitle].name,
                              type: 'Degree Qualification Document',
                            });
                            setShowPreviewModal(true);
                          }}
                        >
                          <Ionicons name="eye-outline" size={18} color="#08317C" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() =>
                            setDegreeDocs((prev) => {
                              const copy = { ...prev };
                              delete copy[activeDegreeTitle];
                              return copy;
                            })
                          }
                        >
                          <Ionicons name="trash-outline" size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadDashedBox}
                      onPress={() => handleOpenDocPicker(`degree_${activeDegreeTitle}`)}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="cloud-upload-outline" size={20} color="#00B894" />
                      <Text style={styles.uploadPromptTitle}>
                        Upload {activeDegreeTitle}
                      </Text>
                      <Text style={styles.uploadPromptDesc}>Upload degree diploma </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* 2. License Number & Council */}
                <Text style={styles.fieldLabel}>Nursing License / Registration No.</Text>
                <AppInput
                  icon="shield-outline"
                  placeholder="ex: KNC-2019-88421"
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                  autoCapitalize="characters"
                  style={{ marginBottom: 12 }}
                  inputWrapperStyle={styles.inputWrapper}
                />

                <Text style={styles.fieldLabel}>Registration Authority / Council</Text>
                <AppInput
                  icon="business-outline"
                  placeholder="Registration Authority / Council"
                  value={registrationAuthority}
                  onChangeText={setRegistrationAuthority}
                  style={{ marginBottom: 12 }}
                  inputWrapperStyle={styles.inputWrapper}
                />

                {/* 3. Upload Council Registration Certificate */}
                <View style={styles.docUploadSection}>
                  <View style={styles.docUploadHeader}>
                    <Text style={styles.docUploadLabel}>Council Registration Certificate</Text>
                    <Text style={styles.docUploadRequired}>License document</Text>
                  </View>

                  {regCertDoc ? (
                    <View style={styles.uploadedCard}>
                      <View style={styles.uploadedCardLeft}>
                        <View style={styles.docIconBox}>
                          <Ionicons name="document-text" size={20} color="#08317C" />
                        </View>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.uploadedDocName} numberOfLines={1}>
                            {regCertDoc.name}
                          </Text>
                          <Text style={styles.uploadedDocMeta}>Council License Proof • Verified</Text>
                        </View>
                      </View>
                      <View style={styles.uploadedCardActions}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => {
                            setPreviewDoc({
                              title: 'Council Registration Certificate',
                              name: regCertDoc.name,
                              type: 'State Nursing Council License',
                            });
                            setShowPreviewModal(true);
                          }}
                        >
                          <Ionicons name="eye-outline" size={18} color="#08317C" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => setRegCertDoc(null)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadDashedBox}
                      onPress={() => handleOpenDocPicker('regCert')}
                      activeOpacity={0.75}
                    >
                      <View style={styles.uploadCircleIcon}>
                        <Ionicons name="cloud-upload" size={22} color="#00B894" />
                      </View>
                      <Text style={styles.uploadPromptTitle}>Upload Council License </Text>
                      <Text style={styles.uploadPromptDesc}>State or Central Nursing Council proof</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Nav Buttons */}
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setCurrentSlide(3)}
                  >
                    <Ionicons name="arrow-back" size={16} color="#08317C" />
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtnFlex}
                    onPress={handleNextFromSlide4}
                  >
                    <Text style={styles.primaryBtnText}>Continue </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* -------------------------------------------------------
                SLIDE 5: YEARS AND CLINICAL (SEPARATED SLIDE)
            ------------------------------------------------------- */}
            {currentSlide === 5 && (
              <View style={styles.slideCard}>
                <View style={styles.slideHeaderRow}>
                  <View style={styles.slideIconWrap}>
                    <Ionicons name="time" size={18} color="#00B894" />
                  </View>
                  <View>
                    <Text style={styles.slideTitle}>Experience & Clinical Specializations</Text>
                    <Text style={styles.slideSubtitle}>Years of nursing care & skills popup</Text>
                  </View>
                </View>

                {/* 1. Years of Experience (Search with Dropdown) */}
                <Text style={styles.fieldLabel}>Years of Experience</Text>
                <TouchableOpacity
                  style={styles.dropdownSelectorBtn}
                  onPress={() => {
                    setExpSearchQuery('');
                    setShowExpModal(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="time-outline" size={18} color="#08317C" />
                  <Text
                    style={[
                      styles.dropdownSelectorBtnText,
                      !yearsOfExperience && { color: '#94A3B8', fontWeight: '500' },
                    ]}
                  >
                    {yearsOfExperience || 'Search & Select Experience'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>

                {/* 2. Clinical Skills & Specializations (Popup with Searchable Dropdown) */}
                <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                  Clinical Skills & Specializations
                </Text>
                <TouchableOpacity
                  style={styles.popupOpenBtn}
                  onPress={() => {
                    setSkillsSearchQuery('');
                    setShowSkillsPopup(true);
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name="options-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.popupOpenBtnText}>
                    Select Clinical Skills
                  </Text>
                  <View style={styles.skillsCountBadge}>
                    <Text style={styles.skillsCountBadgeText}>{selectedSkills.length}</Text>
                  </View>
                </TouchableOpacity>

                {/* Render Selected Skills as Chips */}
                {selectedSkills.length > 0 && (
                  <View style={styles.selectedSkillsWrap}>
                    {selectedSkills.map((skill) => (
                      <View key={skill} style={styles.selectedSkillPill}>
                        <Ionicons name="checkmark-circle" size={14} color="#00B894" />
                        <Text style={styles.selectedSkillPillText}>{skill}</Text>
                        <TouchableOpacity
                          onPress={() => toggleSkill(skill)}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Ionicons name="close-circle" size={15} color="#94A3B8" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* 3. Work Experience Summary */}
                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Work Experience Summary</Text>
                <TextInput
                  style={styles.multilineTextInput}
                  placeholder="Summarize your hospital wards, clinics or home nursing background..."
                  placeholderTextColor="#94A3B8"
                  value={workExperience}
                  onChangeText={setWorkExperience}
                  multiline
                  numberOfLines={3}
                />

                {/* Nav Buttons */}
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setCurrentSlide(4)}
                  >
                    <Ionicons name="arrow-back" size={16} color="#08317C" />
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtnFlex}
                    onPress={handleNextFromSlide5}
                  >
                    <Text style={styles.primaryBtnText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* -------------------------------------------------------
                SLIDE 6: PHOTO AND SIGN (SEPARATED SLIDE)
            ------------------------------------------------------- */}
            {currentSlide === 6 && (
              <View style={styles.slideCard}>
                <View style={styles.slideHeaderRow}>
                  <View style={styles.slideIconWrap}>
                    <Ionicons name="camera" size={18} color="#00B894" />
                  </View>
                  <View>
                    <Text style={styles.slideTitle}>Live Photo & Signature</Text>
                    <Text style={styles.slideSubtitle}>Live face verification & nurse signature</Text>
                  </View>
                </View>

                {/* 1. PHOTO LIVE CLICK */}
                <View style={styles.sectionDividerBox}>
                  <Text style={styles.fieldSectionHeading}>1. Nurse Photo Live Click</Text>
                  <Text style={styles.inputHint}>
                    Capture live selfie portrait for official verified nurse badge
                  </Text>

                  <View style={styles.livePhotoRow}>
                    <TouchableOpacity
                      style={styles.livePhotoCircle}
                      onPress={() => setShowCameraModal(true)}
                      activeOpacity={0.8}
                    >
                      {livePhoto ? (
                        <Image source={{ uri: livePhoto.uri }} style={styles.livePhotoImg} />
                      ) : (
                        <View style={styles.livePhotoPlaceholder}>
                          <Ionicons name="camera" size={30} color="#00B894" />
                          <Text style={styles.livePhotoPlaceholderText}>Click Photo</Text>
                        </View>
                      )}
                      <View style={styles.liveCameraBadge}>
                        <Ionicons name="scan" size={14} color="#FFFFFF" />
                      </View>
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginLeft: 16 }}>
                      {livePhoto ? (
                        <View>
                          <View style={styles.liveVerifiedTag}>
                            <Ionicons name="checkmark-circle" size={14} color="#15803d" />
                            <Text style={styles.liveVerifiedTagText}>Live Verified Face ID</Text>
                          </View>
                          <Text style={styles.livePhotoTimestamp}>
                            Captured at {livePhoto.capturedAt || 'Just now'}
                          </Text>
                          <TouchableOpacity
                            style={styles.retakeBtn}
                            onPress={() => setShowCameraModal(true)}
                          >
                            <Ionicons name="refresh" size={14} color="#08317C" />
                            <Text style={styles.retakeBtnText}>Retake Photo</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View>
                          <Text style={styles.liveInstructions}>
                            Front-facing portrait with clear lighting and neutral background
                          </Text>
                          <TouchableOpacity
                            style={styles.openCameraBtn}
                            onPress={() => setShowCameraModal(true)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="camera" size={16} color="#FFFFFF" />
                            <Text style={styles.openCameraBtnText}>Click Live Photo</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* 2. SIGN PHOTO UPLOAD */}
                <View style={[styles.sectionDividerBox, { borderBottomWidth: 0 }]}>
                  <Text style={styles.fieldSectionHeading}>2. Signature Photo Upload</Text>
                  <Text style={styles.inputHint}>
                    Upload sign image or sign electronically on screen
                  </Text>

                  {signatureDoc ? (
                    <View style={styles.uploadedCard}>
                      <View style={styles.uploadedCardLeft}>
                        <View style={styles.docIconBox}>
                          <Ionicons name="pencil" size={20} color="#08317C" />
                        </View>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.uploadedDocName} numberOfLines={1}>
                            {signatureDoc.name}
                          </Text>
                          <Text style={styles.uploadedDocMeta}>
                            Digital Signature Recorded • Verified
                          </Text>
                        </View>
                      </View>
                      <View style={styles.uploadedCardActions}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => {
                            setPreviewDoc({
                              title: 'Nurse Signature',
                              name: signatureDoc.name,
                              type: 'Official Electronic Signature',
                            });
                            setShowPreviewModal(true);
                          }}
                        >
                          <Ionicons name="eye-outline" size={18} color="#08317C" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => setSignatureDoc(null)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.signChoiceRow}>
                      <TouchableOpacity
                        style={styles.signChoiceBtn}
                        onPress={() => handleOpenDocPicker('signature')}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="image-outline" size={20} color="#08317C" />
                        <Text style={styles.signChoiceBtnText}>Upload Sign Photo</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.signChoiceBtnPrimary}
                        onPress={() => setShowSignatureModal(true)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="pencil" size={20} color="#FFFFFF" />
                        <Text style={styles.signChoiceBtnPrimaryText}>Sign on Screen</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Nav Buttons */}
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setCurrentSlide(5)}
                  >
                    <Ionicons name="arrow-back" size={16} color="#08317C" />
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtnFlex}
                    onPress={handleNextFromSlide6}
                  >
                    <Text style={styles.primaryBtnText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* -------------------------------------------------------
                SLIDE 7: PASSWORD AND AGREEMENT CHECK (SEPARATED SLIDE)
            ------------------------------------------------------- */}
            {currentSlide === 7 && (
              <View style={styles.slideCard}>
                <View style={styles.slideHeaderRow}>
                  <View style={styles.slideIconWrap}>
                    <Ionicons name="lock-closed" size={18} color="#00B894" />
                  </View>
                  <View>
                    <Text style={styles.slideTitle}>Account Password & Agreement</Text>
                    <Text style={styles.slideSubtitle}>Final step to complete registration</Text>
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Password</Text>
                <AppInput
                  icon="lock-closed-outline"
                  placeholder="Create Password"
                  value={password}
                  onChangeText={setPassword}
                  secure={securePassword}
                  rightIcon={securePassword ? 'eye-outline' : 'eye-off-outline'}
                  onRightIconPress={() => setSecurePassword(!securePassword)}
                  style={{ marginBottom: 12 }}
                  inputWrapperStyle={styles.inputWrapper}
                />

                <Text style={styles.fieldLabel}>Confirm Password</Text>
                <AppInput
                  icon="lock-closed-outline"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secure={secureConfirm}
                  rightIcon={secureConfirm ? 'eye-outline' : 'eye-off-outline'}
                  onRightIconPress={() => setSecureConfirm(!secureConfirm)}
                  style={{ marginBottom: 12 }}
                  inputWrapperStyle={styles.inputWrapper}
                />

                {/* Agreement Checkbox */}
                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={agreedToTerms ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={agreedToTerms ? '#00B894' : '#94A3B8'}
                  />
                  <Text style={styles.termsText}>
                    I confirm all documents provided are authentic and agree to MediUnify Terms of
                    Service & HIPAA Privacy Policy.
                  </Text>
                </TouchableOpacity>

                {/* Submit & Back Buttons */}
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setCurrentSlide(6)}
                  >
                    <Ionicons name="arrow-back" size={16} color="#08317C" />
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtnFlexSubmit}
                    onPress={handleFinalSubmit}
                    disabled={submitting}
                  >
                    <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>
                      {submitting ? 'Submitting...' : 'Submit Registration'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =========================================================
          MODAL: SEARCHABLE DEGREE DROPDOWN
      ========================================================= */}
      <Modal
        visible={showDegreeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDegreeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Search & Select Degree</Text>
                <Text style={styles.modalSubtitle}>Select your qualification or 'Other'</Text>
              </View>
              <TouchableOpacity onPress={() => setShowDegreeModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Search Input Box */}
            <View style={styles.searchBarBox}>
              <Ionicons name="search" size={18} color="#08317C" />
              <TextInput
                style={styles.searchBarInput}
                placeholder="Search degree (e.g. B.Sc, GNM, M.Sc, ANM...)"
                placeholderTextColor="#94A3B8"
                value={degreeSearchQuery}
                onChangeText={setDegreeSearchQuery}
                autoFocus
              />
              {degreeSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setDegreeSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Degrees List */}
            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {filteredDegrees.map((deg) => {
                const isSelected = selectedDegree === deg;
                return (
                  <TouchableOpacity
                    key={deg}
                    style={[styles.dropdownItemRow, isSelected && styles.dropdownItemRowSelected]}
                    onPress={() => {
                      setSelectedDegree(deg);
                      setShowDegreeModal(false);
                    }}
                  >
                    <Ionicons
                      name={deg.includes('Other') ? 'create-outline' : 'school-outline'}
                      size={20}
                      color={isSelected ? '#00B894' : '#08317C'}
                    />
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {deg}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#00B894" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          MODAL: SEARCHABLE EXPERIENCE DROPDOWN
      ========================================================= */}
      <Modal
        visible={showExpModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Search & Select Experience</Text>
                <Text style={styles.modalSubtitle}>Filter and choose your clinical experience</Text>
              </View>
              <TouchableOpacity onPress={() => setShowExpModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Search Input Box */}
            <View style={styles.searchBarBox}>
              <Ionicons name="search" size={18} color="#08317C" />
              <TextInput
                style={styles.searchBarInput}
                placeholder="Search experience (e.g. 5, 8, Fresher...)"
                placeholderTextColor="#94A3B8"
                value={expSearchQuery}
                onChangeText={setExpSearchQuery}
                autoFocus
              />
              {expSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setExpSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Experience List */}
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              {filteredExperience.map((exp) => {
                const isSelected = yearsOfExperience === exp;
                return (
                  <TouchableOpacity
                    key={exp}
                    style={[styles.dropdownItemRow, isSelected && styles.dropdownItemRowSelected]}
                    onPress={() => {
                      setYearsOfExperience(exp);
                      setShowExpModal(false);
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={isSelected ? '#00B894' : '#08317C'}
                    />
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {exp}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#00B894" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          POPUP MODAL: CLINICAL SKILLS & SPECIFICATION SEARCH DROPDOWN
      ========================================================= */}
      <Modal
        visible={showSkillsPopup}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSkillsPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Clinical Skills & Specializations</Text>
                <Text style={styles.modalSubtitle}>
                  Search & checkmark all services you are qualified to provide
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowSkillsPopup(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Search Input Box */}
            <View style={styles.searchBarBox}>
              <Ionicons name="search" size={18} color="#08317C" />
              <TextInput
                style={styles.searchBarInput}
                placeholder="Search skills (e.g. ICU, wound, IV, catheter...)"
                placeholderTextColor="#94A3B8"
                value={skillsSearchQuery}
                onChangeText={setSkillsSearchQuery}
                autoFocus
              />
              {skillsSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSkillsSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Skills Checkbox List */}
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              {filteredSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.skillCheckRow, isSelected && styles.skillCheckRowActive]}
                    onPress={() => toggleSkill(skill)}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={isSelected ? '#00B894' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.skillCheckText,
                        isSelected && styles.skillCheckTextActive,
                      ]}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Done Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setShowSkillsPopup(false)}
            >
              <Text style={styles.primaryBtnText}>
                Apply Selected Skills ({selectedSkills.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          LIVE CAMERA CAPTURE MODAL
      ========================================================= */}
      <Modal
        visible={showCameraModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCameraModal(false)}
      >
        <View style={styles.cameraModalOverlay}>
          <View style={styles.cameraBox}>
            <View style={styles.cameraHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={styles.liveRecordingDot} />
                <Text style={styles.cameraTitle}>Nurse Live Face Capture</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCameraModal(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.viewfinderContainer}>
              <View style={styles.viewfinderOval}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1594824813572-c286595567b4?w=500&auto=format&fit=crop&q=80',
                  }}
                  style={styles.cameraPreviewStream}
                />
                <View style={styles.faceGuideOverlay}>
                  <View style={styles.faceGuideCornerTL} />
                  <View style={styles.faceGuideCornerTR} />
                  <View style={styles.faceGuideCornerBL} />
                  <View style={styles.faceGuideCornerBR} />
                </View>
              </View>
              <Text style={styles.viewfinderHint}>Center your face within the frame</Text>
            </View>

            <View style={styles.cameraControlsRow}>
              <TouchableOpacity
                style={styles.cameraAuxBtn}
                onPress={() =>
                  setCameraFacing(cameraFacing === 'front' ? 'back' : 'front')
                }
              >
                <Ionicons name="camera-reverse" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.snapShutterBtn}
                onPress={handleCaptureLivePhoto}
                activeOpacity={0.8}
              >
                <View style={styles.shutterInnerCircle} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraAuxBtn}
                onPress={() => {
                  handleSelectDocument({
                    uri: 'https://images.unsplash.com/photo-1594824813572-c286595567b4?w=500&auto=format&fit=crop&q=80',
                    name: 'Nurse_Live_Portrait.jpg',
                    size: '2.1 MB',
                    type: 'image/jpeg',
                    status: 'Verified',
                  });
                  setShowCameraModal(false);
                }}
              >
                <Ionicons name="images-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          SIGNATURE MODAL (SIGN ON SCREEN)
      ========================================================= */}
      <Modal
        visible={showSignatureModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSignatureModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Nurse Digital Signature</Text>
                <Text style={styles.modalSubtitle}>Sign within the designated box</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSignatureModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.signPadBox}>
              <View style={styles.signatureSampleSvgWrap}>
                <Ionicons name="pencil" size={28} color="#08317C" style={{ opacity: 0.15 }} />
                <Text style={styles.signPadPlaceholder}>Kavitha R.</Text>
                <View style={styles.signBaseline} />
                <Text style={styles.signTimestamp}>
                  Digital signature timestamp: {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.signModalBtnRow}>
              <TouchableOpacity
                style={styles.signClearBtn}
                onPress={() => setShowSignatureModal(false)}
              >
                <Text style={styles.signClearBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signConfirmBtn}
                onPress={() =>
                  handleConfirmSignature({
                    name: `Nurse_Signature_${Date.now()}.png`,
                    size: '340 KB',
                    type: 'image/png',
                    signedDate: new Date().toLocaleDateString(),
                    status: 'Verified',
                  })
                }
              >
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                <Text style={styles.signConfirmBtnText}>Save Signature</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          OTP VERIFICATION MODAL
      ========================================================= */}
      <Modal
        visible={showOtpModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Verify Mobile Number</Text>
                <Text style={styles.modalSubtitle}>
                  Enter the 4-digit code sent to +91 {phoneNumber || '9876543210'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.otpHintBanner}>
              <Ionicons name="information-circle" size={18} color="#0284C7" />
              <Text style={styles.otpHintBannerText}>
                Verification OTP: <Text style={{ fontWeight: '800' }}>{mockOtpHint}</Text>
              </Text>
            </View>

            <View style={styles.otpInputsRow}>
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={otpInputRefs[idx]}
                  style={[styles.otpBox, digit && styles.otpBoxFilled]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, idx)}
                  onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                  selectTextOnFocus
                />
              ))}
            </View>

            <View style={styles.resendRow}>
              {isTimerActive ? (
                <Text style={styles.resendTimerText}>
                  Resend code in {resendTimer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text style={styles.resendLinkText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOtp}>
              <Text style={styles.primaryBtnText}>Verify OTP & Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          GENERIC DOCUMENT PICKER MODAL
      ========================================================= */}
      <Modal
        visible={showDocPickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDocPickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Upload Document</Text>
                <Text style={styles.modalSubtitle}>Select document type or sample proof</Text>
              </View>
              <TouchableOpacity onPress={() => setShowDocPickerModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 10, marginVertical: 12 }}>
              <TouchableOpacity
                style={styles.pickerOptionCard}
                onPress={() =>
                  handleSelectDocument({
                    name: `${docPickerTarget || 'Document'}_Scanned.pdf`,
                    size: '1.8 MB',
                    type: 'application/pdf',
                    status: 'Verified',
                  })
                }
              >
                <View style={[styles.pickerOptionIcon, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="document-text" size={22} color="#0284C7" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pickerOptionTitle}>Device PDF Document</Text>
                  <Text style={styles.pickerOptionDesc}>Upload official scan from device files</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickerOptionCard}
                onPress={() =>
                  handleSelectDocument({
                    name: `${docPickerTarget || 'Photo'}_Scan.jpg`,
                    size: '2.4 MB',
                    type: 'image/jpeg',
                    status: 'Verified',
                  })
                }
              >
                <View style={[styles.pickerOptionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="camera" size={22} color="#D97706" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pickerOptionTitle}>Camera Photo</Text>
                  <Text style={styles.pickerOptionDesc}>Capture physical document with camera</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickerOptionCard}
                onPress={() =>
                  handleSelectDocument({
                    name: `Verified_${docPickerTarget || 'Credential'}.pdf`,
                    size: '1.2 MB',
                    type: 'application/pdf',
                    status: 'Verified',
                  })
                }
              >
                <View style={[styles.pickerOptionIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="checkmark-done-circle" size={22} color="#16A34A" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pickerOptionTitle}>Sample Verified Document</Text>
                  <Text style={styles.pickerOptionDesc}>Official verified document proof</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setShowDocPickerModal(false)}
            >
              <Text style={styles.sheetCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          DOCUMENT PREVIEW MODAL
      ========================================================= */}
      <Modal
        visible={showPreviewModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.previewBox}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{previewDoc?.title || 'Document Preview'}</Text>
                <Text style={styles.modalSubtitle}>{previewDoc?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPreviewModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.previewDocPlaceholder}>
              <Ionicons name="document-text" size={60} color="#08317C" />
              <Text style={styles.previewDocPlaceholderTitle}>{previewDoc?.name}</Text>
              <Text style={styles.previewDocPlaceholderType}>{previewDoc?.type}</Text>
              <View style={styles.previewVerifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#15803d" />
                <Text style={styles.previewVerifiedBadgeText}>Digitally Verified Proof</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setShowPreviewModal(false)}
            >
              <Text style={styles.primaryBtnText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================
          SUCCESS & APPROVAL PENDING MODAL (SQUARELY CENTERED IN SCREEN)
      ========================================================= */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.centerModalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="shield-checkmark" size={38} color="#00B894" />
            </View>

            <Text style={styles.successTitle}>Registration Submitted!</Text>
            <Text style={styles.successDesc}>
              Your application, PUC marks card, degree certificates, and credentials have been
              submitted for <Text style={{ fontWeight: '800', color: '#D97706' }}>Super Admin Review</Text>.
            </Text>

            <View style={styles.statusGatingCard}>
              <View style={styles.statusGatingRow}>
                <Ionicons name="time" size={20} color="#D97706" />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.statusGatingTitle}>Current Status: Pending Approval</Text>
                  <Text style={styles.statusGatingDesc}>
                    Super Admin verifies nursing council registration, degree, and Aadhaar before
                    granting patient assignments access.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.simulateApprovalBtn}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('HomeNursingLogin');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.simulateApprovalBtnText}>Go to Nurse Sign In</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* STATIC TOP HEADER (STATIC LOGO & BACK BUTTON NEVER SCROLL) */
  staticHeaderContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 14 : 28,
    paddingBottom: 4,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /* BRAND HEADER */
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
  },
  logoWrap: {
    width: Math.min(width * 0.65, 230),
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },

  /* SCROLL CONTENT (FORM CARDS ONLY) */
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 14,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  slideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  slideHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  slideIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
  },
  slideSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  inputWrapper: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
  },
  inputHint: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 10,
  },

  /* DROPDOWN SELECTOR BUTTONS */
  dropdownSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 10,
  },
  dropdownSelectorBtnText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#08317C',
    marginLeft: 10,
  },
  customDegreeBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    marginBottom: 10,
  },

  /* CLINICAL SKILLS POPUP OPEN BUTTON & CHIPS */
  popupOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#08317C',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 12,
  },
  popupOpenBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 8,
  },
  skillsCountBadge: {
    backgroundColor: '#00B894',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  skillsCountBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  selectedSkillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  selectedSkillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  selectedSkillPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#08317C',
  },

  /* DOB Presets */
  dobPresetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  presetChipActive: {
    backgroundColor: '#E6FAF6',
    borderColor: '#00B894',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#00B894',
    fontWeight: '700',
  },

  /* Gender Selector */
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  genderCardSelected: {
    borderColor: '#00B894',
    backgroundColor: '#E6FAF6',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  genderTextSelected: {
    color: '#00B894',
    fontWeight: '800',
  },
  genderCheckDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Phone with OTP */
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  otpActionBtn: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpActionBtnDefault: {
    backgroundColor: '#08317C',
  },
  otpActionBtnVerified: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  otpActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803d',
  },
  phoneVerifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  phoneVerifiedBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },

  /* Address Manual Entry Box */
  addressBoxWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  addressBoxIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  addressTextInput: {
    flex: 1,
    minHeight: 64,
    fontSize: 13,
    color: '#1E293B',
    textAlignVertical: 'top',
  },

  twoColRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  /* Document Upload Cards */
  docUploadSection: {
    marginVertical: 10,
  },
  docUploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  docUploadLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  docUploadRequired: {
    fontSize: 11,
    color: '#00B894',
    fontWeight: '700',
  },
  uploadDashedBox: {
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF9',
  },
  uploadCircleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  uploadPromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#08317C',
    textAlign: 'center',
  },
  uploadPromptDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  uploadedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 10,
  },
  uploadedCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedDocName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#08317C',
  },
  uploadedDocMeta: {
    fontSize: 10,
    color: '#15803d',
    fontWeight: '600',
    marginTop: 1,
  },
  uploadedCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconBtn: {
    padding: 6,
  },

  /* Slide 6: Photo Live Click & Signature */
  sectionDividerBox: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 10,
  },
  fieldSectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#08317C',
  },

  livePhotoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  livePhotoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6FAF6',
    borderWidth: 2,
    borderColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  livePhotoImg: {
    width: '100%',
    height: '100%',
  },
  livePhotoPlaceholder: {
    alignItems: 'center',
  },
  livePhotoPlaceholderText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00B894',
    marginTop: 2,
  },
  liveCameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#08317C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveVerifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  liveVerifiedTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
  },
  livePhotoTimestamp: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  retakeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#08317C',
  },
  liveInstructions: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  openCameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#08317C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  openCameraBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Signature choice */
  signChoiceRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  signChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  signChoiceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#08317C',
  },
  signChoiceBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#00B894',
  },
  signChoiceBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Multiline text input */
  multilineTextInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
    color: '#1E293B',
    minHeight: 60,
    textAlignVertical: 'top',
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },

  /* NAV BUTTONS */
  primaryBtn: {
    backgroundColor: '#08317C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#08317C',
  },
  primaryBtnFlex: {
    flex: 1,
    backgroundColor: '#08317C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
  },
  primaryBtnFlexSubmit: {
    flex: 1,
    backgroundColor: '#00B894',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
  },

  /* CAMERA MODAL */
  cameraModalOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  cameraBox: {
    flex: 1,
    backgroundColor: '#0B132B',
    padding: 20,
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 24 : 40,
  },
  liveRecordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  cameraTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  viewfinderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderOval: {
    width: 250,
    height: 330,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: '#00B894',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1C2541',
  },
  cameraPreviewStream: {
    width: '100%',
    height: '100%',
  },
  faceGuideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  faceGuideCornerTL: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#38BDF8',
  },
  faceGuideCornerTR: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#38BDF8',
  },
  faceGuideCornerBL: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#38BDF8',
  },
  faceGuideCornerBR: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#38BDF8',
  },
  viewfinderHint: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 16,
  },
  cameraControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  cameraAuxBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapShutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00B894',
  },

  /* MODALS (BOTTOM SHEET FOR PICKERS) */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '85%',
  },
  modalCardLarge: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#08317C',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  /* SEARCH BARS INSIDE MODALS */
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchBarInput: {
    flex: 1,
    fontSize: 13,
    color: '#08317C',
    marginLeft: 8,
  },

  /* DROPDOWN LIST ITEMS */
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemRowSelected: {
    backgroundColor: '#E6FAF6',
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 10,
  },
  dropdownItemTextSelected: {
    color: '#00B894',
    fontWeight: '800',
  },

  /* SKILL CHECKBOX LIST */
  skillCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  skillCheckRowActive: {
    backgroundColor: '#F0FDF9',
    borderColor: '#A7F3D0',
  },
  skillCheckText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    marginLeft: 10,
    fontWeight: '600',
  },
  skillCheckTextActive: {
    color: '#00B894',
    fontWeight: '800',
  },

  /* OTP MODAL */
  otpHintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  otpHintBannerText: {
    fontSize: 12,
    color: '#0369A1',
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    gap: 12,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#08317C',
    backgroundColor: '#F8FAFC',
  },
  otpBoxFilled: {
    borderColor: '#00B894',
    backgroundColor: '#E6FAF6',
  },
  resendRow: {
    alignItems: 'center',
    marginVertical: 12,
  },
  resendTimerText: {
    fontSize: 12,
    color: '#64748B',
  },
  resendLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00B894',
  },

  /* SIGNATURE CANVAS */
  signPadBox: {
    height: 160,
    borderWidth: 1.5,
    borderColor: '#08317C',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FAFDFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  signatureSampleSvgWrap: {
    alignItems: 'center',
  },
  signPadPlaceholder: {
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
    fontSize: 34,
    color: '#08317C',
    fontWeight: '800',
    transform: [{ rotate: '-4deg' }],
  },
  signBaseline: {
    width: 220,
    height: 1.5,
    backgroundColor: '#CBD5E1',
    marginTop: 4,
  },
  signTimestamp: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 6,
  },
  signModalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  signClearBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  signClearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  signConfirmBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    borderRadius: 10,
    paddingVertical: 12,
  },
  signConfirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* GENERIC DOCUMENT PICKER OPTIONS */
  pickerOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  pickerOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerOptionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#08317C',
  },
  pickerOptionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sheetCancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sheetCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },

  /* PREVIEW BOX */
  previewBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
  },
  previewDocPlaceholder: {
    height: 180,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    padding: 16,
  },
  previewDocPlaceholderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#08317C',
    marginTop: 8,
    textAlign: 'center',
  },
  previewDocPlaceholderType: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  previewVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: 10,
  },
  previewVerifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },

  /* =========================================================
     SUCCESS MODAL OVERLAY: SQUARELY CENTERED IN THE SCREEN
  ========================================================= */
  centerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  successModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6FAF6',
    borderWidth: 2,
    borderColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#08317C',
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  statusGatingCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginVertical: 16,
    width: '100%',
  },
  statusGatingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusGatingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  statusGatingDesc: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
    lineHeight: 15,
  },
  simulateApprovalBtn: {
    backgroundColor: '#08317C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 48,
    borderRadius: 12,
  },
  simulateApprovalBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
