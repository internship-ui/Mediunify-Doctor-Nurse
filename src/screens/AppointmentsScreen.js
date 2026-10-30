import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import Logo from '../components/Logo';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import RescheduleModal from '../components/RescheduleModal';
import { colors, spacing, typography, radius } from '../theme/colors';
import { appointments as initialAppointments } from '../data/mockData';

const TYPES = [
  { key: 'In-Person', label: 'In-Person', icon: 'business-outline' },
  { key: 'Video', label: 'Video Consultation', icon: 'videocam-outline' },
];

const STATUS_FILTERS = [
  { key: 'today', label: 'Today', icon: 'calendar-outline' },
  { key: 'upcoming', label: 'Upcoming', icon: 'time-outline' },
  { key: 'pending', label: 'Pending', icon: 'hourglass-outline' },
  { key: 'rescheduled', label: 'Rescheduled', icon: 'refresh-outline' },
  { key: 'overdue', label: 'Overdue', icon: 'alert-circle-outline' },
];

const AVAILABLE_TIMES = [
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
];

const MONTHS = [
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

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

const RESCHEDULE_REASONS = [
  'Doctor emergency / unavailable',
  'Surgery / Hospital duty conflict',
  'Patient requested alternate time',
  'Clinic holiday / Maintenance',
  'Awaiting lab / diagnostic reports',
  'Other clinical reason',
];

const DATES_STRIP = [
  { dayName: 'Mon', dayNum: 28, fullDate: '28 Sep 2026' },
  { dayName: 'Tue', dayNum: 29, fullDate: '29 Sep 2026' },
  { dayName: 'Wed', dayNum: 30, fullDate: '30 Sep 2026', isToday: true },
  { dayName: 'Thu', dayNum: 1, fullDate: '01 Oct 2026' },
  { dayName: 'Fri', dayNum: 2, fullDate: '02 Oct 2026' },
  { dayName: 'Sat', dayNum: 3, fullDate: '03 Oct 2026' },
  { dayName: 'Sun', dayNum: 4, fullDate: '04 Oct 2026' },
  { dayName: 'Mon', dayNum: 5, fullDate: '05 Oct 2026' },
  { dayName: 'Tue', dayNum: 6, fullDate: '06 Oct 2026' },
  { dayName: 'Wed', dayNum: 7, fullDate: '07 Oct 2026' },
];

export default function AppointmentsScreen({ navigation, route }) {
  const [activeType, setActiveType] = useState(route?.params?.initialType || 'In-Person');
  const [filter, setFilter] = useState('today');
  const [list, setList] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateItem, setSelectedDateItem] = useState(30); // 30 is Wed 30 (Today)
  const searchInputRef = useRef(null);

  // Acceptance state tracking for Today's appointments (a1 Video confirmed initially)
  const [acceptedMap, setAcceptedMap] = useState({
    a1: true,
  });

  const handleAcceptAppointment = (itemOrId) => {
    const id = typeof itemOrId === 'object' && itemOrId !== null ? itemOrId.id : itemOrId;
    setAcceptedMap((prev) => ({ ...prev, [id]: true }));
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'confirmed' } : a)));
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Initiate an emergency call for an urgent patient case?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  // Reschedule Popup Modal State
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [rescheduleToast, setRescheduleToast] = useState(null);

  // Dedicated Popups for Overdate, Waiting Acceptance, and Upcoming
  const [overdateModalAppt, setOverdateModalAppt] = useState(null);
  const [waitingAcceptModalAppt, setWaitingAcceptModalAppt] = useState(null);
  const [upcomingModalAppt, setUpcomingModalAppt] = useState(null);

  const byType = useMemo(() => list.filter((a) => a.type === activeType), [list, activeType]);

  const counts = useMemo(() => ({
    today: byType.filter((a) => (a.date === 'Today' || a.date === '30 Sep 2026' || a.date === '15 Sep 2026') && a.status !== 'cancelled').length,
    upcoming: byType.filter((a) => a.status === 'upcoming' || a.date === 'Tomorrow' || (a.status === 'confirmed' && a.date !== 'Today')).length,
    pending: byType.filter((a) => a.status === 'pending').length,
    rescheduled: byType.filter((a) => a.status === 'rescheduled').length,
    overdue: byType.filter((a) => a.status === 'overdue').length,
  }), [byType]);

  const filtered = useMemo(() => {
    return byType.filter((a) => {
      // Date filter
      if (selectedDateItem && selectedDateItem !== 30) {
        const itemDateStr = `${selectedDateItem} Sep 2026`;
        const itemDateStrOct = `${selectedDateItem < 10 ? '0' + selectedDateItem : selectedDateItem} Oct 2026`;
        const matchesDate = a.date === itemDateStr || a.date === itemDateStrOct;
        if (!matchesDate) return false;
      } else {
        if (filter === 'today') {
          const isTodayAppt = (a.date === 'Today' || a.date === '30 Sep 2026' || a.date === '15 Sep 2026') && a.status !== 'cancelled';
          if (!isTodayAppt) return false;
        } else if (filter === 'upcoming') {
          const isUpcoming = a.status === 'upcoming' || a.date === 'Tomorrow' || (a.status === 'confirmed' && a.date !== 'Today');
          if (!isUpcoming) return false;
        } else if (a.status !== filter) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchPatient = a.patient?.toLowerCase().includes(q);
        const matchReason = a.reason?.toLowerCase().includes(q);
        const matchTime = a.time?.toLowerCase().includes(q);
        const matchId = a.id?.toLowerCase().includes(q);
        return matchPatient || matchReason || matchTime || matchId;
      }

      return true;
    });
  }, [byType, filter, selectedDateItem, searchQuery]);

  const updateStatus = (id, status) => {
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const openRescheduleModal = (appt) => {
    setRescheduleAppt(appt);
    setRescheduleModalVisible(true);
  };

  const handleConfirmReschedule = (rescheduledData) => {
    const { id, patient, date, time, reason, note } = rescheduledData;
    setList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'rescheduled',
              date,
              time,
              rescheduleReason: reason,
              rescheduleNote: note,
              previousDate: a.date,
              previousTime: a.time,
            }
          : a
      )
    );

    setRescheduleModalVisible(false);
    setRescheduleToast({
      patient,
      date,
      time,
    });
    setTimeout(() => {
      setRescheduleToast(null);
    }, 4000);
  };

  const startAppointment = (appt) => {
    if (appt.type === 'Video') {
      navigation.navigate('VideoConsultation', { patientId: appt.patientId, appointmentId: appt.id, appointment: appt });
    } else {
      navigation.navigate('Consultation', { patientId: appt.patientId, appointmentId: appt.id });
    }
  };

  const switchType = (key) => {
    setActiveType(key);
    setFilter('today');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* ======================================================
          DARK NAVY HEADER (MATCHING USER IMAGE & DESIGN)
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

        {/* NAVIGATION ROW AS SHOWN IN IMAGE: (←) Appointments (Q) */}
        <View style={styles.navHeaderRow}>
          <TouchableOpacity
            style={styles.headerNavCircleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.appointmentsMainTitle}>Appointments</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* MONTH & TODAY ROW AS SHOWN IN IMAGE: September 2026 | Today */}
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>September 2026</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedDateItem(30);
              setFilter('today');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.todayTextBtn}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* DATE CAROUSEL STRIP AS SHOWN IN IMAGE: Mon 28, Tue 29, Wed 30 (Active), Thu 1... */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesListScroll}
        >
          {DATES_STRIP.map((d) => {
            const isSelected = selectedDateItem === d.dayNum;
            return (
              <TouchableOpacity
                key={`${d.dayName}-${d.dayNum}`}
                style={[styles.datePill, isSelected && styles.datePillActive]}
                onPress={() => {
                  setSelectedDateItem(d.dayNum);
                  if (d.dayNum === 30) {
                    setFilter('today');
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.datePillDay, isSelected && styles.datePillDayActive]}>
                  {d.dayName}
                </Text>
                <Text style={[styles.datePillNum, isSelected && styles.datePillNumActive]}>
                  {d.dayNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ======================================================
          IN-PERSON / VIDEO TOGGLE (MATCHING IMAGE 1)
      ======================================================= */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleTrack}>
          {TYPES.map((t) => {
            const isActive = activeType === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.toggleBtn,
                  isActive ? styles.toggleBtnActive : styles.toggleBtnInactive,
                ]}
                onPress={() => switchType(t.key)}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={t.icon}
                  size={18}
                  color={isActive ? '#00B894' : '#071E42'}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    isActive ? styles.toggleBtnTextActive : styles.toggleBtnTextInactive,
                  ]}
                  numberOfLines={1}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ======================================================
          STATUS FILTER PILLS: TODAY, UPCOMING, PENDING, RESCHEDULED, OVERDUE (MATCHING IMAGE 2)
      ======================================================= */}
      <View style={styles.statusFilterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusFilterBar}
        >
          {STATUS_FILTERS.map((s) => {
            const isActive = filter === s.key && (s.key !== 'today' || selectedDateItem === 30);
            const count = counts[s.key] ?? 0;

            return (
              <TouchableOpacity
                key={s.key}
                style={[
                  styles.statusPillBtn,
                  isActive ? styles.statusPillBtnActive : styles.statusPillBtnInactive,
                ]}
                onPress={() => {
                  if (s.key === 'today') {
                    setSelectedDateItem(30);
                  }
                  setFilter(s.key);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={s.icon}
                  size={15}
                  color={isActive ? '#FFFFFF' : '#071E42'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.statusPillLabel,
                    isActive ? styles.statusPillLabelActive : styles.statusPillLabelInactive,
                  ]}
                >
                  {s.label}
                </Text>
                <View
                  style={[
                    styles.statusPillBadge,
                    isActive ? styles.statusPillBadgeActive : styles.statusPillBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillBadgeText,
                      isActive ? styles.statusPillBadgeTextActive : styles.statusPillBadgeTextInactive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name={activeType === 'Video' ? 'videocam-outline' : 'business-outline'} size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {searchQuery
                ? `No matching appointments found for "${searchQuery}"`
                : selectedDateItem !== 30
                  ? `No ${activeType.toLowerCase()} appointments scheduled for this date`
                  : `No ${activeType.toLowerCase()} appointments in this category`}
            </Text>
            {(searchQuery.length > 0 || selectedDateItem !== 30) && (
              <TouchableOpacity
                style={styles.emptyResetBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedDateItem(30);
                  setFilter('today');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyResetBtnText}>Back to Today's Appointments</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => {
          // Status colors & label
          let badgeBg = '#E6FAF6';
          let badgeColor = '#00B894';
          let badgeLabel = 'Confirmed';

          if (item.status === 'pending') {
            badgeBg = '#FEF3C7';
            badgeColor = '#D97706';
            badgeLabel = 'Pending';
          } else if (item.status === 'upcoming') {
            badgeBg = '#EEF4FC';
            badgeColor = '#071E42';
            badgeLabel = 'Upcoming';
          } else if (item.status === 'rescheduled') {
            badgeBg = '#FEF3C7';
            badgeColor = '#B45309';
            badgeLabel = 'Rescheduled';
          } else if (item.status === 'overdue') {
            badgeBg = '#FEE2E2';
            badgeColor = '#EF4444';
            badgeLabel = 'Overdue';
          } else if (item.status === 'completed') {
            badgeBg = '#E2E8F0';
            badgeColor = '#475569';
            badgeLabel = 'Completed';
          } else if (item.status === 'cancelled') {
            badgeBg = '#FEE2E2';
            badgeColor = '#EF4444';
            badgeLabel = 'Cancelled';
          }

          const isAccepted = acceptedMap[item.id] || item.status === 'confirmed';

          return (
            <TouchableOpacity
              style={styles.patientCard}
              activeOpacity={0.92}
              onPress={() => {
                if (filter === 'upcoming' || item.status === 'upcoming') {
                  setUpcomingModalAppt(item);
                } else if (filter === 'rescheduled' || item.status === 'rescheduled') {
                  setWaitingAcceptModalAppt(item);
                } else if (filter === 'overdue' || item.status === 'overdue') {
                  setOverdateModalAppt(item);
                } else {
                  navigation.navigate('AppointmentDetail', {
                    appointment: item,
                    mode: item.type,
                  });
                }
              }}
            >
              {/* Top Row: Avatar, Info, Status Badge */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientAvatarText}>
                    {item.patient ? item.patient.charAt(0) : 'P'}
                  </Text>
                </View>

                <View style={styles.patientInfoBlock}>
                  <Text style={styles.patientName}>{item.patient}</Text>
                  <Text style={styles.patientMeta}>
                    {item.age} yrs · {item.gender}
                  </Text>
                  <Text style={styles.patientReason} numberOfLines={1}>
                    {item.reason}
                  </Text>
                </View>

                <View style={[styles.statusBadgePill, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.statusBadgeText, { color: badgeColor }]}>
                    {badgeLabel}
                  </Text>
                </View>
              </View>

              {/* Thin Divider */}
              <View style={styles.cardDivider} />

              {/* Date & Time Row */}
              <View style={styles.dateTimeRow}>
                <Ionicons name="calendar-outline" size={15} color="#64748B" />
                <Text style={styles.dateTimeText}>
                  {item.date === 'Today' ? `Today, ${item.time}` : `${item.date}, ${item.time}`}
                </Text>
              </View>

              {/* Reschedule Detail Banner (if rescheduled) */}
              {item.status === 'rescheduled' && (
                <View style={styles.rescheduledCardBanner}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Ionicons name="time" size={13} color="#B45309" />
                    <Text style={styles.rescheduledBannerTitle}>
                      Rescheduled to {item.date} • {item.time}
                    </Text>
                  </View>
                  {item.rescheduleReason ? (
                    <Text style={styles.rescheduledBannerDetail}>
                      Reason: {item.rescheduleReason}
                    </Text>
                  ) : null}
                  {item.rescheduleNote ? (
                    <Text style={styles.rescheduledBannerNote}>
                      Note: "{item.rescheduleNote}"
                    </Text>
                  ) : null}
                </View>
              )}

              {/* ========================================================
                  CARD ACTIONS ROW BY STATUS:
                  - Upcoming: Only show upcoming notice, no action buttons
                  - Pending: Reschedule & Accept buttons
                  - Rescheduled: Re-Reschedule & Waiting for Patient Acceptance
                  - Overdue: Reschedule & Overdate button
                  - Today / Confirmed:
                    Before accept -> Accept button + Reschedule
                    After accept -> In-person: Start Consultation; Video: Join
              ========================================================= */}
              {filter === 'upcoming' || item.status === 'upcoming' ? (
                /* UPCOMING: Only show upcoming badge/status. Clicking opens upcoming modal */
                <TouchableOpacity
                  style={styles.upcomingBadgeRow}
                  activeOpacity={0.8}
                  onPress={() => setUpcomingModalAppt(item)}
                >
                  <Ionicons name="calendar" size={15} color="#071E42" />
                  <Text style={styles.upcomingBadgeText}>
                    Upcoming Appointment • Scheduled for {item.date}
                  </Text>
                </TouchableOpacity>
              ) : filter === 'pending' || item.status === 'pending' ? (
                /* PENDING: Show Reschedule and Accept buttons */
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.cardRescheduleBtn}
                    onPress={() => openRescheduleModal(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="calendar-outline" size={15} color="#475569" />
                    <Text style={styles.cardRescheduleText}>Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cardAcceptBtn}
                    onPress={() => handleAcceptAppointment(item)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.cardAcceptBtnText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              ) : filter === 'rescheduled' || item.status === 'rescheduled' ? (
                /* RESCHEDULED: Show Re-Reschedule button and Waiting for Patient Acceptance */
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.cardRescheduleBtn}
                    onPress={() => openRescheduleModal(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh-outline" size={15} color="#475569" />
                    <Text style={styles.cardRescheduleText}>Re-Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.waitingAcceptanceBtn}
                    activeOpacity={0.8}
                    onPress={() => setWaitingAcceptModalAppt(item)}
                  >
                    <Ionicons name="hourglass-outline" size={14} color="#B45309" />
                    <Text style={styles.waitingAcceptanceText} numberOfLines={1}>
                      Awaiting Patient Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : filter === 'overdue' || item.status === 'overdue' ? (
                /* OVERDUE: Show Reschedule and Overdate button (clicks open overdate popup) */
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.cardRescheduleBtn}
                    onPress={() => openRescheduleModal(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="calendar-outline" size={15} color="#475569" />
                    <Text style={styles.cardRescheduleText}>Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.overdueActionBtn}
                    activeOpacity={0.8}
                    onPress={() => setOverdateModalAppt(item)}
                  >
                    <Ionicons name="alert-circle" size={15} color="#EF4444" />
                    <Text style={styles.overdueActionBtnText}>Overdate</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* TODAY:
                   Before accept -> Accept button + Reschedule
                   After accept:
                     In-Person -> Start Consultation
                     Video -> Join
                */
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.cardRescheduleBtn}
                    onPress={() => openRescheduleModal(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="calendar-outline" size={15} color="#475569" />
                    <Text style={styles.cardRescheduleText}>Reschedule</Text>
                  </TouchableOpacity>

                  {isAccepted ? (
                    item.type === 'In-Person' ? (
                      <TouchableOpacity
                        style={styles.cardJoinBtn}
                        onPress={() =>
                          navigation.navigate('AppointmentDetail', {
                            appointment: { ...item, status: 'confirmed' },
                            mode: 'In-Person',
                            justAccepted: true,
                          })
                        }
                        activeOpacity={0.85}
                      >
                        <Ionicons name="play" size={13} color="#FFFFFF" />
                        <Text style={styles.cardJoinText}>Start Consult</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.cardJoinBtn}
                        onPress={() =>
                          navigation.navigate('AppointmentDetail', {
                            appointment: { ...item, status: 'confirmed' },
                            mode: 'Video',
                            justAccepted: true,
                          })
                        }
                        activeOpacity={0.85}
                      >
                        <Ionicons name="videocam" size={15} color="#FFFFFF" />
                        <Text style={styles.cardJoinText}>Join Call</Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity
                      style={styles.cardAcceptBtn}
                      onPress={() => handleAcceptAppointment(item)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.cardAcceptBtnText}>Accept</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* ====================================================
          RESCHEDULE APPOINTMENT POPUP MODAL (NAVY BLUE THEME)
      ==================================================== */}
      <RescheduleModal
        visible={rescheduleModalVisible}
        appointment={rescheduleAppt}
        onClose={() => setRescheduleModalVisible(false)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* ====================================================
          OVERDATE PATIENT POPUP MODAL
          "when clicked overdate just pop-up overdtae patient profile ok orr request agian button"
      ==================================================== */}
      <Modal
        visible={!!overdateModalAppt}
        transparent
        animationType="fade"
        onRequestClose={() => setOverdateModalAppt(null)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalCard}>
            {/* Header Navy Blue */}
            <View style={styles.infoModalNavyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.infoModalIconCircleOverdue}>
                  <Ionicons name="alert-circle" size={18} color="#EF4444" />
                </View>
                <View>
                  <Text style={styles.infoModalTitle}>Overdue Appointment</Text>
                  <Text style={styles.infoModalSubtitle}>Scheduled date & time has passed</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setOverdateModalAppt(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Patient Profile Box */}
            {overdateModalAppt && (
              <View style={styles.infoModalBody}>
                <View style={styles.infoPatientProfileCard}>
                  <View style={styles.infoPatientAvatar}>
                    <Text style={styles.infoPatientAvatarText}>
                      {overdateModalAppt.patient ? overdateModalAppt.patient.charAt(0) : 'P'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.infoPatientName}>{overdateModalAppt.patient}</Text>
                    <Text style={styles.infoPatientMeta}>
                      {overdateModalAppt.age} yrs • {overdateModalAppt.gender} • Appt #{overdateModalAppt.id}
                    </Text>
                    <View style={styles.infoModePill}>
                      <Ionicons
                        name={overdateModalAppt.type === 'Video' ? 'videocam' : 'business'}
                        size={12}
                        color="#071E42"
                      />
                      <Text style={styles.infoModePillText}>
                        {overdateModalAppt.type} Consultation
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Overdue Details */}
                <View style={styles.infoDetailsRow}>
                  <View style={styles.infoDetailBox}>
                    <Text style={styles.infoDetailLabel}>Scheduled Date</Text>
                    <Text style={styles.infoDetailValRed}>{overdateModalAppt.date}</Text>
                  </View>
                  <View style={styles.infoDetailBox}>
                    <Text style={styles.infoDetailLabel}>Scheduled Time</Text>
                    <Text style={styles.infoDetailVal}>{overdateModalAppt.time}</Text>
                  </View>
                  <View style={styles.infoDetailBox}>
                    <Text style={styles.infoDetailLabel}>Fee</Text>
                    <Text style={styles.infoDetailVal}>₹{overdateModalAppt.fee || '500'}</Text>
                  </View>
                </View>

                <View style={styles.infoReasonCard}>
                  <Text style={styles.infoReasonLabel}>Reason for Visit:</Text>
                  <Text style={styles.infoReasonText}>{overdateModalAppt.reason || 'General Consultation'}</Text>
                </View>

                <View style={styles.overdueNoticeBox}>
                  <Ionicons name="information-circle" size={17} color="#B91C1C" />
                  <Text style={styles.overdueNoticeText}>
                    This appointment was not attended on its scheduled slot. You can acknowledge this record or request the patient to reschedule.
                  </Text>
                </View>

                {/* Action Buttons: "OK" or "Request Again" */}
                <View style={styles.infoModalActionsRow}>
                  <TouchableOpacity
                    style={styles.infoModalOkBtn}
                    onPress={() => setOverdateModalAppt(null)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.infoModalOkBtnText}>OK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.infoModalRequestAgainBtn}
                    onPress={() => {
                      const pName = overdateModalAppt.patient;
                      setOverdateModalAppt(null);
                      Alert.alert(
                        'Request Sent',
                        `A re-booking request invitation has been sent to ${pName} with available slots.`,
                        [{ text: 'Great' }]
                      );
                    }}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="repeat" size={16} color="#FFFFFF" />
                    <Text style={styles.infoModalRequestAgainText}>Request Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ====================================================
          AWAITING PATIENT ACCEPT POPUP MODAL
          "when clicked awaiting patient accept just pop up wait for patent accepted"
      ==================================================== */}
      <Modal
        visible={!!waitingAcceptModalAppt}
        transparent
        animationType="fade"
        onRequestClose={() => setWaitingAcceptModalAppt(null)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalCard}>
            {/* Header Navy Blue */}
            <View style={styles.infoModalNavyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.infoModalIconCircleWait}>
                  <Ionicons name="hourglass" size={18} color="#D97706" />
                </View>
                <View>
                  <Text style={styles.infoModalTitle}>Wait for Patient Accepted</Text>
                  <Text style={styles.infoModalSubtitle}>Awaiting patient confirmation</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setWaitingAcceptModalAppt(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            {waitingAcceptModalAppt && (
              <View style={styles.infoModalBody}>
                <View style={styles.infoPatientProfileCard}>
                  <View style={styles.infoPatientAvatar}>
                    <Text style={styles.infoPatientAvatarText}>
                      {waitingAcceptModalAppt.patient ? waitingAcceptModalAppt.patient.charAt(0) : 'P'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.infoPatientName}>{waitingAcceptModalAppt.patient}</Text>
                    <Text style={styles.infoPatientMeta}>
                      {waitingAcceptModalAppt.age} yrs • {waitingAcceptModalAppt.gender}
                    </Text>
                    <Text style={styles.infoPatientReason} numberOfLines={1}>
                      {waitingAcceptModalAppt.reason}
                    </Text>
                  </View>
                </View>

                {/* Proposed Rescheduled Details */}
                <View style={styles.awaitingDetailsCard}>
                  <View style={styles.awaitingStatusBanner}>
                    <Ionicons name="time" size={16} color="#B45309" />
                    <Text style={styles.awaitingStatusTitle}>Wait for Patient Acceptance</Text>
                  </View>
                  <Text style={styles.awaitingDescriptionText}>
                    The proposed appointment time has been rescheduled and sent to {waitingAcceptModalAppt.patient}. Please wait for the patient to review and accept the new schedule.
                  </Text>

                  <View style={styles.awaitingTimingRow}>
                    <View style={styles.awaitingTimingItem}>
                      <Text style={styles.awaitingTimingLabel}>Proposed Date</Text>
                      <Text style={styles.awaitingTimingVal}>{waitingAcceptModalAppt.date}</Text>
                    </View>
                    <View style={styles.awaitingTimingItem}>
                      <Text style={styles.awaitingTimingLabel}>Proposed Time</Text>
                      <Text style={styles.awaitingTimingVal}>{waitingAcceptModalAppt.time}</Text>
                    </View>
                  </View>

                  {waitingAcceptModalAppt.rescheduleReason ? (
                    <Text style={styles.awaitingNoteText}>
                      <Text style={{ fontWeight: '700' }}>Reason: </Text>
                      {waitingAcceptModalAppt.rescheduleReason}
                    </Text>
                  ) : null}
                </View>

                {/* Action button */}
                <TouchableOpacity
                  style={styles.infoModalSingleOkBtn}
                  onPress={() => setWaitingAcceptModalAppt(null)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.infoModalSingleOkBtnText}>OK</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ====================================================
          UPCOMING APPOINTMENT POPUP MODAL
          "when clicked on upcoming appointment pop-up __. its coming patients profile on date and toming show"
      ==================================================== */}
      <Modal
        visible={!!upcomingModalAppt}
        transparent
        animationType="fade"
        onRequestClose={() => setUpcomingModalAppt(null)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalCard}>
            {/* Header Navy Blue */}
            <View style={styles.infoModalNavyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.infoModalIconCircleUpcoming}>
                  <Ionicons name="calendar" size={18} color="#071E42" />
                </View>
                <View>
                  <Text style={styles.infoModalTitle}>Upcoming Appointment</Text>
                  <Text style={styles.infoModalSubtitle}>Scheduled Consultation</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setUpcomingModalAppt(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            {upcomingModalAppt && (
              <View style={styles.infoModalBody}>
                <View style={styles.infoPatientProfileCard}>
                  <View style={styles.infoPatientAvatar}>
                    <Text style={styles.infoPatientAvatarText}>
                      {upcomingModalAppt.patient ? upcomingModalAppt.patient.charAt(0) : 'P'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.infoPatientName}>{upcomingModalAppt.patient}</Text>
                    <Text style={styles.infoPatientMeta}>
                      {upcomingModalAppt.age} yrs • {upcomingModalAppt.gender}
                    </Text>
                    <View style={styles.infoModePill}>
                      <Ionicons
                        name={upcomingModalAppt.type === 'Video' ? 'videocam' : 'business'}
                        size={12}
                        color="#071E42"
                      />
                      <Text style={styles.infoModePillText}>
                        {upcomingModalAppt.type} Consultation
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Date & Timing Highlight Box */}
                <View style={styles.upcomingScheduleBox}>
                  <View style={styles.upcomingScheduleRow}>
                    <View style={styles.upcomingScheduleItem}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="calendar-outline" size={16} color="#071E42" />
                        <Text style={styles.upcomingScheduleLabel}>Scheduled Date</Text>
                      </View>
                      <Text style={styles.upcomingScheduleDateVal}>{upcomingModalAppt.date}</Text>
                    </View>
                    <View style={styles.upcomingScheduleItem}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="time-outline" size={16} color="#071E42" />
                        <Text style={styles.upcomingScheduleLabel}>Timing</Text>
                      </View>
                      <Text style={styles.upcomingScheduleTimeVal}>{upcomingModalAppt.time}</Text>
                    </View>
                  </View>
                </View>

                {/* Additional Clinical Details */}
                <View style={styles.infoDetailsRow}>
                  <View style={styles.infoDetailBox}>
                    <Text style={styles.infoDetailLabel}>Type</Text>
                    <Text style={styles.infoDetailVal}>{upcomingModalAppt.type}</Text>
                  </View>
                  <View style={styles.infoDetailBox}>
                    <Text style={styles.infoDetailLabel}>Fee</Text>
                    <Text style={styles.infoDetailVal}>₹{upcomingModalAppt.fee || '500'}</Text>
                  </View>
                  <View style={styles.infoDetailBox}>
                    <Text style={styles.infoDetailLabel}>Status</Text>
                    <Text style={[styles.infoDetailVal, { color: '#071E42', fontWeight: '700' }]}>Confirmed</Text>
                  </View>
                </View>

                <View style={styles.infoReasonCard}>
                  <Text style={styles.infoReasonLabel}>Chief Complaint / Reason:</Text>
                  <Text style={styles.infoReasonText}>{upcomingModalAppt.reason || 'General Follow-up'}</Text>
                </View>

                {/* Action Button: OK */}
                <View style={styles.infoModalActionsRow}>
                  <TouchableOpacity
                    style={[styles.infoModalPrimaryBtn, { flex: 1, justifyContent: 'center' }]}
                    onPress={() => setUpcomingModalAppt(null)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.infoModalPrimaryBtnText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* SUCCESS TOAST BANNER */}
      {rescheduleToast && (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={18} color={colors.white} />
          <Text style={styles.toastText}>
            Rescheduled for {rescheduleToast.patient} on {rescheduleToast.date} at{' '}
            {rescheduleToast.time}
          </Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  /* Dark Navy Header (matching image) */
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
    borderColor: '#061A3A',
  },

  /* Navigation Row as shown in image */
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 16,
  },
  headerNavCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentsMainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  /* Month and Today row */
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 14,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  todayTextBtn: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00B894',
  },

  /* Horizontal Date Strip */
  datesListScroll: {
    paddingHorizontal: spacing.lg,
    gap: 10,
  },
  datePill: {
    width: 50,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillActive: {
    backgroundColor: '#FFFFFF',
  },
  datePillDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  datePillDayActive: {
    color: '#00897B',
    fontWeight: '700',
  },
  datePillNum: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  datePillNumActive: {
    color: '#071E42',
    fontWeight: '800',
  },

  /* In-Person / Video Toggle (matching Image 1) */
  toggleContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: 14,
    marginBottom: 8,
  },
  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    borderRadius: 24,
    padding: 4,
    alignItems: 'center',
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#071E42', // Dark navy blue
  },
  toggleBtnInactive: {
    backgroundColor: 'transparent',
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF', // Text white when background is blue
    fontWeight: '700',
  },
  toggleBtnTextInactive: {
    color: '#071E42', // Text navy blue when background is white/light
  },

  /* Status Filter Bar (matching Image 2) */
  statusFilterBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
    paddingBottom: 14,
    flexDirection: 'row',
    gap: 10,
  },
  statusPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 19,
  },
  statusPillBtnActive: {
    backgroundColor: '#071E42', // Dark navy blue
    borderWidth: 1.2,
    borderColor: '#071E42',
  },
  statusPillBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  statusPillLabel: {
    fontSize: 13.5,
    marginRight: 6,
  },
  statusPillLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusPillLabelInactive: {
    color: '#071E42',
    fontWeight: '600',
  },
  statusPillBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillBadgeActive: {
    backgroundColor: '#00B894', // Vibrant teal
  },
  statusPillBadgeInactive: {
    backgroundColor: '#E6FAF6', // Soft mint
  },
  statusPillBadgeText: {
    fontSize: 11.5,
  },
  statusPillBadgeTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  statusPillBadgeTextInactive: {
    color: '#00897B',
    fontWeight: '700',
  },

  // List container with uniform 12px gap
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* Patient Card UI (matching user's uploaded image) */
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4.5,
    borderLeftColor: '#071E42', // Thick Navy Blue primary accent on left
    padding: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2F6',
    borderWidth: 2,
    borderColor: '#071E42', // Navy Blue border
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#071E42', // Navy Blue text
  },
  patientInfoBlock: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  patientName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#071E42',
  },
  patientMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  patientReason: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadgePill: {
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 14,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dateTimeText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#475569',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardRescheduleBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cardRescheduleText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  cardJoinBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#071E42', // Solid Dark Navy Blue
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cardJoinText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusFilterWrapper: {
    height: 48,
    marginTop: 4,
    marginBottom: 6,
  },
  upcomingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  upcomingBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#071E42',
  },
  cardAcceptBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#00B894',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cardAcceptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  waitingAcceptanceBtn: {
    flex: 1.4,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.2,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  waitingAcceptanceText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#B45309',
  },
  overdueActionBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.2,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  overdueActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },

  card: {
    marginBottom: 12,
    borderWidth: 1.5,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  avatarText: {
    ...typography.h3,
    color: colors.primary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  followUpTag: {
    backgroundColor: colors.accentSurface,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.accentLight,
  },
  followUpText: {
    ...typography.tiny,
    color: colors.accentDark,
  },
  meta: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reason: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaText: {
    ...typography.small,
    color: colors.textSecondary,
  },

  // Action buttons with distinct border colors
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    gap: 6,
    borderWidth: 1.2,
  },
  rescheduleBtn: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
  },
  rescheduleText: {
    ...typography.smallBold,
    color: colors.primary,
  },
  acceptBtn: {
    backgroundColor: colors.successSurface,
    borderColor: colors.success,
  },
  acceptText: {
    ...typography.smallBold,
    color: colors.success,
  },
  outlineBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  outlineText: {
    ...typography.smallBold,
    color: colors.textSecondary,
  },
  startBtn: {
    backgroundColor: colors.accent,
    borderColor: colors.accentBorder || colors.accentDark,
  },
  startText: {
    ...typography.smallBold,
    color: colors.white,
    flexShrink: 1,
  },
  pendingAcceptanceBtn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  pendingAcceptanceText: {
    ...typography.tinyBold,
    color: '#92400E',
    flexShrink: 1,
  },

  empty: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
  emptyResetBtn: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#071E42',
  },
  emptyResetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  /* RESCHEDULE MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  keyboardAvoidingModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rescheduleModalCard: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '88%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  /* ==================================================
      SELECT DATE CALENDAR POPUP (MATCHES USER IMAGE)
  =================================================== */
  calendarModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  calModalHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  calModalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  calBodyRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    minHeight: 380,
  },
  calSidebar: {
    width: 90,
    backgroundColor: '#F8FAFB',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  calSideTab: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    gap: 4,
  },
  calSideTabActive: {
    backgroundColor: '#E6F7F5',
  },
  calSideTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  calSideTabTextActive: {
    color: '#009688',
  },
  calContentArea: {
    flex: 1,
    padding: 12,
  },
  calMonthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  calMonthNavTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  calNavArrow: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calHintBadge: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: '#E6F7F5',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calHintText: {
    fontSize: 12,
    color: '#00796B',
    fontWeight: '700',
  },
  calWeekHeader: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  calWeekDayText: {
    width: '14.285%',
    textAlign: 'center',
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '700',
  },
  calDateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calDateCell: {
    width: '14.285%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDateNumberBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDateNumberBoxSelected: {
    backgroundColor: '#009688',
  },
  calDateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  calDateTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  calPickerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  calListItem: {
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  calListItemActive: {
    borderColor: '#80CBC4',
    backgroundColor: '#E6F7F5',
  },
  calListItemText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  calListItemTextActive: {
    color: '#00796B',
    fontWeight: '800',
  },
  calDoneButton: {
    marginHorizontal: 14,
    marginBottom: 14,
    marginTop: 4,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#009688',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDoneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalHeaderTitle: {
    ...typography.bodyBold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  modalSection: {
    marginBottom: 12,
  },
  modalSectionLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalPatientName: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  modalCurrentAppt: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dateSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateSelectorText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotChip: {
    width: '48%',
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  timeSlotChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },
  timeSlotTextActive: {
    color: colors.white,
  },

  /* MANUAL TIME ENTRY & AM/PM DROPDOWN */
  manualTimeContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border + '60',
  },
  manualTimeContainerOpen: {
    marginBottom: 84,
  },
  manualTimeSubLabel: {
    ...typography.tinyBold,
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manualTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    zIndex: 20,
  },
  manualTimeInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    height: 42,
  },
  manualTimeIcon: {
    marginRight: 6,
  },
  manualTimeTextInput: {
    flex: 1,
    ...typography.smallBold,
    color: colors.textPrimary,
    paddingVertical: 0,
    height: '100%',
  },
  ampmDropdownWrapper: {
    position: 'relative',
    width: 82,
    zIndex: 30,
  },
  ampmDropdownTrigger: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderWidth: 1.2,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
  },
  ampmDropdownTriggerActive: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
  },
  ampmTriggerText: {
    ...typography.smallBold,
    color: colors.primary,
  },
  ampmDropdownMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    left: 0,
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 100,
    overflow: 'hidden',
  },
  ampmDropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  ampmDropdownOptionActive: {
    backgroundColor: colors.primarySurface,
  },
  ampmOptionText: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },
  ampmOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  reasonDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  reasonDropdownTriggerError: {
    borderColor: colors.danger,
  },
  reasonTriggerText: {
    ...typography.small,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  reasonTriggerPlaceholder: {
    color: colors.textMuted,
  },
  dropdownMenuBox: {
    marginTop: 4,
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '60',
  },
  dropdownMenuItemActive: {
    backgroundColor: colors.primarySurface,
  },
  dropdownItemText: {
    ...typography.small,
    color: colors.textPrimary,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  fieldErrorText: {
    ...typography.tiny,
    color: colors.danger,
    marginTop: 4,
  },
  noteTextInput: {
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    ...typography.small,
    color: colors.textPrimary,
  },
  modalFooterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    paddingTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: radius.sm,
    borderWidth: 1.2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    ...typography.smallBold,
    color: colors.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1.5,
    paddingVertical: 11,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    ...typography.smallBold,
    color: colors.white,
  },

  /* RESCHEDULE CARD BANNER */
  rescheduledCardBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 8,
    marginTop: 10,
  },
  rescheduledBannerTitle: {
    ...typography.smallBold,
    color: '#92400E',
  },
  rescheduledBannerDetail: {
    ...typography.tiny,
    color: '#B45309',
    marginTop: 2,
  },
  rescheduledBannerNote: {
    ...typography.tiny,
    color: '#92400E',
    fontStyle: 'italic',
    marginTop: 2,
  },

  /* TOAST BANNER */
  toastBanner: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#0F766E',
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  toastText: {
    ...typography.smallBold,
    color: colors.white,
    flex: 1,
  },
  /* ========================================================
     OVERDATE / AWAITING ACCEPTANCE / UPCOMING INFO MODALS
  ======================================================== */
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 26, 58, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  infoModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  infoModalNavyHeader: {
    backgroundColor: '#071E42', // Rich Navy Blue
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoModalSubtitle: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 1,
  },
  infoModalIconCircleOverdue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoModalIconCircleWait: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoModalIconCircleUpcoming: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoModalBody: {
    padding: 20,
  },
  infoPatientProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  infoPatientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2F6',
    borderWidth: 2,
    borderColor: '#071E42', // Navy Blue
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPatientAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#071E42', // Navy Blue
  },
  infoPatientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071E42',
  },
  infoPatientMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  infoPatientReason: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  infoModePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  infoModePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#071E42',
  },
  infoDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  infoDetailBox: {
    flex: 1,
  },
  infoDetailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  infoDetailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 3,
  },
  infoDetailValRed: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 3,
  },
  infoReasonCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  infoReasonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  infoReasonText: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 2,
  },
  overdueNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  overdueNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 17,
  },
  infoModalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoModalOkBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  infoModalOkBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  infoModalRequestAgainBtn: {
    flex: 1.4,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071E42', // Navy Blue
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  infoModalRequestAgainText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* Awaiting Acceptance Specifics */
  awaitingDetailsCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  awaitingStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  awaitingStatusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
  awaitingDescriptionText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    marginBottom: 12,
  },
  awaitingTimingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  awaitingTimingItem: {
    flex: 1,
  },
  awaitingTimingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    textTransform: 'uppercase',
  },
  awaitingTimingVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
    marginTop: 2,
  },
  awaitingNoteText: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 4,
  },
  infoModalSingleOkBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#071E42', // Navy Blue
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoModalSingleOkBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* Upcoming Appointment Specifics */
  upcomingScheduleBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 14,
    marginBottom: 14,
  },
  upcomingScheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upcomingScheduleItem: {
    flex: 1,
  },
  upcomingScheduleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
  },
  upcomingScheduleDateVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#071E42',
    marginTop: 4,
  },
  upcomingScheduleTimeVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
    marginTop: 4,
  },
  infoModalSecondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  infoModalSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  infoModalPrimaryBtn: {
    flex: 1.3,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071E42', // Navy Blue
  },
  infoModalPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
