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

/**
 * Robust detection of whether the current browser session is in Desktop Web mode
 * or Mobile/Tablet App interface mode.
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

  // 1. Google Chrome / Chromium Client Hints API
  // In Chrome on phones and tablets, toggling "Desktop site" sets
  // navigator.userAgentData.mobile to false and forces layout viewport to 980px+.
  // When "Desktop site" is UNCHECKED, navigator.userAgentData.mobile is true.
  if (
    typeof navigator !== 'undefined' &&
    navigator.userAgentData &&
    typeof navigator.userAgentData.mobile === 'boolean'
  ) {
    if (navigator.userAgentData.mobile) {
      return false; // Normal phone / tab app mode
    }
    return window.innerWidth >= 900; // Desktop site enabled or PC
  }

  // 2. Fallback for iOS Safari / other engines
  const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  const isMobileUA = /Mobile|iPhone|iPod/i.test(ua);
  const isTabletUA = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua);

  // Normal mobile phone without desktop site has innerWidth < 600 (typically 360-430px)
  if (isMobileUA && window.innerWidth < 900) {
    return false;
  }

  // Normal tablet in portrait without desktop site has innerWidth < 900 (typically 768-834px)
  if (isTabletUA && window.innerWidth < 900) {
    return false;
  }

  // Viewport threshold:
  // Mobile phone and tablet standard viewports are < 900px.
  // When "Desktop site" is enabled on phone/tab, layout viewport is forced to 980px or higher.
  return window.innerWidth >= 900;
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
  // 'landing' | 'doctor-login' | 'doctor-register' | 'doctor-portal' | 'nurse-login' | 'nurse-register' | 'nurse-portal'
  const [webRoute, setWebRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash.includes('doctor-portal') || hash.includes('doctor')) return 'doctor-portal';
      if (hash.includes('nurse-portal') || hash.includes('nurse')) return 'nurse-portal';
      if (hash.includes('doctor-login')) return 'doctor-login';
      if (hash.includes('nurse-login')) return 'nurse-login';
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

  // When on phone or tablet in standard mobile view (desktop site unchecked):
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
      case 'doctor-login':
      case 'doctor-register':
        return <DoctorAuthPage onNavigate={setWebRoute} />;
      case 'nurse-login':
      case 'nurse-register':
        return <NurseAuthPage onNavigate={setWebRoute} />;
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
