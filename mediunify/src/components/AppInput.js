import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function AppInput({
  label,
  icon,
  secure = false,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  style,
  inputWrapperStyle,
  borderColor,
  onFocus,
  onBlur,
  ...rest
}) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ marginBottom: spacing.lg }, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.wrapper,
          borderColor ? { borderColor } : null,
          inputWrapperStyle,
          focused && styles.wrapperFocused,
          multiline && { minHeight: 90, alignItems: 'flex-start' },
        ]}
      >
        {icon ? <Ionicons name={icon} size={18} color={colors.textMuted} style={{ marginRight: 8, marginTop: multiline ? 4 : 0 }} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          multiline={multiline}
          onFocus={(e) => {
            setFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) onBlur(e);
          }}
          style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
          {...rest}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.smallBold, color: colors.textSecondary, marginBottom: 6 },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  wrapperFocused: { borderColor: colors.primary },
  input: { flex: 1, paddingVertical: 12, ...typography.body, color: colors.textPrimary },
});
