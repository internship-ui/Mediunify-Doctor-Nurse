import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NurseSidebar from './NurseSidebar';
import NurseTopNavbar from './NurseTopNavbar';
import NurseServicesPage from './NurseServicesPage';
import NurseAvailabilityPage from './NurseAvailabilityPage';
import NurseHistoryPage from './NurseHistoryPage';
import NurseProfilePage from './NurseProfilePage';
import NurseDashboardPage from './NurseDashboardPage';

export default function NurseWebPortal({ onNavigateHome, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'home':
        return <NurseDashboardPage setActiveTab={setActiveTab} />;
      case 'services':
        return <NurseServicesPage setActiveTab={setActiveTab} />;
      case 'schedule':
      case 'availability':
        return <NurseAvailabilityPage />;
      case 'history':
        return <NurseHistoryPage />;
      case 'profile':
        return (
          <NurseProfilePage
            setActiveTab={setActiveTab}
            onNavigateHome={onNavigateHome}
          />
        );
      default:
        return <NurseDashboardPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <View style={styles.portalContainer}>
      {/* Deep Navy Left Sidebar (Matching Screenshots) */}
      <NurseSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Right Area: Topbar + Active Content */}
      <View style={styles.mainRight}>
        <NurseTopNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigateHome={onNavigateHome}
          onLogout={onLogout || onNavigateHome}
          onOpenNotifications={() => setActiveTab('notifications')}
        />
        <View style={styles.bodyViewport}>
          {renderContent()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  portalContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F7FB',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  mainRight: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  bodyViewport: {
    flex: 1,
    overflow: 'hidden',
  },
});
