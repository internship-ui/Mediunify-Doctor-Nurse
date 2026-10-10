import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, spacing, typography, radius } from '../theme/colors';
import { patients } from '../data/mockData';

const COMPREHENSIVE_LAB_TESTS = [
  'Complete Blood Count (CBC) with differential & platelets',
  'Fasting Blood Sugar (FBS)',
  'Post-Prandial Blood Sugar (PPBS)',
  'HbA1c',
  'Lipid Profile',
  'Liver Function Test (LFT)',
  'Kidney Function Test (KFT)',
  'Thyroid Profile',
  'Thyroid Stimulating Hormone (TSH)',
  'TFT',
  'T3',
  'T4',
  'Free T3',
  'Free T4',
  'Anti-TPO Antibody',
  'Urine Routine & Microscopy',
  'Urine Analysis',
  'Urine Albumin/Creatinine Ratio (UACR)',
  'Iron Profile',
  'Ferritin',
  'Vitamin D – 25 OH',
  'Vitamin B12',
  'Calcium',
  'Magnesium',
  'Phosphorus',
  'Electrolytes',
  'Sodium',
  'Potassium',
  'Chloride',
  'Urea',
  'Creatinine',
  'Urea, Creatinine',
  'eGFR',
  'Uric Acid',
  'High-Sensitivity CRP (hs-CRP)',
  'hs-CRP',
  'C-Reactive Protein (CRP)',
  'Erythrocyte Sedimentation Rate (ESR)',
  'Homocysteine',
  'Apolipoprotein A1',
  'Apolipoprotein B',
  'Fasting Insulin',
  'C-Peptide',
  'Zinc',
  'Total Testosterone',
  'Total PSA',
  'Bilirubin – Total & Direct',
  'AST/SGOT',
  'ALT/SGPT',
  'Alkaline Phosphatase (ALP)',
  'Gamma GT (GGT)',
  'Total Protein',
  'Albumin',
  'Globulin',
  'A/G Ratio',
  'Parathyroid Hormone (PTH)',
  'Creatine Kinase (CK Total)',
  'Alpha-Fetoprotein (AFP)',
  'CA 19-9',
  'CEA',
  'CA 125',
  'CA 15-3',
  'Lactate Dehydrogenase (LDH)',
  'Prothrombin Time / INR',
  'ABO Blood Group & Rh Type',
  'HIV-1 & HIV-2 4th Generation Ag/Ab',
  'HIV-1 & 2',
  'HBsAg',
  'HCV',
  'Syphilis Screen – RPR/VDRL',
  'Haemoglobin Electrophoresis / HPLC',
  'HSV-1 Type-Specific IgM',
  'HSV-2 Type-Specific IgG',
  'Chlamydia trachomatis IgG – CLIA/ELISA',
  'Chlamydia trachomatis IgM – CLIA/ELISA',
  'Total IgE',
  'Milk specific IgE',
  'Groundnut (Peanut) specific IgE',
  'Rice specific IgE',
  'Almond specific IgE',
  'Cashew Nut specific IgE',
  'Coconut specific IgE',
  'Banana specific IgE',
  'Tomato specific IgE',
  'Soybean specific IgE',
  'Wheat specific IgE',
  'Chicken specific IgE',
  'Egg White specific IgE',
  'Egg Yolk specific IgE',
  'Fish specific IgE',
  'Shrimp (Prawn) specific IgE',
  'Mutton specific IgE',
  'Respiratory / Inhalant Specific-IgE Panel',
  'Malaria Antigen – Pf/Pv',
  'Peripheral Smear for Malarial Parasite',
  'Dengue Test – Igg, IgM & NS1 by fever day',
  'Scrub Typhus IgM',
  'Blood Culture & Sensitivity',
  'Luteinising Hormone (LH)',
  'Follicle Stimulating Hormone (FSH)',
  'Prolactin',
  '12-Lead ECG',
  'Ultrasound Abdomen & Pelvis',
  '2D Echo with Colour Doppler',
];

const COMPREHENSIVE_SCAN_TYPES = [
  '12-Lead ECG',
  'Ultrasound Abdomen & Pelvis',
  '2D Echo with Colour Doppler',
  'Chest X-Ray (PA View)',
  'X-Ray Spine (Cervical / Lumbar)',
  'X-Ray Extremities (Knee, Joint, Bone)',
  'X-Ray Pelvis / Hip',
  'Ultrasound (USG) Abdomen & Pelvis',
  'Ultrasound KUB (Kidney, Ureter, Bladder)',
  'Obstetric / Pregnancy Ultrasound',
  'Thyroid / Neck Ultrasound',
  'Doppler Ultrasound (Venous / Arterial)',
  'CT Scan Brain / Head',
  'CT Scan Chest (HRCT)',
  'CT Scan Abdomen & Pelvis',
  'CT Angiography',
  'MRI Brain',
  'MRI Spine (Cervical / Lumbar / Thoracic)',
  'MRI Knee / Shoulder Joint',
  'TMT (Treadmill Test / Stress Test)',
  'Mammography (Bilateral)',
  'DEXA Bone Mineral Density (BMD)',
];

const CATEGORIES = [
  {
    key: 'lab',
    label: 'Lab Test',
    icon: 'flask-outline',
    placeholder: 'Search Lab Test (e.g. CBC, HbA1c, LFT, KFT)...',
    options: COMPREHENSIVE_LAB_TESTS,
    popular: [
      'Complete Blood Count (CBC) with differential & platelets',
      'Fasting Blood Sugar (FBS)',
      'HbA1c',
      'Lipid Profile',
      'Liver Function Test (LFT)',
      'Kidney Function Test (KFT)',
      'Thyroid Profile',
      'Urine Routine & Microscopy',
      'Vitamin D – 25 OH',
      'Vitamin B12',
    ],
  },
  {
    key: 'scan',
    label: 'Radiology / Scan',
    icon: 'scan-outline',
    placeholder: 'Search Radiology / Scan (e.g. ECG, Echo, USG, X-Ray)...',
    options: COMPREHENSIVE_SCAN_TYPES,
    popular: [
      '12-Lead ECG',
      'Ultrasound Abdomen & Pelvis',
      '2D Echo with Colour Doppler',
      'Chest X-Ray (PA View)',
      'CT Scan Brain / Head',
      'CT Scan Chest (HRCT)',
      'MRI Brain',
      'MRI Spine (Cervical / Lumbar / Thoracic)',
    ],
  },
];

const QUICK_NOTES = [
  'Fasting required (10-12 hrs)',
  'Drink plenty of water before ultrasound',
  'Carry previous scan & lab reports',
  'Visit diagnostic lab within 3 days',
];

export default function TestRequirementScreen({ route, navigation }) {
  const { patientId } = route.params || {};
  const patient = patients.find((p) => p.id === patientId);

  const [category, setCategory] = useState('lab');
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // Scroll, layout position, and keyboard state for preventing overlap
  const scrollViewRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [notesY, setNotesY] = useState(0);

  const scrollToNotes = () => {
    // Scroll directly to the notes field so it sits comfortably in view below the header
    const targetY = notesY > 0 ? notesY - 40 : 450;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, targetY),
        animated: true,
      });
    }, 100);
  };

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

  const current = CATEGORIES.find((c) => c.key === category) || CATEGORIES[0];

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return isDropdownOpen ? current.options : [];
    return current.options.filter((item) => item.toLowerCase().includes(q));
  }, [searchQuery, current, isDropdownOpen]);

  const hasExactMatch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return false;
    return current.options.some((item) => item.toLowerCase() === q);
  }, [searchQuery, current]);

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addCustomItem = () => {
    const item = searchQuery.trim();
    if (!item) return;
    if (!selected.includes(item)) {
      setSelected((prev) => [...prev, item]);
    }
    setSearchQuery('');
  };

  const changeCategory = (key) => {
    setCategory(key);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const addQuickNote = (noteText) => {
    if (!notes.trim()) {
      setNotes(noteText);
    } else if (!notes.includes(noteText)) {
      setNotes((prev) => `${prev.trim()}, ${noteText}`);
    }
  };

  const submit = () => {
    if (selected.length === 0) {
      Alert.alert(
        'Selection Required',
        'Please select or search at least one lab test or scan requirement.'
      );
      return;
    }
    Alert.alert(
      'Requirement Sent',
      `${selected.length} requirement(s) shared with ${patient ? patient.name : 'the patient'}. They will receive this in their patient app.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelected([]);
            setNotes('');
            navigation.goBack();
          },
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
        { text: 'Call Now', style: 'destructive', onPress: () => { } },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
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

        {/* NAVIGATION ROW: (←) Test Requirement */}
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
            <Text style={styles.screenMainTitle}>Test Requirement</Text>
            {patient?.name && <Text style={styles.screenSubTitle}>{patient.name}</Text>}
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: isKeyboardOpen ? (keyboardHeight > 0 ? keyboardHeight + 80 : 340) : 100,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* CATEGORY SWITCH: LAB TEST VS RADIOLOGY / SCAN (PHARMACY REMOVED) */}
          <Text style={styles.sectionTitle}>Requirement Category</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((c) => {
              const isActive = category === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                  onPress={() => changeCategory(c.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={c.icon}
                    size={17}
                    color={isActive ? colors.white : '#071E42'}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SEARCH BAR WITH TYPING DROPDOWN SUGGESTIONS */}
          <Text style={styles.sectionTitle}>Search & Add {current.label}</Text>
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={19} color="#071E42" />
              <TextInput
                style={styles.searchInput}
                placeholder={current.placeholder}
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                returnKeyType="search"
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={19} color={colors.textMuted} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen((prev) => !prev)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={19}
                    color="#071E42"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* REAL-TIME AUTOCOMPLETE DROPDOWN */}
            {(isDropdownOpen || searchQuery.trim().length > 0) && (
              <View style={styles.dropdownBox}>
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownHeaderText}>
                    {searchQuery.trim().length > 0
                      ? `Suggested ${current.label}s (${filteredOptions.length})`
                      : `All ${current.label}s (${filteredOptions.length})`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsDropdownOpen(false);
                      Keyboard.dismiss();
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.dropdownHeaderCloseText}>Done</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.dropdownScroll}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={true}
                >
                  {filteredOptions.length === 0 ? (
                    <View style={styles.dropdownEmptyRow}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={17}
                        color={colors.textMuted}
                      />
                      <Text style={styles.dropdownEmptyText}>
                        No preset found for "{searchQuery.trim()}"
                      </Text>
                    </View>
                  ) : (
                    filteredOptions.map((opt) => {
                      const isSelected = selected.includes(opt);
                      return (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            styles.dropdownItem,
                            isSelected && styles.dropdownItemActive,
                          ]}
                          onPress={() => toggle(opt)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.dropdownItemLeft}>
                            <Ionicons
                              name={isSelected ? 'checkmark-circle' : current.icon}
                              size={16}
                              color={isSelected ? colors.primary : colors.textMuted}
                            />
                            <Text
                              style={[
                                styles.dropdownItemText,
                                isSelected && styles.dropdownItemTextActive,
                              ]}
                            >
                              {opt}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.dropdownActionBadge,
                              isSelected && styles.dropdownActionBadgeActive,
                            ]}
                          >
                            <Ionicons
                              name={isSelected ? 'checkmark' : 'add'}
                              size={13}
                              color={isSelected ? colors.white : colors.primary}
                            />
                            <Text
                              style={[
                                styles.dropdownActionBadgeText,
                                isSelected && styles.dropdownActionBadgeTextActive,
                              ]}
                            >
                              {isSelected ? 'Added' : 'Add'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}

                  {/* Add Custom Test option if not exact match */}
                  {!hasExactMatch && searchQuery.trim().length >= 2 && (
                    <TouchableOpacity
                      style={styles.addCustomRow}
                      onPress={addCustomItem}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="add-circle" size={19} color="#071E42" />
                      <Text style={styles.addCustomText}>
                        Add custom: <Text style={{ fontWeight: '700' }}>"{searchQuery.trim()}"</Text>
                      </Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {/* SELECTED REQUIREMENTS CHIPS */}
          {selected.length > 0 && (
            <View style={styles.selectedSection}>
              <View style={styles.selectedHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Selected Requirements ({selected.length})
                </Text>
                <TouchableOpacity onPress={() => setSelected([])}>
                  <Text style={styles.clearAllBtnText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.selectedChipsWrap}>
                {selected.map((item) => (
                  <View key={item} style={styles.selectedChip}>
                    <Ionicons name="checkmark-circle" size={15} color={colors.white} />
                    <Text style={styles.selectedChipText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => toggle(item)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name="close-circle"
                        size={17}
                        color="rgba(255,255,255,0.9)"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* POPULAR & FREQUENT TESTS CHIPS */}
          <Text style={styles.sectionTitle}>Popular {current.label}s</Text>
          <View style={styles.optionsWrap}>
            {current.popular.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionChip, isSelected && styles.optionChipActive]}
                  onPress={() => toggle(opt)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark' : 'add'}
                    size={14}
                    color={isSelected ? colors.white : '#071E42'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && { color: colors.white, fontWeight: '700' },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CLINICAL INSTRUCTIONS & QUICK PRESETS */}
          <View onLayout={(e) => setNotesY(e.nativeEvent.layout.y)}>
            <Text style={styles.sectionTitle}>Notes & Patient Instructions</Text>
            <View style={styles.quickNotesWrap}>
              {QUICK_NOTES.map((qn) => (
                <TouchableOpacity
                  key={qn}
                  style={styles.quickNotePill}
                  onPress={() => addQuickNote(qn)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={12} color="#071E42" />
                  <Text style={styles.quickNotePillText}>{qn}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppInput
              placeholder="e.g. Fasting required before test, visit diagnostic lab within 3 days"
              multiline
              value={notes}
              onChangeText={setNotes}
              onFocus={scrollToNotes}
              onTouchStart={scrollToNotes}
              borderColor="#071E42"
            />
          </View>

          {/* PREVIEW CARD */}
          <View style={styles.previewCard}>
            <View style={styles.previewHeaderRow}>
              <Text style={styles.previewTitle}>Patient Request Preview</Text>
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>
                  {selected.length} Item{selected.length === 1 ? '' : 's'}
                </Text>
              </View>
            </View>

            {selected.length === 0 ? (
              <Text style={styles.previewEmpty}>
                Search or select items above to preview the requirement list sent to the patient.
              </Text>
            ) : (
              <>
                {selected.map((s) => (
                  <View key={s} style={styles.previewRow}>
                    <Ionicons name="checkmark-circle" size={15} color="#071E42" />
                    <Text style={styles.previewItem}>{s}</Text>
                  </View>
                ))}

                {notes.trim() ? (
                  <View style={styles.previewNotesBox}>
                    <Text style={styles.previewNotesLabel}>Patient Instructions:</Text>
                    <Text style={styles.previewNotesText}>{notes.trim()}</Text>
                  </View>
                ) : null}
              </>
            )}
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={submit}
            activeOpacity={0.85}
          >
            <Ionicons name="send-outline" size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.submitBtnText}>{`Send Requirement (${selected.length})`}</Text>
          </TouchableOpacity>
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

  sectionTitle: {
    ...typography.smallBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  categoryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  categoryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: '#071E42',
    backgroundColor: '#EEF4FC',
  },
  categoryBtnActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  categoryText: {
    ...typography.smallBold,
    color: '#071E42',
  },
  categoryTextActive: {
    color: colors.white,
  },

  /* SEARCH BAR & DROPDOWN */
  searchSection: {
    position: 'relative',
    zIndex: 50,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#071E42',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  dropdownBox: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#071E42',
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  dropdownHeaderText: {
    ...typography.tinyBold,
    color: '#071E42',
  },
  dropdownHeaderCloseText: {
    ...typography.tinyBold,
    color: '#071E42',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dropdownHeaderHint: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  dropdownScroll: {
    maxHeight: 250,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemActive: {
    backgroundColor: '#EEF4FC',
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  dropdownItemText: {
    ...typography.small,
    color: colors.textPrimary,
    flex: 1,
  },
  dropdownItemTextActive: {
    fontWeight: '700',
    color: '#071E42',
  },
  dropdownActionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dropdownActionBadgeActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  dropdownActionBadgeText: {
    ...typography.tinyBold,
    color: '#071E42',
  },
  dropdownActionBadgeTextActive: {
    color: colors.white,
  },
  dropdownEmptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  dropdownEmptyText: {
    ...typography.small,
    color: colors.textMuted,
  },
  addCustomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
  },
  addCustomText: {
    ...typography.small,
    color: '#071E42',
  },

  /* SELECTED SECTION */
  selectedSection: {
    marginTop: 8,
    backgroundColor: '#EEF4FC',
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
  },
  selectedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearAllBtnText: {
    ...typography.tinyBold,
    color: colors.danger,
  },
  selectedChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#071E42',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  selectedChipText: {
    ...typography.smallBold,
    color: colors.white,
    fontSize: 12,
  },

  /* POPULAR OPTIONS */
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  optionChipActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },
  optionText: {
    ...typography.small,
    color: colors.textSecondary,
    fontSize: 12,
  },

  /* QUICK NOTES */
  quickNotesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  quickNotePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF4FC',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickNotePillText: {
    ...typography.tinyBold,
    color: '#071E42',
  },

  /* PREVIEW CARD */
  previewCard: {
    backgroundColor: '#EEF4FC',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  previewTitle: {
    ...typography.smallBold,
    color: '#071E42',
  },
  previewBadge: {
    backgroundColor: '#071E42',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  previewBadgeText: {
    ...typography.tinyBold,
    color: colors.white,
  },
  previewEmpty: {
    ...typography.small,
    color: colors.textMuted,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  previewItem: {
    ...typography.small,
    color: colors.textPrimary,
  },
  previewNotesBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
  },
  previewNotesLabel: {
    ...typography.tinyBold,
    color: '#071E42',
    marginBottom: 2,
  },
  previewNotesText: {
    ...typography.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071E42',
    paddingVertical: 14,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
