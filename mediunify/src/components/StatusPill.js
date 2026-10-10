import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme/colors';

const MAP = {
  confirmed: { bg: colors.successSurface, fg: colors.success },
  pending: { bg: colors.warningSurface, fg: colors.warning },
  completed: { bg: colors.primarySurface, fg: colors.primary },
  cancelled: { bg: colors.dangerSurface, fg: colors.danger },
  'no-show': { bg: colors.dangerSurface, fg: colors.danger },
  upcoming: { bg: colors.infoSurface, fg: colors.info },
  rescheduled: { bg: '#FEF3C7', fg: '#B45309' },
  paid: { bg: colors.successSurface, fg: colors.success },
  unpaid: { bg: colors.warningSurface, fg: colors.warning },
  ordered: { bg: colors.infoSurface, fg: colors.info },
  ready: { bg: colors.successSurface, fg: colors.success },
  today: { bg: colors.successSurface, fg: colors.success },
  overdue: { bg: colors.dangerSurface, fg: colors.danger },
};

export default function StatusPill({ status }) {
  const key = (status || '').toLowerCase();
  const style = MAP[key] || { bg: colors.border, fg: colors.textSecondary };
  return (
    <View style={[styles.pill, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.fg }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.pill, alignSelf: 'flex-start' },
  text: { ...typography.tiny, textTransform: 'capitalize' },
});
