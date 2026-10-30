import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorDashboardPage({
  setActiveTab,
  onStartConsultation,
  onStartConsultNotes,
  onViewPatientDetails,
  onViewFollowUpPatient,
  onNavigateHome,
}) {
  // Dynamic screen measurement for responsive alignment on desktop / tablet / phone
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

  // Dark / Light Mode State (as in reference HTML)
  const [darkMode, setDarkMode] = useState(false);

  // Timeframe and Filter States
  const [statTimeframe, setStatTimeframe] = useState('Week'); // 'Week' | 'Month' | 'Year'
  const [scheduleView, setScheduleView] = useState('today'); // 'today' | 'week'
  const [scheduleFilter, setScheduleFilter] = useState('all'); // 'all' | 'in-person' | 'video'
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Modals & Slide-over States
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [activeConsultPatient, setActiveConsultPatient] = useState(null);
  const [consultDiagnosisNotes, setConsultDiagnosisNotes] = useState('');
  const [consultPrescription, setConsultPrescription] = useState('');
  const [showPatientDossier, setShowPatientDossier] = useState(false);

  // Notifications Popover State
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
    Week: {
      newPatients: 8,
      newDiff: '2',
      totalPatients: 42,
      totalDiff: '5',
      timeToAppt: '25',
      timeDiff: '2%',
      pss: '2.96',
      pssDiff: '1.4%',
    },
    Month: {
      newPatients: 36,
      newDiff: '8',
      totalPatients: 168,
      totalDiff: '24',
      timeToAppt: '22',
      timeDiff: '5%',
      pss: '2.98',
      pssDiff: '2.1%',
    },
    Year: {
      newPatients: 420,
      newDiff: '45',
      totalPatients: 1840,
      totalDiff: '310',
      timeToAppt: '19',
      timeDiff: '8%',
      pss: '2.99',
      pssDiff: '3.5%',
    },
  };

  const currentStats = statsData[statTimeframe] || statsData.Week;

  // Next Appointments List (as in HTML Reference)
  const nextAppointmentsData = [
    {
      id: 1,
      time: '10:30 AM',
      patientName: 'Rohan Mehta',
      patientDetails: '34 yrs • Male',
      bloodGroup: 'B+',
      condition: 'Hypertension & BP Review',
      type: 'Video',
      status: 'Ready / Waiting',
      statusColor: '#10B981',
      initials: 'RM',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
    },
    {
      id: 2,
      time: '11:00 AM',
      patientName: 'Andre Merritt',
      patientDetails: '27 yrs • Male',
      bloodGroup: 'O+',
      condition: 'New Patient • Cardiac Consult',
      type: 'Video',
      status: 'Next in Queue',
      statusColor: '#00B894',
      initials: 'AM',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
    },
    {
      id: 3,
      time: '11:30 AM',
      patientName: 'Meera Nair',
      patientDetails: '48 yrs • Female',
      bloodGroup: 'A+',
      condition: 'Chest Discomfort Review • Follow-up',
      type: 'In-Person',
      status: 'Waiting in Clinic',
      statusColor: '#F59E0B',
      initials: 'MN',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
    },
  ];

  // Weekly New Patients Trend Data (Mon to Sun: [3, 5, 8, 4, 6, 2, 1])
  const weeklyTrends = [
    { day: 'Mon', value: 3 },
    { day: 'Tue', value: 5 },
    { day: 'Wed', value: 8 },
    { day: 'Thu', value: 4 },
    { day: 'Fri', value: 6 },
    { day: 'Sat', value: 2 },
    { day: 'Sun', value: 1 },
  ];
  const maxTrendValue = 10;

  // Patients Follow-up list (as in HTML reference)
  const followupPatients = [
    {
      id: 'f1',
      name: 'Diane Cruz',
      details: '54 yrs • Female • B+ • ID #DC-991',
      timeBadge: 'Tomorrow',
      type: 'In-Person',
      scheduledTime: 'Tomorrow, 09:30 AM',
      diagnosis: 'Dyslipidemia follow-up & statin dose titration',
      bloodGroup: 'B+',
      initials: 'DC',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
    },
    {
      id: 'f2',
      name: 'Liam Gallagher',
      details: '42 yrs • Male • A+ • ID #LG-528',
      timeBadge: 'In 3 days',
      type: 'Video',
      scheduledTime: 'In 3 days, 11:15 AM',
      diagnosis: 'Blood Pressure Monitoring & Cardio Check',
      bloodGroup: 'A+',
      initials: 'LG',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
    },
    {
      id: 'f3',
      name: 'Jakub Tucker',
      details: '43 yrs • Male • B+ • ID #JT-331',
      timeBadge: 'Today',
      type: 'In-Person',
      scheduledTime: 'Today, 10:15 AM',
      diagnosis: 'Post-MI Rehabilitation & Cardiac Conditioning',
      bloodGroup: 'B+',
      initials: 'JT',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
    },
  ];

  // Schedule Timeline Stream (as in HTML reference)
  const scheduleTimelineData = [
    {
      id: 'sc-1',
      appointmentId: 'apt-today-rohan',
      time: '10:30 AM',
      timeRange: '10:30 AM — 11:00 AM',
      name: 'Rohan Mehta',
      gender: 'Male',
      age: 34,
      initials: 'RM',
      avatarBg: '#0D9488',
      avatarColor: '#FFFFFF',
      type: 'Video',
      reason: 'Hypertension & BP Review',
      room: 'MediUnify Telehealth Video Room #1',
      status: 'Ready / Waiting',
      bloodGroup: 'B+',
      isNext: false,
    },
    {
      id: 'sc-2',
      appointmentId: 'apt-today-andre',
      time: '11:00 AM',
      timeRange: '11:00 AM — 11:30 AM',
      name: 'Andre Merritt',
      gender: 'Male',
      age: 27,
      initials: 'AM',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
      type: 'Video',
      reason: 'New Patient • Cardiac Consult',
      room: 'MediUnify Telehealth Video Room #2',
      status: 'Next in Queue',
      bloodGroup: 'O+',
      isNext: true,
    },
    {
      id: 'sc-3',
      appointmentId: 'apt-today-meera',
      time: '11:30 AM',
      timeRange: '11:30 AM — 12:00 PM',
      name: 'Meera Nair',
      gender: 'Female',
      age: 48,
      initials: 'MN',
      avatarBg: '#0D9488',
      avatarColor: '#FFFFFF',
      type: 'In-Person',
      reason: 'Chest Discomfort Review • Follow-up',
      room: 'Room 302, OPD Wing A',
      status: 'Waiting in Clinic',
      bloodGroup: 'A+',
      isNext: false,
    },
    {
      id: 'sc-4',
      appointmentId: 'apt-today-jakub',
      time: '01:00 PM',
      timeRange: '01:00 PM — 01:30 PM',
      name: 'Jakub Tucker',
      gender: 'Male',
      age: 43,
      initials: 'JT',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
      type: 'In-Person',
      reason: 'Post-MI Rehabilitation & ECG Check',
      room: 'Room 302, OPD Wing A',
      status: 'Confirmed',
      bloodGroup: 'B+',
      isNext: false,
    },
    {
      id: 'sc-5',
      appointmentId: 'apt-today-priya',
      time: '02:30 PM',
      timeRange: '02:30 PM — 03:00 PM',
      name: 'Priya Sharma',
      gender: 'Female',
      age: 35,
      initials: 'PS',
      avatarBg: '#0D9488',
      avatarColor: '#FFFFFF',
      type: 'In-Person',
      reason: 'Seasonal Allergy & Lipid Re-evaluation',
      room: 'Room 302, OPD Wing A',
      status: 'Confirmed',
      bloodGroup: 'O+',
      isNext: false,
    },
    {
      id: 'sc-6',
      appointmentId: 'apt-today-roosevelt',
      time: '03:00 PM',
      timeRange: '03:00 PM — 03:30 PM',
      name: 'Roosevelt Chase',
      gender: 'Male',
      age: 35,
      initials: 'RC',
      avatarBg: '#0B1629',
      avatarColor: '#00B894',
      type: 'Video',
      reason: 'Routine ECG Review & Vitals Check',
      room: 'MediUnify Telehealth Video Room #1',
      status: 'Scheduled',
      bloodGroup: 'AB+',
      isNext: false,
    },
  ];

  const inPersonTimelineCount = scheduleTimelineData.filter(i => i.type === 'In-Person').length;
  const videoTimelineCount = scheduleTimelineData.filter(i => i.type === 'Video').length;

  const filteredTimeline = scheduleTimelineData.filter(item => {
    if (scheduleFilter === 'all') return true;
    if (scheduleFilter === 'in-person') return item.type === 'In-Person';
    if (scheduleFilter === 'video') return item.type === 'Video';
    return true;
  });

  // Action Handlers
  const handleOpenPatientPreview = (patient) => {
    setSelectedPatient(patient);
    setShowPreviewModal(true);
  };

  const handleStartConsultationModal = (patient) => {
    setActiveConsultPatient(patient);
    setConsultDiagnosisNotes('');
    setConsultPrescription('');
    setShowConsultModal(true);
  };

  const handleDirectStartConsult = (appointment) => {
    if (onStartConsultation) {
      onStartConsultation(appointment);
    } else if (setActiveTab) {
      setActiveTab('consultation');
    }
  };

  const handleViewPatientDetails = (appointment) => {
    if (onViewPatientDetails) {
      onViewPatientDetails(appointment);
    } else if (setActiveTab) {
      setActiveTab('appointments');
    }
  };

  // Color Theme Variables
  const theme = {
    bg: darkMode ? '#070F1D' : '#F8FAFC',
    cardBg: darkMode ? '#0B1629' : '#FFFFFF',
    cardBorder: darkMode ? '#1E293B' : '#E2E8F0',
    textPrimary: darkMode ? '#F1F5F9' : '#0F1F38',
    textSecondary: darkMode ? '#94A3B8' : '#64748B',
    mutedBg: darkMode ? '#0F1F38' : '#F1F5F9',
    subtleBorder: darkMode ? '#1E293B' : '#E2E8F0',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* ============================================================== */}
      {/* 1. TOP HEADER (Search, Dark Mode, Mail, Notifications, Profile)*/}
      {/* ============================================================== */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder }]}>
        {/* Search Bar with Teal Accent */}
        <View style={[styles.searchPill, darkMode && styles.searchPillDark]}>
          <Ionicons name="search-outline" size={19} color="#0D9488" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search patients, diagnoses, appointments..."
            placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Header Action Controls */}
        <View style={styles.topRightGroup}>
          {/* Dark / Light Mode Toggle Button */}
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: theme.mutedBg }]}
            onPress={() => setDarkMode(!darkMode)}
            activeOpacity={0.75}
            accessibilityLabel="Toggle Dark/Light Mode"
          >
            <Ionicons
              name={darkMode ? 'sunny-outline' : 'moon-outline'}
              size={19}
              color="#0D9488"
            />
          </TouchableOpacity>

          {/* Mail / Messages Button */}
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: theme.mutedBg }]}
            onPress={() => {
              if (typeof window !== 'undefined') {
                window.open('https://mail.google.com/mail/?view=cm&fs=1&to=', '_blank');
              }
            }}
            activeOpacity={0.75}
            accessibilityLabel="Compose Email"
          >
            <Ionicons name="mail-outline" size={19} color={theme.textSecondary} />
          </TouchableOpacity>

          {/* Notifications Button with Animated Teal Badge */}
          <View style={{ position: 'relative', zIndex: 9999 }}>
            <TouchableOpacity
              style={[
                styles.headerIconBtn,
                { backgroundColor: theme.mutedBg },
                showNotificationPopover && styles.bellBtnActive,
              ]}
              onPress={() => {
                setShowNotificationPopover(prev => !prev);
                setShowProfileDropdown(false);
              }}
              activeOpacity={0.75}
            >
              <Ionicons
                name={showNotificationPopover ? 'notifications' : 'notifications-outline'}
                size={19}
                color={showNotificationPopover ? '#0D9488' : theme.textSecondary}
              />
              {unreadCount > 0 && (
                <View style={styles.notifBadgeDot} />
              )}
            </TouchableOpacity>

            {/* Notification Popover Dropdown Card */}
            {showNotificationPopover && (
              <View style={[styles.notifPopoverCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <View style={styles.notifHeaderRow}>
                  <Text style={[styles.notifTitle, { color: theme.textPrimary }]}>Notifications</Text>
                  <TouchableOpacity onPress={handleMarkAllAsRead} activeOpacity={0.7}>
                    <Text style={styles.notifMarkAllText}>Mark all as read</Text>
                  </TouchableOpacity>
                </View>

                {/* Sub-tabs Row */}
                <View style={[styles.notifTabsRow, { borderBottomColor: theme.subtleBorder }]}>
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
                    <View key={notif.id} style={[styles.notifItemRow, { borderBottomColor: theme.subtleBorder }]}>
                      <View style={[styles.notifAvatarBox, { backgroundColor: notif.avatarBg }]}>
                        <Text style={[styles.notifAvatarText, { color: notif.avatarColor }]}>
                          {notif.initials}
                        </Text>
                      </View>
                      <View style={styles.notifContentCol}>
                        <View style={styles.notifTextAndDotRow}>
                          <Text style={[styles.notifItemName, { color: theme.textPrimary }]} numberOfLines={2}>
                            {notif.name}
                          </Text>
                          {notif.unread && <View style={styles.notifUnreadDot} />}
                        </View>
                        <Text style={styles.notifItemSub}>{notif.sub}</Text>
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
              </View>
            )}
          </View>

          {/* Doctor Profile Header Pill */}
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              style={[styles.doctorProfilePill, { borderColor: theme.cardBorder }]}
              onPress={() => setShowProfileDropdown(!showProfileDropdown)}
              activeOpacity={0.8}
            >
              <View style={styles.doctorAvatarBox}>
                <Text style={styles.doctorAvatarInitials}>RA</Text>
              </View>
              <View style={styles.doctorMetaTextCol}>
                <Text style={[styles.doctorNameText, { color: theme.textPrimary }]}>Dr. Robert Anderson</Text>
                <Text style={styles.doctorRoleText}>Cardiologist</Text>
              </View>
              <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <View style={[styles.profileDropdownMenu, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <TouchableOpacity
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowProfileDropdown(false);
                    if (setActiveTab) setActiveTab('profile');
                  }}
                >
                  <Ionicons name="person-outline" size={16} color="#0D9488" />
                  <Text style={[styles.dropdownMenuText, { color: theme.textPrimary }]}>My Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowProfileDropdown(false);
                    if (setActiveTab) setActiveTab('availability');
                  }}
                >
                  <Ionicons name="time-outline" size={16} color="#0D9488" />
                  <Text style={[styles.dropdownMenuText, { color: theme.textPrimary }]}>Availability</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownMenuItem}
                  onPress={() => {
                    setShowProfileDropdown(false);
                    setShowPatientDossier(true);
                  }}
                >
                  <Ionicons name="folder-outline" size={16} color="#0D9488" />
                  <Text style={[styles.dropdownMenuText, { color: theme.textPrimary }]}>Patient Dossiers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dropdownMenuItem, { borderTopWidth: 1, borderTopColor: theme.subtleBorder }]}
                  onPress={() => {
                    setShowProfileDropdown(false);
                    if (onNavigateHome) {
                      onNavigateHome();
                    } else if (setActiveTab) {
                      setActiveTab('landing');
                    }
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
      {/* 2. MAIN SCROLLABLE DASHBOARD VIEW                              */}
      {/* ============================================================== */}
      <ScrollView
        style={styles.scrollViewport}
        contentContainerStyle={[styles.scrollContent, isNarrow && styles.scrollContentNarrow]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.dashboardGrid, isNarrow && styles.dashboardGridNarrow]}>
          {/* ========================================================== */}
          {/* LEFT MAIN COLUMN: Statistics, Next Appts, Analytics        */}
          {/* ========================================================== */}
          <View style={[styles.leftColumn, isNarrow && styles.leftColumnNarrow]}>
            {/* -------------------------------------------------------- */}
            {/* CARD 1: STATISTICS (4 Metric Cards Grid)                 */}
            {/* -------------------------------------------------------- */}
            <View style={[styles.cardContainer, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardMainHeading, { color: theme.textPrimary }]}>Statistics</Text>
                {/* Timeframe Selector: Week | Month | Year */}
                <View style={[styles.periodPillGroup, { backgroundColor: theme.mutedBg }]}>
                  {['Week', 'Month', 'Year'].map(period => {
                    const isActive = statTimeframe === period;
                    return (
                      <TouchableOpacity
                        key={period}
                        style={[
                          styles.periodBtn,
                          isActive && styles.periodBtnActive,
                        ]}
                        onPress={() => setStatTimeframe(period)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.periodBtnText,
                            isActive && styles.periodBtnTextActive,
                          ]}
                        >
                          {period}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 4 Stat Cards Grid */}
              <View style={styles.statCardsGrid}>
                {/* Card 1: New Patients (Teal Highlighted Card as per Reference) */}
                <View style={styles.statBoxTealHighlight}>
                  <View style={styles.statBoxTopRow}>
                    <Text style={styles.statNumberWhite}>{currentStats.newPatients}</Text>
                    <View style={styles.pillBadgeWhite}>
                      <Ionicons name="arrow-down" size={11} color="#0D9488" />
                      <Text style={styles.pillBadgeWhiteText}>{currentStats.newDiff}</Text>
                    </View>
                  </View>
                  <Text style={styles.statLabelWhite}>New patients</Text>
                </View>

                {/* Card 2: Total Patients */}
                <View style={[styles.statBoxStandard, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                  <View style={styles.statBoxTopRow}>
                    <Text style={[styles.statNumberStandard, { color: theme.textPrimary }]}>{currentStats.totalPatients}</Text>
                    <View style={styles.pillBadgeTealSubtle}>
                      <Ionicons name="arrow-up" size={11} color="#0D9488" />
                      <Text style={styles.pillBadgeTealSubtleText}>{currentStats.totalDiff}</Text>
                    </View>
                  </View>
                  <Text style={styles.statLabelMuted}>Total patients</Text>
                </View>

                {/* Card 3: Time to appt. */}
                <View style={[styles.statBoxStandard, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                  <View style={styles.statBoxTopRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                      <Text style={[styles.statNumberStandard, { color: theme.textPrimary }]}>{currentStats.timeToAppt}</Text>
                      <Text style={styles.statUnitText}>min</Text>
                    </View>
                    <View style={styles.pillBadgeEmeraldSubtle}>
                      <Ionicons name="arrow-down" size={11} color="#10B981" />
                      <Text style={styles.pillBadgeEmeraldSubtleText}>{currentStats.timeDiff}</Text>
                    </View>
                  </View>
                  <View style={styles.statLabelRow}>
                    <Text style={styles.statLabelMuted}>Time to appt.</Text>
                    <Ionicons name="information-circle-outline" size={13} color="#94A3B8" />
                  </View>
                </View>

                {/* Card 4: PSS Score */}
                <View style={[styles.statBoxStandard, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                  <View style={styles.statBoxTopRow}>
                    <Text style={[styles.statNumberStandard, { color: theme.textPrimary }]}>{currentStats.pss}</Text>
                    <View style={styles.pillBadgeTealSubtle}>
                      <Ionicons name="arrow-up" size={11} color="#0D9488" />
                      <Text style={styles.pillBadgeTealSubtleText}>{currentStats.pssDiff}</Text>
                    </View>
                  </View>
                  <View style={styles.statLabelRow}>
                    <Text style={styles.statLabelMuted}>PSS Score</Text>
                    <Ionicons name="information-circle-outline" size={13} color="#94A3B8" />
                  </View>
                </View>
              </View>
            </View>

            {/* -------------------------------------------------------- */}
            {/* CARD 2: NEXT APPOINTMENTS (Matching HTML List)           */}
            {/* -------------------------------------------------------- */}
            <View style={[styles.cardContainer, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <View style={styles.cardHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.cardMainHeading, { color: theme.textPrimary }]}>Next Appointments</Text>
                  <View style={styles.counterBadgeTeal}>
                    <Text style={styles.counterBadgeTealText}>6 Upcoming</Text>
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
                  <Ionicons name="arrow-forward" size={13} color="#0D9488" />
                </TouchableOpacity>
              </View>

              {/* Appointments List */}
              <View style={styles.nextApptsListWrap}>
                {nextAppointmentsData.map((apt) => {
                  const isVideo = apt.type === 'Video';
                  return (
                    <View
                      key={apt.id}
                      style={[
                        styles.nextApptItemCard,
                        { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder },
                      ]}
                    >
                      {/* Left: Time & Patient Details */}
                      <View style={styles.nextApptLeftCol}>
                        {/* Time Badge */}
                        <View style={styles.nextApptTimeBadge}>
                          <Ionicons
                            name={isVideo ? 'videocam' : 'business'}
                            size={13}
                            color="#0D9488"
                          />
                          <Text style={styles.nextApptTimeText}>{apt.time}</Text>
                        </View>

                        {/* Patient Initials Avatar */}
                        <View style={[styles.nextApptAvatarBox, { backgroundColor: apt.avatarBg }]}>
                          <Text style={[styles.nextApptAvatarText, { color: apt.avatarColor }]}>
                            {apt.initials}
                          </Text>
                        </View>

                        {/* Patient Meta */}
                        <View style={styles.nextApptMetaCol}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <Text style={[styles.nextApptName, { color: theme.textPrimary }]}>{apt.patientName}</Text>
                            <Text style={styles.nextApptDemographics}>{apt.patientDetails}</Text>
                            <View style={styles.bloodGroupPill}>
                              <Text style={styles.bloodGroupText}>🩸 {apt.bloodGroup}</Text>
                            </View>
                          </View>
                          <Text style={styles.nextApptCondition} numberOfLines={1}>
                            {apt.condition}
                          </Text>
                        </View>
                      </View>

                      {/* Right: Status Pill & Start Consult Button */}
                      <View style={styles.nextApptRightCol}>
                        <View style={styles.statusPillBox}>
                          <View style={[styles.statusDot, { backgroundColor: apt.statusColor }]} />
                          <Text style={[styles.statusPillText, { color: theme.textPrimary }]}>{apt.status}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.startConsultBtnTeal}
                          onPress={() => handleDirectStartConsult(apt)}
                          activeOpacity={0.85}
                        >
                          <Ionicons name="pulse" size={14} color="#FFFFFF" />
                          <Text style={styles.startConsultBtnText}>Start Consult</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* -------------------------------------------------------- */}
            {/* CARDS 3 & 4: ANALYTICS (TREND CHART & PATIENTS FOLLOW-UP)*/}
            {/* -------------------------------------------------------- */}
            <View style={[styles.analyticsGridRow, isNarrow && styles.analyticsGridRowNarrow]}>
              {/* Left Sub-Card: New Patients Trend Bar Chart */}
              <View style={[styles.cardContainer, styles.subCardHalf, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={[styles.cardSubHeading, { color: theme.textPrimary }]}>New patients</Text>
                    <Text style={styles.cardSubTagline}>Weekly patient registration trends</Text>
                  </View>
                  <View style={styles.counterBadgeTeal}>
                    <Text style={styles.counterBadgeTealText}>8 Total</Text>
                  </View>
                </View>

                {/* Bar Chart Visual (Responsive React Native Bar Representation) */}
                <View style={styles.chartWrapper}>
                  <View style={styles.barChartContainer}>
                    {weeklyTrends.map((item) => {
                      const barHeightPercent = Math.round((item.value / maxTrendValue) * 100);
                      const isPeak = item.value === 8;
                      return (
                        <View key={item.day} style={styles.barColumn}>
                          <View style={styles.barTrack}>
                            <View
                              style={[
                                styles.barFill,
                                {
                                  height: `${barHeightPercent}%`,
                                  backgroundColor: isPeak ? '#0D9488' : '#14B8A6',
                                },
                              ]}
                            />
                          </View>
                          <Text style={[styles.barDayLabel, isPeak && styles.barDayLabelActive]}>
                            {item.day}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Right Sub-Card: Patients Follow-up */}
              <View style={[styles.cardContainer, styles.subCardHalf, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={[styles.cardSubHeading, { color: theme.textPrimary }]}>Patients follow-up</Text>
                    <Text style={styles.cardSubTagline}>Scheduled post-consult reviews</Text>
                  </View>
                  <TouchableOpacity style={styles.dropdownSelectorPill}>
                    <Text style={styles.dropdownSelectorText}>All</Text>
                    <Ionicons name="chevron-down" size={11} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Follow-up Items */}
                <View style={styles.followupListWrap}>
                  {followupPatients.map((patient) => (
                    <TouchableOpacity
                      key={patient.id}
                      style={[styles.followupItemRow, { backgroundColor: theme.mutedBg }]}
                      onPress={() => handleOpenPatientPreview(patient)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.followupAvatarBox, { backgroundColor: patient.avatarBg }]}>
                        <Text style={[styles.followupAvatarText, { color: patient.avatarColor }]}>
                          {patient.initials}
                        </Text>
                      </View>
                      <View style={styles.followupInfoCol}>
                        <Text style={[styles.followupName, { color: theme.textPrimary }]}>{patient.name}</Text>
                        <Text style={styles.followupSubText} numberOfLines={1}>
                          {patient.diagnosis}
                        </Text>
                      </View>
                      <View style={styles.followupBadgePill}>
                        <Text style={styles.followupBadgeText}>{patient.timeBadge}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={14} color="#0D9488" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* -------------------------------------------------------- */}
            {/* GO FOR MEDIUNIFY CLINICAL BANNER (Preserved Feature)     */}
            {/* -------------------------------------------------------- */}
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
                <Text style={styles.goMediUnifyActionBtnText}>Open OPD Queue</Text>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* ========================================================== */}
          {/* RIGHT SIDE PANEL: Schedule Timeline Stream                 */}
          {/* ========================================================== */}
          <View style={[styles.rightColumn, isNarrow && styles.rightColumnNarrow]}>
            <View style={[styles.cardContainer, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              {/* Header: Schedule + Count + Today/Week selector */}
              <View style={styles.cardHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.cardMainHeading, { color: theme.textPrimary }]}>Schedule</Text>
                  <View style={styles.scheduleCountBadge}>
                    <Text style={styles.scheduleCountBadgeText}>{filteredTimeline.length}</Text>
                  </View>
                </View>
                {/* Today / This Week buttons */}
                <View style={[styles.periodPillGroup, { backgroundColor: theme.mutedBg }]}>
                  <TouchableOpacity
                    style={[styles.periodBtn, scheduleView === 'today' && styles.periodBtnActive]}
                    onPress={() => setScheduleView('today')}
                  >
                    <Text style={[styles.periodBtnText, scheduleView === 'today' && styles.periodBtnTextActive]}>
                      Today
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.periodBtn, scheduleView === 'week' && styles.periodBtnActive]}
                    onPress={() => setScheduleView('week')}
                  >
                    <Text style={[styles.periodBtnText, scheduleView === 'week' && styles.periodBtnTextActive]}>
                      This week
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Heading */}
              <Text style={styles.scheduleDateLabel}>Today, 15 Jun, Wed</Text>

              {/* Filter Tabs: All, In-Person, Video */}
              <View style={[styles.timelineFilterBar, { backgroundColor: theme.mutedBg }]}>
                <TouchableOpacity
                  style={[styles.timelineFilterBtn, scheduleFilter === 'all' && styles.timelineFilterBtnActive]}
                  onPress={() => setScheduleFilter('all')}
                >
                  <Text style={[styles.timelineFilterBtnText, scheduleFilter === 'all' && styles.timelineFilterBtnTextActive]}>
                    All ({scheduleTimelineData.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.timelineFilterBtn, scheduleFilter === 'in-person' && styles.timelineFilterBtnActive]}
                  onPress={() => setScheduleFilter('in-person')}
                >
                  <Text style={[styles.timelineFilterBtnText, scheduleFilter === 'in-person' && styles.timelineFilterBtnTextActive]}>
                    In-Person ({inPersonTimelineCount})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.timelineFilterBtn, scheduleFilter === 'video' && styles.timelineFilterBtnActive]}
                  onPress={() => setScheduleFilter('video')}
                >
                  <Text style={[styles.timelineFilterBtnText, scheduleFilter === 'video' && styles.timelineFilterBtnTextActive]}>
                    Video ({videoTimelineCount})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Vertical Timeline Guide & Slots */}
              <View style={styles.timelineGuideWrapper}>
                <View style={styles.verticalTimelineRule} />

                {filteredTimeline.map((slot) => {
                  const isVideo = slot.type === 'Video';
                  const isNext = slot.isNext;

                  return (
                    <View key={slot.id} style={styles.timelineSlotRow}>
                      {/* Timeline Node Dot */}
                      <View
                        style={[
                          styles.timelineNodeCircle,
                          isNext ? styles.timelineNodeCircleActive : styles.timelineNodeCircleNormal,
                        ]}
                      />

                      {/* Content Card */}
                      <View style={styles.timelineSlotContentBox}>
                        <Text style={styles.timelineSlotTime}>{slot.time}</Text>

                        <View
                          style={[
                            styles.timelineCard,
                            isNext && styles.timelineCardNext,
                            { backgroundColor: theme.mutedBg, borderColor: isNext ? '#0D9488' : theme.subtleBorder },
                          ]}
                        >
                          {/* Header: Avatar, Name, Channel Badge */}
                          <View style={styles.timelineCardHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                              <View style={[styles.timelineAvatar, { backgroundColor: slot.avatarBg }]}>
                                <Text style={[styles.timelineAvatarText, { color: slot.avatarColor }]}>
                                  {slot.initials}
                                </Text>
                              </View>
                              <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                  <Text style={[styles.timelinePatientName, { color: theme.textPrimary }]}>{slot.name}</Text>
                                  {isNext && (
                                    <View style={styles.nextPillTag}>
                                      <Text style={styles.nextPillTagText}>NEXT</Text>
                                    </View>
                                  )}
                                </View>
                                <Text style={styles.timelinePatientMeta}>
                                  {slot.gender}, {slot.age} y.o.
                                </Text>
                              </View>
                            </View>

                            <View style={[styles.channelBadge, isVideo ? styles.channelBadgeVideo : styles.channelBadgeInPerson]}>
                              <Ionicons
                                name={isVideo ? 'videocam' : 'business'}
                                size={11}
                                color={isVideo ? '#0D9488' : '#0F1F38'}
                              />
                              <Text style={[styles.channelBadgeText, { color: isVideo ? '#0D9488' : '#0F1F38' }]}>
                                {slot.type}
                              </Text>
                            </View>
                          </View>

                          {/* Time Range Pill with Clock */}
                          <View style={[styles.clockTimePill, { backgroundColor: theme.cardBg }]}>
                            <Ionicons name="time" size={13} color="#0D9488" />
                            <Text style={styles.clockTimePillText}>{slot.timeRange}</Text>
                          </View>

                          {/* Condition & Room */}
                          <View style={[styles.reasonRoomBox, { borderTopColor: theme.subtleBorder }]}>
                            <Text style={[styles.reasonText, { color: theme.textPrimary }]}>{slot.reason}</Text>
                            <View style={styles.roomRow}>
                              <Ionicons name="location-outline" size={12} color="#0D9488" />
                              <Text style={styles.roomText} numberOfLines={1}>{slot.room}</Text>
                            </View>
                          </View>

                          {/* Action Buttons: Patients Details + Join Video Call / Start Consult */}
                          <View style={styles.timelineActionsRow}>
                            <TouchableOpacity
                              style={[styles.btnDetailsSecondary, { backgroundColor: theme.cardBg, borderColor: theme.subtleBorder }]}
                              onPress={() => handleViewPatientDetails(slot)}
                              activeOpacity={0.8}
                            >
                              <Text style={[styles.btnDetailsSecondaryText, { color: theme.textPrimary }]}>Patients Details</Text>
                            </TouchableOpacity>

                            {isVideo ? (
                              <TouchableOpacity
                                style={styles.btnActionTeal}
                                onPress={() => handleDirectStartConsult(slot)}
                                activeOpacity={0.85}
                              >
                                <Ionicons name="videocam" size={13} color="#FFFFFF" />
                                <Text style={styles.btnActionTealText}>Join Call</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={styles.btnActionTeal}
                                onPress={() => handleViewPatientDetails(slot)}
                                activeOpacity={0.85}
                              >
                                <Ionicons name="pulse" size={13} color="#FFFFFF" />
                                <Text style={styles.btnActionTealText}>Start Consult</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* ============================================================== */}
        {/* 3. CLINICAL SUITE FOOTER (Preserved System Support)           */}
        {/* ============================================================== */}
        <View style={styles.dashboardFooter}>
          <View style={styles.footerTopRow}>
            <View style={styles.footerBrandCol}>
              <View style={styles.footerLogoRow}>
                <View style={styles.footerLogoBadge}>
                  <Ionicons name="pulse" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.footerBrandText}>
                  Medi<Text style={{ color: '#00B894' }}>unify</Text>
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

            <View style={styles.footerLinksCol}>
              <Text style={styles.footerLinksHeading}>Quick Clinical Links</Text>
              <View style={styles.footerLinksGrid}>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('appointments')}>
                  <Text style={styles.footerLinkText}>Appointments & OPD Queue</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('followups')}>
                  <Text style={styles.footerLinkText}>Patients Follow-ups</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('availability')}>
                  <Text style={styles.footerLinkText}>Consultation Availability</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab && setActiveTab('profile')}>
                  <Text style={styles.footerLinkText}>Doctor Profile & Practice</Text>
                </TouchableOpacity>
              </View>
            </View>

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
            </View>
          </View>

          <View style={styles.footerBottomBar}>
            <Text style={styles.footerCopyrightText}>
              © 2026 Mediunify Health Systems Inc. All clinical documentation and health records are confidential & protected.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ============================================================== */}
      {/* 4. PATIENT PREVIEW SLIDE-OVER DRAWER MODAL (From HTML)         */}
      {/* ============================================================== */}
      <Modal
        visible={showPreviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.slideOverDrawerCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            {/* Header */}
            <View style={[styles.drawerHeaderRow, { borderBottomColor: theme.subtleBorder }]}>
              <View style={styles.drawerHeaderLeft}>
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>{selectedPatient ? selectedPatient.initials : 'PT'}</Text>
                </View>
                <View>
                  <Text style={[styles.drawerPatientName, { color: theme.textPrimary }]}>{selectedPatient ? selectedPatient.name : ''}</Text>
                  <Text style={styles.drawerPatientDetails}>{selectedPatient ? selectedPatient.details : ''}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowPreviewModal(false)}
                style={styles.drawerCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.drawerBodyScroll} showsVerticalScrollIndicator={false}>
              {/* Quick Vital Stats Grid (BP, Heart Rate, Blood Group) */}
              <View style={styles.vitalsGridThree}>
                <View style={[styles.vitalCardBox, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                  <Text style={styles.vitalLabel}>BLOOD PRESSURE</Text>
                  <Text style={[styles.vitalValuePrimary, { color: theme.textPrimary }]}>128/82 mmHg</Text>
                </View>
                <View style={[styles.vitalCardBox, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                  <Text style={styles.vitalLabel}>HEART RATE</Text>
                  <Text style={[styles.vitalValuePrimary, { color: '#0D9488' }]}>74 bpm</Text>
                </View>
                <View style={[styles.vitalCardBox, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                  <Text style={styles.vitalLabel}>BLOOD GROUP</Text>
                  <Text style={[styles.vitalValuePrimary, { color: '#E11D48' }]}>
                    {selectedPatient ? selectedPatient.bloodGroup : 'B+'}
                  </Text>
                </View>
              </View>

              {/* Clinical Diagnosis Objective */}
              <View style={styles.clinicalObjectiveCard}>
                <Text style={styles.clinicalObjectiveHeader}>CLINICAL OBJECTIVE / DIAGNOSIS</Text>
                <Text style={[styles.clinicalObjectiveBody, { color: theme.textPrimary }]}>
                  {selectedPatient ? selectedPatient.diagnosis : 'Cardiovascular review & lipid maintenance.'}
                </Text>
              </View>

              {/* Current Medications & Dosages */}
              <View style={styles.medicationsSection}>
                <Text style={styles.sectionSmallHeading}>CURRENT MEDICATIONS & DOSAGES</Text>
                <View style={styles.medicationList}>
                  <View style={[styles.medicationRow, { backgroundColor: theme.mutedBg }]}>
                    <View>
                      <Text style={[styles.medicationName, { color: theme.textPrimary }]}>Atorvastatin 20mg</Text>
                      <Text style={styles.medicationInstruction}>Once daily at bedtime</Text>
                    </View>
                    <View style={styles.activePillBadge}>
                      <Text style={styles.activePillText}>Active</Text>
                    </View>
                  </View>

                  <View style={[styles.medicationRow, { backgroundColor: theme.mutedBg }]}>
                    <View>
                      <Text style={[styles.medicationName, { color: theme.textPrimary }]}>Lisinopril 10mg</Text>
                      <Text style={styles.medicationInstruction}>Morning dosage with water</Text>
                    </View>
                    <View style={styles.activePillBadge}>
                      <Text style={styles.activePillText}>Active</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Recent Lab Reports */}
              <View style={styles.labReportsSection}>
                <Text style={styles.sectionSmallHeading}>RECENT LAB REPORTS</Text>
                <View style={[styles.labReportCard, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={styles.pdfBadge}>
                      <Text style={styles.pdfBadgeText}>PDF</Text>
                    </View>
                    <View>
                      <Text style={[styles.labReportTitle, { color: theme.textPrimary }]}>Lipid Profile & Serum Cholesterol.pdf</Text>
                      <Text style={styles.labReportMeta}>Uploaded 2 days ago • 2.4 MB</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.btnViewReport, { backgroundColor: theme.cardBg, borderColor: theme.subtleBorder }]}>
                    <Text style={[styles.btnViewReportText, { color: theme.textPrimary }]}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={[styles.drawerFooterRow, { borderTopColor: theme.subtleBorder }]}>
              <TouchableOpacity
                style={[styles.btnDrawerClose, { backgroundColor: theme.mutedBg }]}
                onPress={() => setShowPreviewModal(false)}
              >
                <Text style={[styles.btnDrawerCloseText, { color: theme.textPrimary }]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDrawerStartConsult}
                onPress={() => {
                  setShowPreviewModal(false);
                  handleDirectStartConsult(selectedPatient);
                }}
              >
                <Ionicons name="pulse" size={16} color="#FFFFFF" />
                <Text style={styles.btnDrawerStartConsultText}>Start Consultation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 5. ACTIVE CONSULTATION MODAL (From HTML)                       */}
      {/* ============================================================== */}
      <Modal
        visible={showConsultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConsultModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.consultModalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.modalHeaderRow, { borderBottomColor: theme.subtleBorder }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.consultPulseDot} />
                <Text style={[styles.consultModalTitle, { color: theme.textPrimary }]}>
                  Active Consultation: {activeConsultPatient ? activeConsultPatient.patientName || activeConsultPatient.name : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowConsultModal(false)}>
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.consultModalBody}>
              <View style={[styles.consultInfoBar, { backgroundColor: theme.mutedBg }]}>
                <View>
                  <Text style={styles.vitalLabel}>Condition / Symptoms</Text>
                  <Text style={[styles.consultConditionText, { color: theme.textPrimary }]}>
                    {activeConsultPatient ? (activeConsultPatient.condition || activeConsultPatient.reason) : ''}
                  </Text>
                </View>
                <View>
                  <Text style={styles.vitalLabel}>Blood Group</Text>
                  <Text style={styles.consultBloodText}>
                    {activeConsultPatient ? (activeConsultPatient.bloodGroup || 'B+') : 'B+'}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 4 }}>
                <Text style={styles.fieldLabel}>Doctor's Diagnosis & Notes</Text>
                <TextInput
                  style={[styles.consultTextArea, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder, color: theme.textPrimary }]}
                  placeholder="Enter patient clinical notes..."
                  placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
                  multiline={true}
                  numberOfLines={3}
                  value={consultDiagnosisNotes}
                  onChangeText={setConsultDiagnosisNotes}
                />
              </View>

              <View style={{ gap: 4 }}>
                <Text style={styles.fieldLabel}>Prescription / Medication</Text>
                <TextInput
                  style={[styles.consultInput, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder, color: theme.textPrimary }]}
                  placeholder="e.g. Lisinopril 10mg daily"
                  placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
                  value={consultPrescription}
                  onChangeText={setConsultPrescription}
                />
              </View>
            </View>

            <View style={[styles.consultModalFooter, { borderTopColor: theme.subtleBorder }]}>
              <TouchableOpacity
                style={[styles.btnConsultSecondary, { backgroundColor: theme.mutedBg }]}
                onPress={() => setShowConsultModal(false)}
              >
                <Text style={[styles.btnConsultSecondaryText, { color: theme.textPrimary }]}>Save & End</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnConsultPrimary}
                onPress={() => {
                  setShowConsultModal(false);
                  if (setActiveTab) setActiveTab('appointments');
                }}
              >
                <Text style={styles.btnConsultPrimaryText}>Complete Consultation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* 6. PATIENT DOSSIER ARCHIVE MODAL (From HTML)                   */}
      {/* ============================================================== */}
      <Modal
        visible={showPatientDossier}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPatientDossier(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.dossierModalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.modalHeaderRow, { borderBottomColor: theme.subtleBorder }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.dossierBadge}>
                  <Text style={styles.dossierBadgeText}>PD</Text>
                </View>
                <View>
                  <Text style={[styles.dossierModalTitle, { color: theme.textPrimary }]}>Patient Dossier Archive</Text>
                  <Text style={styles.dossierModalSub}>Mediunify Secure Patient Records</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowPatientDossier(false)}>
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.dossierMetricsGrid}>
              <View style={[styles.dossierMetricBox, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                <Text style={styles.vitalLabel}>Total Registered Dossiers</Text>
                <Text style={[styles.dossierMetricValue, { color: theme.textPrimary }]}>42 Patients</Text>
              </View>
              <View style={[styles.dossierMetricBox, { backgroundColor: theme.mutedBg, borderColor: theme.subtleBorder }]}>
                <Text style={styles.vitalLabel}>Pending Lab Reports</Text>
                <Text style={[styles.dossierMetricValue, { color: '#0D9488' }]}>3 Reports</Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.sectionSmallHeading}>RECENT PATIENT RECORDS</Text>
              <View style={[styles.dossierPatientRow, { backgroundColor: theme.mutedBg }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.timelineAvatar, { backgroundColor: '#0D9488' }]}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>PS</Text>
                  </View>
                  <View>
                    <Text style={[styles.nextApptName, { color: theme.textPrimary }]}>Priya Sharma</Text>
                    <Text style={styles.nextApptCondition}>Seasonal allergy symptoms & sinus congestion</Text>
                  </View>
                </View>
                <View style={styles.activePillBadge}>
                  <Text style={styles.activePillText}>Active Dossier</Text>
                </View>
              </View>

              <View style={[styles.dossierPatientRow, { backgroundColor: theme.mutedBg }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.timelineAvatar, { backgroundColor: '#0B1629' }]}>
                    <Text style={{ color: '#00B894', fontWeight: '800' }}>SI</Text>
                  </View>
                  <View>
                    <Text style={[styles.nextApptName, { color: theme.textPrimary }]}>Sneha Iyer</Text>
                    <Text style={styles.nextApptCondition}>Routine BP Check & Lipid Profile Review</Text>
                  </View>
                </View>
                <View style={styles.activePillBadge}>
                  <Text style={styles.activePillText}>Active Dossier</Text>
                </View>
              </View>
            </View>

            <View style={[styles.dossierFooterRow, { borderTopColor: theme.subtleBorder }]}>
              <TouchableOpacity
                style={styles.btnDossierClose}
                onPress={() => setShowPatientDossier(false)}
              >
                <Text style={styles.btnDossierCloseText}>Close Dossier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ====================================================================
// MEDIUNIFY DOCTOR DASHBOARD STYLESHEET (Teal #00B894 & Navy Blue)
// ====================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* 1. TOP HEADER */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 16,
    zIndex: 100,
    flexWrap: 'wrap',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flex: 1,
    maxWidth: 480,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.35)',
  },
  searchPillDark: {
    backgroundColor: 'rgba(11, 22, 41, 0.6)',
    borderColor: 'rgba(13, 148, 136, 0.3)',
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBtnActive: {
    borderWidth: 1.5,
    borderColor: '#0D9488',
  },
  notifBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0D9488',
  },

  /* Doctor Profile Pill */
  doctorProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  doctorAvatarBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarInitials: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  doctorMetaTextCol: {
    gap: 1,
  },
  doctorNameText: {
    fontSize: 12,
    fontWeight: '800',
  },
  doctorRoleText: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
  },
  profileDropdownMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 6,
    shadowColor: '#000000',
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
    fontSize: 12.5,
    fontWeight: '600',
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
    gap: 24,
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
    gap: 24,
    minWidth: 0,
  },
  leftColumnNarrow: {
    width: '100%',
    flex: 0,
    gap: 20,
  },

  /* Right Timeline Column */
  rightColumn: {
    flex: 1,
    minWidth: 340,
    gap: 24,
  },
  rightColumnNarrow: {
    width: '100%',
    flex: 0,
    minWidth: 0,
    gap: 20,
  },

  /* Card Containers */
  cardContainer: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    gap: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardMainHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cardSubHeading: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSubTagline: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* Period Pill Filters (Week, Month, Year) */
  periodPillGroup: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 3,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  periodBtnActive: {
    backgroundColor: '#0F1F38',
    shadowColor: '#0F1F38',
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

  /* 4 Stat Cards Grid */
  statCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  statBoxTealHighlight: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#0D9488',
    padding: 18,
    borderRadius: 18,
    justifyContent: 'space-between',
    gap: 14,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  statBoxStandard: {
    flex: 1,
    minWidth: 140,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'space-between',
    gap: 14,
  },
  statBoxTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statNumberWhite: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statNumberStandard: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statUnitText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statLabelWhite: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CCFBF1',
  },
  statLabelMuted: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillBadgeWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  pillBadgeWhiteText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pillBadgeTealSubtle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  pillBadgeTealSubtleText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0D9488',
  },
  pillBadgeEmeraldSubtle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  pillBadgeEmeraldSubtleText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#10B981',
  },

  /* Next Appointments Section */
  counterBadgeTeal: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  counterBadgeTealText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  viewAllApptsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllApptsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  nextApptsListWrap: {
    gap: 12,
  },
  nextApptItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    flexWrap: 'wrap',
  },
  nextApptLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 260,
  },
  nextApptTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },
  nextApptTimeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0D9488',
  },
  nextApptAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextApptAvatarText: {
    fontSize: 12,
    fontWeight: '800',
  },
  nextApptMetaCol: {
    flex: 1,
    gap: 2,
  },
  nextApptName: {
    fontSize: 13,
    fontWeight: '800',
  },
  nextApptDemographics: {
    fontSize: 11,
    color: '#64748B',
  },
  bloodGroupPill: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  bloodGroupText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E11D48',
  },
  nextApptCondition: {
    fontSize: 11.5,
    color: '#64748B',
  },
  nextApptRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusPillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  startConsultBtnTeal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0D9488',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  startConsultBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Analytics Grid Row */
  analyticsGridRow: {
    flexDirection: 'row',
    gap: 20,
  },
  analyticsGridRowNarrow: {
    flexDirection: 'column',
    gap: 20,
  },
  subCardHalf: {
    flex: 1,
    minWidth: 260,
  },

  /* Bar Chart Styling */
  chartWrapper: {
    height: 160,
    justifyContent: 'flex-end',
    paddingTop: 16,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingHorizontal: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    gap: 8,
  },
  barTrack: {
    width: 18,
    flex: 1,
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barDayLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  barDayLabelActive: {
    color: '#0D9488',
    fontWeight: '800',
  },

  /* Patients Follow-up List */
  dropdownSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dropdownSelectorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  followupListWrap: {
    gap: 10,
  },
  followupItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    gap: 10,
  },
  followupAvatarBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followupAvatarText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  followupInfoCol: {
    flex: 1,
    gap: 2,
  },
  followupName: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  followupSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  followupBadgePill: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  followupBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0D9488',
  },

  /* Go for MediUnify Banner Card */
  goMediUnifyBannerCard: {
    backgroundColor: '#0F1F38',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.35)',
    gap: 16,
    flexWrap: 'wrap',
  },
  goMediUnifyLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 260,
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
  },
  goMediUnifyPill: {
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  goMediUnifyPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00B894',
    textTransform: 'uppercase',
  },
  goMediUnifySubText: {
    fontSize: 12,
    color: '#94A3B8',
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
  },
  goMediUnifyActionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Schedule Timeline (Right Column) */
  scheduleCountBadge: {
    backgroundColor: '#0F1F38',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  scheduleCountBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00B894',
  },
  scheduleDateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  timelineFilterBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  timelineFilterBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 10,
  },
  timelineFilterBtnActive: {
    backgroundColor: '#0F1F38',
  },
  timelineFilterBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  timelineFilterBtnTextActive: {
    color: '#FFFFFF',
  },
  timelineGuideWrapper: {
    position: 'relative',
    gap: 16,
    paddingLeft: 4,
  },
  verticalTimelineRule: {
    position: 'absolute',
    left: 10,
    top: 14,
    bottom: 20,
    width: 2,
    backgroundColor: 'rgba(13, 148, 136, 0.25)',
  },
  timelineSlotRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    position: 'relative',
  },
  timelineNodeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginTop: 6,
    zIndex: 2,
  },
  timelineNodeCircleNormal: {
    backgroundColor: '#94A3B8',
  },
  timelineNodeCircleActive: {
    backgroundColor: '#0D9488',
  },
  timelineSlotContentBox: {
    flex: 1,
    gap: 6,
  },
  timelineSlotTime: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  timelineCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  timelineCardNext: {
    borderWidth: 1.5,
  },
  timelineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineAvatarText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  timelinePatientName: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  nextPillTag: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  nextPillTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timelinePatientMeta: {
    fontSize: 10.5,
    color: '#64748B',
  },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  channelBadgeVideo: {
    backgroundColor: '#F0FDFA',
  },
  channelBadgeInPerson: {
    backgroundColor: '#F1F5F9',
  },
  channelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  clockTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  clockTimePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0D9488',
  },
  reasonRoomBox: {
    borderTopWidth: 1,
    paddingTop: 8,
    gap: 2,
  },
  reasonText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roomText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  timelineActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  btnDetailsSecondary: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnDetailsSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  btnActionTeal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#0D9488',
    paddingVertical: 7,
    borderRadius: 10,
  },
  btnActionTealText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* FOOTER */
  dashboardFooter: {
    marginTop: 24,
    backgroundColor: '#0F1F38',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 24,
    gap: 20,
  },
  footerTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerBrandCol: {
    flex: 1.4,
    minWidth: 240,
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
  },
  footerVersionPill: {
    backgroundColor: 'rgba(0, 184, 148, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  footerVersionText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#00B894',
  },
  footerBrandTagline: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 16,
    maxWidth: 360,
  },
  footerCertRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  footerCertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerCertText: {
    fontSize: 10.5,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  footerLinksCol: {
    flex: 1,
    minWidth: 180,
    gap: 10,
  },
  footerLinksHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  footerLinksGrid: {
    gap: 7,
  },
  footerLinkText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  footerStatusCol: {
    flex: 1.1,
    minWidth: 200,
    gap: 10,
  },
  footerStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    gap: 5,
  },
  statusPulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00B894',
  },
  statusPulseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusMetricText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  footerBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerCopyrightText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },

  /* MODALS & DRAWERS */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 22, 41, 0.65)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  slideOverDrawerCard: {
    width: '100%',
    maxWidth: 540,
    height: '100%',
    borderLeftWidth: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  drawerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  drawerPatientName: {
    fontSize: 16,
    fontWeight: '800',
  },
  drawerPatientDetails: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0D9488',
    marginTop: 2,
  },
  drawerCloseBtn: {
    padding: 4,
  },
  drawerBodyScroll: {
    flex: 1,
    paddingVertical: 18,
  },
  vitalsGridThree: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  vitalCardBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  vitalLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  vitalValuePrimary: {
    fontSize: 14,
    fontWeight: '800',
  },
  clinicalObjectiveCard: {
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.25)',
    padding: 14,
    gap: 6,
    marginBottom: 18,
  },
  clinicalObjectiveHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
  },
  clinicalObjectiveBody: {
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 18,
  },
  medicationsSection: {
    marginBottom: 18,
    gap: 8,
  },
  sectionSmallHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  medicationList: {
    gap: 8,
  },
  medicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  medicationName: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  medicationInstruction: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  activePillBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  labReportsSection: {
    gap: 8,
    marginBottom: 16,
  },
  labReportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  pdfBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
  },
  labReportTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  labReportMeta: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  btnViewReport: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  btnViewReportText: {
    fontSize: 11,
    fontWeight: '700',
  },
  drawerFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  btnDrawerClose: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnDrawerCloseText: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnDrawerStartConsult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0D9488',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnDrawerStartConsultText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Active Consultation Modal */
  consultModalCard: {
    width: '90%',
    maxWidth: 500,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  consultPulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D9488',
  },
  consultModalTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  consultModalBody: {
    gap: 12,
  },
  consultInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  consultConditionText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  consultBloodText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E11D48',
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  consultTextArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    fontSize: 12.5,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  consultInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    fontSize: 12.5,
  },
  consultModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  btnConsultSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnConsultSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnConsultPrimary: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnConsultPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Dossier Modal */
  dossierModalCard: {
    width: '92%',
    maxWidth: 580,
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
    gap: 16,
    alignSelf: 'center',
    maxHeight: '90%',
  },
  dossierBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dossierBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dossierModalTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  dossierModalSub: {
    fontSize: 11,
    color: '#64748B',
  },
  dossierMetricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  dossierMetricBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  dossierMetricValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  dossierPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
  },
  dossierFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  btnDossierClose: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnDossierCloseText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* NOTIFICATION POPOVER */
  notifPopoverCard: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 360,
    maxHeight: 520,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
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
    borderBottomColor: '#0D9488',
  },
  notifTabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  notifTabTextActive: {
    color: '#0D9488',
    fontWeight: '800',
  },
  notifTabCountPill: {
    backgroundColor: '#0D9488',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  notifTabCountText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  notifSettingsBtn: {
    padding: 4,
  },
  notifListScroll: {
    maxHeight: 360,
  },
  notifItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  notifAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notifAvatarText: {
    fontSize: 12,
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
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 17,
    flex: 1,
  },
  notifUnreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0D9488',
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
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  notifDeclineBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  notifAcceptBtn: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#0D9488',
  },
  notifAcceptBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notifAttachmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  notifAttachmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});
