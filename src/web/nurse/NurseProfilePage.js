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
import { useHomeNursing } from '../../homeNursing/context/HomeNursingContext';

export default function NurseProfilePage({ setActiveTab, onNavigateHome }) {
  const { nurseProfile, updateNurseProfile } = useHomeNursing();

  // 1. Personal Information (From Nurse Create Account Registration)
  const [personalInfo, setPersonalInfo] = useState({
    fullName: nurseProfile?.fullName || 'Nurse Kavitha Rajan',
    dob: nurseProfile?.dob || '14 Aug 1996 (29 years)',
    gender: nurseProfile?.gender || 'Female',
    mobile: nurseProfile?.phoneNumber || '+91 98451 22334',
    alternateMobile: '+91 98860 11223',
    email: nurseProfile?.email || 'kavitha.rajan@mediunify.com',
    residentialAddress: nurseProfile?.residentialAddress || 'House #42, 3rd Cross, 7th Main, HAL 2nd Stage',
    cityArea: nurseProfile?.cityArea || 'Indiranagar, Bengaluru',
    pincode: nurseProfile?.pincode || '560038',
  });

  // 2. Professional Details (From Nurse Create Account Registration)
  const [professionalDetails, setProfessionalDetails] = useState({
    qualification: nurseProfile?.qualification || 'B.Sc. Nursing, Post-Basic Diploma in Critical Care',
    registrationNo: nurseProfile?.licenseNumber || 'KNC-2020-554128',
    authority: nurseProfile?.registrationAuthority || 'Karnataka State Nursing Council (KSNC) / INC',
    experience: nurseProfile?.yearsOfExperience || '6 years',
    specialization: Array.isArray(nurseProfile?.specialization)
      ? nurseProfile.specialization.join(', ')
      : nurseProfile?.specialization || 'Wound Dressing, Post-Op Care, IV Therapy, Tracheostomy Care, Vitals Monitoring',
    workExperience: nurseProfile?.workExperience || 'Manipal Hospital Bengaluru (3 yrs Staff Nurse) · Fortis Healthcare (3 yrs Home Care Specialist)',
    perVisitFee: '₹650 / home visit',
  });

  // 3. Certificates & Documents (From Nurse Create Account Registration)
  const [certificateInfo, setCertificateInfo] = useState({
    authority: 'KARNATAKA STATE NURSING COUNCIL & INDIAN NURSING COUNCIL',
    fileName: 'KNC_Nursing_Registration_Certificate_2020.pdf',
    fileSize: '1.4 MB · 18 Jul 2020',
    regNo: 'KNC-2020-554128',
    issueDate: '18 July 2020',
    council: 'KSNC / INC',
    status: 'Verified',
  });

  const [additionalDocs, setAdditionalDocs] = useState([
    {
      id: 'doc-1',
      title: 'Nursing Degree Certificate',
      fileName: 'BSc_Nursing_Degree_Certificate.pdf',
      size: '1.8 MB · 2019',
      status: 'Verified',
    },
    {
      id: 'doc-2',
      title: 'Government ID Proof',
      fileName: 'Aadhaar_Card_Government_ID.pdf',
      size: '950 KB · Verified UIDAI',
      status: 'Verified',
    },
  ]);

  // 4. Primary Base Hub / Clinic Location
  const [hubList, setHubList] = useState([
    {
      id: 1,
      type: 'HEALTH HUB',
      name: 'MediUnify Home Care Hub - Indiranagar',
      address: 'Care Station #3, 100 Feet Road, Indiranagar, Bengaluru',
      coverage: '5 km Dispatch Radius · Indiranagar, Domlur, HAL, Koramangala',
    },
  ]);

  // Modal Editing States
  const [editModalMode, setEditModalMode] = useState(null); // 'personal' | 'professional' | 'editHub' | 'addHub' | 'viewCert' | 'updateCert' | 'earnings' | 'notifications' | 'security' | 'help' | 'logoutConfirm'
  const [selectedHubIndex, setSelectedHubIndex] = useState(0);

  // Form States
  const [editPersonalForm, setEditPersonalForm] = useState({ ...personalInfo });
  const [editProfForm, setEditProfForm] = useState({ ...professionalDetails });
  const [hubForm, setHubForm] = useState({ name: '', address: '', coverage: '' });
  const [newCertForm, setNewCertForm] = useState({
    fileName: 'KNC_Renewal_Certificate_2026.pdf',
    regNo: 'KNC-2020-554128',
    issueDate: '01 Feb 2026',
    council: 'KSNC / Indian Nursing Council',
  });

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

  // Handlers
  const handleSavePersonal = () => {
    setPersonalInfo({ ...editPersonalForm });
    updateNurseProfile({
      fullName: editPersonalForm.fullName,
      dob: editPersonalForm.dob,
      gender: editPersonalForm.gender,
      phoneNumber: editPersonalForm.mobile,
      email: editPersonalForm.email,
      residentialAddress: editPersonalForm.residentialAddress,
      cityArea: editPersonalForm.cityArea,
      pincode: editPersonalForm.pincode,
    });
    setEditModalMode(null);
    showPopup(
      'Personal Details Updated',
      'Nurse contact information, residential address, and profile data saved successfully.',
      [
        `Full Name: ${editPersonalForm.fullName}`,
        `Mobile: ${editPersonalForm.mobile}`,
        `Address: ${editPersonalForm.residentialAddress}, ${editPersonalForm.cityArea} (${editPersonalForm.pincode})`,
      ],
      'success'
    );
  };

  const handleSaveProfessional = () => {
    setProfessionalDetails({ ...editProfForm });
    updateNurseProfile({
      qualification: editProfForm.qualification,
      licenseNumber: editProfForm.registrationNo,
      registrationAuthority: editProfForm.authority,
      yearsOfExperience: editProfForm.experience,
      specialization: editProfForm.specialization.split(',').map((s) => s.trim()),
      workExperience: editProfForm.workExperience,
    });
    setEditModalMode(null);
    showPopup(
      'Professional Credentials Updated',
      'Clinical qualifications, registration authority, and years of experience have been saved.',
      [
        `Qualification: ${editProfForm.qualification}`,
        `Registration Number: ${editProfForm.registrationNo}`,
        `Council: ${editProfForm.authority}`,
        `Experience: ${editProfForm.experience}`,
      ],
      'success'
    );
  };

  const handleOpenEditHub = (index) => {
    setSelectedHubIndex(index);
    setHubForm({
      name: hubList[index].name,
      address: hubList[index].address,
      coverage: hubList[index].coverage,
    });
    setEditModalMode('editHub');
  };

  const handleSaveEditHub = () => {
    const updated = [...hubList];
    updated[selectedHubIndex] = {
      ...updated[selectedHubIndex],
      name: hubForm.name,
      address: hubForm.address,
      coverage: hubForm.coverage,
    };
    setHubList(updated);
    setEditModalMode(null);
    showPopup(
      'Care Hub Location Saved',
      'Primary home care dispatch hub details updated.',
      [`Hub: ${hubForm.name}`, `Address: ${hubForm.address}`],
      'success'
    );
  };

  const handleOpenAddHub = () => {
    setHubForm({ name: '', address: '', coverage: '5 km service coverage radius' });
    setEditModalMode('addHub');
  };

  const handleSaveAddHub = () => {
    if (!hubForm.name.trim() || !hubForm.address.trim()) {
      alert('Please enter both hub name and address.');
      return;
    }
    const newEntry = {
      id: Date.now(),
      type: 'HEALTH HUB',
      name: hubForm.name.trim(),
      address: hubForm.address.trim(),
      coverage: hubForm.coverage.trim(),
    };
    setHubList([...hubList, newEntry]);
    setEditModalMode(null);
    showPopup(
      'New Care Hub Added',
      'New home care dispatch base station added to your nursing profile.',
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
      fileSize: '1.9 MB · Today',
    });
    setEditModalMode(null);
    showPopup(
      'Document Submitted',
      'Your updated nursing registration certificate has been uploaded for administrative verification.',
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
      'You have been logged out of the MediUnify Nurse Portal. Your active duty session has ended safely.',
      ['Session closed', 'Location tracking deactivated'],
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
            {/* Left Stats Row (Matching image: 142 Services, 320+ Patients, 6+ Yrs Experience) */}
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <View style={styles.heroStatIconCircle}>
                  <Ionicons name="bag-handle-outline" size={15} color="#475569" />
                </View>
                <Text style={styles.heroStatNumber}>142</Text>
                <Text style={styles.heroStatLabel}>Services</Text>
              </View>

              <View style={styles.heroStatItem}>
                <View style={styles.heroStatIconCircle}>
                  <Ionicons name="people-outline" size={15} color="#475569" />
                </View>
                <Text style={styles.heroStatNumber}>320+</Text>
                <Text style={styles.heroStatLabel}>Patients</Text>
              </View>

              <View style={styles.heroStatItem}>
                <View style={styles.heroStatIconCircle}>
                  <Ionicons name="ribbon-outline" size={15} color="#475569" />
                </View>
                <Text style={styles.heroStatNumber}>6+ Yrs</Text>
                <Text style={styles.heroStatLabel}>Experience</Text>
              </View>
            </View>

            {/* Center Nurse Avatar & Name (Overlapping the banner) */}
            <View style={styles.heroCenterInfo}>
              <View style={styles.heroAvatarContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1594824813589-fb47f6368d40?auto=format&fit=crop&q=80&w=240',
                  }}
                  style={styles.heroAvatarImg}
                />
              </View>
              <Text style={styles.heroDoctorName}>{personalInfo.fullName}</Text>
              <Text style={styles.heroDoctorRole}>{professionalDetails.qualification}</Text>
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
                    'Nurse Emergency Helpline',
                    'Emergency dispatch supervisor desk: 1800-UNIFY-NURSE (24x7 toll-free).',
                    ['Clinical Escalation Desk', 'On-Field Emergency SOS'],
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
                    'Nurse Email Desk',
                    'Official nursing care coordination mailbox: nurse.care@mediunify.com',
                    ['EHR synchronized communication inbox'],
                    'info'
                  )
                }
                activeOpacity={0.8}
              >
                <Ionicons name="mail" size={15} color="#16A34A" />
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
              <Text style={styles.fieldItemLabel}>Full Name</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.fullName}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Date of Birth / Age</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.dob}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Gender</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.gender}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Mobile Number</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.mobile}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Alternate Number</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.alternateMobile}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Email Address</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.email}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Residential Address</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.residentialAddress}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>City / Area</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.cityArea}</Text>
            </View>

            <View style={[styles.fieldItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.fieldItemLabel}>Pincode</Text>
              <Text style={styles.fieldItemValue}>{personalInfo.pincode}</Text>
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
              <Text style={styles.fieldItemLabel}>Nursing Qualification</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.qualification}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Nursing Registration Number</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.registrationNo}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Nursing Registration Authority / Council</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.authority}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Years of Experience</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.experience}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Specialization / Skills</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.specialization}</Text>
            </View>

            <View style={styles.fieldItem}>
              <Text style={styles.fieldItemLabel}>Work Experience</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.workExperience}</Text>
            </View>

            <View style={[styles.fieldItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.fieldItemLabel}>Home Visit Consultation Fee</Text>
              <Text style={styles.fieldItemValue}>{professionalDetails.perVisitFee}</Text>
            </View>
          </View>
        </View>

        {/* CARD 3: Registration Certificate & Documents (Matching Screenshot 1 & 2) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleGroup}>
              <Ionicons name="ribbon-outline" size={15} color="#081E3E" />
              <Text style={styles.sectionHeaderTitle}>Registration Certificate & Documents</Text>
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
            {/* Primary Document Row */}
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

            {/* Additional Registration Documents from Create Account */}
            <View style={styles.additionalDocsArea}>
              <Text style={styles.additionalDocsTitle}>Verified Submission Documents</Text>
              {additionalDocs.map((doc) => (
                <View key={doc.id} style={styles.docItemRow}>
                  <Ionicons name="shield-checkmark" size={15} color="#00B894" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docItemTitle}>{doc.title}</Text>
                    <Text style={styles.docItemFile}>{doc.fileName} · {doc.size}</Text>
                  </View>
                  <View style={styles.verifiedBadgeSmall}>
                    <Text style={styles.verifiedBadgeSmallText}>Approved</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* CARD 4: Clinic / Hospital / Base Hub Info (Matching Screenshot 2) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleGroup}>
              <Ionicons name="business-outline" size={15} color="#081E3E" />
              <Text style={styles.sectionHeaderTitle}>Care Hub & Station Info</Text>
            </View>

            <TouchableOpacity
              style={styles.editActionBtn}
              onPress={() => handleOpenEditHub(0)}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={13} color="#081E3E" />
              <Text style={styles.editActionBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.clinicInfoContainer}>
            {hubList.map((hub, idx) => (
              <View key={hub.id || idx} style={styles.clinicCardTop}>
                <View style={styles.clinicCardHeaderRow}>
                  <View style={styles.clinicHeaderLeft}>
                    <Ionicons name="home" size={14} color="#081E3E" />
                    <Text style={styles.clinicBadgeLabel}>{hub.type || 'HEALTH HUB'}</Text>
                    <Text style={styles.clinicNameBold}>{hub.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleOpenEditHub(idx)} activeOpacity={0.7}>
                    <Text style={styles.clinicEditLink}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.clinicFieldsList}>
                  <View style={styles.fieldItem}>
                    <Text style={styles.fieldItemLabel}>Hub Location</Text>
                    <Text style={styles.fieldItemValue}>{hub.name}</Text>
                  </View>

                  <View style={styles.fieldItem}>
                    <Text style={styles.fieldItemLabel}>Address</Text>
                    <Text style={styles.fieldItemValue}>{hub.address}</Text>
                  </View>

                  <View style={[styles.fieldItem, { borderBottomWidth: 0 }]}>
                    <Text style={styles.fieldItemLabel}>Dispatch Radius</Text>
                    <Text style={styles.fieldItemValue}>{hub.coverage}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* + Add Hub / Base Station */}
            <TouchableOpacity
              style={styles.addClinicRowBtn}
              onPress={handleOpenAddHub}
              activeOpacity={0.85}
            >
              <View style={styles.addClinicLeft}>
                <View style={styles.addClinicIconBox}>
                  <Ionicons name="add" size={18} color="#081E3E" />
                </View>
                <View>
                  <Text style={styles.addClinicTitle}>Add Base Station / Care Hub</Text>
                  <Text style={styles.addClinicSub}>
                    Add another home nursing base station or clinic hub
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
            {/* Assigned Services */}
            <TouchableOpacity
              style={styles.navMenuItem}
              onPress={() => (setActiveTab ? setActiveTab('services') : null)}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="medkit-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Assigned Services</Text>
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
                <Text style={styles.navMenuText}>Availability Management</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Completed Services & History */}
            <TouchableOpacity
              style={styles.navMenuItem}
              onPress={() => (setActiveTab ? setActiveTab('history') : null)}
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="receipt-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Completed Services & Audit</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Earnings */}
            <TouchableOpacity
              style={styles.navMenuItem}
              onPress={() =>
                showPopup(
                  'Nurse Earnings & Payouts',
                  'Monthly visit compensation & direct bank deposit details.',
                  [
                    'Completed Visits This Month: 28 Visits',
                    'Total Earned: ₹18,200',
                    'Direct Deposit: HDFC Bank Ltd (•••• 4821)',
                    'Next Payout Cycle: 10th of every month',
                  ],
                  'success'
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.navMenuLeft}>
                <Ionicons name="card-outline" size={16} color="#64748B" />
                <Text style={styles.navMenuText}>Earnings & Payouts</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              style={[styles.navMenuItem, { borderBottomWidth: 0 }]}
              onPress={() => (setActiveTab ? setActiveTab('notifications') : null)}
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
              onPress={() =>
                showPopup(
                  'Security & Privacy',
                  'Nursing field safety, location privacy, and clinical data compliance.',
                  [
                    'Field GPS Tracking: Active only during on-duty travel',
                    'Patient EHR Encryption: 256-bit AES standard',
                    'Two-Factor Authentication: Enabled on mobile number',
                  ],
                  'info'
                )
              }
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
              onPress={() =>
                showPopup(
                  'Nurse Field Support Desk',
                  '24/7 dedicated nursing field operations helpline.',
                  [
                    'Toll Free: 1800-UNIFY-NURSE',
                    'Email: nursesupport@mediunify.com',
                    'Emergency Dispatch Desk: +91 98450 00115',
                  ],
                  'info'
                )
              }
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

          <Text style={styles.versionText}>MediUnify Nurse App · v1.5.0</Text>
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
                <Text style={styles.modalInputLabel}>Full Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.fullName}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, fullName: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Date of Birth / Age</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.dob}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, dob: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Gender</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.gender}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, gender: v })}
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

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Residential Address</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.residentialAddress}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, residentialAddress: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>City / Area</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.cityArea}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, cityArea: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Pincode</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPersonalForm.pincode}
                  onChangeText={(v) => setEditPersonalForm({ ...editPersonalForm, pincode: v })}
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
                <Text style={styles.modalInputLabel}>Nursing Qualification</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.qualification}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, qualification: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Nursing Registration Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.registrationNo}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, registrationNo: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Registration Authority / Council</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.authority}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, authority: v })}
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
                <Text style={styles.modalInputLabel}>Specialization / Skills</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.specialization}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, specialization: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Work Experience</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.workExperience}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, workExperience: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Per-Visit Consultation Fee</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editProfForm.perVisitFee}
                  onChangeText={(v) => setEditProfForm({ ...editProfForm, perVisitFee: v })}
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
      {/* MODAL 3: VIEW CERTIFICATE MODAL                                */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'viewCert'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalWindow, { maxWidth: 560 }]}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Nursing Registration Certificate</Text>
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
              <Text style={styles.certViewerSub}>Certificate of Permanent Nursing Registration</Text>
              <Text style={styles.certViewerName}>{personalInfo.fullName}</Text>
              <Text style={styles.certViewerDetails}>
                Registration No: {certificateInfo.regNo} · Issue Date: {certificateInfo.issueDate}
              </Text>
              <Text style={styles.certViewerDetails}>Council: {certificateInfo.council}</Text>
              <View style={styles.certSealBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#00B894" />
                <Text style={styles.certSealText}>NURSING COUNCIL REGISTRATION VERIFIED</Text>
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
      {/* MODAL 4: UPDATE CERTIFICATE DOCUMENT                           */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'updateCert'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Update Nursing Certificate</Text>
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
                <Text style={styles.modalInputLabel}>Nursing Registration Number</Text>
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
                <Text style={styles.modalInputLabel}>State Nursing Council / Authority</Text>
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
      {/* MODAL 5: EDIT / ADD CARE HUB                                    */}
      {/* ============================================================== */}
      <Modal visible={editModalMode === 'editHub' || editModalMode === 'addHub'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalWindow}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {editModalMode === 'addHub' ? 'Add Care Hub Location' : 'Edit Care Hub Location'}
              </Text>
              <TouchableOpacity onPress={() => setEditModalMode(null)}>
                <Ionicons name="close" size={22} color="#081E3E" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalFieldsList}>
              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Care Hub / Station Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. MediUnify Indiranagar Care Hub"
                  value={hubForm.name}
                  onChangeText={(v) => setHubForm({ ...hubForm, name: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Complete Address & Landmark</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
                  value={hubForm.address}
                  onChangeText={(v) => setHubForm({ ...hubForm, address: v })}
                />
              </View>

              <View style={styles.modalInputBlock}>
                <Text style={styles.modalInputLabel}>Dispatch Coverage Area</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 5 km Radius (Indiranagar, HAL, Domlur)"
                  value={hubForm.coverage}
                  onChangeText={(v) => setHubForm({ ...hubForm, coverage: v })}
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
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={editModalMode === 'addHub' ? handleSaveAddHub : handleSaveEditHub}
              >
                <Text style={styles.modalSaveBtnText}>Save Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 6: LOGOUT CONFIRMATION                                    */}
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
                Are you sure you want to log out of the MediUnify Nurse Portal? Active dispatch status will be paused.
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
    backgroundColor: '#0A2342', // Navy Blue background matching MediUnify brand theme
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
  additionalDocsArea: {
    marginTop: 6,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  additionalDocsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  docItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  docItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  docItemFile: {
    fontSize: 11,
    color: '#64748B',
  },
  verifiedBadgeSmall: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeSmallText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },

  // Clinic & Hub Info
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

  // 3. Bottom Navigation Bar
  bottomTabBar: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabBarItem: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    flex: 1,
  },
  tabBarText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  tabBarItemActive: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    flex: 1,
  },
  tabBarTextActive: {
    fontSize: 10.5,
    color: '#00B894',
    fontWeight: '700',
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
    gap: 8,
  },
  modalInputBlock: {
    gap: 3,
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
    paddingVertical: 7,
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
    fontSize: 13.5,
    fontWeight: '800',
    color: '#081E3E',
    marginTop: 4,
    textAlign: 'center',
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
});
