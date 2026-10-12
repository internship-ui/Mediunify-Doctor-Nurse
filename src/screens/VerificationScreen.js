import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import AppButton from '../components/AppButton';
import { colors, spacing, typography, radius } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function VerificationScreen({ route, navigation }) {
  const { skipVerification } = useAuth();
  const name = route?.params?.name || 'Doctor';

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <View style={styles.logoWrap}>
          <Logo size={64} />
          <Text style={styles.brand}>
            <Text style={{ color: '#08317C' }}>Medi</Text>
            <Text style={{ color: colors.primary }}>Unify</Text>
          </Text>
        </View>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark-outline" size={38} color={colors.primary} />
        </View>
        <Text style={styles.title}>Account Created</Text>
        <Text style={styles.body}>
          Thanks, {name}. Your credentials have been submitted for Super Admin
          verification. This usually takes 24–48 hours — we'll notify you once
          your profile is approved.
        </Text>

        <View style={styles.statusCard}>
          <Ionicons name="time-outline" size={18} color={colors.warning} />
          <Text style={styles.statusText}>Verification pending</Text>
        </View>

        <View style={styles.skipBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.accentDark} />
          <Text style={styles.skipNote}>
            Verification isn't wired up yet — for now you can skip ahead and explore the app.
          </Text>
        </View>
      </View>

      <AppButton title="Skip for Now" variant="accent" onPress={skipVerification} style={{ marginBottom: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: spacing.xl, justifyContent: 'space-between', paddingTop: 90 },
  center: { alignItems: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: spacing.lg },
  brand: { ...typography.h2, marginTop: spacing.xs, letterSpacing: -0.5, fontWeight: '800' },
  iconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  body: { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.warningSurface,
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.pill, marginTop: spacing.xl,
  },
  statusText: { ...typography.smallBold, color: colors.warning },
  skipBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: colors.accentSurface,
    padding: spacing.md, borderRadius: radius.md, marginTop: spacing.xl,
  },
  skipNote: { flex: 1, ...typography.small, color: colors.accentDark },
});
