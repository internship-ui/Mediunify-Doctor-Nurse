// import { SafeAreaView } from 'react-native-safe-area-context';
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   //   ScrollView,
//   TextInput,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Logo from '../components/Logo';
// import { colors, spacing, typography, radius } from '../theme/colors';
// import { patients } from '../data/mockData';

// export default function VideoConsultationScreen({ route, navigation }) {
//   const { patientId, appointmentId } = route.params || {};
//   const patient = patients.find((p) => p.id === patientId) || patients[0];

//   const [seconds, setSeconds] = useState(0);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [panel, setPanel] = useState('info'); // 'info' | 'perception' | null
//   const [perception, setPerception] = useState('');

//   useEffect(() => {
//     // Show recording notice when video consultation starts
//     Alert.alert(
//       'Video Call Recording',
//       'Your video call is being recorded for consultation and medical record purposes.',
//       [
//         {
//           text: 'OK',
//           style: 'default',
//         },
//       ]
//     );

//     const t = setInterval(() => setSeconds((s) => s + 1), 1000);

//     return () => clearInterval(t);
//   }, []);

//   const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
//   const ss = String(seconds % 60).padStart(2, '0');

//   const endCall = () => {
//     navigation.replace('Consultation', {
//       patientId: patient.id,
//       appointmentId,
//       perception,
//     });
//   };

//   const openLabRequirement = () => {
//     // Pushed (not replaced) so the call screen — and its timer — stays live underneath.
//     navigation.navigate('TestRequirement', {
//       patientId: patient.id,
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Simulated remote video feed */}
//       <View style={styles.remoteVideo}>
//         <View style={styles.remoteAvatar}>
//           <Text style={styles.remoteAvatarText}>
//             {patient.name.charAt(0)}
//           </Text>
//         </View>

//         <Text style={styles.remoteName}>
//           {patient.name}
//         </Text>

//         <Text style={styles.callTimer}>
//           {mm}:{ss}
//         </Text>
//       </View>

//       {/* Doctor's own preview (self view) */}
//       <View style={styles.selfPreview}>
//         {camOn ? (
//           <View style={styles.selfPreviewOn}>
//             <Ionicons
//               name="person"
//               size={26}
//               color={colors.white}
//             />
//           </View>
//         ) : (
//           <View style={styles.selfPreviewOff}>
//             <Ionicons
//               name="videocam-off-outline"
//               size={20}
//               color={colors.textMuted}
//             />
//           </View>
//         )}
//       </View>

//       {/* Top bar */}
//       <View style={styles.topBar}>
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: 8,
//           }}
//         >
//           <TouchableOpacity
//             style={styles.topBtn}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons
//               name="chevron-down"
//               size={22}
//               color={colors.white}
//             />
//           </TouchableOpacity>

//           <Logo size={28} />
//         </View>

//         <View style={styles.liveBadge}>
//           <View style={styles.liveDot} />

//           <Text style={styles.liveText}>
//             Live Consultation
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={styles.topBtn}
//           onPress={() =>
//             setPanel(panel === 'info' ? null : 'info')
//           }
//         >
//           <Ionicons
//             name="information-circle-outline"
//             size={22}
//             color={colors.white}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Patient info panel — gives the doctor context during the call */}
//       {panel === 'info' ? (
//         <ScrollView
//           style={styles.infoPanel}
//           contentContainerStyle={{
//             padding: spacing.lg,
//           }}
//         >
//           <Text style={styles.infoPanelTitle}>
//             Patient Details
//           </Text>

//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>
//               Age / Gender
//             </Text>

//             <Text style={styles.infoValue}>
//               {patient.age} yrs · {patient.gender}
//             </Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>
//               Blood Group
//             </Text>

//             <Text style={styles.infoValue}>
//               {patient.bloodGroup}
//             </Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>
//               Allergies
//             </Text>

//             <Text style={styles.infoValue}>
//               {patient.allergies.join(', ')}
//             </Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>
//               Vitals
//             </Text>

//             <Text style={styles.infoValue}>
//               {patient.vitals.bpm} bpm · {patient.vitals.bp} ·{' '}
//               {patient.vitals.sugar}
//             </Text>
//           </View>

//           {patient.conditions.length ? (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>
//                 Conditions
//               </Text>

//               <Text style={styles.infoValue}>
//                 {patient.conditions.join(', ')}
//               </Text>
//             </View>
//           ) : null}
//         </ScrollView>
//       ) : null}

//       {/* Clinical perception panel — jot down impressions without leaving the call */}
//       {panel === 'perception' ? (
//         <View style={styles.infoPanel}>
//           <View style={{ padding: spacing.lg }}>
//             <Text style={styles.infoPanelTitle}>
//               Clinical Perception
//             </Text>

//             <TextInput
//               style={styles.perceptionInput}
//               placeholder="Note your clinical impression as the call happens..."
//               placeholderTextColor={colors.textMuted}
//               multiline
//               value={perception}
//               onChangeText={setPerception}
//             />

//             <Text style={styles.perceptionHint}>
//               Carries over to consultation notes when you end the call.
//             </Text>
//           </View>
//         </View>
//       ) : null}

//       {/* Quick actions — available throughout the call */}
//       <View style={styles.quickRow}>
//         <TouchableOpacity
//           style={[
//             styles.quickChip,
//             panel === 'perception' &&
//               styles.quickChipActive,
//           ]}
//           onPress={() =>
//             setPanel(
//               panel === 'perception'
//                 ? null
//                 : 'perception'
//             )
//           }
//         >
//           <Ionicons
//             name="create-outline"
//             size={15}
//             color={
//               panel === 'perception'
//                 ? colors.white
//                 : colors.textPrimary
//             }
//           />

//           <Text
//             style={[
//               styles.quickChipText,
//               panel === 'perception' && {
//                 color: colors.white,
//               },
//             ]}
//           >
//             Perception
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.quickChip}
//           onPress={openLabRequirement}
//         >
//           <Ionicons
//             name="flask-outline"
//             size={15}
//             color={colors.textPrimary}
//           />

//           <Text style={styles.quickChipText}>
//             Lab Requirement
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Call controls */}
//       <View style={styles.controlsBar}>
//         <TouchableOpacity
//           style={[
//             styles.controlBtn,
//             !micOn && styles.controlBtnOff,
//           ]}
//           onPress={() => setMicOn((v) => !v)}
//         >
//           <Ionicons
//             name={
//               micOn
//                 ? 'mic-outline'
//                 : 'mic-off-outline'
//             }
//             size={22}
//             color={colors.white}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.controlBtn,
//             !camOn && styles.controlBtnOff,
//           ]}
//           onPress={() => setCamOn((v) => !v)}
//         >
//           <Ionicons
//             name={
//               camOn
//                 ? 'videocam-outline'
//                 : 'videocam-off-outline'
//             }
//             size={22}
//             color={colors.white}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.endBtn}
//           onPress={endCall}
//         >
//           <Ionicons
//             name="call"
//             size={22}
//             color={colors.white}
//             style={{
//               transform: [{ rotate: '135deg' }],
//             }}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.controlBtn}
//           onPress={() => {}}
//         >
//           <Ionicons
//             name="camera-reverse-outline"
//             size={22}
//             color={colors.white}
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={styles.endCallLabel}
//         onPress={endCall}
//       >
//         <Text style={styles.endCallLabelText}>
//           End call & write consultation notes
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0B1F1D',
//   },

//   remoteVideo: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   remoteAvatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     backgroundColor: colors.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },

//   remoteAvatarText: {
//     ...typography.h1,
//     fontSize: 40,
//     color: colors.white,
//   },

//   remoteName: {
//     ...typography.h3,
//     color: colors.white,
//   },

//   callTimer: {
//     ...typography.small,
//     color: 'rgba(255,255,255,0.6)',
//     marginTop: 4,
//   },

//   selfPreview: {
//     position: 'absolute',
//     top: 100,
//     right: 16,
//     width: 84,
//     height: 116,
//     borderRadius: 14,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },

//   selfPreviewOn: {
//     flex: 1,
//     backgroundColor: colors.primaryDark,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   selfPreviewOff: {
//     flex: 1,
//     backgroundColor: '#1B2E2C',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   topBar: {
//     position: 'absolute',
//     top: 50,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: spacing.lg,
//   },

//   topBtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   liveBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.35)',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: radius.pill,
//     gap: 6,
//   },

//   liveDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: '#EF4444',
//   },

//   liveText: {
//     ...typography.tiny,
//     color: colors.white,
//   },

//   infoPanel: {
//     position: 'absolute',
//     bottom: 168,
//     left: 12,
//     right: 12,
//     maxHeight: 240,
//     backgroundColor: colors.white,
//     borderRadius: radius.lg,
//   },

//   infoPanelTitle: {
//     ...typography.h3,
//     fontSize: 15,
//     color: colors.textPrimary,
//     marginBottom: 8,
//   },

//   infoRow: {
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },

//   infoLabel: {
//     ...typography.tiny,
//     color: colors.textMuted,
//   },

//   infoValue: {
//     ...typography.smallBold,
//     color: colors.textPrimary,
//     marginTop: 2,
//   },

//   perceptionInput: {
//     minHeight: 90,
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: radius.md,
//     padding: spacing.md,
//     ...typography.small,
//     color: colors.textPrimary,
//     textAlignVertical: 'top',
//   },

//   perceptionHint: {
//     ...typography.tiny,
//     color: colors.textMuted,
//     marginTop: 8,
//   },

//   quickRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 10,
//     paddingHorizontal: spacing.lg,
//     marginBottom: 10,
//   },

//   quickChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: colors.white,
//     paddingVertical: 9,
//     paddingHorizontal: 16,
//     borderRadius: radius.pill,
//   },

//   quickChipActive: {
//     backgroundColor: colors.primary,
//   },

//   quickChipText: {
//     ...typography.smallBold,
//     color: colors.textPrimary,
//   },

//   controlsBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 18,
//     paddingBottom: 14,
//     paddingTop: 6,
//   },

//   controlBtn: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   controlBtnOff: {
//     backgroundColor: 'rgba(255,255,255,0.35)',
//   },

//   endBtn: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: colors.danger,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   endCallLabel: {
//     alignItems: 'center',
//     paddingBottom: 18,
//   },

//   endCallLabelText: {
//     ...typography.small,
//     color: 'rgba(255,255,255,0.7)',
//   },
// });

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Keyboard,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { colors, spacing, typography, radius } from '../theme/colors';
import { patients, appointments } from '../data/mockData';
import VideoCallBottomSheet from '../components/VideoCallBottomSheet';

export default function VideoConsultationScreen({ route, navigation }) {
  const { patientId, appointmentId, appointment: passedAppt } = route.params || {};
  const patient = patients.find((p) => p.id === patientId) || patients[0];
  const appointment =
    passedAppt ||
    appointments.find((a) => a.id === appointmentId) || {
      id: appointmentId || 'appt-video',
      patient: patient?.name,
      age: patient?.age,
      gender: patient?.gender,
      reason: 'Video Consultation',
      type: 'Video',
    };

  const [seconds, setSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [videoCallSheetVisible, setVideoCallSheetVisible] = useState(false);
  const [sheetInitialStep, setSheetInitialStep] = useState(1);
  const [finalCallDuration, setFinalCallDuration] = useState('00:00');
  const [isCallEnded, setIsCallEnded] = useState(false);

  // Patient Details starts minimized so it does not cover the consultation area.
  const [panel, setPanel] = useState(null); // 'info' | 'perception' | 'chat' | null

  const [perception, setPerception] = useState('');

  // Keyboard height tracker to prevent overlapping in in-call chat
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isKeyboardOpen = keyboardHeight > 0;
  const screenHeight = Dimensions.get('window').height;
  const chatBottom = isKeyboardOpen ? keyboardHeight + 10 : 218;
  const chatMaxHeight = isKeyboardOpen
    ? Math.max(180, Math.min(290, screenHeight - keyboardHeight - 110))
    : 360;
  const perceptionBottom = isKeyboardOpen ? keyboardHeight + 10 : 218;
  const perceptionMaxHeight = isKeyboardOpen
    ? Math.max(200, Math.min(320, screenHeight - keyboardHeight - 110))
    : 340;

  useEffect(() => {
    if (panel === 'chat') {
      const timer = setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [panel, keyboardHeight]);

  // In-call Consultation Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'patient',
      text: 'Hello Doctor, I have joined the video consultation.',
      time: '10:02 AM',
    },
    {
      id: 'msg-2',
      sender: 'system',
      text: 'Live consultation chat active. You can exchange messages and upload medical files.',
      time: '10:02 AM',
    },
  ]);
  const [chatInputText, setChatInputText] = useState('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('Medical Report (PDF)');
  const [customUploadName, setCustomUploadName] = useState('');

  const sendMessage = (textToSend, fileAttachment = null) => {
    const text = (textToSend || chatInputText).trim();
    if (!text && !fileAttachment) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'doctor',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: fileAttachment,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInputText('');
  };

  const handleUploadFile = (presetType) => {
    const fileType = presetType || selectedFileType;
    const fileName =
      customUploadName.trim() ||
      `${fileType.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('en-GB').replace(/\//g, '')}.pdf`;

    const newFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      type: fileType,
      size: '1.6 MB',
      date: 'Just now',
    };

    sendMessage(`Uploaded: ${fileName}`, newFile);
    setCustomUploadName('');
    setUploadModalVisible(false);

    Alert.alert(
      'File Uploaded',
      `"${fileName}" has been successfully uploaded and shared with ${patient.name}.`,
      [{ text: 'OK' }]
    );
  };

  const viewChatFile = (file) => {
    Alert.alert(
      file.type || 'Shared Document',
      `File Name: ${file.name}\nSize: ${file.size || '1.6 MB'}\nUploaded: ${file.date || 'Today'}\n\nDocument is attached to this patient's consultation record.`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  /*
   * Previous reports and test reports.
   * These are frontend/mock records for now.
   */
  const previousReports = [
    {
      id: 'report-1',
      name: 'Complete Blood Count (CBC)',
      date: '28 Aug 2026',
      type: 'PDF Report',
    },
    {
      id: 'report-2',
      name: 'Lipid Profile Report',
      date: '20 Aug 2026',
      type: 'PDF Report',
    },
    {
      id: 'report-3',
      name: 'Diabetes Follow-up Report',
      date: '12 Aug 2026',
      type: 'PDF Report',
    },
  ];

  const testReports = [
    {
      id: 'test-1',
      name: 'Blood Sugar Test',
      date: '02 Sep 2026',
      type: 'Test Report',
    },
    {
      id: 'test-2',
      name: 'HbA1c Test',
      date: '02 Sep 2026',
      type: 'Test Report',
    },
    {
      id: 'test-3',
      name: 'Kidney Function Test',
      date: '25 Aug 2026',
      type: 'Test Report',
    },
  ];

  useEffect(() => {
    // Show recording notice when video consultation starts
    Alert.alert(
      'Video Call Recording',
      'Your video call is being recorded for consultation and medical record purposes.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );

    const t = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const endCall = () => {
    setIsCallEnded(true);
    const duration = `${mm}:${ss}`;
    setFinalCallDuration(duration);
    setSheetInitialStep(1);
    setVideoCallSheetVisible(true);
  };

  const handleCompleteConsultation = (result) => {
    setVideoCallSheetVisible(false);
    if (navigation?.navigate) {
      try {
        navigation.navigate('Home');
      } catch (err) {
        navigation.navigate('MainTabs', { screen: 'Home' });
      }
    }
  };

  const handleCloseSheet = () => {
    Alert.alert(
      'Exit Consultation?',
      'Do you want to discard unsaved notes and return to Appointments?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            setVideoCallSheetVisible(false);
            navigation.navigate('Appointments');
          },
        },
      ]
    );
  };

  const openLabRequirement = () => {
    const duration = `${mm}:${ss}`;
    setFinalCallDuration(duration);
    setSheetInitialStep(3);
    setVideoCallSheetVisible(true);
  };

  const openConsultationNotes = () => {
    const duration = `${mm}:${ss}`;
    setFinalCallDuration(duration);
    setSheetInitialStep(1);
    setVideoCallSheetVisible(true);
  };

  /*
   * Patient Details button.
   * This button is always visible above Perception and Lab Requirement.
   */
  const togglePatientDetails = () => {
    setPanel(panel === 'info' ? null : 'info');
  };

  /*
   * Frontend placeholder for opening a report.
   * Replace this later with your PDF/report viewer.
   */
  const viewReport = (report) => {
    Alert.alert(
      report.type,
      `${report.name}\n\nDate: ${report.date}`,
      [
        {
          text: 'Close',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={panel === 'chat' ? undefined : (Platform.OS === 'ios' ? 'padding' : undefined)}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

        {/* Top bar with Navy Blue background, Logo & Logo with Text */}
        <View style={styles.topNavyHeader}>
          <View style={styles.topHeaderLeft}>
            <TouchableOpacity
              style={styles.topCircleBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-down"
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <Logo size={28} />
              <Text style={styles.brandText}>
                <Text style={styles.brandMedi}>Medi</Text>
                <Text style={styles.brandUnify}>Unify</Text>
              </Text>
            </View>
          </View>

          <View style={styles.topHeaderRight}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>
                Live Consultation
              </Text>
            </View>

            {/* Patient Details top button */}
            <TouchableOpacity
              style={[
                styles.topCircleBtn,
                panel === 'info' && styles.topCircleBtnActive,
              ]}
              onPress={togglePatientDetails}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  panel === 'info'
                    ? 'chevron-down'
                    : 'information-circle-outline'
                }
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Simulated remote video feed */}
        <View style={styles.remoteVideo}>
          <View style={styles.remoteAvatar}>
            <Text style={styles.remoteAvatarText}>
              {patient.name.charAt(0)}
            </Text>
          </View>

          <Text style={styles.remoteName}>
            {patient.name}
          </Text>

          <Text style={styles.callTimer}>
            {mm}:{ss}
          </Text>
        </View>

        {/* Doctor's own preview (self view) */}
        <View style={styles.selfPreview}>
          {camOn ? (
            <View style={styles.selfPreviewOn}>
              <Ionicons
                name="person"
                size={26}
                color={colors.white}
              />
            </View>
          ) : (
            <View style={styles.selfPreviewOff}>
              <Ionicons
                name="videocam-off-outline"
                size={20}
                color={colors.textMuted}
              />
            </View>
          )}
        </View>

        {/*
       * Patient Details section
       *
       * IMPORTANT:
       * It is positioned above the Perception/Lab Requirement row.
       * It has a fixed maximum height so it cannot cover the complete
       * consultation screen.
       */}
        {panel === 'info' ? (
          <View style={styles.infoPanel}>
            {/* Patient Details header */}
            <View style={styles.infoPanelHeader}>
              <View style={styles.infoTitleContainer}>
                <View style={styles.infoTitleIcon}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <View>
                  <Text style={styles.infoPanelTitle}>
                    Patient Details
                  </Text>

                  <Text style={styles.infoPanelSubtitle}>
                    Medical information & reports
                  </Text>
                </View>
              </View>

              {/* Minimize button */}
              <TouchableOpacity
                style={styles.minimizeBtn}
                onPress={() => setPanel(null)}
              >
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.infoScrollContent}
            >
              {/* Basic patient information */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Age / Gender
                </Text>

                <Text style={styles.infoValue}>
                  {patient.age} yrs · {patient.gender}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Blood Group
                </Text>

                <Text style={styles.infoValue}>
                  {patient.bloodGroup}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Allergies
                </Text>

                <Text style={styles.infoValue}>
                  {patient.allergies.join(', ')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Vitals
                </Text>

                <Text style={styles.infoValue}>
                  {patient.vitals.bpm} bpm · {patient.vitals.bp} ·{' '}
                  {patient.vitals.sugar}
                </Text>
              </View>

              {patient.conditions.length ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Conditions
                  </Text>

                  <Text style={styles.infoValue}>
                    {patient.conditions.join(', ')}
                  </Text>
                </View>
              ) : null}

              {/* Previous PDF reports */}
              <View style={styles.reportSection}>
                <View style={styles.reportSectionHeader}>
                  <View style={styles.reportSectionTitleRow}>
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color={colors.primary}
                    />

                    <Text style={styles.reportSectionTitle}>
                      Previous Reports
                    </Text>
                  </View>

                  <Text style={styles.reportCount}>
                    {previousReports.length}
                  </Text>
                </View>

                {previousReports.map((report) => (
                  <View
                    key={report.id}
                    style={styles.reportCard}
                  >
                    <View style={styles.reportIcon}>
                      <Ionicons
                        name="document-outline"
                        size={19}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.reportInfo}>
                      <Text
                        style={styles.reportName}
                        numberOfLines={1}
                      >
                        {report.name}
                      </Text>

                      <Text style={styles.reportMeta}>
                        {report.type} · {report.date}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.viewReportBtn}
                      onPress={() => viewReport(report)}
                    >
                      <Ionicons
                        name="eye-outline"
                        size={16}
                        color={colors.primary}
                      />

                      <Text style={styles.viewReportText}>
                        View
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Test reports */}
              <View style={styles.reportSection}>
                <View style={styles.reportSectionHeader}>
                  <View style={styles.reportSectionTitleRow}>
                    <Ionicons
                      name="flask-outline"
                      size={18}
                      color={colors.primary}
                    />

                    <Text style={styles.reportSectionTitle}>
                      Test Reports
                    </Text>
                  </View>

                  <Text style={styles.reportCount}>
                    {testReports.length}
                  </Text>
                </View>

                {testReports.map((report) => (
                  <View
                    key={report.id}
                    style={styles.reportCard}
                  >
                    <View style={styles.reportIcon}>
                      <Ionicons
                        name="flask-outline"
                        size={19}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.reportInfo}>
                      <Text
                        style={styles.reportName}
                        numberOfLines={1}
                      >
                        {report.name}
                      </Text>

                      <Text style={styles.reportMeta}>
                        {report.type} · {report.date}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.viewReportBtn}
                      onPress={() => viewReport(report)}
                    >
                      <Ionicons
                        name="eye-outline"
                        size={16}
                        color="#071E42"
                      />

                      <Text style={styles.viewReportText}>
                        View
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : null}

        {/* Clinical perception / Consultation notes panel — jot down impressions without leaving the call */}
        {panel === 'perception' ? (
          <View
            style={[
              styles.perceptionPanel,
              {
                bottom: perceptionBottom,
                maxHeight: perceptionMaxHeight,
              },
            ]}
          >
            {/* Consultation notes header */}
            <View style={styles.infoPanelHeader}>
              <View style={styles.infoTitleContainer}>
                <View style={[styles.infoTitleIcon, { backgroundColor: '#EEF4FC' }]}>
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color="#071E42"
                  />
                </View>

                <View>
                  <Text style={styles.infoPanelTitle}>
                    Consultation Notes
                  </Text>
                  <Text style={styles.infoPanelSubtitle}>
                    Clinical perception & impressions
                  </Text>
                </View>
              </View>

              {/* Minimize button */}
              <TouchableOpacity
                style={styles.minimizeBtn}
                onPress={() => {
                  Keyboard.dismiss();
                  setPanel(null);
                }}
              >
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: spacing.md }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <TextInput
                style={[
                  styles.perceptionInput,
                  isKeyboardOpen && { minHeight: 75, maxHeight: 120 },
                ]}
                placeholder="Type consultation notes or clinical impressions as the call happens..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={perception}
                onChangeText={setPerception}
              />

              <View style={styles.perceptionFooterRow}>
                <Text style={styles.perceptionHint}>
                  Carries over to consultation notes when you end the call.
                </Text>

                {isKeyboardOpen && (
                  <TouchableOpacity
                    style={styles.doneTypingBtn}
                    onPress={() => Keyboard.dismiss()}
                  >
                    <Text style={styles.doneTypingBtnText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        ) : null}

        {/* Consultation Chat panel with upload files option */}
        {panel === 'chat' ? (
          <View
            style={[
              styles.chatPanel,
              {
                bottom: chatBottom,
                maxHeight: chatMaxHeight,
                height: chatMaxHeight,
              },
            ]}
          >
            {/* Chat panel header */}
            <View style={styles.infoPanelHeader}>
              <View style={styles.infoTitleContainer}>
                <View style={[styles.infoTitleIcon, { backgroundColor: '#EEF4FC' }]}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color="#071E42"
                  />
                </View>

                <View>
                  <Text style={styles.infoPanelTitle}>
                    Consultation Chat
                  </Text>
                  <Text style={styles.infoPanelSubtitle}>
                    Chat & shared files with {patient.name}
                  </Text>
                </View>
              </View>

              {/* Minimize button */}
              <TouchableOpacity
                style={styles.minimizeBtn}
                onPress={() => setPanel(null)}
              >
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Messages list */}
            <ScrollView
              ref={chatScrollRef}
              style={styles.chatMessagesScroll}
              contentContainerStyle={styles.chatMessagesContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {chatMessages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <View key={msg.id} style={styles.systemMsgContainer}>
                      <Ionicons
                        name="information-circle-outline"
                        size={14}
                        color={colors.textMuted}
                      />
                      <Text style={styles.systemMsgText}>{msg.text}</Text>
                    </View>
                  );
                }

                const isDoctor = msg.sender === 'doctor';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.chatMsgRow,
                      isDoctor ? styles.chatMsgRowDoctor : styles.chatMsgRowPatient,
                    ]}
                  >
                    <View
                      style={[
                        styles.chatBubble,
                        isDoctor ? styles.chatBubbleDoctor : styles.chatBubblePatient,
                      ]}
                    >
                      {msg.text ? (
                        <Text
                          style={[
                            styles.chatBubbleText,
                            isDoctor
                              ? styles.chatBubbleTextDoctor
                              : styles.chatBubbleTextPatient,
                          ]}
                        >
                          {msg.text}
                        </Text>
                      ) : null}

                      {/* Attached file card inside message bubble */}
                      {msg.file ? (
                        <TouchableOpacity
                          style={[
                            styles.chatFileCard,
                            isDoctor
                              ? styles.chatFileCardDoctor
                              : styles.chatFileCardPatient,
                          ]}
                          onPress={() => viewChatFile(msg.file)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.chatFileIconWrap}>
                            <Ionicons
                              name={
                                msg.file.name.endsWith('.jpg') ||
                                  msg.file.name.endsWith('.png')
                                  ? 'image-outline'
                                  : 'document-text-outline'
                              }
                              size={20}
                              color={colors.primary}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={[
                                styles.chatFileName,
                                isDoctor && { color: colors.white },
                              ]}
                              numberOfLines={1}
                            >
                              {msg.file.name}
                            </Text>
                            <Text
                              style={[
                                styles.chatFileSize,
                                isDoctor && {
                                  color: 'rgba(255,255,255,0.75)',
                                },
                              ]}
                            >
                              {msg.file.size} · Tap to view
                            </Text>
                          </View>
                          <Ionicons
                            name="eye-outline"
                            size={16}
                            color={isDoctor ? colors.white : "#071E42"}
                          />
                        </TouchableOpacity>
                      ) : null}

                      <Text
                        style={[
                          styles.chatTimeText,
                          isDoctor
                            ? styles.chatTimeTextDoctor
                            : styles.chatTimeTextPatient,
                        ]}
                      >
                        {msg.time}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Chat input row with Upload File button */}
            <View style={styles.chatInputBar}>
              <TouchableOpacity
                style={styles.chatAttachBtn}
                onPress={() => setUploadModalVisible(true)}
              >
                <Ionicons
                  name="attach-outline"
                  size={22}
                  color="#071E42"
                />
              </TouchableOpacity>

              <TextInput
                style={styles.chatTextInput}
                placeholder="Type message or attach file..."
                placeholderTextColor={colors.textMuted}
                value={chatInputText}
                onChangeText={setChatInputText}
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
              />

              <TouchableOpacity
                style={[
                  styles.chatSendBtn,
                  !chatInputText.trim() && styles.chatSendBtnDisabled,
                ]}
                onPress={() => sendMessage()}
                disabled={!chatInputText.trim()}
              >
                <Ionicons
                  name="send"
                  size={16}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Patient Details button — positioned with clean spacing above Consultation Notes & Lab Requirement */}
        <View style={styles.patientDetailsButtonContainer}>
          <TouchableOpacity
            style={[
              styles.patientDetailsButton,
              panel === 'info' && styles.patientDetailsButtonActive,
            ]}
            onPress={togglePatientDetails}
            activeOpacity={0.8}
          >
            <View style={styles.patientDetailsButtonLeft}>
              <View style={styles.patientDetailsIcon}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={
                    panel === 'info'
                      ? colors.white
                      : '#071E42'
                  }
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.patientDetailsButtonText,
                    panel === 'info' && {
                      color: colors.white,
                    },
                  ]}
                >
                  Patient Details
                </Text>

                <Text
                  style={[
                    styles.patientDetailsButtonSubtext,
                    panel === 'info' && {
                      color: 'rgba(255,255,255,0.75)',
                    },
                  ]}
                >
                  View medical history & reports
                </Text>
              </View>
            </View>

            <Ionicons
              name={
                panel === 'info'
                  ? 'chevron-up'
                  : 'chevron-forward'
              }
              size={20}
              color={
                panel === 'info'
                  ? colors.white
                  : colors.textMuted
              }
            />
          </TouchableOpacity>
        </View>

        {/* Quick actions — available throughout the call */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickChip}
            onPress={openConsultationNotes}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={15}
              color={colors.textPrimary}
            />

            <Text style={styles.quickChipText}>
              Consultation Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickChip}
            onPress={openLabRequirement}
            activeOpacity={0.8}
          >
            <Ionicons
              name="flask-outline"
              size={15}
              color={colors.textPrimary}
            />

            <Text style={styles.quickChipText}>
              Lab Requirement
            </Text>
          </TouchableOpacity>
        </View>

        {/* Call controls */}
        <View style={styles.controlsBar}>
          <TouchableOpacity
            style={[
              styles.controlBtn,
              !micOn && styles.controlBtnOff,
            ]}
            onPress={() => setMicOn((v) => !v)}
          >
            <Ionicons
              name={
                micOn
                  ? 'mic-outline'
                  : 'mic-off-outline'
              }
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlBtn,
              !camOn && styles.controlBtnOff,
            ]}
            onPress={() => setCamOn((v) => !v)}
          >
            <Ionicons
              name={
                camOn
                  ? 'videocam-outline'
                  : 'videocam-off-outline'
              }
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={endCall}
          >
            <Ionicons
              name="call"
              size={22}
              color={colors.white}
              style={{
                transform: [{ rotate: '135deg' }],
              }}
            />
          </TouchableOpacity>

          {/* Camera rotation button */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => { }}
          >
            <Ionicons
              name="camera-reverse-outline"
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>

          {/* Chat icon with upload files option near camera rotation */}
          <TouchableOpacity
            style={[
              styles.controlBtn,
              panel === 'chat' && styles.controlBtnActive,
            ]}
            onPress={() => setPanel(panel === 'chat' ? null : 'chat')}
          >
            <Ionicons
              name={
                panel === 'chat'
                  ? 'chatbubble-ellipses'
                  : 'chatbubble-ellipses-outline'
              }
              size={22}
              color={colors.white}
            />
            {chatMessages.length > 2 && (
              <View style={styles.chatBadgeDot} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.endCallLabel}
          onPress={endCall}
        >
          <Text style={styles.endCallLabelText}>
            End call & write consultation notes
          </Text>
        </TouchableOpacity>

        {/* Upload Files Modal */}
        <Modal
          visible={uploadModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setUploadModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={styles.uploadModalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.uploadModalCard}>
              <View style={styles.uploadModalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={styles.uploadHeaderIconWrap}>
                    <Ionicons name="cloud-upload" size={18} color="#071E42" />
                  </View>
                  <View>
                    <Text style={styles.uploadModalTitle}>Upload & Share File</Text>
                    <Text style={styles.uploadModalSubtitle}>
                      Send medical document to {patient.name}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                  <Ionicons name="close" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Quick File Types */}
              <Text style={styles.uploadLabel}>Select Document / File Type</Text>
              <View style={styles.uploadTypesRow}>
                {[
                  { type: 'Medical Report (PDF)', icon: 'document-text-outline' },
                  { type: 'Prescription Document', icon: 'medkit-outline' },
                  { type: 'Lab Test Result', icon: 'flask-outline' },
                  { type: 'Clinical Scan / Image', icon: 'image-outline' },
                ].map((item) => {
                  const isSelected = selectedFileType === item.type;
                  return (
                    <TouchableOpacity
                      key={item.type}
                      style={[
                        styles.uploadTypeChip,
                        isSelected && styles.uploadTypeChipSelected,
                      ]}
                      onPress={() => setSelectedFileType(item.type)}
                    >
                      <Ionicons
                        name={item.icon}
                        size={15}
                        color={isSelected ? colors.white : "#071E42"}
                      />
                      <Text
                        style={[
                          styles.uploadTypeChipText,
                          isSelected && styles.uploadTypeChipTextSelected,
                        ]}
                      >
                        {item.type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom file name input (optional) */}
              <Text style={styles.uploadLabel}>File Title / Description (Optional)</Text>
              <TextInput
                style={styles.uploadInput}
                placeholder={`e.g. ${selectedFileType} - ${patient.name}`}
                placeholderTextColor={colors.textMuted}
                value={customUploadName}
                onChangeText={setCustomUploadName}
              />

              {/* Upload action buttons */}
              <View style={styles.uploadActionsRow}>
                <TouchableOpacity
                  style={styles.uploadCancelBtn}
                  onPress={() => setUploadModalVisible(false)}
                >
                  <Text style={styles.uploadCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadConfirmBtn}
                  onPress={() => handleUploadFile()}
                >
                  <Ionicons name="cloud-upload" size={16} color={colors.white} />
                  <Text style={styles.uploadConfirmBtnText}>Upload & Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* ========================================================
            VIDEO CALL CONSULTATION BOTTOM SHEET
            (Opens when red end call button is pressed)
        ======================================================== */}
        <VideoCallBottomSheet
          visible={videoCallSheetVisible}
          onClose={handleCloseSheet}
          appointment={appointment}
          patient={patient}
          callDuration={finalCallDuration}
          initialNotes={perception}
          initialStep={sheetInitialStep}
          onNotesChange={(newNotes) => setPerception(newNotes)}
          onComplete={handleCompleteConsultation}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1F1D',
  },

  remoteVideo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071E42',
  },

  remoteAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 2.5,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  remoteAvatarText: {
    ...typography.h1,
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  remoteName: {
    ...typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  callTimer: {
    ...typography.smallBold,
    color: '#38BDF8',
    backgroundColor: 'rgba(6, 26, 58, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: 8,
    overflow: 'hidden',
  },

  selfPreview: {
    position: 'absolute',
    top: 115,
    right: 16,
    width: 86,
    height: 118,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#38BDF8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  selfPreviewOn: {
    flex: 1,
    backgroundColor: '#061A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selfPreviewOff: {
    flex: 1,
    backgroundColor: '#041126',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topNavyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#061A3A',
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + 8
        : 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0E2E5C',
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  topCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topCircleBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#38BDF8',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  brandText: {
    fontSize: 18,
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

  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    gap: 5,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  liveText: {
    ...typography.tiny,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /*
   * Patient Details expanded panel.
   * It is no longer allowed to take over the whole screen.
   */
  infoPanel: {
    position: 'absolute',
    bottom: 195,
    left: 12,
    right: 12,
    maxHeight: 310,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    zIndex: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  infoPanelHeader: {
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },

  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  infoTitleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoPanelTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.textPrimary,
  },

  infoPanelSubtitle: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },

  minimizeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoScrollContent: {
    padding: spacing.lg,
    paddingTop: 8,
    paddingBottom: 16,
  },

  infoRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  infoLabel: {
    ...typography.tiny,
    color: colors.textMuted,
  },

  infoValue: {
    ...typography.smallBold,
    color: colors.textPrimary,
    marginTop: 2,
  },

  /*
   * Permanent Patient Details button.
   * Positioned cleanly above Perception and Lab Requirement without overlap.
   */
  patientDetailsButtonContainer: {
    marginHorizontal: 12,
    marginBottom: 10,
    zIndex: 14,
  },

  patientDetailsButton: {
    minHeight: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  patientDetailsButtonActive: {
    backgroundColor: '#071E42',
  },

  patientDetailsButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  patientDetailsIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  patientDetailsButtonText: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },

  patientDetailsButtonSubtext: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },

  /*
   * Previous reports / test reports
   */
  reportSection: {
    marginTop: 12,
  },

  reportSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  reportSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  reportSectionTitle: {
    ...typography.smallBold,
    color: '#071E42',
  },

  reportCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEF4FC',
    color: '#071E42',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 11,
    fontWeight: '700',
    paddingTop: 4,
  },

  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 9,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: colors.border,
  },

  reportIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  reportInfo: {
    flex: 1,
    minWidth: 0,
  },

  reportName: {
    ...typography.smallBold,
    color: colors.textPrimary,
    fontSize: 12,
  },

  reportMeta: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },

  viewReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginLeft: 6,
  },

  viewReportText: {
    ...typography.tiny,
    color: '#071E42',
    fontWeight: '700',
  },

  perceptionPanel: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  perceptionInput: {
    minHeight: 85,
    borderWidth: 1.5,
    borderColor: '#071E42',
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.small,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    backgroundColor: '#FAFCFC',
  },

  perceptionFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  perceptionHint: {
    ...typography.tiny,
    color: colors.textMuted,
    flex: 1,
    marginRight: 8,
  },

  doneTypingBtn: {
    backgroundColor: '#071E42',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },

  doneTypingBtnText: {
    ...typography.tinyBold,
    color: colors.white,
  },

  quickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
    marginBottom: 10,
    zIndex: 10,
  },

  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
  },

  quickChipActive: {
    backgroundColor: '#071E42',
  },

  quickChipText: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },

  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 14,
    paddingTop: 6,
  },

  controlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlBtnActive: {
    backgroundColor: '#071E42',
  },

  chatBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#38BDF8',
    borderWidth: 1.5,
    borderColor: '#061A3A',
  },

  controlBtnOff: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  endBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },

  endCallLabel: {
    alignItems: 'center',
    paddingBottom: 18,
  },

  endCallLabelText: {
    ...typography.small,
    color: 'rgba(255,255,255,0.7)',
  },

  /*
   * Consultation Chat & File Upload styles
   */
  chatPanel: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  chatUploadHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(0,168,150,0.2)',
  },

  chatUploadHeaderBtnText: {
    ...typography.tinyBold,
    color: colors.primary,
  },

  chatMessagesScroll: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  chatMessagesContainer: {
    padding: 12,
    gap: 8,
  },

  systemMsgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#EDF2F7',
    borderRadius: radius.pill,
    alignSelf: 'center',
    marginVertical: 4,
  },

  systemMsgText: {
    ...typography.tiny,
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },

  chatMsgRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },

  chatMsgRowDoctor: {
    justifyContent: 'flex-end',
  },

  chatMsgRowPatient: {
    justifyContent: 'flex-start',
  },

  chatBubble: {
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },

  chatBubbleDoctor: {
    backgroundColor: '#071E42',
    borderBottomRightRadius: 4,
  },

  chatBubblePatient: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  chatBubbleText: {
    ...typography.small,
    lineHeight: 18,
  },

  chatBubbleTextDoctor: {
    color: colors.white,
  },

  chatBubbleTextPatient: {
    color: colors.textPrimary,
  },

  chatFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },

  chatFileCardDoctor: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  chatFileCardPatient: {
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: 'rgba(7,30,66,0.15)',
  },

  chatFileIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chatFileName: {
    ...typography.smallBold,
    fontSize: 12,
    color: colors.textPrimary,
  },

  chatFileSize: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 1,
  },

  chatTimeText: {
    ...typography.tiny,
    fontSize: 10,
    marginTop: 4,
  },

  chatTimeTextDoctor: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },

  chatTimeTextPatient: {
    color: colors.textMuted,
  },

  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    gap: 8,
  },

  chatAttachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chatTextInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    ...typography.small,
    color: colors.textPrimary,
    maxHeight: 70,
  },

  chatSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chatSendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },

  uploadModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },

  uploadModalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },

  uploadModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  uploadHeaderIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadModalTitle: {
    ...typography.h3,
    fontSize: 16,
    color: '#071E42',
  },

  uploadModalSubtitle: {
    ...typography.tiny,
    color: colors.textMuted,
  },

  uploadLabel: {
    ...typography.smallBold,
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 6,
  },

  uploadTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  uploadTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.border,
  },

  uploadTypeChipSelected: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },

  uploadTypeChipText: {
    ...typography.tinyBold,
    color: colors.textPrimary,
  },

  uploadTypeChipTextSelected: {
    color: colors.white,
  },

  uploadInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...typography.small,
    color: colors.textPrimary,
    marginBottom: 16,
  },

  uploadActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  uploadCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadCancelBtnText: {
    ...typography.smallBold,
    color: colors.textMuted,
  },

  uploadConfirmBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#071E42',
  },

  uploadConfirmBtnText: {
    ...typography.smallBold,
    color: colors.white,
  },
});
