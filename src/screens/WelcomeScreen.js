import React from 'react';
import { View, StyleSheet } from 'react-native';
import Logo from '../components/Logo';
import AppButton from '../components/AppButton';
import { colors, spacing } from '../theme/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Logo size={160} />
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Sign In"
          variant="primary"
          onPress={() => navigation.navigate('Login')}
        />
        <AppButton
          title="Create an Account"
          variant="outline"
          onPress={() => navigation.navigate('Registration')}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    paddingBottom: spacing.xl,
  },
});
