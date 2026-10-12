import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import Card from '../components/Card';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, spacing, typography, radius } from '../theme/colors';
import { patients } from '../data/mockData';

let uid = 0;

const TIME_SLOTS = [
  { key: 'morning', label: 'Morning', icon: 'sunny-outline', defaultFood: 'after' },
  { key: 'afternoon', label: 'Afternoon', icon: 'partly-sunny-outline', defaultFood: 'after' },
  { key: 'night', label: 'Night', icon: 'moon-outline', defaultFood: 'after' },
];

export const MEDICINE_TYPES = [
  { key: 'Tablet', label: 'Tablet', icon: 'tablet-portrait-outline' },
  { key: 'Capsule', label: 'Capsule', icon: 'medical-outline' },
  { key: 'Syrup', label: 'Syrup', icon: 'flask-outline' },
  { key: 'Injection', label: 'Injection', icon: 'eyedrop-outline' },
  { key: 'Drops', label: 'Drops', icon: 'water-outline' },
  { key: 'Ointment', label: 'Ointment', icon: 'bandage-outline' },
];

const newMedicine = (defaultType = 'Tablet') => ({
  id: `m${++uid}`,
  name: '',
  type: defaultType,
  duration: '',
  instructions: '',
  schedule: {
    morning: { status: 'ON', timing: 'after' },
    afternoon: { status: 'OFF', timing: 'after' },
    night: { status: 'ON', timing: 'after' },
  },
});

// Check if two medicine schedules have the exact same timing slots & before/after food choices
const isScheduleSame = (sched1, sched2) => {
  if (!sched1 || !sched2) return false;
  return ['morning', 'afternoon', 'night'].every((slot) => {
    const s1 = sched1[slot] || {};
    const s2 = sched2[slot] || {};
    const on1 = s1.status === 'ON' || s1.tablet === '1' || s1.tablet === '0.5' || s1.tablet === '2';
    const on2 = s2.status === 'ON' || s2.tablet === '1' || s2.tablet === '0.5' || s2.tablet === '2';
    if (on1 !== on2) return false;
    if (on1) {
      return (s1.timing || 'after') === (s2.timing || 'after');
    }
    return true;
  });
};

// Summary string of active timings for display (e.g. "Morning (After food) • Afternoon (After food)")
const getScheduleSummaryText = (sched) => {
  const parts = [];
  ['morning', 'afternoon', 'night'].forEach((slot) => {
    const s = sched?.[slot];
    const isOn = s?.status === 'ON' || s?.tablet === '1' || s?.tablet === '0.5' || s?.tablet === '2';
    if (isOn) {
      const cap = slot.charAt(0).toUpperCase() + slot.slice(1);
      const food = s.timing === 'before' ? 'Before food' : 'After food';
      parts.push(`${cap} (${food})`);
    }
  });
  return parts.length > 0 ? parts.join('  •  ') : 'All timings OFF';
};

// Find the earlier medicine with the exact same medical type (e.g. earlier Tablet)
const getMatchingPreviousMedicine = (currentMed, allMeds, currentIndex) => {
  if (currentIndex === 0) return null;
  const currentType = currentMed.type || 'Tablet';
  const earlierMeds = allMeds.slice(0, currentIndex);
  const matchIndex = earlierMeds.findIndex((m) => (m.type || 'Tablet') === currentType);
  if (matchIndex === -1) return null;
  return {
    med: earlierMeds[matchIndex],
    index: matchIndex,
  };
};

export default function PrescriptionScreen({ route, navigation }) {
  const { patientId: initialPatientId } = route.params || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(
    initialPatientId || patients[0]?.id || 'p1'
  );

  const [medicines, setMedicines] = useState([newMedicine('Tablet')]);

  // Filter patients by search query (name, blood group, age, gender, condition)
  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.gender.toLowerCase().includes(q) ||
      p.bloodGroup.toLowerCase().includes(q) ||
      String(p.age).includes(q) ||
      (p.conditions && p.conditions.some((c) => c.toLowerCase().includes(q)))
    );
  });

  const patient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const updateMed = (id, key, val) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, [key]: val }
          : m
      )
    );
  };

  const updateMedSchedule = (medId, slot, key, val) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medId
          ? {
            ...m,
            schedule: {
              ...m.schedule,
              [slot]: {
                ...m.schedule[slot],
                [key]: val,
              },
            },
          }
          : m
      )
    );
  };

  // Copy and apply the exact schedule from the matching earlier medicine
  const applySameSchedule = (medId, sourceMed) => {
    if (!sourceMed || !sourceMed.schedule) return;
    const cloned = JSON.parse(JSON.stringify(sourceMed.schedule));
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medId
          ? {
            ...m,
            schedule: cloned,
          }
          : m
      )
    );
  };

  // Toggle same schedule (apply or toggle off) like permanent/current address checkbox
  const toggleSameSchedule = (medId, sourceMed) => {
    if (!sourceMed || !sourceMed.schedule) return;
    const target = medicines.find((m) => m.id === medId);
    const isSame = isScheduleSame(target?.schedule, sourceMed.schedule);
    if (isSame) {
      // Toggle to all OFF so user can customize freely
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === medId
            ? {
              ...m,
              schedule: {
                morning: { status: 'OFF', timing: 'after' },
                afternoon: { status: 'OFF', timing: 'after' },
                night: { status: 'OFF', timing: 'after' },
              },
            }
            : m
        )
      );
    } else {
      applySameSchedule(medId, sourceMed);
    }
  };

  const addMedicine = () => {
    const lastMed = medicines[medicines.length - 1];
    const prevType = lastMed ? lastMed.type || 'Tablet' : 'Tablet';
    setMedicines((prev) => [...prev, newMedicine(prevType)]);
  };

  const removeMedicine = (id) => {
    setMedicines((prev) =>
      prev.length > 1 ? prev.filter((m) => m.id !== id) : prev
    );
  };

  const formatMedicineSchedule = (med) => {
    const parts = [];
    const tagParts = [];
    const typeName = med.type || 'Tablet';

    ['morning', 'afternoon', 'night'].forEach((slot) => {
      const s = med.schedule?.[slot];
      const isOn =
        s?.status === 'ON' ||
        s?.tablet === '1' ||
        s?.tablet === '0.5' ||
        s?.tablet === '2';
      if (isOn) {
        const capSlot = slot.charAt(0).toUpperCase() + slot.slice(1);
        const foodText = s.timing === 'before' ? 'Before food' : 'After food';
        parts.push(`${capSlot}: ${typeName} (${foodText})`);
        tagParts.push('ON');
      } else {
        tagParts.push('OFF');
      }
    });

    return {
      breakdown: parts.length > 0 ? parts.join('  •  ') : `No ${typeName.toLowerCase()}s scheduled`,
      regimenTag: tagParts.join(' - '),
      hasDose: parts.length > 0,
    };
  };

  const handleSave = () => {
    const validMeds = medicines.filter((m) => m.name.trim().length > 0);
    if (validMeds.length === 0) {
      Alert.alert('Incomplete Prescription', 'Please enter at least one medicine name.');
      return;
    }

    const summary = validMeds
      .map((m, i) => {
        const sched = formatMedicineSchedule(m);
        return `${i + 1}. [${m.type || 'Tablet'}] ${m.name}\n   Timing: ${sched.breakdown}${m.duration ? ` · Duration: ${m.duration}` : ''
          }${m.instructions ? `\n   Note: ${m.instructions}` : ''}`;
      })
      .join('\n\n');

    Alert.alert(
      'Prescription Generated',
      `Prescription created for ${patient.name}:\n\n${summary}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* ======================================================
          DARK NAVY HEADER (MATCHING APPOINTMENTS & USER THEME)
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

        {/* NAVIGATION ROW: (←) Prescription */}
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

          <View style={styles.titleContainer}>
            <Text style={styles.screenMainTitle}>Prescription</Text>
            {patient?.name && <Text style={styles.screenSubTitle}>{patient.name}</Text>}
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
        {/* ====================================================
            1. PATIENT SEARCH & SELECTION SECTION
        ==================================================== */}
        <View style={styles.sectionHeaderWrap}>
          <Text style={styles.sectionTitle}>Select Patient</Text>
          <Text style={styles.sectionSubtitle}>
            Search and select a patient to prescribe medicines
          </Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patient by name, blood group, age..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* PATIENT SELECTION CHIPS */}
        {filteredPatients.length === 0 ? (
          <View style={styles.noMatchBox}>
            <Ionicons name="person-outline" size={24} color={colors.textMuted} />
            <Text style={styles.noMatchText}>
              No patient found matching "{searchQuery}"
            </Text>
            <TouchableOpacity
              style={styles.clearSearchBtn}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearSearchBtnText}>Clear Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.patientChipRow}
          >
            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.patientChip,
                    isSelected && styles.patientChipActive,
                  ]}
                  onPress={() => setSelectedPatientId(p.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.chipAvatar,
                      isSelected && styles.chipAvatarActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipAvatarText,
                        isSelected && styles.chipAvatarTextActive,
                      ]}
                    >
                      {p.name.charAt(0)}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.patientChipName,
                        isSelected && styles.patientChipNameActive,
                      ]}
                    >
                      {p.name}
                    </Text>
                    <Text
                      style={[
                        styles.patientChipMeta,
                        isSelected && styles.patientChipMetaActive,
                      ]}
                    >
                      {p.age} yrs · {p.bloodGroup}
                    </Text>
                  </View>

                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.white}
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* SELECTED PATIENT SUMMARY BANNER */}
        {patient && (
          <View style={styles.selectedPatientCard}>
            <View style={styles.patientCardLeft}>
              <View style={styles.patientAvatarLarge}>
                <Text style={styles.patientAvatarTextLarge}>
                  {patient.name.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.selectedPatientName}>{patient.name}</Text>
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>Selected</Text>
                  </View>
                </View>
                <Text style={styles.selectedPatientDetails}>
                  {patient.age} yrs · {patient.gender} · Blood: {patient.bloodGroup} · Last visit: {patient.lastVisit || 'N/A'}
                </Text>
                {patient.allergies && patient.allergies.length > 0 && patient.allergies[0] !== 'None known' ? (
                  <Text style={styles.allergyWarning}>
                    ⚠️ Allergies: {patient.allergies.join(', ')}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        )}

        {/* ====================================================
            2. MEDICINES SECTION WITH MORNING/AFTERNOON/NIGHT
        ==================================================== */}
        <View style={[styles.sectionHeaderWrap, { marginTop: spacing.xl }]}>
          <Text style={styles.sectionTitle}>Prescribed Medicines</Text>
          <Text style={styles.sectionSubtitle}>
            Set tablet doses and food timings for Morning, Afternoon, and Night
          </Text>
        </View>

        {medicines.map((med, idx) => {
          const matchInfo = getMatchingPreviousMedicine(med, medicines, idx);
          const isSameSchedule = matchInfo ? isScheduleSame(med.schedule, matchInfo.med.schedule) : false;
          const matchInfoSummary = matchInfo ? getScheduleSummaryText(matchInfo.med.schedule) : '';
          const currentTypeName = med.type || 'Tablet';

          return (
            <Card key={med.id} style={styles.medCard}>
              {/* CARD HEADER */}
              <View style={styles.medHeader}>
                <View style={styles.medIndexWrap}>
                  <View style={styles.medIconBadge}>
                    <Ionicons name="medical" size={14} color={colors.primary} />
                  </View>
                  <Text style={styles.medIndex}>Medicine #{idx + 1}</Text>
                  <View style={styles.medTypeHeaderBadge}>
                    <Text style={styles.medTypeHeaderBadgeText}>{currentTypeName}</Text>
                  </View>
                </View>

                {medicines.length > 1 ? (
                  <TouchableOpacity
                    onPress={() => removeMedicine(med.id)}
                    style={styles.removeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={colors.danger || '#DC2626'}
                    />
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* MEDICAL TYPE SELECTOR */}
              <View style={styles.typeSection}>
                <View style={styles.typeHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="flask-outline" size={14} color={colors.primary} />
                    <Text style={styles.typeLabel}>Medical Type</Text>
                  </View>
                  <Text style={styles.typeHelper}>Select medicine form</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.typeChipsRow}
                >
                  {MEDICINE_TYPES.map((t) => {
                    const isSelected = currentTypeName === t.key;
                    return (
                      <TouchableOpacity
                        key={t.key}
                        style={[
                          styles.typeChip,
                          isSelected && styles.typeChipActive,
                        ]}
                        onPress={() => updateMed(med.id, 'type', t.key)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={t.icon}
                          size={14}
                          color={isSelected ? colors.white : colors.textSecondary}
                          style={{ marginRight: 5 }}
                        />
                        <Text
                          style={[
                            styles.typeChipText,
                            isSelected && styles.typeChipTextActive,
                          ]}
                        >
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* MEDICINE NAME */}
              <AppInput
                label="Medicine Name & Strength"
                placeholder={
                  currentTypeName === 'Syrup'
                    ? 'Ex: Benadryl Cough Syrup 100ml'
                    : currentTypeName === 'Injection'
                      ? 'EX: Inj Paracetamol 2ml IV'
                      : currentTypeName === 'Drops'
                        ? 'EX: Ciprofloxacin Eye Drops 5ml'
                        : 'EX: Paracetamol 500mg'
                }
                icon="medical-outline"
                value={med.name}
                onChangeText={(v) => updateMed(med.id, 'name', v)}
                style={{ marginBottom: spacing.md }}
                borderColor={colors.primary}
              />

              {/* DURATION */}
              <AppInput
                label="Duration"
                placeholder="EX: 5 days, 1 week, 10 days"
                icon="calendar-outline"
                value={med.duration}
                onChangeText={(v) => updateMed(med.id, 'duration', v)}
                style={{ marginBottom: spacing.md }}
                borderColor={colors.primary}
              />

              {/* SAME TIMINGS AS EARLIER MEDICINE (IF MEDICAL TYPE MATCHES) */}
              {matchInfo ? (
                <View
                  style={[
                    styles.applySameCard,
                    isSameSchedule && styles.applySameCardActive,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.applySameHeaderRow}
                    onPress={() => toggleSameSchedule(med.id, matchInfo.med)}
                    activeOpacity={0.75}
                  >
                    {/* Checkbox (Permanent & Current Address style) */}
                    <View
                      style={[
                        styles.sameCheckbox,
                        isSameSchedule && styles.sameCheckboxActive,
                      ]}
                    >
                      <Ionicons
                        name={isSameSchedule ? 'checkmark' : 'square-outline'}
                        size={isSameSchedule ? 15 : 18}
                        color={isSameSchedule ? colors.white : colors.textMuted}
                      />
                    </View>

                    <View style={styles.applySameTextCol}>
                      <View style={styles.applySameTitleLine}>
                        <Text
                          style={[
                            styles.applySameTitle,
                            isSameSchedule && styles.applySameTitleActive,
                          ]}
                        >
                          Same timings as Medicine {matchInfo.index + 1} ({currentTypeName})
                        </Text>
                        {isSameSchedule && (
                          <View style={styles.sameSyncedPill}>
                            <Ionicons
                              name="checkmark-circle"
                              size={11}
                              color={colors.primary}
                            />
                            <Text style={styles.sameSyncedPillText}>Applied</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.applySameSubtitle}>
                        {matchInfoSummary}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.applySameActionBtn,
                        isSameSchedule && styles.applySameActionBtnActive,
                      ]}
                      onPress={() => applySameSchedule(med.id, matchInfo.med)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isSameSchedule ? 'checkmark-done' : 'copy-outline'}
                        size={13}
                        color={isSameSchedule ? colors.primary : colors.white}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.applySameActionBtnText,
                          isSameSchedule && styles.applySameActionBtnTextActive,
                        ]}
                      >
                        {isSameSchedule ? 'Applied' : 'Apply Same'}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* DOSAGE SCHEDULE (MORNING, AFTERNOON, NIGHT) */}
              <View style={styles.scheduleBox}>
                <View style={styles.scheduleHeaderRow}>
                  <Ionicons name="time-outline" size={16} color={colors.primary} />
                  <Text style={styles.scheduleSectionTitle}>
                    Daily {currentTypeName} Schedule & Food Timing
                  </Text>
                </View>
                <Text style={styles.scheduleHelperText}>
                  {/* Set ON or OFF for each time of day, and choose food timing */}
                </Text>

                {/* THREE TIME SLOTS: MORNING, AFTERNOON, NIGHT */}
                {TIME_SLOTS.map((slot) => {
                  const slotData = med.schedule?.[slot.key] || {
                    status: 'OFF',
                    timing: 'after',
                  };
                  const isOn =
                    slotData.status === 'ON' ||
                    slotData.tablet === '1' ||
                    slotData.tablet === '0.5' ||
                    slotData.tablet === '2';

                  return (
                    <View key={slot.key} style={styles.slotRowCard}>
                      {/* SLOT TITLE & BADGE */}
                      <View style={styles.slotHeaderRow}>
                        <View style={styles.slotTitleLeft}>
                          <Ionicons
                            name={slot.icon}
                            size={18}
                            color={isOn ? colors.primary : colors.textSecondary}
                          />
                          <Text
                            style={[
                              styles.slotTitleText,
                              isOn && styles.slotTitleTextActive,
                            ]}
                          >
                            {slot.label}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.slotStatusBadge,
                            isOn
                              ? styles.slotStatusBadgeActive
                              : styles.slotStatusBadgeInactive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotStatusBadgeText,
                              isOn && styles.slotStatusBadgeTextActive,
                            ]}
                          >
                            {isOn
                              ? `${currentTypeName} ON · ${slotData.timing === 'before' ? 'Before Food' : 'After Food'
                              }`
                              : `${currentTypeName} OFF`}
                          </Text>
                        </View>
                      </View>

                      {/* OPTION: ON / OFF */}
                      <View style={styles.tabletSelectorRow}>
                        <Text style={styles.controlSubLabel}>{currentTypeName} Option:</Text>
                        <View style={styles.toggleGroup}>
                          {/* ON BUTTON */}
                          <TouchableOpacity
                            style={[
                              styles.toggleBtn,
                              isOn && styles.toggleBtnOnActive,
                            ]}
                            onPress={() =>
                              updateMedSchedule(
                                med.id,
                                slot.key,
                                'status',
                                'ON'
                              )
                            }
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={isOn ? 'checkmark-circle' : 'checkmark-circle-outline'}
                              size={15}
                              color={isOn ? colors.white : colors.textSecondary}
                            />
                            <Text
                              style={[
                                styles.toggleBtnText,
                                isOn && styles.toggleBtnTextActive,
                              ]}
                            >
                              ON
                            </Text>
                          </TouchableOpacity>

                          {/* OFF BUTTON */}
                          <TouchableOpacity
                            style={[
                              styles.toggleBtn,
                              !isOn && styles.toggleBtnOffActive,
                            ]}
                            onPress={() =>
                              updateMedSchedule(
                                med.id,
                                slot.key,
                                'status',
                                'OFF'
                              )
                            }
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={!isOn ? 'close-circle' : 'close-circle-outline'}
                              size={15}
                              color={!isOn ? colors.white : colors.textSecondary}
                            />
                            <Text
                              style={[
                                styles.toggleBtnText,
                                !isOn && styles.toggleBtnTextActive,
                              ]}
                            >
                              OFF
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* AFTER FOOD / BEFORE FOOD OPTION FOR THIS SLOT */}
                      <View style={styles.foodSelectorRow}>
                        <Text style={styles.controlSubLabel}>Food Timing:</Text>
                        <View style={styles.foodGroup}>
                          {/* BEFORE FOOD */}
                          <TouchableOpacity
                            style={[
                              styles.foodChoiceBtn,
                              slotData.timing === 'before' &&
                              isOn &&
                              styles.foodChoiceBtnActive,
                              !isOn && styles.foodChoiceBtnDisabled,
                            ]}
                            onPress={() =>
                              updateMedSchedule(
                                med.id,
                                slot.key,
                                'timing',
                                'before'
                              )
                            }
                            activeOpacity={0.7}
                            disabled={!isOn}
                          >
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color={
                                slotData.timing === 'before' && isOn
                                  ? colors.white
                                  : colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                styles.foodChoiceText,
                                slotData.timing === 'before' &&
                                isOn &&
                                styles.foodChoiceTextActive,
                              ]}
                            >
                              Before Food
                            </Text>
                          </TouchableOpacity>

                          {/* AFTER FOOD */}
                          <TouchableOpacity
                            style={[
                              styles.foodChoiceBtn,
                              slotData.timing === 'after' &&
                              isOn &&
                              styles.foodChoiceBtnActive,
                              !isOn && styles.foodChoiceBtnDisabled,
                            ]}
                            onPress={() =>
                              updateMedSchedule(
                                med.id,
                                slot.key,
                                'timing',
                                'after'
                              )
                            }
                            activeOpacity={0.7}
                            disabled={!isOn}
                          >
                            <Ionicons
                              name="restaurant-outline"
                              size={14}
                              color={
                                slotData.timing === 'after' && isOn
                                  ? colors.white
                                  : colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                styles.foodChoiceText,
                                slotData.timing === 'after' &&
                                isOn &&
                                styles.foodChoiceTextActive,
                              ]}
                            >
                              After Food
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* SPECIAL INSTRUCTIONS */}
              <AppInput
                label="Special Instructions (Optional)"
                placeholder="EX: Take with warm water, avoid dairy"
                value={med.instructions}
                onChangeText={(v) => updateMed(med.id, 'instructions', v)}
                style={{ marginTop: spacing.md, marginBottom: 0 }}
                borderColor={colors.primary}
              />
            </Card>
          );
        })}

        {/* ADD MEDICINE BUTTON */}
        <AppButton
          title="Add Another Medicine"
          variant="ghost"
          icon="add-circle-outline"
          onPress={addMedicine}
          textColor="#071E42"
          style={{
            marginBottom: spacing.xl,
            borderColor: '#071E42',
            borderWidth: 1.5,
          }}
        />

        {/* ====================================================
            3. PRESCRIPTION PREVIEW
        ==================================================== */}
        <View style={styles.sectionHeaderWrap}>
          <Text style={styles.sectionTitle}>Prescription Preview</Text>
          <Text style={styles.sectionSubtitle}>
            Summary for {patient.name}
          </Text>
        </View>

        <Card style={styles.previewCard}>
          {medicines.filter((m) => m.name.trim()).length === 0 ? (
            <View style={styles.previewEmptyWrap}>
              <Ionicons
                name="document-text-outline"
                size={28}
                color={colors.textMuted}
              />
              <Text style={styles.previewEmpty}>
                Enter medicine names above to see an instant clinical preview
              </Text>
            </View>
          ) : (
            medicines
              .filter((m) => m.name.trim())
              .map((m, i) => {
                const sched = formatMedicineSchedule(m);
                return (
                  <View
                    key={m.id}
                    style={[
                      styles.previewRow,
                      i > 0 && styles.previewRowBorder,
                    ]}
                  >
                    <View style={styles.previewNumCircle}>
                      <Text style={styles.previewNumText}>{i + 1}</Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={styles.previewTitleRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                          <Text style={styles.previewName}>{m.name}</Text>
                          <View style={styles.previewTypeBadge}>
                            <Text style={styles.previewTypeBadgeText}>{m.type || 'Tablet'}</Text>
                          </View>
                        </View>
                        {sched.hasDose && (
                          <View style={styles.regimenPill}>
                            <Text style={styles.regimenPillText}>
                              {sched.regimenTag}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.previewSchedule}>
                        {sched.breakdown}
                      </Text>

                      {m.duration ? (
                        <Text style={styles.previewDuration}>
                          Duration: {m.duration}
                        </Text>
                      ) : null}

                      {m.instructions ? (
                        <Text style={styles.previewNote}>
                          Note: {m.instructions}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })
          )}
        </Card>

        {/* ACTION BUTTONS */}
        <View style={styles.actionButtonsRow}>
          <AppButton
            title="Save Draft"
            variant="outline"
            textColor="#071E42"
            onPress={() =>
              Alert.alert(
                'Draft Saved',
                `Prescription draft saved for ${patient.name}.`
              )
            }
            style={{ flex: 1, borderColor: '#071E42' }}
          />

          <TouchableOpacity
            style={styles.generateBtn}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Ionicons name="share-social-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.generateBtnText}>Generate & Share</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ==========================================================
     DARK NAVY HEADER (MATCHING APPOINTMENTS & USER THEME)
  ========================================================== */
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
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  screenMainTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  screenSubTitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },

  /* SECTION HEADER */
  sectionHeaderWrap: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* SEARCH BAR */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#071E42',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },

  /* NO MATCH */
  noMatchBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface || '#F8FAFC',
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  noMatchText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 6,
  },
  clearSearchBtn: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: '#EEF4FC',
  },
  clearSearchBtnText: {
    ...typography.smallBold,
    color: '#071E42',
  },

  /* PATIENT SELECTION CHIPS */
  patientChipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: spacing.sm,
  },
  patientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: colors.card,
  },
  patientChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  chipAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chipAvatarActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipAvatarText: {
    ...typography.smallBold,
    color: '#071E42',
  },
  chipAvatarTextActive: {
    color: colors.white,
  },
  patientChipName: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },
  patientChipNameActive: {
    color: colors.white,
  },
  patientChipMeta: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  patientChipMetaActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },

  /* SELECTED PATIENT BANNER */
  selectedPatientCard: {
    backgroundColor: '#EEF4FC',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  patientCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarTextLarge: {
    ...typography.h3,
    color: colors.white,
  },
  selectedPatientName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  activePill: {
    backgroundColor: '#071E42',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  activePillText: {
    ...typography.tiny,
    color: colors.white,
    fontWeight: '700',
  },
  selectedPatientDetails: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  allergyWarning: {
    ...typography.smallBold,
    color: colors.danger || '#DC2626',
    marginTop: 4,
  },

  /* MEDICINE CARD */
  medCard: {
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#071E42',
    borderLeftWidth: 4,
    borderLeftColor: '#071E42',
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  medIndexWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medIndex: {
    ...typography.bodyBold,
    color: '#071E42',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeBtnText: {
    ...typography.small,
    color: colors.danger || '#DC2626',
    fontWeight: '600',
  },

  /* SCHEDULE BOX */
  scheduleBox: {
    backgroundColor: colors.surface || '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#071E42',
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleSectionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  scheduleHelperText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },

  /* TIME SLOT ROW */
  slotRowCard: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: spacing.sm + 4,
    marginBottom: spacing.sm + 2,
  },
  slotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotTitleText: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  slotTitleTextActive: {
    color: colors.textPrimary,
  },
  slotStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  slotStatusBadgeActive: {
    backgroundColor: '#EEF4FC',
  },
  slotStatusBadgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  slotStatusBadgeText: {
    ...typography.tiny,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  slotStatusBadgeTextActive: {
    color: '#071E42',
    fontWeight: '700',
  },

  /* TABLET OPTION: ON / OFF */
  tabletSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  controlSubLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    fontWeight: '600',
    width: 78,
  },
  toggleGroup: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: radius.sm,
    borderWidth: 1.2,
    borderColor: '#071E42',
    backgroundColor: colors.surface || '#F8FAFC',
  },
  toggleBtnOnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  toggleBtnOffActive: {
    backgroundColor: '#64748B',
    borderColor: '#475569',
  },
  toggleBtnText: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: colors.white,
  },

  /* FOOD SELECTOR */
  foodSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodGroup: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  foodChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: radius.sm,
    borderWidth: 1.2,
    borderColor: '#071E42',
    backgroundColor: colors.surface || '#F8FAFC',
  },
  foodChoiceBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  foodChoiceBtnDisabled: {
    opacity: 0.6,
  },
  foodChoiceText: {
    ...typography.smallBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  foodChoiceTextActive: {
    color: colors.white,
  },

  /* PREVIEW */
  previewCard: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#071E42',
    padding: spacing.md,
  },
  previewEmptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  previewEmpty: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  previewRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  previewRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 12,
  },
  previewNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  previewNumText: {
    ...typography.smallBold,
    color: '#071E42',
  },
  previewTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
  },
  regimenPill: {
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  regimenPillText: {
    ...typography.tiny,
    color: '#071E42',
    fontWeight: '700',
  },
  previewSchedule: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  previewDuration: {
    ...typography.smallBold,
    color: '#071E42',
    marginTop: 3,
  },
  previewNote: {
    ...typography.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },

  /* ACTION BUTTONS */
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.xl,
  },
  generateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071E42',
    paddingVertical: 14,
    borderRadius: radius.md,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* MEDICAL TYPE SELECTOR */
  medTypeHeaderBadge: {
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginLeft: 8,
  },
  medTypeHeaderBadgeText: {
    ...typography.tiny,
    color: '#071E42',
    fontWeight: '700',
  },
  typeSection: {
    marginBottom: spacing.md,
  },
  typeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    ...typography.smallBold,
    color: colors.textPrimary,
  },
  typeHelper: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  typeChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface || '#F8FAFC',
    borderWidth: 1.2,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  typeChipText: {
    ...typography.smallBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  typeChipTextActive: {
    color: colors.white,
  },

  /* APPLY SAME TIMINGS (PERMANENT & CURRENT ADDRESS SAME STYLE) */
  applySameCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#071E42',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  applySameCardActive: {
    backgroundColor: '#EEF4FC',
    borderColor: '#071E42',
  },
  applySameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sameCheckbox: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sameCheckboxActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  applySameTextCol: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  applySameTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  applySameTitle: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  applySameTitleActive: {
    color: '#071E42',
  },
  sameSyncedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  sameSyncedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  applySameSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  applySameActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#071E42',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.sm,
  },
  applySameActionBtnActive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#071E42',
  },
  applySameActionBtnText: {
    ...typography.smallBold,
    fontSize: 11,
    color: colors.white,
  },
  applySameActionBtnTextActive: {
    color: '#071E42',
  },

  /* PREVIEW TYPE BADGE */
  previewTypeBadge: {
    backgroundColor: colors.surface || '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: colors.border,
  },
  previewTypeBadgeText: {
    ...typography.tiny,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '700',
  },
});