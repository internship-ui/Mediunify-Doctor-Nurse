import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';
import ResponseModal from '../components/ResponseModal';
import { doctor } from '../../data/mockData';

export default function DoctorPrescriptionPage({
  selectedPatient: initialPatient,
  setActiveTab,
}) {
  // Patients Catalog for Dropdown Search
  const ALL_PATIENTS = [
    {
      id: 'p1',
      name: 'Rahul Kumar',
      age: 34,
      gender: 'Male',
      bloodGroup: 'B+',
      lastVisit: '22 Sep 2026',
    },
    {
      id: 'p2',
      name: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      bloodGroup: 'O+',
      lastVisit: '22 Aug 2026',
    },
    {
      id: 'p3',
      name: 'Arjun Menon',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B+',
      lastVisit: '15 Sep 2026',
    },
    {
      id: 'p4',
      name: 'Sunita Patel',
      age: 31,
      gender: 'Female',
      bloodGroup: 'A+',
      lastVisit: '10 Sep 2026',
    },
    {
      id: 'p5',
      name: 'Suresh K.',
      age: 58,
      gender: 'Male',
      bloodGroup: 'AB+',
      lastVisit: '14 Aug 2026',
    },
  ];

  // Active Selected Patient State
  const [selectedPatient, setSelectedPatient] = useState(
    initialPatient
      ? ALL_PATIENTS.find((p) => p.name === initialPatient.name || p.id === initialPatient.id) || initialPatient
      : ALL_PATIENTS[1] // Default Priya Sharma as shown in screenshot
  );

  // Patient Search & Dropdown
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Filtered patients for dropdown
  const filteredPatientSuggestions = ALL_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.bloodGroup.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      String(p.age).includes(patientSearchQuery)
  );

  // Common Medicine Suggestions Catalog for Search with Dropdown
  const MEDICINE_CATALOG = [
    'Paracetamol 650mg (Dolo / Calpol)',
    'Amlodipine 5mg (Amlong)',
    'Telmisartan 40mg (Telma)',
    'Metformin 500mg SR (Glycomet)',
    'Montair-LC (Montelukast + Levocetirizine)',
    'Augmentin 625 Duo (Amoxiclav)',
    'Pantoprazole 40mg (Pan-40)',
    'Azithromycin 500mg (Azithral)',
    'Atorvastatin 10mg (Atorva)',
    'Levocetirizine 5mg (1-AL)',
    'Cefixime 200mg (Taxim-O)',
    'Fluticasone Furoate Nasal Spray',
  ];

  // Active Medicine Form State (Medicine #1)
  const [activeMedicineIndex, setActiveMedicineIndex] = useState(0);
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      type: 'Tablet', // 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops' | 'Ointment'
      name: 'Paracetamol 650mg',
      duration: '5 days',
      morningOn: true,
      morningFood: 'After Food', // 'Before Food' | 'After Food'
      afternoonOn: false,
      afternoonFood: 'After Food',
      nightOn: true,
      nightFood: 'After Food',
      instructions: 'Take with warm water after meals',
    },
  ]);

  // Search Medicine Dropdown state
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('Paracetamol 650mg');
  const [showMedDropdown, setShowMedDropdown] = useState(false);

  // Response Confirmation Modal State
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

  // Medicine helpers
  const currentMed = medicines[activeMedicineIndex] || medicines[0];

  const updateCurrentMed = (field, value) => {
    setMedicines((prev) => {
      const updated = [...prev];
      if (updated[activeMedicineIndex]) {
        updated[activeMedicineIndex] = {
          ...updated[activeMedicineIndex],
          [field]: value,
        };
      }
      return updated;
    });
  };

  const handleSelectMedType = (type) => {
    updateCurrentMed('type', type);
  };

  const handleSelectMedName = (medName) => {
    updateCurrentMed('name', medName);
    setMedicineSearchQuery(medName);
    setShowMedDropdown(false);
  };

  const handleAddAnotherMedicine = () => {
    const newId = medicines.length + 1;
    const newMedObj = {
      id: newId,
      type: 'Tablet',
      name: '',
      duration: '5 days',
      morningOn: true,
      morningFood: 'After Food',
      afternoonOn: false,
      afternoonFood: 'After Food',
      nightOn: true,
      nightFood: 'After Food',
      instructions: '',
    };
    setMedicines([...medicines, newMedObj]);
    setActiveMedicineIndex(medicines.length);
    setMedicineSearchQuery('');
  };

  const handleSaveDraft = () => {
    showPopup(
      'Prescription Saved as Draft',
      `Draft e-prescription for ${selectedPatient.name} has been saved.`,
      [
        `Patient: ${selectedPatient.name} (${selectedPatient.age} yrs · ${selectedPatient.bloodGroup})`,
        `Medicines: ${medicines.map((m) => m.name || 'Unnamed').join(', ')}`,
        'Status: Saved to drafts · You can edit and sign anytime',
      ],
      'info'
    );
  };

  const handleGenerateAndShare = () => {
    showPopup(
      'e-Prescription Generated & Dispatched',
      `Official digital prescription has been signed by Dr. Ananya Rao and delivered to ${selectedPatient.name}.`,
      [
        `Patient: ${selectedPatient.name}`,
        `Medicines Configured: ${medicines.length} item(s)`,
        'Digital Signature: MCI-2019-887341 verified',
        'Delivery: Dispatched via WhatsApp PDF & SMS link to patient portal',
        'Audit Trail: Encrypted timestamp stored on MediUnify cloud',
      ],
      'success'
    );
  };

  return (
    <View style={styles.pageRoot}>
      {/* 1. TOP HEADER (Deep Navy Header Matching Screenshot) */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity
            style={styles.backCircleBtn}
            onPress={() => (setActiveTab ? setActiveTab('followups') : null)}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={17} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandGroup}>
            <WebLogo size={28} style={styles.brandLogoBox} />
            <Text style={styles.brandTitle}>
              Medi<Text style={styles.brandAccent}>Unify</Text>
            </Text>
          </View>
        </View>

        <View style={styles.headerCenterGroup}>
          <Text style={styles.headerTitle}>Prescription</Text>
          <Text style={styles.headerPatientSub}>{selectedPatient.name}</Text>
        </View>

        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={styles.headerIconCircle}
            onPress={() => alert(`Calling ${selectedPatient.name}...`)}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={15} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerIconCircle} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerAvatarBadge}
            onPress={() => (setActiveTab ? setActiveTab('profile') : null)}
            activeOpacity={0.8}
          >
            <Text style={styles.headerAvatarText}>AR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. MAIN SCROLLABLE BODY */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* CARD 1: Select Patient */}
        <View style={styles.card}>
          <View style={styles.cardHeaderGroup}>
            <Text style={styles.cardTitle}>Select Patient</Text>
            <Text style={styles.cardSub}>Search and select a patient to prescribe medicine</Text>
          </View>

          {/* Search Patient Input Bar with Dropdown */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBarBox}>
              <Ionicons name="search-outline" size={17} color="#94A3B8" />
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search patient by name, blood group, age..."
                placeholderTextColor="#94A3B8"
                value={patientSearchQuery}
                onFocus={() => setShowPatientDropdown(true)}
                onChangeText={(val) => {
                  setPatientSearchQuery(val);
                  setShowPatientDropdown(true);
                }}
              />
              {patientSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setPatientSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Patient Search Autocomplete Dropdown */}
            {showPatientDropdown && patientSearchQuery.length > 0 && (
              <View style={styles.patientDropdownList}>
                {filteredPatientSuggestions.map((pat) => (
                  <TouchableOpacity
                    key={pat.id}
                    style={styles.patientDropdownItem}
                    onPress={() => {
                      setSelectedPatient(pat);
                      setPatientSearchQuery('');
                      setShowPatientDropdown(false);
                    }}
                  >
                    <View style={styles.dropdownAvatarCircle}>
                      <Text style={styles.dropdownAvatarLetter}>{pat.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dropdownPatientName}>{pat.name}</Text>
                      <Text style={styles.dropdownPatientMeta}>
                        {pat.age} yrs · {pat.gender} · Blood: {pat.bloodGroup} · Last: {pat.lastVisit}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Quick Patient Chips Row (Matching Screenshot) */}
          <View style={styles.patientChipsRow}>
            {ALL_PATIENTS.map((p) => {
              const isSelected = selectedPatient.id === p.id || selectedPatient.name === p.name;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.patientChipBtn, isSelected && styles.patientChipBtnActive]}
                  onPress={() => setSelectedPatient(p)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.chipAvatarCircle, isSelected && styles.chipAvatarCircleActive]}>
                    <Text style={[styles.chipAvatarLetter, isSelected && styles.chipAvatarLetterActive]}>
                      {p.name.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.patientChipName, isSelected && styles.patientChipNameActive]}>
                      {p.name}
                    </Text>
                    <Text style={[styles.patientChipMeta, isSelected && styles.patientChipMetaActive]}>
                      {p.age} yrs · {p.bloodGroup}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Patient Banner */}
          <View style={styles.selectedPatientBanner}>
            <View style={styles.selectedPatientRow}>
              <Text style={styles.selectedPatientNameText}>{selectedPatient.name}</Text>
              <View style={styles.selectedBadgePill}>
                <Text style={styles.selectedBadgePillText}>Selected</Text>
              </View>
            </View>
            <Text style={styles.selectedPatientMetaText}>
              {selectedPatient.age} yrs · {selectedPatient.gender} · Blood: {selectedPatient.bloodGroup} · Last visit: {selectedPatient.lastVisit || '22 Aug 2026'}
            </Text>
          </View>
        </View>

        {/* CARD 2: Prescribed Medicines (Matching Screenshot) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderGroup}>
            <Text style={styles.cardTitle}>Prescribed Medicines</Text>
            <Text style={styles.cardSub}>
              Set tablet doses and food timing for Morning, Afternoon, and Night
            </Text>
          </View>

          {/* Medicine Container */}
          <View style={styles.medicineFormContainer}>
            {/* Header of Medicine Item */}
            <View style={styles.medItemHeaderRow}>
              <View style={styles.medItemTitleGroup}>
                <Text style={styles.medItemNumberText}>Medicine #{activeMedicineIndex + 1}</Text>
                <View style={styles.medTypePillBadge}>
                  <Text style={styles.medTypePillBadgeText}>{currentMed.type}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowMedDropdown(!showMedDropdown)}
                style={styles.catalogLinkBtn}
              >
                <Text style={styles.catalogLinkText}>Select medicine from catalog ▾</Text>
              </TouchableOpacity>
            </View>

            {/* Medicine Type Chips Selector */}
            <View style={styles.medTypeChipsRow}>
              {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Ointment'].map((t) => {
                const isSelected = currentMed.type === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeSelectChip, isSelected && styles.typeSelectChipActive]}
                    onPress={() => handleSelectMedType(t)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.typeSelectChipText,
                        isSelected && styles.typeSelectChipTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Medicine Name & Strength Input with Dropdown (Teal Highlight Outline) */}
            <View style={styles.inputFieldContainer}>
              <View style={styles.tealBorderInputBox}>
                <Ionicons name="medical-outline" size={17} color="#00B894" />
                <TextInput
                  style={styles.tealInputText}
                  placeholder="e.g. Paracetamol 650mg"
                  placeholderTextColor="#94A3B8"
                  value={medicineSearchQuery}
                  onFocus={() => setShowMedDropdown(true)}
                  onChangeText={(text) => {
                    setMedicineSearchQuery(text);
                    updateCurrentMed('name', text);
                    setShowMedDropdown(true);
                  }}
                />
                <TouchableOpacity onPress={() => setShowMedDropdown(!showMedDropdown)}>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Medicine Autocomplete Suggestions Dropdown */}
              {showMedDropdown && (
                <View style={styles.medicineDropdownCard}>
                  <Text style={styles.dropdownHeading}>SUGGESTED MEDICATIONS (TAP TO SELECT)</Text>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {MEDICINE_CATALOG.filter((m) =>
                      m.toLowerCase().includes(medicineSearchQuery.toLowerCase())
                    ).map((m, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.medDropdownRow}
                        onPress={() => handleSelectMedName(m)}
                      >
                        <Ionicons name="medkit-outline" size={15} color="#00B894" />
                        <Text style={styles.medDropdownText}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Duration Input Field with Quick Chips */}
            <View style={styles.durationInputContainer}>
              <View style={styles.standardInputBox}>
                <Ionicons name="time-outline" size={17} color="#64748B" />
                <TextInput
                  style={styles.standardInputText}
                  placeholder="e.g. 5 days, 1 week, 15 days"
                  placeholderTextColor="#94A3B8"
                  value={currentMed.duration}
                  onChangeText={(v) => updateCurrentMed('duration', v)}
                />
              </View>

              <View style={styles.quickDurationChips}>
                {['3 days', '5 days', '7 days', '14 days', '30 days'].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.durationChip,
                      currentMed.duration === d && styles.durationChipActive,
                    ]}
                    onPress={() => updateCurrentMed('duration', d)}
                  >
                    <Text
                      style={[
                        styles.durationChipText,
                        currentMed.duration === d && styles.durationChipTextActive,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Daily Tablet Schedule & Food Timing Card (Exact Replica of Screenshot) */}
            <View style={styles.scheduleSectionCard}>
              <View style={styles.scheduleSectionHeader}>
                <Ionicons name="calendar-outline" size={15} color="#081E3E" />
                <Text style={styles.scheduleSectionTitle}>
                  Daily Tablet Schedule & Food Timing
                </Text>
              </View>

              {/* 1. MORNING ROW */}
              <View style={styles.timingRowBlock}>
                <View style={styles.timingHeaderRow}>
                  <View style={styles.timingIconLabel}>
                    <Ionicons name="sunny-outline" size={15} color="#F59E0B" />
                    <Text style={styles.timingLabelText}>Morning</Text>
                  </View>
                  <Text style={styles.timingStatusBadge}>
                    Tablet: {currentMed.morningOn ? `ON · ${currentMed.morningFood}` : 'OFF'}
                  </Text>
                </View>

                <View style={styles.togglesGrid}>
                  {/* Tablet Option ON / OFF */}
                  <View style={styles.toggleCell}>
                    <Text style={styles.toggleCellLabel}>Tablet Option:</Text>
                    <View style={styles.segmentToggle}>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.morningOn && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('morningOn', true)}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.morningOn && styles.segmentHalfTextActive,
                          ]}
                        >
                          ON
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          !currentMed.morningOn && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('morningOn', false)}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            !currentMed.morningOn && styles.segmentHalfTextActive,
                          ]}
                        >
                          OFF
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Food Timing: Before Food / After Food */}
                  <View style={styles.toggleCell}>
                    <Text style={styles.toggleCellLabel}>Food Timing:</Text>
                    <View style={styles.segmentToggle}>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.morningFood === 'Before Food' && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('morningFood', 'Before Food')}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.morningFood === 'Before Food' && styles.segmentHalfTextActive,
                          ]}
                        >
                          Before Food
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.morningFood === 'After Food' && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('morningFood', 'After Food')}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.morningFood === 'After Food' && styles.segmentHalfTextActive,
                          ]}
                        >
                          After Food
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {/* 2. AFTERNOON ROW */}
              <View style={styles.timingRowBlock}>
                <View style={styles.timingHeaderRow}>
                  <View style={styles.timingIconLabel}>
                    <Ionicons name="partly-sunny-outline" size={15} color="#F59E0B" />
                    <Text style={styles.timingLabelText}>Afternoon</Text>
                  </View>
                  <Text style={styles.timingStatusBadge}>
                    Tablet: {currentMed.afternoonOn ? `ON · ${currentMed.afternoonFood}` : 'OFF'}
                  </Text>
                </View>

                <View style={styles.togglesGrid}>
                  <View style={styles.toggleCell}>
                    <Text style={styles.toggleCellLabel}>Tablet Option:</Text>
                    <View style={styles.segmentToggle}>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.afternoonOn && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('afternoonOn', true)}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.afternoonOn && styles.segmentHalfTextActive,
                          ]}
                        >
                          ON
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          !currentMed.afternoonOn && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('afternoonOn', false)}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            !currentMed.afternoonOn && styles.segmentHalfTextActive,
                          ]}
                        >
                          OFF
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.toggleCell}>
                    <Text style={styles.toggleCellLabel}>Food Timing:</Text>
                    <View style={styles.segmentToggle}>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.afternoonFood === 'Before Food' && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('afternoonFood', 'Before Food')}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.afternoonFood === 'Before Food' && styles.segmentHalfTextActive,
                          ]}
                        >
                          Before Food
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.afternoonFood === 'After Food' && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('afternoonFood', 'After Food')}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.afternoonFood === 'After Food' && styles.segmentHalfTextActive,
                          ]}
                        >
                          After Food
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {/* 3. NIGHT ROW */}
              <View style={styles.timingRowBlock}>
                <View style={styles.timingHeaderRow}>
                  <View style={styles.timingIconLabel}>
                    <Ionicons name="moon-outline" size={15} color="#6366F1" />
                    <Text style={styles.timingLabelText}>Night</Text>
                  </View>
                  <Text style={styles.timingStatusBadge}>
                    Tablet: {currentMed.nightOn ? `ON · ${currentMed.nightFood}` : 'OFF'}
                  </Text>
                </View>

                <View style={styles.togglesGrid}>
                  <View style={styles.toggleCell}>
                    <Text style={styles.toggleCellLabel}>Tablet Option:</Text>
                    <View style={styles.segmentToggle}>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.nightOn && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('nightOn', true)}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.nightOn && styles.segmentHalfTextActive,
                          ]}
                        >
                          ON
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          !currentMed.nightOn && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('nightOn', false)}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            !currentMed.nightOn && styles.segmentHalfTextActive,
                          ]}
                        >
                          OFF
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.toggleCell}>
                    <Text style={styles.toggleCellLabel}>Food Timing:</Text>
                    <View style={styles.segmentToggle}>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.nightFood === 'Before Food' && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('nightFood', 'Before Food')}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.nightFood === 'Before Food' && styles.segmentHalfTextActive,
                          ]}
                        >
                          Before Food
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segmentHalf,
                          currentMed.nightFood === 'After Food' && styles.segmentHalfActive,
                        ]}
                        onPress={() => updateCurrentMed('nightFood', 'After Food')}
                      >
                        <Text
                          style={[
                            styles.segmentHalfText,
                            currentMed.nightFood === 'After Food' && styles.segmentHalfTextActive,
                          ]}
                        >
                          After Food
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Special Instructions (Optional) */}
            <View style={styles.instructionsBox}>
              <View style={styles.standardInputBox}>
                <Ionicons name="information-circle-outline" size={17} color="#00B894" />
                <TextInput
                  style={styles.standardInputText}
                  placeholder="Special instructions: e.g. Take with warm water, avoid dairy"
                  placeholderTextColor="#94A3B8"
                  value={currentMed.instructions}
                  onChangeText={(v) => updateCurrentMed('instructions', v)}
                />
              </View>
            </View>

            {/* + Add Another Medicine Button */}
            <TouchableOpacity
              style={styles.addAnotherMedBtn}
              onPress={handleAddAnotherMedicine}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={16} color="#00B894" />
              <Text style={styles.addAnotherMedText}>+ Add Another Medicine</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD 3: Prescription Preview (Matching Screenshot) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderGroup}>
            <Text style={styles.cardTitle}>Prescription Preview</Text>
            <Text style={styles.cardSub}>
              Digital prescription document preview for {selectedPatient.name}
            </Text>
          </View>

          <View style={styles.previewSheet}>
            {/* Header info */}
            <View style={styles.previewHeaderRow}>
              <View>
                <Text style={styles.previewDoctorName}>{doctor.name || 'Dr. Ananya Rao'}</Text>
                <Text style={styles.previewDoctorQual}>MBBS, MD (Internal Medicine) · MCI-2019-887341</Text>
                <Text style={styles.previewClinic}>Unify Health Clinic, Indiranagar, Bengaluru</Text>
              </View>
              <View style={styles.rxSymbolBox}>
                <Text style={styles.rxSymbolText}>℞</Text>
              </View>
            </View>

            <View style={styles.previewPatientBar}>
              <Text style={styles.previewPatientText}>
                <Text style={{ fontWeight: '700' }}>Patient: </Text>
                {selectedPatient.name} ({selectedPatient.age} yrs · {selectedPatient.gender} · {selectedPatient.bloodGroup})
              </Text>
              <Text style={styles.previewDateText}>Date: 06 Oct 2026</Text>
            </View>

            {/* List of Medicines in Preview */}
            <View style={styles.previewMedsList}>
              {medicines.map((m, idx) => (
                <View key={idx} style={styles.previewMedItem}>
                  <View style={styles.previewMedIndexCol}>
                    <Text style={styles.previewIndexNum}>{idx + 1}.</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.previewMedName}>{m.name || 'Paracetamol 650mg'}</Text>
                    <Text style={styles.previewMedTiming}>
                      {m.type} · Schedule: Morning ({m.morningOn ? `ON - ${m.morningFood}` : 'OFF'}), Afternoon ({m.afternoonOn ? `ON - ${m.afternoonFood}` : 'OFF'}), Night ({m.nightOn ? `ON - ${m.nightFood}` : 'OFF'})
                    </Text>
                    <Text style={styles.previewMedDuration}>
                      Duration: {m.duration} {m.instructions ? `· Note: ${m.instructions}` : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Signature row */}
            <View style={styles.previewSignatureRow}>
              <Text style={styles.signatureSealText}>✓ Electronically signed on MediUnify</Text>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureName}>Dr. Ananya Rao</Text>
                <Text style={styles.signatureReg}>MCI-2019-887341</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BOTTOM ACTION BUTTONS ROW (Save Draft & Generate & Share) */}
        <View style={styles.bottomActionsRow}>
          <TouchableOpacity
            style={styles.saveDraftBtn}
            onPress={handleSaveDraft}
            activeOpacity={0.85}
          >
            <Text style={styles.saveDraftBtnText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.generateShareBtn}
            onPress={handleGenerateAndShare}
            activeOpacity={0.88}
          >
            <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
            <Text style={styles.generateShareBtnText}>Generate & Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Response Confirmation Screen Modal with OK Button */}
      <ResponseModal
        visible={responseModal.visible}
        title={responseModal.title}
        message={responseModal.message}
        details={responseModal.details}
        type={responseModal.type}
        buttonText="OK"
        onOk={() => setResponseModal((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pageRoot: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  // Top Header
  topHeader: {
    height: 64,
    backgroundColor: '#081E3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 3,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  brandAccent: {
    color: '#00B894',
  },
  headerCenterGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerPatientSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  headerAvatarBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Main Scrollable Area
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 18,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },

  // Card Structure
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 14,
  },
  cardHeaderGroup: {
    gap: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#081E3E',
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
  },

  // Search Patient Bar
  searchContainer: {
    position: 'relative',
    zIndex: 10,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  searchTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#081E3E',
  },
  patientDropdownList: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 20,
    maxHeight: 220,
  },
  patientDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownAvatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownAvatarLetter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dropdownPatientName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  dropdownPatientMeta: {
    fontSize: 11,
    color: '#64748B',
  },

  // Patient Chips Row
  patientChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  patientChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  patientChipBtnActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  chipAvatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipAvatarCircleActive: {
    backgroundColor: '#00B894',
  },
  chipAvatarLetter: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  chipAvatarLetterActive: {
    color: '#FFFFFF',
  },
  patientChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  patientChipNameActive: {
    color: '#FFFFFF',
  },
  patientChipMeta: {
    fontSize: 10,
    color: '#64748B',
  },
  patientChipMetaActive: {
    color: '#CBD5E1',
  },

  // Selected Patient Banner
  selectedPatientBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  selectedPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedPatientNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  selectedBadgePill: {
    backgroundColor: '#081E3E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedBadgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectedPatientMetaText: {
    fontSize: 11,
    color: '#64748B',
  },

  // Medicine Form Container
  medicineFormContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 16,
    gap: 12,
  },
  medItemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medItemTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medItemNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  medTypePillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  medTypePillBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#081E3E',
  },
  catalogLinkBtn: {},
  catalogLinkText: {
    fontSize: 11,
    color: '#00B894',
    fontWeight: '600',
  },

  // Medicine Type Chips
  medTypeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeSelectChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeSelectChipActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  typeSelectChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  typeSelectChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Medicine Input with Teal Border
  inputFieldContainer: {
    position: 'relative',
    zIndex: 5,
  },
  tealBorderInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  tealInputText: {
    flex: 1,
    fontSize: 13,
    color: '#081E3E',
  },
  medicineDropdownCard: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00B894',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 25,
  },
  dropdownHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
    paddingLeft: 4,
  },
  medDropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medDropdownText: {
    fontSize: 12,
    color: '#081E3E',
    fontWeight: '500',
  },

  // Duration
  durationInputContainer: {
    gap: 6,
  },
  standardInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  standardInputText: {
    flex: 1,
    fontSize: 13,
    color: '#081E3E',
  },
  quickDurationChips: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  durationChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  durationChipActive: {
    backgroundColor: '#081E3E',
  },
  durationChipText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  durationChipTextActive: {
    color: '#FFFFFF',
  },

  // Daily Schedule & Food Timing Section (Matching Screenshot)
  scheduleSectionCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  scheduleSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  timingRowBlock: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  timingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timingIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timingLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  timingStatusBadge: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  togglesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleCellLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  segmentToggle: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    overflow: 'hidden',
  },
  segmentHalf: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  segmentHalfActive: {
    backgroundColor: '#081E3E',
  },
  segmentHalfText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  segmentHalfTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Instructions & Add Button
  instructionsBox: {},
  addAnotherMedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 8,
    paddingVertical: 11,
    backgroundColor: '#F0FDF4',
  },
  addAnotherMedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B894',
  },

  // Prescription Preview Card
  previewSheet: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  previewDoctorName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
  },
  previewDoctorQual: {
    fontSize: 11,
    color: '#64748B',
  },
  previewClinic: {
    fontSize: 10,
    color: '#94A3B8',
  },
  rxSymbolBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rxSymbolText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00B894',
  },
  previewPatientBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
  },
  previewPatientText: {
    fontSize: 11,
    color: '#081E3E',
  },
  previewDateText: {
    fontSize: 10,
    color: '#64748B',
  },
  previewMedsList: {
    gap: 10,
  },
  previewMedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  previewMedIndexCol: {
    width: 20,
  },
  previewIndexNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  previewMedName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  previewMedTiming: {
    fontSize: 11,
    color: '#475569',
  },
  previewMedDuration: {
    fontSize: 10,
    color: '#64748B',
  },
  previewSignatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 6,
  },
  signatureSealText: {
    fontSize: 10,
    color: '#00B894',
    fontWeight: '600',
  },
  signatureBox: {
    alignItems: 'flex-end',
  },
  signatureName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
  signatureReg: {
    fontSize: 10,
    color: '#64748B',
  },

  // Bottom Actions Row
  bottomActionsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  saveDraftBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00B894',
  },
  generateShareBtn: {
    flex: 1,
    backgroundColor: '#081E3E',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateShareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
