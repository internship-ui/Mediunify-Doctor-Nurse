import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

export default function MobileAppWebWrapper({ children }) {
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 540;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setIsTablet(window.innerWidth > 540);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return (
    <View style={[styles.mobileRoot, isTablet && styles.tabletBackdrop]}>
      <View style={[styles.mobileViewport, isTablet && styles.tabletContainer]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletBackdrop: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
  },
  mobileViewport: {
    width: '100%',
    maxWidth: 540,
    height: '100%',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  tabletContainer: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
    elevation: 12,
    maxHeight: 960,
  },
});
