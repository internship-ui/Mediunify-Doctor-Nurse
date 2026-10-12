import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Logo({ size = 96, style, withBorder = true }) {
  const borderRadius = Math.round(size * 0.22);
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius,
        },
        withBorder && styles.bordered,
        style,
      ]}
    >
      <Image
        source={require('../assets/logo.png')}
        style={[styles.img, { borderRadius: Math.max(0, borderRadius - 2) }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  bordered: {
    borderWidth: 1.5,
    borderColor: colors.logoBorder || colors.primary,
    backgroundColor: colors.white,
    padding: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  img: { width: '100%', height: '100%' },
});
