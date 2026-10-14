import React from 'react';
import { View, StyleSheet } from 'react-native';

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
  },
  mobileViewport: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
});

