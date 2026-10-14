import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useInjectWebStyles } from './WebStyles';
import { setupWebAlertPolyfill } from './WebAlertPolyfill';
import MobileAppWebWrapper from './MobileAppWebWrapper';
import WebLandingPage from './landing/WebLandingPage';
import RoleSelectionPage from './auth/RoleSelectionPage';
import DoctorAuthPage from './auth/DoctorAuthPage';
import NurseAuthPage from './auth/NurseAuthPage';
import DoctorWebPortal from './doctor/DoctorWebPortal';
import NurseWebPortal from './nurse/NurseWebPortal';

/**
 * Robust detection of whether the current browser session is in Desktop Web mode
 * or Mobile / Tablet App interface mode.
 *
 * Requirements:
 * 1. Phone (standard mobile view, "Desktop site" unchecked):
 *    -> Renders App Application UI interface.
 * 2. Tablet (standard mobile view, "Desktop site" unchecked):
 *    -> Renders App Application UI interface (responsive on tablet).
 * 3. Phone with "Desktop site" CHECKED in Google Chrome / Safari:
 *    -> Renders Web Application UI interface (spacious, responsive workstation).
 * 4. Tablet with "Desktop site" CHECKED:
 *    -> Renders Web Application UI interface.
 * 5. Desktop Computer / Laptop:
 *    -> Renders Web Application UI interface.
 * 6. Floating switcher button bar is completely removed.
 */
function detectIsDesktopMode() {
  if (typeof window === 'undefined') return true;

  const width = window.innerWidth;

  // 1. If screen width is standard mobile phone width (< 768px):
  // Always render App Application UI interface
  if (width < 768) {
    return false;
  }

  // 2. Tablet detection:
  // User requirement: "for tab responsive as app application ui interface"
  const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  const isIPad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1);
  const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
  const isGenericTablet = /Tablet|Silk/i.test(ua);
  const isTablet = isIPad || isAndroidTablet || isGenericTablet;

  // Tablet in standard mode (width < 1180):
  // Renders App Application UI interface (responsive on tab)
  if (isTablet && width < 1180) {
    return false;
  }

  // 3. Google Chrome / Chromium Client Hints API
  // In Chrome on phones and tablets:
  // - When "Desktop site" is UNCHECKED: navigator.userAgentData.mobile is true.
  // - When "Desktop site" is CHECKED: navigator.userAgentData.mobile is false, and width is >= 980px.
  if (
    typeof navigator !== 'undefined' &&
    navigator.userAgentData &&
    typeof navigator.userAgentData.mobile === 'boolean'
  ) {
    if (navigator.userAgentData.mobile) {
      return false; // Normal phone / tab app mode
    }
    return width >= 900; // Desktop site enabled or PC
  }

  // 4. Fallback for mobile user-agents (Safari iOS, Firefox mobile)
  const isMobileUA = /Mobile|iPhone|iPod/i.test(ua);
  if (isMobileUA && width < 900) {
    return false;
  }

  // 5. Default threshold for desktop PC workstation
  return width >= 900;
}

export default function WebContainer({ children }) {
  // If running natively on Android or iOS devices, pass through with zero overhead
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // Inject web global resets, Google Fonts, and alert polyfill
  useInjectWebStyles();
  setupWebAlertPolyfill();

  const [isDesktopMode, setIsDesktopMode] = useState(detectIsDesktopMode);

  // Web Route State:
  // 'landing' | 'role-signin' | 'role-signup' | 'doctor-login' | 'doctor-register' | 'doctor-portal' | 'nurse-login' | 'nurse-register' | 'nurse-portal'
  const [webRoute, setWebRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash.includes('doctor-portal') || hash.includes('doctor')) return 'doctor-portal';
      if (hash.includes('nurse-portal') || hash.includes('nurse')) return 'nurse-portal';
      if (hash.includes('doctor-login')) return 'doctor-login';
      if (hash.includes('nurse-login')) return 'nurse-login';
      if (hash.includes('role-signin')) return 'role-signin';
      if (hash.includes('role-signup')) return 'role-signup';
    }
    return 'landing';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsDesktopMode(detectIsDesktopMode());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // When on phone or tablet in standard mobile view (Desktop site unchecked):
  // Directly render the app application UI interface
  if (!isDesktopMode) {
    return (
      <View style={styles.container}>
        <MobileAppWebWrapper>
          {children}
        </MobileAppWebWrapper>
      </View>
    );
  }

  // When in Desktop mode (Desktop site checked on phone/tab, or on desktop PC):
  // Render the Web Application UI interface
  const renderWebContent = () => {
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
      case 'nurse-login':
        return <NurseAuthPage initialMode="signin" onNavigate={setWebRoute} />;
      case 'nurse-register':
        return <NurseAuthPage initialMode="signup" onNavigate={setWebRoute} />;
      case 'doctor-portal':
        return <DoctorWebPortal onNavigateHome={() => setWebRoute('landing')} />;
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
  },
});
