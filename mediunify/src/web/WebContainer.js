import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      case 'doctor-login':
      case 'doctor-register':
        return <DoctorAuthPage onNavigate={setWebRoute} />;
      case 'nurse-login':
      case 'nurse-register':
        return <NurseAuthPage onNavigate={setWebRoute} />;
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

      {/* Floating View Switcher (Desktop browser preview helper) */}
      {windowWidth > 768 && (
        <View style={styles.floatingSwitcher}>
          <TouchableOpacity
            style={[styles.switchBtn, webRoute === 'landing' && styles.switchBtnActive]}
            onPress={() => setWebRoute('landing')}
            activeOpacity={0.8}
            title="Landing First Page"
          >
            <Ionicons name="home" size={13} color={webRoute === 'landing' ? '#FFFFFF' : '#475569'} />
            <Text style={[styles.switchBtnText, webRoute === 'landing' && styles.switchBtnTextActive]}>
              Landing Page
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchBtn, webRoute === 'doctor-portal' && styles.switchBtnActive]}
            onPress={() => setWebRoute('doctor-portal')}
            activeOpacity={0.8}
            title="Doctor Portal"
          >
            <Ionicons name="pulse" size={13} color={webRoute === 'doctor-portal' ? '#FFFFFF' : '#475569'} />
            <Text style={[styles.switchBtnText, webRoute === 'doctor-portal' && styles.switchBtnTextActive]}>
              Doctor Portal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchBtn, webRoute === 'nurse-portal' && styles.switchBtnActive]}
            onPress={() => setWebRoute('nurse-portal')}
            activeOpacity={0.8}
            title="Nurse Portal (Image 2)"
          >
            <Ionicons name="heart" size={13} color={webRoute === 'nurse-portal' ? '#FFFFFF' : '#475569'} />
            <Text style={[styles.switchBtnText, webRoute === 'nurse-portal' && styles.switchBtnTextActive]}>
              Nurse Portal
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.switchBtn, !isDesktopMode && styles.switchBtnActivePhone]}
            onPress={() => setModeOverride(isDesktopMode ? 'mobile' : 'desktop')}
            activeOpacity={0.8}
            title="Toggle Phone App UI mode"
          >
            <Ionicons
              name={isDesktopMode ? 'phone-portrait-outline' : 'laptop-outline'}
              size={13}
              color={!isDesktopMode ? '#FFFFFF' : '#0A2342'}
            />
            <Text style={[styles.switchBtnText, !isDesktopMode && styles.switchBtnTextActive]}>
              {isDesktopMode ? 'Phone Mode' : 'Desktop Mode'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  floatingSwitcher: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 10,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    zIndex: 99999,
    gap: 4,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  switchBtnActive: {
    backgroundColor: '#0A2342',
  },
  switchBtnActivePhone: {
    backgroundColor: '#00B894',
  },
  switchBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  switchBtnTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 2,
  },
});
