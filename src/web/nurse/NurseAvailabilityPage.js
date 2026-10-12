import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHomeNursing } from '../../homeNursing/context/HomeNursingContext';
import ResponseModal from '../components/ResponseModal';
import {
  AddTimingsModal,
  SelectDatePickerModal,
  AddBreakModal,
  SetHolidayModal,
  AddEmergencySlotModal,
} from '../components/AvailabilityModals';

export default function NurseAvailabilityPage() {
  const { currentStatus, setCurrentStatus } = useHomeNursing();

  // Active Channel: 'home-visits' | 'emergency-on-call'
  const [activeChannel, setActiveChannel] = useState('home-visits');

  // Selected Date state
  const [selectedDate, setSelectedDate] = useState({
    day: 5,
    month: 'October',
    year: 2026,
    formatted: '05 October 2026',
    fullFormatted: 'Mon, 05 October 2026',
  });
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Working Hours State
  const [workingHours, setWorkingHours] = useState([]);
  const [addTimingsVisible, setAddTimingsVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Breaks State
  const [breaks, setBreaks] = useState([
    { id: 'b1', title: 'Lunch break', time: '01:00 PM – 02:00 PM', startTime: '01:00 PM', endTime: '02:00 PM' },
  ]);
  const [breakModalVisible, setBreakModalVisible] = useState(false);
  const [editingBreak, setEditingBreak] = useState(null);

  // Holiday / Off Duty State
  const [isHolidayOffDuty, setIsHolidayOffDuty] = useState(false);
  const [holidayInfo, setHolidayInfo] = useState(null);
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);

  // Emergency / Extended Hours State
  const [extendedSlots, setExtendedSlots] = useState([]);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);

  // Reusable Response Confirmation Popup
  const [responseModal, setResponseModal] = useState({
    visible: false,
    title: '',
    message: '',
    details: null,
    type: 'success',
  });

  const showPopup = (title, message, details = null, type = 'success') => {
    setResponseModal({
      visible: true,
      title,
      message,
      details,
      type,
    });
  };

  // Handlers for Date Selection
  const handleDateSelected = (d) => {
    const dayStr = String(d.day).padStart(2, '0');
    setSelectedDate({
      day: d.day,
      month: d.month,
      year: d.year,
      formatted: `${dayStr} ${d.month} ${d.year}`,
      fullFormatted: `Mon, ${dayStr} ${d.month} ${d.year}`,
    });
    showPopup(
      'Schedule Date Updated',
      `Viewing home nursing availability and assignments for ${dayStr} ${d.month} ${d.year}.`,
      [`Date: ${dayStr} ${d.month} ${d.year}`, `Channel: ${activeChannel === 'home-visits' ? 'Doorstep Home Visits' : 'Emergency On-Call'}`],
      'info'
    );
  };

  // Handlers for Working Hours
  const handleOpenAddTimings = (slot = null) => {
    setEditingSlot(slot);
    setAddTimingsVisible(true);
  };

  const handleSaveTimings = (timingData) => {
    if (editingSlot) {
      setWorkingHours((prev) =>
        prev.map((s) => (s.id === editingSlot.id ? { ...s, ...timingData } : s))
      );
    } else {
      const newSlot = {
        id: `slot-${Date.now()}`,
        ...timingData,
      };
      setWorkingHours((prev) => [...prev, newSlot]);
    }

    showPopup(
      'Working Hours Saved',
      `Home nursing shift hours for ${selectedDate.formatted} updated successfully.`,
      [
        `Hours: ${timingData.formattedHours}`,
        `Duration: ${timingData.duration} mins per visit`,
        `Active: ${timingData.activeSlot ? 'Active Working Shift' : 'Shift Paused'}`,
        `Channel: ${activeChannel === 'home-visits' ? 'Home Visits' : 'Emergency On-Call'}`,
      ],
      'success'
    );
  };

  const handleDeleteSlot = (id) => {
    setWorkingHours((prev) => prev.filter((s) => s.id !== id));
    showPopup('Slot Removed', 'The shift timing slot has been removed.', null, 'info');
  };

  // Handlers for Breaks
  const handleOpenAddBreak = (brk = null) => {
    setEditingBreak(brk);
    setBreakModalVisible(true);
  };

  const handleSaveBreak = (breakData) => {
    if (editingBreak) {
      setBreaks((prev) =>
        prev.map((b) => (b.id === editingBreak.id ? { ...b, ...breakData, time: breakData.formattedHours } : b))
      );
    } else {
      const newB = {
        id: `brk-${Date.now()}`,
        ...breakData,
        time: breakData.formattedHours,
      };
      setBreaks((prev) => [...prev, newB]);
    }

    showPopup(
      'Break Saved',
      `Rest and pause schedule updated for ${selectedDate.formatted}.`,
      [`Break: ${breakData.title}`, `Timing: ${breakData.formattedHours}`],
      'success'
    );
  };

  const handleDeleteBreak = (id) => {
    setBreaks((prev) => prev.filter((b) => b.id !== id));
    showPopup('Break Deleted', 'Break interval removed from dispatch schedule.', null, 'info');
  };

  // Handlers for Holiday / Off Duty
  const handleSaveHoliday = (hData) => {
    setIsHolidayOffDuty(hData.offDutyActive);
    setHolidayInfo(hData);
    if (hData.offDutyActive) {
      setCurrentStatus('Off duty');
    } else {
      setCurrentStatus('Available');
    }
    showPopup(
      hData.offDutyActive ? 'Off Duty Schedule Set' : 'Schedule Restored to Active',
      hData.offDutyActive
        ? `Shift marked as off-duty (${hData.type}). Doorstep patient assignments will be paused for ${hData.dateRangeText || selectedDate.formatted}.`
        : `Schedule re-opened for doorstep assignments.`,
      [
        `Status: ${hData.offDutyActive ? 'Off Duty / Rest Day' : 'Open for visits'}`,
        `Duration: ${hData.dateRangeText || selectedDate.formatted}`,
        `Reason: ${hData.type}`,
      ],
      hData.offDutyActive ? 'info' : 'success'
    );
  };

  // Handlers for Emergency / Extended Slots
  const handleSaveEmergencySlot = (slotData) => {
    const newSlot = {
      id: `emg-${Date.now()}`,
      ...slotData,
    };
    setExtendedSlots((prev) => [...prev, newSlot]);
    showPopup(
      'Emergency Slot Added',
      `Urgent on-call doorstep response window opened on ${selectedDate.formatted}.`,
      [
        `Category: ${slotData.type}`,
        `Hours: ${slotData.formattedHours}`,
        `Status: ${slotData.activeSlot !== false ? 'Active' : 'Inactive'}`,
      ],
      'success'
    );
  };

  const handleDeleteEmergencySlot = (id) => {
    setExtendedSlots((prev) => prev.filter((s) => s.id !== id));
    showPopup('Extended Slot Removed', 'On-call slot cancelled.', null, 'info');
  };

  // Save Channel Master Availability
  const handleSaveMasterAvailability = () => {
    const channelName = activeChannel === 'home-visits' ? 'In-Person Home Visit' : 'Emergency On-Call';
    showPopup(
      `Availability Saved Successfully`,
      `All ${channelName} schedule settings, working shifts, breaks, and doorstep capacity have been synced live to the nursing dispatch network.`,
      [
        `Channel: ${channelName} Assignments`,
        `Selected Date: ${selectedDate.formatted}`,
        `Working Shifts: ${workingHours.length} configured`,
        `Breaks: ${breaks.length} configured`,
        `Status: ${isHolidayOffDuty ? 'Off Duty' : 'Open for Consultations'}`,
      ],
      'success'
    );
  };

  // Calculate schedule summary
  const totalCareHours = workingHours.length * 4;
  const totalBookableSlots = workingHours.reduce((acc, curr) => {
    const dur = curr.duration || 40;
    return acc + Math.floor((4 * 60) / dur);
  }, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.pageInner}>
        {/* Top Header Row: Left-aligned Header & Sub-header */}
        <View style={styles.topHeaderRow}>
          <View style={styles.headerTextCol}>
            <Text style={styles.pageTitle}>Schedule</Text>
            <Text style={styles.pageSubtitle}>Manage your doorstep nursing availability and shifts</Text>
          </View>

          <TouchableOpacity
            style={styles.saveAvailabilityMasterBtn}
            onPress={handleSaveMasterAvailability}
            activeOpacity={0.88}
          >
            <Ionicons name="save-outline" size={17} color="#FFFFFF" />
            <Text style={styles.saveAvailabilityMasterBtnText}>
              {activeChannel === 'home-visits' ? 'Save In-Person Availability' : 'Save On-Call Availability'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONSULTATION CHANNEL Header & Pills */}
        <View style={styles.channelSection}>
          <Text style={styles.channelLabel}>CONSULTATION CHANNEL</Text>
          <View style={styles.channelPillsRow}>
            {/* In-Person Tab */}
            <TouchableOpacity
              style={[
                styles.channelPill,
                activeChannel === 'home-visits' ? styles.channelPillActiveNavy : styles.channelPillInactiveMint,
              ]}
              onPress={() => setActiveChannel('home-visits')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="person-outline"
                size={16}
                color={activeChannel === 'home-visits' ? '#FFFFFF' : '#047857'}
              />
              <Text
                style={[
                  styles.channelPillText,
                  activeChannel === 'home-visits' ? styles.channelPillTextActive : styles.channelPillTextInactive,
                ]}
              >
                In-Person
              </Text>
            </TouchableOpacity>

            {/* Video Consultation / Emergency Tab */}
            <TouchableOpacity
              style={[
                styles.channelPill,
                activeChannel === 'emergency-on-call' ? styles.channelPillActiveNavy : styles.channelPillInactiveMint,
              ]}
              onPress={() => setActiveChannel('emergency-on-call')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="videocam-outline"
                size={16}
                color={activeChannel === 'emergency-on-call' ? '#FFFFFF' : '#047857'}
              />
              <Text
                style={[
                  styles.channelPillText,
                  activeChannel === 'emergency-on-call' ? styles.channelPillTextActive : styles.channelPillTextInactive,
                ]}
              >
                Video Consultation
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD 1: Date and schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeaderOnly}>
            <Text style={styles.cardTitle}>Date and schedule</Text>
            <Text style={styles.cardSubtitle}>Tap to select a single date, week, range or month</Text>
          </View>

          <TouchableOpacity
            style={styles.dateSelectorBox}
            onPress={() => setDatePickerVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.dateBoxLeft}>
              <View style={styles.calendarSquareIcon}>
                <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.dateFullSub}>{selectedDate.fullFormatted}</Text>
                <Text style={styles.dateBoldMain}>{selectedDate.formatted}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.calendarOutlinedBtn}
              onPress={() => setDatePickerVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={15} color="#081E3E" />
              <Text style={styles.calendarOutlinedBtnText}>Calendar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* CARD 2: Working hours */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View>
              <Text style={styles.cardTitle}>Working hours</Text>
              <Text style={styles.cardSubtitle}>
                {activeChannel === 'home-visits' ? 'In-Person appointment timings' : 'Video consultation timings'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.outlinedActionBtn}
              onPress={() => handleOpenAddTimings()}
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={15} color="#081E3E" />
              <Text style={styles.outlinedActionBtnText}>Add timings</Text>
            </TouchableOpacity>
          </View>

          {/* Working Hours Content: Empty State or Configured Slots */}
          {workingHours.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="time-outline" size={32} color="#CBD5E1" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No working hours configured</Text>
              <Text style={styles.emptySubtitle}>
                Tap "Add timings" to set up your consultation hours.
              </Text>
            </View>
          ) : (
            <View style={styles.configuredSlotsList}>
              {workingHours.map((slot) => (
                <View key={slot.id} style={styles.slotItemCard}>
                  <View style={styles.slotItemLeft}>
                    <View style={styles.slotIconCircle}>
                      <Ionicons name="time" size={16} color="#00B894" />
                    </View>
                    <View>
                      <Text style={styles.slotHoursText}>{slot.formattedHours}</Text>
                      <Text style={styles.slotDurationSub}>
                        {slot.duration} mins / patient · {slot.activeSlot ? 'Active Slot' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.slotItemActions}>
                    <TouchableOpacity
                      style={styles.editSlotBtn}
                      onPress={() => handleOpenAddTimings(slot)}
                    >
                      <Ionicons name="create-outline" size={15} color="#00B894" />
                      <Text style={styles.editSlotBtnText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteSlotBtn}
                      onPress={() => handleDeleteSlot(slot.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* CARD 3: Breaks */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View>
              <Text style={styles.cardTitle}>Breaks</Text>
              <Text style={styles.cardSubtitle}>Pause patient bookings during lunch or rest periods</Text>
            </View>

            <TouchableOpacity
              style={styles.outlinedActionBtn}
              onPress={() => handleOpenAddBreak()}
              activeOpacity={0.8}
            >
              <Ionicons name="cafe-outline" size={15} color="#081E3E" />
              <Text style={styles.outlinedActionBtnText}>Add break</Text>
            </TouchableOpacity>
          </View>

          {/* Breaks Content */}
          {breaks.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="cafe-outline" size={32} color="#CBD5E1" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No breaks configured</Text>
              <Text style={styles.emptySubtitle}>Tap "Add break" to pause patient appointments during meals.</Text>
            </View>
          ) : (
            <View style={styles.configuredSlotsList}>
              {breaks.map((b) => (
                <View key={b.id} style={styles.breakItemCard}>
                  <View style={styles.breakItemLeft}>
                    <View style={styles.breakIconSquare}>
                      <Ionicons name="cafe-outline" size={16} color="#64748B" />
                    </View>
                    <View>
                      <Text style={styles.breakTitleText}>{b.title}</Text>
                      <Text style={styles.breakTimeText}>{b.time}</Text>
                    </View>
                  </View>

                  <View style={styles.slotItemActions}>
                    <TouchableOpacity
                      style={styles.editSlotBtn}
                      onPress={() => handleOpenAddBreak(b)}
                    >
                      <Ionicons name="create-outline" size={15} color="#00B894" />
                      <Text style={styles.editSlotBtnText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteSlotBtn}
                      onPress={() => handleDeleteBreak(b.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* CARD 4: Holiday / Off duty */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View>
              <Text style={styles.cardTitle}>Holiday / Off duty</Text>
              <Text style={styles.cardSubtitle}>Set a single date or a date range</Text>
            </View>

            <TouchableOpacity
              style={styles.outlinedActionBtn}
              onPress={() => setHolidayModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.outlinedActionBtnText}>Set holiday</Text>
            </TouchableOpacity>
          </View>

          {/* Holiday Content */}
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name={isHolidayOffDuty ? 'umbrella-outline' : 'sunny-outline'}
              size={32}
              color={isHolidayOffDuty ? '#EF4444' : '#CBD5E1'}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>
              {isHolidayOffDuty ? `Off Duty (${holidayInfo?.type || 'Rest Day'})` : 'Open for visits'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isHolidayOffDuty
                ? `Home visits paused for ${holidayInfo?.dateRangeText || selectedDate.formatted}. Tap "Set holiday" to adjust.`
                : 'This schedule is active. Tap "Set holiday" to mark days off.'}
            </Text>
          </View>
        </View>

        {/* CARD 5: Emergency and extended hours */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View>
              <Text style={styles.cardTitle}>Emergency and extended hours</Text>
              <Text style={styles.cardSubtitle}>Add overtime or urgent on-call consultation slots</Text>
            </View>

            <TouchableOpacity
              style={styles.outlinedActionBtn}
              onPress={() => setEmergencyModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={15} color="#081E3E" />
              <Text style={styles.outlinedActionBtnText}>Add slot</Text>
            </TouchableOpacity>
          </View>

          {/* Extended Slots Content */}
          {extendedSlots.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="add-circle-outline" size={32} color="#CBD5E1" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No extended hours set</Text>
              <Text style={styles.emptySubtitle}>
                Need to extend your shift or accept emergency cases? Add an extra slot here.
              </Text>
            </View>
          ) : (
            <View style={styles.configuredSlotsList}>
              {extendedSlots.map((s) => (
                <View key={s.id} style={styles.slotItemCard}>
                  <View style={styles.slotItemLeft}>
                    <View
                      style={[
                        styles.slotIconCircle,
                        { backgroundColor: s.activeSlot !== false ? '#FEF3C7' : '#F1F5F9' },
                      ]}
                    >
                      <Ionicons
                        name="flash"
                        size={16}
                        color={s.activeSlot !== false ? '#D97706' : '#94A3B8'}
                      />
                    </View>
                    <View>
                      <Text style={styles.slotHoursText}>{s.formattedHours}</Text>
                      <Text style={styles.slotDurationSub}>
                        {s.type} · {s.activeSlot !== false ? 'Active Slot' : 'Paused Slot'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteSlotBtn}
                    onPress={() => handleDeleteEmergencySlot(s.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* =========================================================================
          POP-UP MODALS WIRED TO BUTTONS
          ========================================================================= */}
      {/* 1. Date Calendar Picker Pop-up Modal */}
      <SelectDatePickerModal
        visible={datePickerVisible}
        initialDate={selectedDate.day}
        initialMonth={selectedDate.month}
        initialYear={selectedDate.year}
        onClose={() => setDatePickerVisible(false)}
        onSelectDate={handleDateSelected}
      />

      {/* 2. Add Timings Pop-up Modal */}
      <AddTimingsModal
        visible={addTimingsVisible}
        initialStartTime={editingSlot?.startTime || '08:00 AM'}
        initialEndTime={editingSlot?.endTime || '04:00 PM'}
        initialDuration={editingSlot?.duration || 40}
        initialActiveSlot={editingSlot ? editingSlot.activeSlot : true}
        onClose={() => {
          setAddTimingsVisible(false);
          setEditingSlot(null);
        }}
        onSave={handleSaveTimings}
      />

      {/* 3. Add / Edit Break Pop-up Modal */}
      <AddBreakModal
        visible={breakModalVisible}
        initialTitle={editingBreak?.title || 'Lunch break'}
        initialStartTime={editingBreak?.startTime || '01:00 PM'}
        initialEndTime={editingBreak?.endTime || '02:00 PM'}
        onClose={() => {
          setBreakModalVisible(false);
          setEditingBreak(null);
        }}
        onSave={handleSaveBreak}
      />

      {/* 4. Set Holiday / Off Duty Pop-up Modal */}
      <SetHolidayModal
        visible={holidayModalVisible}
        currentDate={selectedDate.formatted}
        onClose={() => setHolidayModalVisible(false)}
        onSave={handleSaveHoliday}
      />

      {/* 5. Add Emergency / Extended Slot Pop-up Modal */}
      <AddEmergencySlotModal
        visible={emergencyModalVisible}
        onClose={() => setEmergencyModalVisible(false)}
        onSave={handleSaveEmergencySlot}
      />

      {/* 6. Response Screen Modal with OK button */}
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
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignItems: 'stretch',
    width: '100%',
  },
  pageInner: {
    width: '100%',
    alignSelf: 'stretch',
    gap: 16,
  },

  // Top Header Row
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  saveAvailabilityMasterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00B894',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveAvailabilityMasterBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Consultation Channel Section
  channelSection: {
    marginBottom: 20,
  },
  channelLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  channelPillsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  channelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 8,
  },
  channelPillActiveNavy: {
    backgroundColor: '#081E3E',
  },
  channelPillInactiveMint: {
    backgroundColor: '#E8F8F5',
  },
  channelPillText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  channelPillTextActive: {
    color: '#FFFFFF',
  },
  channelPillTextInactive: {
    color: '#047857',
  },

  // Common Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 22,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderOnly: {
    marginBottom: 16,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // Outlined Action Button
  outlinedActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  outlinedActionBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#081E3E',
  },

  // Card 1: Date and Schedule Box
  dateSelectorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#D0E3F8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarSquareIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateFullSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  dateBoldMain: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  calendarOutlinedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  calendarOutlinedBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#081E3E',
  },

  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },

  // Configured Slots List
  configuredSlotsList: {
    gap: 10,
  },
  slotItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  slotItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slotIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotHoursText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  slotDurationSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  slotItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editSlotBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#00B894',
  },
  deleteSlotBtn: {
    padding: 6,
  },

  // Break Item
  breakItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  breakItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakIconSquare: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#081E3E',
  },
  breakTimeText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },

  // CARD 4: Deep Navy Summary Banner
  summaryNavyBanner: {
    backgroundColor: '#081E3E',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryBannerTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 12,
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    gap: 48,
  },
  summaryMetricCol: {
    gap: 4,
  },
  summaryMetricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  summaryMetricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00B894',
  },
});
