import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography } from '../theme/colors';

export default function TypeTag({ type }) {
  const isVideo = type === 'Video';
  const bg = isVideo ? colors.primarySurface : colors.accentSurface;
  const fg = isVideo ? colors.primary : colors.accentDark;
  const icon = isVideo ? 'videocam' : 'business';

  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={12} color={fg} />
      <Text style={[styles.text, { color: fg }]}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill, alignSelf: 'flex-start',
  },
  text: { ...typography.tiny },
});
