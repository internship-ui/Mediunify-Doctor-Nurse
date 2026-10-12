import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Linking,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeNursingHeader from '../components/HomeNursingHeader';
import { useHomeNursing } from '../context/HomeNursingContext';
import { radius } from '../../theme/colors';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const SAMPLE_ARRIVAL_PHOTOS = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80',
];

export default function HomeNursingServiceStatusScreen({ route, navigation }) {
  const { assignmentId } = route.params || {};
  const {
    assignments,
    activeAssignment,
    markOnTheWay,
    recordArrival,
    markServiceStarted,
    markServiceCompleted,
  } = useHomeNursing();

  const currentAssignment =
    (assignmentId && assignments.find((a) => a.id === assignmentId)) ||
    activeAssignment ||
    assignments[0] || {
      id: 'NS-2041',
      service: 'Wound dressing',
      patientName: 'Priya Sharma',
      patientAge: 28,
      patientPhone: '+91 98860 12345',
      timeLabel: '4:00 PM',
      location: '12th Main, Indiranagar',
      remainingDistance: '1.1 km left',
      status: 'On the way',
      acceptedTime: '3:34 PM',
      onTheWayTime: '3:41 PM',
      startedTime: null,
      arrivalVerified: false,
    };

  // Status can be: 'Assigned' | 'On the way' | 'In progress' | 'Completed'
  const isAssigned = currentAssignment.status === 'Assigned';
  const isOnTheWay = currentAssignment.status === 'On the way';
  const isStarted = currentAssignment.status === 'In progress';
  const isCompleted = currentAssignment.status === 'Completed';

  // Live arrival verification state
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [liveLocation, setLiveLocation] = useState(
    currentAssignment.arrivalLocation
      ? {
          address: currentAssignment.arrivalLocation,
          coords: '12.9716° N, 77.5946° E',
          accuracy: '±3m (Doorstep Locked)',
          timestamp: currentAssignment.arrivedTime || '3:50 PM',
        }
      : null
  );

  const [arrivalPhoto, setArrivalPhoto] = useState(
    currentAssignment.arrivalPhoto
      ? {
          uri: currentAssignment.arrivalPhoto,
          timestamp: currentAssignment.arrivedTime || '3:52 PM',
          name: 'doorstep_arrival.jpg',
        }
      : null
  );

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState(
    'Dressing changed on left forearm with sterile technique. Antiseptic applied, clean sterile dressing secured. Patient vitals stable, no signs of infection.'
  );
  const [patientCondition, setPatientCondition] = useState('Stable');
  const [followupRequired, setFollowupRequired] = useState(false);
  const [followupDate, setFollowupDate] = useState('05 Oct 2026');

  // Calendar pop-up modal state
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calMonthIndex, setCalMonthIndex] = useState(9); // 0-indexed: 9 = October
  const [calYear, setCalYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(5);

  const handleCallPatient = () => {
    Alert.alert('Call Patient', `Dialing ${currentAssignment.patientPhone}...`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () =>
          Linking.openURL(`tel:${currentAssignment.patientPhone}`).catch(() => {}),
      },
    ]);
  };

  const handleNavigate = () => {
    const query = encodeURIComponent(currentAssignment.location + ', Bengaluru');
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url).catch(() => {
      Alert.alert('Turn-by-turn Navigation', `Route to ${currentAssignment.location}`);
    });
  };

  // --- Live GPS Location Fetch ---
  const handleFetchLiveLocation = () => {
    setIsFetchingLocation(true);
    setTimeout(() => {
      setIsFetchingLocation(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const fetched = {
        address: `#12, ${currentAssignment.location}, Bengaluru - 560038`,
        coords: '12.9716° N, 77.5946° E',
        accuracy: '±3m (Doorstep Locked)',
        timestamp: 'Today, ' + timeStr,
      };
      setLiveLocation(fetched);
      if (recordArrival) {
        recordArrival(currentAssignment.id, {
          location: fetched.address,
          photo: arrivalPhoto?.uri,
        });
      }
      Alert.alert(
        'Live Location Fetched',
        `Doorstep GPS verified successfully!\n\nCoordinates: ${fetched.coords}\nAddress: ${fetched.address}\nAccuracy: ${fetched.accuracy}`
      );
    }, 800);
  };

  // --- Live Arrival Photo Upload / Capture ---
  const handleConfirmArrivalPhoto = (photoUri) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const photo = {
      uri: photoUri || SAMPLE_ARRIVAL_PHOTOS[selectedSampleIndex],
      timestamp: 'Today, ' + timeStr,
      name: `arrival_doorstep_${Date.now().toString().slice(-4)}.jpg`,
    };
    setArrivalPhoto(photo);
    setShowCameraModal(false);

    if (recordArrival) {
      recordArrival(currentAssignment.id, {
        location: liveLocation?.address || currentAssignment.location,
        photo: photo.uri,
      });
    }

    Alert.alert(
      'Arrival Photo Uploaded',
      'Doorstep photo of the patient place has been uploaded and verified.'
    );
  };

  // --- One-click demo check-in ---
  const handleQuickVerify = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fetched = {
      address: `#12, ${currentAssignment.location}, Bengaluru - 560038`,
      coords: '12.9716° N, 77.5946° E',
      accuracy: '±3m (Doorstep Locked)',
      timestamp: 'Today, ' + timeStr,
    };
    const photo = {
      uri: SAMPLE_ARRIVAL_PHOTOS[0],
      timestamp: 'Today, ' + timeStr,
      name: 'arrival_doorstep_demo.jpg',
    };
    setLiveLocation(fetched);
    setArrivalPhoto(photo);
    if (recordArrival) {
      recordArrival(currentAssignment.id, {
        location: fetched.address,
        photo: photo.uri,
      });
    }
  };

  // --- Step Action Handler ---
  const handleStepAction = () => {
    if (isAssigned) {
      markOnTheWay(currentAssignment.id);
    } else if (isOnTheWay) {
      // Must verify location and photo
      if (!liveLocation || !arrivalPhoto) {
        // Auto-fulfill for frictionless demo
        handleQuickVerify();
        markServiceStarted(currentAssignment.id);
        Alert.alert(
          'Arrival Verified & Service Started',
          `Live location (GPS: 12.9716° N, 77.5946° E) and doorstep photo recorded.\n\nCare procedure begun for ${currentAssignment.patientName}. Status is now "Service In Progress".`
        );
      } else {
        markServiceStarted(currentAssignment.id);
        Alert.alert(
          'Service Started',
          `Care procedure begun for ${currentAssignment.patientName}. Status is now "Service In Progress".`
        );
      }
    } else if (isStarted) {
      setShowCompletionModal(true);
    }
  };

  // --- Finish Service Completion ---
  const handleFinishCompletion = () => {
    if (!completionNotes.trim()) {
      Alert.alert('Notes Required', 'Please enter completion notes before finalizing.');
      return;
    }

    markServiceCompleted(
      currentAssignment.id,
      `${completionNotes.trim()} (Patient condition: ${patientCondition})`,
      {
        followupRequired,
        followupDate: followupRequired ? followupDate : null,
        arrivalLocation: liveLocation ? liveLocation.address : currentAssignment.location,
        arrivalPhoto: arrivalPhoto ? arrivalPhoto.uri : null,
      }
    );
    setShowCompletionModal(false);

    Alert.alert(
      'Service Completed!',
      followupRequired
        ? `Assignment finished and saved to history.\nFollow-up request recorded for ${followupDate}.\nYour status has been restored to "Available".`
        : 'Assignment finished and clinical record saved to history. Your status has automatically reset to "Available".',
      [
        {
          text: 'View History',
          onPress: () => navigation.navigate('HomeNursingHistory'),
        },
        {
          text: 'Back to Home',
          onPress: () => navigation.navigate('HomeNursingHome'),
        },
      ]
    );
  };

  // --- Calendar calculations ---
  const daysInMonth = new Date(calYear, calMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonthIndex, 1).getDay(); // 0 is Sunday
  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const handlePrevCalMonth = () => {
    if (calMonthIndex === 0) {
      setCalMonthIndex(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonthIndex((m) => m - 1);
    }
  };

  const handleNextCalMonth = () => {
    if (calMonthIndex === 11) {
      setCalMonthIndex(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonthIndex((m) => m + 1);
    }
  };

  const handleConfirmCalendarDate = () => {
    const formatted = `${String(selectedDay).padStart(2, '0')} ${MONTH_NAMES[calMonthIndex].slice(0, 3)} ${calYear}`;
    setFollowupDate(formatted);
    setShowCalendarModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071E42" />

      {/* TOP BRAND HEADER */}
      <HomeNursingHeader
        navigation={navigation}
        showBack={true}
        title="Current service"
        showCall={false}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PATIENT BANNER CARD */}
        <View style={styles.patientBannerCard}>
          <View style={styles.patientAvatarWrap}>
            <Text style={styles.patientAvatarText}>
              {currentAssignment.patientName.slice(0, 2).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.patientName}>{currentAssignment.patientName}</Text>
            <Text style={styles.serviceMeta}>
              {currentAssignment.service} · {currentAssignment.timeLabel}
            </Text>

            {/* CALL BUTTON BELOW PATIENT'S NAME: call--> call button */}
            <TouchableOpacity
              style={styles.patientCallBtn}
              onPress={handleCallPatient}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={13} color="#FFFFFF" />
              <Text style={styles.patientCallBtnText}>Call</Text>
              <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{currentAssignment.status}</Text>
          </View>
        </View>

        {/* STEPPER TIMELINE CARD */}
        <View style={styles.timelineCard}>
          {/* STEP 1: Assignment accepted */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconColumn}>
              <View style={[styles.stepCircle, styles.stepCircleDone]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
              <View style={[styles.stepLine, styles.stepLineDone]} />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Assignment accepted</Text>
              <Text style={styles.stepTime}>
                {currentAssignment.acceptedTime || '3:34 PM'}
              </Text>
            </View>
          </View>

          {/* STEP 2: On the way */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconColumn}>
              <View
                style={[
                  styles.stepCircle,
                  isOnTheWay ? styles.stepCircleNavy : styles.stepCircleDone,
                ]}
              >
                <Ionicons
                  name={isStarted || isCompleted ? 'checkmark' : 'navigate'}
                  size={14}
                  color="#FFFFFF"
                />
              </View>
              <View
                style={[
                  styles.stepLine,
                  (isStarted || isCompleted) && styles.stepLineDone,
                ]}
              />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>On the way</Text>
              <Text style={styles.stepSubtitle}>
                Started {currentAssignment.onTheWayTime || '3:41 PM'} · ETA{' '}
                {currentAssignment.timeLabel}
              </Text>
            </View>
          </View>

          {/* STEP 3: Reached Location & Live Check-in */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconColumn}>
              <View
                style={[
                  styles.stepCircle,
                  liveLocation && arrivalPhoto
                    ? styles.stepCircleDone
                    : isOnTheWay
                    ? styles.stepCircleNavy
                    : styles.stepCirclePending,
                ]}
              >
                <Ionicons
                  name={
                    liveLocation && arrivalPhoto
                      ? 'checkmark'
                      : isOnTheWay
                      ? 'location'
                      : 'location-outline'
                  }
                  size={15}
                  color={
                    liveLocation && arrivalPhoto || isOnTheWay ? '#FFFFFF' : '#64748B'
                  }
                />
              </View>
              <View
                style={[
                  styles.stepLine,
                  (isStarted || isCompleted) && styles.stepLineDone,
                ]}
              />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Reached destination place</Text>
              <Text style={styles.stepSubtitle}>
                {liveLocation && arrivalPhoto
                  ? 'Live GPS fetched & Arrival photo verified'
                  : isOnTheWay
                  ? 'Fetch live location & upload doorstep photo'
                  : 'Pending arrival'}
              </Text>
            </View>
          </View>

          {/* STEP 4: Service started */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconColumn}>
              <View
                style={[
                  styles.stepCircle,
                  isStarted
                    ? styles.stepCircleNavy
                    : isCompleted
                    ? styles.stepCircleDone
                    : styles.stepCirclePending,
                ]}
              >
                <Ionicons
                  name={isCompleted ? 'checkmark' : 'play'}
                  size={isCompleted ? 16 : 14}
                  color={isStarted || isCompleted ? '#FFFFFF' : '#64748B'}
                />
              </View>
              <View
                style={[
                  styles.stepLine,
                  isCompleted && styles.stepLineDone,
                ]}
              />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Service started</Text>
              <Text style={styles.stepSubtitle}>
                {isStarted
                  ? `Care active since ${currentAssignment.startedTime || 'Just now'}`
                  : isCompleted
                  ? 'Care procedure finished'
                  : 'Mark when you begin care'}
              </Text>
            </View>
          </View>

          {/* STEP 5: Service completed */}
          <View style={[styles.stepItem, { marginBottom: 0 }]}>
            <View style={styles.stepIconColumn}>
              <View
                style={[
                  styles.stepCircle,
                  isCompleted ? styles.stepCircleDone : styles.stepCirclePending,
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={isCompleted ? '#FFFFFF' : '#94A3B8'}
                />
              </View>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Service completed</Text>
              <Text style={styles.stepSubtitle}>
                {isCompleted ? 'Finished and recorded' : 'Add notes, follow-up & finish'}
              </Text>
            </View>
          </View>
        </View>

        {/* DESTINATION / NAVIGATE MINI CARD */}
        <View style={styles.destCard}>
          <View style={styles.destPinWrap}>
            <Ionicons name="location" size={18} color="#00B894" />
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.destTitle} numberOfLines={1}>
              {currentAssignment.location}
            </Text>
            <Text style={styles.destDistance}>
              {currentAssignment.remainingDistance || '1.1 km left'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.navigateBtn}
            onPress={handleNavigate}
            activeOpacity={0.8}
          >
            <Ionicons
              name="navigate-outline"
              size={14}
              color="#08317C"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.navigateBtnText}>Navigate</Text>
          </TouchableOpacity>
        </View>

        {/* -------------------------------------------------------------
            LIVE ARRIVAL & DOORSTEP PLACE VERIFICATION CARD
            (Visible when On the Way or once fetched)
        ------------------------------------------------------------- */}
        {(isOnTheWay || liveLocation || arrivalPhoto) && (
          <View style={styles.arrivalVerificationCard}>
            <View style={styles.arrivalCardHeader}>
              <View style={styles.arrivalHeaderBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#00B894" />
                <Text style={styles.arrivalHeaderBadgeText}>
                  Doorstep Place Verification
                </Text>
              </View>
              {isOnTheWay && (
                <TouchableOpacity
                  style={styles.quickDemoLink}
                  onPress={handleQuickVerify}
                >
                  <Text style={styles.quickDemoLinkText}>Auto Fill (Demo)</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.arrivalCardSubtitle}>
              After reaching assigned location, fetch live GPS coordinates and
              upload live photo of the place.
            </Text>

            {/* 1. FETCH LIVE LOCATION */}
            <View style={styles.verifyItemBox}>
              <View style={styles.verifyItemHeader}>
                <View style={styles.verifyItemTitleRow}>
                  <Ionicons name="location-sharp" size={16} color="#08317C" />
                  <Text style={styles.verifyItemTitle}>1. Live Location</Text>
                </View>
                {liveLocation && (
                  <View style={styles.verifiedTag}>
                    <Ionicons name="checkmark-circle" size={13} color="#15803D" />
                    <Text style={styles.verifiedTagText}>GPS Verified</Text>
                  </View>
                )}
              </View>

              {liveLocation ? (
                <View style={styles.verifiedLocationCard}>
                  <View style={styles.gpsRow}>
                    <Ionicons name="navigate-circle" size={18} color="#00B894" />
                    <Text style={styles.gpsCoordsText}>{liveLocation.coords}</Text>
                    <Text style={styles.gpsAccuracyBadge}>{liveLocation.accuracy}</Text>
                  </View>
                  <Text style={styles.gpsAddressText}>{liveLocation.address}</Text>
                  <View style={styles.gpsFooterRow}>
                    <Text style={styles.gpsTimestampText}>
                      Fetched: {liveLocation.timestamp}
                    </Text>
                    {isOnTheWay && (
                      <TouchableOpacity onPress={handleFetchLiveLocation}>
                        <Text style={styles.reFetchText}>Re-fetch</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.fetchLocationBtn}
                  onPress={handleFetchLiveLocation}
                  disabled={isFetchingLocation}
                  activeOpacity={0.8}
                >
                  {isFetchingLocation ? (
                    <View style={styles.btnLoadingRow}>
                      <ActivityIndicator size="small" color="#08317C" />
                      <Text style={styles.fetchLocationBtnText}>
                        Fetching live GPS coordinates...
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.btnLoadingRow}>
                      <Ionicons name="locate" size={18} color="#08317C" />
                      <Text style={styles.fetchLocationBtnText}>
                        Fetch Live GPS Location
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* 2. UPLOAD PHOTO OF LIVE AFTER REACH ASSIGNED PLACE */}
            <View style={[styles.verifyItemBox, { marginTop: 12 }]}>
              <View style={styles.verifyItemHeader}>
                <View style={styles.verifyItemTitleRow}>
                  <Ionicons name="camera" size={16} color="#08317C" />
                  <Text style={styles.verifyItemTitle}>
                    2. Live Place / Doorstep Photo
                  </Text>
                </View>
                {arrivalPhoto && (
                  <View style={styles.verifiedTag}>
                    <Ionicons name="checkmark-circle" size={13} color="#15803D" />
                    <Text style={styles.verifiedTagText}>Photo Uploaded</Text>
                  </View>
                )}
              </View>

              {arrivalPhoto ? (
                <View style={styles.uploadedPhotoCard}>
                  <Image
                    source={{ uri: arrivalPhoto.uri }}
                    style={styles.uploadedPhotoThumb}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.uploadedPhotoTitle} numberOfLines={1}>
                      Doorstep Entrance Verified
                    </Text>
                    <Text style={styles.uploadedPhotoMeta}>
                      Live photo · {arrivalPhoto.timestamp}
                    </Text>
                    <Text style={styles.uploadedPhotoLoc} numberOfLines={1}>
                      {liveLocation?.address || currentAssignment.location}
                    </Text>
                  </View>
                  {isOnTheWay && (
                    <TouchableOpacity
                      style={styles.retakePhotoBtn}
                      onPress={() => setShowCameraModal(true)}
                    >
                      <Ionicons name="camera-reverse-outline" size={16} color="#08317C" />
                      <Text style={styles.retakePhotoText}>Retake</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadPhotoDashedBox}
                  onPress={() => setShowCameraModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={styles.uploadPhotoIconWrap}>
                    <Ionicons name="camera-outline" size={24} color="#00B894" />
                  </View>
                  <Text style={styles.uploadPhotoMainText}>
                    Capture / Upload Arrival Photo
                  </Text>
                  <Text style={styles.uploadPhotoSubText}>
                    Take live photo of patient entrance or doorstep to verify
                    arrival
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* STATUS BROADCAST CAPTION */}
        <View style={styles.broadcastBanner}>
          <Text style={styles.broadcastText}>
            Your status shows{' '}
            <Text style={styles.broadcastHighlight}>
              {currentAssignment.status}
            </Text>{' '}
            to admin and patient
          </Text>
        </View>

        {/* BIG STICKY ACTION BUTTON */}
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity
            style={[
              styles.primaryActionButton,
              isCompleted && { backgroundColor: '#64748B' },
            ]}
            onPress={handleStepAction}
            activeOpacity={0.88}
            disabled={isCompleted}
          >
            <Ionicons
              name={
                isStarted
                  ? 'checkmark-done-circle'
                  : isOnTheWay
                  ? 'checkmark-circle'
                  : 'play-circle'
              }
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryActionButtonText}>
              {isCompleted
                ? 'Service Completed'
                : isStarted
                ? 'Mark service completed'
                : isOnTheWay
                ? liveLocation && arrivalPhoto
                  ? 'Confirm Arrival & Start Care'
                  : 'Verify Arrival & Start Care'
                : 'Start Journey (On the way)'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* -------------------------------------------------------------
          CAMERA / LIVE PHOTO CAPTURE MODAL
      ------------------------------------------------------------- */}
      <Modal
        visible={showCameraModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCameraModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cameraModalCard}>
            <View style={styles.cameraModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="camera" size={22} color="#00B894" />
                <Text style={styles.modalTitle}>Arrival Place Verification</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCameraModal(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.cameraModalDesc}>
              Take a live photo of the patient's doorway or entrance to confirm
              doorstep arrival.
            </Text>

            {/* Simulated Live Viewfinder */}
            <View style={styles.viewfinderFrame}>
              <Image
                source={{ uri: SAMPLE_ARRIVAL_PHOTOS[selectedSampleIndex] }}
                style={styles.viewfinderImage}
              />
              <View style={styles.viewfinderOverlay}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />

                <View style={styles.liveLocationWatermark}>
                  <Ionicons name="location-sharp" size={13} color="#00B894" />
                  <Text style={styles.watermarkText} numberOfLines={1}>
                    GPS: 12.9716° N, 77.5946° E · {currentAssignment.location}
                  </Text>
                </View>
              </View>
            </View>

            {/* Select place preview angle */}
            <Text style={styles.samplePhotoSelectLabel}>
              Select Doorway View:
            </Text>
            <View style={styles.samplePhotoRow}>
              {SAMPLE_ARRIVAL_PHOTOS.map((uri, idx) => {
                const isSelected = selectedSampleIndex === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.samplePhotoThumbWrap,
                      isSelected && styles.samplePhotoThumbWrapActive,
                    ]}
                    onPress={() => setSelectedSampleIndex(idx)}
                  >
                    <Image source={{ uri }} style={styles.samplePhotoThumb} />
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.shutterActionBtn}
              onPress={() => handleConfirmArrivalPhoto()}
              activeOpacity={0.88}
            >
              <Ionicons
                name="camera"
                size={20}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.shutterActionBtnText}>
                Capture & Upload Live Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* -------------------------------------------------------------
          MARK SERVICE COMPLETED POP-UP MODAL (WITH FOLLOW-UP REQUEST & CALENDAR)
      ------------------------------------------------------------- */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Ionicons name="checkmark-done-circle" size={24} color="#00B894" />
                <Text style={styles.modalTitle}>Complete Nursing Visit</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCompletionModal(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalPatient}>
              Patient: {currentAssignment.patientName} · {currentAssignment.service}
            </Text>

            {/* Patient condition */}
            <Text style={styles.inputLabel}>Patient Condition After Care</Text>
            <View style={styles.conditionPills}>
              {['Stable', 'Improving', 'Requires Doctor Followup'].map((cond) => {
                const active = patientCondition === cond;
                return (
                  <TouchableOpacity
                    key={cond}
                    style={[styles.condPill, active && styles.condPillActive]}
                    onPress={() => setPatientCondition(cond)}
                  >
                    <Text
                      style={[
                        styles.condPillText,
                        active && styles.condPillTextActive,
                      ]}
                    >
                      {cond}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Clinical notes */}
            <Text style={styles.inputLabel}>Clinical Notes & Procedure Summary</Text>
            <TextInput
              style={styles.modalTextarea}
              placeholder="Enter details of nursing care provided..."
              placeholderTextColor="#94A3B8"
              value={completionNotes}
              onChangeText={setCompletionNotes}
              multiline
            />

            {/* ---------------------------------------------------------
                FOLLOW-UP REQUEST SECTION (TOGGLE & CALENDAR DATE SELECTOR)
            --------------------------------------------------------- */}
            <View style={styles.followupCard}>
              <View style={styles.followupHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.followupHeading}>Follow-up Request</Text>
                  <Text style={styles.followupSubheading}>
                    Request subsequent nursing visit for this patient
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.followupToggleBtn,
                    followupRequired && styles.followupToggleBtnActive,
                  ]}
                  onPress={() => setFollowupRequired(!followupRequired)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.toggleKnob,
                      followupRequired && styles.toggleKnobActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* Follow-up Date selector (visible when requested) */}
              {followupRequired && (
                <View style={styles.followupDateContainer}>
                  <Text style={styles.followupDateLabel}>
                    Follow-up Date (Click to choose):
                  </Text>
                  <TouchableOpacity
                    style={styles.calendarPickerBtn}
                    onPress={() => setShowCalendarModal(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.calIconWrap}>
                      <Ionicons name="calendar" size={18} color="#08317C" />
                    </View>
                    <Text style={styles.calendarDateText}>{followupDate}</Text>
                    <View style={styles.calendarPillBadge}>
                      <Text style={styles.calendarPillBadgeText}>Open Calendar</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={13}
                        color="#08317C"
                        style={{ marginLeft: 2 }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.modalFinishBtn}
              onPress={handleFinishCompletion}
              activeOpacity={0.88}
            >
              <Text style={styles.modalFinishBtnText}>
                Finish & Restore Availability
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* -------------------------------------------------------------
          INTERACTIVE CALENDAR POP-UP MODAL
      ------------------------------------------------------------- */}
      <Modal
        visible={showCalendarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalCard}>
            {/* Header with Month / Year Navigation */}
            <View style={styles.calHeaderRow}>
              <TouchableOpacity
                style={styles.calNavArrowBtn}
                onPress={handlePrevCalMonth}
              >
                <Ionicons name="chevron-back" size={20} color="#08317C" />
              </TouchableOpacity>

              <View style={styles.calMonthYearWrap}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#00B894"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.calMonthYearText}>
                  {MONTH_NAMES[calMonthIndex]} {calYear}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.calNavArrowBtn}
                onPress={handleNextCalMonth}
              >
                <Ionicons name="chevron-forward" size={20} color="#08317C" />
              </TouchableOpacity>
            </View>

            {/* Weekdays row */}
            <View style={styles.calWeekRow}>
              {WEEK_DAYS.map((w, idx) => (
                <Text key={idx} style={styles.calWeekText}>
                  {w}
                </Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.calGrid}>
              {calendarCells.map((dayNum, idx) => {
                if (dayNum === null) {
                  return <View key={idx} style={styles.calCellEmpty} />;
                }
                const isSelected = selectedDay === dayNum;
                const isToday =
                  dayNum === 2 && calMonthIndex === 9 && calYear === 2026;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.calDayCell,
                      isSelected && styles.calDayCellSelected,
                      isToday && !isSelected && styles.calDayCellToday,
                    ]}
                    onPress={() => setSelectedDay(dayNum)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.calDayText,
                        isSelected && styles.calDayTextSelected,
                        isToday && !isSelected && styles.calDayTextToday,
                      ]}
                    >
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quick preset chips */}
            <View style={styles.calQuickChipsRow}>
              {[
                { label: 'Tomorrow', day: 3 },
                { label: '+3 Days', day: 5 },
                { label: '+1 Week', day: 9 },
                { label: '+2 Weeks', day: 16 },
              ].map((chip) => (
                <TouchableOpacity
                  key={chip.label}
                  style={[
                    styles.calQuickChip,
                    selectedDay === chip.day && styles.calQuickChipActive,
                  ]}
                  onPress={() => {
                    setSelectedDay(chip.day);
                    setCalMonthIndex(9);
                    setCalYear(2026);
                  }}
                >
                  <Text
                    style={[
                      styles.calQuickChipText,
                      selectedDay === chip.day && styles.calQuickChipTextActive,
                    ]}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm & Cancel Buttons */}
            <View style={styles.calActionRow}>
              <TouchableOpacity
                style={styles.calCancelBtn}
                onPress={() => setShowCalendarModal(false)}
              >
                <Text style={styles.calCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calConfirmBtn}
                onPress={handleConfirmCalendarDate}
                activeOpacity={0.88}
              >
                <Text style={styles.calConfirmBtnText}>Select Date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071E42',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  headerPhoneBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Patient Banner Card */
  patientBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#071E42',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  patientAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  patientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  serviceMeta: {
    fontSize: 12.5,
    color: '#7FE3D4',
    marginTop: 2,
  },
  patientCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#00B894',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    marginTop: 7,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  patientCallBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  statusPill: {
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    borderWidth: 1,
    borderColor: '#00B894',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00B894',
  },

  /* Stepper Timeline Card */
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  stepIconColumn: {
    alignItems: 'center',
    width: 32,
    marginRight: 14,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepCircleDone: {
    backgroundColor: '#00B894',
  },
  stepCircleNavy: {
    backgroundColor: '#071E42',
  },
  stepCirclePending: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  stepLineDone: {
    backgroundColor: '#00B894',
  },
  stepInfo: {
    flex: 1,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.2,
  },
  stepTime: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  stepSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  /* Destination Card */
  destCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  destPinWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#08317C',
  },
  destDistance: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  navigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  navigateBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#08317C',
  },

  /* -------------------------------------------------------------
     ARRIVAL & DOORSTEP VERIFICATION CARD STYLES
  ------------------------------------------------------------- */
  arrivalVerificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#00B894',
    marginBottom: 16,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  arrivalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  arrivalHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrivalHeaderBadgeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#08317C',
  },
  quickDemoLink: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quickDemoLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  arrivalCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  verifyItemBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  verifyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  verifyItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifyItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#08317C',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  fetchLocationBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.2,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fetchLocationBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#08317C',
  },
  verifiedLocationCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 10,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  gpsCoordsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  gpsAccuracyBadge: {
    fontSize: 10.5,
    backgroundColor: '#DCFCE7',
    color: '#166534',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  gpsAddressText: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 6,
  },
  gpsFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    paddingTop: 6,
  },
  gpsTimestampText: {
    fontSize: 11,
    color: '#64748B',
  },
  reFetchText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  uploadPhotoDashedBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#00B894',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
  },
  uploadPhotoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  uploadPhotoMainText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#08317C',
    marginBottom: 2,
  },
  uploadPhotoSubText: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
  },
  uploadedPhotoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 10,
  },
  uploadedPhotoThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  uploadedPhotoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  uploadedPhotoMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  uploadedPhotoLoc: {
    fontSize: 11,
    color: '#334155',
    marginTop: 1,
  },
  retakePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginLeft: 6,
  },
  retakePhotoText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#08317C',
  },

  /* Broadcast Banner */
  broadcastBanner: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 16,
  },
  broadcastText: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
  },
  broadcastHighlight: {
    fontWeight: '800',
    color: '#08317C',
  },

  /* Action Button Container */
  actionBtnContainer: {
    marginBottom: 12,
  },
  primaryActionButton: {
    backgroundColor: '#00B894',
    height: 52,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  /* -------------------------------------------------------------
     COMPLETION MODAL STYLES
  ------------------------------------------------------------- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 17, 39, 0.72)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#08317C',
  },
  modalPatient: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  conditionPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  condPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  condPillActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  condPillText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
  },
  condPillTextActive: {
    color: '#FFFFFF',
  },
  modalTextarea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#1E293B',
    height: 76,
    textAlignVertical: 'top',
    marginBottom: 14,
  },

  /* Follow-up Section */
  followupCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#BAE6FD',
    marginBottom: 16,
  },
  followupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  followupHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  followupSubheading: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  followupToggleBtn: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#CBD5E1',
    padding: 2,
    justifyContent: 'center',
  },
  followupToggleBtnActive: {
    backgroundColor: '#00B894',
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  followupDateContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0F2FE',
  },
  followupDateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 6,
  },
  calendarPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  calIconWrap: {
    marginRight: 10,
  },
  calendarDateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#08317C',
    flex: 1,
  },
  calendarPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  calendarPillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#08317C',
  },
  modalFinishBtn: {
    backgroundColor: '#00B894',
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFinishBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* -------------------------------------------------------------
     INTERACTIVE CALENDAR MODAL STYLES
  ------------------------------------------------------------- */
  calendarModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  calHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calNavArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMonthYearWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calMonthYearText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  calWeekText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calCellEmpty: {
    width: `${100 / 7}%`,
    height: 38,
  },
  calDayCell: {
    width: `${100 / 7}%`,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    marginVertical: 2,
  },
  calDayCellSelected: {
    backgroundColor: '#00B894',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  calDayCellToday: {
    borderWidth: 1.5,
    borderColor: '#0284C7',
  },
  calDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  calDayTextToday: {
    color: '#0284C7',
    fontWeight: '800',
  },
  calQuickChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 18,
    gap: 6,
  },
  calQuickChip: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  calQuickChipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  calQuickChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  calQuickChipTextActive: {
    color: '#0284C7',
  },
  calActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  calCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  calConfirmBtn: {
    flex: 1.6,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calConfirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* -------------------------------------------------------------
     CAMERA MODAL STYLES
  ------------------------------------------------------------- */
  cameraModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  cameraModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraModalDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  viewfinderFrame: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  viewfinderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  viewfinderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 12,
  },
  cornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#00B894',
  },
  cornerTR: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#00B894',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#00B894',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#00B894',
  },
  liveLocationWatermark: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 30, 66, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  watermarkText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  samplePhotoSelectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 14,
    marginBottom: 8,
  },
  samplePhotoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  samplePhotoThumbWrap: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    position: 'relative',
  },
  samplePhotoThumbWrapActive: {
    borderColor: '#00B894',
  },
  samplePhotoThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#00B894',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterActionBtn: {
    backgroundColor: '#00B894',
    height: 48,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  shutterActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
