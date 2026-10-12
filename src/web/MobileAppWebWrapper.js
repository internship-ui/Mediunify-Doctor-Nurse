import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

export default function MobileAppWebWrapper({ children }) {
  return (
    <View style={styles.mobileRoot}>
      <View style={styles.mobileViewport}>
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
  mobileViewport: {
    width: '100%',
    maxWidth: 540,
    height: '100%',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
});
