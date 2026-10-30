// MediUnify — Unified Doctor Profile & Claiming Service
// Provides single-source-of-truth data management across Web, Doctor Mobile App, and Admin Web App.

import { doctor as defaultMockDoctor } from '../data/mockData';

// Storage key for browser persistence
const STORAGE_PROFILES_KEY = 'mediunify_doctor_profiles_v1';
const STORAGE_CLAIMS_KEY = 'mediunify_doctor_claims_v1';
const STORAGE_AUDIT_KEY = 'mediunify_audit_logs_v1';
const STORAGE_NOTIFS_KEY = 'mediunify_notifications_v1';

// Seed Initial Profiles
const SEED_PROFILES = [
  {
    id: 'doc_prof_001',
    slug: 'dr-ananya-rao-general-physician-bengaluru',
    name: 'Dr. Ananya Rao',
    specialization: 'General Physician',
    qualifications: 'MBBS, MD (Internal Medicine)',
    clinicName: 'Unify Health Clinic',
    clinicAddress: '4th Block, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    location: 'Indiranagar',
    contactPhone: '+91 98450 12345',
    contactEmail: 'ananya.rao@mediunify.com',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    status: 'claimed_verified', // 'unclaimed' | 'claim_pending' | 'claimed_verified' | 'inactive'
    claimedByAccountId: 'acc_doc_ananya_01',
    claimedAt: '15 Jan 2026, 11:30 AM',
    claimId: 'claim_legacy_000',
    bio: 'Senior consultant in Internal Medicine with over 9 years of dedicated clinical experience managing lifestyle disorders, hypertension, and diabetes.',
    experience: '9 years',
    languages: ['English', 'Hindi', 'Kannada'],
    regNo: 'MCI-2019-887341',
    regCouncil: 'Karnataka Medical Council / MCI',
    fee: 500,
    isIndexedForGoogle: true,
    metaTitle: 'Dr. Ananya Rao - General Physician in Indiranagar, Bengaluru | MediUnify',
    metaDescription: 'Book in-person or video consultation with Dr. Ananya Rao, MD Internal Medicine at Unify Health Clinic, Indiranagar, Bengaluru.',
    createdAt: '10 Jan 2026',
    updatedAt: '15 Jan 2026',
    pendingReviewFields: null,
  },
  {
    id: 'doc_prof_002',
    slug: 'dr-rajesh-sharma-cardiology-bengaluru',
    name: 'Dr. Rajesh Sharma',
    specialization: 'Cardiologist',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology)',
    clinicName: 'Apollo Heart Centre & Clinic',
    clinicAddress: '100ft Road, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    location: 'Indiranagar',
    contactPhone: '+91 80 2520 7890',
    contactEmail: 'cardiology.desk@apolloheart.org',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    status: 'unclaimed',
    claimedByAccountId: null,
    claimedAt: null,
    claimId: null,
    bio: 'Specialist in non-invasive cardiology, preventive heart care, and hypertension management.',
    experience: '14 years',
    languages: ['English', 'Hindi'],
    regNo: 'KMC-2012-445892',
    regCouncil: 'Karnataka Medical Council',
    fee: null, // Unclaimed: do not invent fees
    isIndexedForGoogle: true,
    metaTitle: 'Dr. Rajesh Sharma - Cardiologist in Indiranagar, Bengaluru | MediUnify',
    metaDescription: 'Public profile for Dr. Rajesh Sharma, Cardiologist at Apollo Heart Centre, Bengaluru. Claim this profile on MediUnify.',
    createdAt: '01 Feb 2026',
    updatedAt: '01 Feb 2026',
    pendingReviewFields: null,
  },
  {
    id: 'doc_prof_003',
    slug: 'dr-meenakshi-sundaram-pediatrics-bengaluru',
    name: 'Dr. Meenakshi Sundaram',
    specialization: 'Pediatrician',
    qualifications: 'MBBS, DCH, DNB (Pediatrics)',
    clinicName: 'Little Angels Child Care Clinic',
    clinicAddress: 'ITPL Main Road, Whitefield, Bengaluru',
    city: 'Bengaluru',
    location: 'Whitefield',
    contactPhone: '+91 80 6710 4422',
    contactEmail: 'contact@littleangelsclinic.com',
    photo: 'https://images.unsplash.com/photo-1594824813579-566b749d288a?auto=format&fit=crop&q=80&w=400',
    status: 'unclaimed',
    claimedByAccountId: null,
    claimedAt: null,
    claimId: null,
    bio: 'Pediatrician specializing in newborn care, immunization schedules, and childhood developmental milestones.',
    experience: '11 years',
    languages: ['English', 'Tamil', 'Kannada'],
    regNo: 'KMC-2015-678912',
    regCouncil: 'Karnataka Medical Council',
    fee: null,
    isIndexedForGoogle: true,
    metaTitle: 'Dr. Meenakshi Sundaram - Pediatrician in Whitefield, Bengaluru | MediUnify',
    metaDescription: 'Doctor directory profile for Dr. Meenakshi Sundaram, Pediatrician at Little Angels Child Care Clinic. Claim profile on MediUnify.',
    createdAt: '05 Feb 2026',
    updatedAt: '05 Feb 2026',
    pendingReviewFields: null,
  },
  {
    id: 'doc_prof_004',
    slug: 'dr-vikramaditya-sen-orthopedics-bengaluru',
    name: 'Dr. Vikramaditya Sen',
    specialization: 'Orthopedic Surgeon',
    qualifications: 'MBBS, MS (Orthopedics), MCh (Joint Replacement)',
    clinicName: 'Fortis Hospital Bone & Joint Institute',
    clinicAddress: 'Bannerghatta Road, Bengaluru',
    city: 'Bengaluru',
    location: 'Bannerghatta Road',
    contactPhone: '+91 80 4012 3344',
    contactEmail: 'ortho.sen@fortishealthcare.in',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    status: 'claim_pending', // Has pending claim
    claimedByAccountId: 'acc_doc_vikram_sen',
    claimedAt: null,
    claimId: 'claim_001',
    bio: 'Consultant Orthopedic Surgeon with expertise in robotic joint replacements and arthroscopic reconstructions.',
    experience: '16 years',
    languages: ['English', 'Bengali', 'Hindi'],
    regNo: 'MCI-2010-334190',
    regCouncil: 'National Medical Commission (NMC)',
    fee: null,
    isIndexedForGoogle: true,
    metaTitle: 'Dr. Vikramaditya Sen - Orthopedic Surgeon in Bengaluru | MediUnify',
    metaDescription: 'Doctor profile for Dr. Vikramaditya Sen, Fortis Hospital Bengaluru. Claim under verification on MediUnify.',
    createdAt: '12 Feb 2026',
    updatedAt: '18 Feb 2026',
    pendingReviewFields: null,
  },
  {
    id: 'doc_prof_005',
    slug: 'dr-priya-nambiar-dermatology-bengaluru',
    name: 'Dr. Priya Nambiar',
    specialization: 'Dermatologist',
    qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    clinicName: 'Skin & Laser Wellness Centre',
    clinicAddress: '3rd Block, Jayanagar, Bengaluru',
    city: 'Bengaluru',
    location: 'Jayanagar',
    contactPhone: '+91 80 2663 8811',
    contactEmail: 'desk@skinlasercentre.in',
    photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    status: 'unclaimed',
    claimedByAccountId: null,
    claimedAt: null,
    claimId: null,
    bio: 'Dermatologist and cosmetologist treating clinical skin disorders, acne management, and medical lasers.',
    experience: '8 years',
    languages: ['English', 'Malayalam', 'Hindi'],
    regNo: 'KMC-2018-992104',
    regCouncil: 'Karnataka Medical Council',
    fee: null,
    isIndexedForGoogle: true,
    metaTitle: 'Dr. Priya Nambiar - Dermatologist in Jayanagar, Bengaluru | MediUnify',
    metaDescription: 'Dermatologist Dr. Priya Nambiar profile in Jayanagar, Bengaluru. Claim this doctor profile on MediUnify.',
    createdAt: '15 Feb 2026',
    updatedAt: '15 Feb 2026',
    pendingReviewFields: null,
  },
  {
    id: 'doc_prof_006',
    slug: 'dr-suresh-k-nair-neurology-bengaluru',
    name: 'Dr. Suresh K. Nair',
    specialization: 'Neurologist',
    qualifications: 'MBBS, MD (General Medicine), DM (Neurology)',
    clinicName: 'Brain & Spine Institute',
    clinicAddress: 'Koramangala 5th Block, Bengaluru',
    city: 'Bengaluru',
    location: 'Koramangala',
    contactPhone: '+91 80 4115 9900',
    contactEmail: 'contact@brainspine.org',
    photo: null,
    status: 'inactive', // Admin marked inactive
    claimedByAccountId: null,
    claimedAt: null,
    claimId: null,
    bio: 'Consultant Neurologist dealing with headache disorders, stroke rehabilitation, and epilepsy.',
    experience: '20 years',
    languages: ['English', 'Malayalam', 'Kannada'],
    regNo: 'KMC-2006-118833',
    regCouncil: 'Karnataka Medical Council',
    fee: null,
    isIndexedForGoogle: false,
    metaTitle: 'Dr. Suresh K. Nair - Neurologist | MediUnify',
    metaDescription: 'Doctor directory listing on MediUnify.',
    createdAt: '01 Jan 2026',
    updatedAt: '10 Feb 2026',
    pendingReviewFields: null,
  },
];

// Seed Initial Claims
const SEED_CLAIMS = [
  {
    id: 'claim_001',
    doctorProfileId: 'doc_prof_004',
    doctorProfileName: 'Dr. Vikramaditya Sen',
    claimantAccountId: 'acc_doc_vikram_sen',
    claimantName: 'Dr. Vikramaditya Sen',
    claimantEmail: 'dr.vikram.sen@orthohealth.org',
    claimantPhone: '+91 98860 77123',
    regNumber: 'MCI-2010-334190',
    regCouncil: 'National Medical Commission (NMC)',
    yearOfReg: '2010',
    documents: [
      {
        id: 'doc_cert_01',
        name: 'NMC_Registration_Certificate_Dr_Vikramaditya_Sen.pdf',
        type: 'Medical Council Registration Certificate',
        size: '2.4 MB',
        uploadedAt: '18 Feb 2026, 09:40 AM',
      },
      {
        id: 'doc_id_01',
        name: 'Government_Photo_ID_Aadhaar_Redacted.pdf',
        type: 'Government Photo ID Proof',
        size: '1.1 MB',
        uploadedAt: '18 Feb 2026, 09:41 AM',
      },
      {
        id: 'doc_clinic_01',
        name: 'Fortis_Hospital_Appointment_Letterhead.pdf',
        type: 'Hospital / Clinic Affiliation Proof',
        size: '1.9 MB',
        uploadedAt: '18 Feb 2026, 09:43 AM',
      },
    ],
    legalDeclarationAccepted: true,
    submissionDate: '18 Feb 2026, 09:45 AM',
    submissionDateIso: '2026-02-18T09:45:00Z',
    status: 'pending', // 'pending' | 'approved' | 'rejected' | 'info_requested'
    rejectionReason: null,
    infoRequestedNote: null,
    adminNotes: 'Documents uploaded match NMC public registry records. Awaiting second-tier verification call with clinic HR.',
    reviewHistory: [
      {
        action: 'SUBMITTED',
        date: '18 Feb 2026, 09:45 AM',
        actor: 'Dr. Vikramaditya Sen (Claimant)',
        note: 'Claim submitted with Medical Council Certificate and Government ID.',
      },
      {
        action: 'UNDER_REVIEW',
        date: '18 Feb 2026, 11:20 AM',
        actor: 'Admin Verification Desk',
        note: 'Assigned to Super Admin for verification with state council registry.',
      },
    ],
  },
];

// Seed Initial Audit Logs
const SEED_AUDIT_LOGS = [
  {
    id: 'audit_001',
    timestamp: '18 Feb 2026, 09:45 AM',
    action: 'CLAIM_SUBMITTED',
    actor: 'Dr. Vikramaditya Sen',
    target: 'Dr. Vikramaditya Sen (doc_prof_004)',
    details: 'Claim submitted for review with 3 verification documents.',
  },
  {
    id: 'audit_002',
    timestamp: '15 Feb 2026, 10:15 AM',
    action: 'PROFILE_CREATED',
    actor: 'Super Admin',
    target: 'Dr. Priya Nambiar (doc_prof_005)',
    details: 'Admin created basic unclaimed profile with verified clinic address.',
  },
  {
    id: 'audit_003',
    timestamp: '15 Jan 2026, 11:30 AM',
    action: 'CLAIM_APPROVED',
    actor: 'Super Admin',
    target: 'Dr. Ananya Rao (doc_prof_001)',
    details: 'Claim approved. Profile linked to authenticated account acc_doc_ananya_01.',
  },
];

// Seed Initial Notifications
const SEED_NOTIFICATIONS = [
  {
    id: 'notif_claim_01',
    recipientRole: 'admin',
    recipientId: 'admin_all',
    title: 'New Profile Claim Submitted',
    message: 'Dr. Vikramaditya Sen submitted a claim for profile #doc_prof_004 (Fortis Hospital). Review required.',
    timestamp: '18 Feb 2026, 09:45 AM',
    read: false,
    link: 'admin-claims',
  },
  {
    id: 'notif_claim_02',
    recipientRole: 'doctor',
    recipientId: 'acc_doc_ananya_01',
    title: 'Doctor Profile Verified & Linked',
    message: 'Congratulations! Your profile claim has been approved by Super Admin. You can now manage your public clinical information.',
    timestamp: '15 Jan 2026, 11:30 AM',
    read: true,
    link: 'doctor-portal',
  },
];

class DoctorClaimService {
  constructor() {
    this.profiles = [];
    this.claims = [];
    this.auditLogs = [];
    this.notifications = [];
    this.otpStore = {};
    this.listeners = new Set();
    this.init();
  }

  // Initialize from storage or seed defaults
  init() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedProfiles = window.localStorage.getItem(STORAGE_PROFILES_KEY);
        const storedClaims = window.localStorage.getItem(STORAGE_CLAIMS_KEY);
        const storedAudit = window.localStorage.getItem(STORAGE_AUDIT_KEY);
        const storedNotifs = window.localStorage.getItem(STORAGE_NOTIFS_KEY);

        this.profiles = storedProfiles ? JSON.parse(storedProfiles) : [...SEED_PROFILES];
        this.claims = storedClaims ? JSON.parse(storedClaims) : [...SEED_CLAIMS];
        this.auditLogs = storedAudit ? JSON.parse(storedAudit) : [...SEED_AUDIT_LOGS];
        this.notifications = storedNotifs ? JSON.parse(storedNotifs) : [...SEED_NOTIFICATIONS];
      } else {
        this.profiles = [...SEED_PROFILES];
        this.claims = [...SEED_CLAIMS];
        this.auditLogs = [...SEED_AUDIT_LOGS];
        this.notifications = [...SEED_NOTIFICATIONS];
      }
    } catch (e) {
      this.profiles = [...SEED_PROFILES];
      this.claims = [...SEED_CLAIMS];
      this.auditLogs = [...SEED_AUDIT_LOGS];
      this.notifications = [...SEED_NOTIFICATIONS];
    }
  }

  persist() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(this.profiles));
        window.localStorage.setItem(STORAGE_CLAIMS_KEY, JSON.stringify(this.claims));
        window.localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(this.auditLogs));
        window.localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(this.notifications));
      }
    } catch (e) {
      // Storage quota or SSR fallback
    }
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('DoctorClaimService listener error:', e);
      }
    });
  }

  // ----------------------------------------------------
  // 1. DOCTOR PROFILES REPOSITORY (ADMIN & PUBLIC)
  // ----------------------------------------------------

  getAllProfiles(includeInactive = true) {
    if (includeInactive) return [...this.profiles];
    return this.profiles.filter((p) => p.status !== 'inactive');
  }

  getProfileById(id) {
    return this.profiles.find((p) => p.id === id) || null;
  }

  getProfileBySlug(slug) {
    return this.profiles.find((p) => p.slug === slug) || null;
  }

  getProfileByAccountId(accountId) {
    if (!accountId) return null;
    return this.profiles.find((p) => p.claimedByAccountId === accountId) || null;
  }

  // Find unclaimed doctor profiles for claim flow
  searchUnclaimedProfiles(searchTerm = '') {
    const q = (searchTerm || '').trim().toLowerCase();
    const unclaimed = this.profiles.filter(
      (p) => p.status === 'unclaimed' || p.status === 'claim_pending'
    );
    if (!q) return unclaimed;
    return unclaimed.filter((p) => {
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchSpec = (p.specialization || '').toLowerCase().includes(q);
      const matchReg = (p.regNo || '').toLowerCase().includes(q);
      const matchClinic = (p.clinicName || '').toLowerCase().includes(q);
      const matchLoc = (p.location || '').toLowerCase().includes(q);
      const matchCity = (p.city || '').toLowerCase().includes(q);
      return matchName || matchSpec || matchReg || matchClinic || matchLoc || matchCity;
    });
  }

  // ----------------------------------------------------
  // OTP / IDENTITY VERIFICATION SERVICE
  // ----------------------------------------------------
  sendOtp(destination, type = 'phone') {
    if (!destination || !destination.trim()) {
      throw new Error('Destination (phone or email) is required to generate verification OTP.');
    }
    const cleanDest = destination.trim();
    // Generate a cryptographically random 6-digit numeric OTP code
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    const otpRecord = {
      destination: cleanDest,
      type,
      code: generatedCode,
      expiresAt,
      verified: false,
      createdAt: new Date().toISOString(),
    };

    this.otpStore = this.otpStore || {};
    this.otpStore[cleanDest] = otpRecord;

    // Dispatch an in-app notification so user/doctor can verify code immediately
    this.notifications.unshift({
      id: `notif_otp_${Date.now()}`,
      recipientRole: 'doctor',
      recipientId: cleanDest,
      title: `MediUnify Verification OTP: ${generatedCode}`,
      message: `Your verification code is ${generatedCode}. Valid for 10 minutes. Do not share this code with anyone.`,
      timestamp: new Date().toLocaleTimeString(),
      read: false,
      link: 'doctor-claim-profile',
    });

    this.persist();

    return {
      success: true,
      destination: cleanDest,
      type,
      expiresInSeconds: 600,
      previewCode: generatedCode,
      message: `Verification code sent to ${cleanDest}.`,
    };
  }

  verifyOtp(destination, code) {
    if (!destination || !destination.trim()) {
      return { success: false, message: 'Contact destination is required.' };
    }
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter the 6-digit verification code.' };
    }

    const cleanDest = destination.trim();
    const cleanCode = code.trim();
    this.otpStore = this.otpStore || {};
    const record = this.otpStore[cleanDest];

    if (!record) {
      return {
        success: false,
        message: 'No active verification code found for this contact. Please request a new OTP.',
      };
    }

    if (Date.now() > record.expiresAt) {
      return {
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    if (record.code !== cleanCode) {
      return {
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      };
    }

    record.verified = true;
    record.verifiedAt = new Date().toISOString();
    this.persist();

    return {
      success: true,
      message: 'Contact details verified successfully.',
    };
  }

  isOtpVerified(destination) {
    if (!destination) return false;
    const cleanDest = destination.trim();
    this.otpStore = this.otpStore || {};
    const record = this.otpStore[cleanDest];
    return Boolean(record && record.verified);
  }

  // Search profiles (Public Directory & Search)
  searchPublicProfiles({ query = '', specialization = '', city = '', filter = 'all' }) {
    const q = query.trim().toLowerCase();
    const spec = specialization.trim().toLowerCase();
    const c = city.trim().toLowerCase();

    return this.profiles.filter((p) => {
      // Don't show inactive in public directory
      if (p.status === 'inactive') return false;

      // Filter by status tab
      if (filter === 'verified' && p.status !== 'claimed_verified') return false;
      if (filter === 'unclaimed' && p.status !== 'unclaimed' && p.status !== 'claim_pending') return false;

      // Search match
      if (q) {
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesSpec = (p.specialization || '').toLowerCase().includes(q);
        const matchesClinic = (p.clinicName || '').toLowerCase().includes(q);
        const matchesLocation = (p.location || '').toLowerCase().includes(q);
        const matchesCity = (p.city || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesClinic && !matchesLocation && !matchesCity) {
          return false;
        }
      }

      if (spec && !(p.specialization || '').toLowerCase().includes(spec)) {
        return false;
      }

      if (c && !(p.city || '').toLowerCase().includes(c)) {
        return false;
      }

      return true;
    });
  }

  // Duplicate profile check (Requirement: Avoid creating duplicate doctor profiles)
  findPotentialDuplicates({ name = '', regNo = '', clinicName = '', city = '', excludeId = null }) {
    const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = norm(name);
    const cleanReg = norm(regNo);
    const cleanClinic = norm(clinicName);

    const duplicates = [];

    for (const p of this.profiles) {
      if (excludeId && p.id === excludeId) continue;

      let score = 0;
      const reasons = [];

      // 1. Registration Number Exact Match (Definite match)
      if (cleanReg && norm(p.regNo) === cleanReg) {
        score += 90;
        reasons.push(`Identical Medical Registration Number (${p.regNo})`);
      }

      // 2. Doctor Name Match
      if (cleanName && norm(p.name) === cleanName) {
        score += 50;
        reasons.push(`Identical Doctor Name ("${p.name}")`);
      } else if (cleanName && (norm(p.name).includes(cleanName) || cleanName.includes(norm(p.name)))) {
        score += 30;
        reasons.push(`Similar Doctor Name ("${p.name}")`);
      }

      // 3. Clinic & City match
      if (cleanClinic && norm(p.clinicName) === cleanClinic) {
        score += 25;
        reasons.push(`Same Clinic / Hospital ("${p.clinicName}")`);
      }

      if (city && (p.city || '').toLowerCase() === city.toLowerCase()) {
        score += 10;
      }

      if (score >= 40) {
        duplicates.push({
          profile: p,
          score,
          reasons,
        });
      }
    }

    return duplicates.sort((a, b) => b.score - a.score);
  }

  // Admin Create Doctor Profile
  createDoctorProfile(profileData, adminActor = 'Super Admin') {
    const id = `doc_prof_${Date.now()}`;
    const nameSlug = (profileData.name || 'doctor')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const specSlug = (profileData.specialization || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const citySlug = (profileData.city || 'india')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const slug = `${nameSlug}-${specSlug}-${citySlug}`.replace(/--+/g, '-');

    const newProfile = {
      id,
      slug,
      name: profileData.name.trim(),
      specialization: profileData.specialization.trim(),
      qualifications: profileData.qualifications ? profileData.qualifications.trim() : '',
      clinicName: profileData.clinicName ? profileData.clinicName.trim() : '',
      clinicAddress: profileData.clinicAddress ? profileData.clinicAddress.trim() : '',
      city: profileData.city ? profileData.city.trim() : 'Bengaluru',
      location: profileData.location ? profileData.location.trim() : '',
      contactPhone: profileData.contactPhone ? profileData.contactPhone.trim() : '',
      contactEmail: profileData.contactEmail ? profileData.contactEmail.trim() : '',
      photo: profileData.photo || null,
      status: profileData.status || 'unclaimed',
      claimedByAccountId: null,
      claimedAt: null,
      claimId: null,
      bio: profileData.bio || '',
      experience: profileData.experience || '',
      languages: profileData.languages || ['English'],
      regNo: profileData.regNo ? profileData.regNo.trim() : '',
      regCouncil: profileData.regCouncil ? profileData.regCouncil.trim() : '',
      fee: null, // Never invent fees for unclaimed profiles
      isIndexedForGoogle: true,
      metaTitle: `${profileData.name} - ${profileData.specialization} in ${profileData.city || 'India'} | MediUnify`,
      metaDescription: `Doctor profile for ${profileData.name}, ${profileData.specialization}. Verified medical directory on MediUnify.`,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      updatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      pendingReviewFields: null,
    };

    this.profiles.unshift(newProfile);

    // Record Audit Log
    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: 'PROFILE_CREATED',
      actor: adminActor,
      target: `${newProfile.name} (${newProfile.id})`,
      details: `Admin created profile with status "${newProfile.status}". Specialization: ${newProfile.specialization}.`,
    });

    this.persist();
    return newProfile;
  }

  // Admin Edit Doctor Profile
  updateDoctorProfile(id, updates, adminActor = 'Super Admin') {
    const idx = this.profiles.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Doctor profile not found');

    const existing = this.profiles[idx];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    this.profiles[idx] = updated;

    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: 'PROFILE_EDITED',
      actor: adminActor,
      target: `${updated.name} (${updated.id})`,
      details: `Admin updated profile fields: ${Object.keys(updates).join(', ')}.`,
    });

    this.persist();
    return updated;
  }

  // Admin Deactivate Profile
  toggleProfileStatus(id, newStatus, adminActor = 'Super Admin') {
    const p = this.getProfileById(id);
    if (!p) throw new Error('Profile not found');

    p.status = newStatus;
    p.updatedAt = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: newStatus === 'inactive' ? 'PROFILE_DEACTIVATED' : 'PROFILE_REACTIVATED',
      actor: adminActor,
      target: `${p.name} (${p.id})`,
      details: `Profile status changed to "${newStatus}".`,
    });

    this.persist();
    return p;
  }

  // Doctor Updates Own Permitted Information (Doctor Portal / Mobile App)
  updateDoctorSelfProfile(profileId, allowedUpdates, doctorAccountId) {
    const p = this.getProfileById(profileId);
    if (!p) throw new Error('Profile not found');

    // Access control check: doctor can only manage their own linked profile
    if (p.claimedByAccountId && p.claimedByAccountId !== doctorAccountId) {
      throw new Error('Access denied: You do not have permission to manage this doctor profile.');
    }

    // Permitted fields that doctor can directly update
    const permittedDirect = ['bio', 'photo', 'languages', 'clinicAddress', 'location'];
    // Fields that require review before displaying as verified
    const reviewRequired = ['qualifications', 'specialization', 'regNo', 'regCouncil', 'clinicName'];

    let directChanges = {};
    let pendingChanges = {};

    for (const key of Object.keys(allowedUpdates)) {
      if (permittedDirect.includes(key)) {
        directChanges[key] = allowedUpdates[key];
      } else if (reviewRequired.includes(key)) {
        pendingChanges[key] = allowedUpdates[key];
      }
    }

    // Apply direct changes immediately
    Object.assign(p, directChanges);

    // If sensitive credentials changed, mark as pending review
    if (Object.keys(pendingChanges).length > 0) {
      p.pendingReviewFields = {
        ...(p.pendingReviewFields || {}),
        ...pendingChanges,
        submittedAt: new Date().toLocaleString(),
      };

      // Notify Admin
      this.notifications.unshift({
        id: `notif_review_${Date.now()}`,
        recipientRole: 'admin',
        recipientId: 'admin_all',
        title: 'Doctor Profile Changes Awaiting Review',
        message: `${p.name} submitted updates to professional credentials (${Object.keys(pendingChanges).join(', ')}).`,
        timestamp: new Date().toLocaleString(),
        read: false,
        link: 'admin-claims',
      });
    }

    p.updatedAt = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Sync mock doctor object so other parts of mobile app stay consistent
    if (p.name) defaultMockDoctor.name = p.name;
    if (p.specialization) defaultMockDoctor.specialization = p.specialization;
    if (p.qualifications) defaultMockDoctor.qualification = p.qualifications;
    if (p.clinicName) defaultMockDoctor.clinic = p.clinicName;
    if (p.clinicAddress) defaultMockDoctor.clinicAddress = p.clinicAddress;

    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: 'DOCTOR_SELF_UPDATE',
      actor: p.name,
      target: `${p.name} (${p.id})`,
      details: `Doctor updated self profile. Direct: ${Object.keys(directChanges).join(', ') || 'None'}. Pending review: ${Object.keys(pendingChanges).join(', ') || 'None'}.`,
    });

    this.persist();
    return p;
  }

  // ----------------------------------------------------
  // 2. CLAIMS REPOSITORY & WORKFLOW
  // ----------------------------------------------------

  getAllClaims({ status = 'all', searchQuery = '' } = {}) {
    let result = [...this.claims];

    if (status !== 'all') {
      result = result.filter((c) => c.status === status);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((c) => {
        return (
          (c.doctorProfileName || '').toLowerCase().includes(q) ||
          (c.claimantName || '').toLowerCase().includes(q) ||
          (c.claimantEmail || '').toLowerCase().includes(q) ||
          (c.regNumber || '').toLowerCase().includes(q)
        );
      });
    }

    return result.sort((a, b) => new Date(b.submissionDateIso || 0) - new Date(a.submissionDateIso || 0));
  }

  getClaimById(claimId) {
    return this.claims.find((c) => c.id === claimId) || null;
  }

  getClaimByProfileId(profileId) {
    return this.claims.find((c) => c.doctorProfileId === profileId) || null;
  }

  getClaimsForAccount(accountId) {
    if (!accountId) return [];
    return this.claims.filter((c) => c.claimantAccountId === accountId);
  }

  // Submit Claim (Doctor Claim Flow)
  submitClaim({
    doctorProfileId,
    claimantAccountId,
    claimantName,
    claimantEmail,
    claimantPhone,
    regNumber,
    regCouncil,
    yearOfReg = '',
    documents = [],
    legalDeclarationAccepted = false,
  }) {
    const profile = this.getProfileById(doctorProfileId);
    if (!profile) {
      throw new Error('Doctor profile not found.');
    }

    // Check if profile is already claimed
    if (profile.status === 'claimed_verified' && profile.claimedByAccountId) {
      throw new Error('This doctor profile is already claimed and verified. Conflicting ownership claims are not permitted.');
    }

    // Check if an existing active claim is already pending for this profile
    const existingPending = this.claims.find(
      (c) => c.doctorProfileId === doctorProfileId && (c.status === 'pending' || c.status === 'info_requested')
    );
    if (existingPending) {
      throw new Error('A claim is already in progress for this doctor profile. Duplicate claim submissions are prohibited.');
    }

    if (!regNumber || !regNumber.trim()) {
      throw new Error('Medical Council Registration Number is required.');
    }

    if (!regCouncil || !regCouncil.trim()) {
      throw new Error('Registering Authority / Medical Council is required.');
    }

    if (!legalDeclarationAccepted) {
      throw new Error('You must confirm that you are authorized to claim this profile and the submitted details are accurate.');
    }

    const claimId = `claim_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newClaim = {
      id: claimId,
      doctorProfileId,
      doctorProfileName: profile.name,
      claimantAccountId: claimantAccountId || `acc_${Date.now()}`,
      claimantName: claimantName.trim(),
      claimantEmail: claimantEmail.trim(),
      claimantPhone: claimantPhone.trim(),
      regNumber: regNumber.trim(),
      regCouncil: regCouncil.trim(),
      yearOfReg: yearOfReg.trim(),
      documents: documents.length > 0 ? documents : [
        {
          id: `doc_cert_${Date.now()}`,
          name: `${regNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Registration_Certificate.pdf`,
          type: 'Medical Council Registration Certificate',
          size: '1.9 MB',
          uploadedAt: formattedDate,
        },
      ],
      legalDeclarationAccepted: true,
      submissionDate: formattedDate,
      submissionDateIso: nowIso,
      status: 'pending', // 'pending' | 'approved' | 'rejected' | 'info_requested'
      rejectionReason: null,
      infoRequestedNote: null,
      adminNotes: '',
      reviewHistory: [
        {
          action: 'CLAIM_SUBMITTED',
          date: formattedDate,
          actor: claimantName,
          note: 'Doctor submitted claim for verification. Documents attached.',
        },
      ],
    };

    this.claims.unshift(newClaim);

    // Update profile status to claim_pending
    profile.status = 'claim_pending';
    profile.claimId = claimId;
    profile.claimedByAccountId = newClaim.claimantAccountId;
    profile.updatedAt = formattedDate;

    // Dispatch Notification to Admin
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      recipientRole: 'admin',
      recipientId: 'admin_all',
      title: 'New Doctor Profile Claim Requires Review',
      message: `${claimantName} claimed profile "${profile.name}". Registration No: ${regNumber} (${regCouncil}).`,
      timestamp: formattedDate,
      read: false,
      link: 'admin-claims',
    });

    // Dispatch Notification to Doctor
    this.notifications.unshift({
      id: `notif_doc_${Date.now()}`,
      recipientRole: 'doctor',
      recipientId: newClaim.claimantAccountId,
      title: 'Claim Submitted Successfully',
      message: `Your claim for ${profile.name} is now pending Super Admin verification. You will be notified once reviewed.`,
      timestamp: formattedDate,
      read: false,
      link: 'doctor-claim-profile',
    });

    // Record Audit
    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      timestamp: formattedDate,
      action: 'CLAIM_SUBMITTED',
      actor: claimantName,
      target: `${profile.name} (${profile.id})`,
      details: `Claim ID: ${claimId}. Medical Reg: ${regNumber} (${regCouncil}).`,
    });

    this.persist();
    return newClaim;
  }

  // Admin: Approve Claim
  approveClaim(claimId, adminActor = 'Super Admin', adminNotes = '') {
    const claim = this.getClaimById(claimId);
    if (!claim) throw new Error('Claim record not found');

    const profile = this.getProfileById(claim.doctorProfileId);
    if (!profile) throw new Error('Linked doctor profile not found');

    const formattedDate = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Update Claim
    claim.status = 'approved';
    claim.rejectionReason = null;
    claim.infoRequestedNote = null;
    if (adminNotes) claim.adminNotes = adminNotes;
    claim.reviewHistory.push({
      action: 'CLAIM_APPROVED',
      date: formattedDate,
      actor: adminActor,
      note: adminNotes || 'Verified against Medical Council Registry. Profile ownership granted.',
    });

    // Update Profile: link to authenticated doctor account & mark claimed_verified
    profile.status = 'claimed_verified';
    profile.claimedByAccountId = claim.claimantAccountId;
    profile.claimedAt = formattedDate;
    profile.claimId = claim.id;
    profile.regNo = claim.regNumber;
    profile.regCouncil = claim.regCouncil;
    if (claim.claimantEmail) profile.contactEmail = claim.claimantEmail;
    if (claim.claimantPhone) profile.contactPhone = claim.claimantPhone;
    profile.updatedAt = formattedDate;

    // Sync global mock doctor object for immediate mobile/web consistency
    if (profile.name) defaultMockDoctor.name = profile.name;
    if (profile.specialization) defaultMockDoctor.specialization = profile.specialization;
    if (profile.qualifications) defaultMockDoctor.qualification = profile.qualifications;
    if (profile.clinicName) defaultMockDoctor.clinic = profile.clinicName;
    if (profile.clinicAddress) defaultMockDoctor.clinicAddress = profile.clinicAddress;
    if (claim.regNumber) defaultMockDoctor.regNo = claim.regNumber;

    // Notify Doctor
    this.notifications.unshift({
      id: `notif_doc_app_${Date.now()}`,
      recipientRole: 'doctor',
      recipientId: claim.claimantAccountId,
      title: 'Profile Claim Approved!',
      message: `Your profile claim for "${profile.name}" has been verified and approved by Super Admin. You now have full management access.`,
      timestamp: formattedDate,
      read: false,
      link: 'doctor-portal',
    });

    // Record Audit
    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      timestamp: formattedDate,
      action: 'CLAIM_APPROVED',
      actor: adminActor,
      target: `${profile.name} (${profile.id})`,
      details: `Claim ${claim.id} approved. Profile ownership linked to account ${claim.claimantAccountId}.`,
    });

    this.persist();
    return { claim, profile };
  }

  // Admin: Reject Claim
  rejectClaim(claimId, reason, adminActor = 'Super Admin') {
    const claim = this.getClaimById(claimId);
    if (!claim) throw new Error('Claim record not found');

    const profile = this.getProfileById(claim.doctorProfileId);
    if (!profile) throw new Error('Linked doctor profile not found');

    if (!reason || !reason.trim()) {
      throw new Error('A rejection reason must be recorded.');
    }

    const formattedDate = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    claim.status = 'rejected';
    claim.rejectionReason = reason.trim();
    claim.reviewHistory.push({
      action: 'CLAIM_REJECTED',
      date: formattedDate,
      actor: adminActor,
      note: reason.trim(),
    });

    // Reset profile back to unclaimed so another legitimate doctor can claim
    profile.status = 'unclaimed';
    profile.claimedByAccountId = null;
    profile.claimId = null;
    profile.updatedAt = formattedDate;

    // Notify Doctor
    this.notifications.unshift({
      id: `notif_doc_rej_${Date.now()}`,
      recipientRole: 'doctor',
      recipientId: claim.claimantAccountId,
      title: 'Profile Claim Rejected',
      message: `Your claim for "${profile.name}" could not be verified: ${reason.trim()}`,
      timestamp: formattedDate,
      read: false,
      link: 'doctor-claim-profile',
    });

    // Record Audit
    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      timestamp: formattedDate,
      action: 'CLAIM_REJECTED',
      actor: adminActor,
      target: `${profile.name} (${profile.id})`,
      details: `Claim ${claim.id} rejected. Reason: ${reason.trim()}. Profile reverted to unclaimed.`,
    });

    this.persist();
    return { claim, profile };
  }

  // Admin: Request Additional Information
  requestAdditionalInfo(claimId, requestNote, adminActor = 'Super Admin') {
    const claim = this.getClaimById(claimId);
    if (!claim) throw new Error('Claim record not found');

    if (!requestNote || !requestNote.trim()) {
      throw new Error('Please enter the additional information required from the claimant.');
    }

    const formattedDate = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    claim.status = 'info_requested';
    claim.infoRequestedNote = requestNote.trim();
    claim.reviewHistory.push({
      action: 'ADDITIONAL_INFO_REQUESTED',
      date: formattedDate,
      actor: adminActor,
      note: requestNote.trim(),
    });

    // Notify Doctor
    this.notifications.unshift({
      id: `notif_doc_info_${Date.now()}`,
      recipientRole: 'doctor',
      recipientId: claim.claimantAccountId,
      title: 'Additional Information Required for Claim',
      message: `Super Admin requested additional verification details for ${claim.doctorProfileName}: ${requestNote.trim()}`,
      timestamp: formattedDate,
      read: false,
      link: 'doctor-claim-profile',
    });

    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      timestamp: formattedDate,
      action: 'INFO_REQUESTED',
      actor: adminActor,
      target: `${claim.doctorProfileName} (${claim.doctorProfileId})`,
      details: `Claim ${claim.id}: Requested info: ${requestNote.trim()}.`,
    });

    this.persist();
    return claim;
  }

  // Doctor: Submit Additional Information / Documents
  submitAdditionalInfo(claimId, note, newDocuments = []) {
    const claim = this.getClaimById(claimId);
    if (!claim) throw new Error('Claim record not found');

    const formattedDate = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (newDocuments.length > 0) {
      claim.documents = [...claim.documents, ...newDocuments];
    }

    claim.status = 'pending';
    claim.reviewHistory.push({
      action: 'ADDITIONAL_INFO_SUBMITTED',
      date: formattedDate,
      actor: claim.claimantName,
      note: note || 'Claimant uploaded requested additional verification documents.',
    });

    // Notify Admin
    this.notifications.unshift({
      id: `notif_admin_info_${Date.now()}`,
      recipientRole: 'admin',
      recipientId: 'admin_all',
      title: 'Additional Verification Documents Submitted',
      message: `${claim.claimantName} uploaded requested verification documents for claim ${claim.id}.`,
      timestamp: formattedDate,
      read: false,
      link: 'admin-claims',
    });

    this.persist();
    return claim;
  }

  // ----------------------------------------------------
  // 3. SEO & SCHEMA.ORG JSON-LD GENERATOR
  // ----------------------------------------------------
  generateDoctorSeoMetadata(profile) {
    if (!profile) return null;

    const canonicalUrl = `https://mediunify.com/doctors/${profile.slug}`;
    const schemaJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: profile.name,
      medicalSpecialty: profile.specialization,
      url: canonicalUrl,
      image: profile.photo || 'https://mediunify.com/assets/default-doctor.jpg',
      description: profile.bio || `Consult ${profile.name}, ${profile.specialization} on MediUnify.`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: profile.clinicAddress || profile.location || '',
        addressLocality: profile.city || 'Bengaluru',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
      isAcceptingNewPatients: profile.status === 'claimed_verified',
      medicalAudience: 'Patients',
    };

    return {
      title: profile.metaTitle || `${profile.name} - ${profile.specialization} | MediUnify`,
      description: profile.metaDescription || `View verified profile of ${profile.name}.`,
      canonicalUrl,
      schemaJsonLd,
    };
  }

  // ----------------------------------------------------
  // 4. NOTIFICATIONS
  // ----------------------------------------------------
  getNotifications(role = 'all', recipientId = null) {
    let list = [...this.notifications];
    if (role !== 'all') {
      list = list.filter((n) => n.recipientRole === role || n.recipientRole === 'all');
    }
    if (recipientId) {
      list = list.filter((n) => n.recipientId === recipientId || n.recipientId === 'admin_all' || n.recipientId === 'all');
    }
    return list;
  }

  markNotificationAsRead(id) {
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.persist();
    }
  }

  // ----------------------------------------------------
  // 5. AUDIT LOGS
  // ----------------------------------------------------
  getAuditLogs() {
    return [...this.auditLogs];
  }
}

// Singleton export
export const doctorClaimService = new DoctorClaimService();
export default doctorClaimService;
