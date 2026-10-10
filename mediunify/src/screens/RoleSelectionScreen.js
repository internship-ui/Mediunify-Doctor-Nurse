import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen({ navigation }) {
  const handleSelectDoctor = () => {
    navigation.navigate('Login');
  };

  const handleSelectHomeNursing = () => {
    navigation.navigate('HomeNursingLogin');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Decorative ambient background glows */}
      <View style={styles.topRightGlow} pointerEvents="none" />
      <View style={styles.midLeftGlow} pointerEvents="none" />

      <View style={styles.container}>
        {/* TOP BRAND HEADER */}
        <View style={styles.headerSection}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.taglineText}>
            All your healthcare. One intelligent platform.
          </Text>
        </View>

        {/* ROLE SELECTION CARDS */}
        <View style={styles.cardsContainer}>
          {/* DOCTOR CARD */}
          <TouchableOpacity
            style={styles.doctorCard}
            onPress={handleSelectDoctor}
            activeOpacity={0.85}
          >
            <View style={styles.doctorAvatarWrap}>
              <Image
                source={require('../assets/doctor_role.jpg')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Doctor</Text>
              <Text style={styles.cardSubtitle}>
                Consult patients, manage appointments and records.
              </Text>
            </View>

            <View style={styles.doctorArrowBtn}>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* HOME NURSING CARD */}
          <TouchableOpacity
            style={styles.nurseCard}
            onPress={handleSelectHomeNursing}
            activeOpacity={0.85}
          >
            <View style={styles.nurseAvatarWrap}>
              <Image
                source={require('../assets/nurse_role.jpg')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Home Nursing</Text>
              <Text style={styles.cardSubtitle}>
                Provide care, support and assistance at home.
              </Text>
            </View>

            <View style={styles.nurseArrowBtn}>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* BOTTOM MOTTO & WAVES */}
        <View style={styles.bottomSection}>
          {/* Heartbeat pulse graphic & motto */}
          <View style={styles.pulseRow}>
            <View style={styles.pulseLine} />
            <Ionicons name="pulse" size={24} color="#00B894" style={styles.pulseIcon} />
            <View style={styles.pulseLine} />
          </View>

          <Text style={styles.mottoText}>Better Care • Healthier Tomorrow</Text>

          {/* Layered fluid wave decorations at bottom */}
          <View style={styles.wavesContainer} pointerEvents="none">
            <View style={styles.waveLayer1} />
            <View style={styles.waveLayer2} />
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

  /* Decorative Ambient Circles */
  topRightGlow: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E8FBF8',
    opacity: 0.7,
  },
  midLeftGlow: {
    position: 'absolute',
    top: '38%',
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#EEF6FF',
    opacity: 0.6,
  },

  /* Brand Header */
  headerSection: {
    alignItems: 'center',
    paddingTop: 36,
    paddingHorizontal: 24,
  },
  logoWrap: {
    width: Math.min(width * 0.75, 300),
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  taglineText: {
    ...typography.body,
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  /* Cards Container */
  cardsContainer: {
    paddingHorizontal: 22,
    gap: 20,
    marginVertical: 'auto',
  },

  /* Doctor Card (Mint/Teal border & accent) */
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5FCFA',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#7FE3D4',
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#008F7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  doctorAvatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E0F7F4',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#008F7A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#008F7A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  /* Home Nursing Card (Soft Sky Blue border & accent) */
  nurseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F9FF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  nurseAvatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E0EEFF',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  nurseArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  /* Card Shared Content */
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#556987',
    fontWeight: '400',
  },

  /* Bottom Section */
  bottomSection: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    paddingBottom: 28,
  },
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    zIndex: 10,
  },
  pulseLine: {
    width: 48,
    height: 2,
    backgroundColor: '#00B894',
    opacity: 0.7,
    borderRadius: 1,
  },
  pulseIcon: {
    marginHorizontal: 4,
  },
  mottoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#008F7A',
    letterSpacing: 0.3,
    zIndex: 10,
    marginBottom: 20,
  },

  /* Layered waves at the bottom */
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    overflow: 'hidden',
  },
  waveLayer1: {
    position: 'absolute',
    width: width * 1.6,
    height: 140,
    borderRadius: width * 0.8,
    backgroundColor: '#E6FAF6',
    bottom: -60,
    left: -width * 0.3,
    transform: [{ rotate: '-8deg' }],
  },
  waveLayer2: {
    position: 'absolute',
    width: width * 1.5,
    height: 120,
    borderRadius: width * 0.75,
    backgroundColor: '#B2EFE6',
    bottom: -68,
    left: -width * 0.1,
    transform: [{ rotate: '6deg' }],
  },
});
