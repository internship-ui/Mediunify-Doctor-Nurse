import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorDashboardPage({
  setActiveTab,
  onStartConsultation,
  onStartConsultNotes,
  onViewPatientDetails,
  onViewFollowUpPatient,
}) {
  // Dynamic screen measurement for responsive alignment on desktop site / phone
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth;
    return 1024;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const isNarrow = windowWidth < 1280;

  // Filters & State
  const [statsPeriod, setStatsPeriod] = useState('Week'); // 'Week' | 'Month' | 'Year'
  const [diagnosesOrder, setDiagnosesOrder] = useState('Descending');
  const [patientTrendPeriod, setPatientTrendPeriod] = useState('Week'); // 'Today' | 'Week' | 'Month'
  const [scheduleView, setScheduleView] = useState('Today'); // 'Today' | 'This week'
  const [scheduleChannelFilter, setScheduleChannelFilter] = useState('All'); // 'All' | 'In-Person' | 'Video'
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);

  // Attached Notification Popover State (Matching User Screenshot)
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [notifActiveTab, setNotifActiveTab] = useState('Inbox'); // 'Inbox' | 'General'
  const [unreadCount, setUnreadCount] = useState(4);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 'notif-1',
      name: 'Tom added new video',
      sub: '12 minutes ago • New post',
      initials: 'TM',
      avatarBg: '#FEE2E2',
      avatarColor: '#DC2626',
      unread: true,
      hasActions: false,
    },
    {
      id: 'notif-2',
      name: 'Tom left comments for you',
      sub: '27 minutes ago • New comment',
      initials: 'TL',
      avatarBg: '#E0E7FF',
      avatarColor: '#3730A3',
      unread: true,
      hasActions: false,
    },
    {
      id: 'notif-3',
      name: 'Anna has applied to create an ad for your campaign',
      sub: '2 hours ago • New request for campaign',
      initials: 'AN',
      avatarBg: '#DCFCE7',
      avatarColor: '#16A34A',
      unread: false,
      hasActions: true,
    },
    {
      id: 'notif-4',
      name: 'Jason attached the file',
      sub: '6 hours ago • Attached files',
      initials: 'JS',
      avatarBg: '#FEF3C7',
      avatarColor: '#D97706',
      unread: false,
      hasActions: false,
      attachment: 'Work examples.pdf',
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const handleAcceptNotification = (notif) => {
    setNotificationsList(prev => prev.filter(n => n.id !== notif.id));
    if (setActiveTab) setActiveTab('appointments');
    setShowNotificationPopover(false);
  };

  const handleDeclineNotification = (notif) => {
    setNotificationsList(prev => prev.filter(n => n.id !== notif.id));
  };

  // Statistics Data
  const statsData = {
    Week: { newPatients: 8, newDiff: '-2', totalPatients: 42, totalDiff: '+5', timeToAppt: '25 min', timeDiff: '-2%', pss: '2.96', pssDiff: '+1.4%' },
    Month: { newPatients: 36, newDiff: '+8', totalPatients: 168, totalDiff: '+24', timeToAppt: '22 min', timeDiff: '-5%', pss: '2.98', pssDiff: '+2.1%' },
    Year: { newPatients: 420, newDiff: '+45', totalPatients: 1840, totalDiff: '+310', timeToAppt: '19 min', timeDiff: '-8%', pss: '2.99', pssDiff: '+3.5%' },
  };

  const currentStats = statsData[statsPeriod] || statsData.Week;

  // Diagnoses Breakdown
  const diagnosesList = [
    { code: 'HTN', label: 'Hypertension', pct: 31, height: 140 },
    { code: 'Dyslipidemia', label: 'Dyslipidemia', pct: 23, height: 104 },
    { code: 'CAD/Angina', label: 'CAD / Angina', pct: 20, height: 90 },
    { code: 'Heart Failure', label: 'Heart Failure', pct: 17, height: 76 },
    { code: 'Arrhythmias', label: 'Arrhythmias', pct: 11, height: 50 },
    { code: 'Post-MI/PCI', label: 'Post-MI / PCI', pct: 9, height: 40 },
    { code: 'Other', label: 'Other', pct: 6, height: 26 },
  ];

  // Patients List (Bottom Center Card)
  const patientsListData = [
    { id: 'p1', name: 'Diane Cruz', gender: 'Female', age: 54, initials: 'DC', avatarBg: '#E0F2FE', avatarColor: '#0284C7', reason: 'Follow-up • Dyslipidemia', time: '09:30 AM', phone: '+91 98451 88201' },
    { id: 'p2', name: 'Roosevelt Chase', gender: 'Male', age: 35, initials: 'RC', avatarBg: '#E6F8F4', avatarColor: '#00B894', reason: 'Routine ECG Review', time: '03:00 PM', phone: '+91 97412 33419' },
    { id: 'p3', name: 'Jakub Tucker', gender: 'Male', age: 43, initials: 'JT', avatarBg: '#F1F5F9', avatarColor: '#475569', reason: 'Post-MI Rehabilitation', time: '10:15 AM', phone: '+91 98860 11984' },
    { id: 'p4', name: 'Tiffany Fowler', gender: 'Female', age: 38, initials: 'TF', avatarBg: '#FEE2E2', avatarColor: '#DC2626', reason: 'Arrhythmia Palpitations', time: '11:45 AM', phone: '+91 99014 55102' },
    { id: 'p5', name: 'Andre Merritt', gender: 'Male', age: 27, initials: 'AM', avatarBg: '#E6F8F4', avatarColor: '#00B894', reason: 'New Patient • Cardiac Consult', time: '11:00 AM', phone: '+91 98452 77013' },
  ];

  const filteredPatientsList = patientsListData.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dedicated Patient Consultations Schedule (Pure patient appointments only - no admin/team/surgeries)
  const scheduleConsultations = [
    {
      id: 'sc-1',
      appointmentId: 'apt-today-rohan',
      time: '10:30 AM',
      timeRange: '10:30 AM — 11:00 AM',
      name: 'Rohan Mehta',
      patient: 'Rohan Mehta',
      age: 34,
      gender: 'Male',
      initials: 'RM',
      avatarBg: '#E0F2FE',
      avatarColor: '#0284C7',
      type: 'Video',
      reason: 'Hypertension & BP Review',
      room: 'MediUnify Telehealth Video Room #1',
      status: 'Ready / Waiting',
      phone: '+91 98860 11234',
      bloodGroup: 'B+',
      allergies: 'None recorded',
      medications: 'Amlodipine 5mg',
      isNext: false,
    },
    {
      id: 'sc-2',
      appointmentId: 'apt-today-2',
      time: '11:00 AM',
      timeRange: '11:00 AM — 11:30 AM',
      name: 'Andre Merritt',
      patient: 'Andre Merritt',
      age: 27,
      gender: 'Male',
      initials: 'AM',
      avatarBg: '#E6F8F4',
      avatarColor: '#00B894',
      type: 'Video',
      reason: 'New Patient • Cardiac Consult',
      room: 'MediUnify Telehealth Video Room #2',
      status: 'Next in Queue',
      phone: '+91 98452 77013',
      bloodGroup: 'O+',
      allergies: 'Penicillin',
      medications: 'None recorded',
      isNext: true,
    },
    {
      id: 'sc-3',
      appointmentId: 'apt-today-meera',
      time: '11:30 AM',
      timeRange: '11:30 AM — 12:00 PM',
      name: 'Meera Nair',
      patient: 'Meera Nair',
      age: 48,
      gender: 'Female',
      initials: 'MN',
      avatarBg: '#FEF3C7',
      avatarColor: '#D97706',
      type: 'In-Person',
      reason: 'Chest Discomfort Review • Follow-up',
      room: 'Room 302, OPD Wing A',
      status: 'Waiting in Clinic',
      phone: '+91 98451 44521',
      bloodGroup: 'A+',
      allergies: 'Sulfa drugs',
      medications: 'Atorvastatin 10mg',
      isNext: false,
    },
    {
      id: 'sc-4',
      appointmentId: 'apt-today-jakub',
      time: '01:00 PM',
      timeRange: '01:00 PM — 01:30 PM',
      name: 'Jakub Tucker',
      patient: 'Jakub Tucker',
      age: 43,
      gender: 'Male',
      initials: 'JT',
      avatarBg: '#F1F5F9',
      avatarColor: '#475569',
      type: 'In-Person',
      reason: 'Post-MI Rehabilitation & ECG Check',
      room: 'Room 302, OPD Wing A',
      status: 'Confirmed',
      phone: '+91 98860 11984',
      bloodGroup: 'B+',
      allergies: 'None',
      medications: 'Metoprolol 25mg',
      isNext: false,
    },
    {
      id: 'sc-5',
      appointmentId: 'apt-today-1',
      time: '02:30 PM',
      timeRange: '02:30 PM — 03:00 PM',
      name: 'Priya Sharma',
      patient: 'Priya Sharma',
      age: 35,
      gender: 'Female',
      initials: 'PS',
      avatarBg: '#EDE9FE',
      avatarColor: '#7C3AED',
      type: 'In-Person',
      reason: 'Seasonal Allergy & Lipid Re-evaluation',
      room: 'Room 302, OPD Wing A',
      status: 'Confirmed',
      phone: '+91 98860 33412',
      bloodGroup: 'O+',
      allergies: 'None known',
      medications: 'None recorded',
      isNext: false,
    },
    {
      id: 'sc-6',
      appointmentId: 'apt-today-roosevelt',
      time: '03:00 PM',
      timeRange: '03:00 PM — 03:30 PM',
      name: 'Roosevelt Chase',
      patient: 'Roosevelt Chase',
      age: 35,
      gender: 'Male',
      initials: 'RC',
      avatarBg: '#E6F8F4',
      avatarColor: '#00B894',
      type: 'Video',
      reason: 'Routine ECG Review & Vitals Check',
      room: 'MediUnify Telehealth Video Room #1',
      status: 'Scheduled',
      phone: '+91 97412 33419',
      bloodGroup: 'AB+',
      allergies: 'Aspirin',
      medications: 'None recorded',
      isNext: false,
    },
  ];

  const inPersonCount = scheduleConsultations.filter(i => i.type === 'In-Person').length;
  const videoCount = scheduleConsultations.filter(i => i.type === 'Video').length;

  const filteredSchedule = scheduleConsultations.filter(item => {
    if (scheduleChannelFilter === 'All') return true;
    return item.type.toLowerCase() === scheduleChannelFilter.toLowerCase();
  });

  // Direct to right side slide page popup in appointments page
  const handleViewPatientDetails = (appointment) => {
    if (onViewPatientDetails) {
      onViewPatientDetails(appointment);
    } else if (setActiveTab) {
      setActiveTab('appointments');
    }
  };

  // Direct to join video call for video consultations
  const handleJoinCall = (appointment) => {
    if (onStartConsultation) {
      onStartConsultation(appointment);
    } else if (setActiveTab) {
      setActiveTab('consultation');
    }
  };

  // Direct to appointments page with particular patient details for in-person consultations
  const handleStartInPersonConsult = (appointment) => {
    handleViewPatientDetails(appointment);
  };

  const handleAppointmentClick = (appointment) => {
    handleViewPatientDetails(appointment);
  };

  // Direct to follow-up page for the selected patient
  const handleFollowUpPatientClick = (patient) => {
    if (onViewFollowUpPatient) {
      onViewFollowUpPatient(patient);
    } else if (setActiveTab) {
      setActiveTab('followups');
    }
  };

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* 1. TOP BAR: SEARCH PILL + NOTIFICATIONS + DOCTOR PROFILE CHIP */}
      {/* ============================================================== */}
      <View style={styles.topBar}>
        {/* Search Pill Input */}
        <View style={styles.searchPill}>
          <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients, diagnoses, appointments..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Right Actions: Email Button + Notification Bell + Doctor Profile */}
        <View style={styles.topRightGroup}>
          {/* Email Button -> Opens External Google Mail Compose with "to" tag */}
          <TouchableOpacity
            style={styles.topEmailButton}
            onPress={() => {
              if (typeof window !== 'undefined') {
                window.open('https://mail.google.com/mail/?view=cm&fs=1&to=', '_blank');
              }
            }}
            activeOpacity={0.7}
            title="Compose Email via Google Mail"
          >
            <Ionicons name="mail-outline" size={19} color="#081E3E" />
          </TouchableOpacity>

          {/* Notification Bell Button with Attached Popover */}
          <View style={{ position: 'relative', zIndex: 9999 }}>
            <TouchableOpacity
              style={[styles.bellButton, showNotificationPopover && styles.bellButtonActive]}
              onPress={() => {
                setShowNotificationPopover(prev => !prev);
                setShowProfileDropdown(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showNotificationPopover ? 'notifications' : 'notifications-outline'}
                size={20}
                color={showNotificationPopover ? '#0284C7' : '#081E3E'}
              />
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Notification Popover Dropdown Card (attached directly to notify button) */}
            {showNotificationPopover && (
              <View style={styles.notifPopoverCard}>
                {/* Header Row */}
                <View style={styles.notifHeaderRow}>
                  <Text style={styles.notifTitle}>Notifications</Text>
                  <TouchableOpacity onPress={handleMarkAllAsRead} activeOpacity={0.7}>
                    <Text style={styles.notifMarkAllText}>Mark all as read</Text>
                  </TouchableOpacity>
                </View>

                {/* Sub-tabs Row: Inbox [4] | General + Settings Gear */}
                <View style={styles.notifTabsRow}>
                  <View style={styles.notifTabsLeft}>
                    <TouchableOpacity
                      style={[styles.notifTabBtn, notifActiveTab === 'Inbox' && styles.notifTabBtnActive]}
                      onPress={() => setNotifActiveTab('Inbox')}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.notifTabText, notifActiveTab === 'Inbox' && styles.notifTabTextActive]}>
                        Inbox
                      </Text>
                      {unreadCount > 0 && (
                        <View style={styles.notifTabCountPill}>
                          <Text style={styles.notifTabCountText}>{unreadCount}</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.notifTabBtn, notifActiveTab === 'General' && styles.notifTabBtnActive]}
                      onPress={() => setNotifActiveTab('General')}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.notifTabText, notifActiveTab === 'General' && styles.notifTabTextActive]}>
                        General
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.notifSettingsBtn} activeOpacity={0.7}>
                    <Ionicons name="settings-outline" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Notifications List */}
                <ScrollView style={styles.notifListScroll} showsVerticalScrollIndicator={false}>
                  {notificationsList.map(notif => (
                    <View key={notif.id} style={styles.notifItemRow}>
                      {/* Avatar */}
                      <View style={[styles.notifAvatarBox, { backgroundColor: notif.avatarBg }]}>
                        <Text style={[styles.notifAvatarText, { color: notif.avatarColor }]}>
                          {notif.initials}
                        </Text>
                      </View>

                      {/* Content Column */}
                      <View style={styles.notifContentCol}>
                        <View style={styles.notifTextAndDotRow}>
                          <Text style={styles.notifItemName} numberOfLines={2}>
                            {notif.name}
                          </Text>
                          {notif.unread && <View style={styles.notifUnreadDot} />}
                        </View>
                        <Text style={styles.notifItemSub}>{notif.sub}</Text>

                        {/* Action Buttons for Anna (Decline / Accept) */}
                        {notif.hasActions && (
                          <View style={styles.notifActionButtonsRow}>
                            <TouchableOpacity
                              style={styles.notifDeclineBtn}
                              onPress={() => handleDeclineNotification(notif)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.notifDeclineBtnText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.notifAcceptBtn}
                              onPress={() => handleAcceptNotification(notif)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.notifAcceptBtnText}>Accept</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {/* Attachment pill for Jason (📎 Work examples.pdf) */}
                        {notif.attachment && (
                          <View style={styles.notifAttachmentPill}>
                            <Ionicons name="attach" size={14} color="#64748B" />
                            <Text style={styles.notifAttachmentText}>{notif.attachment}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* Footer preview row: small stacked avatars (+2) */}
                <View style={styles.notifFooterRow}>
                  <View style={styles.notifAvatarStack}>
                    <View style={[styles.notifMiniAvatar, { backgroundColor: '#FEE2E2', zIndex: 3 }]}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#DC2626' }}>TM</Text>
                    </View>
                    <View style={[styles.notifMiniAvatar, { backgroundColor: '#DCFCE7', marginLeft: -6, zIndex: 2 }]}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#16A34A' }}>AN</Text>
                    </View>
                    <View style={[styles.notifMiniAvatar, { backgroundColor: '#FEF3C7', marginLeft: -6, zIndex: 1 }]}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#D97706' }}>JS</Text>
                    </View>
                    <Text style={styles.notifAvatarMoreText}>+2</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Doctor Profile Pill with Dropdown */}
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              style={styles.doctorProfilePill}
              onPress={() => setShowProfileDropdown(!showProfileDropdown)}
              activeOpacity={0.8}
            >
              <View style={styles.doctorAvatarBox}>
                <Text style={styles.doctorAvatarInitials}>RA</Text>
              </View>
              <View style={styles.doctorMetaTextCol}>
                <Text style={styles.doctorNameText}>Dr. Robert Anderson</Text>
                <Text style={styles.doctorRoleText}>Cardiologist</Text>
              </View>
              <Ionicons name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <View style={styles.profileDropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowProfileDropdown(false);
                    if (setActiveTab) setActiveTab('profile');
                  }}
                >
                  <Ionicons name="person-outline" size={16} color="#081E3E" />
                  <Text style={styles.dropdownMenuText}>My Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowProfileDropdown(false);
                    if (setActiveTab) setActiveTab('availability');
                  }}
                >
                  <Ionicons name="time-outline" size={16} color="#081E3E" />
                  <Text style={styles.dropdownMenuText}>Availability</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dropdownMenuItem, { borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}
                  onPress={() => {
                    setShowProfileDropdown(false);
                    alert('Logged out from clinician dashboard.');
                  }}
                >
                  <Ionicons name="log-out-outline" size={16} color="#EF4444" />
                  <Text style={[styles.dropdownMenuText, { color: '#EF4444' }]}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 2. MAIN DASHBOARD CONTENT: TWO-COLUMN LAYOUT                   */}
      {/* ============================================================== */}
      <ScrollView
        style={styles.scrollViewport}
        contentContainerStyle={[styles.scrollContent, isNarrow && styles.scrollContentNarrow]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.dashboardGrid, isNarrow && styles.dashboardGridNarrow]}>
          {/* ========================================================== */}
          {/* LEFT / CENTER COLUMN                                       */}
          {/* ========================================================== */}
          <View style={[styles.leftColumn, isNarrow && styles.leftColumnNarrow]}>
            {/* -------------------------------------------------------- */}
            {/* CARD 1: STATISTICS                                      */}
            {/* -------------------------------------------------------- */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardMainHeading}>Statistics</Text>
                <View style={styles.periodPillGroup}>
                  {['Week', 'Month', 'Year'].map(period => (
                    <TouchableOpacity
                      key={period}
                      style={[
                        styles.periodBtn,
                        statsPeriod === period && styles.periodBtnActive,
                      ]}
                      onPress={() => setStatsPeriod(period)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.periodBtnText,
                          statsPeriod === period && styles.periodBtnTextActive,
                        ]}
                      >
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 4 Stat Metric Cards in Teal & Navy */}
              <View style={[styles.statCardsRow, isNarrow && styles.statCardsRowNarrow]}>
                {/* Metric 1: New patients (HIGHLIGHTED TEAL CARD) */}
                <View style={[styles.statBox, styles.statBoxTealHighlight, isNarrow && styles.statBoxNarrow]}>
                  <View style={styles.statBoxTopRow}>
                    <Text style={styles.statNumberTeal}>{currentStats.newPatients}</Text>
                    <View style={styles.pillBadgeTeal}>
                      <Ionicons name="arrow-down" size={11} color="#081E3E" />
                      <Text style={styles.pillBadgeTealText}>{currentStats.newDiff.replace('-', '')}</Text>
                    </View>
                  </View>
                  <Text style={styles.statLabelTeal} numberOfLines={1}>New patients</Text>
                </View>

                {/* Metric 2: Total patients */}
                <View style={[styles.statBox, isNarrow && styles.statBoxNarrow]}>
                  <View style={styles.statBoxTopRow}>
                    <Text style={styles.statNumberNavy}>{currentStats.totalPatients}</Text>
                    <View style={styles.pillBadgeGreen}>
                      <Ionicons name="arrow-up" size={11} color="#00B894" />
                      <Text style={styles.pillBadgeGreenText}>{currentStats.totalDiff.replace('+', '')}</Text>
                    </View>
                  </View>
                  <Text style={styles.statLabelMuted} numberOfLines={1}>Total patients</Text>
                </View>

                {/* Metric 3: Time to appt. */}
                <View style={[styles.statBox, isNarrow && styles.statBoxNarrow]}>
                  <View style={styles.statBoxTopRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                      <Text style={styles.statNumberNavy}>{currentStats.timeToAppt.split(' ')[0]}</Text>
                      <Text style={styles.statUnitNavy}>min</Text>
                    </View>
                    <View style={styles.pillBadgeGreen}>
                      <Ionicons name="arrow-down" size={11} color="#00B894" />
                      <Text style={styles.pillBadgeGreenText}>{currentStats.timeDiff.replace('-', '')}</Text>
                    </View>
                  </View>
                  <Text style={styles.statLabelMuted} numberOfLines={1}>Time to appt.</Text>
                </View>

                {/* Metric 4: PSS */}
                <View style={[styles.statBox, isNarrow && styles.statBoxNarrow]}>
                  <View style={styles.statBoxTopRow}>
                    <Text style={styles.statNumberNavy}>{currentStats.pss}</Text>
                    <View style={styles.pillBadgeTealLight}>
                      <Ionicons name="arrow-up" size={11} color="#0D9488" />
                      <Text style={styles.pillBadgeTealLightText}>{currentStats.pssDiff.replace('+', '')}</Text>
                    </View>
                  </View>
                  <View style={styles.pssLabelRow}>
                    <Text style={styles.statLabelMuted} numberOfLines={1}>PSS</Text>
                    <Ionicons name="information-circle-outline" size={13} color="#94A3B8" />
                  </View>
                </View>
              </View>
            </View>

            {/* -------------------------------------------------------- */}
            {/* CARD 2: NEXT APPOINTMENTS (LONG CARD BOX)               */}
            {/* -------------------------------------------------------- */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.cardMainHeading}>Next Appointments</Text>
                  <View style={styles.counterBadgeTeal}>
                    <Text style={styles.counterBadgeTealText}>{scheduleConsultations.length} Upcoming</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.viewAllApptsBtn}
                  onPress={() => {
                    if (setActiveTab) setActiveTab('appointments');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllApptsBtnText}>View All Appointments</Text>
                  <Ionicons name="arrow-forward" size={13} color="#00B894" />
                </TouchableOpacity>
              </View>

              {/* Long Card Box List of Next Appointments */}
              <View style={styles.nextApptsListWrap}>
                {scheduleConsultations.slice(0, 3).map((item, idx) => {
                  const isVideo = item.type === 'Video';
                  return (
                    <View key={item.id || idx} style={styles.nextApptLongRowCard}>
                      <View style={styles.nextApptInfoLeft}>
                        {/* Time & Channel Pill */}
                        <View style={[styles.nextApptTimePill, isVideo ? styles.nextApptTimePillVideo : styles.nextApptTimePillInPerson]}>
                          <Ionicons
                            name={isVideo ? 'videocam' : 'business'}
                            size={12}
                            color={isVideo ? '#0284C7' : '#0F766E'}
                          />
                          <Text style={[styles.nextApptTimePillText, { color: isVideo ? '#0284C7' : '#0F766E' }]}>
                            {item.time}
                          </Text>
                        </View>

                        {/* Patient Avatar */}
                        <View style={[styles.nextApptAvatarBox, { backgroundColor: item.avatarBg }]}>
                          <Text style={[styles.nextApptAvatarInitials, { color: item.avatarColor }]}>
                            {item.initials}
                          </Text>
                        </View>

                        {/* Patient Demographic & Reason */}
                        <View style={styles.nextApptMetaTextCol}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <Text style={styles.nextApptPatientName}>{item.name}</Text>
                            <Text style={styles.nextApptDemographics}>
                              {item.age} yrs · {item.gender} · 🩸 {item.bloodGroup}
                            </Text>
                          </View>
                          <Text style={styles.nextApptReasonText} numberOfLines={1}>
                            {item.reason}
                          </Text>
                        </View>
                      </View>

                      {/* Right Status Pill & Start Consult Action */}
                      <View style={styles.nextApptActionsRight}>
                        <View
                          style={[
                            styles.nextApptStatusBadge,
                            item.isNext ? styles.nextApptStatusBadgeNext : styles.nextApptStatusBadgeReady,
                          ]}
                        >
                          <View
                            style={[
                              styles.nextApptStatusDot,
                              { backgroundColor: item.isNext ? '#00B894' : '#64748B' },
                            ]}
                          />
                          <Text
                            style={[
                              styles.nextApptStatusBadgeText,
                              { color: item.isNext ? '#00876A' : '#475569' },
                            ]}
                          >
                            {item.status}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.nextApptStartConsultBtn}
                          onPress={() => handleStartInPersonConsult(item)}
                          activeOpacity={0.85}
                        >
                          <Ionicons
                            name={isVideo ? 'videocam' : 'pulse'}
                            size={14}
                            color="#FFFFFF"
                          />
                          <Text style={styles.nextApptStartConsultBtnText}>Start Consult</Text>
                          <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* -------------------------------------------------------- */}
            {/* CARD 3 & 4: NEW PATIENTS TREND CHART & PATIENTS LIST     */}
            {/* -------------------------------------------------------- */}
            <View style={[styles.bottomSplitRow, isNarrow && styles.bottomSplitRowNarrow]}>
              {/* Left Sub-card: New Patients Trend Chart */}
              <View style={[styles.cardContainer, styles.subCardHalf]}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.cardSubHeading}>New patients</Text>
                    <View style={styles.counterBadge}>
                      <Text style={styles.counterBadgeText}>8</Text>
                    </View>
                  </View>

                  <View style={styles.periodPillGroupSmall}>
                    {['Today', 'Week', 'Month'].map(p => (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.periodBtnSmall,
                          patientTrendPeriod === p && styles.periodBtnSmallActive,
                        ]}
                        onPress={() => setPatientTrendPeriod(p)}
                      >
                        <Text
                          style={[
                            styles.periodBtnSmallText,
                            patientTrendPeriod === p && styles.periodBtnSmallTextActive,
                          ]}
                        >
                          {p}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Simulated Visual Area Trend Chart with Teal & Navy curves */}
                <View style={styles.chartVisualWrapper}>
                  {/* Grid Lines */}
                  <View style={styles.chartGridLine}>
                    <Text style={styles.chartAxisNum}>10</Text>
                    <View style={styles.gridDashed} />
                  </View>
                  <View style={styles.chartGridLine}>
                    <Text style={styles.chartAxisNum}>8</Text>
                    <View style={styles.gridDashed} />
                  </View>
                  <View style={styles.chartGridLine}>
                    <Text style={styles.chartAxisNum}>6</Text>
                    <View style={styles.gridDashed} />
                  </View>
                  <View style={styles.chartGridLine}>
                    <Text style={styles.chartAxisNum}>4</Text>
                    <View style={styles.gridDashed} />
                  </View>
                  <View style={styles.chartGridLine}>
                    <Text style={styles.chartAxisNum}>2</Text>
                    <View style={styles.gridDashed} />
                  </View>

                  {/* SVG Canvas on Web */}
                  {Platform.OS === 'web' && (
                    <svg
                      style={{
                        position: 'absolute',
                        left: 24,
                        right: 8,
                        top: 8,
                        bottom: 24,
                        width: 'calc(100% - 32px)',
                        height: '110px',
                        overflow: 'visible',
                      }}
                      viewBox="0 0 320 110"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="tealAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00B894" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#00B894" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="navyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#081E3E" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#081E3E" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Male Curve Area Fill (Teal) */}
                      <path
                        d="M 10 90 Q 55 60 95 65 T 180 85 T 260 40 T 310 55 L 310 110 L 10 110 Z"
                        fill="url(#tealAreaGrad)"
                      />
                      {/* Male Line (Teal) */}
                      <path
                        d="M 10 90 Q 55 60 95 65 T 180 85 T 260 40 T 310 55"
                        fill="none"
                        stroke="#00B894"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Female Curve Area Fill (Navy / Cyan) */}
                      <path
                        d="M 10 95 Q 60 75 105 50 T 190 70 T 270 50 T 310 70 L 310 110 L 10 110 Z"
                        fill="url(#navyAreaGrad)"
                      />
                      {/* Female Line */}
                      <path
                        d="M 10 95 Q 60 75 105 50 T 190 70 T 270 50 T 310 70"
                        fill="none"
                        stroke="#081E3E"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        strokeLinecap="round"
                      />

                      {/* Accent Points */}
                      <circle cx="260" cy="40" r="4" fill="#00B894" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="105" cy="50" r="3.5" fill="#081E3E" stroke="#FFFFFF" strokeWidth="1.5" />
                    </svg>
                  )}

                  {/* Day Labels Axis */}
                  <View style={styles.daysAxisRow}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <Text key={day} style={styles.dayLabelText}>{day}</Text>
                    ))}
                  </View>
                </View>

                {/* Legend at bottom */}
                <View style={styles.chartLegendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#00B894' }]} />
                    <Text style={styles.legendText}>Male</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#081E3E' }]} />
                    <Text style={styles.legendText}>Female</Text>
                  </View>
                </View>
              </View>

              {/* Right Sub-card: Patients Follow-up */}
              <View style={[styles.cardContainer, styles.subCardHalf]}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.cardSubHeading}>Patients follow-up</Text>
                    <View style={styles.counterBadge}>
                      <Text style={styles.counterBadgeText}>42</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.dropdownSelectorPillSmall}>
                    <Text style={styles.dropdownSelectorTextSmall}>All</Text>
                    <Ionicons name="chevron-down" size={11} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Patients items list */}
                <View style={styles.patientItemListGroup}>
                  {filteredPatientsList.map(patient => (
                    <TouchableOpacity
                      key={patient.id}
                      style={styles.patientListItem}
                      onPress={() => handleFollowUpPatientClick(patient)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.patientListAvatar, { backgroundColor: patient.avatarBg }]}>
                        <Text style={[styles.patientListAvatarText, { color: patient.avatarColor }]}>
                          {patient.initials}
                        </Text>
                      </View>

                      <View style={styles.patientListInfoCol}>
                        <Text style={styles.patientListNameText} numberOfLines={1}>{patient.name}</Text>
                        <Text style={styles.patientListSubText} numberOfLines={1}>
                          {patient.gender}, {patient.age} y.o. • {patient.reason}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.moreActionBtn}
                        onPress={() => handleFollowUpPatientClick(patient)}
                      >
                        <Ionicons name="chevron-forward" size={16} color="#00B894" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* CARD: GO FOR MEDIUNIFY (LONG BOX UNDER NEW PATIENTS & PATIENTS FOLLOW-UP) */}
            <TouchableOpacity
              style={styles.goMediUnifyBannerCard}
              onPress={() => {
                if (setActiveTab) setActiveTab('appointments');
              }}
              activeOpacity={0.88}
            >
              <View style={styles.goMediUnifyLeftContent}>
                <View style={styles.goMediUnifyIconBox}>
                  <Ionicons name="pulse" size={24} color="#00B894" />
                </View>
                <View style={styles.goMediUnifyTextCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.goMediUnifyHeading}>Go for MediUnify</Text>
                    <View style={styles.goMediUnifyPill}>
                      <Text style={styles.goMediUnifyPillText}>Clinical Suite</Text>
                    </View>
                  </View>
                  <Text style={styles.goMediUnifySubText}>
                    Access unified EHR diagnostics, instant video consults, and direct prescription tools.
                  </Text>
                </View>
              </View>

              <View style={styles.goMediUnifyActionBtn}>
                <Text style={styles.goMediUnifyActionBtnText}>Go for MediUnify</Text>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* ========================================================== */}
          {/* RIGHT COLUMN: SCHEDULE TIMELINE (approx 32% width)         */}
          {/* ========================================================== */}
          <View style={[styles.rightColumn, isNarrow && styles.rightColumnNarrow]}>
            <View style={[styles.cardContainer, styles.scheduleCard]}>
              {/* Header: Schedule Title + Today/This week Toggle */}
              <View style={styles.cardHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Text style={styles.cardMainHeading}>Schedule</Text>
                  <View style={styles.counterBadgeTeal}>
                    <Text style={styles.counterBadgeTealText}>{filteredSchedule.length}</Text>
                  </View>
                </View>
                <View style={styles.periodPillGroup}>
                  {['Today', 'This week'].map(tab => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        styles.periodBtn,
                        scheduleView === tab && styles.periodBtnActive,
                      ]}
                      onPress={() => setScheduleView(tab)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.periodBtnText,
                          scheduleView === tab && styles.periodBtnTextActive,
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Subtitle row: Date without Upcoming button */}
              <View style={styles.scheduleDateRow}>
                <Text style={styles.scheduleDateHeading}>Today, 15 Jun, Wed</Text>
              </View>

              {/* In-Person / Video Toggle (Segmented Filter Bar at Top of Schedule) */}
              <View style={styles.scheduleFilterToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.scheduleFilterToggleBtn,
                    scheduleChannelFilter === 'All' && styles.scheduleFilterToggleBtnActiveAll,
                  ]}
                  onPress={() => setScheduleChannelFilter('All')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.scheduleFilterToggleText,
                      scheduleChannelFilter === 'All' && styles.scheduleFilterToggleTextActive,
                    ]}
                  >
                    All ({scheduleConsultations.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.scheduleFilterToggleBtn,
                    scheduleChannelFilter === 'In-Person' && styles.scheduleFilterToggleBtnActiveInPerson,
                  ]}
                  onPress={() => setScheduleChannelFilter('In-Person')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="business-outline"
                    size={12}
                    color={scheduleChannelFilter === 'In-Person' ? '#FFFFFF' : '#081E3E'}
                  />
                  <Text
                    style={[
                      styles.scheduleFilterToggleText,
                      scheduleChannelFilter === 'In-Person' && styles.scheduleFilterToggleTextActive,
                    ]}
                  >
                    In-Person ({inPersonCount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.scheduleFilterToggleBtn,
                    scheduleChannelFilter === 'Video' && styles.scheduleFilterToggleBtnActiveVideo,
                  ]}
                  onPress={() => setScheduleChannelFilter('Video')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="videocam-outline"
                    size={12}
                    color={scheduleChannelFilter === 'Video' ? '#FFFFFF' : '#00B894'}
                  />
                  <Text
                    style={[
                      styles.scheduleFilterToggleText,
                      scheduleChannelFilter === 'Video' && styles.scheduleFilterToggleTextActive,
                    ]}
                  >
                    Video ({videoCount})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Timeline Container */}
              <View style={styles.timelineContainer}>
                {/* Vertical Timeline Guide Line */}
                <View style={styles.verticalTimelineAxis} />

                {filteredSchedule.length === 0 ? (
                  <View style={styles.scheduleEmptyBox}>
                    <Ionicons name="calendar-outline" size={30} color="#94A3B8" />
                    <Text style={styles.scheduleEmptyTitle}>No {scheduleChannelFilter} patient consultations today</Text>
                    <TouchableOpacity
                      style={styles.scheduleEmptyResetBtn}
                      onPress={() => setScheduleChannelFilter('All')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.scheduleEmptyResetText}>Show All Patient Consultations</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  filteredSchedule.map((appointment) => {
                    const isVideo = appointment.type === 'Video';
                    const isNext = appointment.isNext;

                    // Show current time dashed indicator right before 1:00 PM slot
                    const showCurrentTimeLine = (appointment.time === '01:00 PM');

                    return (
                      <React.Fragment key={appointment.id}>
                        {showCurrentTimeLine && (
                          <View style={styles.currentTimeLineRow}>
                            <View style={styles.currentTimeBadge}>
                              <Text style={styles.currentTimeBadgeText}>11:50 AM</Text>
                            </View>
                            <View style={styles.currentTimeDashedRule} />
                          </View>
                        )}

                        <View style={styles.timelineSlotBlock}>
                          {/* Time Axis Column */}
                          <View style={styles.timeAxisCol}>
                            <Text style={styles.timeAxisLabel}>{appointment.time}</Text>
                            <View
                              style={[
                                styles.timelineNodeDot,
                                isVideo ? styles.timelineNodeDotTeal : styles.timelineNodeDotNavy,
                                isNext && styles.timelineNodeDotNext,
                              ]}
                            />
                          </View>

                          {/* Patient Profile Consultation Card */}
                          <View style={styles.timelineSlotContent}>
                            <TouchableOpacity
                              style={[
                                styles.patientScheduleCard,
                                isNext && styles.patientScheduleCardNext,
                                !isNext && (isVideo ? styles.patientScheduleCardVideo : styles.patientScheduleCardInPerson),
                              ]}
                              onPress={() => handleAppointmentClick(appointment)}
                              activeOpacity={0.85}
                            >
                              {/* Header: Patient Profile + Type Badge */}
                              <View style={styles.patientScheduleHeaderRow}>
                                <View style={styles.patientScheduleProfileInfo}>
                                  <View
                                    style={[
                                      styles.patientScheduleAvatar,
                                      { backgroundColor: appointment.avatarBg },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.patientScheduleAvatarText,
                                        { color: appointment.avatarColor },
                                      ]}
                                    >
                                      {appointment.initials}
                                    </Text>
                                  </View>
                                  <View style={styles.patientScheduleNameCol}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                      <Text style={styles.patientScheduleNameText}>
                                        {appointment.name}
                                      </Text>
                                      {isNext && (
                                        <View style={styles.nextBadgePill}>
                                          <Text style={styles.nextBadgeText}>Next</Text>
                                        </View>
                                      )}
                                    </View>
                                    <Text style={styles.patientScheduleMetaText}>
                                      {appointment.gender}, {appointment.age} y.o.
                                    </Text>

                                    {/* Consultation Timings under Name & Gender */}
                                    <View style={styles.patientScheduleTimeUnderRow}>
                                      <Ionicons name="time" size={12} color="#00B894" />
                                      <Text style={styles.patientScheduleTimeUnderText}>
                                        {appointment.timeRange}
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                {/* Channel Tag: Video or In-Person */}
                                <View
                                  style={[
                                    styles.channelPillBadge,
                                    isVideo ? styles.channelPillBadgeVideo : styles.channelPillBadgeInPerson,
                                  ]}
                                >
                                  <Ionicons
                                    name={isVideo ? 'videocam' : 'business'}
                                    size={11}
                                    color={isVideo ? '#00B894' : '#081E3E'}
                                  />
                                  <Text
                                    style={[
                                      styles.channelPillBadgeText,
                                      { color: isVideo ? '#00B894' : '#081E3E' },
                                    ]}
                                  >
                                    {isVideo ? 'Video' : 'In-Person'}
                                  </Text>
                                </View>
                              </View>

                              {/* Chief Complaint Reason & Clinic Location */}
                              <View style={styles.patientScheduleDetailsBox}>
                                <View style={styles.patientScheduleDetailRow}>
                                  <Ionicons name="pulse" size={13} color={isVideo ? '#00B894' : '#081E3E'} />
                                  <Text style={styles.patientScheduleReasonText} numberOfLines={1}>
                                    {appointment.reason}
                                  </Text>
                                </View>
                                <View style={styles.patientScheduleDetailRow}>
                                  <Ionicons name="location-outline" size={12} color="#64748B" />
                                  <Text style={styles.patientScheduleRoomText} numberOfLines={1}>
                                    {appointment.room}
                                  </Text>
                                </View>
                              </View>

                              {/* Action Buttons Row Inside Patient Profile Card */}
                              <View style={styles.patientScheduleCardActionsRow}>
                                {/* Patients Details Button -> directs to appointments page and opens right side slide for that patient */}
                                <TouchableOpacity
                                  style={styles.patientDetailsBtn}
                                  onPress={(e) => {
                                    e?.stopPropagation?.();
                                    handleViewPatientDetails(appointment);
                                  }}
                                  activeOpacity={0.8}
                                >
                                  <Ionicons name="person-circle-outline" size={14} color="#081E3E" />
                                  <Text style={styles.patientDetailsBtnText}>Patients Details</Text>
                                </TouchableOpacity>

                                {/* Video Call button (direct to join call) or In-person Start Consult button */}
                                {isVideo ? (
                                  <TouchableOpacity
                                    style={styles.patientDirectCtaBtnVideo}
                                    onPress={(e) => {
                                      e?.stopPropagation?.();
                                      handleJoinCall(appointment);
                                    }}
                                    activeOpacity={0.8}
                                  >
                                    <Ionicons name="videocam" size={13} color="#FFFFFF" />
                                    <Text style={styles.patientDirectCtaBtnText}>Join Video Call</Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={styles.patientDirectCtaBtnInPerson}
                                    onPress={(e) => {
                                      e?.stopPropagation?.();
                                      handleStartInPersonConsult(appointment);
                                    }}
                                    activeOpacity={0.8}
                                  >
                                    <Ionicons name="document-text" size={13} color="#FFFFFF" />
                                    <Text style={styles.patientDirectCtaBtnText}>Start Consult</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </React.Fragment>
                    );
                  })
                )}
              </View>
            </View>
          </View>
        </View>

        {/* ============================================================== */}
        {/* 4. DASHBOARD FOOTER                                           */}
        {/* ============================================================== */}
        <View style={styles.dashboardFooter}>
          <View style={styles.footerTopRow}>
            {/* Brand Col */}
            <View style={styles.footerBrandCol}>
              <View style={styles.footerLogoRow}>
                <View style={styles.footerLogoBadge}>
                  <Ionicons name="pulse" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.footerBrandText}>
                  Medi<Text style={{ color: '#00B894' }}>Unify</Text>
                </Text>
                <View style={styles.footerVersionPill}>
                  <Text style={styles.footerVersionText}>v2.4.0</Text>
                </View>
              </View>
              <Text style={styles.footerBrandTagline}>
                Connected Clinical Practice & Telehealth Suite. Empowering healthcare professionals with unified patient records, instant consultations, and secure diagnostics.
              </Text>
              <View style={styles.footerCertRow}>
                <View style={styles.footerCertItem}>
                  <Ionicons name="shield-checkmark" size={13} color="#00B894" />
                  <Text style={styles.footerCertText}>HIPAA Compliant</Text>
                </View>
                <View style={styles.footerCertItem}>
                  <Ionicons name="lock-closed" size={13} color="#00B894" />
                  <Text style={styles.footerCertText}>256-Bit Encrypted</Text>
                </View>
                <View style={styles.footerCertItem}>
                  <Ionicons name="medical" size={13} color="#00B894" />
                  <Text style={styles.footerCertText}>NABH Standards</Text>
                </View>
              </View>
            </View>

            {/* Quick Links Col */}
            <View style={styles.footerLinksCol}>
              <Text style={styles.footerLinksHeading}>Quick Clinical Links</Text>
              <View style={styles.footerLinksGrid}>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('appointments')}>
                  <Text style={styles.footerLinkText}>Appointments & OPD Queue</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('followups')}>
                  <Text style={styles.footerLinkText}>Patients Follow-ups</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('directpatient')}>
                  <Text style={styles.footerLinkText}>Direct Patient Walk-ins</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('availability')}>
                  <Text style={styles.footerLinkText}>Consultation Availability</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('profile')}>
                  <Text style={styles.footerLinkText}>Doctor Profile & Practice Info</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* System Status & Support Col */}
            <View style={styles.footerStatusCol}>
              <Text style={styles.footerLinksHeading}>System Status & Support</Text>
              <View style={styles.footerStatusCard}>
                <View style={styles.statusPulseRow}>
                  <View style={styles.statusPulseDot} />
                  <Text style={styles.statusPulseText}>All Telehealth Systems Operational</Text>
                </View>
                <Text style={styles.statusMetricText}>HD Video Server: Bangalore (9ms latency)</Text>
                <Text style={styles.statusMetricText}>EHR Sync: Real-time active</Text>
              </View>

              <View style={styles.footerHelplineBox}>
                <Ionicons name="headset" size={16} color="#00B894" />
                <View>
                  <Text style={styles.helplineTitle}>24/7 Clinical Support Desk</Text>
                  <Text style={styles.helplinePhone}>1800-MED-UNIFY (1800 633 864)</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer Bottom Bar */}
          <View style={styles.footerBottomBar}>
            <Text style={styles.footerCopyrightText}>
              © 2026 MediUnify Health Systems Inc. All clinical documentation and health records are confidential & protected by medical data governance.
            </Text>
            <View style={styles.footerPolicyRow}>
              <TouchableOpacity>
                <Text style={styles.footerPolicyLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerPolicySep}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerPolicyLink}>Terms of Clinical Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerPolicySep}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerPolicyLink}>Telemedicine Guidelines</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ============================================================== */}
      {/* 3. PATIENT DETAILS MODAL (ACCESSIBLE FROM PATIENTS LIST)       */}
      {/* ============================================================== */}
      <Modal
        visible={!!selectedPatientModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPatientModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardBox}>
            {selectedPatientModal && (
              <>
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalHeaderInfo}>
                    <View style={[styles.modalAvatar, { backgroundColor: selectedPatientModal.avatarBg }]}>
                      <Text style={[styles.modalAvatarText, { color: selectedPatientModal.avatarColor }]}>
                        {selectedPatientModal.initials}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.modalPatientName}>{selectedPatientModal.name}</Text>
                      <Text style={styles.modalPatientMeta}>
                        {selectedPatientModal.gender}, {selectedPatientModal.age} y.o. • {selectedPatientModal.phone}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedPatientModal(null)}
                    style={styles.modalCloseBtn}
                  >
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  {/* Diagnosis & Scheduled Time */}
                  <View style={styles.modalFieldBox}>
                    <Text style={styles.modalFieldLabel}>Chief Complaint / Reason</Text>
                    <Text style={styles.modalFieldValue}>{selectedPatientModal.reason}</Text>
                  </View>

                  <View style={styles.modalFieldBox}>
                    <Text style={styles.modalFieldLabel}>Scheduled Time</Text>
                    <Text style={styles.modalFieldValue}>Today at {selectedPatientModal.time}</Text>
                  </View>

                  {/* Vitals Snapshot */}
                  <View style={styles.modalVitalsGrid}>
                    <View style={styles.modalVitalItem}>
                      <Text style={styles.vitalTag}>BP</Text>
                      <Text style={styles.vitalVal}>128/82</Text>
                      <Text style={styles.vitalSub}>mmHg</Text>
                    </View>
                    <View style={styles.modalVitalItem}>
                      <Text style={styles.vitalTag}>Heart Rate</Text>
                      <Text style={styles.vitalVal}>72</Text>
                      <Text style={styles.vitalSub}>bpm</Text>
                    </View>
                    <View style={styles.modalVitalItem}>
                      <Text style={styles.vitalTag}>SpO2</Text>
                      <Text style={styles.vitalVal}>99%</Text>
                      <Text style={styles.vitalSub}>Air</Text>
                    </View>
                    <View style={styles.modalVitalItem}>
                      <Text style={styles.vitalTag}>Status</Text>
                      <Text style={[styles.vitalVal, { color: '#00B894' }]}>Normal</Text>
                      <Text style={styles.vitalSub}>Clinical</Text>
                    </View>
                  </View>
                </View>

                {/* Modal Actions */}
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    style={styles.modalBtnSecondary}
                    onPress={() => setSelectedPatientModal(null)}
                  >
                    <Text style={styles.modalBtnSecondaryText}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalBtnPrimary}
                    onPress={() => {
                      const p = selectedPatientModal;
                      setSelectedPatientModal(null);
                      if (onStartConsultation) {
                        onStartConsultation({
                          patient: p.name,
                          type: 'Video',
                          reason: p.reason,
                        });
                      }
                      if (setActiveTab) setActiveTab('consultation');
                    }}
                  >
                    <Ionicons name="videocam" size={16} color="#FFFFFF" />
                    <Text style={styles.modalBtnPrimaryText}>Start Consultation</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ====================================================================
// TEAL AND NAVY BLUE THEME STYLESHEET
// ====================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA', // Crisp modern medical canvas
  },

  /* 1. TOP BAR */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: '#F3F6FA', // Matches whole dashboard page background
    borderBottomWidth: 0,
    gap: 20,
    zIndex: 100,
    flexWrap: 'wrap',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flex: 1,
    maxWidth: 440,
    gap: 10,
    borderWidth: 2,
    borderColor: '#00B894',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#081E3E',
    backgroundColor: 'transparent',
    outlineStyle: 'none',
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  topEmailButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F6FA', // Matches whole dashboard page background
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bellBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  doctorProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F3F6FA', // Matches whole dashboard page background
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 24,
  },
  doctorAvatarBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarInitials: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  doctorMetaTextCol: {
    gap: 1,
  },
  doctorNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#081E3E',
  },
  doctorRoleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  profileDropdownMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 9999,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  dropdownMenuText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#081E3E',
  },

  /* 2. SCROLL CONTENT & GRID */
  scrollViewport: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  scrollContentNarrow: {
    padding: 16,
    paddingBottom: 40,
  },
  dashboardGrid: {
    flexDirection: 'row',
    gap: 22,
    alignItems: 'flex-start',
  },
  dashboardGridNarrow: {
    flexDirection: 'column',
    gap: 20,
    alignItems: 'stretch',
  },

  /* Left Major Column */
  leftColumn: {
    flex: 2.1,
    gap: 22,
  },
  leftColumnNarrow: {
    width: '100%',
    flex: 0,
    gap: 20,
  },

  /* Right Timeline Column */
  rightColumn: {
    flex: 1,
    minWidth: 320,
    gap: 22,
  },
  rightColumnNarrow: {
    width: '100%',
    flex: 0,
    minWidth: 0,
    gap: 20,
  },

  /* Card Containers */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMainHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.3,
  },
  cardSubHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },

  /* Period Pill Filters (Week, Month, Year) */
  periodPillGroup: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  periodBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
  },
  periodBtnActive: {
    backgroundColor: '#081E3E', // Navy active
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  periodBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  periodBtnTextActive: {
    color: '#FFFFFF',
  },

  /* Small Period Filter for sub-cards */
  periodPillGroupSmall: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 2.5,
  },
  periodBtnSmall: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 14,
  },
  periodBtnSmallActive: {
    backgroundColor: '#081E3E',
  },
  periodBtnSmallText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  periodBtnSmallTextActive: {
    color: '#FFFFFF',
  },

  /* ------------------------------------------------------------------ */
  /* CARD 1: STATISTICS ROW (4 STAT BOXES)                              */
  /* ------------------------------------------------------------------ */
  statCardsRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  statCardsRowNarrow: {
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  statBoxNarrow: {
    minWidth: 140,
    padding: 13,
  },
  /* HIGHLIGHTED TEAL CARD (The signature card from reference) */
  statBoxTealHighlight: {
    backgroundColor: '#00B894', // Vibrant Teal
    borderColor: '#00A383',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  statBoxTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statNumberTeal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  statNumberNavy: {
    fontSize: 28,
    fontWeight: '800',
    color: '#081E3E',
    lineHeight: 32,
  },
  statUnitNavy: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  statLabelTeal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E6F8F4',
  },
  statLabelMuted: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  pssLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pillBadgeTeal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  pillBadgeTealText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  pillBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E6F8F4',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  pillBadgeGreenText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#00B894',
  },
  pillBadgeTealLight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  pillBadgeTealLightText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0284C7',
  },

  /* ------------------------------------------------------------------ */
  /* CARD 2: NEXT APPOINTMENTS LONG CARD BOX STYLES                     */
  /* ------------------------------------------------------------------ */
  viewAllApptsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E6F8F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.25)',
  },
  viewAllApptsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00876A',
  },
  nextApptsListWrap: {
    gap: 12,
  },
  nextApptLongRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    flexWrap: 'wrap',
  },
  nextApptInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 280,
  },
  nextApptTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  nextApptTimePillVideo: {
    backgroundColor: '#E0F2FE',
  },
  nextApptTimePillInPerson: {
    backgroundColor: '#E6F8F4',
  },
  nextApptTimePillText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  nextApptAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextApptAvatarInitials: {
    fontSize: 13,
    fontWeight: '800',
  },
  nextApptMetaTextCol: {
    flex: 1,
    gap: 3,
  },
  nextApptPatientName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  nextApptDemographics: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  nextApptReasonText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  nextApptActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nextApptStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  nextApptStatusBadgeNext: {
    backgroundColor: '#E6F8F4',
  },
  nextApptStatusBadgeReady: {
    backgroundColor: '#F1F5F9',
  },
  nextApptStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nextApptStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  nextApptStartConsultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  nextApptStartConsultBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ------------------------------------------------------------------ */
  /* CARDS 3 & 4: BOTTOM SPLIT (NEW PATIENTS CHART & PATIENTS LIST)     */
  /* ------------------------------------------------------------------ */
  bottomSplitRow: {
    flexDirection: 'row',
    gap: 22,
    flexWrap: 'wrap',
  },
  bottomSplitRowNarrow: {
    gap: 16,
    flexWrap: 'wrap',
  },
  subCardHalf: {
    flex: 1,
    minWidth: 280,
    gap: 14,
  },
  counterBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  counterBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
  },
  chartVisualWrapper: {
    height: 145,
    position: 'relative',
    justifyContent: 'space-between',
    paddingBottom: 22,
  },
  chartGridLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 16,
  },
  chartAxisNum: {
    fontSize: 9.5,
    color: '#94A3B8',
    width: 14,
    textAlign: 'right',
  },
  gridDashed: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  daysAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 6,
    marginTop: 6,
  },
  dayLabelText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  chartLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  /* Patients items in list */
  patientItemListGroup: {
    gap: 10,
  },
  patientListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 5,
  },
  patientListAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientListAvatarText: {
    fontSize: 12,
    fontWeight: '800',
  },
  patientListInfoCol: {
    flex: 1,
    gap: 2,
  },
  patientListNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#081E3E',
  },
  patientListSubText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  moreActionBtn: {
    padding: 6,
  },

  /* ------------------------------------------------------------------ */
  /* CARD: GO FOR MEDIUNIFY LONG BANNER BOX                             */
  /* ------------------------------------------------------------------ */
  goMediUnifyBannerCard: {
    backgroundColor: '#081E3E', // Deep Navy theme matching dashboard aesthetic
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.35)',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    gap: 16,
  },
  goMediUnifyLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  goMediUnifyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 184, 148, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.35)',
  },
  goMediUnifyTextCol: {
    flex: 1,
    gap: 4,
  },
  goMediUnifyHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  goMediUnifyPill: {
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  goMediUnifyPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#00B894',
    textTransform: 'uppercase',
  },
  goMediUnifySubText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    lineHeight: 16,
  },
  goMediUnifyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00B894',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  goMediUnifyActionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ------------------------------------------------------------------ */
  /* RIGHT COLUMN: SCHEDULE TIMELINE STYLES                             */
  /* ------------------------------------------------------------------ */
  scheduleCard: {
    gap: 14,
  },
  counterBadgeTeal: {
    backgroundColor: '#E6F8F4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00B894',
  },
  counterBadgeTealText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00B894',
  },
  scheduleDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 2,
  },
  scheduleDateHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },

  /* IN-PERSON / VIDEO TOGGLE AT TOP OF SCHEDULE CARD */
  scheduleFilterToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
    marginVertical: 4,
  },
  scheduleFilterToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 9,
    gap: 4,
  },
  scheduleFilterToggleBtnActiveAll: {
    backgroundColor: '#081E3E',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleFilterToggleBtnActiveInPerson: {
    backgroundColor: '#081E3E',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleFilterToggleBtnActiveVideo: {
    backgroundColor: '#00B894',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleFilterToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  scheduleFilterToggleTextActive: {
    color: '#FFFFFF',
  },

  /* TIMELINE CONTAINER & AXIS */
  timelineContainer: {
    position: 'relative',
    paddingLeft: 2,
    gap: 16,
    marginTop: 4,
  },
  verticalTimelineAxis: {
    position: 'absolute',
    left: 58,
    top: 14,
    bottom: 24,
    width: 2,
    backgroundColor: '#E2E8F0',
  },
  timelineSlotBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timeAxisCol: {
    width: 58,
    paddingTop: 8,
    position: 'relative',
    alignItems: 'flex-start',
  },
  timeAxisLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  timelineNodeDot: {
    position: 'absolute',
    right: -6,
    top: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    zIndex: 2,
  },
  timelineNodeDotTeal: {
    borderColor: '#00B894',
  },
  timelineNodeDotNavy: {
    borderColor: '#081E3E',
  },
  timelineNodeDotNext: {
    width: 12,
    height: 12,
    borderRadius: 6,
    right: -7,
    borderColor: '#00B894',
    backgroundColor: '#00B894',
  },
  timelineSlotContent: {
    flex: 1,
  },

  /* CURRENT TIME DASHED LINE */
  currentTimeLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  currentTimeBadge: {
    backgroundColor: '#081E3E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  currentTimeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  currentTimeDashedRule: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#081E3E',
  },

  /* PATIENT CONSULTATION CARD */
  patientScheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    minHeight: 180,
    gap: 12,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  patientScheduleCardNext: {
    backgroundColor: '#F0FDF9',
    borderColor: '#00B894',
    borderWidth: 1.5,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  patientScheduleCardVideo: {
    borderLeftWidth: 4,
    borderLeftColor: '#00B894',
  },
  patientScheduleCardInPerson: {
    borderLeftWidth: 4,
    borderLeftColor: '#081E3E',
  },

  patientScheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  patientScheduleProfileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  patientScheduleAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientScheduleAvatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  patientScheduleNameCol: {
    flex: 1,
  },
  patientScheduleNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  nextBadgePill: {
    backgroundColor: '#00B894',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  nextBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  patientScheduleMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },

  /* CONSULTATION TYPE PILL */
  channelPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  channelPillBadgeVideo: {
    backgroundColor: '#E6F8F4',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.3)',
  },
  channelPillBadgeInPerson: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  channelPillBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },

  /* REASON & LOCATION BOX */
  patientScheduleDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 9,
    gap: 5,
  },
  patientScheduleDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientScheduleReasonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
    flex: 1,
  },
  patientScheduleRoomText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },

  /* TIMINGS UNDER PATIENT NAME & GENDER */
  patientScheduleTimeUnderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
    backgroundColor: '#F0FDF9',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.25)',
  },
  patientScheduleTimeUnderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },

  /* ACTION BUTTONS ROW INSIDE CARD */
  patientScheduleCardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  patientDetailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  patientDetailsBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  patientDirectCtaBtnVideo: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#00B894',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  patientDirectCtaBtnInPerson: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#081E3E',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  patientDirectCtaBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* EMPTY STATE */
  scheduleEmptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 10,
  },
  scheduleEmptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  scheduleEmptyResetBtn: {
    backgroundColor: '#081E3E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scheduleEmptyResetText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ------------------------------------------------------------------ */
  /* MODAL STYLES                                                       */
  /* ------------------------------------------------------------------ */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCardBox: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  modalHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalPatientName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalPatientMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBody: {
    padding: 20,
    gap: 14,
  },
  modalFieldBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  modalFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  modalFieldValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  modalVitalsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  modalVitalItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 2,
  },
  vitalTag: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  vitalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  vitalSub: {
    fontSize: 9.5,
    color: '#94A3B8',
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  modalBtnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modalBtnSecondaryText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  modalBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#00B894', // Teal button
  },
  modalBtnPrimaryText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* DASHBOARD FOOTER (NAVY BLUE THEMED) */
  dashboardFooter: {
    marginTop: 24,
    backgroundColor: '#081E3E', // Navy Blue Background
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3A66',
    padding: 26,
    gap: 20,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
  },
  footerTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'space-between',
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerBrandCol: {
    flex: 1.4,
    minWidth: 260,
    gap: 10,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLogoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  footerVersionPill: {
    backgroundColor: 'rgba(0, 184, 148, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00B894',
  },
  footerVersionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00B894',
  },
  footerBrandTagline: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    maxWidth: 380,
  },
  footerCertRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 14,
    marginTop: 4,
  },
  footerCertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerCertText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  footerLinksCol: {
    flex: 1.1,
    minWidth: 200,
    gap: 10,
  },
  footerLinksHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  footerLinksGrid: {
    gap: 8,
  },
  footerLinkText: {
    fontSize: 12.5,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  footerStatusCol: {
    flex: 1.2,
    minWidth: 220,
    gap: 10,
  },
  footerStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 12,
    gap: 6,
  },
  statusPulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B894',
  },
  statusPulseText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusMetricText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  footerHelplineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  helplineTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helplinePhone: {
    fontSize: 11,
    color: '#00B894',
    fontWeight: '700',
  },
  footerBottomBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerCopyrightText: {
    fontSize: 11,
    color: '#94A3B8',
    flex: 1,
    minWidth: 260,
  },
  footerPolicyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerPolicyLink: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  footerPolicySep: {
    fontSize: 10,
    color: '#475569',
  },

  /* NOTIFICATION POPOVER (MATCHING REFERENCE IMAGE) */
  bellButtonActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  notifPopoverCard: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 360,
    maxHeight: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 20,
    zIndex: 10000,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.2,
  },
  notifMarkAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  notifTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
    marginBottom: 10,
  },
  notifTabsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notifTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
  },
  notifTabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#081E3E',
  },
  notifTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  notifTabTextActive: {
    color: '#081E3E',
    fontWeight: '700',
  },
  notifTabCountPill: {
    backgroundColor: '#081E3E',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  notifTabCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  notifSettingsBtn: {
    padding: 4,
  },
  notifListScroll: {
    maxHeight: 380,
  },
  notifItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  notifAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notifAvatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  notifContentCol: {
    flex: 1,
  },
  notifTextAndDotRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  notifItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
    lineHeight: 18,
    flex: 1,
  },
  notifUnreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0284C7',
    marginTop: 5,
  },
  notifItemSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  notifActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  notifDeclineBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  notifDeclineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  notifAcceptBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0284C7',
  },
  notifAcceptBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notifAttachmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  notifAttachmentText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  notifFooterRow: {
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  notifAvatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifMiniAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notifAvatarMoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 6,
  },
});
