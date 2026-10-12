import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useInjectWebStyles } from './WebStyles';
import { setupWebAlertPolyfill } from './WebAlertPolyfill';
import MobileAppWebWrapper from './MobileAppWebWrapper';
import WebLandingPage from './landing/WebLandingPage';
import DoctorAuthPage from './auth/DoctorAuthPage';
import NurseAuthPage from './auth/NurseAuthPage';
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Determine active presentation mode:
  // - On mobile phone in regular mode: viewport width is <= 768px (typically 360px - 430px) -> show mobile App UI interface
  // - On mobile phone when user taps checkmark for "Desktop site" in Google/Chrome:
  //   mobile browser forces layout viewport to 980px or 1024px (windowWidth > 768px) -> show Web Application UI interface
  // - On desktop/laptop browser: windowWidth > 768px -> show Web Application UI interface
  const isDesktopMode = windowWidth > 768;

  // Render content according to active presentation mode
  const renderWebContent = () => {
    // 1. Mobile phone regular browser: Render mobile app application UI interface directly
    if (!isDesktopMode) {
      return (
        <MobileAppWebWrapper>
          {children}
        </MobileAppWebWrapper>
      );
    }

    // 2. Desktop website mode (Desktop computer or phone with "Desktop site" checkmark enabled)
    switch (webRoute) {
      case 'landing':
        return <WebLandingPage onNavigate={setWebRoute} />;
      case 'doctor-login':
      case 'doctor-register':
        return <DoctorAuthPage onNavigate={setWebRoute} />;
      case 'nurse-login':
      case 'nurse-register':
        return <NurseAuthPage onNavigate={setWebRoute} />;
      case 'doctor-portal':
        return (
          <DoctorWebPortal onNavigateHome={() => setWebRoute('landing')} />
        );
      case 'nurse-portal':
        return (
          <NurseWebPortal
            onNavigateHome={() => setWebRoute('landing')}
            onLogout={() => setWebRoute('landing')}
          />
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
