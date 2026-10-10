import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doctor } from '../../data/mockData';

export default function DoctorSchedulePage() {
  const [fee, setFee] = useState(String(doctor.fee || 500));
  const [clinicName, setClinicName] = useState(doctor.clinic || 'Unify Health Clinic');
  const [clinicAddress, setClinicAddress] = useState(doctor.clinicAddress || '4th Block, Indiranagar, Bengaluru');

  const [schedule, setSchedule] = useState([
    { day: 'Monday', morning: true, afternoon: true, evening: false },
    { day: 'Tuesday', morning: true, afternoon: true, evening: true },
    { day: 'Wednesday', morning: true, afternoon: true, evening: false },
    { day: 'Thursday', morning: true, afternoon: false, evening: true },
    { day: 'Friday', morning: true, afternoon: true, evening: true },
    { day: 'Saturday', morning: true, afternoon: false, evening: false },
    { day: 'Sunday', morning: false, afternoon: false, evening: false },
  ]);

  const [saveAlert, setSaveAlert] = useState(false);

  const toggleSlot = (index, slot) => {
    const updated = [...schedule];
    updated[index][slot] = !updated[index][slot];
    setSchedule(updated);
  };

  const handleSave = () => {
    doctor.fee = Number(fee) || 500;
    doctor.clinic = clinicName;
    doctor.clinicAddress = clinicAddress;
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Doctor Availability & Practice Schedule</Text>
          <Text style={styles.pageSub}>Configure your consultation hours, slot availability, and clinic fees</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name="save" size={16} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>{saveAlert ? 'Saved Successfully!' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </View>

      {/* Clinic & Fee Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>CLINIC & CONSULTATION SETTINGS</Text>
        <View style={styles.formRow}>
          <View style={[styles.fieldCol, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Consultation Fee (₹ per session)</Text>
            <View style={styles.inputWithIcon}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.textInputNoPad}
                value={fee}
                onChangeText={setFee}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={[styles.fieldCol, { flex: 1.5 }]}>
            <Text style={styles.fieldLabel}>Primary Clinic / Hospital Name</Text>
            <TextInput
              style={styles.textInput}
              value={clinicName}
              onChangeText={setClinicName}
            />
          </View>

          <View style={[styles.fieldCol, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>Clinic Location / Address</Text>
            <TextInput
              style={styles.textInput}
              value={clinicAddress}
              onChangeText={setClinicAddress}
            />
          </View>
        </View>
      </View>

      {/* Weekly Matrix Schedule */}
      <View style={styles.card}>
        <View style={styles.cardHeaderBetween}>
          <View>
            <Text style={styles.cardHeading}>WEEKLY TIME SLOT MATRIX</Text>
            <Text style={styles.cardSub}>Toggle individual sessions for each day of the week</Text>
          </View>
          <View style={styles.slotLegend}>
            <Text style={styles.legendItem}>☀️ Morning: 09:00 AM – 01:00 PM</Text>
            <Text style={styles.legendItem}>🌤️ Afternoon: 02:00 PM – 05:00 PM</Text>
            <Text style={styles.legendItem}>🌙 Evening: 06:00 PM – 09:00 PM</Text>
          </View>
        </View>

        <View style={styles.scheduleTable}>
          <View style={styles.scheduleThRow}>
            <Text style={[styles.scheduleTh, { flex: 1.5 }]}>DAY OF WEEK</Text>
            <Text style={[styles.scheduleTh, { flex: 1.2, textAlign: 'center' }]}>MORNING</Text>
            <Text style={[styles.scheduleTh, { flex: 1.2, textAlign: 'center' }]}>AFTERNOON</Text>
            <Text style={[styles.scheduleTh, { flex: 1.2, textAlign: 'center' }]}>EVENING</Text>
            <Text style={[styles.scheduleTh, { flex: 1.5, textAlign: 'right' }]}>PATIENT STATUS</Text>
          </View>

          {schedule.map((row, idx) => {
            const activeSlots = [row.morning, row.afternoon, row.evening].filter(Boolean).length;
            const isDayOff = activeSlots === 0;

            return (
              <View key={row.day} style={[styles.scheduleRow, idx % 2 === 1 && styles.scheduleRowAlt]}>
                <View style={[styles.dayCol, { flex: 1.5 }]}>
                  <Text style={[styles.dayText, isDayOff && styles.dayTextOff]}>{row.day}</Text>
                  {isDayOff && <Text style={styles.offBadge}>CLINIC CLOSED</Text>}
                </View>

                {/* Morning Slot Toggle */}
                <View style={{ flex: 1.2, alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.slotToggleBtn, row.morning && styles.slotToggleActive]}
                    onPress={() => toggleSlot(idx, 'morning')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={row.morning ? 'checkmark-circle' : 'close-circle-outline'}
                      size={14}
                      color={row.morning ? '#00B894' : '#94A3B8'}
                    />
                    <Text style={[styles.slotToggleText, row.morning && styles.slotToggleTextActive]}>
                      {row.morning ? '09:00 - 13:00' : 'Off'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Afternoon Slot Toggle */}
                <View style={{ flex: 1.2, alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.slotToggleBtn, row.afternoon && styles.slotToggleActive]}
                    onPress={() => toggleSlot(idx, 'afternoon')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={row.afternoon ? 'checkmark-circle' : 'close-circle-outline'}
                      size={14}
                      color={row.afternoon ? '#00B894' : '#94A3B8'}
                    />
                    <Text style={[styles.slotToggleText, row.afternoon && styles.slotToggleTextActive]}>
                      {row.afternoon ? '14:00 - 17:00' : 'Off'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Evening Slot Toggle */}
                <View style={{ flex: 1.2, alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.slotToggleBtn, row.evening && styles.slotToggleActive]}
                    onPress={() => toggleSlot(idx, 'evening')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={row.evening ? 'checkmark-circle' : 'close-circle-outline'}
                      size={14}
                      color={row.evening ? '#00B894' : '#94A3B8'}
                    />
                    <Text style={[styles.slotToggleText, row.evening && styles.slotToggleTextActive]}>
                      {row.evening ? '18:00 - 21:00' : 'Off'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Summary Status */}
                <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                  <View style={[styles.summaryPill, isDayOff ? styles.pillClosed : styles.pillOpen]}>
                    <Text style={[styles.summaryPillText, isDayOff ? styles.textClosed : styles.textOpen]}>
                      {isDayOff ? 'Unavailable' : `${activeSlots * 3}h Available`}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    gap: 20,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pageSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 16,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  cardHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotLegend: {
    flexDirection: 'row',
    gap: 14,
  },
  legendItem: {
    fontSize: 11,
    color: '#64748B',
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  fieldCol: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00B894',
    marginRight: 6,
  },
  textInputNoPad: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    outlineStyle: 'none',
  },
  textInput: {
    height: 40,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  scheduleTable: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scheduleThRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scheduleTh: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scheduleRowAlt: {
    backgroundColor: '#FAFCFE',
  },
  dayCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  dayTextOff: {
    color: '#94A3B8',
  },
  offBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    fontSize: 8,
    color: '#DC2626',
    fontWeight: '800',
  },
  slotToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  slotToggleActive: {
    backgroundColor: '#E8F8F5',
    borderColor: '#A7F3D0',
  },
  slotToggleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  slotToggleTextActive: {
    color: '#00B894',
    fontWeight: '700',
  },
  summaryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillOpen: {
    backgroundColor: '#E0F2FE',
  },
  pillClosed: {
    backgroundColor: '#F1F5F9',
  },
  summaryPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textOpen: {
    color: '#0284C7',
  },
  textClosed: {
    color: '#94A3B8',
  },
});
