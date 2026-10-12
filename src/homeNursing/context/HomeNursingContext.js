import React, { createContext, useContext, useState } from 'react';

const HomeNursingContext = createContext(null);

export const DEFAULT_NURSE_PROFILE = {
  fullName: 'Nurse Kavitha R.',
  initials: 'KR',
  dob: '14/08/1996',
  gender: 'Female',
  phoneNumber: '9876543210',
  isPhoneVerified: true,
  email: 'kavitha.nurse@mediunify.com',
  residentialAddress: '#42, 3rd Cross, 100ft Road, Indiranagar',
  cityArea: 'Indiranagar, Bengaluru',
  pincode: '560038',
  qualification: 'B.Sc Nursing',
  licenseNumber: 'KNC-2019-88421',
  registrationAuthority: 'Karnataka Nursing Council',
  yearsOfExperience: '5 Years',
  specialization: [
    'Wound Care & Dressing',
    'Post-Surgical Care',
    'Medication Admin',
    'Geriatric Care',
    'IV & Infusion Therapy',
  ],
  workExperience: '5 years total: 3 years Staff Nurse at Manipal Hospital Bengaluru, 2 years Senior Home Care Specialist.',
  registrationCertificate: {
    name: 'KNC_Registration_Cert.pdf',
    size: '2.4 MB',
    uploadedDate: '12 Jan 2024',
    status: 'Verified',
  },
  qualificationCertificate: {
    name: 'BSc_Nursing_Degree.pdf',
    size: '1.8 MB',
    uploadedDate: '20 May 2019',
    status: 'Verified',
  },
  govtIdProof: {
    name: 'Aadhaar_Card_Verified.pdf',
    size: '1.1 MB',
    uploadedDate: '05 Mar 2023',
    status: 'Verified',
  },
  registrationStatus: 'Approved', // 'Approved' | 'Pending' | 'Rejected'
  rejectionReason: '',
  approvedDate: '15 Jan 2024',
  profilePhoto: null,
};

export const INITIAL_SCHEDULE = [
  { day: 'Mon', label: 'Monday', hours: '8:00 – 16:00', active: true },
  { day: 'Tue', label: 'Tuesday', hours: '8:00 – 16:00', active: true },
  { day: 'Wed', label: 'Wednesday', hours: '8:00 – 16:00', active: true },
  { day: 'Thu', label: 'Thursday', hours: '12:00 – 20:00', active: true },
  { day: 'Fri', label: 'Friday', hours: '8:00 – 16:00', active: true },
  { day: 'Sat', label: 'Saturday', hours: '8:00 – 13:00', active: true },
  { day: 'Sun', label: 'Sunday', hours: 'Off duty', active: false },
];

export const INITIAL_LEAVES = [
  {
    id: 'leave-1',
    dates: '12 – 13 Oct',
    reason: 'Personal leave',
    status: 'Requested',
  },
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'NS-2041',
    service: 'Wound dressing',
    patientName: 'Priya Sharma',
    patientAge: 28,
    patientGender: 'Female',
    patientPhone: '+91 98860 12345',
    dateTime: 'Today, 4:00 PM',
    timeLabel: 'Today, 4:00 PM',
    location: '12th Main, Indiranagar',
    distance: '3.2 km',
    eta: 'about 14 min',
    remainingDistance: '1.1 km left',
    assignedAgo: '10 min ago',
    instructions:
      'Dressing change on left forearm. Carry sterile kit. Ask for door code on arrival.',
    status: 'Assigned', // 'Assigned' | 'On the way' | 'In progress' | 'Completed'
    acceptedTime: '3:34 PM',
    onTheWayTime: '3:41 PM',
    startedTime: null,
    completedTime: null,
  },
  {
    id: 'NS-2042',
    service: 'Injection administration',
    patientName: 'Kishore Kumar',
    patientAge: 62,
    patientGender: 'Male',
    patientPhone: '+91 94481 67890',
    dateTime: 'Tomorrow, 9:30 AM',
    timeLabel: 'Tomorrow, 9:30 AM',
    location: '7th Sector, HSR Layout',
    distance: '4.8 km',
    eta: 'about 20 min',
    remainingDistance: '4.8 km left',
    assignedAgo: '25 min ago',
    instructions:
      'Insulin administration and blood glucose test. Fasting glucose report needed.',
    status: 'Assigned',
    acceptedTime: null,
    onTheWayTime: null,
    startedTime: null,
    completedTime: null,
  },
];

export const INITIAL_UPCOMING = [
  {
    id: 'NS-2039',
    service: 'Vitals & BP Monitoring',
    patientName: 'Meera Rao',
    patientAge: 71,
    patientGender: 'Female',
    patientPhone: '+91 98450 11223',
    dateTime: 'Tomorrow, 8:00 AM',
    timeLabel: 'Tomorrow, 8:00 AM',
    location: 'HAL 2nd Stage, Indiranagar',
    distance: '2.1 km',
    eta: 'about 8 min',
    status: 'Upcoming',
  },
  {
    id: 'NS-2038',
    service: 'Post-Surgical Catheter Care',
    patientName: 'Devraj Urs',
    patientAge: 54,
    patientGender: 'Male',
    patientPhone: '+91 99002 33445',
    dateTime: '3 Oct, 11:30 AM',
    timeLabel: '3 Oct, 11:30 AM',
    location: 'BTM 2nd Stage, Bengaluru',
    distance: '5.2 km',
    eta: 'about 22 min',
    status: 'Upcoming',
  },
  {
    id: 'NS-2037',
    service: 'Elderly Mobility Assistance',
    patientName: 'Kamala Devi',
    patientAge: 82,
    patientGender: 'Female',
    patientPhone: '+91 97411 99887',
    dateTime: '4 Oct, 10:00 AM',
    timeLabel: '4 Oct, 10:00 AM',
    location: 'Koramangala 4th Block',
    distance: '3.9 km',
    eta: 'about 16 min',
    status: 'Upcoming',
  },
];

export const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    patientName: 'Sneha Iyer',
    initials: 'SI',
    service: 'Injection administration',
    dateTime: 'Today, 9:30 AM',
    duration: '42 min',
    status: 'Completed',
    notes: 'Dose given, patient stable, no reaction. Recorded vitals: BP 118/78, Pulse 74 bpm.',
    patientAge: 32,
    patientGender: 'Female',
    location: 'Ulsoor, Bengaluru',
  },
  {
    id: 'hist-2',
    patientName: 'Rohan Mehta',
    initials: 'RM',
    service: 'Vitals monitoring',
    dateTime: '29 Sep, 5:00 PM',
    duration: '35 min',
    status: 'Completed',
    notes: 'BP 122/80, SPO2 98%, Heart rate normal. Patient advised on evening walk.',
    patientAge: 45,
    patientGender: 'Male',
    location: 'Indiranagar 1st Stage',
  },
  {
    id: 'hist-3',
    patientName: 'Arjun Menon',
    initials: 'AM',
    service: 'Foot ulcer dressing',
    dateTime: '28 Sep, 11:00 AM',
    duration: '50 min',
    status: 'Completed',
    notes: 'Wound cleaned with saline, betadine applied, sterile dressing changed. Healing shows good progress.',
    patientAge: 58,
    patientGender: 'Male',
    location: 'Domlur Layout',
  },
  {
    id: 'hist-4',
    patientName: 'Sunita Reddy',
    initials: 'SR',
    service: 'IV Fluid Administration',
    dateTime: '26 Sep, 2:30 PM',
    duration: '60 min',
    status: 'Completed',
    notes: '500ml Normal Saline infused via IV cannula. Cannula site healthy, no swelling or extravasation.',
    patientAge: 64,
    patientGender: 'Female',
    location: 'Old Airport Road',
  },
  {
    id: 'hist-5',
    patientName: 'David D’Souza',
    initials: 'DD',
    service: 'Tracheostomy Care & Suctioning',
    dateTime: '24 Sep, 10:15 AM',
    duration: '45 min',
    status: 'Completed',
    notes: 'Inner cannula cleaned and replaced. Secretions clear. Dressing changed around stoma.',
    patientAge: 69,
    patientGender: 'Male',
    location: 'Richmond Town',
  },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'assignment',
    title: 'New assignment',
    body: 'Wound dressing · Today 4:00 PM',
    time: '10m',
    read: false,
    icon: 'medical',
    iconColor: '#00B894',
    iconBg: '#E6FAF6',
    assignmentId: 'NS-2041',
  },
  {
    id: 'notif-2',
    type: 'assignment',
    title: 'Assignment update',
    body: 'Visit time moved to 5:00 PM',
    time: '1h',
    read: false,
    icon: 'sync-outline',
    iconColor: '#0284C7',
    iconBg: '#E0F2FE',
  },
  {
    id: 'notif-3',
    type: 'schedule',
    title: 'Leave approved',
    body: '12 – 13 Oct marked Off duty',
    time: '3h',
    read: true,
    icon: 'calendar-outline',
    iconColor: '#8B5CF6',
    iconBg: '#F3E8FF',
  },
  {
    id: 'notif-4',
    type: 'schedule',
    title: 'Service reminder',
    body: 'Tomorrow 9:30 AM · Injection',
    time: '5h',
    read: true,
    icon: 'alarm-outline',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
  },
  {
    id: 'notif-5',
    type: 'admin',
    title: 'From admin',
    body: 'Update documents before 15 Oct',
    time: '1d',
    read: true,
    icon: 'megaphone-outline',
    iconColor: '#475569',
    iconBg: '#F1F5F9',
  },
];

export function HomeNursingProvider({ children }) {
  const [nurseProfile, setNurseProfile] = useState(DEFAULT_NURSE_PROFILE);
  const [currentStatus, setCurrentStatus] = useState('Available'); // 'Available' | 'Assigned' | 'On the way' | 'In progress' | 'Off duty'
  const [weeklySchedule, setWeeklySchedule] = useState(INITIAL_SCHEDULE);
  const [plannedLeaves, setPlannedLeaves] = useState(INITIAL_LEAVES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [upcomingServices, setUpcomingServices] = useState(INITIAL_UPCOMING);
  const [completedHistory, setCompletedHistory] = useState(INITIAL_HISTORY);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);
  const [isNurseAuthenticated, setIsNurseAuthenticated] = useState(false);

  // Derive active assignment
  const activeAssignment = assignments.find(
    (a) => a.id === activeAssignmentId || a.status === 'On the way' || a.status === 'In progress'
  ) || null;

  // Compute initials helper
  const getInitials = (name) => {
    if (!name) return 'KR';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // 1. Update Nurse Profile (called when registering or editing profile)
  const saveNurseRegistration = (formData) => {
    const initials = getInitials(formData.fullName || nurseProfile.fullName);
    const updated = {
      ...nurseProfile,
      ...formData,
      initials,
      registrationStatus: formData.registrationStatus || 'Pending', // Pending until admin approval
    };
    setNurseProfile(updated);
    return updated;
  };

  const updateNurseProfile = (fields) => {
    setNurseProfile((prev) => {
      const updated = { ...prev, ...fields };
      if (fields.fullName) {
        updated.initials = getInitials(fields.fullName);
      }
      return updated;
    });
  };

  // Toggle Admin Approval Status (For testing / admin approval workflow)
  const setRegistrationStatus = (status, reason = '') => {
    setNurseProfile((prev) => ({
      ...prev,
      registrationStatus: status,
      rejectionReason: reason,
      approvedDate: status === 'Approved' ? 'Just now' : prev.approvedDate,
    }));
  };

  // 2. Schedule Management
  const toggleDaySchedule = (dayCode) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === dayCode ? { ...item, active: !item.active } : item
      )
    );
  };

  const updateDayHours = (dayCode, newHours) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === dayCode ? { ...item, hours: newHours } : item
      )
    );
  };

  const addPlannedLeave = ({ dates, reason }) => {
    const newLeave = {
      id: `leave-${Date.now()}`,
      dates: dates || 'Next week',
      reason: reason || 'Personal leave',
      status: 'Requested',
    };
    setPlannedLeaves((prev) => [newLeave, ...prev]);

    // Add a notification for schedule request
    const notif = {
      id: `notif-${Date.now()}`,
      type: 'schedule',
      title: 'Leave request submitted',
      body: `${dates || 'Leave request'} submitted to admin for review.`,
      time: 'Just now',
      read: false,
      icon: 'calendar-outline',
      iconColor: '#8B5CF6',
      iconBg: '#F3E8FF',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 3. Assignment Workflow & Auto-Updating Availability Status
  // Flow: Admin Assigns -> Nurse Receives -> Accept -> On the Way -> Service Started -> Service Completed -> Nurse Available

  const acceptAssignment = (assignmentId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAssignments((prev) =>
      prev.map((item) => {
        if (item.id === assignmentId) {
          return {
            ...item,
            status: 'On the way',
            acceptedTime: item.acceptedTime || nowTime,
            onTheWayTime: nowTime,
          };
        }
        return item;
      })
    );
    setActiveAssignmentId(assignmentId);
    setCurrentStatus('On the way'); // System automatically changes availability based on active assignments!

    // Add notification
    const notif = {
      id: `notif-${Date.now()}`,
      type: 'assignment',
      title: 'Assignment active',
      body: `Status updated to "On the way" for assignment ${assignmentId}.`,
      time: 'Just now',
      read: false,
      icon: 'navigate-outline',
      iconColor: '#00B894',
      iconBg: '#E6FAF6',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markOnTheWay = (assignmentId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAssignments((prev) =>
      prev.map((item) => {
        if (item.id === assignmentId) {
          return { ...item, status: 'On the way', onTheWayTime: nowTime };
        }
        return item;
      })
    );
    setCurrentStatus('On the way');
  };

  const markServiceStarted = (assignmentId) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAssignments((prev) =>
      prev.map((item) => {
        if (item.id === assignmentId) {
          return { ...item, status: 'In progress', startedTime: nowTime };
        }
        return item;
      })
    );
    setCurrentStatus('In progress'); // Automatically updates to In Progress
  };

  const recordArrival = (assignmentId, arrivalData = {}) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAssignments((prev) =>
      prev.map((item) => {
        if (item.id === assignmentId) {
          return {
            ...item,
            arrivalVerified: true,
            arrivalLocation: arrivalData.location || '#12, 12th Main, Indiranagar (GPS: 12.9716° N, 77.5946° E)',
            arrivalPhoto: arrivalData.photo || null,
            arrivedTime: nowTime,
          };
        }
        return item;
      })
    );
  };

  const markServiceCompleted = (
    assignmentId,
    completionNotes = 'Care completed smoothly. Patient stable.',
    extraData = {}
  ) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = assignments.find((a) => a.id === assignmentId) || activeAssignment;

    if (target) {
      // Record in history
      const historyItem = {
        id: `hist-${Date.now()}`,
        patientName: target.patientName,
        initials: getInitials(target.patientName),
        service: target.service,
        dateTime: 'Today, ' + nowTime,
        duration: '40 min',
        status: 'Completed',
        notes: completionNotes,
        patientAge: target.patientAge,
        patientGender: target.patientGender,
        location: target.location,
        followupRequired: extraData.followupRequired || false,
        followupDate: extraData.followupDate || null,
        arrivalLocation: extraData.arrivalLocation || target.arrivalLocation || null,
        arrivalPhoto: extraData.arrivalPhoto || target.arrivalPhoto || null,
      };

      setCompletedHistory((prev) => [historyItem, ...prev]);

      // Remove from assignments
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    }

    setActiveAssignmentId(null);
    setCurrentStatus('Available'); // Nurse becomes Available again!

    // Add completion notification
    const notif = {
      id: `notif-${Date.now()}`,
      type: 'assignment',
      title: 'Service completed',
      body: `Assignment ${assignmentId} marked as completed. Status restored to Available.`,
      time: 'Just now',
      read: false,
      icon: 'checkmark-circle-outline',
      iconColor: '#00B894',
      iconBg: '#E6FAF6',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 4. Notifications
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <HomeNursingContext.Provider
      value={{
        // Profile & Auth
        nurseProfile,
        isNurseAuthenticated,
        setIsNurseAuthenticated,
        saveNurseRegistration,
        updateNurseProfile,
        setRegistrationStatus,

        // Status & Availability
        currentStatus,
        setCurrentStatus,
        weeklySchedule,
        toggleDaySchedule,
        updateDayHours,
        plannedLeaves,
        addPlannedLeave,

        // Assignments & Service Tracking
        assignments,
        upcomingServices,
        completedHistory,
        activeAssignment,
        activeAssignmentId,
        acceptAssignment,
        markOnTheWay,
        recordArrival,
        markServiceStarted,
        markServiceCompleted,

        // Notifications
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
      }}
    >
      {children}
    </HomeNursingContext.Provider>
  );
}

export function useHomeNursing() {
  const ctx = useContext(HomeNursingContext);
  if (!ctx) {
    throw new Error('useHomeNursing must be used within a HomeNursingProvider');
  }
  return ctx;
}

export default HomeNursingContext;
