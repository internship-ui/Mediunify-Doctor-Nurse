import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';

export default function WebLandingPage({
  onNavigate,
}) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Top Website Header Navbar */}
      <View style={styles.navbar}>
        <View style={styles.brandRow}>
          <WebLogo size={36} withBorder />
          <Text style={styles.brandText}>Medi<Text style={styles.brandAccent}>Unify</Text></Text>
        </View>

        <View style={styles.navActionsRow}>
          <TouchableOpacity
            style={styles.navLinkBtn}
            onPress={() => onNavigate('doctor-portal')}
            activeOpacity={0.8}
          >
            <Ionicons name="pulse" size={15} color="#00B894" />
            <Text style={styles.navLinkText}>Doctor Portal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navLinkBtn}
            onPress={() => onNavigate('nurse-portal')}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={15} color="#38BDF8" />
            <Text style={styles.navLinkText}>Nurse Portal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navSignInBtn}
            onPress={() => onNavigate('doctor-login')}
            activeOpacity={0.8}
          >
            <Text style={styles.navSignInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Hero Container (Deep Navy Background) */}
      <View style={styles.heroSection}>
        <View style={styles.heroContentWrapper}>
          {/* Headline & Value Proposition */}
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>
              One platform for doctors and home nursing care
            </Text>

            <Text style={styles.heroSubtitle}>
              Manage appointments, follow-ups and home nursing services in one place, with real-time availability and simple status tracking.
            </Text>
          </View>
        </View>

        {/* Two Main Role Action Cards */}
        <View style={styles.roleCardsContainer}>
          {/* Card 1: Doctor Portal */}
          <View style={styles.roleCard}>
            <View style={styles.roleCardTop}>
              <View style={styles.roleIconBoxNavy}>
                <Ionicons name="pulse" size={24} color="#00B894" />
              </View>
              <View style={styles.roleTitleGroup}>
                <Text style={styles.roleTitle}>I'm a Doctor</Text>
                <Text style={styles.roleSub}>Clinic and video consultations</Text>
              </View>
            </View>

            {/* Checklist */}
            <View style={styles.checklist}>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={17} color="#00B894" />
                <Text style={styles.checkText}>Appointments from patients</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={17} color="#00B894" />
                <Text style={styles.checkText}>Patient follow-ups</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={17} color="#00B894" />
                <Text style={styles.checkText}>Direct patient booking</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={17} color="#00B894" />
                <Text style={styles.checkText}>Availability and fees</Text>
              </View>
            </View>

            {/* Go for MediUnify Button at bottom */}
            <TouchableOpacity
              style={styles.goMediUnifyBtn}
              onPress={() => onNavigate('doctor-login')}
              activeOpacity={0.88}
            >
              <Text style={styles.goMediUnifyBtnText}>Go for MediUnify</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Card 2: Nurse Portal */}
          <View style={styles.roleCard}>
            <View style={styles.roleCardTop}>
              <View style={styles.roleIconBoxTeal}>
                <Ionicons name="heart" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.roleTitleGroup}>
                <Text style={styles.roleTitle}>I'm a Nurse</Text>
                <Text style={styles.roleSub}>Home nursing services</Text>
              </View>
            </View>

            {/* Checklist */}
            <View style={styles.checklist}>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={17} color="#00B894" />
                <Text style={styles.checkText}>Assigned patient services</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={17} color="#00B894" />
                <Text style={styles.checkText}>Live availability status</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={17} color="#00B894" />
                <Text style={styles.checkText}>On the way and service tracking</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={17} color="#00B894" />
                <Text style={styles.checkText}>Service history and records</Text>
              </View>
            </View>

            {/* Go for MediUnify Button at bottom */}
            <TouchableOpacity
              style={styles.goMediUnifyBtnTeal}
              onPress={() => onNavigate('nurse-login')}
              activeOpacity={0.88}
            >
              <Text style={styles.goMediUnifyBtnText}>Go for MediUnify</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.nurseFootnoteRow}>
              <Ionicons name="information-circle-outline" size={13} color="#64748B" />
              <Text style={styles.nurseFootnoteText}>
                New nurse accounts are verified by admin before login.
              </Text>
            </View>
          </View>
        </View>

        {/* SECTION 1: How it works */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeaderTitle}>How it works</Text>
          <Text style={styles.sectionHeaderSub}>From sign up to care in three simple steps</Text>

          <View style={styles.stepCardsList}>
            {/* Step 01 */}
            <View style={styles.stepCard}>
              <View style={styles.stepIconBox}>
                <Ionicons name="person" size={20} color="#00B894" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Register and get verified</Text>
                <Text style={styles.stepDesc}>
                  Create your account and upload your certificates. Admin reviews them before you start.
                </Text>
              </View>
              <Text style={styles.stepNumber}>01</Text>
            </View>

            {/* Step 02 */}
            <View style={styles.stepCard}>
              <View style={styles.stepIconBox}>
                <Ionicons name="calendar" size={20} color="#00B894" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Set your availability</Text>
                <Text style={styles.stepDesc}>
                  Choose working hours, breaks, holidays and emergency slots. Your status updates live.
                </Text>
              </View>
              <Text style={styles.stepNumber}>02</Text>
            </View>

            {/* Step 03 */}
            <View style={styles.stepCard}>
              <View style={styles.stepIconBox}>
                <Ionicons name="heart" size={20} color="#00B894" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Start caring</Text>
                <Text style={styles.stepDesc}>
                  Receive appointments or assigned home services, and track every step to completion.
                </Text>
              </View>
              <Text style={styles.stepNumber}>03</Text>
            </View>
          </View>
        </View>

        {/* SECTION 2: Everything in one platform */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeaderTitle}>Everything in one platform</Text>
          <Text style={styles.sectionHeaderSub}>Built for clinics, video visits and care at home</Text>

          <View style={styles.featuresGrid}>
            {/* Feature 1 */}
            <View style={styles.featureCard}>
              <Ionicons name="calendar-outline" size={22} color="#00B894" />
              <Text style={styles.featureTitle}>Smart scheduling</Text>
              <Text style={styles.featureDesc}>Slots, breaks and holidays managed automatically.</Text>
            </View>

            {/* Feature 2 */}
            <View style={styles.featureCard}>
              <Ionicons name="videocam-outline" size={22} color="#00B894" />
              <Text style={styles.featureTitle}>Video consults</Text>
              <Text style={styles.featureDesc}>Notes, prescriptions and tests during the call.</Text>
            </View>

            {/* Feature 3 */}
            <View style={styles.featureCard}>
              <Ionicons name="location-outline" size={22} color="#00B894" />
              <Text style={styles.featureTitle}>Live tracking</Text>
              <Text style={styles.featureDesc}>On the way status with live location for nurses.</Text>
            </View>

            {/* Feature 4 */}
            <View style={styles.featureCard}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#00B894" />
              <Text style={styles.featureTitle}>Verified records</Text>
              <Text style={styles.featureDesc}>Certificates reviewed and patient data protected.</Text>
            </View>
          </View>
        </View>

        {/* SECTION 3: Ready to get started? CTA Banner */}
        <View style={styles.ctaBannerContainer}>
          <View style={styles.ctaBanner}>
            <View style={styles.ctaTextCol}>
              <Text style={styles.ctaTitle}>Ready to get started?</Text>
              <Text style={styles.ctaSubtitle}>Join MediUnify as a doctor or a home nursing professional.</Text>
            </View>

            <View style={styles.ctaButtonsRow}>
              <TouchableOpacity
                style={styles.ctaBtnNavy}
                onPress={() => onNavigate('doctor-login')}
                activeOpacity={0.88}
              >
                <Text style={styles.ctaBtnNavyText}>Join as doctor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ctaBtnWhite}
                onPress={() => onNavigate('nurse-login')}
                activeOpacity={0.88}
              >
                <Text style={styles.ctaBtnWhiteText}>Join as nurse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SECTION 4: Footer */}
        <View style={styles.footerSection}>
          <View style={styles.footerAccentBar} />
          <Text style={styles.footerTagline}>Better Care • Healthier Tomorrow</Text>
          <View style={styles.footerLinksRow}>
            <Text style={styles.footerCopyText}>© 2026 MediUnify</Text>
            <TouchableOpacity onPress={() => alert('Privacy Policy: All health records encrypted and HIPAA/DISHA compliant.')}>
              <Text style={styles.footerLinkText}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Terms of Service: Authorized for licensed healthcare providers.')}>
              <Text style={styles.footerLinkText}>Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Support: 24/7 assistance at support@mediunify.com')}>
              <Text style={styles.footerLinkText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#081E3E',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    paddingVertical: 18,
    backgroundColor: '#081E3E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap',
    gap: 12,
  },
  navActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  navLinkText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  navSignInBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#00B894',
  },
  navSignInText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#00B894',
  },
  heroSection: {
    backgroundColor: '#081E3E',
    paddingHorizontal: 36,
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
  },
  heroContentWrapper: {
    maxWidth: 860,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 44,
  },
  heroTextCol: {
    alignItems: 'center',
    gap: 16,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 48,
    letterSpacing: -0.8,
    textAlign: 'center',
    maxWidth: 720,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 25,
    maxWidth: 640,
    textAlign: 'center',
  },
  roleCardsContainer: {
    flexDirection: 'row',
    gap: 28,
    maxWidth: 960,
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  roleCard: {
    flex: 1,
    minWidth: 320,
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    gap: 20,
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
    justifyContent: 'space-between',
  },
  roleCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  roleIconBoxNavy: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#081E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconBoxTeal: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitleGroup: {
    gap: 3,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A2342',
  },
  roleSub: {
    fontSize: 13,
    color: '#64748B',
  },
  checklist: {
    gap: 11,
    paddingVertical: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkText: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '500',
  },
  goMediUnifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#081E3E',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  goMediUnifyBtnTeal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  goMediUnifyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  nurseFootnoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
  },
  nurseFootnoteText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },

  /* SECTION 1 & 2 Styles */
  sectionWrapper: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  sectionHeaderSub: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 28,
    textAlign: 'center',
  },
  stepCardsList: {
    width: '100%',
    gap: 14,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D274D',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 16,
  },
  stepIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 184, 148, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  stepNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.15)',
    letterSpacing: 0.5,
  },

  /* Feature Grid Styles */
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  featureCard: {
    width: '48%',
    minWidth: 260,
    backgroundColor: '#0D274D',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },

  /* CTA Banner Styles */
  ctaBannerContainer: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    marginTop: 48,
    paddingHorizontal: 20,
  },
  ctaBanner: {
    backgroundColor: '#00B894',
    borderRadius: 20,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    flexWrap: 'wrap',
  },
  ctaTextCol: {
    flex: 1,
    minWidth: 260,
    gap: 4,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  ctaButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaBtnNavy: {
    backgroundColor: '#081E3E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaBtnNavyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  ctaBtnWhite: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaBtnWhiteText: {
    color: '#081E3E',
    fontWeight: '700',
    fontSize: 13,
  },

  /* Footer Styles */
  footerSection: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 24,
    gap: 12,
  },
  footerAccentBar: {
    width: 44,
    height: 3,
    backgroundColor: '#00B894',
    borderRadius: 2,
  },
  footerTagline: {
    color: '#00B894',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footerLinksRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerCopyText: {
    fontSize: 12,
    color: '#64748B',
  },
  footerLinkText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
