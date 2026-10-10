import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function WebLogo({ size = 32, style, withBorder = false }) {
  const borderRadius = Math.round(size * 0.22);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: Math.max(6, borderRadius),
        },
        withBorder && styles.bordered,
        style,
      ]}
    >
      <Image
        source={require('../../../assets/logo.png')}
        style={[styles.image, { borderRadius: Math.max(4, borderRadius - 2) }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1.5,
    borderColor: '#00B894',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
