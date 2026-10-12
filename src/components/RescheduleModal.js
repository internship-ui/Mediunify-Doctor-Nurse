import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme/colors';

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

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export default function RescheduleModal({
  visible,
  onClose,
  appointment,
  onConfirmReschedule,
}) {
  const [selectedNewDate, setSelectedNewDate] = useState('18 Sep 2026');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [manualTimeText, setManualTimeText] = useState('10:30');
  const [manualPeriod, setManualPeriod] = useState('AM');
  const [isAmPmDropdownOpen, setIsAmPmDropdownOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);
  const [additionalNote, setAdditionalNote] = useState('');
  const [reasonError, setReasonError] = useState('');

  // Calendar Picker Modal State
  const [isCalendarPickerOpen, setIsCalendarPickerOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('date'); // 'date' | 'month' | 'year'
  const [calendarMonth, setCalendarMonth] = useState(8); // September
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarDay, setCalendarDay] = useState(15);

  // Custom Time Picker Modal State
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [customHour, setCustomHour] = useState('10');
  const [customMin, setCustomMin] = useState('30');
  const [customPeriod, setCustomPeriod] = useState('AM');

  useEffect(() => {
    if (visible && appointment) {
      setSelectedNewDate('18 Sep 2026');
      const defaultTime = '10:30 AM';
      setSelectedTime(defaultTime);
      setManualTimeText('10:30');
      setManualPeriod('AM');
      setCustomHour('10');
      setCustomMin('30');
      setCustomPeriod('AM');
      setIsTimePickerOpen(false);
      setIsAmPmDropdownOpen(false);
      setSelectedReason('');
      setIsReasonDropdownOpen(false);
      setAdditionalNote('');
      setReasonError('');
      setIsCalendarPickerOpen(false);
    }
  }, [visible, appointment]);

  // Calendar days grid computation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [calendarYear, calendarMonth]);

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

  const selectMonth = (index) => {
    setCalendarMonth(index);
    setCalendarView('date');
  };

  const selectYear = (year) => {
    setCalendarYear(year);
    setCalendarView('date');
  };

  const handleCalendarDone = () => {
    const formatted = `${calendarDay} ${MONTHS_SHORT[calendarMonth]} ${calendarYear}`;
    setSelectedNewDate(formatted);
    setIsCalendarPickerOpen(false);
  };

  const openCalendarPicker = () => {
    if (selectedNewDate) {
      const parts = selectedNewDate.split(' ');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const mIdx = MONTHS_SHORT.indexOf(parts[1]);
        const y = parseInt(parts[2], 10);
        if (!isNaN(d)) setCalendarDay(d);
        if (mIdx >= 0) setCalendarMonth(mIdx);
        if (!isNaN(y)) setCalendarYear(y);
      }
    }
    setCalendarView('date');
    setIsCalendarPickerOpen(true);
  };

  const handleQuickSlotSelect = (time) => {
    setSelectedTime(time);
    const parts = time.split(' ');
    setManualTimeText(parts[0] || '');
    setManualPeriod(parts[1] || 'AM');
    if (parts[0]) {
      const hm = parts[0].split(':');
      if (hm.length === 2) {
        setCustomHour(hm[0].padStart(2, '0'));
        setCustomMin(hm[1].padStart(2, '0'));
      }
    }
    if (parts[1]) setCustomPeriod(parts[1]);
    setIsAmPmDropdownOpen(false);
  };

  const openTimePicker = () => {
    const raw = manualTimeText || '10:30';
    const parts = raw.split(':');
    if (parts.length === 2) {
      setCustomHour(parts[0].padStart(2, '0'));
      setCustomMin(parts[1].padStart(2, '0'));
    }
    setCustomPeriod(manualPeriod || 'AM');
    setIsTimePickerOpen(true);
  };

  const handleTimeDone = () => {
    const formatted = `${customHour}:${customMin} ${customPeriod}`;
    setManualTimeText(`${customHour}:${customMin}`);
    setManualPeriod(customPeriod);
    setSelectedTime(formatted);
    setIsTimePickerOpen(false);
  };

  const handleManualTimeChange = (text) => {
    const cleaned = text.replace(/[^0-9:]/g, '').slice(0, 5);
    setManualTimeText(cleaned);
    const combined = cleaned.trim() ? `${cleaned.trim()} ${manualPeriod}` : '';
    setSelectedTime(combined);
  };

  const selectManualPeriod = (period) => {
    setManualPeriod(period);
    setIsAmPmDropdownOpen(false);
    const timeBase = manualTimeText.trim() || '10:30';
    setSelectedTime(`${timeBase} ${period}`);
  };

  const handleConfirm = () => {
    if (!selectedReason) {
      setReasonError('Please select a reason for rescheduling');
      return;
    }
    if (!appointment) return;

    const finalTime = manualTimeText.trim()
      ? `${manualTimeText.trim()} ${manualPeriod}`
      : (selectedTime || '10:30 AM');

    onConfirmReschedule({
      id: appointment.id,
      patient: appointment.patient,
      date: selectedNewDate,
      time: finalTime,
      reason: selectedReason,
      note: additionalNote.trim(),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (isCalendarPickerOpen) {
          setIsCalendarPickerOpen(false);
        } else if (isTimePickerOpen) {
          setIsTimePickerOpen(false);
        } else {
          onClose();
        }
      }}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingModal}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {isCalendarPickerOpen ? (
            /* ==================================================
                SELECT DATE POPUP IN NAVY BLUE THEME
            =================================================== */
            <View style={styles.calendarModalCard}>
              {/* MODAL HEADER IN NAVY BLUE */}
              <View style={styles.calModalHeader}>
                <View>
                  <Text style={styles.calModalTitle}>Select Date</Text>
                  <Text style={styles.calModalSubtitle}>Select appointment date</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsCalendarPickerOpen(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.closeCircleBtn}
                >
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* CALENDAR BODY (SIDEBAR + CONTENT) */}
              <View style={styles.calBodyRow}>
                {/* LEFT SIDEBAR IN NAVY BLUE THEME */}
                <View style={styles.calSidebar}>
                  <TouchableOpacity
                    style={[
                      styles.calSideTab,
                      calendarView === 'month' && styles.calSideTabActive,
                    ]}
                    onPress={() => setCalendarView('month')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={calendarView === 'month' ? '#071E42' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.calSideTabText,
                        calendarView === 'month' && styles.calSideTabTextActive,
                      ]}
                    >
                      Month
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.calSideTab,
                      calendarView === 'year' && styles.calSideTabActive,
                    ]}
                    onPress={() => setCalendarView('year')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={calendarView === 'year' ? '#071E42' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.calSideTabText,
                        calendarView === 'year' && styles.calSideTabTextActive,
                      ]}
                    >
                      Year
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* RIGHT CALENDAR VIEW */}
                <View style={styles.calContentArea}>
                  {calendarView === 'date' && (
                    <View>
                      {/* MONTH & YEAR HEADER WITH ARROWS */}
                      <View style={styles.calMonthNavRow}>
                        <TouchableOpacity
                          style={styles.calNavArrow}
                          onPress={previousMonth}
                        >
                          <Ionicons name="chevron-back" size={18} color="#071E42" />
                        </TouchableOpacity>

                        <Text style={styles.calMonthNavTitle}>
                          {MONTHS[calendarMonth]} {calendarYear}
                        </Text>

                        <TouchableOpacity
                          style={styles.calNavArrow}
                          onPress={nextMonth}
                        >
                          <Ionicons name="chevron-forward" size={18} color="#071E42" />
                        </TouchableOpacity>
                      </View>

                      {/* HINT BADGE IN SOFT NAVY */}
                      <View style={styles.calHintBadge}>
                        <Ionicons name="information-circle" size={15} color="#071E42" />
                        <Text style={styles.calHintText}>
                          Selected: {calendarDay} {MONTHS_SHORT[calendarMonth]} {calendarYear}
                        </Text>
                      </View>

                      {/* WEEK DAY LABELS */}
                      <View style={styles.calWeekHeader}>
                        {WEEK_DAYS.map((w) => (
                          <Text key={w} style={styles.calWeekDayText}>
                            {w}
                          </Text>
                        ))}
                      </View>

                      {/* DAYS GRID */}
                      <View style={styles.calDateGrid}>
                        {calendarDays.map((day, idx) => {
                          if (day === null) {
                            return <View key={`empty-${idx}`} style={styles.calDateCell} />;
                          }
                          const isSelected = day === calendarDay;
                          return (
                            <TouchableOpacity
                              key={`day-${day}`}
                              style={styles.calDateCell}
                              onPress={() => setCalendarDay(day)}
                              activeOpacity={0.7}
                            >
                              <View
                                style={[
                                  styles.calDateNumberBox,
                                  isSelected && styles.calDateNumberBoxSelected,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.calDateText,
                                    isSelected && styles.calDateTextSelected,
                                  ]}
                                >
                                  {day}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {calendarView === 'month' && (
                    <ScrollView
                      style={{ maxHeight: 310 }}
                      showsVerticalScrollIndicator={false}
                    >
                      <Text style={styles.calPickerTitle}>Select Month</Text>
                      {MONTHS.map((m, idx) => {
                        const isSelected = calendarMonth === idx;
                        return (
                          <TouchableOpacity
                            key={m}
                            style={[
                              styles.calListItem,
                              isSelected && styles.calListItemActive,
                            ]}
                            onPress={() => selectMonth(idx)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.calListItemText,
                                isSelected && styles.calListItemTextActive,
                              ]}
                            >
                              {m}
                            </Text>
                            {isSelected && (
                              <Ionicons
                                name="checkmark-circle"
                                size={19}
                                color="#071E42"
                              />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}

                  {calendarView === 'year' && (
                    <ScrollView
                      style={{ maxHeight: 310 }}
                      showsVerticalScrollIndicator={false}
                    >
                      <Text style={styles.calPickerTitle}>Select Year</Text>
                      {YEARS.map((y) => {
                        const isSelected = calendarYear === y;
                        return (
                          <TouchableOpacity
                            key={y}
                            style={[
                              styles.calListItem,
                              isSelected && styles.calListItemActive,
                            ]}
                            onPress={() => selectYear(y)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.calListItemText,
                                isSelected && styles.calListItemTextActive,
                              ]}
                            >
                              {y}
                            </Text>
                            {isSelected && (
                              <Ionicons
                                name="checkmark-circle"
                                size={19}
                                color="#071E42"
                              />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              </View>

              {/* FULL-WIDTH DONE BUTTON IN SOLID NAVY BLUE */}
              <TouchableOpacity
                style={styles.calDoneButton}
                onPress={handleCalendarDone}
                activeOpacity={0.85}
              >
                <Text style={styles.calDoneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : isTimePickerOpen ? (
            /* ==================================================
                SELECT TIME FRAME POPUP IN NAVY BLUE THEME
            =================================================== */
            <View style={styles.calendarModalCard}>
              {/* MODAL HEADER IN SOLID NAVY BLUE */}
              <View style={styles.calModalHeader}>
                <View>
                  <Text style={styles.calModalTitle}>Select Time Frame</Text>
                  <Text style={styles.calModalSubtitle}>Set hour, minute and AM/PM</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsTimePickerOpen(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.closeCircleBtn}
                >
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.timePickerBody}>
                {/* PREVIEW DISPLAY */}
                <View style={styles.timePreviewCard}>
                  <Text style={styles.timePreviewLabel}>SELECTED TIME FRAME</Text>
                  <View style={styles.timePreviewDigitsRow}>
                    <View style={styles.timePreviewBlock}>
                      <Text style={styles.timePreviewDigit}>{customHour}</Text>
                      <Text style={styles.timePreviewUnit}>HOUR</Text>
                    </View>
                    <Text style={styles.timePreviewColon}>:</Text>
                    <View style={styles.timePreviewBlock}>
                      <Text style={styles.timePreviewDigit}>{customMin}</Text>
                      <Text style={styles.timePreviewUnit}>MIN</Text>
                    </View>
                    <View style={styles.timePreviewPeriodBadge}>
                      <Text style={styles.timePreviewPeriodText}>{customPeriod}</Text>
                    </View>
                  </View>
                </View>

                {/* AM / PM SELECTOR */}
                <View style={styles.tpSectionWrap}>
                  <Text style={styles.tpSectionHeader}>Time Period</Text>
                  <View style={styles.ampmSelectorRow}>
                    {['AM', 'PM'].map((p) => {
                      const isActive = customPeriod === p;
                      return (
                        <TouchableOpacity
                          key={p}
                          style={[styles.ampmPill, isActive && styles.ampmPillActive]}
                          onPress={() => setCustomPeriod(p)}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name={p === 'AM' ? 'sunny-outline' : 'moon-outline'}
                            size={16}
                            color={isActive ? '#FFFFFF' : '#071E42'}
                          />
                          <Text style={[styles.ampmPillText, isActive && styles.ampmPillTextActive]}>
                            {p === 'AM' ? 'AM (Morning)' : 'PM (Afternoon / Evening)'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* HOUR SELECTOR (01 - 12) */}
                <View style={styles.tpSectionWrap}>
                  <Text style={styles.tpSectionHeader}>Hour (1 - 12)</Text>
                  <View style={styles.gridWrap}>
                    {HOURS.map((h) => {
                      const isSel = customHour === h;
                      return (
                        <TouchableOpacity
                          key={h}
                          style={[styles.tpChip, isSel && styles.tpChipActive]}
                          onPress={() => setCustomHour(h)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.tpChipText, isSel && styles.tpChipTextActive]}>
                            {h}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* MINUTE SELECTOR */}
                <View style={styles.tpSectionWrap}>
                  <Text style={styles.tpSectionHeader}>Minute (00 - 55)</Text>
                  <View style={styles.gridWrap}>
                    {MINUTES.map((m) => {
                      const isSel = customMin === m;
                      return (
                        <TouchableOpacity
                          key={m}
                          style={[styles.tpChip, isSel && styles.tpChipActive]}
                          onPress={() => setCustomMin(m)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.tpChipText, isSel && styles.tpChipTextActive]}>
                            {m}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.tpActionsRow}>
                  <TouchableOpacity
                    style={styles.tpCancelBtn}
                    onPress={() => setIsTimePickerOpen(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.tpCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tpDoneBtn}
                    onPress={handleTimeDone}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-circle" size={17} color="#FFFFFF" />
                    <Text style={styles.tpDoneBtnText}>Set Time</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            /* ==================================================
                RESCHEDULE APPOINTMENT CARD IN NAVY BLUE THEME
            =================================================== */
            <View style={styles.rescheduleModalCard}>
              {/* MODAL HEADER IN SOLID NAVY BLUE */}
              <View style={styles.modalNavyHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalNavyHeaderTitle}>
                    Reschedule Appointment
                  </Text>
                  <Text style={styles.modalNavyHeaderSubtitle}>
                    Propose a new date & time slot for patient
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.closeCircleBtn}
                >
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 18, paddingBottom: 10 }}
              >
                {/* PATIENT INFO BANNER */}
                <View style={styles.patientInfoBox}>
                  <View style={styles.patientAvatarMini}>
                    <Text style={styles.patientAvatarMiniText}>
                      {appointment?.patient ? appointment.patient.charAt(0) : 'P'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.modalPatientName}>
                      {appointment?.patient || 'Patient'}
                    </Text>
                    <Text style={styles.modalCurrentAppt}>
                      Current: {appointment?.date === 'Today' ? 'Today' : appointment?.date || 'Today'} • {appointment?.time || '10:30 AM'}
                    </Text>
                  </View>
                </View>

                {/* NEW DATE (OPENS CALENDAR POPUP) */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>New Consultation Date</Text>
                  <TouchableOpacity
                    style={styles.dateSelectorBox}
                    onPress={openCalendarPicker}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dateSelectorText}>{selectedNewDate}</Text>
                    <View style={styles.dateCalendarIconWrap}>
                      <Ionicons name="calendar" size={17} color="#071E42" />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* AVAILABLE TIME */}
                <View style={[styles.modalSection, { zIndex: isAmPmDropdownOpen ? 50 : 1 }]}>
                  <Text style={styles.modalSectionLabel}>Available Time Slots</Text>
                  <View style={styles.timeSlotsGrid}>
                    {AVAILABLE_TIMES.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.timeSlotChip,
                            isSelected && styles.timeSlotChipActive,
                          ]}
                          onPress={() => handleQuickSlotSelect(time)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.timeSlotText,
                              isSelected && styles.timeSlotTextActive,
                            ]}
                          >
                            {time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* CUSTOM TIME POPUP TRIGGER BUTTON */}
                  <TouchableOpacity
                    style={styles.customTimeTriggerCard}
                    onPress={openTimePicker}
                    activeOpacity={0.85}
                  >
                    <View style={styles.customTimeTriggerLeft}>
                      <View style={styles.customTimeIconWrap}>
                        <Ionicons name="time" size={19} color="#071E42" />
                      </View>
                      <View>
                        <Text style={styles.customTimeTriggerTitle}>Custom Time</Text>
                        <Text style={styles.customTimeTriggerSub}>Click to set hour, min & AM/PM</Text>
                      </View>
                    </View>
                    <View style={styles.customTimeValueBox}>
                      <Text style={styles.customTimeValueText}>
                        {manualTimeText ? `${manualTimeText} ${manualPeriod}` : selectedTime}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#071E42" />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* REASON FOR RESCHEDULING */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>
                    Reason for Rescheduling
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.reasonDropdownTrigger,
                      reasonError ? styles.reasonDropdownTriggerError : null,
                    ]}
                    onPress={() => {
                      setIsReasonDropdownOpen(!isReasonDropdownOpen);
                      setIsAmPmDropdownOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.reasonTriggerText,
                        !selectedReason && styles.reasonTriggerPlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {selectedReason || 'Select reason ▼'}
                    </Text>
                    <Ionicons
                      name={isReasonDropdownOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#071E42"
                    />
                  </TouchableOpacity>

                  {reasonError ? (
                    <Text style={styles.fieldErrorText}>{reasonError}</Text>
                  ) : null}

                  {isReasonDropdownOpen && (
                    <View style={styles.dropdownMenuBox}>
                      {RESCHEDULE_REASONS.map((r) => {
                        const isSelected = selectedReason === r;
                        return (
                          <TouchableOpacity
                            key={r}
                            style={[
                              styles.dropdownMenuItem,
                              isSelected && styles.dropdownMenuItemActive,
                            ]}
                            onPress={() => {
                              setSelectedReason(r);
                              setReasonError('');
                              setIsReasonDropdownOpen(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                isSelected && styles.dropdownItemTextActive,
                              ]}
                            >
                              {r}
                            </Text>
                            {isSelected && (
                              <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color="#071E42"
                              />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                {/* ADDITIONAL NOTE */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>Additional Note for Patient</Text>
                  <TextInput
                    style={styles.noteTextInput}
                    placeholder="e.g. Please arrive 15 minutes before the new consultation time"
                    placeholderTextColor={colors.textMuted}
                    value={additionalNote}
                    onChangeText={setAdditionalNote}
                  />
                </View>

                {/* FOOTER ACTIONS */}
                <View style={styles.modalFooterRow}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={onClose}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    onPress={handleConfirm}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-circle" size={17} color="#FFFFFF" />
                    <Text style={styles.modalConfirmText}>Confirm Reschedule</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingModal: {
    flex: 1,
    backgroundColor: 'rgba(5, 18, 45, 0.65)',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 9,
  },
  modalNavyHeader: {
    backgroundColor: '#071E42',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalNavyHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalNavyHeaderSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D4E2F6',
  },
  patientAvatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarMiniText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#071E42',
  },
  modalPatientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071E42',
  },
  modalCurrentAppt: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },

  modalSection: {
    marginBottom: 14,
  },
  modalSectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },

  /* Date Selector Box */
  dateSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dateSelectorText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#071E42',
  },
  dateCalendarIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Time Slots */
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  timeSlotChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeSlotChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Manual Time */
  manualTimeContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  manualTimeContainerOpen: {
    borderColor: '#071E42',
  },
  manualTimeSubLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  manualTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  manualTimeInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    height: 40,
  },
  manualTimeIcon: {
    marginRight: 6,
  },
  manualTimeTextInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#071E42',
    paddingVertical: 0,
  },
  ampmDropdownWrapper: {
    width: 80,
    position: 'relative',
  },
  ampmDropdownTrigger: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF4FC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  ampmDropdownTriggerActive: {
    borderColor: '#071E42',
  },
  ampmTriggerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#071E42',
  },
  ampmDropdownMenu: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 100,
  },
  ampmDropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ampmDropdownOptionActive: {
    backgroundColor: '#EEF4FC',
  },
  ampmOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  ampmOptionTextActive: {
    color: '#071E42',
  },

  /* Reason Dropdown */
  reasonDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  reasonDropdownTriggerError: {
    borderColor: '#EF4444',
  },
  reasonTriggerText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#071E42',
    flex: 1,
  },
  reasonTriggerPlaceholder: {
    color: '#94A3B8',
    fontWeight: '400',
  },
  fieldErrorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '600',
  },
  dropdownMenuBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    marginTop: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownMenuItemActive: {
    backgroundColor: '#EEF4FC',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  dropdownItemTextActive: {
    color: '#071E42',
    fontWeight: '700',
  },

  /* Note Input */
  noteTextInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#071E42',
  },

  /* Footer Row */
  modalFooterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    paddingTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
  modalConfirmBtn: {
    flex: 1.6,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#071E42', // Solid Navy Blue
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalConfirmText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ==================================================
      SELECT DATE CALENDAR POPUP STYLES IN NAVY BLUE
  =================================================== */
  calendarModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  calModalHeader: {
    backgroundColor: '#071E42',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calModalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calModalSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
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
    backgroundColor: '#EEF4FC',
  },
  calSideTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  calSideTabTextActive: {
    color: '#071E42',
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
    color: '#071E42',
  },
  calNavArrow: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calHintBadge: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: '#EEF4FC',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calHintText: {
    fontSize: 12,
    color: '#071E42',
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
    backgroundColor: '#071E42', // Solid Navy Blue
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
    color: '#071E42',
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
    borderColor: '#071E42',
    backgroundColor: '#EEF4FC',
  },
  calListItemText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  calListItemTextActive: {
    color: '#071E42',
    fontWeight: '800',
  },
  calDoneButton: {
    marginHorizontal: 14,
    marginBottom: 14,
    marginTop: 4,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#071E42', // Solid Navy Blue
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDoneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  /* Custom Time Trigger & Pop-up Styles */
  customTimeTriggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    padding: 12,
    marginTop: 4,
  },
  customTimeTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  customTimeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTimeTriggerTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#071E42',
  },
  customTimeTriggerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  customTimeValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  customTimeValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },
  timePickerBody: {
    padding: 16,
  },
  timePreviewCard: {
    backgroundColor: '#071E42',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  timePreviewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  timePreviewDigitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timePreviewBlock: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 54,
  },
  timePreviewDigit: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  timePreviewUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 1,
  },
  timePreviewColon: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  timePreviewPeriodBadge: {
    backgroundColor: '#00B894',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 6,
  },
  timePreviewPeriodText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  tpSectionWrap: {
    marginBottom: 14,
  },
  tpSectionHeader: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#071E42',
    marginBottom: 8,
  },
  ampmSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ampmPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  ampmPillActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  ampmPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#071E42',
  },
  ampmPillTextActive: {
    color: '#FFFFFF',
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  tpChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minWidth: 44,
    alignItems: 'center',
  },
  tpChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  tpChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  tpChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  tpActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  tpCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tpCancelBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tpDoneBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#071E42',
  },
  tpDoneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
