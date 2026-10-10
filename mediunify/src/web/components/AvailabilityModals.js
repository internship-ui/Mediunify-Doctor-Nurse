import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ============================================================================
 * 1. SELECT TIME PICKER MODAL (Exact match to media_1791271344205.png)
 * ============================================================================
 */
export function SelectTimePickerModal({
  visible,
  title = 'Select Start Time',
  initialTime = '09:00 AM',
  onClose,
  onSetTime,
}) {
  // Parse initialTime: '09:00 AM' -> hour: '09', min: '00', period: 'AM'
  const parseTime = (tStr) => {
    try {
      const parts = tStr.split(' ');
      const period = parts[1] || 'AM';
      const timeParts = (parts[0] || '09:00').split(':');
      const hour = timeParts[0].padStart(2, '0');
      const min = (timeParts[1] || '00').padStart(2, '0');
      return { hour, min, period };
    } catch {
      return { hour: '09', min: '00', period: 'AM' };
    }
  };

  const parsed = parseTime(initialTime);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMin, setSelectedMin] = useState(parsed.min);
  const [selectedPeriod, setSelectedPeriod] = useState(parsed.period);

  const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const PERIODS = ['AM', 'PM'];

  const handleDone = () => {
    const formatted = `${selectedHour}:${selectedMin} ${selectedPeriod}`;
    if (onSetTime) onSetTime(formatted);
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.timePickerContainer}>
          {/* Header */}
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalHeaderTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color="#081E3E" />
            </TouchableOpacity>
          </View>

          {/* Large Time Display Banner (Light Mint) */}
          <View style={styles.timeDisplayBanner}>
            <Text style={styles.timeDisplayText}>
              {selectedHour} : {selectedMin}  {selectedPeriod}
            </Text>
          </View>

          {/* 3 Columns: HOURS, MINUTES, PERIOD */}
          <View style={styles.timeColumnsRow}>
            {/* Box 1: HOURS */}
            <View style={styles.timeColumnBox}>
              <Text style={styles.timeColumnLabel}>HOURS</Text>
              <ScrollView style={styles.timeColumnScroll} showsVerticalScrollIndicator={false}>
                {HOURS.map((h) => {
                  const isSelected = selectedHour === h;
                  return (
                    <TouchableOpacity
                      key={h}
                      style={[styles.timeItemBtn, isSelected && styles.timeItemBtnSelected]}
                      onPress={() => setSelectedHour(h)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.timeItemText, isSelected && styles.timeItemTextSelected]}>
                        {h}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Box 2: MINUTES */}
            <View style={styles.timeColumnBox}>
              <Text style={styles.timeColumnLabel}>MINUTES</Text>
              <ScrollView style={styles.timeColumnScroll} showsVerticalScrollIndicator={false}>
                {MINUTES.map((m) => {
                  const isSelected = selectedMin === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[styles.timeItemBtn, isSelected && styles.timeItemBtnSelected]}
                      onPress={() => setSelectedMin(m)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.timeItemText, isSelected && styles.timeItemTextSelected]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Box 3: PERIOD */}
            <View style={styles.timeColumnBox}>
              <Text style={styles.timeColumnLabel}>PERIOD</Text>
              <View style={styles.periodColContent}>
                {PERIODS.map((p) => {
                  const isSelected = selectedPeriod === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[styles.periodBtn, isSelected && styles.periodBtnSelected]}
                      onPress={() => setSelectedPeriod(p)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.periodBtnText, isSelected && styles.periodBtnTextSelected]}>
                        {p}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Set Time Button */}
          <TouchableOpacity style={styles.setTimeActionBtn} onPress={handleDone} activeOpacity={0.88}>
            <Text style={styles.setTimeActionBtnText}>Set Time</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * ============================================================================
 * 2. ADD TIMINGS MODAL (Exact match to media_1791271331227.png)
 * ============================================================================
 */
export function AddTimingsModal({
  visible,
  initialStartTime = '09:00 AM',
  initialEndTime = '01:00 PM',
  initialDuration = 15,
  initialActiveSlot = true,
  onClose,
  onSave,
}) {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [duration, setDuration] = useState(initialDuration);
  const [activeSlot, setActiveSlot] = useState(initialActiveSlot);

  // Sub-modal for picking time
  const [timePickerTarget, setTimePickerTarget] = useState(null); // 'start' | 'end' | null

  const DURATION_PRESETS = [5, 10, 15, 30];

  const handleSave = () => {
    if (onSave) {
      onSave({
        startTime,
        endTime,
        duration,
        activeSlot,
        formattedHours: `${startTime} – ${endTime}`,
      });
    }
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.addTimingsContainer}>
          {/* Header */}
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalHeaderTitle}>Add Timings</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color="#081E3E" />
            </TouchableOpacity>
          </View>

          {/* Row 1: Start Time & End Time side-by-side */}
          <View style={styles.timeInputsRow}>
            {/* Start Time Box */}
            <View style={styles.timeInputCol}>
              <Text style={styles.timeInputLabel}>Start Time</Text>
              <TouchableOpacity
                style={styles.timeBoxField}
                onPress={() => setTimePickerTarget('start')}
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={16} color="#081E3E" />
                <Text style={styles.timeBoxFieldText}>{startTime}</Text>
              </TouchableOpacity>
            </View>

            {/* End Time Box */}
            <View style={styles.timeInputCol}>
              <Text style={styles.timeInputLabel}>End Time</Text>
              <TouchableOpacity
                style={styles.timeBoxField}
                onPress={() => setTimePickerTarget('end')}
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={16} color="#081E3E" />
                <Text style={styles.timeBoxFieldText}>{endTime}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: Consultation Duration */}
          <View style={styles.durationSection}>
            <Text style={styles.durationLabel}>
              Consultation Duration (minutes per patient)
            </Text>

            {/* Numeric Box + Label */}
            <View style={styles.durationInputRow}>
              <View style={styles.durationNumericBox}>
                <Text style={styles.durationNumericText}>{duration}</Text>
              </View>
              <Text style={styles.durationUnitText}>mins / patient</Text>
            </View>

            {/* Quick Pills (5 min, 10 min, 15 min, 30 min) */}
            <View style={styles.durationPillsRow}>
              {DURATION_PRESETS.map((p) => {
                const isSelected = duration === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.durationPillBtn, isSelected && styles.durationPillBtnSelected]}
                    onPress={() => setDuration(p)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.durationPillBtnText,
                        isSelected && styles.durationPillBtnTextSelected,
                      ]}
                    >
                      {p} min
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.horizontalDivider} />

          {/* Row 3: Active Working Slot Toggle */}
          <View style={styles.activeSlotRow}>
            <Text style={styles.activeSlotLabel}>Active Working Slot</Text>
            <Switch
              value={activeSlot}
              onValueChange={setActiveSlot}
              trackColor={{ false: '#CBD5E1', true: '#00B894' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Footer Buttons: Cancel & Save Timing */}
          <View style={styles.footerButtonsRow}>
            <TouchableOpacity style={styles.cancelActionBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelActionBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveTimingActionBtn} onPress={handleSave} activeOpacity={0.88}>
              <Text style={styles.saveTimingActionBtnText}>Save Timing</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sub-modal: Select Time Picker */}
        <SelectTimePickerModal
          visible={timePickerTarget !== null}
          title={timePickerTarget === 'start' ? 'Select Start Time' : 'Select End Time'}
          initialTime={timePickerTarget === 'start' ? startTime : endTime}
          onClose={() => setTimePickerTarget(null)}
          onSetTime={(newTime) => {
            if (timePickerTarget === 'start') setStartTime(newTime);
            else if (timePickerTarget === 'end') setEndTime(newTime);
          }}
        />
      </View>
    </Modal>
  );
}

/**
 * ============================================================================
 * 3. SELECT DATE CALENDAR PICKER MODAL (Exact match to media_1791271355643.png)
 * ============================================================================
 */
export function SelectDatePickerModal({
  visible,
  title = 'Select Date',
  subtitle = 'Select date or date range',
  initialDate = 5,
  initialMonth = 'October',
  initialYear = 2026,
  onClose,
  onSelectDate,
}) {
  const [activeNavTab, setActiveNavTab] = useState('Date'); // 'Today' | 'Date' | 'Week' | 'Month' | 'Year'
  const [selectedDay, setSelectedDay] = useState(initialDate);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

  const NAV_TABS = [
    { id: 'Today', icon: 'calendar-outline' },
    { id: 'Date', icon: 'grid-outline' },
    { id: 'Week', icon: 'calendar-clear-outline' },
    { id: 'Month', icon: 'calendar-sharp' },
    { id: 'Year', icon: 'options-outline' },
  ];

  // Calendar matrix for October 2026:
  // Oct 1, 2026 is a Thursday.
  // Sun: blank, blank, blank, blank. Thu: 1, Fri: 2, Sat: 3
  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const CALENDAR_DAYS = [
    // Week 1 (Starts Thursday)
    null, null, null, null, 1, 2, 3,
    // Week 2
    4, 5, 6, 7, 8, 9, 10,
    // Week 3
    11, 12, 13, 14, 15, 16, 17,
    // Week 4
    18, 19, 20, 21, 22, 23, 24,
    // Week 5
    25, 26, 27, 28, 29, 30, 31,
  ];

  const handleDone = () => {
    if (onSelectDate) {
      onSelectDate({
        day: selectedDay,
        month: currentMonth,
        year: currentYear,
        formatted: `${selectedDay} ${currentMonth} ${currentYear}`,
      });
    }
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerContainer}>
          {/* Header */}
          <View style={styles.modalHeaderRow}>
            <View>
              <Text style={styles.modalHeaderTitle}>{title}</Text>
              <Text style={styles.modalHeaderSubtitle}>{subtitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color="#081E3E" />
            </TouchableOpacity>
          </View>

          {/* Two-Column Body: Left Tabs + Right Calendar */}
          <View style={styles.datePickerBodyRow}>
            {/* Left Vertical Nav Tabs */}
            <View style={styles.datePickerLeftTabs}>
              {NAV_TABS.map((tab) => {
                const isActive = activeNavTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.dateNavTabItem, isActive && styles.dateNavTabItemActive]}
                    onPress={() => setActiveNavTab(tab.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={tab.icon}
                      size={17}
                      color={isActive ? '#00B894' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.dateNavTabText,
                        isActive && styles.dateNavTabTextActive,
                      ]}
                    >
                      {tab.id}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Right Calendar Area */}
            <View style={styles.datePickerCalendarArea}>
              {/* Month Navigation Row */}
              <View style={styles.monthNavRow}>
                <TouchableOpacity
                  style={styles.monthNavChevronBtn}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={16} color="#081E3E" />
                </TouchableOpacity>

                <Text style={styles.monthNavTitle}>
                  {currentMonth} {currentYear}
                </Text>

                <TouchableOpacity
                  style={styles.monthNavChevronBtn}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-forward" size={16} color="#081E3E" />
                </TouchableOpacity>
              </View>

              {/* Info Pill Callout */}
              <View style={styles.dateInfoPill}>
                <Ionicons name="information-circle-outline" size={15} color="#00B894" />
                <Text style={styles.dateInfoPillText}>
                  Select date or tap another date for range
                </Text>
              </View>

              {/* Days of Week Header */}
              <View style={styles.daysOfWeekRow}>
                {DAYS_OF_WEEK.map((d) => (
                  <Text key={d} style={styles.dayOfWeekHeaderLabel}>
                    {d}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {CALENDAR_DAYS.map((dayNum, idx) => {
                  if (dayNum === null) {
                    return <View key={`blank-${idx}`} style={styles.calendarDayCell} />;
                  }
                  const isSelected = selectedDay === dayNum;
                  return (
                    <TouchableOpacity
                      key={`day-${dayNum}`}
                      style={[styles.calendarDayCell, isSelected && styles.calendarDayCellSelected]}
                      onPress={() => setSelectedDay(dayNum)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          isSelected && styles.calendarDayTextSelected,
                        ]}
                      >
                        {dayNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Done Button */}
          <TouchableOpacity style={styles.doneActionBtn} onPress={handleDone} activeOpacity={0.88}>
            <Text style={styles.doneActionBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * ============================================================================
 * 4. ADD / EDIT BREAK MODAL (Search with Dropdown of Reason)
 * ============================================================================
 */
export function AddBreakModal({
  visible,
  initialTitle = 'Lunch break',
  initialStartTime = '01:00 PM',
  initialEndTime = '02:00 PM',
  onClose,
  onSave,
}) {
  const [breakTitle, setBreakTitle] = useState(initialTitle);
  const [showDropdown, setShowDropdown] = useState(false);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [timePickerTarget, setTimePickerTarget] = useState(null);

  const BREAK_OPTIONS = [
    'Lunch break',
    'Tea / Coffee break',
    'Ward rounds / Clinical visit',
    'Personal rest / Break',
    'Department meeting',
    'Staff clinical huddle',
    'Administrative hour',
    'Prayer / Meditation break',
    'Surgery prep break',
  ];

  const filteredBreaks = BREAK_OPTIONS.filter((o) =>
    !breakTitle || o.toLowerCase().includes(breakTitle.toLowerCase())
  );

  const handleSave = () => {
    if (onSave) {
      onSave({
        title: breakTitle || 'Lunch break',
        startTime,
        endTime,
        formattedHours: `${startTime} – ${endTime}`,
      });
    }
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.addTimingsContainer}>
          {/* Header */}
          <View style={styles.modalHeaderRow}>
            <View>
              <Text style={styles.modalHeaderTitle}>Add Break</Text>
              <Text style={styles.modalHeaderSubtitle}>Pause bookings during rest or meal intervals</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color="#081E3E" />
            </TouchableOpacity>
          </View>

          {/* Search with dropdown for Break Reason */}
          <View style={{ marginBottom: 14, position: 'relative', zIndex: 100 }}>
            <Text style={styles.timeInputLabel}>Break Reason / Type</Text>
            <View style={styles.searchDropdownContainer}>
              <Ionicons name="search-outline" size={16} color="#00B894" />
              <TextInput
                style={styles.searchDropdownInput}
                placeholder="e.g. Lunch break, Tea break, Ward rounds..."
                placeholderTextColor="#94A3B8"
                value={breakTitle}
                onChangeText={(t) => {
                  setBreakTitle(t);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={styles.searchDropdownChevronBtn}
              >
                <Ionicons
                  name={showDropdown ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#081E3E"
                />
              </TouchableOpacity>
            </View>

            {/* Dropdown Menu */}
            {showDropdown && (
              <View style={styles.searchDropdownMenu}>
                <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                  {filteredBreaks.length === 0 ? (
                    <View style={{ padding: 10, alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#94A3B8' }}>Type manual break reason above</Text>
                    </View>
                  ) : (
                    filteredBreaks.map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={styles.searchDropdownItem}
                        onPress={() => {
                          setBreakTitle(p);
                          setShowDropdown(false);
                        }}
                      >
                        <Ionicons name="cafe-outline" size={14} color="#00B894" />
                        <Text style={styles.searchDropdownItemText}>{p}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Start Time & End Time */}
          <View style={styles.timeInputsRow}>
            <View style={styles.timeInputCol}>
              <Text style={styles.timeInputLabel}>Break Start</Text>
              <TouchableOpacity
                style={styles.timeBoxField}
                onPress={() => setTimePickerTarget('start')}
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={16} color="#081E3E" />
                <Text style={styles.timeBoxFieldText}>{startTime}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputCol}>
              <Text style={styles.timeInputLabel}>Break End</Text>
              <TouchableOpacity
                style={styles.timeBoxField}
                onPress={() => setTimePickerTarget('end')}
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={16} color="#081E3E" />
                <Text style={styles.timeBoxFieldText}>{endTime}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.footerButtonsRow}>
            <TouchableOpacity style={styles.cancelActionBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelActionBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveTimingActionBtn} onPress={handleSave} activeOpacity={0.88}>
              <Text style={styles.saveTimingActionBtnText}>Save Break</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Picker Submodal */}
        <SelectTimePickerModal
          visible={timePickerTarget !== null}
          title={timePickerTarget === 'start' ? 'Select Break Start' : 'Select Break End'}
          initialTime={timePickerTarget === 'start' ? startTime : endTime}
          onClose={() => setTimePickerTarget(null)}
          onSetTime={(newTime) => {
            if (timePickerTarget === 'start') setStartTime(newTime);
            else if (timePickerTarget === 'end') setEndTime(newTime);
          }}
        />
      </View>
    </Modal>
  );
}

/**
 * ============================================================================
 * 5. SET HOLIDAY / OFF-DUTY MODAL (Search Dropdown + From & To Pop-up Calendars)
 * ============================================================================
 */
export function SetHolidayModal({
  visible,
  currentDate = '05 October 2026',
  onClose,
  onSave,
}) {
  const [holidayType, setHolidayType] = useState('Public holiday');
  const [showDropdown, setShowDropdown] = useState(false);
  const [fromDate, setFromDate] = useState(currentDate);
  const [toDate, setToDate] = useState(currentDate);
  const [calendarTarget, setCalendarTarget] = useState(null); // 'from' | 'to' | null
  const [offDutyActive, setOffDutyActive] = useState(true);

  const HOLIDAY_OPTIONS = [
    'Public holiday',
    'National festival holiday',
    'Annual vacation leave',
    'Medical CME / Conference',
    'Personal leave',
    'Emergency family leave',
    'Hospital off duty',
    'Weekly scheduled off',
  ];

  const filteredHolidays = HOLIDAY_OPTIONS.filter((o) =>
    !holidayType || o.toLowerCase().includes(holidayType.toLowerCase())
  );

  const handleSave = () => {
    if (onSave) {
      onSave({
        type: holidayType || 'Public holiday',
        fromDate,
        toDate,
        dateRangeText: fromDate === toDate ? fromDate : `${fromDate} – ${toDate}`,
        offDutyActive,
      });
    }
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.addTimingsContainer}>
          <View style={styles.modalHeaderRow}>
            <View>
              <Text style={styles.modalHeaderTitle}>Set Holiday / Off Duty</Text>
              <Text style={styles.modalHeaderSubtitle}>Block calendar and pause online patient bookings</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color="#081E3E" />
            </TouchableOpacity>
          </View>

          {/* Search with dropdown for Holiday Reason */}
          <View style={{ marginBottom: 14, position: 'relative', zIndex: 100 }}>
            <Text style={styles.timeInputLabel}>Holiday / Leave Reason</Text>
            <View style={styles.searchDropdownContainer}>
              <Ionicons name="search-outline" size={16} color="#00B894" />
              <TextInput
                style={styles.searchDropdownInput}
                placeholder="e.g. Public holiday, Annual vacation, Medical CME..."
                placeholderTextColor="#94A3B8"
                value={holidayType}
                onChangeText={(t) => {
                  setHolidayType(t);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={styles.searchDropdownChevronBtn}
              >
                <Ionicons
                  name={showDropdown ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#081E3E"
                />
              </TouchableOpacity>
            </View>

            {/* Dropdown Menu */}
            {showDropdown && (
              <View style={styles.searchDropdownMenu}>
                <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                  {filteredHolidays.length === 0 ? (
                    <View style={{ padding: 10, alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#94A3B8' }}>Type manual holiday reason above</Text>
                    </View>
                  ) : (
                    filteredHolidays.map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={styles.searchDropdownItem}
                        onPress={() => {
                          setHolidayType(p);
                          setShowDropdown(false);
                        }}
                      >
                        <Ionicons name="umbrella-outline" size={14} color="#00B894" />
                        <Text style={styles.searchDropdownItemText}>{p}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {/* From Date & To Date Calendar Pop-up Row */}
          <View style={styles.timeInputsRow}>
            <View style={styles.timeInputCol}>
              <Text style={styles.timeInputLabel}>From Date</Text>
              <TouchableOpacity
                style={styles.timeBoxField}
                onPress={() => setCalendarTarget('from')}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={16} color="#081E3E" />
                <Text style={styles.timeBoxFieldText} numberOfLines={1}>{fromDate}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputCol}>
              <Text style={styles.timeInputLabel}>To Date</Text>
              <TouchableOpacity
                style={styles.timeBoxField}
                onPress={() => setCalendarTarget('to')}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={16} color="#081E3E" />
                <Text style={styles.timeBoxFieldText} numberOfLines={1}>{toDate}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Toggle */}
          <View style={[styles.activeSlotRow, { marginBottom: 14 }]}>
            <Text style={styles.activeSlotLabel}>Mark as Full-Day Off Duty</Text>
            <Switch
              value={offDutyActive}
              onValueChange={setOffDutyActive}
              trackColor={{ false: '#CBD5E1', true: '#00B894' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.footerButtonsRow}>
            <TouchableOpacity style={styles.cancelActionBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelActionBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveTimingActionBtn} onPress={handleSave} activeOpacity={0.88}>
              <Text style={styles.saveTimingActionBtnText}>Set Off Duty</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Calendar Picker Submodal for From/To */}
        <SelectDatePickerModal
          visible={calendarTarget !== null}
          title={calendarTarget === 'from' ? 'Select Holiday From Date' : 'Select Holiday To Date'}
          subtitle="Choose date on calendar to block availability"
          initialDate={5}
          initialMonth="October"
          initialYear={2026}
          onClose={() => setCalendarTarget(null)}
          onSelectDate={(d) => {
            const dayStr = String(d.day).padStart(2, '0');
            const formatted = `${dayStr} ${d.month} ${d.year}`;
            if (calendarTarget === 'from') {
              setFromDate(formatted);
            } else if (calendarTarget === 'to') {
              setToDate(formatted);
            }
            setCalendarTarget(null);
          }}
        />
      </View>
    </Modal>
  );
}

/**
 * ============================================================================
 * 6. ADD EMERGENCY / EXTENDED HOURS MODAL (Exact match to User Screenshot)
 * ============================================================================
 */
export function AddEmergencySlotModal({
  visible,
  initialType = '',
  initialStartTime = '08:00 PM',
  initialEndTime = '10:00 PM',
  onClose,
  onSave,
}) {
  const [slotType, setSlotType] = useState(initialType);
  const [showDropdown, setShowDropdown] = useState(false);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [activeSlot, setActiveSlot] = useState(true);
  const [timePickerTarget, setTimePickerTarget] = useState(null);

  const EXTENDED_OPTIONS = [
    'Extended Hours',
    'Urgent Case Overtime',
    'Emergency On-Call Duty',
    'Critical Care Consult',
    'ICU Night Coverage',
    'Post-Operative Monitoring',
    'Night Shift Tele-Consult',
    'Weekend Urgent Care',
    'Priority Emergency Slot',
  ];

  const filteredSlots = EXTENDED_OPTIONS.filter((o) =>
    !slotType || o.toLowerCase().includes(slotType.toLowerCase())
  );

  const handleSave = () => {
    if (onSave) {
      onSave({
        type: slotType || 'Extended Hours',
        startTime,
        endTime,
        formattedHours: `${startTime} – ${endTime}`,
        activeSlot,
      });
    }
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.emergencyModalCard}>
          {/* Header matching screenshot: Title + Close Icon */}
          <View style={styles.emergencyModalHeaderRow}>
            <Text style={styles.emergencyModalTitle}>Add Emergency / Extended Hours</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="#081E3E" />
            </TouchableOpacity>
          </View>

          {/* Extended Hours / Urgent Overtime Type Label & Input matching screenshot */}
          <View style={{ marginBottom: 16, position: 'relative', zIndex: 100 }}>
            <Text style={styles.emergencyInputLabel}>Extended Hours / Urgent Overtime Type</Text>
            <View style={styles.emergencyInputContainer}>
              <TextInput
                style={styles.emergencyTextInput}
                placeholder="e.g. Extended Hours, Urgent Case Overtime"
                placeholderTextColor="#94A3B8"
                value={slotType}
                onChangeText={(t) => {
                  setSlotType(t);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={styles.emergencyChevronBtn}
              >
                <Ionicons
                  name={showDropdown ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#081E3E"
                />
              </TouchableOpacity>
            </View>

            {/* Dropdown Menu */}
            {showDropdown && (
              <View style={styles.searchDropdownMenu}>
                <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
                  {filteredSlots.length === 0 ? (
                    <View style={{ padding: 12, alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#94A3B8' }}>Type manual overtime reason above</Text>
                    </View>
                  ) : (
                    filteredSlots.map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={styles.searchDropdownItem}
                        onPress={() => {
                          setSlotType(p);
                          setShowDropdown(false);
                        }}
                      >
                        <Ionicons name="flash-outline" size={14} color="#00B894" />
                        <Text style={styles.searchDropdownItemText}>{p}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Start Time & End Time matching screenshot */}
          <View style={styles.emergencyTimeRow}>
            <View style={styles.emergencyTimeCol}>
              <Text style={styles.emergencyInputLabel}>Start Time</Text>
              <TouchableOpacity
                style={styles.emergencyTimeBox}
                onPress={() => setTimePickerTarget('start')}
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={17} color="#081E3E" />
                <Text style={styles.emergencyTimeBoxText}>{startTime}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emergencyTimeCol}>
              <Text style={styles.emergencyInputLabel}>End Time</Text>
              <TouchableOpacity
                style={styles.emergencyTimeBox}
                onPress={() => setTimePickerTarget('end')}
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={17} color="#081E3E" />
                <Text style={styles.emergencyTimeBoxText}>{endTime}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Extended Slot Toggle matching screenshot */}
          <View style={styles.emergencyActiveSlotRow}>
            <Text style={styles.emergencyActiveSlotLabel}>Active Extended Slot</Text>
            <Switch
              value={activeSlot}
              onValueChange={setActiveSlot}
              trackColor={{ false: '#CBD5E1', true: '#00B894' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Action Buttons matching screenshot */}
          <View style={styles.emergencyButtonsRow}>
            <TouchableOpacity style={styles.emergencyCancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.emergencyCancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.emergencySaveBtn} onPress={handleSave} activeOpacity={0.88}>
              <Text style={styles.emergencySaveBtnText}>Save Slot</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Picker Submodal */}
        <SelectTimePickerModal
          visible={timePickerTarget !== null}
          title={timePickerTarget === 'start' ? 'Select Start Time' : 'Select End Time'}
          initialTime={timePickerTarget === 'start' ? startTime : endTime}
          onClose={() => setTimePickerTarget(null)}
          onSetTime={(newTime) => {
            if (timePickerTarget === 'start') setStartTime(newTime);
            else if (timePickerTarget === 'end') setEndTime(newTime);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // Common Header
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.3,
  },
  modalHeaderSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* =========================================================================
     1. ADD TIMINGS MODAL STYLES (media_1791271331227.png)
     ========================================================================= */
  addTimingsContainer: {
    width: '100%',
    maxWidth: 410,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  timeInputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  timeInputCol: {
    flex: 1,
    gap: 6,
  },
  timeInputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  timeBoxField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  timeBoxFieldText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },

  durationSection: {
    gap: 8,
    marginBottom: 16,
  },
  durationLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  durationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationNumericBox: {
    width: 80,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  durationNumericText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  durationUnitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  durationPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  durationPillBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPillBtnSelected: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  durationPillBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  durationPillBtnTextSelected: {
    color: '#FFFFFF',
  },

  horizontalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  activeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeSlotLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  footerButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  saveTimingActionBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveTimingActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* =========================================================================
     2. SELECT TIME PICKER MODAL STYLES (media_1791271344205.png)
     ========================================================================= */
  timePickerContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  timeDisplayBanner: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  timeDisplayText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: 1.5,
  },
  timeColumnsRow: {
    flexDirection: 'row',
    gap: 8,
    height: 180,
    marginBottom: 14,
  },
  timeColumnBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    alignItems: 'center',
  },
  timeColumnLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  timeColumnScroll: {
    width: '100%',
    paddingHorizontal: 6,
  },
  timeItemBtn: {
    width: '100%',
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  timeItemBtnSelected: {
    backgroundColor: '#081E3E',
  },
  timeItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  timeItemTextSelected: {
    color: '#FFFFFF',
  },
  periodColContent: {
    width: '100%',
    paddingHorizontal: 6,
    gap: 8,
    marginTop: 4,
  },
  periodBtn: {
    width: '100%',
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodBtnSelected: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  periodBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#081E3E',
  },
  periodBtnTextSelected: {
    color: '#FFFFFF',
  },
  setTimeActionBtn: {
    width: '100%',
    height: 42,
    borderRadius: 8,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setTimeActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* =========================================================================
     3. SELECT DATE CALENDAR PICKER MODAL STYLES (media_1791271355643.png)
     ========================================================================= */
  datePickerContainer: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  datePickerBodyRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  datePickerLeftTabs: {
    width: 60,
    gap: 6,
    paddingRight: 6,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  dateNavTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dateNavTabItemActive: {
    backgroundColor: '#E8F8F5',
  },
  dateNavTabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  dateNavTabTextActive: {
    color: '#00B894',
    fontWeight: '800',
  },

  datePickerCalendarArea: {
    flex: 1,
    gap: 8,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthNavChevronBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  dateInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  dateInfoPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
    flex: 1,
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dayOfWeekHeaderLabel: {
    width: 28,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
  },
  calendarDayCell: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayCellSelected: {
    backgroundColor: '#081E3E',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#081E3E',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  doneActionBtn: {
    width: '100%',
    height: 42,
    borderRadius: 8,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Search with Dropdown Styles (Breaks & Holiday) */
  searchDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    gap: 8,
    marginTop: 6,
  },
  searchDropdownInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#081E3E',
    fontWeight: '600',
    padding: 0,
  },
  searchDropdownChevronBtn: {
    padding: 4,
  },
  searchDropdownMenu: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 10,
    maxHeight: 180,
    overflow: 'hidden',
  },
  searchDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchDropdownItemText: {
    fontSize: 13,
    color: '#081E3E',
    fontWeight: '600',
  },

  /* Emergency / Extended Hours Modal (Matching User Image) */
  emergencyModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  emergencyModalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  emergencyModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.2,
  },
  emergencyInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  emergencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    marginTop: 2,
  },
  emergencyTextInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#081E3E',
    fontWeight: '500',
    padding: 0,
  },
  emergencyChevronBtn: {
    padding: 4,
  },
  emergencyTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  emergencyTimeCol: {
    flex: 1,
  },
  emergencyTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    backgroundColor: '#F8FAFC',
    marginTop: 2,
  },
  emergencyTimeBoxText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  emergencyActiveSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  emergencyActiveSlotLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  emergencyButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  emergencyCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#F0F4F8',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },
  emergencySaveBtn: {
    flex: 1.3,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencySaveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
