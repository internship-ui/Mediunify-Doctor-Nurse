import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { colors, radius, typography } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/* TOP / CENTER: LOGO & BRAND IDENTITY */}
        <View style={styles.centerContent}>
          {/* Logo Mark & Name */}
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Two-Line Tagline as shown in design */}
          <Text style={styles.taglineText}>
            All your healthcare.{'\n'}One intelligent platform.
          </Text>
        </View>

        {/* BOTTOM: TEAL WAVES & GET STARTED BUTTON */}
        <View style={styles.bottomArea}>
          {/* Layered Organic Waves */}
          <View style={styles.wavesContainer} pointerEvents="none">
            {/* Wave Layer 1: Soft Translucent Mint (Top Layer) */}
            <View style={styles.waveLayer1} />

            {/* Wave Layer 2: Mid-Tone Cyan / Mint (Middle Layer) */}
            <View style={styles.waveLayer2} />

            {/* Wave Layer 3: Vibrant MediUnify Teal (Bottom Layer) */}
            <View style={styles.waveLayer3} />
          </View>

          {/* Get Started Pill Button */}
          <View style={styles.btnWrap}>
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={handleGetStarted}
              activeOpacity={0.88}
            >
              <Text style={styles.getStartedBtnText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoWrap: {
    width: Math.min(width * 0.82, 340),
    height: Math.min(width * 0.55, 230),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  taglineText: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 0.2,
  },

  /* BOTTOM AREA & WAVES */
  bottomArea: {
    width: '100%',
    height: 290,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  wavesContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },

  /* Wave Layer 1: Soft Translucent Mint */
  waveLayer1: {
    position: 'absolute',
    width: width * 1.8,
    height: 320,
    borderRadius: width * 0.9,
    backgroundColor: '#E0F7F4',
    top: 30,
    left: -width * 0.35,
    transform: [{ rotate: '-12deg' }],
  },

  /* Wave Layer 2: Mid-Tone Mint / Aqua */
  waveLayer2: {
    position: 'absolute',
    width: width * 1.7,
    height: 290,
    borderRadius: width * 0.85,
    backgroundColor: '#7FE3D4',
    top: 70,
    left: -width * 0.15,
    transform: [{ rotate: '8deg' }],
  },

  /* Wave Layer 3: Vibrant Brand Teal */
  waveLayer3: {
    position: 'absolute',
    width: width * 1.6,
    height: 260,
    borderRadius: width * 0.8,
    backgroundColor: colors.primary || '#00B894',
    top: 115,
    left: -width * 0.3,
    transform: [{ rotate: '-6deg' }],
  },

  /* GET STARTED BUTTON */
  btnWrap: {
    paddingHorizontal: 40,
    paddingBottom: 42,
    zIndex: 10,
  },
  getStartedBtn: {
    backgroundColor: '#008775',
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004D40',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  getStartedBtnText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
