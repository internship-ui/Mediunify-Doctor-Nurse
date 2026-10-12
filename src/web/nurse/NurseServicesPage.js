import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHomeNursing } from '../../homeNursing/context/HomeNursingContext';
import ResponseModal from '../components/ResponseModal';

// Detailed Address Database for Patient Assignments
const PATIENT_ADDRESS_DETAILS = {
  'NS-2041': {
    flatNo: 'Flat 402, 4th Floor',
    building: 'Green Glen Heights Apartments',
    street: '12th Main Road, 4th Cross',
    area: 'HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru, Karnataka',
    pincode: '560038',
    landmark: 'Opposite BDA Complex, Near Metro Pillar #124',
    gateCode: 'Door entry code: #0402 (Intercom: 402)',
    resident: 'Priya Sharma (Patient)',
    fullAddress: 'Flat 402, 4th Floor, Green Glen Heights Apartments, 12th Main Road, 4th Cross, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038',
  },
  'NS-2042': {
    flatNo: 'House #78, Ground Floor',
    building: 'Menon Villa',
    street: '17th Cross, 5th Main Road',
    area: 'Sector 2, HSR Layout',
    city: 'Bengaluru, Karnataka',
    pincode: '560102',
    landmark: 'Near BDA Children Park, Behind Cafe Coffee Day',
    gateCode: 'Direct ground floor doorbell at black gate',
    resident: 'Anil Menon (Patient)',
    fullAddress: 'House #78, Ground Floor, Menon Villa, 17th Cross, 5th Main Road, Sector 2, HSR Layout, Bengaluru, Karnataka - 560102',
  },
  'NS-2039': {
    flatNo: 'Villa 12, Block B',
    building: 'Palm Grove Gated Enclave',
    street: '80 Feet Road, 5th Block',
    area: 'Koramangala',
    city: 'Bengaluru, Karnataka',
    pincode: '560034',
    landmark: 'Near Sony World Signal, Next to Wipro Park',
    gateCode: 'Visitor pass at Security Gate 1 (Code: #12B)',
    resident: 'Rekha P. (Patient)',
    fullAddress: 'Villa 12, Block B, Palm Grove Gated Enclave, 80 Feet Road, 5th Block, Koramangala, Bengaluru, Karnataka - 560034',
  },
  'NS-2038': {
    flatNo: '#304, 3rd Floor',
    building: 'Devraj Enclave',
    street: '16th Main, 7th Cross',
    area: 'BTM 2nd Stage',
    city: 'Bengaluru, Karnataka',
    pincode: '560076',
    landmark: 'Near Udupi Garden Signal',
    gateCode: 'Lift code: 304',
    resident: 'Devraj Urs (Patient)',
    fullAddress: '#304, 3rd Floor, Devraj Enclave, 16th Main, 7th Cross, BTM 2nd Stage, Bengaluru, Karnataka - 560076',
  },
  'NS-2037': {
    flatNo: '#15, Ground Floor',
    building: 'Kamala Nivas',
    street: '4th Main, 6th Block',
    area: 'Koramangala',
    city: 'Bengaluru, Karnataka',
    pincode: '560095',
    landmark: 'Opposite Koramangala Club',
    gateCode: 'Ground floor main entrance',
    resident: 'Kamala Devi (Patient)',
    fullAddress: '#15, Ground Floor, Kamala Nivas, 4th Main, 6th Block, Koramangala, Bengaluru, Karnataka - 560095',
  },
};

const getPatientAddress = (item) => {
  if (item && item.id && PATIENT_ADDRESS_DETAILS[item.id]) {
    return PATIENT_ADDRESS_DETAILS[item.id];
  }
  return {
    flatNo: 'Flat 402, 4th Floor',
    building: 'Green Glen Heights Apartments',
    street: item.location || '12th Main Road',
    area: item.locality || 'Indiranagar',
    city: 'Bengaluru, Karnataka',
    pincode: '560038',
    landmark: 'Near Metro Station / Landmark Point',
    gateCode: 'Door code #0402 (Intercom 402)',
    resident: item.patientName || 'Patient',
    fullAddress: `${item.location || '12th Main Road, Indiranagar'}, Bengaluru, Karnataka - 560038`,
  };
};

export default function NurseServicesPage({ setActiveTab }) {
  const {
    assignments,
    upcomingServices,
    completedHistory,
    currentStatus,
    acceptAssignment,
    markOnTheWay,
    recordArrival,
    markServiceStarted,
    markServiceCompleted,
  } = useHomeNursing();

  const [filterTab, setFilterTab] = useState('New assigned'); // 'New assigned' | 'Upcoming' | 'Current' | 'Completed'
  const [selectedServiceId, setSelectedServiceId] = useState('NS-2041');

  // Modals
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [arrivalProofModal, setArrivalProofModal] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);

  // Response Screen Popup with OK button
  const [responseModal, setResponseModal] = useState({
    visible: false,
    title: '',
    message: '',
    details: null,
    type: 'success',
  });

  const showResponse = (title, message, details = null, type = 'success') => {
    setResponseModal({
      visible: true,
      title,
      message,
      details,
      type,
    });
  };

  // Completion Form State
  const [vitals, setVitals] = useState({
    bp: '120/80',
    pulse: '74',
    spo2: '98',
    temp: '98.4',
    glucose: '105',
  });
  const [completionNotes, setCompletionNotes] = useState(
    'Wound cleaned with sterile saline and Betadine antiseptic. Sterile non-adherent dressing applied. Patient tolerated procedure well with no bleeding.'
  );
  const [selectedConsumables, setSelectedConsumables] = useState([
    'Sterile Gauze Pads (x2)',
    'Betadine Antiseptic Solution',
    'Micropore Adhesive Tape',
    'Nitrile Gloves',
  ]);
  const [followupNeeded, setFollowupNeeded] = useState(true);
  const [followupDate, setFollowupDate] = useState('Tomorrow, 4:00 PM');

  // Available consumables to pick
  const ALL_CONSUMABLES = [
    'Sterile Gauze Pads (x2)',
    'Betadine Antiseptic Solution',
    'Micropore Adhesive Tape',
    'Nitrile Gloves',
    'Normal Saline 100ml',
    'Syringe 5ml & Needle',
    'Alcohol Swabs',
    'Crepe Bandage',
  ];

  // Quick notes tags
  const QUICK_TAGS = [
    'Wound dressing sterile & clean',
    'Vitals recorded within normal limits',
    'Injection administered with zero adverse reaction',
    'Patient instructed on wound hygiene',
    'Follow-up dressing recommended in 48 hrs',
  ];

  // Combine or select active items
  const newAssignedList = assignments.filter(
    (a) => a.status === 'Assigned' || a.status === 'Accepted'
  );
  const currentList = assignments.filter(
    (a) => a.status === 'On the way' || a.status === 'In progress'
  );

  let displayedList = [];
  if (filterTab === 'New assigned') displayedList = newAssignedList.length > 0 ? newAssignedList : assignments;
  else if (filterTab === 'Upcoming') displayedList = upcomingServices;
  else if (filterTab === 'Current') displayedList = currentList;
  else if (filterTab === 'Completed') displayedList = completedHistory;

  // Selected item
  const allKnownItems = [...assignments, ...upcomingServices, ...completedHistory];
  const selectedItem =
    allKnownItems.find((i) => i.id === selectedServiceId) ||
    assignments[0] ||
    upcomingServices[0] ||
    completedHistory[0] ||
    {};

  const patientAddress = getPatientAddress(selectedItem);

  // Helper status step number
  const getStepNumber = (status) => {
    switch (status) {
      case 'Assigned':
        return 1;
      case 'Accepted':
        return 2;
      case 'On the way':
        return 3;
      case 'In progress':
      case 'Started':
        return 4;
      case 'Completed':
        return 5;
      default:
        return 1;
    }
  };

  const currentStep = getStepNumber(selectedItem.status);

  // Status Handlers with Response Screen Popups with OK
  const handleAccept = (id) => {
    acceptAssignment(id);
    showResponse(
      'Assignment Accepted',
      `You have successfully accepted the home nursing visit for ${selectedItem.patientName}.`,
      [
        `Assignment ID: ${id}`,
        `Service: ${selectedItem.service || selectedItem.serviceName || 'Home Visit'}`,
        `Patient Address: ${patientAddress.fullAddress}`,
        `Scheduled: ${selectedItem.dateTime || selectedItem.timeLabel || 'Today 4:00 PM'}`,
        'Patient and MediUnify administration have been notified.',
      ],
      'success'
    );
  };

  const handleStartTravel = (id) => {
    markOnTheWay(id);
    showResponse(
      'Status Updated: On the Way',
      `Live GPS tracking has started. The patient can view your travel route and arrival time in real-time.`,
      [
        `Destination: ${patientAddress.fullAddress}`,
        `Distance & ETA: ${selectedItem.distance || '3.2 km'} (${selectedItem.eta || 'about 14 min'})`,
        `Door Entry Code: ${patientAddress.gateCode}`,
      ],
      'info'
    );
  };

  const handleVerifyArrival = (id) => {
    recordArrival(id, {
      location: patientAddress.fullAddress,
      photo: 'doorstep_verified.jpg',
    });
    setArrivalProofModal(false);
    showResponse(
      'Doorstep Arrival Verified',
      `GPS coordinates locked and doorstep arrival proof verified at ${patientAddress.building}.`,
      [
        'GPS Coordinates: 12.9716° N, 77.5946° E',
        'Accuracy: ±3m (Doorstep Locked)',
        `Address: ${patientAddress.fullAddress}`,
        'Timestamp recorded in MediUnify clinical audit.',
      ],
      'success'
    );
  };

  const handleStartService = (id) => {
    markServiceStarted(id);
    showResponse(
      'Service Started',
      `Home nursing care session for ${selectedItem.patientName} has officially started at their address.`,
      [
        `Procedure: ${selectedItem.service || selectedItem.serviceName || 'Nursing Care'}`,
        `Patient: ${selectedItem.patientName}`,
        'Clinical procedure timer has been initiated.',
      ],
      'info'
    );
  };

  const handleCompleteSubmit = () => {
    const vitalsSummary = `BP: ${vitals.bp} mmHg | Pulse: ${vitals.pulse} bpm | SpO2: ${vitals.spo2}% | Temp: ${vitals.temp}°F | Glucose: ${vitals.glucose} mg/dL`;
    const fullNotes = `${completionNotes}\n\nVitals: ${vitalsSummary}\nConsumables Used: ${selectedConsumables.join(', ')}`;

    markServiceCompleted(selectedItem.id, fullNotes, {
      followupRequired: followupNeeded,
      followupDate: followupNeeded ? followupDate : null,
      vitals,
      consumables: selectedConsumables,
      patientAddress: patientAddress.fullAddress,
    });

    setCompletionModalVisible(false);
    showResponse(
      'Service Completed Successfully',
      `Home nursing visit for ${selectedItem.patientName} has been saved to the permanent medical archives.`,
      [
        `Procedure: ${selectedItem.service || selectedItem.serviceName || 'Nursing Care'}`,
        `Patient: ${selectedItem.patientName}`,
        `Vitals: BP ${vitals.bp}, Pulse ${vitals.pulse} bpm, SpO2 ${vitals.spo2}%`,
        `Consumables Used: ${selectedConsumables.join(', ')}`,
        followupNeeded ? `Follow-up: Scheduled for ${followupDate}` : 'Follow-up: None required',
        'Nurse Availability: Automatically restored to AVAILABLE',
      ],
      'success'
    );
  };

  const handleCopyAddress = () => {
    showResponse(
      'Address Copied to Clipboard',
      `The patient's complete address and entrance instructions have been copied.`,
      [
        `Patient: ${selectedItem.patientName}`,
        `Building: ${patientAddress.building}`,
        `Full Address: ${patientAddress.fullAddress}`,
        `Landmark: ${patientAddress.landmark}`,
        `Access Code: ${patientAddress.gateCode}`,
      ],
      'info'
    );
  };

  const toggleConsumable = (item) => {
    if (selectedConsumables.includes(item)) {
      setSelectedConsumables(selectedConsumables.filter((c) => c !== item));
    } else {
      setSelectedConsumables([...selectedConsumables, item]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Page Title & Subtitle */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Services</Text>
          <Text style={styles.pageSubtitle}>Your assigned home nursing services</Text>
        </View>
      </View>

      {/* Filter Tabs Row */}
      <View style={styles.filterPillsRow}>
        {[
          { id: 'New assigned', label: 'New assigned', count: newAssignedList.length },
          { id: 'Upcoming', label: 'Upcoming', count: upcomingServices.length },
          { id: 'Current', label: 'Current', count: currentList.length },
          { id: 'Completed', label: 'Completed', count: completedHistory.length },
        ].map((tab) => {
          const isActive = filterTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => setFilterTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                {tab.label} {tab.count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Two Column Layout matching Screenshots */}
      <View style={styles.twoColLayout}>
        {/* Left Column: Assigned Service Cards */}
        <View style={styles.cardsCol}>
          {displayedList.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="folder-open-outline" size={32} color="#94A3B8" />
              <Text style={styles.emptyText}>No services in "{filterTab}" category</Text>
            </View>
          ) : (
            displayedList.map((item) => {
              const isSelected = item.id === selectedServiceId;
              const isCompletedItem = item.status === 'Completed';
              const isUpcomingItem = item.status === 'Upcoming';
              const itemAddr = getPatientAddress(item);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                  onPress={() => setSelectedServiceId(item.id)}
                  activeOpacity={0.88}
                >
                  <View style={styles.serviceCardContent}>
                    <View
                      style={[
                        styles.serviceIconCircle,
                        isSelected && styles.serviceIconCircleActive,
                      ]}
                    >
                      <Ionicons
                        name="medkit"
                        size={18}
                        color={isSelected ? '#FFFFFF' : '#081E3E'}
                      />
                    </View>

                    <View style={styles.serviceMetaCol}>
                      <Text style={styles.serviceTitle}>
                        {item.service || item.serviceName}
                      </Text>
                      <Text style={styles.patientLocSub} numberOfLines={1}>
                        {item.patientName} · {itemAddr.building}
                      </Text>
                      <Text style={styles.patientAreaSub} numberOfLines={1}>
                        📍 {itemAddr.area}
                      </Text>
                    </View>

                    <View style={styles.timingStatusCol}>
                      <Text style={styles.timingText}>
                        {item.dateTime || item.timeLabel || item.timing || 'Today 4:00 PM'}
                      </Text>
                      <View
                        style={[
                          styles.statusPillBadge,
                          isCompletedItem
                            ? styles.badgeCompleted
                            : isUpcomingItem
                            ? styles.badgeUpcoming
                            : item.status === 'Accepted'
                            ? styles.badgeAccepted
                            : styles.badgeAssigned,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusPillBadgeText,
                            isCompletedItem
                              ? styles.badgeTextCompleted
                              : isUpcomingItem
                              ? styles.badgeTextUpcoming
                              : item.status === 'Accepted'
                              ? styles.badgeTextAccepted
                              : styles.badgeTextAssigned,
                          ]}
                        >
                          {item.status || 'Assigned'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Right Column: Service Detail Panel with PROPER PATIENT ADDRESS */}
        <View style={styles.sidebarCol}>
          <View style={styles.detailCard}>
            {/* Compact Header: Assignment ID & Status */}
            <View style={styles.detailHeaderCompact}>
              <View>
                <View style={styles.idStatusRow}>
                  <Text style={styles.assignmentIdText}>{selectedItem.id || 'NS-2041'}</Text>
                  <View
                    style={[
                      styles.statusPillBadge,
                      selectedItem.status === 'Completed'
                        ? styles.badgeCompleted
                        : selectedItem.status === 'Accepted'
                        ? styles.badgeAccepted
                        : styles.badgeAssigned,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillBadgeText,
                        selectedItem.status === 'Completed'
                          ? styles.badgeTextCompleted
                          : selectedItem.status === 'Accepted'
                          ? styles.badgeTextAccepted
                          : styles.badgeTextAssigned,
                      ]}
                    >
                      {selectedItem.status || 'Assigned'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.assignedByText}>
                  Assigned by admin · {selectedItem.assignedAgo || 'today 3:34 PM'}
                </Text>
              </View>
            </View>

            {/* FLOW LINE 1 TO 2 CONTAINER (Zero Gap, All in One Screen) */}
            <View style={styles.flowLineContainer}>
              {/* FLOW STEP 1: PATIENT DETAILS & ADDRESS */}
              <View style={styles.flowNode}>
                {/* Step Marker & Header */}
                <View style={styles.flowStepHeader}>
                  <View style={styles.flowStepBadge}>
                    <Text style={styles.flowStepBadgeText}>1</Text>
                  </View>
                  <Text style={styles.flowStepTitle}>Patient & Doorstep Address</Text>
                  
                  <View style={styles.flowHeaderActions}>
                    <TouchableOpacity
                      style={styles.compactCallBtn}
                      onPress={() => setCallModalVisible(true)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="call" size={12} color="#081E3E" />
                      <Text style={styles.compactCallBtnText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.compactCopyBtn}
                      onPress={handleCopyAddress}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="copy-outline" size={12} color="#00B894" />
                      <Text style={styles.compactCopyBtnText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Step 1 Content Box */}
                <View style={styles.flowStepContentCard}>
                  {/* Patient Row */}
                  <View style={styles.flowPatientRow}>
                    <View style={styles.flowAvatarMini}>
                      <Text style={styles.flowAvatarMiniText}>
                        {selectedItem.patientName
                          ? selectedItem.patientName.slice(0, 2).toUpperCase()
                          : 'PS'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.flowPatientName}>
                        {selectedItem.patientName || 'Priya Sharma'}
                      </Text>
                      <Text style={styles.flowPatientMeta}>
                        {selectedItem.patientAge || '28'} yrs · {selectedItem.patientGender || 'Female'} · {selectedItem.patientPhone || '+91 98860 12345'}
                      </Text>
                    </View>
                  </View>

                  {/* Compact Address Line */}
                  <View style={styles.flowAddressLine}>
                    <Ionicons name="location" size={14} color="#00B894" style={{ marginTop: 2 }} />
                    <View style={{ flex: 1, gap: 1 }}>
                      <Text style={styles.flowAddressMainText}>
                        <Text style={{ fontWeight: '800' }}>{patientAddress.flatNo}, {patientAddress.building}</Text> — {patientAddress.street}, {patientAddress.area}, {patientAddress.city} ({patientAddress.pincode})
                      </Text>
                      <Text style={styles.flowAddressSubText}>
                        <Text style={{ fontWeight: '700', color: '#0284C7' }}>Landmark: </Text>{patientAddress.landmark} · <Text style={{ fontWeight: '700', color: '#047857' }}>Entry: </Text>{patientAddress.gateCode}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* VERTICAL FLOW CONNECTOR LINE */}
              <View style={styles.flowConnectorLine} />

              {/* FLOW STEP 2: SERVICE & INSTRUCTIONS */}
              <View style={styles.flowNode}>
                {/* Step Marker & Header */}
                <View style={styles.flowStepHeader}>
                  <View style={styles.flowStepBadge}>
                    <Text style={styles.flowStepBadgeText}>2</Text>
                  </View>
                  <Text style={styles.flowStepTitle}>Required Service & Instructions</Text>

                  <View style={styles.distanceBadge}>
                    <Ionicons name="navigate" size={11} color="#0284C7" />
                    <Text style={styles.distanceBadgeText}>{selectedItem.distance || '3.2 km'} ({selectedItem.eta || '14 min'})</Text>
                  </View>
                </View>

                {/* Step 2 Content Box */}
                <View style={styles.flowStepContentCard}>
                  {/* Service & Time Row */}
                  <View style={styles.flowServiceInfoRow}>
                    <View style={styles.serviceTag}>
                      <Ionicons name="medkit" size={13} color="#00B894" />
                      <Text style={styles.serviceTagText}>
                        {selectedItem.service || selectedItem.serviceName || 'Wound dressing'}
                      </Text>
                    </View>

                    <View style={styles.timeTag}>
                      <Ionicons name="time-outline" size={13} color="#64748B" />
                      <Text style={styles.timeTagText}>
                        {selectedItem.dateTime || selectedItem.timeLabel || 'Today, 4:00 PM'} ({selectedItem.duration || '40 min'})
                      </Text>
                    </View>
                  </View>

                  {/* Clinical Instructions */}
                  <View style={styles.flowInstructionsBox}>
                    <Text style={styles.flowInstructionsText}>
                      <Text style={{ fontWeight: '800', color: '#065F46' }}>Clinical Note: </Text>
                      {selectedItem.instructions ||
                        'Dressing change on left forearm. Carry sterile kit and antiseptic solution.'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* VERTICAL FLOW CONNECTOR LINE */}
              <View style={styles.flowConnectorLine} />

              {/* FLOW STEP 3: ACCEPTED ASSIGNMENT BUTTON (Directly Visible in One Screen) */}
              <View style={styles.flowNode}>
                <View style={styles.flowStepHeader}>
                  <View style={[styles.flowStepBadge, { backgroundColor: '#00B894' }]}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                  <Text style={styles.flowStepTitle}>Immediate Action</Text>
                </View>

                <View style={styles.actionContainerImmediate}>
                  {selectedItem.status === 'Assigned' && (
                    <TouchableOpacity
                      style={styles.primaryActionButton}
                      onPress={() => handleAccept(selectedItem.id)}
                      activeOpacity={0.88}
                    >
                      <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>Accept assignment</Text>
                    </TouchableOpacity>
                  )}

                  {selectedItem.status === 'Accepted' && (
                    <View style={styles.dualActionRow}>
                      <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={handleCopyAddress}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="navigate-outline" size={15} color="#081E3E" />
                        <Text style={styles.secondaryBtnText}>Copy Address</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.primaryActionButton, { flex: 1 }]}
                        onPress={() => handleStartTravel(selectedItem.id)}
                        activeOpacity={0.88}
                      >
                        <Ionicons name="car-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.primaryActionText}>Mark on the way</Text>
                      </TouchableOpacity>
                    </View>
                  )}

              {selectedItem.status === 'On the way' && (
                <View style={styles.statusOnWayStack}>
                  <View style={styles.arrivalLockCard}>
                    <View style={styles.arrivalLockRow}>
                      <Ionicons name="radio-outline" size={18} color="#00B894" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.arrivalLockTitle}>Doorstep GPS Lock Verified</Text>
                        <Text style={styles.arrivalLockCoords}>
                          12.9716° N, 77.5946° E · Accuracy ±3m (Locked at {patientAddress.building})
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.proofBtn}
                        onPress={() => setArrivalProofModal(true)}
                      >
                        <Ionicons name="camera-outline" size={14} color="#081E3E" />
                        <Text style={styles.proofBtnText}>Doorstep Proof</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.primaryActionButton}
                    onPress={() => handleStartService(selectedItem.id)}
                    activeOpacity={0.88}
                  >
                    <Ionicons name="play-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.primaryActionText}>Mark service started</Text>
                  </TouchableOpacity>
                </View>
              )}

              {(selectedItem.status === 'In progress' || selectedItem.status === 'Started') && (
                <View style={styles.statusOnWayStack}>
                  <View style={styles.activeTimerBanner}>
                    <Ionicons name="time-outline" size={18} color="#8B5CF6" />
                    <Text style={styles.activeTimerText}>
                      Clinical Care In Progress at Patient Address
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryActionButton, { backgroundColor: '#00B894' }]}
                    onPress={() => setCompletionModalVisible(true)}
                    activeOpacity={0.88}
                  >
                    <Ionicons name="checkbox-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.primaryActionText}>Complete service & record vitals</Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedItem.status === 'Completed' && (
                <View style={styles.completedNoticeCard}>
                  <Ionicons name="checkmark-done-circle" size={24} color="#00B894" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.completedNoticeTitle}>
                      Home nursing visit completed smoothly
                    </Text>
                    <Text style={styles.completedNoticeSub}>
                      All clinical vitals, dressing notes and doorstep logs stored in archive.
                    </Text>
                  </View>
                </View>
              )}
                </View>
              </View>
            </View>

            <Text style={styles.locationFooterNote}>
              Marking On the way starts live location sharing. Admin and patient receive automatic status notifications.
            </Text>
          </View>
        </View>
      </View>

      {/* MODAL 1: Contact Patient Modal */}
      <Modal visible={callModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Patient</Text>
              <TouchableOpacity onPress={() => setCallModalVisible(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.callPatientDetail}>
              <View style={styles.callAvatar}>
                <Text style={styles.callAvatarText}>
                  {selectedItem.patientName ? selectedItem.patientName.slice(0, 2).toUpperCase() : 'PS'}
                </Text>
              </View>
              <Text style={styles.callName}>{selectedItem.patientName || 'Priya Sharma'}</Text>
              <Text style={styles.callPhone}>{selectedItem.patientPhone || '+91 98860 12345'}</Text>
              <Text style={styles.callAddress}>{patientAddress.fullAddress}</Text>
            </View>

            <View style={styles.callActionsRow}>
              <TouchableOpacity
                style={styles.phoneDialBtn}
                onPress={() => {
                  setCallModalVisible(false);
                  showResponse(
                    'Phone Dialer Connected',
                    `Dialing patient phone number: ${selectedItem.patientPhone || '+91 98860 12345'}.`,
                    [`Contact: ${selectedItem.patientName}`, `Address: ${patientAddress.building}`],
                    'info'
                  );
                }}
              >
                <Ionicons name="call" size={16} color="#FFFFFF" />
                <Text style={styles.btnTextWhite}>Call via Phone</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.whatsappBtn}
                onPress={() => {
                  setCallModalVisible(false);
                  showResponse(
                    'WhatsApp Connected',
                    `Opening WhatsApp chat with patient ${selectedItem.patientName}.`,
                    [`Number: ${selectedItem.patientPhone || '+91 98860 12345'}`],
                    'info'
                  );
                }}
              >
                <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
                <Text style={styles.btnTextWhite}>WhatsApp Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Doorstep Arrival Verification Proof Modal */}
      <Modal visible={arrivalProofModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Doorstep Arrival Verification</Text>
              <TouchableOpacity onPress={() => setArrivalProofModal(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.gpsVerificationBox}>
              <Ionicons name="shield-checkmark" size={32} color="#00B894" />
              <Text style={styles.gpsBoxTitle}>GPS Coordinates Verified</Text>
              <Text style={styles.gpsBoxSub}>12.9716° N, 77.5946° E · Accuracy ±3m</Text>
              <Text style={styles.gpsBoxAddress}>{patientAddress.fullAddress}</Text>
            </View>

            <View style={styles.photoProofBox}>
              <Ionicons name="image-outline" size={28} color="#081E3E" />
              <Text style={styles.photoProofLabel}>Apartment Door / Entrance Proof Captured</Text>
              <Text style={styles.photoProofSub}>Verified timestamp: Today, 3:52 PM</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => handleVerifyArrival(selectedItem.id)}
            >
              <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Confirm Doorstep Arrival</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Clinical Completion & Vitals Recording Modal */}
      <Modal visible={completionModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxWidth: 650 }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Complete Nursing Service</Text>
                <Text style={styles.modalSub}>
                  Record clinical vitals, dressing documentation and used consumables
                </Text>
              </View>
              <TouchableOpacity onPress={() => setCompletionModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
              {/* Section 1: Patient Vitals */}
              <Text style={styles.sectionHeader}>1. Clinical Vitals Recorded</Text>
              <View style={styles.vitalsInputGrid}>
                <View style={styles.vitalInputBox}>
                  <Text style={styles.vitalInputLabel}>Blood Pressure (mmHg)</Text>
                  <TextInput
                    style={styles.vitalTextInput}
                    value={vitals.bp}
                    onChangeText={(v) => setVitals({ ...vitals, bp: v })}
                    placeholder="120/80"
                  />
                </View>
                <View style={styles.vitalInputBox}>
                  <Text style={styles.vitalInputLabel}>Pulse Rate (bpm)</Text>
                  <TextInput
                    style={styles.vitalTextInput}
                    value={vitals.pulse}
                    onChangeText={(v) => setVitals({ ...vitals, pulse: v })}
                    placeholder="72"
                  />
                </View>
                <View style={styles.vitalInputBox}>
                  <Text style={styles.vitalInputLabel}>Oxygen SpO2 (%)</Text>
                  <TextInput
                    style={styles.vitalTextInput}
                    value={vitals.spo2}
                    onChangeText={(v) => setVitals({ ...vitals, spo2: v })}
                    placeholder="98"
                  />
                </View>
                <View style={styles.vitalInputBox}>
                  <Text style={styles.vitalInputLabel}>Body Temp (°F)</Text>
                  <TextInput
                    style={styles.vitalTextInput}
                    value={vitals.temp}
                    onChangeText={(v) => setVitals({ ...vitals, temp: v })}
                    placeholder="98.6"
                  />
                </View>
                <View style={styles.vitalInputBox}>
                  <Text style={styles.vitalInputLabel}>Blood Glucose (mg/dL)</Text>
                  <TextInput
                    style={styles.vitalTextInput}
                    value={vitals.glucose}
                    onChangeText={(v) => setVitals({ ...vitals, glucose: v })}
                    placeholder="105"
                  />
                </View>
              </View>

              {/* Section 2: Clinical Treatment Notes */}
              <Text style={styles.sectionHeader}>2. Clinical Treatment & Wound Notes</Text>
              <View style={styles.quickTagsRow}>
                {QUICK_TAGS.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.quickTagBtn}
                    onPress={() => setCompletionNotes((prev) => `${prev} ${tag}.`)}
                  >
                    <Text style={styles.quickTagText}>+ {tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.notesTextArea}
                multiline
                numberOfLines={3}
                value={completionNotes}
                onChangeText={setCompletionNotes}
                placeholder="Enter detailed clinical observation..."
              />

              {/* Section 3: Consumables Checklist */}
              <Text style={styles.sectionHeader}>3. Consumables & Sterile Disposables Used</Text>
              <View style={styles.consumablesWrap}>
                {ALL_CONSUMABLES.map((item, idx) => {
                  const isChecked = selectedConsumables.includes(item);
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.consumableChip, isChecked && styles.consumableChipChecked]}
                      onPress={() => toggleConsumable(item)}
                    >
                      <Ionicons
                        name={isChecked ? 'checkbox' : 'square-outline'}
                        size={15}
                        color={isChecked ? '#00B894' : '#64748B'}
                      />
                      <Text style={[styles.consumableText, isChecked && styles.consumableTextChecked]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Section 4: Follow-up Requirement */}
              <View style={styles.followupCard}>
                <TouchableOpacity
                  style={styles.followupCheckRow}
                  onPress={() => setFollowupNeeded(!followupNeeded)}
                >
                  <Ionicons
                    name={followupNeeded ? 'checkbox' : 'square-outline'}
                    size={18}
                    color="#00B894"
                  />
                  <Text style={styles.followupLabel}>Next follow-up dressing visit recommended</Text>
                </TouchableOpacity>
                {followupNeeded && (
                  <TextInput
                    style={styles.followupDateInput}
                    value={followupDate}
                    onChangeText={setFollowupDate}
                    placeholder="e.g. Tomorrow, 4:00 PM"
                  />
                )}
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalFooterActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCompletionModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryActionButton, { flex: 1, backgroundColor: '#00B894' }]}
                onPress={handleCompleteSubmit}
              >
                <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Confirm & Complete Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reusable Response Screen Modal with OK button */}
      <ResponseModal
        visible={responseModal.visible}
        title={responseModal.title}
        message={responseModal.message}
        details={responseModal.details}
        type={responseModal.type}
        buttonText="OK"
        onOk={() => setResponseModal((prev) => ({ ...prev, visible: false }))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    padding: 24,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  twoColLayout: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
  },
  cardsCol: {
    width: 330,
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  serviceCardSelected: {
    borderColor: '#00B894',
    backgroundColor: '#FAFCFC',
  },
  serviceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIconCircleActive: {
    backgroundColor: '#081E3E',
  },
  serviceMetaCol: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },
  patientLocSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  patientAreaSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  timingStatusCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  statusPillBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeAssigned: {
    backgroundColor: '#E8F8F5',
  },
  badgeTextAssigned: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00B894',
  },
  badgeAccepted: {
    backgroundColor: '#E0F2FE',
  },
  badgeTextAccepted: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  badgeUpcoming: {
    backgroundColor: '#F1F5F9',
  },
  badgeTextUpcoming: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  badgeCompleted: {
    backgroundColor: '#F3E8FF',
  },
  badgeTextCompleted: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  sidebarCol: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  detailHeaderCompact: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  idStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assignmentIdText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
  },
  assignedByText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  flowLineContainer: {
    gap: 4,
  },
  flowNode: {
    gap: 4,
  },
  flowStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flowStepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowStepBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  flowStepTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
    flex: 1,
  },
  flowHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  compactCallBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  compactCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#E8F8F5',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.3)',
  },
  compactCopyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  flowStepContentCard: {
    marginLeft: 10,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: '#E2E8F0',
    paddingVertical: 4,
    gap: 6,
  },
  flowPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flowAvatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowAvatarMiniText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#081E3E',
  },
  flowPatientName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  flowPatientMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  flowAddressLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  flowAddressMainText: {
    fontSize: 11.5,
    color: '#081E3E',
    lineHeight: 16,
  },
  flowAddressSubText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  flowConnectorLine: {
    width: 2,
    height: 6,
    backgroundColor: '#CBD5E1',
    marginLeft: 19,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  distanceBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  flowServiceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.3)',
  },
  serviceTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B894',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeTagText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  flowInstructionsBox: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#00B894',
  },
  flowInstructionsText: {
    fontSize: 11,
    color: '#15803D',
    lineHeight: 15,
  },
  actionContainerImmediate: {
    marginLeft: 10,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: '#E2E8F0',
    paddingTop: 4,
  },
  progressContainer: {
    paddingVertical: 8,
    gap: 12,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    position: 'relative',
    marginHorizontal: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00B894',
    borderRadius: 2,
  },
  progressStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -16,
  },
  stepCol: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: '#00B894',
  },
  stepCircleCurrent: {
    backgroundColor: '#081E3E',
    borderWidth: 2,
    borderColor: '#00B894',
  },
  stepCircleNum: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  stepCircleNumCurrent: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#081E3E',
    fontWeight: '700',
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientInitials: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#081E3E',
  },
  patientMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  callPatientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  callPatientBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },

  /* PROPER PATIENT ADDRESS CARD STYLES */
  addressDossierCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  addressDossierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressDossierHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pinIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressDossierTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.2,
  },
  addressDossierSub: {
    fontSize: 11,
    color: '#64748B',
  },
  copyAddressBtn: {
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
  copyAddressBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  addressBreakdown: {
    gap: 6,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressLinePrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  houseNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  buildingNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },
  addressDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  addressLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    minWidth: 95,
  },
  addressValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  landmarkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  landmarkText: {
    fontSize: 11.5,
    color: '#0369A1',
    flex: 1,
  },
  doorCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  doorCodeText: {
    fontSize: 11.5,
    color: '#065F46',
    flex: 1,
  },

  infoTilesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoTile: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoTileLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  infoTileValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  instructionsBanner: {
    backgroundColor: '#E8F8F5',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00B894',
  },
  instructionsText: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  instructionsBold: {
    fontWeight: '800',
  },
  mapCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  mapHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  routePreviewLink: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  mapGraphic: {
    height: 120,
    backgroundColor: '#E9EEF5',
    padding: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  mapGridRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    marginBottom: 6,
  },
  mapBlock: {
    flex: 1,
    backgroundColor: '#DCE4F0',
    borderRadius: 4,
  },
  trailSvgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dottedTrail: {
    position: 'absolute',
    width: '70%',
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#081E3E',
    transform: [{ rotate: '-12deg' }],
  },
  startDot: {
    position: 'absolute',
    left: '20%',
    bottom: '30%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#081E3E',
  },
  destPinOuter: {
    position: 'absolute',
    right: '20%',
    top: '25%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destPinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00B894',
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  locationAddressText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  locationDistanceText: {
    fontSize: 11,
    color: '#64748B',
  },
  actionButtonsArea: {
    gap: 10,
  },
  primaryActionButton: {
    backgroundColor: '#081E3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  statusOnWayStack: {
    gap: 10,
  },
  arrivalLockCard: {
    backgroundColor: '#E8F8F5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.4)',
  },
  arrivalLockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arrivalLockTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  arrivalLockCoords: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 2,
  },
  proofBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  proofBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  activeTimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3E8FF',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  activeTimerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B21A8',
  },
  completedNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E8F8F5',
    padding: 14,
    borderRadius: 12,
  },
  completedNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
  },
  completedNoticeSub: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 2,
  },
  locationFooterNote: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  callPatientDetail: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  callAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  callAvatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#081E3E',
  },
  callName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
  },
  callPhone: {
    fontSize: 14,
    color: '#00B894',
    fontWeight: '700',
  },
  callAddress: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  callActionsRow: {
    gap: 10,
  },
  phoneDialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#081E3E',
    paddingVertical: 12,
    borderRadius: 10,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  gpsVerificationBox: {
    backgroundColor: '#E8F8F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  gpsBoxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  gpsBoxSub: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  gpsBoxAddress: {
    fontSize: 11,
    color: '#065F46',
    textAlign: 'center',
  },
  photoProofBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
  },
  photoProofLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  photoProofSub: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#081E3E',
    marginTop: 14,
    marginBottom: 8,
  },
  vitalsInputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vitalInputBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vitalInputLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: '600',
  },
  vitalTextInput: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
    padding: 0,
  },
  quickTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  quickTagBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  quickTagText: {
    fontSize: 10,
    color: '#081E3E',
    fontWeight: '600',
  },
  notesTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    color: '#081E3E',
    lineHeight: 18,
    textAlignVertical: 'top',
  },
  consumablesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  consumableChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  consumableChipChecked: {
    backgroundColor: '#E8F8F5',
    borderColor: '#00B894',
  },
  consumableText: {
    fontSize: 11,
    color: '#64748B',
  },
  consumableTextChecked: {
    color: '#047857',
    fontWeight: '700',
  },
  followupCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
    gap: 8,
  },
  followupCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  followupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  followupDateInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#081E3E',
  },
  modalFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
});
