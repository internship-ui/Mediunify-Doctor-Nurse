import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';
import ResponseModal from '../components/ResponseModal';
import { doctor } from '../../data/mockData';

export default function DoctorProfilePage({ setActiveTab, onNavigateHome }) {
  // Doctor Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    name: doctor.name || 'Dr. Ananya Rao',
    age: '34 years',
    mobile: doctor.phone || '+91 98450 12345',
    alternateMobile: doctor.altPhone || '+91 90000 11223',
    email: doctor.email || 'ananya.rao@mediunify.com',
  });

  // Doctor Professional Details
  const [professionalDetails, setProfessionalDetails] = useState({
    qualification: doctor.qualification || 'MBBS, MD (Internal Medicine)',
    specialization: doctor.specialization || 'General Physician',
    experience: doctor.experience || '9 years',
    consultationFee: '₹450',
    registrationNo: doctor.regNo || 'MCI-2019-887341',
    languages: doctor.languages ? doctor.languages.join(', ') : 'English, Hindi, Kannada',
  });

  // Registration Certificate
  const [certificateInfo, setCertificateInfo] = useState({
    authority: 'MEDICAL COUNCIL OF INDIA',
    fileName: 'MCI_Registration_Certificate_2019.pdf',
    fileSize: '1.8 MB · 12 Jan 2026',
    regNo: 'MCI-2019-887341',
    issueDate: '14 May 2019',
    council: 'MCI / NMC',
    status: 'Verified',
  });

  // Clinics List
  const [clinicsList, setClinicsList] = useState([
    {
      id: 1,
      type: 'CLINIC',
      name: doctor.clinic || 'Unify Health Clinic',
      address: doctor.clinicAddress || '4th Block, Indiranagar, Bengaluru',
    },
  ]);

  // Modal Editing States
  const [editModalMode, setEditModalMode] = useState(null); // 'personal' | 'professional' | 'editClinic' | 'addClinic' | 'viewCert' | 'updateCert' | 'speciality' | 'notifications' | 'security' | 'help' | 'logoutConfirm'
  const [selectedClinicIndex, setSelectedClinicIndex] = useState(0);

  // Form States
  const [editPersonalForm, setEditPersonalForm] = useState({ ...personalInfo });
  const [editProfForm, setEditProfForm] = useState({ ...professionalDetails });
  const [clinicForm, setClinicForm] = useState({ name: '', address: '' });
  const [newCertForm, setNewCertForm] = useState({
    fileName: 'MCI_Renewal_Certificate_2026.pdf',
    regNo: 'MCI-2019-887341',
    issueDate: '01 Feb 2026',
    council: 'National Medical Commission (NMC)',
  });

  // Response Confirmation Popup
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

  // Handlers
  const handleSavePersonal = () => {
    setPersonalInfo({ ...editPersonalForm });
    setEditModalMode(null);
    showPopup(
      'Personal Information Updated',
      'Doctor contact numbers and email address have been saved successfully.',
      [
        `Name: ${editPersonalForm.name}`,
        `Mobile: ${editPersonalForm.mobile}`,
        `Email: ${editPersonalForm.email}`,
      ],
      'success'
    );
  };

  const handleSaveProfessional = () => {
    setProfessionalDetails({ ...editProfForm });
    setEditModalMode(null);
    showPopup(
      'Professional Details Updated',
      'Clinical qualifications, experience, and consultation fees updated.',
      [
        `Qualification: ${editProfForm.qualification}`,
        `Experience: ${editProfForm.experience}`,
        `Consultation Fee: ${editProfForm.consultationFee}`,
        `Languages: ${editProfForm.languages}`,
      ],
      'success'
    );
  };

  const handleOpenEditClinic = (index) => {
    setSelectedClinicIndex(index);
    setClinicForm({
      name: clinicsList[index].name,
      address: clinicsList[index].address,
    });
    setEditModalMode('editClinic');
  };

  const handleSaveEditClinic = () => {
    const updated = [...clinicsList];
    updated[selectedClinicIndex] = {
      ...updated[selectedClinicIndex],
      name: clinicForm.name,
      address: clinicForm.address,
    };
    setClinicsList(updated);
    setEditModalMode(null);
    showPopup(
      'Clinic Information Updated',
      'Primary consultation clinic address and name have been saved.',
      [`Clinic: ${clinicForm.name}`, `Address: ${clinicForm.address}`],
      'success'
    );
  };

  const handleOpenAddClinic = () => {
    setClinicForm({ name: '', address: '' });
    setEditModalMode('addClinic');
  };

  const handleSaveAddClinic = () => {
    if (!clinicForm.name.trim() || !clinicForm.address.trim()) {
      alert('Please enter both clinic name and address.');
      return;
    }
    const newEntry = {
      id: Date.now(),
      type: 'CLINIC / HOSPITAL',
      name: clinicForm.name.trim(),
      address: clinicForm.address.trim(),
    };
    setClinicsList([...clinicsList, newEntry]);
    setEditModalMode(null);
    showPopup(
      'New Location Added',
      'New consultation clinic location added to your medical practice.',
      [`Name: ${newEntry.name}`, `Address: ${newEntry.address}`],
      'success'
    );
  };

  const handleSaveUpdateCert = () => {
    setCertificateInfo({
      ...certificateInfo,
      fileName: newCertForm.fileName,
      regNo: newCertForm.regNo,
      issueDate: newCertForm.issueDate,
      council: newCertForm.council,
      fileSize: '2.1 MB · Today',
    });
    setEditModalMode(null);
    showPopup(
      'Certificate Submitted',
      'Your updated medical registration certificate has been uploaded and submitted for council re-verification.',
      [
        `Document: ${newCertForm.fileName}`,
        `Registration: ${newCertForm.regNo}`,
        `Council: ${newCertForm.council}`,
      ],
      'success'
    );
  };

  const handleConfirmLogout = () => {
    setEditModalMode(null);
    showPopup(
      'Logged Out Successfully',
      'You have been logged out of the MediUnify Doctor Portal. Your EHR session is securely ended.',
      ['Session closed', 'EHR records locked'],
      'info'
    );
    if (onNavigateHome) {
      setTimeout(() => onNavigateHome(), 1200);
    }
  };

  return (
    <View style={styles.pageRoot}>
      {/* 1. MAIN SCROLLABLE CONTENT (Cards extended to end of screen) */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO BANNER PROFILE CARD (Matching user image) */}
        <View style={styles.heroProfileCard}>
          {/* Top Banner with soft purple / lavender abstract artwork styling */}
          <View style={styles.heroBannerArea}>
            <View style={styles.heroBannerDecorCircle1} />
            <View style={styles.heroBannerDecorCircle2} />
            <View style={styles.heroBannerWave1} />
            <View style={styles.heroBannerWave2} />
          </View>

          {/* Lower White Section: Left Stats, Center Avatar & Name, Right Actions */}
          <View style={styles.heroBottomBar}>
            {/* Left Stats Row (Matching image: 938 Consults, 3,586 Patients, 9+ Yrs Experience) */}
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <View style={styles.heroStatIconCircle}>
                  <Ionicons name="document-text-outline" size={15} color="#475569" />
                </View>
                <Text style={styles.heroStatNumber}>938</Text>
                <Text style={styles.heroStatLabel}>Consults</Text>
              </View>

              <View style={styles.heroStatItem}>
                <View style={styles.heroStatIconCircle}>
                  <Ionicons name="people-outline" size={15} color="#475569" />
                </View>
                <Text style={styles.heroStatNumber}>3,586</Text>
                <Text style={styles.heroStatLabel}>Patients</Text>
              </View>

              <View style={styles.heroStatItem}>
                <View style={styles.heroStatIconCircle}>
                  <Ionicons name="ribbon-outline" size={15} color="#475569" />
                </View>
                <Text style={styles.heroStatNumber}>9+ Yrs</Text>
                <Text style={styles.heroStatLabel}>Experience</Text>
              </View>
            </View>

            {/* Center Doctor Avatar & Name (Overlapping the banner) */}
            <View style={styles.heroCenterInfo}>
              <View style={styles.heroAvatarContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=240',
                  }}
                  style={styles.heroAvatarImg}
                />
              </View>
              <Text style={styles.heroDoctorName}>{personalInfo.name}</Text>
              <Text style={styles.heroDoctorRole}>{professionalDetails.specialization}</Text>
              <View style={styles.heroVerifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#00B894" />
                <Text style={styles.heroVerifiedText}>
                  {professionalDetails.registrationNo} · Verified
                </Text>
              </View>
            </View>

            {/* Right Action Icons & Primary Button */}
            <View style={styles.heroActionsRow}>
              <TouchableOpacity
                style={[styles.heroIconBadge, { backgroundColor: '#EFF6FF' }]}
                onPress={() =>
                  showPopup(
                    'Doctor Support Helpline',
                    'Emergency physician priority helpline: 1800-UNIFY-CARE (24x7 toll-free).',
                    ['Doctor Tele-Triage Desk', 'Technical EHR Support'],
                    'info'
                  )
                }
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={15} color="#2563EB" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.heroIconBadge, { backgroundColor: '#F0FDF4' }]}
                onPress={() =>
                  showPopup(
                    'Doctor Communication Desk',
                    'Official clinic communication mailbox: doctor.care@mediunify.com',
                    ['Secure NHS/MCI encrypted inbox'],
                    'info'
                  )
                }
                activeOpacity={0.8}
              >
                <Ionicons name="mail" size={15} color="#16A34A" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.heroIconBadge, { backgroundColor: '#FDF2F8' }]}
                onPress={() =>
                  showPopup(
                    'Doctor Notifications',
                    'All patient consultation updates and lab test notifications are active.',
                    ['2 new follow-ups scheduled for today', '1 pending lab report received'],
                    'info'
                  )
                }
                activeOpacity={0.8}
              >
                <Ionicons name="notifications" size={15} color="#DB2777" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.heroIconBadge, { backgroundColor: '#FEF3C7' }]}
                onPress={() => setEditModalMode('security')}
                activeOpacity={0.8}
              >
                <Ionicons name="shield-checkmark" size={15} color="#D97706" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.heroPrimaryBtn}
                onPress={() => {
                  setEditPersonalForm({ ...personalInfo });
                  setEditModalMode('personal');
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="create-outline" size={14} color="#FFFFFF" />
                <Text style={styles.heroPrimaryBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* CARD 1: Personal Information (Matching Screenshot 1) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleGroup}>
              <Ionicons name="person-outline" size={15} color="#081E3E" />
              <Text style={styles.sectionHeaderTitle}>Personal Information</Text>
            </View>

            <TouchableOpacity
              style={styles.editActionBtn}
              onPress={() => {
                setEditPersonalForm({ ...personalInfo });
                setEditModalMode('personal');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={13} color="#081E3E" />
              <Text style={styles.editActionBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldsList}>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Name</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.name}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Age</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.age}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Mobile Number</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.mobile}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Alternate Number</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.alternateMobile}</Text>
            </View>

            <View style={[styles.fieldItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.fieldItemLabel}>Email</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.email}</Text>
            </View>
          </View>
        </View>

        {/* CARD 2: Professional Details (Matching Screenshot 1) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleGroup}>
              <Ionicons name="briefcase-outline" size={15} color="#081E3E" />
              <Text style={styles.sectionHeaderTitle}>Professional Details</Text>
            </View>

            <TouchableOpacity
              style={styles.editActionBtn}
              onPress={() => {
                setEditProfForm({ ...professionalDetails });
                setEditModalMode('professional');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={13} color="#081E3E" />
              <Text style={styles.editActionBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldsList}>
            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Qualification</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.qualification}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Experience</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.experience}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Consultation Fee</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.consultationFee}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Medical Registration No.</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.registrationNo}</Text>
            </View>

            <View style={[styles.fieldItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.fieldItemLabel}>Languages</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.languages}</Text>
            </View>
          </View>
        </View>

        {/* CARD 3: Registration Certificate (Matching Screenshot 1 & 2) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleGroup}>
              <Ionicons name="ribbon-outline" size={15} color="#081E3E" />
              <Text style={styles.sectionHeaderTitle}>Registration Certificate</Text>
            </View>

            <TouchableOpacity
              style={styles.editActionBtn}
              onPress={() => setEditModalMode('updateCert')}
              activeOpacity={0.8}
            >
              <Ionicons name="cloud-upload-outline" size={13} color="#081E3E" />
              <Text style={styles.editActionBtnText}>Update</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.certDossierCard}>
            {/* Top Doc Row */}
            <View style={styles.certHeaderRow}>
              <View style={styles.certDocIcon}>
                <Ionicons name="document-text" size={22} color="#081E3E" />
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.certAuthorityText}>{certificateInfo.authority}</Text>
                <Text style={styles.certFileNameText}>{certificateInfo.fileName}</Text>
                <Text style={styles.certFileSizeText}>{certificateInfo.fileSize}</Text>
              </View>

              <View style={styles.verifiedGreenBadge}>
                <Ionicons name="checkmark" size={12} color="#15803D" />
                <Text style={styles.verifiedGreenBadgeText}>Verified</Text>
              </View>
            </View>

            {/* 3 Columns Metadata Box (Soft Mint Tint) */}
            <View style={styles.certMetaThreeCols}>
              <View style={styles.certCol}>
                <Text style={styles.certColLabel}>REGISTRATION NO.</Text>
                <Text style={styles.certColValue}>{certificateInfo.regNo}</Text>
              </View>

              <View style={styles.certCol}>
                <Text style={styles.certColLabel}>ISSUE DATE</Text>
                <Text style={styles.certColValue}>{certificateInfo.issueDate}</Text>
              </View>

              <View style={styles.certCol}>
                <Text style={styles.certColLabel}>COUNCIL</Text>
                <Text style={styles.certColValue}>{certificateInfo.council}</Text>
              </View>
            </View>

            {/* Action Buttons Row */}
            <View style={styles.certActionButtonsRow}>
              <TouchableOpacity
                style={styles.viewCertBtn}
                onPress={() => setEditModalMode('viewCert')}
                activeOpacity={0.85}
              >
                <Ionicons name="eye-outline" size={14} color="#00B894" />
                <Text style={styles.viewCertBtnText}>View Certificate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.updateDocBtn}
                onPress={() => setEditModalMode('updateCert')}
                activeOpacity={0.85}
              >
                <Ionicons name="cloud-upload-outline" size={14} color="#64748B" />
                <Text style={styles.updateDocBtnText}>Update Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CARD 4: Clinic / Hospital Info (Matching Screenshot 2) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleGroup}>
              <Ionicons name="business-outline" size={15} color="#081E3E" />
              <Text style={styles.sectionHeaderTitle}>Clinic / Hospital Info</Text>
            </View>

            <TouchableOpacity
              style={styles.editActionBtn}
              onPress={() => handleOpenEditClinic(0)}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={13} color="#081E3E" />
              <Text style={styles.editActionBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.clinicInfoContainer}>
            {/* Registered Clinics */}
            {clinicsList.map((clinic, idx) => (
              <View key={clinic.id || idx} style={styles.clinicCardTop}>
                <View style={styles.clinicCardHeaderRow}>
                  <View style={styles.clinicHeaderLeft}>
                    <Ionicons name="business" size={14} color="#081E3E" />
                    <Text style={styles.clinicBadgeLabel}>{clinic.type || 'CLINIC'}</Text>
                    <Text style={styles.clinicNameBold}>{clinic.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleOpenEditClinic(idx)} activeOpacity={0.7}>
                    <Text style={styles.clinicEditLink}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.clinicFieldsList}>
                  <View style={styles.fieldItem}>
                    <Text style={styles.fieldItemLabel}>Clinic Name</Text>
                    <Text style={styles.fieldItemValue}>{clinic.name}</Text>
                  </View>

                  <View style={[styles.fieldItem, { borderBottomWidth: 0 }]}>
                    <Text style={styles.fieldItemLabel}>Address</Text>
                    <Text style={styles.fieldItemValue}>{clinic.address}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* + Add Clinic / Hospital Button (Matching Screenshot 2) */}
            <TouchableOpacity
              style={styles.addClinicRowBtn}
              onPress={handleOpenAddClinic}
              activeOpacity={0.85}
            >
              <View style={styles.addClinicLeft}>
                <View style={styles.addClinicIconBox}>
                  <Ionicons name="add" size={18} color="#081E3E" />
                </View>
                <View>
                  <Text style={styles.addClinicTitle}>Add Clinic / Hospital</Text>
                  <Text style={styles.addClinicSub}>
                    Add another workspace or consultation location
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD 5: Manage (Matching Screenshot 2) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleGroup}>
              <Ionicons name="grid-outline" size={15} color="#081E3E" />
              <Text style={styles.sectionHeaderTitle}>Manage</Text>
            </View>
          </View>

          <View style={styles.navMenuCard}>
            {/* Speciality & Services */}
            <TouchableOpacity
              style={styles.navMenuItem}
              onPress={() => setEditModalMode('speciality')}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="medkit-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Speciality & Services</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Availability */}
            <TouchableOpacity
              style={styles.navMenuItem}
              onPress={() => (setActiveTab ? setActiveTab('availability') : null)}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="time-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Availability</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Follow-ups */}
            <TouchableOpacity
              style={styles.navMenuItem}
              onPress={() => (setActiveTab ? setActiveTab('followups') : null)}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="sync-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Follow-ups</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Earnings */}
            <TouchableOpacity
              style={styles.navMenuItem}
              onPress={() => (setActiveTab ? setActiveTab('earnings') : null)}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="card-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Earnings</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              style={[styles.navMenuItem, { borderBottomWidth: 0 }]}
              onPress={() => setEditModalMode('notifications')}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="notifications-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD 6: Settings (Matching Screenshot 2) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleGroup}>
              <Ionicons name="settings-outline" size={15} color="#081E3E" />
              <Text style={styles.sectionHeaderTitle}>Settings</Text>
            </View>
          </View>

          <View style={styles.navMenuCard}>
            {/* Security & Privacy */}
            <TouchableOpacity
              style={styles.navMenuItem}
              onPress={() => setEditModalMode('security')}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Security & Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Help & Support */}
            <TouchableOpacity
              style={[styles.navMenuItem, { borderBottomWidth: 0 }]}
              onPress={() => setEditModalMode('help')}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="help-buoy-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOG OUT BUTTON & VERSION TEXT (Matching Screenshot 2) */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setEditModalMode('logoutConfirm')}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={16} color="#EF4444" />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>MediUnify Doctor App · v1.5.0</Text>
        </View>
      </ScrollView>

      {/* ============================================================== */}
      {/* MODAL 1: EDIT PERSONAL INFORMATION                            */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'personal'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Personal Information</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Doctor Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.name}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, name: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Age</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.age}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, age: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Mobile Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.mobile}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, mobile: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Alternate Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.alternateMobile}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, alternateMobile: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Email Address</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.email}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, email: v })}
                />
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalMode(null)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSavePersonal}>
                <Text style={styles.modalSaveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 2: EDIT PROFESSIONAL DETAILS                            */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'professional'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Professional Details</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Qualification</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.qualification}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, qualification: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Specialization</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.specialization}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, specialization: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Years of Experience</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.experience}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, experience: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Consultation Fee</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.consultationFee}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, consultationFee: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Medical Registration No.</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.registrationNo}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, registrationNo: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Languages Spoken</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.languages}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, languages: v })}
                />
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalMode(null)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveProfessional}>
                <Text style={styles.modalSaveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 3: EDIT CLINIC INFO                                      */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'editClinic'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Clinic Information</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Clinic / Hospital Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={clinicForm.name}
                  onChangeText={(v) => setClinicForm({ ...clinicForm, name: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Address</Text>
                <TextInput
                  style={styles.modalInput}
                  value={clinicForm.address}
                  onChangeText={(v) => setClinicForm({ ...clinicForm, address: v })}
                />
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalMode(null)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveEditClinic}>
                <Text style={styles.modalSaveBtnText}>Save Clinic Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 4: ADD CLINIC / HOSPITAL                                 */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'addClinic'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Add Clinic / Hospital</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Clinic or Hospital Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Apollo Spectra / City Heart Clinic"
                  value={clinicForm.name}
                  onChangeText={(v) => setClinicForm({ ...clinicForm, name: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Complete Address & Landmark</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 12th Main Road, HAL 2nd Stage, Bengaluru"
                  value={clinicForm.address}
                  onChangeText={(v) => setClinicForm({ ...clinicForm, address: v })}
                />
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalMode(null)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveAddClinic}>
                <Text style={styles.modalSaveBtnText}>Add Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 5: VIEW CERTIFICATE MODAL                                */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'viewCert'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalWindow, { maxWidth: 560 }]}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Medical Registration Certificate</Text>
                <Text style={{ fontSize: 11, color: '#64748B' }}>
                  {certificateInfo.fileName} · Verified
                </Text>
              </View>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.certViewerBox}>
              <Ionicons name="ribbon" size={44} color="#00B894" />
              <Text style={styles.certViewerTitle}>{certificateInfo.authority}</Text>
              <Text style={styles.certViewerSub}>Certificate of Permanent Medical Registration</Text>
              <Text style={styles.certViewerName}>{personalInfo.name}</Text>
              <Text style={styles.certViewerDetails}>
                Registration No: {certificateInfo.regNo} · Date: {certificateInfo.issueDate}
              </Text>
              <Text style={styles.certViewerDetails}>Council: {certificateInfo.council}</Text>
              <View style={styles.certSealBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#00B894" />
                <Text style={styles.certSealText}>OFFICIAL REGISTRATION VERIFIED</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={() => setEditModalMode(null)}
            >
              <Text style={styles.modalSaveBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 6: UPDATE CERTIFICATE DOCUMENT                           */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'updateCert'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Update Registration Certificate</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Document File Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newCertForm.fileName}
                  onChangeText={(v) => setNewCertForm({ ...newCertForm, fileName: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Medical Registration Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newCertForm.regNo}
                  onChangeText={(v) => setNewCertForm({ ...newCertForm, regNo: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Issue / Renewal Date</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newCertForm.issueDate}
                  onChangeText={(v) => setNewCertForm({ ...newCertForm, issueDate: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Council / Regulatory Authority</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newCertForm.council}
                  onChangeText={(v) => setNewCertForm({ ...newCertForm, council: v })}
                />
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalMode(null)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveUpdateCert}>
                <Text style={styles.modalSaveBtnText}>Submit Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 7: SPECIALITY & SERVICES                                  */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'speciality'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Speciality & Clinical Services</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.infoRowPill}>
                <Ionicons name="checkmark-circle" size={16} color="#00B894" />
                <View>
                  <Text style={styles.infoRowTitle}>General Physician Consultation</Text>
                  <Text style={styles.infoRowDesc}>In-person clinic & video tele-consultations</Text>
                </View>
              </View>

              <View style={styles.infoRowPill}>
                <Ionicons name="checkmark-circle" size={16} color="#00B894" />
                <View>
                  <Text style={styles.infoRowTitle}>Internal Medicine Review</Text>
                  <Text style={styles.infoRowDesc}>Diagnostic pathology & medication plan</Text>
                </View>
              </View>

              <View style={styles.infoRowPill}>
                <Ionicons name="checkmark-circle" size={16} color="#00B894" />
                <View>
                  <Text style={styles.infoRowTitle}>Hypertension & Diabetes Care</Text>
                  <Text style={styles.infoRowDesc}>Chronic condition regular follow-up protocol</Text>
                </View>
              </View>

              <View style={styles.infoRowPill}>
                <Ionicons name="checkmark-circle" size={16} color="#00B894" />
                <View>
                  <Text style={styles.infoRowTitle}>Emergency Tele-Triage</Text>
                  <Text style={styles.infoRowDesc}>Priority patient triage & quick consultation</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => setEditModalMode(null)}>
              <Text style={styles.modalSaveBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 8: NOTIFICATION PREFERENCES                               */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'notifications'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Doctor Notification Alerts</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoRowTitle}>Appointment Reminders</Text>
                  <Text style={styles.infoRowDesc}>Instant SMS & push alert before consultation</Text>
                </View>
                <Ionicons name="toggle" size={28} color="#00B894" />
              </View>

              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoRowTitle}>Lab Reports Upload Alert</Text>
                  <Text style={styles.infoRowDesc}>Notify when patient or diagnostic centre uploads report</Text>
                </View>
                <Ionicons name="toggle" size={28} color="#00B894" />
              </View>

              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoRowTitle}>Emergency Tele-Triage Call</Text>
                  <Text style={styles.infoRowDesc}>High priority ring for urgent patient cases</Text>
                </View>
                <Ionicons name="toggle" size={28} color="#00B894" />
              </View>
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => setEditModalMode(null)}>
              <Text style={styles.modalSaveBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 9: SECURITY & PRIVACY                                     */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'security'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Security & Privacy</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.infoRowPill}>
                <Ionicons name="shield-checkmark" size={18} color="#00B894" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoRowTitle}>256-bit AES Clinical Encryption</Text>
                  <Text style={styles.infoRowDesc}>All patient consult notes and prescriptions encrypted end-to-end.</Text>
                </View>
              </View>

              <View style={styles.infoRowPill}>
                <Ionicons name="lock-closed" size={18} color="#00B894" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoRowTitle}>Two-Factor Authentication (2FA)</Text>
                  <Text style={styles.infoRowDesc}>OTP verification active on your registered mobile number.</Text>
                </View>
              </View>

              <View style={styles.infoRowPill}>
                <Ionicons name="checkmark-done-circle" size={18} color="#00B894" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoRowTitle}>NMC & Telemedicine Guidelines Compliant</Text>
                  <Text style={styles.infoRowDesc}>Full compliance with national digital health record regulations.</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => setEditModalMode(null)}>
              <Text style={styles.modalSaveBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 10: HELP & SUPPORT                                        */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'help'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Help & Support Desk</Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.infoRowPill}>
                <Ionicons name="call" size={18} color="#081E3E" />
                <View>
                  <Text style={styles.infoRowTitle}>Physician Toll-Free Helpline</Text>
                  <Text style={styles.infoRowDesc}>1800-UNIFY-CARE (24x7 Support)</Text>
                </View>
              </View>

              <View style={styles.infoRowPill}>
                <Ionicons name="mail" size={18} color="#081E3E" />
                <View>
                  <Text style={styles.infoRowTitle}>Doctor Desk Email</Text>
                  <Text style={styles.infoRowDesc}>doctorsupport@mediunify.com</Text>
                </View>
              </View>

              <View style={styles.infoRowPill}>
                <Ionicons name="chatbubbles" size={18} color="#00B894" />
                <View>
                  <Text style={styles.infoRowTitle}>WhatsApp Help Line</Text>
                  <Text style={styles.infoRowDesc}>+91 98450 00112</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => setEditModalMode(null)}>
              <Text style={styles.modalSaveBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 11: LOGOUT CONFIRMATION                                   */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'logoutConfirm'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalWindow, { maxWidth: 420 }]}>
            <View style={{ alignItems: 'center', gap: 10, paddingVertical: 10 }}>
              <View style={styles.logoutIconCircle}>
                <Ionicons name="log-out" size={26} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>Confirm Log Out</Text>
              <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center' }}>
                Are you sure you want to log out of the MediUnify Doctor Portal? Active consultation drafts will be saved.
              </Text>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalMode(null)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: '#EF4444' }]}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.modalSaveBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Response Confirmation Modal with OK Button */}
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
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignItems: 'stretch',
    width: '100%',
    gap: 16,
  },

  // Hero Profile Card (Matching User Reference Image)
  heroProfileCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 4,
  },
  heroBannerArea: {
    height: 160,
    backgroundColor: '#0A2342', // Navy Blue matching MediUnify brand theme
    position: 'relative',
    overflow: 'hidden',
  },
  heroBannerDecorCircle1: {
    position: 'absolute',
    top: -40,
    left: -20,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#133563',
    opacity: 0.6,
  },
  heroBannerDecorCircle2: {
    position: 'absolute',
    top: -60,
    right: 40,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#1E40AF',
    opacity: 0.25,
  },
  heroBannerWave1: {
    position: 'absolute',
    bottom: -30,
    left: 120,
    width: 260,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0E2E56',
    opacity: 0.7,
  },
  heroBannerWave2: {
    position: 'absolute',
    bottom: -40,
    right: -20,
    width: 280,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#172554',
    opacity: 0.8,
  },
  heroBottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingBottom: 22,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    minWidth: 260,
  },
  heroStatItem: {
    alignItems: 'center',
    gap: 3,
  },
  heroStatIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  heroStatNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  heroCenterInfo: {
    alignItems: 'center',
    marginTop: -52,
    minWidth: 220,
  },
  heroAvatarContainer: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#EDE9FE',
    overflow: 'hidden',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 6,
  },
  heroAvatarImg: {
    width: '100%',
    height: '100%',
  },
  heroDoctorName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.2,
  },
  heroDoctorRole: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  heroVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 184, 148, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  heroVerifiedText: {
    fontSize: 10.5,
    color: '#00B894',
    fontWeight: '700',
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
    minWidth: 260,
  },
  heroIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginLeft: 4,
  },
  heroPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Section Cards: Extended full-width till end of screen
  sectionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  sectionHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  editActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#081E3E',
  },

  // Fields
  fieldsList: {
    paddingHorizontal: 16,
  },
  fieldItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 2,
  },
  fieldItemLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  fieldItemValue: {
    fontSize: 13,
    color: '#081E3E',
    fontWeight: '500',
  },

  // Certificate Dossier
  certDossierCard: {
    padding: 16,
    gap: 12,
  },
  certHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  certDocIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certAuthorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  certFileNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  certFileSizeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  verifiedGreenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  verifiedGreenBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  certMetaThreeCols: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF9',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  certCol: {
    flex: 1,
    gap: 2,
  },
  certColLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  certColValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  certActionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  viewCertBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#00B894',
    borderRadius: 6,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  viewCertBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B894',
  },
  updateDocBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  updateDocBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  // Clinic
  clinicInfoContainer: {
    padding: 14,
    gap: 12,
  },
  clinicCardTop: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  clinicCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  clinicHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clinicBadgeLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#081E3E',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  clinicNameBold: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  clinicEditLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#081E3E',
  },
  clinicFieldsList: {
    paddingHorizontal: 12,
  },
  addClinicRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  addClinicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addClinicIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addClinicTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  addClinicSub: {
    fontSize: 11,
    color: '#64748B',
  },

  // Manage & Settings Lists
  navMenuCard: {},
  navMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  navMenuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navMenuText: {
    fontSize: 13,
    color: '#081E3E',
    fontWeight: '500',
  },

  // Logout & Version
  logoutSection: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  versionText: {
    fontSize: 11,
    color: '#94A3B8',
  },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalWindow: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    gap: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081E3E',
  },
  modalFieldsList: {
    gap: 10,
  },
  modalInputBlock: {
    gap: 4,
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#081E3E',
    backgroundColor: '#FFFFFF',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#081E3E',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certViewerBox: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  certViewerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081E3E',
    marginTop: 4,
  },
  certViewerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  certViewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00B894',
  },
  certViewerDetails: {
    fontSize: 11,
    color: '#64748B',
  },
  certSealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  certSealText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00B894',
  },
  infoRowPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoRowTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#081E3E',
  },
  infoRowDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});
