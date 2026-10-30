import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import Card from '../components/Card';
import { colors, spacing, typography, radius } from '../theme/colors';
import { doctor } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const auth = useAuth();
  const logout = auth?.logout || (() => {});

  /* =========================
     PROFILE DATA
  ========================= */

  const [profile, setProfile] = useState({
    name: doctor.name || '',
    age: String(doctor.age || ''),
    phone: doctor.phone || '',
    altPhone: doctor.altPhone || '',
    email: doctor.email || '',
    qualification: doctor.qualification || '',
    experience: doctor.experience || '',
    fee: String(doctor.fee || ''),
    languages: Array.isArray(doctor.languages)
      ? doctor.languages.join(', ')
      : doctor.languages || '',
    specialization: doctor.specialization || '',
    regNo: doctor.regNo || 'MCI-2019-887341',
    regCertificate: doctor.regCertificate || {
      name: 'MCI_Registration_Certificate_2019.pdf',
      size: '1.8 MB',
      uploadedDate: '12 Jan 2026',
      status: 'Verified',
      council: 'Medical Council of India',
      issueDate: '14 May 2019',
    },
  });

  useEffect(() => {
    if (doctor.regNo || doctor.regCertificate) {
      setProfile((prev) => ({
        ...prev,
        name: doctor.name || prev.name,
        email: doctor.email || prev.email,
        phone: doctor.phone || prev.phone,
        specialization: doctor.specialization || prev.specialization,
        regNo: doctor.regNo || prev.regNo,
        regCertificate: doctor.regCertificate || prev.regCertificate,
      }));
    }
  }, [doctor.regNo, doctor.regCertificate, doctor.name]);

  /* =========================
     CLINIC / HOSPITAL DATA
  ========================= */

  const [clinics, setClinics] = useState([
    {
      id: '1',
      type: 'Clinic',
      name: doctor.clinic || '',
      address: doctor.clinicAddress || '',
    },
  ]);

  /* =========================
     MODALS
  ========================= */

  const [personalModal, setPersonalModal] = useState(false);
  const [professionalModal, setProfessionalModal] = useState(false);
  const [clinicModal, setClinicModal] = useState(false);
  const [addClinicModal, setAddClinicModal] = useState(false);
  const [certPreviewModal, setCertPreviewModal] = useState(false);
  const [certUploadModal, setCertUploadModal] = useState(false);

  const [selectedClinic, setSelectedClinic] = useState(null);

  const [clinicForm, setClinicForm] = useState({
    type: 'Clinic',
    name: '',
    address: '',
  });

  /* =========================
     OPEN PERSONAL EDIT
  ========================= */

  const openPersonalEdit = () => {
    setPersonalModal(true);
  };

  /* =========================
     OPEN PROFESSIONAL EDIT
  ========================= */

  const openProfessionalEdit = () => {
    setProfessionalModal(true);
  };

  /* =========================
     OPEN CLINIC EDIT
  ========================= */

  const openClinicEdit = (clinic) => {
    setSelectedClinic(clinic);
    setClinicForm({
      type: clinic.type,
      name: clinic.name,
      address: clinic.address,
    });

    setClinicModal(true);
  };

  /* =========================
     SAVE PERSONAL
  ========================= */

  const savePersonal = () => {
    if (!profile.name.trim()) {
      Alert.alert('Required', 'Please enter doctor name.');
      return;
    }

    if (!profile.email.trim()) {
      Alert.alert('Required', 'Please enter email address.');
      return;
    }

    setPersonalModal(false);

    Alert.alert(
      'Personal Information Updated',
      'Your personal information has been updated successfully.'
    );
  };

  /* =========================
     SAVE PROFESSIONAL
  ========================= */

  const saveProfessional = () => {
    doctor.qualification = profile.qualification;
    doctor.experience = profile.experience;
    doctor.fee = profile.fee;
    doctor.languages = profile.languages;
    doctor.regNo = profile.regNo;
    if (profile.regCertificate) {
      doctor.regCertificate = profile.regCertificate;
    }
    setProfessionalModal(false);

    Alert.alert(
      'Professional Details Updated',
      'Your professional details and registration info have been updated successfully.'
    );
  };

  /* =========================
     UPDATE CERTIFICATE
  ========================= */

  const handleUpdateCertificate = (newCert) => {
    const updatedCert = {
      name: newCert?.name || `${(profile.regNo || 'MCI_DOC').replace(/[^a-zA-Z0-9]/g, '_')}_Updated_Certificate.pdf`,
      size: newCert?.size || '2.0 MB',
      uploadedDate: 'Updated just now',
      status: 'Verified',
      council: newCert?.council || profile.regCertificate?.council || 'Medical Council of India',
      issueDate: newCert?.issueDate || 'Updated Recently',
    };
    setProfile((prev) => ({
      ...prev,
      regCertificate: updatedCert,
    }));
    doctor.regCertificate = updatedCert;
    setCertUploadModal(false);
    Alert.alert('Certificate Updated', 'Your medical registration certificate has been updated successfully.');
  };

  /* =========================
     SAVE CLINIC EDIT
  ========================= */

  const saveClinicEdit = () => {
    if (!clinicForm.name.trim()) {
      Alert.alert('Required', 'Please enter clinic/hospital name.');
      return;
    }

    if (!clinicForm.address.trim()) {
      Alert.alert('Required', 'Please enter address.');
      return;
    }

    setClinics((prev) =>
      prev.map((item) =>
        item.id === selectedClinic.id
          ? {
              ...item,
              type: clinicForm.type,
              name: clinicForm.name.trim(),
              address: clinicForm.address.trim(),
            }
          : item
      )
    );

    setClinicModal(false);

    Alert.alert(
      'Updated',
      `${clinicForm.type} details have been updated successfully.`
    );
  };

  /* =========================
     ADD CLINIC / HOSPITAL
  ========================= */

  const openAddClinic = () => {
    setClinicForm({
      type: 'Clinic',
      name: '',
      address: '',
    });

    setAddClinicModal(true);
  };

  const saveNewClinic = () => {
    if (!clinicForm.name.trim()) {
      Alert.alert(
        'Required',
        `Please enter ${clinicForm.type.toLowerCase()} name.`
      );
      return;
    }

    if (!clinicForm.address.trim()) {
      Alert.alert('Required', 'Please enter address.');
      return;
    }

    const newClinic = {
      id: Date.now().toString(),
      type: clinicForm.type,
      name: clinicForm.name.trim(),
      address: clinicForm.address.trim(),
    };

    setClinics((prev) => [...prev, newClinic]);

    setAddClinicModal(false);

    Alert.alert(
      `${clinicForm.type} Added`,
      `${clinicForm.type} has been added successfully.`
    );
  };

  /* =========================
     EMERGENCY CALL
  ========================= */

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Initiate an emergency call for an urgent patient case?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => {},
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>

      {/* =========================
          HEADER (NAVY BLUE THEME WITH LOGO & LOGO TEXT)
      ========================= */}

      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      <View style={styles.header}>

        <View style={styles.topRow}>

          <View style={styles.brandRow}>
            <Logo size={34} />
            <Text style={styles.brandName}>
              <Text style={styles.brandMedi}>Medi</Text>
              <Text style={styles.brandUnify}>Unify</Text>
            </Text>
          </View>

          {/* CALL + ALERTS ONLY */}
          <View style={styles.iconsRow}>

            {/* CALL */}
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={handleEmergency}
              activeOpacity={0.7}
            >
              <Ionicons
                name="call"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* ALERTS */}
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications"
                size={18}
                color="#FFFFFF"
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity>

          </View>

        </View>

        {/* =========================
            DOCTOR PROFILE
        ========================= */}

        <View style={styles.avatarBlock}>

          <View style={styles.avatar}>

            <Image
              source={{
                uri: 'https://i.pravatar.cc/300?img=47',
              }}
              style={styles.doctorImage}
            />

          </View>

          <Text style={styles.name}>
            {profile.name}
          </Text>

          <Text style={styles.spec}>
            {profile.specialization}
          </Text>

          <View style={styles.regBadge}>

            <Ionicons
              name={profile.regCertificate?.status === 'Verified' ? "checkmark-circle" : "shield-checkmark"}
              size={13}
              color="#38BDF8"
            />

            <Text style={styles.regText}>
              {profile.regNo || doctor.regNo} · {profile.regCertificate?.status || 'Verified'}
            </Text>

          </View>

        </View>

      </View>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <SectionTitle
          icon="person-outline"
          label="Personal Information"
          action="Edit"
          onAction={openPersonalEdit}
        />

        <Card>

          <InfoRow
            label="Name"
            value={profile.name}
          />

          <InfoRow
            label="Age"
            value={`${profile.age} years`}
          />

          <InfoRow
            label="Mobile Number"
            value={profile.phone}
          />

          <InfoRow
            label="Alternate Number"
            value={profile.altPhone}
          />

          <InfoRow
            label="Email"
            value={profile.email}
            last
          />

        </Card>

        {/* =================================================
            PROFESSIONAL DETAILS
        ================================================= */}

        <SectionTitle
          icon="medkit-outline"
          label="Professional Details"
          action="Edit"
          onAction={openProfessionalEdit}
        />

        <Card>

          <InfoRow
            label="Qualification"
            value={profile.qualification}
          />

          <InfoRow
            label="Experience"
            value={profile.experience}
          />

          <InfoRow
            label="Consultation Fee"
            value={`₹${profile.fee}`}
          />

          <InfoRow
            label="Medical Registration No."
            value={profile.regNo || doctor.regNo}
          />

          <InfoRow
            label="Languages"
            value={profile.languages}
            last
          />

        </Card>

        {/* =================================================
            REGISTRATION CERTIFICATE
        ================================================= */}

        <SectionTitle
          icon="ribbon-outline"
          label="Registration Certificate"
          action="Update"
          onAction={() => setCertUploadModal(true)}
        />

        <Card style={styles.certCard}>
          <View style={styles.certCardTop}>
            <View style={styles.certIconWrap}>
              <Ionicons name="document-text" size={26} color="#071E42" />
              <View style={styles.certTypePill}>
                <Text style={styles.certTypePillText}>PDF</Text>
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.certCouncilHeader}>
                {profile.regCertificate?.council || 'Medical Council of India'}
              </Text>
              <Text style={styles.certFileName} numberOfLines={1}>
                {profile.regCertificate?.name || `${(profile.regNo || 'MCI').replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.pdf`}
              </Text>
              <Text style={styles.certFileMeta}>
                {profile.regCertificate?.size || '1.8 MB'} • {profile.regCertificate?.uploadedDate || '12 Jan 2026'}
              </Text>
            </View>

            <View style={[
              styles.certStatusPill,
              profile.regCertificate?.status === 'Verified' ? styles.certStatusVerified : styles.certStatusPending
            ]}>
              <Ionicons
                name={profile.regCertificate?.status === 'Verified' ? 'checkmark-circle' : 'time-outline'}
                size={13}
                color={profile.regCertificate?.status === 'Verified' ? '#15803d' : '#b45309'}
              />
              <Text style={[
                styles.certStatusPillText,
                { color: profile.regCertificate?.status === 'Verified' ? '#15803d' : '#b45309' }
              ]}>
                {profile.regCertificate?.status || 'Verified'}
              </Text>
            </View>
          </View>

          {/* Certificate Quick Info Strip */}
          <View style={styles.certInfoStrip}>
            <View style={styles.certStripCol}>
              <Text style={styles.certStripLabel}>REGISTRATION NO.</Text>
              <Text style={styles.certStripVal}>{profile.regNo || doctor.regNo}</Text>
            </View>
            <View style={styles.certStripDivider} />
            <View style={styles.certStripCol}>
              <Text style={styles.certStripLabel}>ISSUE DATE</Text>
              <Text style={styles.certStripVal}>{profile.regCertificate?.issueDate || '14 May 2019'}</Text>
            </View>
            <View style={styles.certStripDivider} />
            <View style={styles.certStripCol}>
              <Text style={styles.certStripLabel}>COUNCIL</Text>
              <Text style={styles.certStripVal} numberOfLines={1}>
                {profile.regCertificate?.council ? (profile.regCertificate.council.includes('India') ? 'MCI / NMC' : 'State SMC') : 'MCI / NMC'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.certCardBtnRow}>
            <TouchableOpacity
              style={styles.certPreviewBtn}
              onPress={() => setCertPreviewModal(true)}
              activeOpacity={0.75}
            >
              <Ionicons name="eye-outline" size={16} color="#071E42" style={{ marginRight: 6 }} />
              <Text style={styles.certPreviewBtnText}>View Certificate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.certUpdateBtn}
              onPress={() => setCertUploadModal(true)}
              activeOpacity={0.75}
            >
              <Ionicons name="cloud-upload-outline" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={styles.certUpdateBtnText}>Update Document</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* =================================================
            CLINIC / HOSPITAL INFO
        ================================================= */}

        <SectionTitle
          icon="business-outline"
          label="Clinic / Hospital Info"
          action="Edit"
          onAction={() => {
            if (clinics.length > 0) {
              openClinicEdit(clinics[0]);
            } else {
              openAddClinic();
            }
          }}
        />

        {clinics.map((item, index) => (

          <Card
            key={item.id}
            style={[
              styles.clinicCard,
              index > 0 && styles.clinicCardSpacing,
            ]}
          >

            {/* CLINIC HEADER */}

            <View style={styles.clinicHeader}>

              <View style={styles.clinicIconBox}>

                <Ionicons
                  name={
                    item.type === 'Hospital'
                      ? 'medkit-outline'
                      : 'business-outline'
                  }
                  size={20}
                  color="#071E42"
                />

              </View>

              <View style={styles.clinicHeaderText}>

                <Text style={styles.clinicType}>
                  {item.type}
                </Text>

                <Text style={styles.clinicName}>
                  {item.name}
                </Text>

              </View>

              {/* INDIVIDUAL EDIT */}

              <TouchableOpacity
                style={styles.smallEditButton}
                onPress={() => openClinicEdit(item)}
                activeOpacity={0.7}
              >

                <Ionicons
                  name="create-outline"
                  size={16}
                  color="#071E42"
                />

                <Text style={styles.smallEditText}>
                  Edit
                </Text>

              </TouchableOpacity>

            </View>

            <InfoRow
              label={`${item.type} Name`}
              value={item.name}
            />

            <InfoRow
              label="Address"
              value={item.address}
              last
            />

          </Card>

        ))}

        {/* =================================================
            ADD CLINIC / HOSPITAL
        ================================================= */}

        <TouchableOpacity
          style={styles.addClinicButton}
          onPress={openAddClinic}
          activeOpacity={0.75}
        >

          <View style={styles.addClinicIcon}>

            <Ionicons
              name="add"
              size={20}
              color="#071E42"
            />

          </View>

          <View style={{ flex: 1 }}>

            <Text style={styles.addClinicTitle}>
              Add Clinic / Hospital
            </Text>

            <Text style={styles.addClinicSubtitle}>
              Add another workplace or consultation location
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={colors.textMuted}
          />

        </TouchableOpacity>

        {/* =================================================
            MANAGE
        ================================================= */}

        <SectionTitle
          icon="apps-outline"
          label="Manage"
        />

        <Card style={{ paddingVertical: 4 }}>

          <MenuRow
            icon="ribbon-outline"
            label="Speciality & Services"
            onPress={() =>
              navigation.navigate('SpecialityServices')
            }
          />

          <MenuRow
            icon="time-outline"
            label="Availability"
            onPress={() =>
              navigation.navigate('Availability')
            }
          />

          <MenuRow
            icon="repeat-outline"
            label="Follow-Ups"
            onPress={() =>
              navigation.navigate('FollowUps')
            }
          />

          <MenuRow
            icon="wallet-outline"
            label="Earnings"
            onPress={() =>
              navigation.navigate('Earnings')
            }
          />

          <MenuRow
            icon="notifications-outline"
            label="Notifications"
            onPress={() =>
              navigation.navigate('Notifications')
            }
            last
          />

        </Card>

        {/* =================================================
            SETTINGS
        ================================================= */}

        <SectionTitle
          icon="settings-outline"
          label="Settings"
        />

        <Card style={{ paddingVertical: 4 }}>

          <MenuRow
            icon="shield-checkmark-outline"
            label="Security & Privacy"
            onPress={() =>
              Alert.alert(
                'Security & Privacy',
                'This section is coming soon.'
              )
            }
          />

          <MenuRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() =>
              Alert.alert(
                'Help & Support',
                'This section is coming soon.'
              )
            }
            last
          />

        </Card>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            try {
              navigation.navigate('RoleSelectionScreen');
            } catch (e) {
              try {
                navigation.navigate('RoleSelection');
              } catch (err) {}
            }
          }}
        >

          <Ionicons
            name="log-out-outline"
            size={18}
            color={colors.danger}
          />

          <Text style={styles.logoutText}>
            Log Out
          </Text>

        </TouchableOpacity>

        <Text style={styles.version}>
          MediUnify Doctor App · v1.0.0
        </Text>

      </ScrollView>

      {/* =====================================================
          PERSONAL INFORMATION MODAL
      ===================================================== */}

      <Modal
        visible={personalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPersonalModal(false)}
      >

        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >

          <View style={styles.modalContainer}>

            <ModalHeader
              title="Edit Personal Information"
              subtitle="Update your personal details"
              onClose={() => setPersonalModal(false)}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
            >

              <FormField
                label="Name"
                value={profile.name}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    name: text,
                  })
                }
                placeholder="Enter name"
              />

              <FormField
                label="Age"
                value={profile.age}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    age: text,
                  })
                }
                placeholder="Enter age"
                keyboardType="numeric"
              />

              <FormField
                label="Mobile Number"
                value={profile.phone}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    phone: text,
                  })
                }
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
              />

              <FormField
                label="Alternate Number"
                value={profile.altPhone}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    altPhone: text,
                  })
                }
                placeholder="Enter alternate number"
                keyboardType="phone-pad"
              />

              <FormField
                label="Email"
                value={profile.email}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    email: text,
                  })
                }
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <SaveButton
                title="Save Personal Information"
                onPress={savePersonal}
              />

            </ScrollView>

          </View>

        </KeyboardAvoidingView>

      </Modal>

      {/* =====================================================
          PROFESSIONAL DETAILS MODAL
      ===================================================== */}

      <Modal
        visible={professionalModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setProfessionalModal(false)
        }
      >

        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >

          <View style={styles.modalContainer}>

            <ModalHeader
              title="Edit Professional Details"
              subtitle="Update your professional information"
              onClose={() =>
                setProfessionalModal(false)
              }
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
            >

              <FormField
                label="Qualification"
                value={profile.qualification}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    qualification: text,
                  })
                }
                placeholder="Enter qualification"
              />

              <FormField
                label="Experience"
                value={profile.experience}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    experience: text,
                  })
                }
                placeholder="Example: 8 years"
              />

              <FormField
                label="Consultation Fee"
                value={profile.fee}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    fee: text,
                  })
                }
                placeholder="Enter consultation fee"
                keyboardType="numeric"
              />

              <FormField
                label="Languages"
                value={profile.languages}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    languages: text,
                  })
                }
                placeholder="Example: English, Hindi, Kannada"
              />

              <FormField
                label="Medical Registration No."
                value={profile.regNo}
                onChangeText={(text) =>
                  setProfile({
                    ...profile,
                    regNo: text,
                  })
                }
                placeholder="Example: MCI-2019-887341"
                autoCapitalize="characters"
              />

              <SaveButton
                title="Save Professional Details"
                onPress={saveProfessional}
              />

            </ScrollView>

          </View>

        </KeyboardAvoidingView>

      </Modal>

      {/* =====================================================
          EDIT CLINIC / HOSPITAL MODAL
      ===================================================== */}

      <Modal
        visible={clinicModal}
        transparent
        animationType="slide"
        onRequestClose={() => setClinicModal(false)}
      >

        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >

          <View style={styles.smallModalContainer}>

            <ModalHeader
              title={`Edit ${clinicForm.type}`}
              subtitle="Update clinic or hospital details"
              onClose={() => setClinicModal(false)}
            />

            <FormField
              label={`${clinicForm.type} Name`}
              value={clinicForm.name}
              onChangeText={(text) =>
                setClinicForm({
                  ...clinicForm,
                  name: text,
                })
              }
              placeholder={`Enter ${clinicForm.type.toLowerCase()} name`}
            />

            <FormField
              label="Address"
              value={clinicForm.address}
              onChangeText={(text) =>
                setClinicForm({
                  ...clinicForm,
                  address: text,
                })
              }
              placeholder="Enter complete address"
              multiline
            />

            <SaveButton
              title={`Save ${clinicForm.type}`}
              onPress={saveClinicEdit}
            />

          </View>

        </KeyboardAvoidingView>

      </Modal>

      {/* =====================================================
          ADD CLINIC / HOSPITAL MODAL
      ===================================================== */}

      <Modal
        visible={addClinicModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setAddClinicModal(false)
        }
      >

        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >

          <View style={styles.smallModalContainer}>

            <ModalHeader
              title="Add Clinic / Hospital"
              subtitle="Add another consultation location"
              onClose={() =>
                setAddClinicModal(false)
              }
            />

            {/* LOCATION TYPE */}

            <Text style={styles.fieldLabel}>
              Location Type
            </Text>

            <View style={styles.typeRow}>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  clinicForm.type === 'Clinic' &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  setClinicForm({
                    ...clinicForm,
                    type: 'Clinic',
                  })
                }
              >

                <Ionicons
                  name="business-outline"
                  size={18}
                  color={
                    clinicForm.type === 'Clinic'
                      ? colors.white
                      : colors.primary
                  }
                />

                <Text
                  style={[
                    styles.typeButtonText,
                    clinicForm.type === 'Clinic' &&
                      styles.typeButtonTextActive,
                  ]}
                >
                  Clinic
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  clinicForm.type === 'Hospital' &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  setClinicForm({
                    ...clinicForm,
                    type: 'Hospital',
                  })
                }
              >

                <Ionicons
                  name="medkit-outline"
                  size={18}
                  color={
                    clinicForm.type === 'Hospital'
                      ? colors.white
                      : colors.primary
                  }
                />

                <Text
                  style={[
                    styles.typeButtonText,
                    clinicForm.type === 'Hospital' &&
                      styles.typeButtonTextActive,
                  ]}
                >
                  Hospital
                </Text>

              </TouchableOpacity>

            </View>

            <FormField
              label={`${clinicForm.type} Name`}
              value={clinicForm.name}
              onChangeText={(text) =>
                setClinicForm({
                  ...clinicForm,
                  name: text,
                })
              }
              placeholder={`Enter ${clinicForm.type.toLowerCase()} name`}
            />

            <FormField
              label="Address"
              value={clinicForm.address}
              onChangeText={(text) =>
                setClinicForm({
                  ...clinicForm,
                  address: text,
                })
              }
              placeholder="Enter complete address"
              multiline
            />

            <SaveButton
              title={`Add ${clinicForm.type}`}
              onPress={saveNewClinic}
            />

          </View>

        </KeyboardAvoidingView>

      </Modal>

      {/* =====================================================
          CERTIFICATE PREVIEW MODAL
      ===================================================== */}
      <Modal
        visible={certPreviewModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCertPreviewModal(false)}
      >
        <View style={styles.certModalOverlay}>
          <View style={styles.certModalContainer}>
            <View style={styles.certModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="ribbon-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.certModalTitle}>Registration Certificate</Text>
              </View>
              <TouchableOpacity onPress={() => setCertPreviewModal(false)} style={styles.certModalCloseBtn}>
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.md }}>
              <View style={styles.certDocPaper}>
                <View style={styles.certDocInnerBorder}>
                  <View style={styles.certSealBadge}>
                    <Ionicons name="shield-checkmark" size={28} color="#b45309" />
                  </View>
                  <Text style={styles.certGovtTitle}>NATIONAL MEDICAL COMMISSION</Text>
                  <Text style={styles.certCouncilSub}>GOVERNMENT OF INDIA · MEDICAL COUNCIL</Text>
                  <Text style={styles.certMainHeading}>CERTIFICATE OF MEDICAL REGISTRATION</Text>

                  <View style={styles.certDividerLine} />

                  <Text style={styles.certCertifiesThat}>This is to certify that</Text>
                  <Text style={styles.certDoctorName}>
                    {profile.name ? (profile.name.startsWith('Dr.') ? profile.name : `Dr. ${profile.name}`) : 'Dr. Ananya Rao'}
                  </Text>

                  <Text style={styles.certCertifiesText}>
                    has been duly admitted and registered on the Medical Register maintained under the Indian Medical Council Act, and is authorized to practice medicine and surgery.
                  </Text>

                  <View style={styles.certInfoRow}>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>REGISTRATION NO.</Text>
                      <Text style={styles.certInfoVal}>{profile.regNo || doctor.regNo}</Text>
                    </View>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>SPECIALIZATION</Text>
                      <Text style={styles.certInfoVal}>{profile.specialization || 'General Physician'}</Text>
                    </View>
                  </View>

                  <View style={styles.certInfoRow}>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>COUNCIL</Text>
                      <Text style={styles.certInfoVal}>{profile.regCertificate?.council || 'Medical Council of India'}</Text>
                    </View>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>REGISTRATION DATE</Text>
                      <Text style={styles.certInfoVal}>{profile.regCertificate?.issueDate || '14 May 2019'}</Text>
                    </View>
                  </View>

                  <View style={styles.certInfoRow}>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>STATUS</Text>
                      <Text style={[styles.certInfoVal, { color: colors.primary }]}>{profile.regCertificate?.status || 'Verified'}</Text>
                    </View>
                    <View style={styles.certInfoCol}>
                      <Text style={styles.certInfoKey}>FILE</Text>
                      <Text style={styles.certInfoVal} numberOfLines={1}>{profile.regCertificate?.name || 'Registration_Certificate.pdf'}</Text>
                    </View>
                  </View>

                  <View style={styles.certSealRow}>
                    <View style={styles.certOfficialStamp}>
                      <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
                      <Text style={styles.certStampText}>SUPER ADMIN VERIFIED CREDENTIALS</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.certModalDoneBtn}
                onPress={() => setCertPreviewModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.certModalDoneBtnText}>Close Preview</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =====================================================
          CERTIFICATE UPDATE / UPLOAD MODAL
      ===================================================== */}
      <Modal
        visible={certUploadModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCertUploadModal(false)}
      >
        <View style={styles.certSheetOverlay}>
          <View style={styles.certSheetContainer}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Update Registration Certificate</Text>
                <Text style={styles.sheetSubtitle}>Upload or select replacement council certificate</Text>
              </View>
              <TouchableOpacity onPress={() => setCertUploadModal(false)} style={styles.sheetCloseBtn}>
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetOptions}>
              <TouchableOpacity
                style={styles.sheetOptionCard}
                onPress={() => handleUpdateCertificate({
                  name: `${(profile.regNo || 'MCI_DOC').replace(/[^a-zA-Z0-9]/g, '_')}_MCI_Certificate.pdf`,
                  size: '1.9 MB',
                  council: 'Medical Council of India (MCI / NMC)',
                  issueDate: '14 May 2019',
                })}
                activeOpacity={0.7}
              >
                <View style={[styles.sheetOptionIcon, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="document-text" size={22} color="#0284c7" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.sheetOptionTitle}>National Medical Commission (MCI / NMC)</Text>
                  <Text style={styles.sheetOptionDesc}>Official central council certificate (PDF)</Text>
                </View>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetOptionCard}
                onPress={() => handleUpdateCertificate({
                  name: `${(profile.regNo || 'SMC_DOC').replace(/[^a-zA-Z0-9]/g, '_')}_State_Council_Cert.pdf`,
                  size: '2.4 MB',
                  council: 'State Medical Council (Karnataka / Delhi / Maharashtra)',
                  issueDate: '08 Aug 2021',
                })}
                activeOpacity={0.7}
              >
                <View style={[styles.sheetOptionIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="ribbon" size={22} color="#d97706" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.sheetOptionTitle}>State Medical Council (SMC)</Text>
                  <Text style={styles.sheetOptionDesc}>State medical council license / certificate</Text>
                </View>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetOptionCard}
                onPress={() => handleUpdateCertificate({
                  name: `Dr_${(profile.name || 'Doctor').replace(/[^a-zA-Z0-9]/g, '_')}_Certificate_Scanned.png`,
                  size: '1.5 MB',
                  council: 'Medical Council of India',
                  issueDate: '12 Jan 2024',
                })}
                activeOpacity={0.7}
              >
                <View style={[styles.sheetOptionIcon, { backgroundColor: '#dcfce7' }]}>
                  <Ionicons name="image" size={22} color="#16a34a" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.sheetOptionTitle}>Scanned Document (PNG / JPG)</Text>
                  <Text style={styles.sheetOptionDesc}>High-resolution physical certificate scan</Text>
                </View>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setCertUploadModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  icon,
  label,
  action,
  onAction,
}) {
  return (
    <View style={styles.sectionTitleRow}>

      <View style={styles.sectionTitleLeft}>

        <Ionicons
          name={icon}
          size={15}
          color="#071E42"
        />

        <Text style={styles.sectionTitle}>
          {label}
        </Text>

      </View>

      {action && (
        <TouchableOpacity
          style={styles.sectionEditButton}
          onPress={onAction}
          activeOpacity={0.7}
        >

          <Ionicons
            name="create-outline"
            size={15}
            color="#071E42"
          />

          <Text style={styles.sectionEditText}>
            {action}
          </Text>

        </TouchableOpacity>
      )}

    </View>
  );
}


/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({ label, value, last }) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && styles.infoRowBorder,
      ]}
    >

      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value || 'Not provided'}
      </Text>

    </View>
  );
}


/* =========================================================
   MENU ROW
========================================================= */

function MenuRow({
  icon,
  label,
  onPress,
  last,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.menuRow,
        !last && styles.menuRowBorder,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >

      <View style={styles.menuIconWrap}>

        <Ionicons
          name={icon}
          size={17}
          color="#071E42"
        />

      </View>

      <Text style={styles.menuLabel}>
        {label}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textMuted}
      />

    </TouchableOpacity>
  );
}


/* =========================================================
   MODAL HEADER
========================================================= */

function ModalHeader({
  title,
  subtitle,
  onClose,
}) {
  return (
    <View style={styles.modalHeader}>

      <View style={{ flex: 1 }}>

        <Text style={styles.modalTitle}>
          {title}
        </Text>

        <Text style={styles.modalSubtitle}>
          {subtitle}
        </Text>

      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
      >

        <Ionicons
          name="close"
          size={22}
          color={colors.textPrimary}
        />

      </TouchableOpacity>

    </View>
  );
}


/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  multiline,
}) {
  return (
    <View style={styles.formField}>

      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'sentences'}
        multiline={multiline}
        style={[
          styles.formInput,
          multiline && styles.multilineInput,
        ]}
      />

    </View>
  );
}


/* =========================================================
   SAVE BUTTON
========================================================= */

function SaveButton({
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.saveButton}
      onPress={onPress}
      activeOpacity={0.8}
    >

      <Ionicons
        name="checkmark-circle-outline"
        size={20}
        color={colors.white}
      />

      <Text style={styles.saveButtonText}>
        {title}
      </Text>

    </TouchableOpacity>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =========================
     HEADER
  ========================= */

  header: {
    backgroundColor: '#061A3A',

    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + 16
        : 56,

    paddingBottom: 28,
    paddingHorizontal: spacing.lg,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  brandName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  brandMedi: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  brandUnify: {
    color: '#00B894',
    fontWeight: '800',
  },

  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#061A3A',
  },

  /* =========================
     DOCTOR PROFILE
  ========================= */

  avatarBlock: {
    alignItems: 'center',
    marginTop: spacing.md,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#38BDF8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  doctorImage: {
    width: '100%',
    height: '100%',
  },

  name: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  spec: {
    ...typography.small,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },

  regBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    marginTop: 10,
  },

  regText: {
    ...typography.tiny,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  /* =========================
     SECTION TITLE
  ========================= */

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  sectionTitle: {
    ...typography.h3,
    fontSize: 15,
    color: '#071E42',
    fontWeight: '700',
  },

  sectionEditButton: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 4,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: radius.pill,

    backgroundColor: '#EEF4FC',
  },

  sectionEditText: {
    ...typography.smallBold,
    color: '#071E42',
  },

  /* =========================
     INFO
  ========================= */

  infoRow: {
    paddingVertical: 10,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  infoLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },

  infoValue: {
    ...typography.smallBold,
    color: colors.textPrimary,
    marginTop: 3,
  },

  /* =========================
     CLINIC
  ========================= */

  clinicCard: {
    paddingTop: 12,
  },

  clinicCardSpacing: {
    marginTop: spacing.sm,
  },

  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 5,
  },

  clinicIconBox: {
    width: 40,
    height: 40,

    borderRadius: 12,

    backgroundColor: '#EEF4FC',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  clinicHeaderText: {
    flex: 1,
  },

  clinicType: {
    ...typography.tiny,
    color: '#071E42',
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  clinicName: {
    ...typography.smallBold,
    color: colors.textPrimary,
    marginTop: 2,
  },

  smallEditButton: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 3,

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: radius.pill,

    backgroundColor: '#EEF4FC',
  },

  smallEditText: {
    ...typography.tiny,
    color: '#071E42',
    fontWeight: '600',
  },

  /* =========================
     ADD CLINIC
  ========================= */

  addClinicButton: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#EEF4FC',

    borderWidth: 1,
    borderColor: '#CBD5E1',

    borderRadius: radius.md,

    padding: 13,

    marginTop: spacing.sm,

    gap: 10,
  },

  addClinicIcon: {
    width: 36,
    height: 36,

    borderRadius: 10,

    backgroundColor: colors.white,

    alignItems: 'center',
    justifyContent: 'center',
  },

  addClinicTitle: {
    ...typography.smallBold,
    color: '#071E42',
  },

  addClinicSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* =========================
     MENU
  ========================= */

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 14,

    gap: 12,
  },

  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  menuIconWrap: {
    width: 32,
    height: 32,

    borderRadius: 10,

    backgroundColor: colors.primarySurface,

    alignItems: 'center',
    justifyContent: 'center',
  },

  menuLabel: {
    flex: 1,

    ...typography.small,

    color: colors.textPrimary,
  },

  /* =========================
     LOGOUT
  ========================= */

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    marginTop: spacing.xl,

    paddingVertical: 14,
  },

  logoutText: {
    ...typography.bodyBold,
    color: colors.danger,
  },

  version: {
    ...typography.tiny,
    color: colors.textMuted,

    textAlign: 'center',

    marginTop: spacing.md,
  },

  /* =========================
     MODAL
  ========================= */

  modalOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.45)',

    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: colors.white,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    paddingHorizontal: spacing.lg,
    paddingTop: 18,

    maxHeight: '92%',
  },

  smallModalContainer: {
    backgroundColor: colors.white,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    paddingHorizontal: spacing.lg,
    paddingTop: 18,
    paddingBottom: 24,

    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 14,
  },

  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },

  modalSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 3,
  },

  closeButton: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: colors.primarySurface,

    alignItems: 'center',
    justifyContent: 'center',
  },

  /* =========================
     FORM
  ========================= */

  formField: {
    marginBottom: 13,
  },

  fieldLabel: {
    ...typography.smallBold,
    color: colors.textPrimary,

    marginBottom: 6,
  },

  formInput: {
    minHeight: 46,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.md,

    paddingHorizontal: 13,
    paddingVertical: 10,

    color: colors.textPrimary,

    backgroundColor: colors.white,

    ...typography.small,
  },

  multilineInput: {
    minHeight: 85,
    textAlignVertical: 'top',
  },

  /* =========================
     TYPE
  ========================= */

  typeRow: {
    flexDirection: 'row',

    gap: 10,

    marginBottom: 14,
  },

  typeButton: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    minHeight: 44,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.md,

    backgroundColor: colors.white,
  },

  typeButtonActive: {
    backgroundColor: '#071E42',
    borderColor: '#071E42',
  },

  typeButtonText: {
    ...typography.smallBold,
    color: '#071E42',
  },

  typeButtonTextActive: {
    color: colors.white,
  },

  /* =========================
     SAVE
  ========================= */

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    backgroundColor: '#071E42',

    minHeight: 50,

    borderRadius: radius.md,

    marginTop: 8,
    marginBottom: 10,
  },

  saveButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },

  /* =========================
     CERTIFICATE SECTION STYLES
  ========================= */

  certCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  certCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  certIconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: '#EEF4FC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  certTypePill: {
    position: 'absolute',
    bottom: -3,
    backgroundColor: '#071E42',
    paddingHorizontal: 4,
    borderRadius: 3,
  },

  certTypePillText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '800',
  },

  certCouncilHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#071E42',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  certFileName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
    marginTop: 1,
  },

  certFileMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  certStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.full,
  },

  certStatusVerified: {
    backgroundColor: '#dcfce7',
  },

  certStatusPending: {
    backgroundColor: '#fef3c7',
  },

  certStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },

  certInfoStrip: {
    flexDirection: 'row',
    backgroundColor: colors.primarySurface,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: spacing.md,
    alignItems: 'center',
  },

  certStripCol: {
    flex: 1,
  },

  certStripLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },

  certStripVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },

  certStripDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },

  certCardBtnRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: 10,
  },

  certPreviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },

  certPreviewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  certUpdateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  certUpdateBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Preview Modal
  certModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 33, 31, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  certModalContainer: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '92%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },

  certModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  certModalTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },

  certModalCloseBtn: {
    padding: 4,
  },

  certDocPaper: {
    backgroundColor: '#fffdf7',
    borderWidth: 2,
    borderColor: '#d4af37',
    borderRadius: 8,
    padding: 8,
  },

  certDocInnerBorder: {
    borderWidth: 1,
    borderColor: '#e8d595',
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: spacing.md,
    alignItems: 'center',
  },

  certSealBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },

  certGovtTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#92400e',
  },

  certCouncilSub: {
    fontSize: 9,
    color: '#b45309',
    marginTop: 2,
    letterSpacing: 0.5,
  },

  certMainHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 8,
    letterSpacing: 1,
  },

  certDividerLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#e8d595',
    marginVertical: 12,
  },

  certCertifiesThat: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },

  certDoctorName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 4,
    textAlign: 'center',
  },

  certCertifiesText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },

  certInfoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1ebd2',
  },

  certInfoCol: {
    flex: 1,
  },

  certInfoKey: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },

  certInfoVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },

  certSealRow: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },

  certOfficialStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#86efac',
  },

  certStampText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803d',
    marginLeft: 4,
    letterSpacing: 0.5,
  },

  certModalDoneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },

  certModalDoneBtnText: {
    color: colors.white,
    ...typography.bodyBold,
  },

  // Sheet Modal
  certSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 33, 31, 0.65)',
    justifyContent: 'flex-end',
  },

  certSheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },

  sheetTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  sheetSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },

  sheetCloseBtn: {
    padding: 4,
  },

  sheetOptions: {
    gap: spacing.sm,
  },

  sheetOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    padding: spacing.md,
  },

  sheetOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sheetOptionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
  },

  sheetOptionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  sheetCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sheetCancelBtnText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },

});