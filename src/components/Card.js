import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../theme/colors';

export default function Card({ children, style, borderColor, ...rest }) {
  return (
    <View style={[styles.card, borderColor && { borderColor }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.cardBorder || '#0F766E28',
    ...shadow.card,
  },
});
