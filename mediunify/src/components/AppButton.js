import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function AppButton({
  title,
  onPress,
  variant = 'primary', // primary | accent | outline | ghost
  icon,
  loading = false,
  disabled = false,
  style,
}) {
  const variantStyle = styles[variant] || styles.primary;
  const textVariantStyle = styles[`${variant}Text`] || styles.primaryText;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.base, variantStyle, disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={18} color={textVariantStyle.color} style={{ marginRight: 8 }} /> : null}
          <Text style={[styles.text, textVariantStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { ...typography.bodyBold },
  disabled: { opacity: 0.5 },

  primary: { backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.primaryBorder || colors.primaryDark },
  primaryText: { color: colors.white },

  accent: { backgroundColor: colors.accent, borderWidth: 1.5, borderColor: colors.accentBorder || colors.accentDark },
  accentText: { color: colors.white },

  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  outlineText: { color: colors.primary },

  ghost: { backgroundColor: colors.primarySurface, borderWidth: 1.5, borderColor: colors.primaryLight },
  ghostText: { color: colors.primary },

  purple: { backgroundColor: colors.prescription, borderWidth: 1.5, borderColor: colors.prescriptionDark || '#6D28D9' },
  purpleText: { color: colors.white },

  info: { backgroundColor: colors.info, borderWidth: 1.5, borderColor: colors.infoBorder || '#1D4ED8' },
  infoText: { color: colors.white },
});

