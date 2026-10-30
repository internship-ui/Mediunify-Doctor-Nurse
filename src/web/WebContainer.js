import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useInjectWebStyles } from './WebStyles';
import { setupWebAlertPolyfill } from './WebAlertPolyfill';
import MobileAppWebWrapper from './MobileAppWebWrapper';
import WebLandingPage from './landing/WebLandingPage';
import RoleSelectionPage from './auth/RoleSelectionPage';
import DoctorAuthPage from './auth/DoctorAuthPage';
import NurseAuthPage from './auth/NurseAuthPage';
import DoctorClaimProfilePage from './auth/DoctorClaimProfilePage';
import DoctorWebPortal from './doctor/DoctorWebPortal';
import NurseWebPortal from './nurse/NurseWebPortal';

export default function WebContainer({ children }) {
  // If running natively on Android or iOS devices, pass through with zero overhead
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // Inject web global resets, Google Fonts, and alert polyfill
  useInjectWebStyles();
  setupWebAlertPolyfill();

  // Dynamic window width measurement
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024;
  });

  // Web Route State:
  // 'landing' | 'doctor-login' | 'doctor-register' | 'doctor-portal' | 'nurse-login' | 'nurse-register' | 'nurse-portal'
  const [webRoute, setWebRoute] = useState('landing');

  // Manual mode override (null = auto based on viewport)
  // 'desktop' = force desktop website mode
  // 'mobile' = force mobile app UI interface mode
  const [modeOverride, setModeOverride] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine active presentation mode
  const isAutoDesktop = windowWidth > 768;
  const isDesktopMode = modeOverride !== null ? modeOverride === 'desktop' : isAutoDesktop;

  // Render content according to active route & viewport
  const renderWebContent = () => {
    // If user specifically toggled "Phone App UI" or is on a phone browser while in a portal:
    if (!isDesktopMode && (webRoute === 'doctor-portal' || webRoute === 'nurse-portal')) {
      return (
        <MobileAppWebWrapper>
          {children}
        </MobileAppWebWrapper>
      );
    }

    switch (webRoute) {
      case 'landing':
        return <WebLandingPage onNavigate={setWebRoute} />;
      case 'role-signin':
        return <RoleSelectionPage mode="signin" onNavigate={setWebRoute} />;
      case 'role-signup':
        return <RoleSelectionPage mode="signup" onNavigate={setWebRoute} />;
      case 'doctor-login':
        return <DoctorAuthPage initialMode="signin" onNavigate={setWebRoute} />;
      case 'doctor-register':
        return <DoctorAuthPage initialMode="signup" onNavigate={setWebRoute} />;
      case 'doctor-claim-profile':
        return <DoctorClaimProfilePage onNavigate={setWebRoute} />;
      case 'nurse-login':
        return <NurseAuthPage initialMode="signin" onNavigate={setWebRoute} />;
      case 'nurse-register':
        return <NurseAuthPage initialMode="signup" onNavigate={setWebRoute} />;
      case 'doctor-portal':
        return isDesktopMode ? (
          <DoctorWebPortal onNavigateHome={() => setWebRoute('landing')} />
        ) : (
          <MobileAppWebWrapper>{children}</MobileAppWebWrapper>
        );
      case 'nurse-portal':
        return isDesktopMode ? (
          <NurseWebPortal
            onNavigateHome={() => setWebRoute('landing')}
            onLogout={() => setWebRoute('landing')}
          />
        ) : (
          <MobileAppWebWrapper>{children}</MobileAppWebWrapper>
        );
      default:
        return <WebLandingPage onNavigate={setWebRoute} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderWebContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    position: 'relative',
  },
});
