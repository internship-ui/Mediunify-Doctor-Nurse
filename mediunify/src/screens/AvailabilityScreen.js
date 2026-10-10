import React, { useMemo, useState, useRef, useEffect } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import Logo from '../components/Logo';
import Card from '../components/Card';
import AppButton from '../components/AppButton';

/*
|--------------------------------------------------------------------------
| COLOR PALETTE
|--------------------------------------------------------------------------
*/
const TEAL = '#071E42'; // Navy Blue Primary
const TEAL_DARK = '#061A3A'; // Dark Navy Blue
const TEAL_LIGHT = '#EEF4FC'; // Soft Navy Blue Tint
const TEAL_RANGE = '#E2ECF8'; // Navy Blue Selection Range

const BORDER = '#D6E7E5';
const TEXT = '#1E293B';
const MUTED = '#64748B';
const BG = '#F6F9F9';

const RED = '#DC2626';

/*
|--------------------------------------------------------------------------
| CONSTANTS & SUGGESTIONS
|--------------------------------------------------------------------------
*/
const CONSULTATION_TYPES = [
  { key: 'In-Person', label: 'In-Person', icon: 'business-outline' },
  { key: 'Video', label: 'Video Consultation', icon: 'videocam-outline' },
];



const BREAK_REASON_SUGGESTIONS = [
  'Lunch Break',
  'Tea / Coffee Break',
  'Hospital Rounds',
  'Rest / Personal Break',
  'Emergency Break',
  'Prayer Break',
];

const EMERGENCY_REASON_SUGGESTIONS = [
  'Extended Hours',
  'Urgent Case Overtime',
  'Overtime Consultation',
  'Extended Evening Clinic',
  'Urgent Patient Case',
  'Emergency Case On-Call',
  'Special Patient Follow-up',
  'Emergency Surgery Duty',
];

const HOLIDAY_REASON_SUGGESTIONS = [
  'Clinic Closed / Weekly Off',
  'Annual Vacation Leave',
  'National / Festival Holiday',
  'Medical Conference / CME',
  'Personal Emergency',
];

const DURATION_QUICK_OPTIONS = ['5', '10', '15', '30'];

const HOURS_LIST = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES_LIST = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

/*
|--------------------------------------------------------------------------
| CALENDAR CONSTANTS & HELPERS
|--------------------------------------------------------------------------
*/
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const YEARS = Array.from({ length: 15 }, (_, i) => 2024 + i);

const pad = (number) => String(number).padStart(2, '0');

const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const keyToDate = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (key) => {
  if (!key) return '';
  const date = keyToDate(key);
  return `${pad(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const formatShortDate = (key) => {
  if (!key) return '';
  const date = keyToDate(key);
  return `${pad(date.getDate())} ${MONTHS[date.getMonth()].slice(0, 3)}`;
};

const formatFullDay = (key) => {
  if (!key) return '';
  const date = keyToDate(key);
  const dayName = WEEK_DAYS[date.getDay()];
  return `${dayName}, ${pad(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const clone = (data) => JSON.parse(JSON.stringify(data));

const isBetween = (key, from, to) => {
  if (!from || !to) return false;
  const current = keyToDate(key).getTime();
  const start = keyToDate(from).getTime();
  const end = keyToDate(to).getTime();

  return current >= Math.min(start, end) && current <= Math.max(start, end);
};

const createCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result = [];

  for (let i = 0; i < firstDay; i++) {
    result.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    result.push(new Date(year, month, day));
  }

  return result;
};

// Calculate 7-day week range for a given date
const getWeekRange = (key) => {
  const d = keyToDate(key);
  const dayOfWeek = d.getDay(); // 0 = Sun
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - dayOfWeek);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  return { from: dateKey(sunday), to: dateKey(saturday) };
};

/*
|--------------------------------------------------------------------------
| DEFAULT SCHEDULES (UNIFIED WORKING HOURS)
|--------------------------------------------------------------------------
*/
const defaultInPersonShifts = [];
const defaultVideoShifts = [];

const emptyDateData = () => ({
  'In-Person': {
    workingHours: clone(defaultInPersonShifts),
    breaks: [
      {
        id: 'break_lunch',
        reason: 'Lunch Break',
        start: '01:00',
        startPeriod: 'PM',
        end: '02:00',
        endPeriod: 'PM',
      },
    ],
    emergencyHours: [],
  },
  'Video': {
    workingHours: clone(defaultVideoShifts),
    breaks: [
      {
        id: 'break_coffee',
        reason: 'Tea / Coffee Break',
        start: '05:00',
        startPeriod: 'PM',
        end: '05:30',
        endPeriod: 'PM',
      },
    ],
    emergencyHours: [],
  },
  holiday: null, // { from, to, reason }
});

/*
|==========================================================================
| MAIN AVAILABILITY SCREEN
|==========================================================================
*/
export default function AvailabilityScreen({ route, navigation }) {
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
  const today = new Date();
  const todayKey = dateKey(today);

  // Consultation channel
  const [activeConsultationType, setActiveConsultationType] = useState('In-Person'); // 'In-Person' | 'Video'

  // Date selection state
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [rangeFrom, setRangeFrom] = useState(null);
  const [rangeTo, setRangeTo] = useState(null);
  const [selectedScope, setSelectedScope] = useState('date'); // 'today' | 'date' | 'week' | 'month' | 'year'

  // Overrides & ranges
  const [singleOverrides, setSingleOverrides] = useState({});
  const [rangeAvailability, setRangeAvailability] = useState([]);

  // All-in-One Calendar Modal state (Matching image)
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTab, setCalendarTab] = useState('today'); // 'today' | 'date' | 'week' | 'month' | 'year'
  const [calendarViewMode, setCalendarViewMode] = useState('date'); // 'date' | 'month' | 'year'
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  // Scrolling Time Picker Wheel Popup State
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [timePickerTitle, setTimePickerTitle] = useState('Select Time');
  const [pickerHour, setPickerHour] = useState('09');
  const [pickerMinute, setPickerMinute] = useState('00');
  const [pickerPeriod, setPickerPeriod] = useState('AM');
  const [timePickerCallback, setTimePickerCallback] = useState(null);

  // Add / Edit Shift Timing Modal
  const [timingModalVisible, setTimingModalVisible] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [timingForm, setTimingForm] = useState({
    start: '09:00',
    startPeriod: 'AM',
    end: '01:00',
    endPeriod: 'PM',
    duration: '15',
    enabled: true,
  });

  // Break Modal State
  const [breakModalVisible, setBreakModalVisible] = useState(false);
  const [editingBreakIndex, setEditingBreakIndex] = useState(null);
  const [breakForm, setBreakForm] = useState({
    reason: '',
    start: '01:00',
    startPeriod: 'PM',
    end: '02:00',
    endPeriod: 'PM',
  });
  const [breakSuggestionsVisible, setBreakSuggestionsVisible] = useState(false);

  // Holiday Modal State
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);
  const [holidayFrom, setHolidayFrom] = useState(todayKey);
  const [holidayTo, setHolidayTo] = useState(todayKey);
  const [holidayReason, setHolidayReason] = useState('');
  const [holidaySuggestionsVisible, setHolidaySuggestionsVisible] = useState(false);
  const [holidayDatePickerVisible, setHolidayDatePickerVisible] = useState(false);
  const [holidayDateTarget, setHolidayDateTarget] = useState('from'); // 'from' | 'to'
  const [holidayPickerMonth, setHolidayPickerMonth] = useState(today.getMonth());
  const [holidayPickerYear, setHolidayPickerYear] = useState(today.getFullYear());

  // Emergency & Extended Hours State
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [editingEmergencyId, setEditingEmergencyId] = useState(null);
  const [emergencyForm, setEmergencyForm] = useState({
    reason: '',
    start: '08:00',
    startPeriod: 'PM',
    end: '10:00',
    endPeriod: 'PM',
    enabled: true,
  });
  const [emergencySuggestionsVisible, setEmergencySuggestionsVisible] = useState(false);
  const emergencyScrollRef = useRef(null);
  const breakScrollRef = useRef(null);

  // Keyboard state for modals to prevent dropdown & inputs from overlapping
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

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

  /*
  |--------------------------------------------------------------------------
  | DATA MERGING
  |--------------------------------------------------------------------------
  */
  const getRangeForDate = (key) => {
    const matches = rangeAvailability.filter((item) => isBetween(key, item.from, item.to));
    if (!matches.length) return null;
    return matches[matches.length - 1];
  };

  const getFullDataForDate = (key) => {
    const range = getRangeForDate(key);
    const base = range ? clone(range.data) : emptyDateData();
    const override = singleOverrides[key];

    if (!override) return base;

    return {
      'In-Person': override['In-Person']
        ? clone(override['In-Person'])
        : base['In-Person'],
      'Video': override['Video']
        ? clone(override['Video'])
        : base['Video'],
      holiday: override.holiday !== undefined ? clone(override.holiday) : base.holiday,
    };
  };

  const activeData = useMemo(() => {
    const full = getFullDataForDate(selectedDate);
    const channelData = full[activeConsultationType] || full['In-Person'] || {
      workingHours: [],
      breaks: [],
      emergencyHours: [],
    };

    return {
      workingHours: channelData.workingHours || [],
      breaks: channelData.breaks || [],
      emergencyHours: channelData.emergencyHours || [],
      holiday: full.holiday,
    };
  }, [selectedDate, activeConsultationType, singleOverrides, rangeAvailability]);

  // Check if a date has holiday
  const checkDateHoliday = (key) => {
    const full = getFullDataForDate(key);
    return full.holiday;
  };

  const saveActiveData = (newData) => {
    if (rangeFrom && rangeTo && rangeFrom !== rangeTo) {
      // Save for range
      const from = rangeFrom < rangeTo ? rangeFrom : rangeTo;
      const to = rangeFrom < rangeTo ? rangeTo : rangeFrom;

      setRangeAvailability((prev) => {
        const filtered = prev.filter((item) => !(item.from === from && item.to === to));
        const base = emptyDateData();
        base[activeConsultationType] = {
          workingHours: clone(newData.workingHours),
          breaks: clone(newData.breaks),
          emergencyHours: clone(newData.emergencyHours),
        };
        base.holiday = newData.holiday;

        return [
          ...filtered,
          {
            id: `${from}_${to}`,
            from,
            to,
            data: base,
          },
        ];
      });
    } else {
      // Single date
      setSingleOverrides((prev) => {
        const full = getFullDataForDate(selectedDate);
        return {
          ...prev,
          [selectedDate]: {
            ...full,
            [activeConsultationType]: {
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

  /*
  |--------------------------------------------------------------------------
  | TIME PICKER WHEEL / POPUP HANDLERS
  |--------------------------------------------------------------------------
  */
  const openTimePicker = (title, currentFormattedTime, onConfirm) => {
    // Expected format: "09:00 AM"
    const parts = (currentFormattedTime || '09:00 AM').split(' ');
    const timeParts = (parts[0] || '09:00').split(':');
    setPickerHour(timeParts[0] || '09');
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

  /*
  |--------------------------------------------------------------------------
  | CALENDAR SELECTION (ALL-IN-ONE MATCHING IMAGE)
  |--------------------------------------------------------------------------
  */
  const openCalendarModal = () => {
    const cur = keyToDate(selectedDate || todayKey);
    setCalendarYear(cur.getFullYear());
    setCalendarMonth(cur.getMonth());
    if (selectedScope === 'today') {
      setCalendarTab('today');
    } else if (selectedScope === 'week') {
      setCalendarTab('week');
    } else if (selectedScope === 'month') {
      setCalendarTab('month');
    } else if (selectedScope === 'year') {
      setCalendarTab('year');
    } else {
      setCalendarTab('date');
    }
    setCalendarViewMode('date');
    setCalendarVisible(true);
  };

  const handleSidebarTabSelect = (tab) => {
    setCalendarTab(tab);

    if (tab === 'today') {
      setCalendarViewMode('date');
      setSelectedDate(todayKey);
      setRangeFrom(todayKey);
      setRangeTo(todayKey);
      setSelectedScope('today');
      setCalendarMonth(today.getMonth());
      setCalendarYear(today.getFullYear());
    } else if (tab === 'date') {
      setCalendarViewMode('date');
      setSelectedScope('date');
      // Prepare for Date Range selection:
      // If currently has a single date or today selected, ready to pick the 2nd date to complete the range
      if (rangeFrom && rangeTo && rangeFrom === rangeTo) {
        setRangeTo(null);
      } else if (!rangeFrom) {
        setRangeFrom(selectedDate || todayKey);
        setRangeTo(null);
      }
    } else if (tab === 'week') {
      setCalendarViewMode('date');
      const wk = getWeekRange(selectedDate || todayKey);
      setSelectedDate(wk.from);
      setRangeFrom(wk.from);
      setRangeTo(wk.to);
      setSelectedScope('week');
    } else if (tab === 'month') {
      setSelectedScope('month');
      setCalendarViewMode('month');
    } else if (tab === 'year') {
      setSelectedScope('year');
      setCalendarViewMode('year');
    }
  };

  const handleSelectMonth = (idx) => {
    const y = calendarYear;
    const firstDateKey = `${y}-${pad(idx + 1)}-01`;
    const daysInM = new Date(y, idx + 1, 0).getDate();
    const lastDateKey = `${y}-${pad(idx + 1)}-${pad(daysInM)}`;

    setCalendarMonth(idx);
    setSelectedDate(firstDateKey);
    setRangeFrom(firstDateKey);
    setRangeTo(lastDateKey);
    setSelectedScope('month');
    setCalendarTab('month');
    setCalendarViewMode('date');
  };

  const handleSelectYear = (y) => {
    const firstDateKey = `${y}-01-01`;
    const lastDateKey = `${y}-12-31`;

    setCalendarYear(y);
    setSelectedDate(firstDateKey);
    setRangeFrom(firstDateKey);
    setRangeTo(lastDateKey);
    setSelectedScope('year');
    setCalendarTab('year');
    setCalendarViewMode('date');
  };

  const handleDaySelect = (date) => {
    const key = dateKey(date);

    if (calendarTab === 'today') {
      if (key === todayKey) {
        setSelectedDate(todayKey);
        setRangeFrom(todayKey);
        setRangeTo(todayKey);
        setSelectedScope('today');
      } else {
        // User clicked a different day while on today tab -> switch to date range mode starting with this day
        setCalendarTab('date');
        setSelectedDate(key);
        setRangeFrom(key);
        setRangeTo(null);
        setSelectedScope('date');
      }
      return;
    }

    if (calendarTab === 'week') {
      // Week mode: tapping ANY date selects that date's entire week!
      const wk = getWeekRange(key);
      setSelectedDate(key);
      setRangeFrom(wk.from);
      setRangeTo(wk.to);
      setSelectedScope('week');
      return;
    }

    if (calendarTab === 'month' || calendarTab === 'year') {
      // Tapping a specific date from month/year view switches to date range mode
      setCalendarTab('date');
      setSelectedDate(key);
      setRangeFrom(key);
      setRangeTo(null);
      setSelectedScope('date');
      return;
    }

    // Default: calendarTab === 'date' (Date Range selection!)
    if (!rangeFrom) {
      // 1st click: sets range start date
      setSelectedDate(key);
      setRangeFrom(key);
      setRangeTo(null);
      setSelectedScope('date');
    } else if (rangeFrom && !rangeTo) {
      // 2nd click: sets range end date!
      if (key === rangeFrom) {
        setRangeTo(key);
        setSelectedScope('date');
      } else {
        const from = rangeFrom < key ? rangeFrom : key;
        const to = rangeFrom < key ? key : rangeFrom;
        setRangeFrom(from);
        setRangeTo(to);
        setSelectedDate(from);
        setSelectedScope('range');
      }
    } else {
      // Already has a range -> clicking a day starts a new date range selection!
      setSelectedDate(key);
      setRangeFrom(key);
      setRangeTo(null);
      setSelectedScope('date');
    }
  };

  const previousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | WORKING HOURS (UNIFIED, SCROLLING TIME PICKERS, DURATION)
  |--------------------------------------------------------------------------
  */
  const openAddTiming = () => {
    setEditingShiftId(null);
    setTimingForm({
      start: '09:00',
      startPeriod: 'AM',
      end: '01:00',
      endPeriod: 'PM',
      duration: '15',
      enabled: true,
    });
    setTimingModalVisible(true);
  };

  const openEditTiming = (shift) => {
    setEditingShiftId(shift.id);
    setTimingForm({
      start: shift.start,
      startPeriod: shift.startPeriod,
      end: shift.end,
      endPeriod: shift.endPeriod,
      duration: shift.duration || '15',
      enabled: shift.enabled,
    });
    setTimingModalVisible(true);
  };

  const saveTiming = () => {
    const workingHours = clone(activeData.workingHours);
    const newTiming = {
      id: editingShiftId || `shift_${Date.now()}`,
      start: timingForm.start,
      startPeriod: timingForm.startPeriod,
      end: timingForm.end,
      endPeriod: timingForm.endPeriod,
      duration: timingForm.duration || '15',
      enabled: timingForm.enabled,
    };

    if (editingShiftId) {
      const idx = workingHours.findIndex((s) => s.id === editingShiftId);
      if (idx !== -1) workingHours[idx] = newTiming;
    } else {
      workingHours.push(newTiming);
    }

    saveActiveData({ ...activeData, workingHours });
    setTimingModalVisible(false);
  };

  const toggleTiming = (id) => {
    const workingHours = clone(activeData.workingHours);
    const idx = workingHours.findIndex((s) => s.id === id);
    if (idx !== -1) {
      workingHours[idx].enabled = !workingHours[idx].enabled;
      saveActiveData({ ...activeData, workingHours });
    }
  };

  const deleteTiming = (id) => {
    Alert.alert('Delete Slot', 'Are you sure you want to remove this working slot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const workingHours = activeData.workingHours.filter((s) => s.id !== id);
          saveActiveData({ ...activeData, workingHours });
        },
      },
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | BREAKS HANDLERS (WITH REASON AUTO-SUGGESTION)
  |--------------------------------------------------------------------------
  */
  const openAddBreak = () => {
    setEditingBreakIndex(null);
    setBreakForm({
      reason: '',
      start: '01:00',
      startPeriod: 'PM',
      end: '02:00',
      endPeriod: 'PM',
    });
    setBreakSuggestionsVisible(false);
    setBreakModalVisible(true);
  };

  const openEditBreak = (idx) => {
    const b = activeData.breaks[idx];
    setEditingBreakIndex(idx);
    setBreakForm({
      reason: b.reason || 'Lunch Break',
      start: b.start,
      startPeriod: b.startPeriod,
      end: b.end,
      endPeriod: b.endPeriod,
    });
    setBreakSuggestionsVisible(false);
    setBreakModalVisible(true);
  };

  const saveBreak = () => {
    if (!breakForm.reason.trim()) {
      Alert.alert('Break Reason', 'Please enter or select a reason for this break.');
      return;
    }

    const breaks = clone(activeData.breaks);
    const newB = {
      id: `break_${Date.now()}`,
      reason: breakForm.reason.trim(),
      start: breakForm.start,
      startPeriod: breakForm.startPeriod,
      end: breakForm.end,
      endPeriod: breakForm.endPeriod,
    };

    if (editingBreakIndex !== null) {
      breaks[editingBreakIndex] = newB;
    } else {
      breaks.push(newB);
    }

    saveActiveData({ ...activeData, breaks });
    setBreakModalVisible(false);
  };

  const deleteBreak = (idx) => {
    Alert.alert('Delete Break', 'Remove this break slot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const breaks = activeData.breaks.filter((_, i) => i !== idx);
          saveActiveData({ ...activeData, breaks });
        },
      },
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | HOLIDAY (REASON & POP-UP CALENDAR FROM-TO)
  |--------------------------------------------------------------------------
  */
  const openHolidayModal = () => {
    const h = activeData.holiday;
    setHolidayReason(h?.reason || '');
    setHolidayFrom(h?.from || selectedDate);
    setHolidayTo(h?.to || selectedDate);
    setHolidaySuggestionsVisible(false);
    setHolidayDatePickerVisible(false);
    setHolidayModalVisible(true);
  };

  const openHolidayDatePicker = (target) => {
    setHolidayDateTarget(target);
    const currentDateKey = target === 'from' ? (holidayFrom || selectedDate) : (holidayTo || selectedDate);
    const d = keyToDate(currentDateKey);
    setHolidayPickerMonth(d.getMonth());
    setHolidayPickerYear(d.getFullYear());
    setHolidayDatePickerVisible(true);
  };

  const prevHolidayMonth = () => {
    if (holidayPickerMonth === 0) {
      setHolidayPickerMonth(11);
      setHolidayPickerYear((y) => y - 1);
    } else {
      setHolidayPickerMonth((m) => m - 1);
    }
  };

  const nextHolidayMonth = () => {
    if (holidayPickerMonth === 11) {
      setHolidayPickerMonth(0);
      setHolidayPickerYear((y) => y + 1);
    } else {
      setHolidayPickerMonth((m) => m + 1);
    }
  };

  const handleSelectHolidayDate = (date) => {
    const k = dateKey(date);
    if (holidayDateTarget === 'from') {
      setHolidayFrom(k);
      if (!holidayTo || k > holidayTo) {
        setHolidayTo(k);
      }
    } else {
      setHolidayTo(k);
      if (!holidayFrom || k < holidayFrom) {
        setHolidayFrom(k);
      }
    }
    setHolidayDatePickerVisible(false);
  };

  const holidayDaysCount = useMemo(() => {
    if (!holidayFrom || !holidayTo) return 1;
    const diff = Math.round(
      Math.abs(keyToDate(holidayTo).getTime() - keyToDate(holidayFrom).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    return diff;
  }, [holidayFrom, holidayTo]);

  const holidayCalendarDays = useMemo(() => {
    return createCalendarDays(holidayPickerYear, holidayPickerMonth);
  }, [holidayPickerYear, holidayPickerMonth]);

  const saveHoliday = () => {
    if (!holidayReason.trim()) {
      Alert.alert('Reason Required', 'Please enter or select a holiday reason.');
      return;
    }

    const fromDate = holidayFrom || selectedDate;
    const toDate = holidayTo || fromDate;
    const from = fromDate < toDate ? fromDate : toDate;
    const to = fromDate < toDate ? toDate : fromDate;

    const holidayObj = {
      from,
      to,
      reason: holidayReason.trim(),
    };

    saveActiveData({ ...activeData, holiday: holidayObj });
    setHolidayModalVisible(false);
  };

  const removeHoliday = () => {
    saveActiveData({ ...activeData, holiday: null });
    setHolidayModalVisible(false);
  };

  /*
  |--------------------------------------------------------------------------
  | EMERGENCY & EXTENDED HOURS
  |--------------------------------------------------------------------------
  */
  const openAddEmergency = () => {
    setEditingEmergencyId(null);
    setEmergencyForm({
      reason: '',
      start: '08:00',
      startPeriod: 'PM',
      end: '10:00',
      endPeriod: 'PM',
      enabled: true,
    });
    setEmergencySuggestionsVisible(false);
    setEmergencyModalVisible(true);
  };

  const openEditEmergency = (slot) => {
    setEditingEmergencyId(slot.id);
    setEmergencyForm({
      reason: slot.reason,
      start: slot.start,
      startPeriod: slot.startPeriod,
      end: slot.end,
      endPeriod: slot.endPeriod,
      enabled: slot.enabled,
    });
    setEmergencySuggestionsVisible(false);
    setEmergencyModalVisible(true);
  };

  const saveEmergency = () => {
    if (!emergencyForm.reason.trim()) {
      Alert.alert('Reason Required', 'Please enter a reason for extended hours.');
      return;
    }

    const emergencyHours = clone(activeData.emergencyHours);
    const newSlot = {
      id: editingEmergencyId || `emg_${Date.now()}`,
      reason: emergencyForm.reason.trim(),
      start: emergencyForm.start,
      startPeriod: emergencyForm.startPeriod,
      end: emergencyForm.end,
      endPeriod: emergencyForm.endPeriod,
      enabled: emergencyForm.enabled,
    };

    if (editingEmergencyId) {
      const idx = emergencyHours.findIndex((e) => e.id === editingEmergencyId);
      if (idx !== -1) emergencyHours[idx] = newSlot;
    } else {
      emergencyHours.push(newSlot);
    }

    saveActiveData({ ...activeData, emergencyHours });
    setEmergencyModalVisible(false);
  };

  const toggleEmergency = (id) => {
    const emergencyHours = clone(activeData.emergencyHours);
    const idx = emergencyHours.findIndex((e) => e.id === id);
    if (idx !== -1) {
      emergencyHours[idx].enabled = !emergencyHours[idx].enabled;
      saveActiveData({ ...activeData, emergencyHours });
    }
  };

  const deleteEmergency = (id) => {
    Alert.alert('Delete Slot', 'Remove this emergency / extended slot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const emergencyHours = activeData.emergencyHours.filter((e) => e.id !== id);
          saveActiveData({ ...activeData, emergencyHours });
        },
      },
    ]);
  };

  const handleGlobalSave = () => {
    Alert.alert(
      'Availability Saved',
      `Schedule updated successfully for ${activeConsultationType} consultations on ${formatDate(selectedDate)}.`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ALL-IN-ONE CALENDAR MODAL (MATCHING UPLOADED IMAGE)
  |--------------------------------------------------------------------------
  */
  const calendarDays = useMemo(() => {
    return createCalendarDays(calendarYear, calendarMonth);
  }, [calendarYear, calendarMonth]);

  const renderCalendarModal = () => (
    <Modal
      visible={calendarVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setCalendarVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.imageCalendarCard}>
          {/* HEADER */}
          <View style={styles.imageCalHeader}>
            <View>
              <Text style={styles.imageCalTitle}>Select Date</Text>
              <Text style={styles.imageCalSubtitle}>
                {calendarTab === 'today'
                  ? `Today's Schedule (${formatDate(todayKey)})`
                  : calendarTab === 'week' && rangeFrom && rangeTo
                  ? `Entire Week (${formatShortDate(rangeFrom)} - ${formatDate(rangeTo)})`
                  : calendarTab === 'month' && rangeFrom && rangeTo
                  ? `Entire Month (${MONTHS[calendarMonth]} ${calendarYear})`
                  : calendarTab === 'year' && rangeFrom && rangeTo
                  ? `Entire Year (${calendarYear})`
                  : rangeFrom && rangeTo && rangeFrom !== rangeTo
                  ? `Date Range: ${formatShortDate(rangeFrom)} - ${formatDate(rangeTo)}`
                  : rangeFrom
                  ? `Selected Date: ${formatDate(rangeFrom)}`
                  : 'Select date or date range'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setCalendarVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={TEXT} />
            </TouchableOpacity>
          </View>

          {/* TWO COLUMN BODY: LEFT SIDEBAR + RIGHT CALENDAR */}
          <View style={styles.imageCalBodyRow}>
            {/* LEFT SIDEBAR (1. TODAY, 2. DATE, 3. WEEK, 4. MONTH, 5. YEAR) */}
            <View style={styles.imageCalSidebar}>
              {/* 1. TODAY */}
              <TouchableOpacity
                style={[
                  styles.imageCalSideTab,
                  calendarTab === 'today' && styles.imageCalSideTabActive,
                ]}
                onPress={() => handleSidebarTabSelect('today')}
              >
                <Ionicons
                  name="today-outline"
                  size={20}
                  color={calendarTab === 'today' ? TEAL_DARK : MUTED}
                />
                <Text
                  style={[
                    styles.imageCalSideText,
                    calendarTab === 'today' && styles.imageCalSideTextActive,
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>

              {/* 2. DATE */}
              <TouchableOpacity
                style={[
                  styles.imageCalSideTab,
                  calendarTab === 'date' && styles.imageCalSideTabActive,
                ]}
                onPress={() => handleSidebarTabSelect('date')}
              >
                <Ionicons
                  name="grid-outline"
                  size={20}
                  color={calendarTab === 'date' ? TEAL_DARK : MUTED}
                />
                <Text
                  style={[
                    styles.imageCalSideText,
                    calendarTab === 'date' && styles.imageCalSideTextActive,
                  ]}
                >
                  Date
                </Text>
              </TouchableOpacity>

              {/* 3. WEEK */}
              <TouchableOpacity
                style={[
                  styles.imageCalSideTab,
                  calendarTab === 'week' && styles.imageCalSideTabActive,
                ]}
                onPress={() => handleSidebarTabSelect('week')}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={calendarTab === 'week' ? TEAL_DARK : MUTED}
                />
                <Text
                  style={[
                    styles.imageCalSideText,
                    calendarTab === 'week' && styles.imageCalSideTextActive,
                  ]}
                >
                  Week
                </Text>
              </TouchableOpacity>

              {/* 4. MONTH */}
              <TouchableOpacity
                style={[
                  styles.imageCalSideTab,
                  calendarTab === 'month' && styles.imageCalSideTabActive,
                ]}
                onPress={() => handleSidebarTabSelect('month')}
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color={calendarTab === 'month' ? TEAL_DARK : MUTED}
                />
                <Text
                  style={[
                    styles.imageCalSideText,
                    calendarTab === 'month' && styles.imageCalSideTextActive,
                  ]}
                >
                  Month
                </Text>
              </TouchableOpacity>

              {/* 5. YEAR */}
              <TouchableOpacity
                style={[
                  styles.imageCalSideTab,
                  calendarTab === 'year' && styles.imageCalSideTabActive,
                ]}
                onPress={() => handleSidebarTabSelect('year')}
              >
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={calendarTab === 'year' ? TEAL_DARK : MUTED}
                />
                <Text
                  style={[
                    styles.imageCalSideText,
                    calendarTab === 'year' && styles.imageCalSideTextActive,
                  ]}
                >
                  Year
                </Text>
              </TouchableOpacity>
            </View>

            {/* RIGHT CALENDAR VIEW */}
            <View style={styles.imageCalMainArea}>
              {calendarViewMode === 'month' ? (
                <View style={styles.pickerGridWrap}>
                  {MONTHS.map((m, idx) => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.pickerGridBox,
                        calendarMonth === idx && styles.pickerGridBoxActive,
                      ]}
                      onPress={() => handleSelectMonth(idx)}
                    >
                      <Text
                        style={[
                          styles.pickerGridBoxText,
                          calendarMonth === idx && styles.pickerGridBoxTextActive,
                        ]}
                      >
                        {m.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : calendarViewMode === 'year' ? (
                <View style={styles.pickerGridWrap}>
                  {YEARS.map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={[
                        styles.pickerGridBox,
                        calendarYear === y && styles.pickerGridBoxActive,
                      ]}
                      onPress={() => handleSelectYear(y)}
                    >
                      <Text
                        style={[
                          styles.pickerGridBoxText,
                          calendarYear === y && styles.pickerGridBoxTextActive,
                        ]}
                      >
                        {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View>
                  {/* MONTH TITLE WITH NAV ARROWS */}
                  <View style={styles.calNavHeaderRow}>
                    <TouchableOpacity style={styles.calArrowBtn} onPress={previousMonth}>
                      <Ionicons name="chevron-back" size={18} color={TEXT} />
                    </TouchableOpacity>

                    <Text style={styles.calNavTitle}>
                      {MONTHS[calendarMonth]} {calendarYear}
                    </Text>

                    <TouchableOpacity style={styles.calArrowBtn} onPress={nextMonth}>
                      <Ionicons name="chevron-forward" size={18} color={TEXT} />
                    </TouchableOpacity>
                  </View>

                  {/* INFO BANNER */}
                  <View style={styles.calInfoPill}>
                    <Ionicons name="information-circle-outline" size={17} color={TEAL_DARK} />
                    <Text style={styles.calInfoPillText}>
                      {calendarTab === 'today'
                        ? `Today's schedule selected (${formatDate(todayKey)})`
                        : calendarTab === 'week'
                        ? `Entire week selected (${formatShortDate(rangeFrom || selectedDate)} - ${formatDate(rangeTo || selectedDate)}). Tap any day to select its week`
                        : calendarTab === 'month' && calendarViewMode === 'date'
                        ? `Entire month (${MONTHS[calendarMonth]} ${calendarYear}) selected`
                        : calendarTab === 'year' && calendarViewMode === 'date'
                        ? `Entire year (${calendarYear}) selected`
                        : rangeFrom && !rangeTo
                        ? `Start date: ${formatShortDate(rangeFrom)}. Tap 2nd date to select date range`
                        : rangeFrom && rangeTo && rangeFrom !== rangeTo
                        ? `Date Range: ${formatShortDate(rangeFrom)} - ${formatDate(rangeTo)}`
                        : 'Select date or tap another date for range'}
                    </Text>
                  </View>

                  {/* WEEKDAY HEADERS */}
                  <View style={styles.calWeekRow}>
                    {WEEK_DAYS.map((w) => (
                      <Text key={w} style={styles.calWeekText}>{w}</Text>
                    ))}
                  </View>

                  {/* DAYS GRID */}
                  <View style={styles.calDaysGrid}>
                    {calendarDays.map((date, idx) => {
                      if (!date) {
                        return <View key={`empty-${idx}`} style={styles.calDayCell} />;
                      }

                      const k = dateKey(date);
                      const inRange = isBetween(k, rangeFrom, rangeTo);
                      const isFrom = k === rangeFrom;
                      const isTo = k === rangeTo;
                      const isSingle = (k === selectedDate || k === rangeFrom) && (!rangeTo || rangeFrom === rangeTo);
                      const isSelectedSolid = isSingle || isFrom || isTo;
                      const holiday = checkDateHoliday(k);

                      return (
                        <TouchableOpacity
                          key={k}
                          style={[
                            styles.calDayCell,
                            inRange && styles.calDayInRange,
                            isSelectedSolid && styles.calDaySolidSelected,
                            holiday && !isSelectedSolid && styles.calDayHoliday,
                          ]}
                          onPress={() => handleDaySelect(date)}
                        >
                          <Text
                            style={[
                              styles.calDayNum,
                              inRange && styles.calDayNumInRange,
                              isSelectedSolid && styles.calDayNumSolid,
                              holiday && !isSelectedSolid && styles.calDayNumHoliday,
                            ]}
                          >
                            {date.getDate()}
                          </Text>

                          {holiday && !isSelectedSolid && <View style={styles.calHolidayDot} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* LARGE DONE BUTTON AT BOTTOM (MATCHING IMAGE) */}
          <TouchableOpacity
            style={styles.imageCalDoneBtn}
            onPress={() => setCalendarVisible(false)}
          >
            <Text style={styles.imageCalDoneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  /*
  |--------------------------------------------------------------------------
  | TIME PICKER POPUP (SCROLLING HOURS, MINS, AM/PM)
  |--------------------------------------------------------------------------
  */
  const renderTimePickerCard = () => (
    <View style={styles.timePickerCard}>
      <View style={styles.timePickerHeader}>
        <Text style={styles.timePickerTitle}>{timePickerTitle}</Text>
        <TouchableOpacity onPress={() => setTimePickerVisible(false)}>
          <Ionicons name="close" size={22} color={TEXT} />
        </TouchableOpacity>
      </View>

      {/* PREVIEW BANNER */}
      <View style={styles.timePickerPreview}>
        <Text style={styles.timePickerPreviewText}>
          {pickerHour} : {pickerMinute}  {pickerPeriod}
        </Text>
      </View>

      {/* SCROLLING COLUMNS */}
      <View style={styles.pickerColumnsRow}>
        {/* HOURS */}
        <View style={styles.pickerCol}>
          <Text style={styles.pickerColLabel}>HOURS</Text>
          <ScrollView style={styles.pickerScrollView} showsVerticalScrollIndicator={false}>
            {HOURS_LIST.map((h) => (
              <TouchableOpacity
                key={h}
                style={[styles.pickerItem, pickerHour === h && styles.pickerItemActive]}
                onPress={() => setPickerHour(h)}
              >
                <Text style={[styles.pickerItemText, pickerHour === h && styles.pickerItemTextActive]}>
                  {h}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* MINUTES */}
        <View style={styles.pickerCol}>
          <Text style={styles.pickerColLabel}>MINUTES</Text>
          <ScrollView style={styles.pickerScrollView} showsVerticalScrollIndicator={false}>
            {MINUTES_LIST.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.pickerItem, pickerMinute === m && styles.pickerItemActive]}
                onPress={() => setPickerMinute(m)}
              >
                <Text style={[styles.pickerItemText, pickerMinute === m && styles.pickerItemTextActive]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AM / PM SELECTOR */}
        <View style={[styles.pickerCol, { flex: 0.9 }]}>
          <Text style={styles.pickerColLabel}>PERIOD</Text>
          <View style={{ gap: 10, marginTop: 12 }}>
            {['AM', 'PM'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.pickerPeriodBtn, pickerPeriod === p && styles.pickerPeriodBtnActive]}
                onPress={() => setPickerPeriod(p)}
              >
                <Text style={[styles.pickerPeriodText, pickerPeriod === p && styles.pickerPeriodTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.timePickerConfirmBtn} onPress={handleConfirmTimePicker}>
        <Text style={styles.timePickerConfirmText}>Set Time</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTimePickerOverlay = () => {
    if (!timePickerVisible) return null;
    return (
      <View style={styles.timePickerOverlay}>
        {renderTimePickerCard()}
      </View>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ADD / EDIT TIMING MODAL
  |--------------------------------------------------------------------------
  */
  const renderTimingModal = () => (
    <Modal
      visible={timingModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (timePickerVisible) {
          setTimePickerVisible(false);
        } else {
          setTimingModalVisible(false);
        }
      }}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingShiftId ? 'Edit Timing' : 'Add Timings'}
            </Text>
            <TouchableOpacity onPress={() => setTimingModalVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color={TEXT} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* START TIME & END TIME (CLICK TO OPEN SCROLLING PICKER) */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() =>
                    openTimePicker(
                      'Select Start Time',
                      `${timingForm.start} ${timingForm.startPeriod}`,
                      (res) =>
                        setTimingForm((prev) => ({
                          ...prev,
                          start: res.time,
                          startPeriod: res.period,
                        }))
                    )
                  }
                >
                  <Ionicons name="time-outline" size={18} color={TEAL} />
                  <Text style={styles.timePickerButtonText}>
                    {timingForm.start} {timingForm.startPeriod}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() =>
                    openTimePicker(
                      'Select End Time',
                      `${timingForm.end} ${timingForm.endPeriod}`,
                      (res) =>
                        setTimingForm((prev) => ({
                          ...prev,
                          end: res.time,
                          endPeriod: res.period,
                        }))
                    )
                  }
                >
                  <Ionicons name="time-outline" size={18} color={TEAL} />
                  <Text style={styles.timePickerButtonText}>
                    {timingForm.end} {timingForm.endPeriod}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* CONSULTATION DURATION: MANUAL ENTRY + QUICK OPTIONS (5, 10, 15, 30 min) */}
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>
              Consultation Duration (minutes per patient)
            </Text>
            <View style={styles.durationManualRow}>
              <TextInput
                style={styles.durationInput}
                value={String(timingForm.duration)}
                onChangeText={(val) =>
                  setTimingForm((prev) => ({
                    ...prev,
                    duration: val.replace(/[^0-9]/g, ''),
                  }))
                }
                placeholder="e.g. 15"
                keyboardType="numeric"
              />
              <Text style={styles.durationUnitText}>mins / patient</Text>
            </View>

            {/* Quick Select Options: 5min, 10min, 15min, 30min */}
            <View style={styles.quickDurationRow}>
              {DURATION_QUICK_OPTIONS.map((dur) => (
                <TouchableOpacity
                  key={dur}
                  style={[
                    styles.quickDurationBtn,
                    timingForm.duration === dur && styles.quickDurationBtnActive,
                  ]}
                  onPress={() => setTimingForm((prev) => ({ ...prev, duration: dur }))}
                >
                  <Text
                    style={[
                      styles.quickDurationText,
                      timingForm.duration === dur && styles.quickDurationTextActive,
                    ]}
                  >
                    {dur} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Active Switch */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Active Working Slot</Text>
              <Switch
                value={timingForm.enabled}
                onValueChange={(val) => setTimingForm((prev) => ({ ...prev, enabled: val }))}
                trackColor={{ false: '#CBD5E1', true: '#8ADDD3' }}
                thumbColor={timingForm.enabled ? TEAL : '#F8FAFC'}
              />
            </View>
          </ScrollView>

          {/* FOOTER BUTTONS INSIDE CARD BOX */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setTimingModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveTiming}>
              <Text style={styles.saveButtonText}>Save Timing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* TIME PICKER POPUP (ALWAYS IN FRONT) */}
      {renderTimePickerOverlay()}
    </Modal>
  );

  /*
  |--------------------------------------------------------------------------
  | BREAK MODAL (WITH AUTO-SUGGEST REASON & SCROLLING TIME PICKERS)
  |--------------------------------------------------------------------------
  */
  const filteredBreakSuggestions = useMemo(() => {
    const q = breakForm.reason.trim().toLowerCase();
    if (!q) return BREAK_REASON_SUGGESTIONS;
    return BREAK_REASON_SUGGESTIONS.filter((r) => r.toLowerCase().includes(q));
  }, [breakForm.reason]);

  const renderBreakModal = () => (
    <Modal
      visible={breakModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (timePickerVisible) {
          setTimePickerVisible(false);
        } else {
          setBreakModalVisible(false);
        }
      }}
    >
      <KeyboardAvoidingView
        style={[
          styles.modalOverlay,
          isKeyboardOpen && {
            justifyContent: 'flex-start',
            paddingTop: Platform.OS === 'ios' ? 50 : 24,
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingBreakIndex !== null ? 'Edit Break' : 'Add Break'}
            </Text>
            <TouchableOpacity onPress={() => setBreakModalVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color={TEXT} />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={breakScrollRef}
            style={styles.modalBody}
            contentContainerStyle={[
              styles.modalBodyContent,
              isKeyboardOpen && { paddingBottom: keyboardHeight > 0 ? keyboardHeight : 260 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* REASON WITH AUTOCOMPLETE DROPDOWN */}
            <Text style={styles.inputLabel}>Reason for Break</Text>
            <View style={{ position: 'relative', zIndex: 30 }}>
              <View style={styles.inputWithDropdownTrigger}>
                <TextInput
                  style={styles.fullInputFlex}
                  value={breakForm.reason}
                  onFocus={() => {
                    setBreakSuggestionsVisible(true);
                    setTimeout(() => {
                      breakScrollRef.current?.scrollTo({ y: 0, animated: true });
                    }, 100);
                  }}
                  onChangeText={(val) => {
                    setBreakForm((prev) => ({ ...prev, reason: val }));
                    setBreakSuggestionsVisible(true);
                  }}
                  placeholder="e.g. Lunch Break, Coffee Break, Rounds"
                  placeholderTextColor={MUTED}
                />
                <TouchableOpacity
                  style={styles.dropdownChevronBtn}
                  onPress={() => {
                    const nextVal = !breakSuggestionsVisible;
                    setBreakSuggestionsVisible(nextVal);
                    if (nextVal) {
                      Keyboard.dismiss();
                    }
                  }}
                >
                  <Ionicons
                    name={breakSuggestionsVisible ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={TEAL}
                  />
                </TouchableOpacity>
              </View>

              {breakSuggestionsVisible && filteredBreakSuggestions.length > 0 && (
                <View style={styles.suggestionsBox}>
                  <Text style={styles.suggestionHeader}>Suggested Break Reasons (Tap to select):</Text>
                  <ScrollView
                    style={{ maxHeight: 180 }}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {filteredBreakSuggestions.map((r) => (
                      <TouchableOpacity
                        key={r}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setBreakForm((prev) => ({ ...prev, reason: r }));
                          setBreakSuggestionsVisible(false);
                          Keyboard.dismiss();
                        }}
                      >
                        <Ionicons name="cafe-outline" size={15} color={TEAL_DARK} />
                        <Text style={styles.suggestionItemText}>{r}</Text>
                        <Ionicons name="add-circle" size={16} color={TEAL} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* START & END TIME WITH POPUP */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() =>
                    openTimePicker(
                      'Select Break Start',
                      `${breakForm.start} ${breakForm.startPeriod}`,
                      (res) =>
                        setBreakForm((prev) => ({
                          ...prev,
                          start: res.time,
                          startPeriod: res.period,
                        }))
                    )
                  }
                >
                  <Ionicons name="time-outline" size={18} color={TEAL} />
                  <Text style={styles.timePickerButtonText}>
                    {breakForm.start} {breakForm.startPeriod}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() =>
                    openTimePicker(
                      'Select Break End',
                      `${breakForm.end} ${breakForm.endPeriod}`,
                      (res) =>
                        setBreakForm((prev) => ({
                          ...prev,
                          end: res.time,
                          endPeriod: res.period,
                        }))
                    )
                  }
                >
                  <Ionicons name="time-outline" size={18} color={TEAL} />
                  <Text style={styles.timePickerButtonText}>
                    {breakForm.end} {breakForm.endPeriod}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* FOOTER BUTTONS INSIDE CARD BOX */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setBreakModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveBreak}>
              <Text style={styles.saveButtonText}>Save Break</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* TIME PICKER POPUP (ALWAYS IN FRONT) */}
      {renderTimePickerOverlay()}
    </Modal>
  );

  /*
  |--------------------------------------------------------------------------
  | HOLIDAY MODAL (SINGLE DATE & DATE RANGE + REASON)
  |--------------------------------------------------------------------------
  */
  const filteredHolidaySuggestions = useMemo(() => {
    const q = holidayReason.trim().toLowerCase();
    if (!q) return HOLIDAY_REASON_SUGGESTIONS;
    return HOLIDAY_REASON_SUGGESTIONS.filter((h) => h.toLowerCase().includes(q));
  }, [holidayReason]);


  /*
  |--------------------------------------------------------------------------
  | HOLIDAY DATE PICKER POP-UP CALENDAR
  |--------------------------------------------------------------------------
  */
  const renderHolidayDatePickerOverlay = () => {
    if (!holidayDatePickerVisible) return null;

    const currentTargetDate = holidayDateTarget === 'from' ? holidayFrom : holidayTo;

    return (
      <View style={styles.holidayPickerOverlay}>
        <View style={styles.holidayPickerCard}>
          {/* HEADER */}
          <View style={styles.holidayPickerHeader}>
            <View>
              <Text style={styles.holidayPickerTitle}>
                Select {holidayDateTarget === 'from' ? 'From' : 'To'} Date
              </Text>
              <Text style={styles.holidayPickerSubtitle}>
                {holidayDateTarget === 'from' ? 'Starting date of holiday' : 'Ending date of holiday'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setHolidayDatePickerVisible(false)}
              style={styles.holidayPickerCloseBtn}
            >
              <Ionicons name="close" size={20} color={TEXT} />
            </TouchableOpacity>
          </View>

          {/* MONTH / YEAR NAVIGATION */}
          <View style={styles.holidayPickerNavRow}>
            <TouchableOpacity style={styles.holidayPickerNavBtn} onPress={prevHolidayMonth}>
              <Ionicons name="chevron-back" size={18} color={TEAL_DARK} />
            </TouchableOpacity>

            <Text style={styles.holidayPickerNavTitle}>
              {MONTHS[holidayPickerMonth]} {holidayPickerYear}
            </Text>

            <TouchableOpacity style={styles.holidayPickerNavBtn} onPress={nextHolidayMonth}>
              <Ionicons name="chevron-forward" size={18} color={TEAL_DARK} />
            </TouchableOpacity>
          </View>

          {/* WEEK DAYS */}
          <View style={styles.holidayPickerWeekRow}>
            {WEEK_DAYS.map((w) => (
              <Text key={w} style={styles.holidayPickerWeekText}>
                {w.slice(0, 2)}
              </Text>
            ))}
          </View>

          {/* DAYS GRID */}
          <View style={styles.holidayPickerDaysGrid}>
            {holidayCalendarDays.map((date, idx) => {
              if (!date) {
                return <View key={`h_empty_${idx}`} style={styles.holidayPickerDayCell} />;
              }

              const k = dateKey(date);
              const isTargetSelected = k === currentTargetDate;
              const inRange = isBetween(k, holidayFrom, holidayTo);

              return (
                <TouchableOpacity
                  key={k}
                  style={[
                    styles.holidayPickerDayCell,
                    inRange && styles.holidayPickerDayInRange,
                    isTargetSelected && styles.holidayPickerDaySelected,
                  ]}
                  onPress={() => handleSelectHolidayDate(date)}
                >
                  <Text
                    style={[
                      styles.holidayPickerDayText,
                      inRange && styles.holidayPickerDayTextInRange,
                      isTargetSelected && styles.holidayPickerDayTextSelected,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* QUICK BUTTONS */}
          <View style={styles.holidayPickerBottomRow}>
            <TouchableOpacity
              style={styles.holidayPickerTodayBtn}
              onPress={() => {
                const now = new Date();
                setHolidayPickerMonth(now.getMonth());
                setHolidayPickerYear(now.getFullYear());
                handleSelectHolidayDate(now);
              }}
            >
              <Text style={styles.holidayPickerTodayBtnText}>Select Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.holidayPickerDoneBtn}
              onPress={() => setHolidayDatePickerVisible(false)}
            >
              <Text style={styles.holidayPickerDoneBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHolidayModal = () => (
    <Modal
      visible={holidayModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (holidayDatePickerVisible) {
          setHolidayDatePickerVisible(false);
        } else if (timePickerVisible) {
          setTimePickerVisible(false);
        } else {
          setHolidayModalVisible(false);
        }
      }}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Holiday</Text>
            <TouchableOpacity onPress={() => setHolidayModalVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color={TEXT} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* 1. REASON FOR HOLIDAY WITH AUTO-SUGGESTIONS (FIRST) */}
            <Text style={styles.inputLabel}>Reason for Holiday</Text>
            <View style={{ position: 'relative', zIndex: 30 }}>
              <View style={styles.inputWithDropdownTrigger}>
                <TextInput
                  style={styles.fullInputFlex}
                  value={holidayReason}
                  onFocus={() => setHolidaySuggestionsVisible(true)}
                  onChangeText={(val) => {
                    setHolidayReason(val);
                    setHolidaySuggestionsVisible(true);
                  }}
                  placeholder="e.g. Clinic Closed, Annual Leave, Conference"
                  placeholderTextColor={MUTED}
                />
                <TouchableOpacity
                  style={styles.dropdownChevronBtn}
                  onPress={() => setHolidaySuggestionsVisible(!holidaySuggestionsVisible)}
                >
                  <Ionicons
                    name={holidaySuggestionsVisible ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={TEAL}
                  />
                </TouchableOpacity>
              </View>

              {holidaySuggestionsVisible && filteredHolidaySuggestions.length > 0 && (
                <View style={styles.suggestionsBox}>
                  <Text style={styles.suggestionHeader}>Suggested Holiday Reasons (Tap to select):</Text>
                  <ScrollView
                    style={{ maxHeight: 180 }}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {filteredHolidaySuggestions.map((hr) => (
                      <TouchableOpacity
                        key={hr}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setHolidayReason(hr);
                          setHolidaySuggestionsVisible(false);
                        }}
                      >
                        <Ionicons name="calendar-outline" size={15} color={TEAL_DARK} />
                        <Text style={styles.suggestionItemText}>{hr}</Text>
                        <Ionicons name="add-circle" size={16} color={TEAL} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* 2. FROM - TO DATES (BELOW REASON FIELD) */}
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>Holiday Dates</Text>
            <View style={styles.holidayRangeInputsRow}>
              {/* FROM DATE BUTTON */}
              <TouchableOpacity
                style={styles.holidayDatePickBox}
                onPress={() => openHolidayDatePicker('from')}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.holidayHighlightLabel}>From Date</Text>
                  <Ionicons name="calendar-outline" size={15} color={TEAL_DARK} />
                </View>
                <Text style={styles.holidayHighlightValue}>{formatDate(holidayFrom)}</Text>
                <Text style={styles.holidayPickHint}>Tap to choose date</Text>
              </TouchableOpacity>

              <Ionicons name="arrow-forward" size={18} color={TEAL} style={{ marginTop: 8 }} />

              {/* TO DATE BUTTON */}
              <TouchableOpacity
                style={styles.holidayDatePickBox}
                onPress={() => openHolidayDatePicker('to')}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.holidayHighlightLabel}>To Date</Text>
                  <Ionicons name="calendar-outline" size={15} color={TEAL_DARK} />
                </View>
                <Text style={styles.holidayHighlightValue}>{formatDate(holidayTo)}</Text>
                <Text style={styles.holidayPickHint}>Tap to choose date</Text>
              </TouchableOpacity>
            </View>

            {/* DURATION BADGE */}
            <View style={styles.holidayDurationRow}>
              <View style={styles.holidayDurationBadge}>
                <Ionicons name="calendar" size={13} color={TEAL_DARK} />
                <Text style={styles.holidayDurationBadgeText}>
                  {holidayDaysCount === 1 ? '1 Day Holiday' : `${holidayDaysCount} Days Holiday`}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* FOOTER BUTTONS INSIDE CARD BOX WITH BALANCED ALIGNMENT */}
          <View style={styles.modalFooter}>
            {activeData.holiday && (
              <TouchableOpacity style={styles.deleteBtn} onPress={removeHoliday}>
                <Ionicons name="trash-outline" size={16} color={RED} />
                <Text style={styles.deleteBtnText}>Remove</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setHolidayModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveHoliday}>
              <Text style={styles.saveButtonText}>Save Holiday</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* TIME PICKER POPUP (ALWAYS IN FRONT) */}
      {renderTimePickerOverlay()}

      {/* HOLIDAY DATE PICKER OVERLAY POPUP (ALWAYS IN FRONT) */}
      {renderHolidayDatePickerOverlay()}
    </Modal>
  );

  /*
  |--------------------------------------------------------------------------
  | EMERGENCY & EXTENDED HOURS MODAL
  |--------------------------------------------------------------------------
  */
  const filteredEmergencySuggestions = useMemo(() => {
    const q = emergencyForm.reason.trim().toLowerCase();
    if (!q) return EMERGENCY_REASON_SUGGESTIONS;
    return EMERGENCY_REASON_SUGGESTIONS.filter((e) => e.toLowerCase().includes(q));
  }, [emergencyForm.reason]);

  const renderEmergencyModal = () => (
    <Modal
      visible={emergencyModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (timePickerVisible) {
          setTimePickerVisible(false);
        } else {
          setEmergencyModalVisible(false);
        }
      }}
    >
      <KeyboardAvoidingView
        style={[
          styles.modalOverlay,
          isKeyboardOpen && {
            justifyContent: 'flex-start',
            paddingTop: Platform.OS === 'ios' ? 50 : 24,
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingEmergencyId ? 'Edit Extended Slot' : 'Add Emergency / Extended Hours'}
            </Text>
            <TouchableOpacity
              onPress={() => setEmergencyModalVisible(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={24} color={TEXT} />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={emergencyScrollRef}
            style={styles.modalBody}
            contentContainerStyle={[
              styles.modalBodyContent,
              isKeyboardOpen && { paddingBottom: keyboardHeight > 0 ? keyboardHeight : 260 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* REASON / EXTENDED HOURS TYPE WITH DROPDOWN */}
            <Text style={styles.inputLabel}>Extended Hours / Urgent Overtime Type</Text>
            <View style={{ position: 'relative', zIndex: 30 }}>
              <View style={styles.inputWithDropdownTrigger}>
                <TextInput
                  style={styles.fullInputFlex}
                  value={emergencyForm.reason}
                  onFocus={() => {
                    setEmergencySuggestionsVisible(true);
                    setTimeout(() => {
                      emergencyScrollRef.current?.scrollTo({ y: 0, animated: true });
                    }, 100);
                  }}
                  onChangeText={(val) => {
                    setEmergencyForm((prev) => ({ ...prev, reason: val }));
                    setEmergencySuggestionsVisible(true);
                  }}
                  placeholder="e.g. Extended Hours, Urgent Case Overtime"
                  placeholderTextColor={MUTED}
                />
                <TouchableOpacity
                  style={styles.dropdownChevronBtn}
                  onPress={() => {
                    const nextVal = !emergencySuggestionsVisible;
                    setEmergencySuggestionsVisible(nextVal);
                    if (nextVal) {
                      Keyboard.dismiss();
                    }
                  }}
                >
                  <Ionicons
                    name={emergencySuggestionsVisible ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={TEAL}
                  />
                </TouchableOpacity>
              </View>

              {emergencySuggestionsVisible && filteredEmergencySuggestions.length > 0 && (
                <View style={styles.suggestionsBox}>
                  <Text style={styles.suggestionHeader}>
                    Suggested Extended / Emergency Hours (Tap to select):
                  </Text>
                  <ScrollView
                    style={{ maxHeight: 180 }}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {filteredEmergencySuggestions.map((er) => (
                      <TouchableOpacity
                        key={er}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setEmergencyForm((prev) => ({ ...prev, reason: er }));
                          setEmergencySuggestionsVisible(false);
                          Keyboard.dismiss();
                        }}
                      >
                        <Ionicons name="flash-outline" size={15} color={TEAL_DARK} />
                        <Text style={styles.suggestionItemText}>{er}</Text>
                        <Ionicons name="add-circle" size={16} color={TEAL} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* START & END TIME WITH SCROLLING POPUP */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() =>
                    openTimePicker(
                      'Select Extended Start',
                      `${emergencyForm.start} ${emergencyForm.startPeriod}`,
                      (res) =>
                        setEmergencyForm((prev) => ({
                          ...prev,
                          start: res.time,
                          startPeriod: res.period,
                        }))
                    )
                  }
                >
                  <Ionicons name="time-outline" size={18} color={TEAL} />
                  <Text style={styles.timePickerButtonText}>
                    {emergencyForm.start} {emergencyForm.startPeriod}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() =>
                    openTimePicker(
                      'Select Extended End',
                      `${emergencyForm.end} ${emergencyForm.endPeriod}`,
                      (res) =>
                        setEmergencyForm((prev) => ({
                          ...prev,
                          end: res.time,
                          endPeriod: res.period,
                        }))
                    )
                  }
                >
                  <Ionicons name="time-outline" size={18} color={TEAL} />
                  <Text style={styles.timePickerButtonText}>
                    {emergencyForm.end} {emergencyForm.endPeriod}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ACTIVE SWITCH */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Active Extended Slot</Text>
              <Switch
                value={emergencyForm.enabled}
                onValueChange={(val) => setEmergencyForm((prev) => ({ ...prev, enabled: val }))}
                trackColor={{ false: '#CBD5E1', true: '#8ADDD3' }}
                thumbColor={emergencyForm.enabled ? TEAL : '#F8FAFC'}
              />
            </View>
          </ScrollView>

          {/* FOOTER BUTTONS INSIDE CARD BOX */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEmergencyModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveEmergency}>
              <Text style={styles.saveButtonText}>Save Slot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* TIME PICKER POPUP (ALWAYS IN FRONT) */}
      {renderTimePickerOverlay()}
    </Modal>
  );

  /*
  |==========================================================================
  | MAIN UI RENDERING
  |==========================================================================
  */
  const isSelectedDateHoliday = !!activeData.holiday;

  return (
    <View style={styles.screen}>
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

        {/* NAVIGATION ROW AS SHOWN IN IMAGE: (←) Availability (📅) */}
        <View style={styles.navHeaderRow}>
          <TouchableOpacity
            style={styles.headerNavCircleBtn}
            onPress={() => {
              if (navigation && navigation.canGoBack && navigation.canGoBack()) {
                navigation.goBack();
              } else if (navigation && navigation.navigate) {
                navigation.navigate('Home');
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.screenMainTitle}>Availability</Text>

          {/* Right spacer to balance header */}
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================
            IN-PERSON VS VIDEO CONSULTATION SWITCH
        ========================================================= */}
        <View style={styles.consultationTypeSection}>
          <Text style={styles.sectionOverline}>Consultation Channel</Text>
          <View style={styles.consultationTypeContainer}>
            {CONSULTATION_TYPES.map((t) => {
              const isActive = activeConsultationType === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.consultationTypeBtn,
                    isActive && styles.consultationTypeBtnActive,
                  ]}
                  onPress={() => setActiveConsultationType(t.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={t.icon}
                    size={18}
                    color={isActive ? '#FFFFFF' : TEAL}
                  />
                  <Text
                    style={[
                      styles.consultationTypeText,
                      isActive && styles.consultationTypeTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* =========================================================
            1. ALL-IN-ONE DATE CARD (NO SEPARATE SINGLE/RANGE BUTTONS)
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
                <Ionicons name="calendar" size={13} color={TEAL_DARK} />
                <Text style={styles.holidayHeaderPillText}>Holiday</Text>
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
                  isSelectedDateHoliday && { backgroundColor: TEAL_LIGHT },
                ]}
              >
                <Ionicons
                  name="calendar"
                  size={22}
                  color={TEAL_DARK}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.dateSelectLabel}>
                  {selectedScope === 'today'
                    ? "Today's Schedule"
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
                    isSelectedDateHoliday && { color: TEAL_DARK },
                  ]}
                >
                  {rangeFrom && rangeTo && rangeFrom !== rangeTo
                    ? `${formatShortDate(rangeFrom)} - ${formatDate(rangeTo)}`
                    : formatDate(selectedDate || rangeFrom || todayKey)}
                </Text>
              </View>
            </View>

            <View style={styles.calendarOpenBadge}>
              <Ionicons name="calendar-outline" size={15} color={TEAL_DARK} />
              <Text style={styles.calendarOpenBadgeText}>Calendar</Text>
            </View>
          </TouchableOpacity>

          {/* HOLIDAY ALERT BANNER */}
          {isSelectedDateHoliday && (
            <View style={styles.holidayAlertBanner}>
              <Ionicons name="sunny-outline" size={20} color={TEAL_DARK} />
              <View style={{ flex: 1 }}>
                <Text style={styles.holidayAlertTitle}>
                  Marked as Holiday ({activeConsultationType})
                </Text>
                <Text style={styles.holidayAlertText}>
                  {activeData.holiday?.reason || 'Clinic Closed'}
                </Text>
              </View>
            </View>
          )}
        </Card>

        {/* =========================================================
            2. WORKING HOURS (UNIFIED, NO DAY/NIGHT TABS, DURATION 5/10/15/30)
        ========================================================= */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Working Hours</Text>
              <Text style={styles.cardSubtitle}>
                {activeConsultationType} Appointment Timings
              </Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={openAddTiming}>
              <Ionicons name="add" size={17} color={TEAL} />
              <Text style={styles.addButtonText}>Add Timings</Text>
            </TouchableOpacity>
          </View>

          {/* UNIFIED SHIFTS LIST */}
          {activeData.workingHours.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="time-outline" size={28} color={MUTED} />
              <Text style={styles.emptyTitle}>No working hours configured</Text>
              <Text style={styles.emptyText}>
                Tap "Add Timings" to set up your consultation hours.
              </Text>
            </View>
          ) : (
            activeData.workingHours.map((shift) => (
              <View key={shift.id} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.itemIconWrap,
                      { backgroundColor: shift.enabled ? TEAL_LIGHT : '#F1F5F9' },
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={shift.enabled ? TEAL : MUTED}
                    />
                  </View>

                  <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5 }}>
                      <Text
                        style={[styles.itemName, !shift.enabled && { color: '#94A3B8' }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {shift.start} {shift.startPeriod} - {shift.end} {shift.endPeriod}
                      </Text>
                      {shift.duration ? (
                        <View style={styles.durationPill}>
                          <Ionicons name="stopwatch-outline" size={10} color={TEAL_DARK} />
                          <Text style={styles.durationPillText}>{shift.duration} min/pt</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text
                      style={[styles.itemSubtitle, !shift.enabled && { color: '#94A3B8' }]}
                      numberOfLines={1}
                    >
                      {shift.enabled ? 'Available for booking' : 'Slot paused'}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openEditTiming(shift)}
                  >
                    <Ionicons name="create-outline" size={13} color={TEAL_DARK} />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>

                  <Switch
                    value={shift.enabled}
                    onValueChange={() => toggleTiming(shift.id)}
                    trackColor={{ false: '#CBD5E1', true: '#8ADDD3' }}
                    thumbColor={shift.enabled ? TEAL : '#F8FAFC'}
                    style={{ transform: [{ scaleX: 0.78 }, { scaleY: 0.78 }] }}
                  />

                  <TouchableOpacity
                    onPress={() => deleteTiming(shift.id)}
                    style={{ padding: 2 }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={16} color={RED} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* =========================================================
            3. BREAKS SECTION (REASON AUTOCOMPLETE + SCROLLING TIME PICKER)
        ========================================================= */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Breaks</Text>
              <Text style={styles.cardSubtitle}>
                Pause patient bookings during lunch or rest periods
              </Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={openAddBreak}>
              <Ionicons name="add" size={17} color={TEAL} />
              <Text style={styles.addButtonText}>Add Break</Text>
            </TouchableOpacity>
          </View>

          {activeData.breaks.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="cafe-outline" size={28} color={MUTED} />
              <Text style={styles.emptyTitle}>No breaks scheduled</Text>
              <Text style={styles.emptyText}>
                Add lunch or rest periods to prevent appointment overlaps.
              </Text>
            </View>
          ) : (
            activeData.breaks.map((b, idx) => (
              <View key={`${b.start}-${idx}`} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View style={[styles.itemIconWrap, { backgroundColor: TEAL_LIGHT }]}>
                    <Ionicons name="cafe-outline" size={16} color={TEAL_DARK} />
                  </View>

                  <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
                    <Text style={styles.itemName} numberOfLines={1}>{b.reason || 'Break'}</Text>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {b.start} {b.startPeriod} - {b.end} {b.endPeriod}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openEditBreak(idx)}
                  >
                    <Ionicons name="create-outline" size={13} color={TEAL_DARK} />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => deleteBreak(idx)}
                    style={{ padding: 2, marginLeft: 2 }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={16} color={RED} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* =========================================================
            4. HOLIDAY SECTION (HIGHLIGHT DATE / RANGE WITH REASON)
        ========================================================= */}
        <Card style={[styles.card, isSelectedDateHoliday && styles.cardHoliday]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Holiday / Off Duty</Text>
              <Text style={styles.cardSubtitle}>
                Set single date or date-range clinic holidays
              </Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={openHolidayModal}>
              <Text style={styles.addButtonText}>
                {activeData.holiday ? 'Edit' : 'Set Holiday'}
              </Text>
            </TouchableOpacity>
          </View>

          {activeData.holiday ? (
            <View style={styles.holidayActiveCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <View style={styles.holidayIconLarge}>
                  <Ionicons name="calendar" size={22} color={TEAL_DARK} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.holidayHighlightPill}>
                    <Text style={styles.holidayHighlightPillText}>
                      {activeData.holiday.from !== activeData.holiday.to
                        ? `${formatShortDate(activeData.holiday.from)} - ${formatDate(activeData.holiday.to)}`
                        : formatFullDay(activeData.holiday.from || selectedDate)}
                    </Text>
                  </View>

                  <Text style={styles.holidayActiveTitle}>Holiday Marked</Text>
                  <Text style={styles.holidayActiveReason}>
                    {activeData.holiday.reason}
                  </Text>
                </View>
              </View>

              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={openHolidayModal}
                >
                  <Ionicons name="create-outline" size={13} color={TEAL_DARK} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={removeHoliday}
                  style={{ padding: 2, marginLeft: 2 }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={16} color={RED} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="sunny-outline" size={28} color={MUTED} />
              <Text style={styles.emptyTitle}>Open for Consultations</Text>
              <Text style={styles.emptyText}>
                This schedule is active. Tap "Set Holiday" to mark days off.
              </Text>
            </View>
          )}
        </Card>

        {/* =========================================================
            5. NEW SECTION: EMERGENCY & EXTENDED HOURS
        ========================================================= */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.cardTitle}>Emergency & Extended Hours</Text>
              <Text style={styles.cardSubtitle}>
                Add overtime availability or urgent on-call consultation slots
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={openAddEmergency}
            >
              <Ionicons name="add" size={17} color={TEAL} />
              <Text style={styles.addButtonText}>Add Slot</Text>
            </TouchableOpacity>
          </View>

          {activeData.emergencyHours.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="flash-outline" size={28} color={MUTED} />
              <Text style={styles.emptyTitle}>No extended hours set</Text>
              <Text style={styles.emptyText}>
                Need to extend your clinic or accept emergency cases? Add an extra slot here.
              </Text>
            </View>
          ) : (
            activeData.emergencyHours.map((emg) => (
              <View key={emg.id} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.itemIconWrap,
                      { backgroundColor: emg.enabled ? TEAL_LIGHT : '#F1F5F9' },
                    ]}
                  >
                    <Ionicons
                      name="flash"
                      size={16}
                      color={emg.enabled ? TEAL : MUTED}
                    />
                  </View>

                  <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5 }}>
                      <Text style={styles.itemName} numberOfLines={1}>{emg.reason}</Text>
                      <View style={[styles.durationPill, { backgroundColor: TEAL_LIGHT }]}>
                        <Text style={[styles.durationPillText, { color: TEAL_DARK }]}>Emergency</Text>
                      </View>
                    </View>

                    <Text style={[styles.itemSubtitle, !emg.enabled && { color: '#94A3B8' }]} numberOfLines={1}>
                      {emg.start} {emg.startPeriod} - {emg.end} {emg.endPeriod}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openEditEmergency(emg)}
                  >
                    <Ionicons name="create-outline" size={13} color={TEAL_DARK} />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>

                  <Switch
                    value={emg.enabled}
                    onValueChange={() => toggleEmergency(emg.id)}
                    trackColor={{ false: '#CBD5E1', true: '#8ADDD3' }}
                    thumbColor={emg.enabled ? TEAL : '#F8FAFC'}
                    style={{ transform: [{ scaleX: 0.78 }, { scaleY: 0.78 }] }}
                  />

                  <TouchableOpacity
                    onPress={() => deleteEmergency(emg.id)}
                    style={{ padding: 2 }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={16} color={RED} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* =========================================================
            GLOBAL SAVE BUTTON
        ========================================================= */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <AppButton
            title={`Save ${activeConsultationType} Availability`}
            variant="primary"
            onPress={handleGlobalSave}
          />
        </View>
      </ScrollView>

      {/* ALL MODALS */}
      {renderCalendarModal()}
      {renderTimingModal()}
      {renderBreakModal()}
      {renderHolidayModal()}
      {renderEmergencyModal()}

      {/* ROOT FALLBACK IF TIME PICKER TRIGGERED OUTSIDE SUB-MODALS */}
      {!timingModalVisible &&
        !breakModalVisible &&
        !emergencyModalVisible &&
        !holidayModalVisible && (
          <Modal
            visible={timePickerVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setTimePickerVisible(false)}
          >
            {renderTimePickerOverlay()}
          </Modal>
        )}
    </View>
  );
}

/*
|==========================================================================
| STYLES
|==========================================================================
*/
const styles = StyleSheet.create({
  /* Dark Navy Header (matching Appointments & user image) */
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
    paddingHorizontal: 18,
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
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
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
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
  },

  /* CONSULTATION TYPE (IN-PERSON VS VIDEO) */
  consultationTypeSection: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  sectionOverline: {
    fontSize: 11,
    fontWeight: '700',
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  consultationTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8FAF6',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1.2,
    borderColor: '#BEECE3',
    gap: 6,
  },
  consultationTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 8,
  },
  consultationTypeBtnActive: {
    backgroundColor: TEAL,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  consultationTypeText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEAL_DARK,
  },
  consultationTypeTextActive: {
    color: '#FFFFFF',
  },

  /* CARDS */
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  cardHoliday: {
    borderColor: TEAL,
    backgroundColor: TEAL_LIGHT,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
  },
  cardSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
    lineHeight: 16,
  },

  /* DATE SELECTION */
  dateSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: TEAL_LIGHT,
    borderRadius: 11,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C3ECE4',
  },
  dateSelectBtnHoliday: {
    backgroundColor: TEAL_LIGHT,
    borderColor: TEAL,
  },
  dateSelectBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dateSelectIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSelectLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
  },
  dateSelectValue: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT,
    marginTop: 2,
  },
  calendarOpenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#BEECE3',
  },
  calendarOpenBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL_DARK,
  },

  holidayHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: TEAL,
  },
  holidayHeaderPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: TEAL_DARK,
  },
  holidayAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: TEAL,
  },
  holidayAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: TEAL_DARK,
  },
  holidayAlertText: {
    fontSize: 12,
    color: TEAL_DARK,
    marginTop: 2,
  },

  /* SECTION HEADERS */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B8EADB',
    flexShrink: 0,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: TEAL_DARK,
  },

  /* ITEM CARDS (SHIFTS, BREAKS, EMERGENCY) */
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFCFC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E6EFF0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
    marginRight: 6,
  },
  itemIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.2,
  },
  itemSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: MUTED,
    marginTop: 2,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: TEAL_DARK,
  },
  emergencyBadge: {
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emergencyBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: TEAL_DARK,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3.5,
    borderRadius: 5,
    backgroundColor: TEAL_LIGHT,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL_DARK,
  },

  /* HOLIDAY CARD */
  holidayActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: TEAL,
  },
  holidayIconLarge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  holidayHighlightPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: TEAL,
  },
  holidayHighlightPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: TEAL_DARK,
  },
  holidayActiveTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: TEAL_DARK,
  },
  holidayActiveReason: {
    fontSize: 13,
    color: TEAL_DARK,
    marginTop: 2,
  },

  /* EMPTY STATE */
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
  },
  emptyText: {
    fontSize: 12,
    color: MUTED,
    textAlign: 'center',
    maxWidth: 260,
  },

  /* MODALS COMMON */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  keyboardAvoidingModal: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT,
  },
  modalBody: {
    flexGrow: 0,
    flexShrink: 1,
  },
  modalBodyContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFDFD',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: MUTED,
    marginBottom: 6,
    marginTop: 6,
  },
  fullInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT,
  },

  /* DURATION SECTION IN ADD TIMINGS */
  durationManualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  durationInput: {
    width: 90,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: BORDER,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '800',
    color: TEXT,
    textAlign: 'center',
  },
  durationUnitText: {
    fontSize: 13,
    fontWeight: '700',
    color: MUTED,
  },
  quickDurationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickDurationBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: BORDER,
    borderRadius: 8,
  },
  quickDurationBtnActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  quickDurationText: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT,
  },
  quickDurationTextActive: {
    color: '#FFFFFF',
  },

  /* TIME PICKER TRIGGER BUTTON */
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  timePickerButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT,
  },

  /* AUTO-SUGGESTIONS DROPDOWN */
  suggestionsBox: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: TEAL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  suggestionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: MUTED,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: TEXT,
    marginLeft: 8,
  },

  /* SWITCH ROW */
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT,
  },

  /* MODAL BUTTONS */
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  saveButton: {
    flex: 1.3,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: TEAL,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: RED,
  },

  /* INPUT WITH DROPDOWN TRIGGER BUTTON */
  inputWithDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: BORDER,
    borderRadius: 10,
    overflow: 'hidden',
  },
  fullInputFlex: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT,
  },
  dropdownChevronBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },

  /* =========================================================
     ALL-IN-ONE IMAGE-MATCHING CALENDAR MODAL
  ========================================================= */
  imageCalendarCard: {
    width: '100%',
    maxWidth: 410,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },
  imageCalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  imageCalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: TEXT,
  },
  imageCalSubtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  imageCalBodyRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 12,
  },
  imageCalSidebar: {
    width: 68,
    gap: 8,
  },
  imageCalSideTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
    backgroundColor: '#FFFFFF',
  },
  imageCalSideTabActive: {
    backgroundColor: '#E6F7F3',
  },
  imageCalSideText: {
    fontSize: 11,
    fontWeight: '600',
    color: MUTED,
  },
  imageCalSideTextActive: {
    color: TEAL_DARK,
    fontWeight: '800',
  },
  imageCalMainArea: {
    flex: 1,
  },
  calNavHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calNavTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT,
  },
  calInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6F7F3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  calInfoPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: TEAL_DARK,
  },
  calWeekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  calWeekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  calDayInRange: {
    backgroundColor: TEAL_RANGE,
    borderRadius: 0,
  },
  calDaySolidSelected: {
    backgroundColor: TEAL_DARK,
    borderRadius: 10,
  },
  calDayHoliday: {
    backgroundColor: TEAL_LIGHT,
    borderWidth: 1,
    borderColor: TEAL,
  },
  calDayNum: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT,
  },
  calDayNumInRange: {
    color: TEAL_DARK,
    fontWeight: '700',
  },
  calDayNumSolid: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  calDayNumHoliday: {
    color: TEAL_DARK,
    fontWeight: '800',
  },
  calHolidayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEAL,
    position: 'absolute',
    bottom: 2,
  },
  imageCalDoneBtn: {
    backgroundColor: TEAL_DARK,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  imageCalDoneBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* MONTH / YEAR PICKER GRIDS */
  pickerGridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 6,
  },
  pickerGridBox: {
    width: '30%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: BORDER,
  },
  pickerGridBoxActive: {
    backgroundColor: TEAL_DARK,
    borderColor: TEAL_DARK,
  },
  pickerGridBoxText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT,
  },
  pickerGridBoxTextActive: {
    color: '#FFFFFF',
  },

  /* =========================================================
     SCROLLING TIME PICKER POPUP
  ========================================================= */
  timePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 999999,
    elevation: 999999,
  },
  timePickerCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
  },
  timePickerPreview: {
    backgroundColor: '#F0FDFA',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BEECE3',
  },
  timePickerPreviewText: {
    fontSize: 22,
    fontWeight: '900',
    color: TEAL_DARK,
    letterSpacing: 1,
  },
  pickerColumnsRow: {
    flexDirection: 'row',
    gap: 10,
    height: 170,
  },
  pickerCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pickerColLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: MUTED,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  pickerScrollView: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 6,
  },
  pickerItemActive: {
    backgroundColor: TEAL,
  },
  pickerItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pickerPeriodBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: BORDER,
  },
  pickerPeriodBtnActive: {
    backgroundColor: TEAL_DARK,
    borderColor: TEAL_DARK,
  },
  pickerPeriodText: {
    fontSize: 13,
    fontWeight: '800',
    color: TEXT,
  },
  pickerPeriodTextActive: {
    color: '#FFFFFF',
  },
  timePickerConfirmBtn: {
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  timePickerConfirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* HOLIDAY MODAL INPUTS */
  holidayRangeInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  holidayDatePickBox: {
    flex: 1,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#BEECE3',
  },
  holidayHighlightLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: TEAL_DARK,
    textTransform: 'uppercase',
  },
  holidayHighlightValue: {
    fontSize: 13,
    fontWeight: '800',
    color: TEXT,
    marginTop: 3,
  },
  holidayPickHint: {
    fontSize: 10,
    color: TEAL_DARK,
    marginTop: 3,
    fontWeight: '600',
  },
  holidayDurationRow: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  holidayDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BEECE3',
  },
  holidayDurationBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: TEAL_DARK,
  },

  /* HOLIDAY DATE PICKER OVERLAY POPUP */
  holidayPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 999999,
    elevation: 999999,
  },
  holidayPickerCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 12,
  },
  holidayPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  holidayPickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
  },
  holidayPickerSubtitle: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
  },
  holidayPickerCloseBtn: {
    padding: 4,
  },
  holidayPickerNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: TEAL_LIGHT,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BEECE3',
  },
  holidayPickerNavBtn: {
    padding: 4,
  },
  holidayPickerNavTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: TEAL_DARK,
  },
  holidayPickerWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  holidayPickerWeekText: {
    fontSize: 11,
    fontWeight: '700',
    color: MUTED,
    width: 38,
    textAlign: 'center',
  },
  holidayPickerDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 4,
  },
  holidayPickerDayCell: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  holidayPickerDayInRange: {
    backgroundColor: TEAL_RANGE,
  },
  holidayPickerDaySelected: {
    backgroundColor: TEAL_DARK,
  },
  holidayPickerDayText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT,
  },
  holidayPickerDayTextInRange: {
    color: TEAL_DARK,
  },
  holidayPickerDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  holidayPickerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  holidayPickerTodayBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: TEAL_LIGHT,
    borderWidth: 1,
    borderColor: '#BEECE3',
  },
  holidayPickerTodayBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: TEAL_DARK,
  },
  holidayPickerDoneBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  holidayPickerDoneBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: MUTED,
  },
});