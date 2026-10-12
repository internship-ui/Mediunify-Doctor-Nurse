import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DoctorSidebar from './DoctorSidebar';
import DoctorDashboardPage from './DoctorDashboardPage';
import DoctorAppointmentsPage from './DoctorAppointmentsPage';
import DoctorFollowUpsPage from './DoctorFollowUpsPage';
import DoctorDirectPatientPage from './DoctorDirectPatientPage';
import DoctorAvailabilityPage from './DoctorAvailabilityPage';
import DoctorConsultationPage from './DoctorConsultationPage';
import DoctorPrescriptionPage from './DoctorPrescriptionPage';
import DoctorSchedulePage from './DoctorSchedulePage';
import DoctorEarningsPage from './DoctorEarningsPage';
import DoctorHomeNursingPage from './DoctorHomeNursingPage';
import DoctorProfilePage from './DoctorProfilePage';
import DoctorEmailPage from './DoctorEmailPage';

export default function DoctorWebPortal({ onNavigateHome }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const [targetAppointmentId, setTargetAppointmentId] = useState(null);
  const [openAppointmentDrawer, setOpenAppointmentDrawer] = useState(false);

  const [targetFollowUpPatientId, setTargetFollowUpPatientId] = useState(null);
  const [openFollowUpDrawer, setOpenFollowUpDrawer] = useState(false);

  const handleStartConsultation = (appointment) => {
    setSelectedConsultation(appointment);
    setActiveTab('consultation');
  };

  const handleStartConsultNotes = (appointment) => {
    handleViewPatientDetails(appointment);
  };

  const handleStartPrescription = (patient) => {
    setSelectedConsultation(patient);
    setActiveTab('prescriptions');
  };

  const handleViewPatientDetails = (appointment) => {
    setSelectedConsultation(appointment);
    const identifier = appointment?.appointmentId || appointment?.name || appointment?.patient || appointment?.id;
    setTargetAppointmentId(identifier);
    setOpenAppointmentDrawer(true);
    setActiveTab('appointments');
  };

  const handleViewFollowUpPatient = (patient) => {
    const identifier = patient?.name || patient?.id;
    setTargetFollowUpPatientId(identifier);
    setOpenFollowUpDrawer(true);
    setActiveTab('followups');
  };

  const handleSelectTab = (tabId) => {
    if (tabId === 'appointments') {
      // Clear targeted patient slide drawer when navigating from sidebar
      setTargetAppointmentId(null);
      setOpenAppointmentDrawer(false);
      setSelectedConsultation(null);
    }
    if (tabId === 'followups') {
      setTargetFollowUpPatientId(null);
      setOpenFollowUpDrawer(false);
    }
    setActiveTab(tabId);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DoctorDashboardPage
            setActiveTab={handleSelectTab}
            onStartConsultation={handleStartConsultation}
            onStartConsultNotes={handleStartConsultNotes}
            onViewPatientDetails={handleViewPatientDetails}
            onViewFollowUpPatient={handleViewFollowUpPatient}
          />
        );
      case 'appointments':
        return (
          <DoctorAppointmentsPage
            key={`appointments-${targetAppointmentId || 'all'}-${openAppointmentDrawer ? 'open' : 'closed'}`}
            setActiveTab={handleSelectTab}
            onStartConsultation={handleStartConsultation}
            onStartConsultNotes={handleStartConsultNotes}
            initialAppointmentId={targetAppointmentId}
            initialOpenSlideDrawer={openAppointmentDrawer}
            targetAppointment={selectedConsultation}
            onCloseDrawer={() => {
              setOpenAppointmentDrawer(false);
              setTargetAppointmentId(null);
            }}
          />
        );

      case 'followups':
        return (
          <DoctorFollowUpsPage
            setActiveTab={handleSelectTab}
            onStartConsultation={handleStartConsultation}
            onStartConsultNotes={handleStartConsultNotes}
            onStartPrescription={handleStartPrescription}
            initialPatientId={targetFollowUpPatientId}
            initialOpenSlideDrawer={openFollowUpDrawer}
            onCloseDrawer={() => {
              setOpenFollowUpDrawer(false);
              setTargetFollowUpPatientId(null);
            }}
          />
        );
      case 'directpatient':
        return (
          <DoctorDirectPatientPage
            setActiveTab={handleSelectTab}
          />
        );
      case 'availability':
        return (
          <DoctorAvailabilityPage />
        );
      case 'schedule':
        return <DoctorSchedulePage />;
      case 'consultation':
        return (
          <DoctorConsultationPage
            selectedConsultation={selectedConsultation}
            setActiveTab={handleSelectTab}
          />
        );
      case 'email':
      case 'mail':
      case 'messages':
        return (
          <DoctorEmailPage
            setActiveTab={handleSelectTab}
            onNavigateHome={onNavigateHome}
          />
        );
      case 'consultnotes':
        return (
          <DoctorAppointmentsPage
            key={`appointments-${targetAppointmentId || 'all'}-${openAppointmentDrawer ? 'open' : 'closed'}`}
            setActiveTab={handleSelectTab}
            onStartConsultation={handleStartConsultation}
            onStartConsultNotes={handleStartConsultNotes}
            initialAppointmentId={targetAppointmentId}
            initialOpenSlideDrawer={true}
            targetAppointment={selectedConsultation}
            onCloseDrawer={() => {
              setOpenAppointmentDrawer(false);
              setTargetAppointmentId(null);
            }}
          />
        );
      case 'prescriptions':
        return (
          <DoctorPrescriptionPage
            selectedPatient={selectedConsultation}
            setActiveTab={handleSelectTab}
          />
        );
      case 'earnings':
        return <DoctorEarningsPage />;
      case 'homenursing':
        return <DoctorHomeNursingPage />;
      case 'profile':
        return (
          <DoctorProfilePage
            setActiveTab={handleSelectTab}
            onNavigateHome={onNavigateHome}
          />
        );
      default:
        return (
          <DoctorDashboardPage
            setActiveTab={handleSelectTab}
            onStartConsultation={handleStartConsultation}
            onStartConsultNotes={handleStartConsultNotes}
            onViewPatientDetails={handleViewPatientDetails}
            onViewFollowUpPatient={handleViewFollowUpPatient}
          />
        );
    }
  };

  return (
    <View style={styles.portalRoot}>
      {/* Full-Height Left Sidebar */}
      <DoctorSidebar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onNavigateHome={onNavigateHome}
      />

      {/* Main Viewport */}
      <View style={styles.mainViewport}>
        {renderActivePage()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  portalRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  mainViewport: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#F4F7FB',
  },
});

