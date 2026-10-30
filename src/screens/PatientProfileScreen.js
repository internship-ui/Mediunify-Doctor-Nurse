import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/ScreenHeader';
import Logo from '../components/Logo';
import Card from '../components/Card';
import FollowUpWizardModal from '../components/FollowUpWizardModal';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../theme/colors';

import { patients } from '../data/mockData';


function Chip({ label, tone = 'neutral' }) {
  const toneStyle =
    tone === 'danger'
      ? {
        bg: colors.dangerSurface,
        fg: colors.danger,
      }
      : {
        bg: '#EEF4FC',
        fg: '#071E42',
      };

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: toneStyle.bg,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: toneStyle.fg,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}


export default function PatientProfileScreen({ route, navigation }) {
  const handleEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Initiate an emergency call for an urgent patient case?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', style: 'destructive', onPress: () => { } },
      ]
    );
  };
  const { patientId } = route.params || {};

  const patient =
    patients.find((p) => p.id === patientId) || patients[0];

  const [showHistory, setShowHistory] = useState(false);

  const [documentRequest, setDocumentRequest] = useState('');
  const [followUpWizardVisible, setFollowUpWizardVisible] = useState(false);
  const [followUpStatus, setFollowUpStatus] = useState(null);
  const [followUpDecision, setFollowUpDecision] = useState(null); // 'yes' | 'no' | null
  const [needPayment, setNeedPayment] = useState('yes'); // 'yes' | 'no'

  // Scroll, layout position, and keyboard state for preventing overlap
  const scrollViewRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [docSectionY, setDocSectionY] = useState(0);
  const [cardY, setCardY] = useState(0);

  const scrollToManualRequest = () => {
    // Scroll directly to the manual request card so it sits comfortably in view below the header
    const targetY = docSectionY > 0 && cardY > 0 ? docSectionY + cardY - 30 : (docSectionY > 0 ? docSectionY + 200 : 850);
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


  // --------------------------------------------------
  // CHECKED DOCUMENTS STATE & REQUEST HANDLERS
  // --------------------------------------------------

  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDocCheck = (docName) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docName]: !prev[docName],
    }));
  };

  const isAllSelected =
    patient.documents.length > 0 &&
    patient.documents.every((d) => checkedDocs[d.name]);

  const toggleSelectAllDocs = () => {
    if (isAllSelected) {
      setCheckedDocs({});
    } else {
      const all = {};
      patient.documents.forEach((d) => {
        all[d.name] = true;
      });
      setCheckedDocs(all);
    }
  };

  const checkedCount = patient.documents.filter(
    (d) => checkedDocs[d.name]
  ).length;

  const requestCheckedDocuments = () => {
    const selected = patient.documents.filter((d) => checkedDocs[d.name]);
    if (selected.length === 0) {
      Alert.alert(
        'Select Documents',
        'Please check at least one document from the list above to send a request to the patient.'
      );
      return;
    }

    const docList = selected.map((d) => d.name).join('\n• ');
    Alert.alert(
      'Request Checked Documents',
      `Ask ${patient.name} to upload or re-submit the checked document(s)?\n\n• ${docList}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Request',
          onPress: () => {
            Alert.alert(
              'Request Sent Successfully',
              `Request for ${selected.length} document(s) sent to ${patient.name}. They will be notified in their app.`
            );
          },
        },
      ]
    );
  };


  // --------------------------------------------------
  // MANUAL DOCUMENT REQUEST
  // --------------------------------------------------

  const sendManualRequest = () => {
    const requestName = documentRequest.trim();

    if (!requestName) {
      Alert.alert(
        'Required',
        'Please enter the report or document name.'
      );
      return;
    }

    Alert.alert(
      'Request Sent',
      `"${requestName}" has been requested from ${patient.name}.`,
      [
        {
          text: 'OK',
          onPress: () => setDocumentRequest(''),
        },
      ]
    );
  };


  // --------------------------------------------------
  // MEDICAL RECORD ACTIONS
  // --------------------------------------------------

  const openConsultationNotes = () => {
    Alert.alert(
      'Consultation Notes',
      `${patient.name} has ${patient.records.notes} consultation note(s).`,
      [
        {
          text: 'OK',
        },
      ]
    );
  };


  const openLabReports = () => {
    Alert.alert(
      'Lab Reports',
      `${patient.name} has ${patient.records.labReports} lab report(s).`,
      [
        {
          text: 'OK',
        },
      ]
    );
  };


  const openPrescriptions = () => {
    Alert.alert(
      'Prescriptions',
      `${patient.name} has ${patient.records.prescriptions} prescription(s).`,
      [
        {
          text: 'OK',
        },
      ]
    );
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >

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

        {/* NAVIGATION ROW: (←) Patient Details */}
        <View style={styles.navHeaderRow}>
          <TouchableOpacity
            style={styles.headerNavCircleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.screenMainTitle}>Patient Details</Text>

          <View style={{ width: 40 }} />
        </View>
      </View>


      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: isKeyboardOpen ? (keyboardHeight > 0 ? keyboardHeight + 80 : 340) : 100,
          }}
        >

          {/* =====================================================
            PATIENT HEADER
        ====================================================== */}

          <Card style={styles.headerCard}>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {patient.name.charAt(0)}
              </Text>
            </View>

            <Text style={styles.name}>
              {patient.name}
            </Text>

            <Text style={styles.subMeta}>
              {patient.age} years · {patient.gender} · Blood Group{' '}
              {patient.bloodGroup}
            </Text>


            {/* ACCESS STATUS */}

            <View
              style={[
                styles.accessBadge,
                {
                  backgroundColor: patient.accessAuthorized
                    ? colors.successSurface
                    : colors.warningSurface,
                },
              ]}
            >

              <Ionicons
                name={
                  patient.accessAuthorized
                    ? 'shield-checkmark'
                    : 'shield-outline'
                }
                size={13}
                color={
                  patient.accessAuthorized
                    ? colors.success
                    : colors.warning
                }
              />

              <Text
                style={[
                  styles.accessBadgeText,
                  {
                    color: patient.accessAuthorized
                      ? colors.success
                      : colors.warning,
                  },
                ]}
              >
                {patient.accessAuthorized
                  ? 'Health record access authorized'
                  : 'Access pending patient consent'}
              </Text>

            </View>


            {/* QUICK ACTIONS */}

            <View style={styles.quickRow}>

              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() =>
                  navigation.navigate('Consultation', {
                    patientId: patient.id,
                  })
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name="medkit-outline"
                  size={18}
                  color={colors.primary}
                />

                <Text style={styles.quickBtnText}>
                  Consult
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() =>
                  navigation.navigate('Prescription', {
                    patientId: patient.id,
                  })
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={colors.primary}
                />

                <Text style={styles.quickBtnText}>
                  Prescribe
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() =>
                  navigation.navigate('TestRequirement', {
                    patientId: patient.id,
                  })
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name="flask-outline"
                  size={18}
                  color={colors.primary}
                />

                <Text style={styles.quickBtnText}>
                  Tests
                </Text>
              </TouchableOpacity>

            </View>

          </Card>


          {/* =====================================================
            FOLLOW-UP REQUESTED CARD BOX
          ====================================================== */}
          <Card style={styles.followUpCard}>
            <View style={styles.followUpCardHeader}>
              <View style={styles.followUpIconWrap}>
                <Ionicons name="repeat" size={20} color="#071E42" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.followUpTitle}>Follow-up Requested</Text>
                <Text style={styles.followUpSub}>
                  {followUpStatus
                    ? `Follow-up planned on ${followUpStatus.date} (${followUpStatus.mode}) · Payment: ${followUpStatus.needPayment === 'yes' ? 'Required' : 'Complimentary'}`
                    : `Schedule follow-up consultation and treatment plan for ${patient.name}?`}
                </Text>
              </View>
            </View>

            <View style={styles.followUpButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.followUpYesBtn,
                  followUpDecision === 'yes' && styles.followUpOptionBtnSelected,
                ]}
                onPress={() => setFollowUpDecision('yes')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={followUpDecision === 'yes' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={17}
                  color={followUpDecision === 'yes' ? '#FFFFFF' : '#071E42'}
                />
                <Text
                  style={[
                    styles.followUpYesText,
                    followUpDecision === 'yes' && styles.followUpOptionTextSelected,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.followUpNoBtn,
                  followUpDecision === 'no' && styles.followUpNoBtnSelected,
                ]}
                onPress={() => {
                  setFollowUpDecision('no');
                  Alert.alert(
                    'Follow-up',
                    `Follow-up consultation is not required for ${patient.name} at this time.`
                  );
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={followUpDecision === 'no' ? 'close-circle' : 'close-circle-outline'}
                  size={17}
                  color={followUpDecision === 'no' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.followUpNoText,
                    followUpDecision === 'no' && { color: '#FFFFFF' },
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            {/* QUESTIONNAIRE: "for Next follow-up need payment" (Appears when Yes is clicked) */}
            {followUpDecision === 'yes' && (
              <View style={styles.paymentQuestionnaireSection}>
                <View style={styles.paymentDivider} />

                <View style={styles.paymentHeaderRow}>
                  <View style={styles.paymentIconWrap}>
                    <Ionicons name="card-outline" size={16} color="#071E42" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentQuestionTitle}>
                      For Next follow-up need payment?
                    </Text>
                    <Text style={styles.paymentQuestionSub}>
                      Select payment requirement for the upcoming visit
                    </Text>
                  </View>
                </View>

                {/* YES / NO TOGGLES */}
                <View style={styles.paymentToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.paymentChoiceBtn,
                      needPayment === 'yes' && styles.paymentChoiceBtnActive,
                    ]}
                    onPress={() => setNeedPayment('yes')}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={needPayment === 'yes' ? 'checkmark-circle' : 'ellipse-outline'}
                      size={15}
                      color={needPayment === 'yes' ? '#FFFFFF' : '#071E42'}
                    />
                    <Text
                      style={[
                        styles.paymentChoiceBtnText,
                        needPayment === 'yes' && styles.paymentChoiceBtnTextActive,
                      ]}
                    >
                      Yes (Need Payment)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentChoiceBtn,
                      needPayment === 'no' && styles.paymentChoiceBtnActive,
                    ]}
                    onPress={() => setNeedPayment('no')}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={needPayment === 'no' ? 'checkmark-circle' : 'ellipse-outline'}
                      size={15}
                      color={needPayment === 'no' ? '#FFFFFF' : '#071E42'}
                    />
                    <Text
                      style={[
                        styles.paymentChoiceBtnText,
                        needPayment === 'no' && styles.paymentChoiceBtnTextActive,
                      ]}
                    >
                      No (Free Follow-up)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* SAVE BUTTON BELOW QUESTIONNAIRE */}
                <TouchableOpacity
                  style={styles.paymentSaveBtn}
                  onPress={() => setFollowUpWizardVisible(true)}
                  activeOpacity={0.88}
                >
                  <Ionicons name="checkmark-done" size={17} color="#FFFFFF" />
                  <Text style={styles.paymentSaveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>


          {/* =====================================================
            MEDICAL INFORMATION
        ====================================================== */}

          <Text style={styles.sectionTitle}>
            Medical Information
          </Text>

          <Card>

            <Text style={styles.groupLabel}>
              Allergies
            </Text>

            <View style={styles.chipRow}>
              {patient.allergies.map((a) => (
                <Chip
                  key={a}
                  label={a}
                  tone={
                    a === 'None known'
                      ? 'neutral'
                      : 'danger'
                  }
                />
              ))}
            </View>


            <Text
              style={[
                styles.groupLabel,
                {
                  marginTop: 14,
                },
              ]}
            >
              Chronic Conditions
            </Text>

            <View style={styles.chipRow}>
              {patient.conditions.length ? (
                patient.conditions.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>
                  None recorded
                </Text>
              )}
            </View>


            <Text
              style={[
                styles.groupLabel,
                {
                  marginTop: 14,
                },
              ]}
            >
              Current Medications
            </Text>

            <View style={styles.chipRow}>
              {patient.medications.length ? (
                patient.medications.map((m) => (
                  <Chip
                    key={m}
                    label={m}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>
                  None recorded
                </Text>
              )}
            </View>

          </Card>


          {/* =====================================================
            VITALS
        ====================================================== */}

          <Text style={styles.sectionTitle}>
            Vitals (Last recorded)
          </Text>

          <Card>

            <View style={styles.vitalsGrid}>

              <VitalItem
                icon="heart-outline"
                label="Heart Rate"
                value={`${patient.vitals.bpm} bpm`}
              />

              <VitalItem
                icon="fitness-outline"
                label="Blood Pressure"
                value={patient.vitals.bp}
              />

              <VitalItem
                icon="water-outline"
                label="Blood Sugar"
                value={patient.vitals.sugar}
              />

            </View>

          </Card>


          {/* =====================================================
            MEDICAL RECORDS
        ====================================================== */}

          <Text style={styles.sectionTitle}>
            Medical Records
          </Text>

          <Card>

            <RecordRow
              icon="document-text-outline"
              label="Consultation notes"
              count={patient.records.notes}
              onPress={openConsultationNotes}
            />

            <RecordRow
              icon="flask-outline"
              label="Lab reports"
              count={patient.records.labReports}
              onPress={openLabReports}
            />

            <RecordRow
              icon="medical-outline"
              label="Prescriptions"
              count={patient.records.prescriptions}
              onPress={openPrescriptions}
              isLast
            />

          </Card>


          {/* =====================================================
            CONSULTATION HISTORY
        ====================================================== */}

          <View style={styles.historySection}>

            <View style={styles.sectionTitleRow}>

              <Text style={styles.sectionTitle}>
                Consultation History
              </Text>


              {/* HIGHLIGHTED SHOW / HIDE BUTTON */}

              <TouchableOpacity
                style={styles.highlightAction}
                onPress={() =>
                  setShowHistory((v) => !v)
                }
                activeOpacity={0.7}
              >

                <Ionicons
                  name={
                    showHistory
                      ? 'chevron-up'
                      : 'eye-outline'
                  }
                  size={15}
                  color={colors.primary}
                />

                <Text style={styles.highlightActionText}>
                  {showHistory ? 'Hide' : 'Show'}
                </Text>

              </TouchableOpacity>

            </View>


            {showHistory ? (
              <Card>

                {patient.consultationHistory.length ? (

                  patient.consultationHistory.map(
                    (h, i) => (

                      <View
                        key={i}
                        style={[
                          styles.historyRow,
                          i !==
                          patient.consultationHistory.length -
                          1 &&
                          styles.historyRowBorder,
                        ]}
                      >

                        <View style={styles.historyIconWrap}>

                          <Ionicons
                            name={
                              h.type === 'Video'
                                ? 'videocam-outline'
                                : 'business-outline'
                            }
                            size={14}
                            color={colors.primary}
                          />

                        </View>


                        <View
                          style={{
                            flex: 1,
                            marginLeft: 10,
                          }}
                        >

                          <Text style={styles.historyDate}>
                            {h.date} · {h.type}
                          </Text>

                          <Text
                            style={
                              styles.historyDiagnosis
                            }
                          >
                            {h.diagnosis}
                          </Text>

                        </View>

                      </View>

                    )
                  )

                ) : (

                  <Text style={styles.emptyText}>
                    No past consultations recorded
                  </Text>

                )}

              </Card>
            ) : null}

          </View>


          {/* =====================================================
            DOCUMENTS
        ====================================================== */}

          <View
            style={styles.documentsSection}
            onLayout={(e) => setDocSectionY(e.nativeEvent.layout.y)}
          >

            <Text style={styles.sectionTitle}>
              Documents
            </Text>


            {/* UPLOADED DOCUMENTS */}

            <Card>

              <View style={styles.uploadedHeaderRow}>
                <Text style={styles.uploadedTitle}>
                  Uploaded Documents
                </Text>
                {patient.documents.length > 0 && (
                  <TouchableOpacity
                    onPress={toggleSelectAllDocs}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.selectAllText}>
                      {isAllSelected ? 'Deselect All' : 'Select All'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>


              {patient.documents.length ? (

                patient.documents.map(
                  (doc, i) => {
                    const isChecked = !!checkedDocs[doc.name];
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.docRow,
                          i !== patient.documents.length - 1 && styles.historyRowBorder,
                          isChecked && styles.docRowChecked,
                        ]}
                        onPress={() => toggleDocCheck(doc.name)}
                        activeOpacity={0.7}
                      >
                        {/* FRONT CHECK-BOX */}
                        <TouchableOpacity
                          style={styles.docCheckboxWrap}
                          onPress={() => toggleDocCheck(doc.name)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons
                            name={isChecked ? 'checkbox' : 'square-outline'}
                            size={22}
                            color={isChecked ? colors.primary : colors.textMuted}
                          />
                        </TouchableOpacity>

                        <Ionicons
                          name="document-attach-outline"
                          size={18}
                          color={isChecked ? colors.primary : colors.textSecondary}
                          style={{ marginLeft: 6 }}
                        />

                        <View
                          style={{
                            flex: 1,
                            marginLeft: 10,
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.docName, isChecked && styles.docNameChecked]}>
                              {doc.name}
                            </Text>
                            {isChecked && (
                              <View style={styles.requiredBadge}>
                                <Text style={styles.requiredBadgeText}>Required</Text>
                              </View>
                            )}
                          </View>

                          <Text style={styles.docDate}>
                            {doc.date}
                          </Text>
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={colors.textMuted}
                        />
                      </TouchableOpacity>
                    );
                  }
                )

              ) : (

                <Text style={styles.emptyText}>
                  No documents uploaded yet
                </Text>

              )}


              {/* REQUEST BUTTON UNDER DOCUMENTS */}

              <TouchableOpacity
                style={[
                  styles.requestButton,
                  checkedCount > 0 && styles.requestButtonActive,
                ]}
                onPress={requestCheckedDocuments}
                activeOpacity={0.7}
              >

                <Ionicons
                  name="cloud-upload-outline"
                  size={17}
                  color={checkedCount > 0 ? colors.white : colors.primary}
                />

                <Text
                  style={[
                    styles.requestButtonText,
                    checkedCount > 0 && styles.requestButtonTextActive,
                  ]}
                >
                  {checkedCount > 0
                    ? `Request (${checkedCount}) Checked Document${checkedCount > 1 ? 's' : ''}`
                    : 'Request Checked Documents'}
                </Text>

              </TouchableOpacity>

            </Card>


            {/* MANUAL REQUEST */}

            <Card
              style={styles.manualRequestCard}
              onLayout={(e) => setCardY(e.nativeEvent.layout.y)}
            >

              <Text style={styles.manualRequestTitle}>
                Request a specific report or document
              </Text>

              <Text style={styles.manualRequestHint}>
                Enter the name of the report or document
                you want the patient to upload.
              </Text>


              <TextInput
                value={documentRequest}
                onChangeText={setDocumentRequest}
                placeholder="e.g. Blood Test Report"
                placeholderTextColor={colors.textMuted}
                style={styles.documentInput}
                returnKeyType="send"
                onSubmitEditing={sendManualRequest}
                onFocus={scrollToManualRequest}
                onTouchStart={scrollToManualRequest}
              />


              <TouchableOpacity
                style={styles.sendRequestButton}
                onPress={sendManualRequest}
                activeOpacity={0.7}
              >

                <Ionicons
                  name="send-outline"
                  size={17}
                  color={colors.white}
                />

                <Text style={styles.sendRequestText}>
                  Send Request
                </Text>

              </TouchableOpacity>

            </Card>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ======================================================
          FOLLOW-UP STEP-BY-STEP WIZARD MODAL (1 -> 2 -> 3 -> 4)
      ====================================================== */}
      <FollowUpWizardModal
        visible={followUpWizardVisible}
        onClose={() => setFollowUpWizardVisible(false)}
        patient={patient}
        onComplete={(plan) => {
          setFollowUpStatus({
            date: plan.followUpDate,
            mode: plan.followUpMode,
            needPayment: needPayment,
          });
        }}
      />

    </View>
  );
}


/* ============================================================
   VITAL ITEM
============================================================ */

function VitalItem({
  icon,
  label,
  value,
}) {
  return (
    <View style={styles.vitalItem}>

      <Ionicons
        name={icon}
        size={20}
        color="#071E42"
      />

      <Text style={styles.vitalValue}>
        {value}
      </Text>

      <Text style={styles.vitalLabel}>
        {label}
      </Text>

    </View>
  );
}


/* ============================================================
   MEDICAL RECORD ROW
============================================================ */

function RecordRow({
  icon,
  label,
  count,
  onPress,
  isLast = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.recordRow,
        !isLast && styles.recordRowBorder,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >

      <Ionicons
        name={icon}
        size={18}
        color={colors.textSecondary}
      />


      <Text style={styles.recordLabel}>
        {label}
      </Text>


      <Text style={styles.recordCount}>
        {count}
      </Text>


      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.textMuted}
      />

    </TouchableOpacity>
  );
}


/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  /* Dark Navy Header */
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
    borderColor: '#e6e9edff',
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

  /* ---------------------------------------------------------
     HEADER CARD
  --------------------------------------------------------- */

  headerCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#071E42',
    marginBottom: spacing.xs,
  },

  avatarText: {
    ...typography.h2,
    color: '#071E42',
    fontWeight: '800',
  },

  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  subMeta: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },


  /* ---------------------------------------------------------
     ACCESS BADGE
  --------------------------------------------------------- */

  accessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },

  accessBadgeText: {
    ...typography.tiny,
  },


  /* ---------------------------------------------------------
     QUICK BUTTONS
  --------------------------------------------------------- */

  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.lg,
    width: '100%',
  },

  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: '#EEF4FC',
    borderWidth: 1.2,
    borderColor: '#071E42',
  },

  quickBtnText: {
    ...typography.smallBold,
    color: '#071E42',
  },


  /* ---------------------------------------------------------
     SECTION
  --------------------------------------------------------- */

  sectionTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },


  /* ---------------------------------------------------------
     HIGHLIGHT SHOW/HIDE BUTTON
  --------------------------------------------------------- */

  highlightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  highlightActionText: {
    ...typography.smallBold,
    color: '#071E42',
  },


  /* ---------------------------------------------------------
     MEDICAL INFORMATION
  --------------------------------------------------------- */

  groupLabel: {
    ...typography.smallBold,
    color: colors.textSecondary,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },

  chip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
  },

  chipText: {
    ...typography.tiny,
  },

  emptyText: {
    ...typography.small,
    color: colors.textMuted,
  },


  /* ---------------------------------------------------------
     VITALS
  --------------------------------------------------------- */

  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  vitalItem: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },

  vitalValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: 6,
  },

  vitalLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },


  /* ---------------------------------------------------------
     MEDICAL RECORDS
  --------------------------------------------------------- */

  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },

  recordRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  recordLabel: {
    flex: 1,
    ...typography.small,
    color: colors.textPrimary,
  },

  recordCount: {
    ...typography.smallBold,
    color: colors.textMuted,
    marginRight: 6,
  },


  /* ---------------------------------------------------------
     CONSULTATION HISTORY
  --------------------------------------------------------- */

  historySection: {
    marginTop: spacing.md,
  },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },

  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  historyIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  historyDate: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },

  historyDiagnosis: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },


  /* ---------------------------------------------------------
     DOCUMENTS
  --------------------------------------------------------- */

  documentsSection: {
    marginTop: spacing.md,
  },

  uploadedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  selectAllText: {
    ...typography.tinyBold,
    color: '#071E42',
  },

  uploadedTitle: {
    ...typography.smallBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 4,
  },

  docRowChecked: {
    backgroundColor: '#EEF4FC',
    borderRadius: radius.sm,
  },

  docCheckboxWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  docNameChecked: {
    color: '#071E42',
    fontWeight: '700',
  },

  requiredBadge: {
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#071E42',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },

  requiredBadgeText: {
    ...typography.tiny,
    color: '#071E42',
    fontWeight: '700',
    fontSize: 10,
  },

  docName: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },

  docDate: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },


  /* ---------------------------------------------------------
     REQUEST BUTTON
  --------------------------------------------------------- */

  requestButton: {
    marginTop: spacing.md,
    minHeight: 42,
    borderRadius: radius.md,
    backgroundColor: '#EEF4FC',
    borderWidth: 1.5,
    borderColor: '#071E42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  requestButtonActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },

  requestButtonText: {
    ...typography.smallBold,
    color: '#071E42',
  },

  requestButtonTextActive: {
    color: colors.white,
  },


  /* ---------------------------------------------------------
     MANUAL REQUEST
  --------------------------------------------------------- */

  manualRequestCard: {
    marginTop: spacing.md,
  },

  manualRequestTitle: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },

  manualRequestHint: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 17,
  },

  documentInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    marginTop: spacing.md,
    color: colors.textPrimary,
    ...typography.small,
  },

  sendRequestButton: {
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: '#071E42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: spacing.sm,
  },

  sendRequestText: {
    ...typography.smallBold,
    color: colors.white,
  },

  /* Follow-up Requested Card Box */
  followUpCard: {
    backgroundColor: '#EEF4FC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#071E42',
    padding: 14,
    marginBottom: 16,
  },
  followUpCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  followUpIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  followUpTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#071E42',
  },
  followUpSub: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  followUpButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  followUpYesBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#071E42',
    borderRadius: 10,
    paddingVertical: 10,
  },
  followUpYesText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  followUpNoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  followUpNoText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  followUpOptionBtnSelected: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  followUpOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  followUpNoBtnSelected: {
    backgroundColor: '#64748B',
    borderColor: '#64748B',
  },

  /* Payment Questionnaire */
  paymentQuestionnaireSection: {
    marginTop: 12,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginBottom: 12,
  },
  paymentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  paymentIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  paymentQuestionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#071E42',
  },
  paymentQuestionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  paymentToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  paymentChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  paymentChoiceBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  paymentChoiceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },
  paymentChoiceBtnTextActive: {
    color: '#FFFFFF',
  },
  paymentSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#071E42',
    borderRadius: 10,
    paddingVertical: 12,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentSaveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});