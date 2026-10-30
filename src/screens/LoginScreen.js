import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../components/AppInput';
import { colors, radius, typography } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { doctor } from '../data/mockData';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation, route }) {
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('dr.ananya@mediunify.com');
  const [password, setPassword] = useState('Doctor@2026');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const justRegistered = route?.params?.justRegistered;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const demoEmail = (emailOrPhone && emailOrPhone.trim()) || 'dr.ananya@mediunify.com';
      const demoPass = (password && password.trim()) || 'Doctor@2026';

      if (doctor) {
        doctor.email = demoEmail;
      }

      await login({ email: demoEmail, password: demoPass });

      // Direct to Doctor Home Page (MainTabs / DashboardScreen)
      try {
        navigation.navigate('MainTabs');
      } catch (err) {
        try {
          navigation.navigate('DashboardScreen');
        } catch (e2) {}
      }
    } catch (e) {
      // Fallback bypass for demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* TOP BAR / BACK BUTTON */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  try {
                    navigation.navigate('RoleSelectionScreen');
                  } catch (e) {
                    try {
                      navigation.navigate('RoleSelection');
                    } catch (err) {}
                  }
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#08317C" style={{ top: 35 }} />
            </TouchableOpacity>
          </View>

          {/* BRAND LOGO & TITLE */}
          <View style={styles.headerSection}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Doctor Sign In</Text>
            <Text style={styles.subtitle}>Welcome back! Please sign in to continue.</Text>
          </View>

          {/* JUST REGISTERED BANNER */}
          {justRegistered ? (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.successText}>Account created. Please log in to continue.</Text>
            </View>
          ) : null}

          {/* FORM FIELDS */}
          <View style={styles.formContainer}>
            <AppInput
              icon="mail-outline"
              placeholder="Email or Phone Number"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 14 }}
              inputWrapperStyle={styles.inputWrapper}
            />

            <AppInput
              icon="lock-closed-outline"
              placeholder="Password"
              secure
              value={password}
              onChangeText={setPassword}
              style={{ marginBottom: 14 }}
              inputWrapperStyle={styles.inputWrapper}
            />

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberWrap}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={rememberMe ? 'checkbox' : 'square-outline'}
                  size={19}
                  color={rememberMe ? colors.primary : '#94A3B8'}
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('Forgot Password', 'Password recovery instructions have been sent.')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* SIGN IN BUTTON */}
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={handleLogin}
              activeOpacity={0.88}
              disabled={loading}
            >
              <Text style={styles.signInBtnText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* OR DIVIDER */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* CREATE ACCOUNT LINK */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Registration')}
                activeOpacity={0.7}
              >
                <Text style={styles.footerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTTOM FLUID WAVES */}
          <View style={styles.bottomArea} pointerEvents="none">
            <View style={styles.waveLayer1} />
            <View style={styles.waveLayer2} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  /* Top Bar */
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Brand Header */
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  logoWrap: {
    width: Math.min(width * 0.7, 260),
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.small,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },

  /* Profile Claim Section */
  claimSectionCard: {
    width: '100%',
    backgroundColor: '#F0FDF9',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#A7F3D0',
    padding: 14,
    marginTop: 18,
    marginBottom: 6,
  },
  claimHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 6,
  },
  claimHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: -0.2,
  },
  claimDescriptionText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    marginBottom: 12,
  },
  claimButtonTeal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#00B894',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  claimButtonText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  thinTealLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#00B894',
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 1,
  },

  /* Success banner */
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSurface,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  successText: {
    ...typography.small,
    color: colors.success,
    marginLeft: 8,
  },

  /* Form Container */
  formContainer: {
    paddingHorizontal: 24,
    width: '100%',
  },
  inputWrapper: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
  },

  /* Options Row */
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 2,
  },
  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rememberText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 13,
    color: '#00B894',
    fontWeight: '600',
  },

  /* Sign In Button */
  signInBtn: {
    backgroundColor: '#00B894',
    height: 50,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signInBtnText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* OR Divider */
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* Footer Row */
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 13,
    color: '#00B894',
    fontWeight: '700',
  },

  /* Bottom Waves */
  bottomArea: {
    height: 90,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 16,
  },
  waveLayer1: {
    position: 'absolute',
    width: width * 1.6,
    height: 120,
    borderRadius: width * 0.8,
    backgroundColor: '#E6FAF6',
    bottom: -60,
    left: -width * 0.3,
    transform: [{ rotate: '-8deg' }],
  },
  waveLayer2: {
    position: 'absolute',
    width: width * 1.5,
    height: 110,
    borderRadius: width * 0.75,
    backgroundColor: '#B2EFE6',
    bottom: -65,
    left: -width * 0.1,
    transform: [{ rotate: '6deg' }],
  },
});
