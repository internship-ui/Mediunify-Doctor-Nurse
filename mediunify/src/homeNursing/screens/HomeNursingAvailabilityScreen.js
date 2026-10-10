import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/Logo';
import Card from '../../components/Card';
import CallModal from '../components/CallModal';
import { useHomeNursing } from '../context/HomeNursingContext';
import { radius } from '../../theme/colors';

/*
|--------------------------------------------------------------------------
| COLOR PALETTE (MATCHING DOCTOR AVAILABILITY & BRAND DESIGN)
|--------------------------------------------------------------------------
*/
const NAVY = '#071E42';
const NAVY_DARK = '#061A3A';
const NAVY_LIGHT = '#EEF4FC';
const NAVY_RANGE = '#E2ECF8';
const TEAL = '#00B894';
const TEAL_LIGHT = '#E6FAF6';

const BORDER = '#E2E8F0';
const TEXT = '#1E293B';
const MUTED = '#64748B';
const BG = '#F8FAFC';
const RED = '#DC2626';

/*
|--------------------------------------------------------------------------
| CONSTANTS & SUGGESTIONS
|--------------------------------------------------------------------------
*/
const CARE_MODES = [
  { key: 'Home Visits', label: 'Home Visits', icon: 'home-outline' },
  { key: 'Emergency Care', label: 'Emergency / On-Call', icon: 'medical-outline' },
];

const BREAK_REASON_SUGGESTIONS = [
  'Lunch Break',
  'Tea / Coffee Break',
  'Travel & Transit Rest',
  'Sanitization & Kit Restock',
  'Emergency Break',
  'Prayer Break',
];

const OVERTIME_REASON_SUGGESTIONS = [
  'Extended Patient Visit',
  'Urgent Post-Op Care Overtime',
  'Critical Patient Monitoring',
  'Emergency On-Call Duty',
  'Night Shift Nursing Assistance',
];

const LEAVE_REASON_SUGGESTIONS = [
  'Personal Leave',
  'Weekly Off / Rest Day',
  'Annual Vacation Leave',
  'Medical / Sick Leave',
  'Nursing CME / Training Workshop',
];

const DURATION_QUICK_OPTIONS = ['30', '45', '60', '90'];

const HOURS_LIST = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES_LIST = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const YEARS = Array.from({ length: 10 }, (_, i) => 2024 + i);

const pad = (n) => String(n).padStart(2, '0');

const dateKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const keyToDate = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatDate = (k) => {
  if (!k) return '';
  const d = keyToDate(k);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const formatShortDate = (k) => {
  if (!k) return '';
  const d = keyToDate(k);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()].slice(0, 3)}`;
};

const formatFullDay = (k) => {
  if (!k) return '';
  const d = keyToDate(k);
  return `${WEEK_DAYS[d.getDay()]}, ${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const clone = (data) => JSON.parse(JSON.stringify(data));

const isBetween = (k, from, to) => {
  if (!from || !to) return false;
  const curr = keyToDate(k).getTime();
  const start = keyToDate(from).getTime();
  const end = keyToDate(to).getTime();
  return curr >= Math.min(start, end) && curr <= Math.max(start, end);
};

const createCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result = [];
  for (let i = 0; i < firstDay; i++) result.push(null);
  for (let d = 1; d <= daysInMonth; d++) result.push(new Date(year, month, d));
  return result;
};

const getWeekRange = (k) => {
  const d = keyToDate(k);
  const dayOfWeek = d.getDay();
  const sun = new Date(d);
  sun.setDate(d.getDate() - dayOfWeek);
  const sat = new Date(sun);
  sat.setDate(sun.getDate() + 6);
  return { from: dateKey(sun), to: dateKey(sat) };
};

const STATUS_OPTIONS = [
  'Available',
  'Assigned',
  'On the way',
  'In progress',
  'Off duty',
];

const emptyNurseDateData = () => ({
  'Home Visits': {
    workingHours: [
      {
        id: 'shift_1',
        name: 'Morning Home Care Shift',
        start: '08:00',
        startPeriod: 'AM',
        end: '04:00',
        endPeriod: 'PM',
        duration: '45',
        enabled: true,
      },
      {
        id: 'shift_2',
        name: 'Evening Dressing & Vitals Shift',
        start: '05:00',
        startPeriod: 'PM',
        end: '08:30',
        endPeriod: 'PM',
        duration: '30',
        enabled: true,
      },
    ],
    breaks: [
      {
        id: 'break_lunch',
        reason: 'Lunch & Transit Rest',
        start: '01:00',
        startPeriod: 'PM',
        end: '02:00',
        endPeriod: 'PM',
        enabled: true,
      },
      {
        id: 'break_tea',
        reason: 'Tea / Coffee Break',
        start: '04:00',
        startPeriod: 'PM',
        end: '04:30',
        endPeriod: 'PM',
        enabled: true,
      },
    ],
    emergencyHours: [],
  },
  'Emergency Care': {
    workingHours: [
      {
        id: 'shift_em_1',
        name: 'On-Call Emergency Shift',
        start: '08:00',
        startPeriod: 'PM',
        end: '06:00',
        endPeriod: 'AM',
        duration: '60',
        enabled: true,
      },
    ],
    breaks: [],
    emergencyHours: [],
  },
  holiday: null,
});

export default function HomeNursingAvailabilityScreen({ navigation }) {
  const {
    currentStatus,
    setCurrentStatus,
    unreadNotificationsCount,
    addPlannedLeave,
  } = useHomeNursing();

  const today = new Date();
  const todayKey = dateKey(today);

  // Care Mode (Home Visits vs Emergency Care)
  const [activeCareMode, setActiveCareMode] = useState('Home Visits');

  // Date selection state
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [rangeFrom, setRangeFrom] = useState(null);
  const [rangeTo, setRangeTo] = useState(null);
  const [selectedScope, setSelectedScope] = useState('date');

  // Overrides & ranges
  const [singleOverrides, setSingleOverrides] = useState({});
  const [rangeAvailability, setRangeAvailability] = useState([]);

  // Call Modal
  const [callModalVisible, setCallModalVisible] = useState(false);

  // Calendar Modal state
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTab, setCalendarTab] = useState('today');
  const [calendarViewMode, setCalendarViewMode] = useState('date');
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  // Scrolling Time Picker Wheel Popup State
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [timePickerTitle, setTimePickerTitle] = useState('Select Time');
  const [pickerHour, setPickerHour] = useState('08');
  const [pickerMinute, setPickerMinute] = useState('00');
  const [pickerPeriod, setPickerPeriod] = useState('AM');
  const [timePickerCallback, setTimePickerCallback] = useState(null);

  // Working Hours (Add / Edit) Modal
  const [timingModalVisible, setTimingModalVisible] = useState(false);
  const [timingEditingId, setTimingEditingId] = useState(null);
  const [timingName, setTimingName] = useState('Morning Care Shift');
  const [timingStart, setTimingStart] = useState('08:00 AM');
  const [timingEnd, setTimingEnd] = useState('04:00 PM');
  const [timingDuration, setTimingDuration] = useState('45');

  // Breaks Modal
  const [breakModalVisible, setBreakModalVisible] = useState(false);
  const [breakReason, setBreakReason] = useState('Lunch & Transit Rest');
  const [breakStart, setBreakStart] = useState('01:00 PM');
  const [breakEnd, setBreakEnd] = useState('02:00 PM');

  // Emergency / Overtime Modal
  const [overtimeModalVisible, setOvertimeModalVisible] = useState(false);
  const [overtimeReason, setOvertimeReason] = useState('Extended Patient Visit');
  const [overtimeStart, setOvertimeStart] = useState('08:30 PM');
  const [overtimeEnd, setOvertimeEnd] = useState('10:30 PM');

  // Holiday / Leave Modal
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);
  const [holidayReason, setHolidayReason] = useState('Personal Leave');
  const [holidayFrom, setHolidayFrom] = useState(todayKey);
  const [holidayTo, setHolidayTo] = useState(todayKey);

  // Safe back navigation handler
  const handleBack = () => {
    if (navigation && navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation && navigation.navigate) {
      try {
        navigation.navigate('HomeNursingHome');
      } catch (e) {
        navigation.navigate('RoleSelection');
      }
    }
  };

  // Resolve data for selected date
  const getFullDataForDate = (k) => {
    if (singleOverrides[k]) return singleOverrides[k];
    const matchRange = rangeAvailability.find((r) => isBetween(k, r.from, r.to));
    if (matchRange) return matchRange.data;
    return emptyNurseDateData();
  };

  const activeData = useMemo(() => {
    const full = getFullDataForDate(selectedDate);
    const modeData = full[activeCareMode] || full['Home Visits'] || {
      workingHours: [],
      breaks: [],
      emergencyHours: [],
    };
    return {
      workingHours: modeData.workingHours || [],
      breaks: modeData.breaks || [],
      emergencyHours: modeData.emergencyHours || [],
      holiday: full.holiday,
    };
  }, [selectedDate, activeCareMode, singleOverrides, rangeAvailability]);

  const isSelectedDateHoliday = Boolean(activeData.holiday);

  const saveActiveData = (newData) => {
    if (rangeFrom && rangeTo && rangeFrom !== rangeTo) {
      const from = rangeFrom < rangeTo ? rangeFrom : rangeTo;
      const to = rangeFrom < rangeTo ? rangeTo : rangeFrom;

      setRangeAvailability((prev) => {
        const filtered = prev.filter((item) => !(item.from === from && item.to === to));
        const base = emptyNurseDateData();
        base[activeCareMode] = {
          workingHours: clone(newData.workingHours),
          breaks: clone(newData.breaks),
          emergencyHours: clone(newData.emergencyHours),
        };
        base.holiday = newData.holiday;
        return [...filtered, { id: `${from}_${to}`, from, to, data: base }];
      });
    } else {
      setSingleOverrides((prev) => {
        const full = getFullDataForDate(selectedDate);
        return {
          ...prev,
          [selectedDate]: {
            ...full,
            [activeCareMode]: {
              workingHours: clone(newData.workingHours),
              breaks: clone(newData.breaks),
              emergencyHours: clone(newData.emergencyHours),
            },
            holiday: newData.holiday,
          },
        };
      });
    }
  };

  // Time Picker Helper
  const openTimePicker = (title, currentFormattedTime, onConfirm) => {
    const parts = (currentFormattedTime || '08:00 AM').split(' ');
    const timeParts = (parts[0] || '08:00').split(':');
    setPickerHour(timeParts[0] || '08');
    setPickerMinute(timeParts[1] || '00');
    setPickerPeriod(parts[1] || 'AM');
    setTimePickerTitle(title);
    setTimePickerCallback(() => onConfirm);
    setTimePickerVisible(true);
  };

  const handleConfirmTimePicker = () => {
    if (timePickerCallback) {
      timePickerCallback({
        time: `${pickerHour}:${pickerMinute}`,
        hour: pickerHour,
        minute: pickerMinute,
        period: pickerPeriod,
        full: `${pickerHour}:${pickerMinute} ${pickerPeriod}`,
      });
    }
    setTimePickerVisible(false);
  };

  // Calendar Handlers
  const openCalendarModal = () => {
    setCalendarMonth(today.getMonth());
    setCalendarYear(today.getFullYear());
    setCalendarVisible(true);
  };

  const handleApplyCalendarSelection = () => {
    setCalendarVisible(false);
  };

  // Working Hours Handlers
  const openAddTiming = () => {
    setTimingEditingId(null);
    setTimingName('Morning Home Care Shift');
    setTimingStart('08:00 AM');
    setTimingEnd('04:00 PM');
    setTimingDuration('45');
    setTimingModalVisible(true);
  };

  const openEditTiming = (shift) => {
    setTimingEditingId(shift.id);
    setTimingName(shift.name || 'Duty Shift');
    setTimingStart(`${shift.start} ${shift.startPeriod}`);
    setTimingEnd(`${shift.end} ${shift.endPeriod}`);
    setTimingDuration(shift.duration || '45');
    setTimingModalVisible(true);
  };

  const handleSaveTiming = () => {
    const [startH, startP] = timingStart.split(' ');
    const [endH, endP] = timingEnd.split(' ');

    const newShift = {
      id: timingEditingId || `shift_${Date.now()}`,
      name: timingName.trim() || 'Home Care Shift',
      start: startH || '08:00',
      startPeriod: startP || 'AM',
      end: endH || '04:00',
      endPeriod: endP || 'PM',
      duration: timingDuration.trim() || '45',
      enabled: true,
    };

    const updatedHours = timingEditingId
      ? activeData.workingHours.map((s) => (s.id === timingEditingId ? newShift : s))
      : [...activeData.workingHours, newShift];

    saveActiveData({ ...activeData, workingHours: updatedHours });
    setTimingModalVisible(false);
  };

  const handleToggleTiming = (id) => {
    const updated = activeData.workingHours.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    saveActiveData({ ...activeData, workingHours: updated });
  };

  const handleDeleteTiming = (id) => {
    const updated = activeData.workingHours.filter((s) => s.id !== id);
    saveActiveData({ ...activeData, workingHours: updated });
  };

  // Breaks Handlers
  const handleSaveBreak = () => {
    const [sH, sP] = breakStart.split(' ');
    const [eH, eP] = breakEnd.split(' ');

    const newBreak = {
      id: `break_${Date.now()}`,
      reason: breakReason.trim() || 'Rest Break',
      start: sH || '01:00',
      startPeriod: sP || 'PM',
      end: eH || '02:00',
      endPeriod: eP || 'PM',
      enabled: true,
    };

    saveActiveData({ ...activeData, breaks: [...activeData.breaks, newBreak] });
    setBreakModalVisible(false);
  };

  const handleToggleBreak = (id) => {
    const updated = activeData.breaks.map((b) =>
      b.id === id ? { ...b, enabled: !b.enabled } : b
    );
    saveActiveData({ ...activeData, breaks: updated });
  };

  const handleDeleteBreak = (id) => {
    const updated = activeData.breaks.filter((b) => b.id !== id);
    saveActiveData({ ...activeData, breaks: updated });
  };

  // Overtime Handlers
  const handleSaveOvertime = () => {
    const [sH, sP] = overtimeStart.split(' ');
    const [eH, eP] = overtimeEnd.split(' ');

    const newOvertime = {
      id: `ot_${Date.now()}`,
      reason: overtimeReason.trim() || 'Extended Hours',
      start: sH || '08:30',
      startPeriod: sP || 'PM',
      end: eH || '10:30',
      endPeriod: eP || 'PM',
      enabled: true,
    };

    saveActiveData({
      ...activeData,
      emergencyHours: [...activeData.emergencyHours, newOvertime],
    });
    setOvertimeModalVisible(false);
  };

  const handleDeleteOvertime = (id) => {
    const updated = activeData.emergencyHours.filter((o) => o.id !== id);
    saveActiveData({ ...activeData, emergencyHours: updated });
  };

  // Holiday / Leave Handlers
  const handleSaveHoliday = () => {
    const newHoliday = {
      from: holidayFrom,
      to: holidayTo,
      reason: holidayReason.trim() || 'Personal Leave',
    };
    saveActiveData({ ...activeData, holiday: newHoliday });

    // Sync with HomeNursingContext leaves
    addPlannedLeave({
      dates: `${formatShortDate(holidayFrom)} – ${formatDate(holidayTo)}`,
      reason: holidayReason.trim(),
    });

    setHolidayModalVisible(false);
  };

  const handleRemoveHoliday = () => {
    saveActiveData({ ...activeData, holiday: null });
  };

  const handleSaveAllAvailability = () => {
    Alert.alert(
      'Availability Saved',
      `Nurse duty hours, breaks, and on-call availability for ${formatDate(
        selectedDate
      )} have been synced with MediUnify Admin Dispatch.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071E42" />

      {/* ========================================================
          DARK NAVY BRAND HEADER (EXACTLY AS IN DOCTOR AVAILABILITY)
      ======================================================== */}
      <View style={styles.headerNavy}>
        {/* TOP BRAND ROW: LOGO + "MediUnify" + ACTIONS */}
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
              onPress={() => setCallModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={17} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => navigation && navigation.navigate('HomeNursingNotifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
              {unreadNotificationsCount > 0 && <View style={styles.bellDot} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION ROW: (←) Availability (📅) */}
        <View style={styles.navHeaderRow}>
          <TouchableOpacity
            style={styles.headerNavCircleBtn}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.screenMainTitle}>Availability</Text>

          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================
            CARE MODE SELECTOR (HOME VISITS vs EMERGENCY CARE)
        ========================================================= */}
        <View style={styles.careModeSection}>
          <Text style={styles.sectionOverline}>Nursing Care Channel</Text>
          <View style={styles.careModeContainer}>
            {CARE_MODES.map((m) => {
              const isActive = activeCareMode === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[
                    styles.careModeBtn,
                    isActive && styles.careModeBtnActive,
                  ]}
                  onPress={() => setActiveCareMode(m.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={m.icon}
                    size={18}
                    color={isActive ? '#FFFFFF' : NAVY}
                  />
                  <Text
                    style={[
                      styles.careModeText,
                      isActive && styles.careModeTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* =========================================================
            1. ALL-IN-ONE DATE CARD (MATCHING DOCTOR AVAILABILITY)
        ========================================================= */}
        <Card style={[styles.card, isSelectedDateHoliday && styles.cardHoliday]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Date & Schedule</Text>
              <Text style={styles.cardSubtitle}>
                Tap to select single date, week, range, or month
              </Text>
            </View>

            {isSelectedDateHoliday && (
              <View style={styles.holidayHeaderPill}>
                <Ionicons name="calendar" size={13} color={NAVY_DARK} />
                <Text style={styles.holidayHeaderPillText}>Off Duty</Text>
              </View>
            )}
          </View>

          {/* CLICKABLE ALL-IN-ONE DATE BUTTON */}
          <TouchableOpacity
            style={[
              styles.dateSelectBtn,
              isSelectedDateHoliday && styles.dateSelectBtnHoliday,
            ]}
            onPress={openCalendarModal}
            activeOpacity={0.8}
          >
            <View style={styles.dateSelectBtnLeft}>
              <View
                style={[
                  styles.dateSelectIconWrap,
                  isSelectedDateHoliday && { backgroundColor: NAVY_LIGHT },
                ]}
              >
                <Ionicons name="calendar" size={22} color={NAVY_DARK} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.dateSelectLabel}>
                  {selectedScope === 'today'
                    ? "Today's Duty Schedule"
                    : selectedScope === 'week'
                    ? 'Full Week Selected'
                    : selectedScope === 'month'
                    ? `Entire Month (${MONTHS[calendarMonth]} ${calendarYear})`
                    : selectedScope === 'year'
                    ? `Entire Year (${calendarYear})`
                    : rangeFrom && rangeTo && rangeFrom !== rangeTo
                    ? 'Date Range Selected'
                    : formatFullDay(selectedDate || todayKey)}
                </Text>

                <Text
                  style={[
                    styles.dateSelectValue,
                    isSelectedDateHoliday && { color: NAVY_DARK },
                  ]}
                >
                  {rangeFrom && rangeTo && rangeFrom !== rangeTo
                    ? `${formatShortDate(rangeFrom)} - ${formatDate(rangeTo)}`
                    : formatDate(selectedDate || rangeFrom || todayKey)}
                </Text>
              </View>
            </View>

            <View style={styles.calendarOpenBadge}>
              <Ionicons name="calendar-outline" size={15} color={NAVY_DARK} />
              <Text style={styles.calendarOpenBadgeText}>Calendar</Text>
            </View>
          </TouchableOpacity>

          {/* HOLIDAY / OFF-DUTY ALERT BANNER */}
          {isSelectedDateHoliday && (
            <View style={styles.holidayAlertBanner}>
              <Ionicons name="sunny-outline" size={20} color={NAVY_DARK} />
              <View style={{ flex: 1 }}>
                <Text style={styles.holidayAlertTitle}>
                  Marked as Off Duty ({activeCareMode})
                </Text>
                <Text style={styles.holidayAlertText}>
                  {activeData.holiday?.reason || 'Personal Leave'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleRemoveHoliday} style={styles.removeHolidayBtn}>
                <Text style={styles.removeHolidayText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* =========================================================
            2. WORKING HOURS / DUTY SHIFTS CARD
        ========================================================= */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Duty Timings</Text>
              <Text style={styles.cardSubtitle}>
                {activeCareMode} Working Shifts & Slot Timings
              </Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={openAddTiming}>
              <Ionicons name="add" size={17} color={NAVY} />
              <Text style={styles.addButtonText}>Add Timings</Text>
            </TouchableOpacity>
          </View>

          {/* SHIFTS LIST */}
          {activeData.workingHours.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="time-outline" size={28} color={MUTED} />
              <Text style={styles.emptyTitle}>No duty timings configured</Text>
              <Text style={styles.emptyText}>
                Tap "Add Timings" to set up your nursing visit shifts.
              </Text>
            </View>
          ) : (
            activeData.workingHours.map((shift) => (
              <View key={shift.id} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.itemIconWrap,
                      { backgroundColor: shift.enabled ? NAVY_LIGHT : '#F1F5F9' },
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={shift.enabled ? NAVY : MUTED}
                    />
                  </View>

                  <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
                    <Text
                      style={[styles.itemName, !shift.enabled && { color: '#94A3B8' }]}
                      numberOfLines={1}
                    >
                      {shift.start} {shift.startPeriod} - {shift.end} {shift.endPeriod}
                    </Text>
                    <Text style={styles.itemSublabel}>
                      {shift.name || 'Shift'} · {shift.duration || '45'} min per visit
                    </Text>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => openEditTiming(shift)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="create-outline" size={17} color={MUTED} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteTiming(shift.id)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="trash-outline" size={17} color={RED} />
                  </TouchableOpacity>

                  <Switch
                    value={shift.enabled}
                    onValueChange={() => handleToggleTiming(shift.id)}
                    trackColor={{ false: '#E2E8F0', true: '#7FE3D4' }}
                    thumbColor={shift.enabled ? TEAL : '#CBD5E1'}
                  />
                </View>
              </View>
            ))
          )}
        </Card>

        {/* =========================================================
            3. BREAKS & TRANSIT REST CARD
        ========================================================= */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Breaks & Transit</Text>
              <Text style={styles.cardSubtitle}>Rest intervals between patient visits</Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setBreakReason('Lunch & Transit Rest');
                setBreakStart('01:00 PM');
                setBreakEnd('02:00 PM');
                setBreakModalVisible(true);
              }}
            >
              <Ionicons name="add" size={17} color={NAVY} />
              <Text style={styles.addButtonText}>Add Break</Text>
            </TouchableOpacity>
          </View>

          {activeData.breaks.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="cafe-outline" size={28} color={MUTED} />
              <Text style={styles.emptyTitle}>No breaks scheduled</Text>
              <Text style={styles.emptyText}>Tap "Add Break" to schedule meal or transit time.</Text>
            </View>
          ) : (
            activeData.breaks.map((brk) => (
              <View key={brk.id} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.itemIconWrap,
                      { backgroundColor: brk.enabled ? '#FEF3C7' : '#F1F5F9' },
                    ]}
                  >
                    <Ionicons
                      name="cafe-outline"
                      size={16}
                      color={brk.enabled ? '#D97706' : MUTED}
                    />
                  </View>

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {brk.reason}
                    </Text>
                    <Text style={styles.itemSublabel}>
                      {brk.start} {brk.startPeriod} - {brk.end} {brk.endPeriod}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => handleDeleteBreak(brk.id)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="trash-outline" size={17} color={RED} />
                  </TouchableOpacity>

                  <Switch
                    value={brk.enabled}
                    onValueChange={() => handleToggleBreak(brk.id)}
                    trackColor={{ false: '#E2E8F0', true: '#FDE68A' }}
                    thumbColor={brk.enabled ? '#D97706' : '#CBD5E1'}
                  />
                </View>
              </View>
            ))
          )}
        </Card>

        {/* =========================================================
            4. OVERTIME & EMERGENCY CARE HOURS
        ========================================================= */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Overtime & Extended Hours</Text>
              <Text style={styles.cardSubtitle}>Special emergency on-call hours</Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setOvertimeReason('Extended Patient Visit');
                setOvertimeStart('08:30 PM');
                setOvertimeEnd('10:30 PM');
                setOvertimeModalVisible(true);
              }}
            >
              <Ionicons name="add" size={17} color={NAVY} />
              <Text style={styles.addButtonText}>Add Overtime</Text>
            </TouchableOpacity>
          </View>

          {activeData.emergencyHours.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="alarm-outline" size={28} color={MUTED} />
              <Text style={styles.emptyTitle}>No overtime hours configured</Text>
              <Text style={styles.emptyText}>Add extended care slots if available for overtime.</Text>
            </View>
          ) : (
            activeData.emergencyHours.map((ot) => (
              <View key={ot.id} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View style={[styles.itemIconWrap, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="alarm-outline" size={16} color={RED} />
                  </View>

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {ot.reason}
                    </Text>
                    <Text style={styles.itemSublabel}>
                      {ot.start} {ot.startPeriod} - {ot.end} {ot.endPeriod}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteOvertime(ot.id)}
                  style={styles.iconBtn}
                >
                  <Ionicons name="trash-outline" size={17} color={RED} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </Card>

        {/* =========================================================
            5. PLANNED LEAVES & HOLIDAYS CARD
        ========================================================= */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Planned Leave & Time Off</Text>
              <Text style={styles.cardSubtitle}>Mark full days as unavailable</Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setHolidayReason('Personal Leave');
                setHolidayFrom(selectedDate || todayKey);
                setHolidayTo(selectedDate || todayKey);
                setHolidayModalVisible(true);
              }}
            >
              <Ionicons name="add" size={17} color={NAVY} />
              <Text style={styles.addButtonText}>Mark Leave</Text>
            </TouchableOpacity>
          </View>

          {isSelectedDateHoliday ? (
            <View style={styles.leaveActiveCard}>
              <View style={styles.leaveIconBox}>
                <Ionicons name="airplane-outline" size={20} color={NAVY} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.leaveReasonText}>
                  {activeData.holiday?.reason || 'Off Duty'}
                </Text>
                <Text style={styles.leaveDatesText}>
                  {activeData.holiday?.from
                    ? `${formatShortDate(activeData.holiday.from)} - ${formatDate(
                        activeData.holiday.to
                      )}`
                    : formatDate(selectedDate)}
                </Text>
              </View>
              <TouchableOpacity onPress={handleRemoveHoliday} style={styles.removeLeavePill}>
                <Text style={styles.removeLeaveText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="sunny-outline" size={28} color={MUTED} />
              <Text style={styles.emptyTitle}>Currently on duty</Text>
              <Text style={styles.emptyText}>Tap "Mark Leave" to set vacation or off-duty dates.</Text>
            </View>
          )}
        </Card>

        {/* STICKY SAVE AVAILABILITY BUTTON */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSaveAllAvailability}
            activeOpacity={0.88}
          >
            <Text style={styles.saveBtnText}>Save Availability</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ========================================================
          ALL-IN-ONE CALENDAR MODAL (EXACTLY AS DOCTOR AVAILABILITY)
      ======================================================== */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalCard}>
            <View style={styles.calModalHeader}>
              <Text style={styles.calModalTitle}>Schedule Calendar</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Ionicons name="close" size={22} color={MUTED} />
              </TouchableOpacity>
            </View>

            {/* TABS: Today, Date, Week, Month, Year */}
            <View style={styles.calTabsRow}>
              {['today', 'date', 'week', 'month', 'year'].map((tab) => {
                const isActive = calendarTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.calTab, isActive && styles.calTabActive]}
                    onPress={() => {
                      setCalendarTab(tab);
                      if (tab === 'today') {
                        setSelectedDate(todayKey);
                        setRangeFrom(null);
                        setRangeTo(null);
                        setSelectedScope('today');
                      } else if (tab === 'week') {
                        const w = getWeekRange(selectedDate || todayKey);
                        setRangeFrom(w.from);
                        setRangeTo(w.to);
                        setSelectedScope('week');
                      } else if (tab === 'month') {
                        setSelectedScope('month');
                      } else if (tab === 'year') {
                        setSelectedScope('year');
                      } else {
                        setSelectedScope('date');
                      }
                    }}
                  >
                    <Text style={[styles.calTabText, isActive && styles.calTabTextActive]}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* MONTH / YEAR NAVIGATION HEADER */}
            <View style={styles.calNavRow}>
              <TouchableOpacity
                onPress={() => {
                  if (calendarMonth === 0) {
                    setCalendarMonth(11);
                    setCalendarYear((y) => y - 1);
                  } else {
                    setCalendarMonth((m) => m - 1);
                  }
                }}
                style={styles.calNavArrow}
              >
                <Ionicons name="chevron-back" size={20} color={NAVY} />
              </TouchableOpacity>

              <Text style={styles.calNavMonthYear}>
                {MONTHS[calendarMonth]} {calendarYear}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (calendarMonth === 11) {
                    setCalendarMonth(0);
                    setCalendarYear((y) => y + 1);
                  } else {
                    setCalendarMonth((m) => m + 1);
                  }
                }}
                style={styles.calNavArrow}
              >
                <Ionicons name="chevron-forward" size={20} color={NAVY} />
              </TouchableOpacity>
            </View>

            {/* CALENDAR GRID */}
            <View style={styles.calDaysHeader}>
              {WEEK_DAYS.map((d) => (
                <Text key={d} style={styles.calDayHeaderCell}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.calGrid}>
              {createCalendarDays(calendarYear, calendarMonth).map((d, index) => {
                if (!d) return <View key={`empty_${index}`} style={styles.calEmptyCell} />;
                const k = dateKey(d);
                const isToday = k === todayKey;
                const isSelected = selectedDate === k;
                const inRange = rangeFrom && rangeTo && isBetween(k, rangeFrom, rangeTo);

                return (
                  <TouchableOpacity
                    key={k}
                    style={[
                      styles.calDayCell,
                      inRange && styles.calCellInRange,
                      (isSelected || k === rangeFrom || k === rangeTo) && styles.calCellSelected,
                      isToday && !isSelected && styles.calCellToday,
                    ]}
                    onPress={() => {
                      if (calendarTab === 'week') {
                        const w = getWeekRange(k);
                        setRangeFrom(w.from);
                        setRangeTo(w.to);
                        setSelectedDate(k);
                      } else {
                        setSelectedDate(k);
                        setRangeFrom(null);
                        setRangeTo(null);
                        setSelectedScope('date');
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.calDayNum,
                        (isSelected || k === rangeFrom || k === rangeTo) && styles.calDayNumSelected,
                        isToday && !isSelected && styles.calDayNumToday,
                      ]}
                    >
                      {d.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.calApplyBtn}
              onPress={handleApplyCalendarSelection}
              activeOpacity={0.88}
            >
              <Text style={styles.calApplyBtnText}>Apply Selection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          SCROLLING TIME PICKER POPUP (HOURS + MINUTES + AM/PM)
      ======================================================== */}
      <Modal
        visible={timePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.timePickerOverlay}>
          <View style={styles.timePickerCard}>
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>{timePickerTitle}</Text>
              <TouchableOpacity onPress={() => setTimePickerVisible(false)}>
                <Ionicons name="close" size={22} color={MUTED} />
              </TouchableOpacity>
            </View>

            <View style={styles.wheelContainer}>
              {/* HOURS COLUMN */}
              <View style={styles.wheelCol}>
                <Text style={styles.wheelHeader}>Hour</Text>
                <ScrollView style={{ height: 160 }} showsVerticalScrollIndicator={false}>
                  {HOURS_LIST.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.wheelItem, pickerHour === h && styles.wheelItemActive]}
                      onPress={() => setPickerHour(h)}
                    >
                      <Text
                        style={[styles.wheelText, pickerHour === h && styles.wheelTextActive]}
                      >
                        {h}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.wheelColon}>:</Text>

              {/* MINUTES COLUMN */}
              <View style={styles.wheelCol}>
                <Text style={styles.wheelHeader}>Min</Text>
                <ScrollView style={{ height: 160 }} showsVerticalScrollIndicator={false}>
                  {MINUTES_LIST.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.wheelItem, pickerMinute === m && styles.wheelItemActive]}
                      onPress={() => setPickerMinute(m)}
                    >
                      <Text
                        style={[styles.wheelText, pickerMinute === m && styles.wheelTextActive]}
                      >
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* AM / PM COLUMN */}
              <View style={styles.wheelCol}>
                <Text style={styles.wheelHeader}>Period</Text>
                <View style={{ height: 160, justifyContent: 'center', gap: 10 }}>
                  {['AM', 'PM'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.wheelItem, pickerPeriod === p && styles.wheelItemActive]}
                      onPress={() => setPickerPeriod(p)}
                    >
                      <Text
                        style={[styles.wheelText, pickerPeriod === p && styles.wheelTextActive]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.timePickerConfirmBtn}
              onPress={handleConfirmTimePicker}
            >
              <Text style={styles.timePickerConfirmText}>Set Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          ADD / EDIT TIMING MODAL
      ======================================================== */}
      <Modal
        visible={timingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTimingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModalCard}>
            <View style={styles.calModalHeader}>
              <Text style={styles.calModalTitle}>
                {timingEditingId ? 'Edit Duty Shift' : 'Add Duty Shift'}
              </Text>
              <TouchableOpacity onPress={() => setTimingModalVisible(false)}>
                <Ionicons name="close" size={22} color={MUTED} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalFieldLabel}>Shift Description</Text>
            <TextInput
              style={styles.modalInput}
              value={timingName}
              onChangeText={setTimingName}
              placeholder="e.g. Morning Home Care Shift"
            />

            <View style={styles.timeRowContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalFieldLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.timePickerBtn}
                  onPress={() =>
                    openTimePicker('Select Start Time', timingStart, (res) =>
                      setTimingStart(res.full)
                    )
                  }
                >
                  <Ionicons name="time-outline" size={17} color={NAVY} />
                  <Text style={styles.timePickerBtnText}>{timingStart}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.modalFieldLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.timePickerBtn}
                  onPress={() =>
                    openTimePicker('Select End Time', timingEnd, (res) =>
                      setTimingEnd(res.full)
                    )
                  }
                >
                  <Ionicons name="time-outline" size={17} color={NAVY} />
                  <Text style={styles.timePickerBtnText}>{timingEnd}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.modalFieldLabel}>Patient Visit Duration (Minutes)</Text>
            <View style={styles.durationQuickRow}>
              {DURATION_QUICK_OPTIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.durationQuickBtn,
                    timingDuration === d && styles.durationQuickBtnActive,
                  ]}
                  onPress={() => setTimingDuration(d)}
                >
                  <Text
                    style={[
                      styles.durationQuickText,
                      timingDuration === d && styles.durationQuickTextActive,
                    ]}
                  >
                    {d} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveTiming}>
              <Text style={styles.modalSaveBtnText}>Save Shift</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          ADD BREAK MODAL
      ======================================================== */}
      <Modal
        visible={breakModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBreakModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModalCard}>
            <View style={styles.calModalHeader}>
              <Text style={styles.calModalTitle}>Add Break & Transit Rest</Text>
              <TouchableOpacity onPress={() => setBreakModalVisible(false)}>
                <Ionicons name="close" size={22} color={MUTED} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalFieldLabel}>Reason / Break Type</Text>
            <TextInput
              style={styles.modalInput}
              value={breakReason}
              onChangeText={setBreakReason}
              placeholder="e.g. Lunch & Transit Rest"
            />

            <View style={styles.suggestionChipsRow}>
              {BREAK_REASON_SUGGESTIONS.slice(0, 4).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionChip}
                  onPress={() => setBreakReason(s)}
                >
                  <Text style={styles.suggestionChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timeRowContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalFieldLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.timePickerBtn}
                  onPress={() =>
                    openTimePicker('Select Break Start', breakStart, (res) =>
                      setBreakStart(res.full)
                    )
                  }
                >
                  <Ionicons name="time-outline" size={17} color={NAVY} />
                  <Text style={styles.timePickerBtnText}>{breakStart}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.modalFieldLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.timePickerBtn}
                  onPress={() =>
                    openTimePicker('Select Break End', breakEnd, (res) =>
                      setBreakEnd(res.full)
                    )
                  }
                >
                  <Ionicons name="time-outline" size={17} color={NAVY} />
                  <Text style={styles.timePickerBtnText}>{breakEnd}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveBreak}>
              <Text style={styles.modalSaveBtnText}>Save Break</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          ADD OVERTIME MODAL
      ======================================================== */}
      <Modal
        visible={overtimeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOvertimeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModalCard}>
            <View style={styles.calModalHeader}>
              <Text style={styles.calModalTitle}>Add Overtime / On-Call</Text>
              <TouchableOpacity onPress={() => setOvertimeModalVisible(false)}>
                <Ionicons name="close" size={22} color={MUTED} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalFieldLabel}>Reason / Shift Name</Text>
            <TextInput
              style={styles.modalInput}
              value={overtimeReason}
              onChangeText={setOvertimeReason}
            />

            <View style={styles.suggestionChipsRow}>
              {OVERTIME_REASON_SUGGESTIONS.slice(0, 3).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionChip}
                  onPress={() => setOvertimeReason(s)}
                >
                  <Text style={styles.suggestionChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timeRowContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalFieldLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.timePickerBtn}
                  onPress={() =>
                    openTimePicker('Select Overtime Start', overtimeStart, (res) =>
                      setOvertimeStart(res.full)
                    )
                  }
                >
                  <Ionicons name="time-outline" size={17} color={NAVY} />
                  <Text style={styles.timePickerBtnText}>{overtimeStart}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.modalFieldLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.timePickerBtn}
                  onPress={() =>
                    openTimePicker('Select Overtime End', overtimeEnd, (res) =>
                      setOvertimeEnd(res.full)
                    )
                  }
                >
                  <Ionicons name="time-outline" size={17} color={NAVY} />
                  <Text style={styles.timePickerBtnText}>{overtimeEnd}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveOvertime}>
              <Text style={styles.modalSaveBtnText}>Save Overtime</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          MARK LEAVE / HOLIDAY MODAL
      ======================================================== */}
      <Modal
        visible={holidayModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setHolidayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModalCard}>
            <View style={styles.calModalHeader}>
              <Text style={styles.calModalTitle}>Mark Leave / Off Duty</Text>
              <TouchableOpacity onPress={() => setHolidayModalVisible(false)}>
                <Ionicons name="close" size={22} color={MUTED} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalFieldLabel}>Reason for Leave</Text>
            <TextInput
              style={styles.modalInput}
              value={holidayReason}
              onChangeText={setHolidayReason}
            />

            <View style={styles.suggestionChipsRow}>
              {LEAVE_REASON_SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionChip}
                  onPress={() => setHolidayReason(s)}
                >
                  <Text style={styles.suggestionChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveHoliday}>
              <Text style={styles.modalSaveBtnText}>Mark Off Duty</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QUICK CALL MODAL */}
      <CallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
      />
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

  /* Header Navy (Matching Doctor Availability exactly) */
  headerNavy: {
    backgroundColor: '#071E42',
    paddingTop:
      Platform.OS === 'ios'
        ? 52
        : (StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 46),
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  topBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  brandName: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandMedi: {
    color: '#00B894',
    fontWeight: '900',
  },
  brandUnify: {
    color: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B894',
  },
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
  },
  headerNavCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  /* Current Status Bar */
  statusSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statusPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusPillActive: {
    backgroundColor: '#00B894',
    borderColor: '#00B894',
  },
  statusActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  statusPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  statusPillTextActive: {
    color: '#FFFFFF',
  },
  autoUpdateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  autoUpdateText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },

  /* Care Mode / Channel */
  careModeSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  careModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  careModeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  careModeBtnActive: {
    backgroundColor: '#071E42',
  },
  careModeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  careModeTextActive: {
    color: '#FFFFFF',
  },

  /* Card */
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  cardHoliday: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFF',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
  },

  /* All-in-One Date Select Button */
  dateSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  dateSelectBtnHoliday: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  dateSelectBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateSelectIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateSelectLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  dateSelectValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#08317C',
    marginTop: 2,
  },
  calendarOpenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  calendarOpenBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },
  holidayHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  holidayHeaderPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
  },
  holidayAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  holidayAlertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  holidayAlertText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  removeHolidayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  removeHolidayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },

  /* Item Cards (Shifts, Breaks, Overtime) */
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  itemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#08317C',
  },
  itemSublabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 6,
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },

  /* Leave Card */
  leaveActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leaveIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveReasonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#08317C',
  },
  leaveDatesText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  removeLeavePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  removeLeaveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },

  /* Save Button Container */
  saveContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: '#071E42',
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 17, 39, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  actionModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  calendarModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  calModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#08317C',
  },
  calTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  calTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  calTabActive: {
    backgroundColor: '#071E42',
  },
  calTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  calTabTextActive: {
    color: '#FFFFFF',
  },
  calNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  calNavArrow: {
    padding: 6,
  },
  calNavMonthYear: {
    fontSize: 15,
    fontWeight: '800',
    color: '#08317C',
  },
  calDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  calDayHeaderCell: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  calEmptyCell: {
    width: '14.28%',
    height: 40,
  },
  calDayCell: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  calCellSelected: {
    backgroundColor: '#00B894',
  },
  calCellInRange: {
    backgroundColor: '#E6FAF6',
    borderRadius: 0,
  },
  calCellToday: {
    borderWidth: 1.5,
    borderColor: '#071E42',
  },
  calDayNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  calDayNumSelected: {
    color: '#FFFFFF',
  },
  calDayNumToday: {
    color: '#071E42',
  },
  calApplyBtn: {
    backgroundColor: '#00B894',
    height: 46,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  calApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Time Picker Overlay */
  timePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 17, 39, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  timePickerCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
  },
  wheelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  wheelCol: {
    flex: 1,
    alignItems: 'center',
  },
  wheelHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  wheelColon: {
    fontSize: 22,
    fontWeight: '900',
    color: '#08317C',
    paddingBottom: 20,
  },
  wheelItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  wheelItemActive: {
    backgroundColor: '#071E42',
  },
  wheelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  wheelTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  timePickerConfirmBtn: {
    backgroundColor: '#00B894',
    height: 46,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  timePickerConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Action Modal Inputs */
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#1E293B',
  },
  timeRowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  timePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  timePickerBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#08317C',
  },
  durationQuickRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  durationQuickBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  durationQuickBtnActive: {
    backgroundColor: '#071E42',
  },
  durationQuickText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  durationQuickTextActive: {
    color: '#FFFFFF',
  },
  suggestionChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 6,
  },
  suggestionChip: {
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  suggestionChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#071E42',
  },
  modalSaveBtn: {
    backgroundColor: '#00B894',
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
