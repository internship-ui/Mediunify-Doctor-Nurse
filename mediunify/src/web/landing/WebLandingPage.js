import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';

// 4 Slides for the Bootstrap 4 Carousel (1000 x 400 aspect ratio)
const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'HD Video Consultations with Certified Doctors',
    subtitle: 'Connect securely with patients from anywhere. Examine symptoms, record clinical notes, and issue digital e-prescriptions in real-time.',
    badge: 'ONLINE TELEMEDICINE',
    accentColor: '#00B894',
    bgGradient: 'linear-gradient(135deg, #0A1E3F 0%, #0F3460 50%, #16213E 100%)',
    icon: 'videocam',
    tag: 'Encrypted & HIPAA Compliant',
  },
  {
    id: 2,
    title: 'In-Person Clinic Workstations & Queue Control',
    subtitle: 'Manage patient check-ins, examine comprehensive clinical dossiers, verify medical records, and conduct physical consultations efficiently.',
    badge: 'CLINICAL WORKSTATION',
    accentColor: '#3B82F6',
    bgGradient: 'linear-gradient(135deg, #071E3D 0%, #1F4068 50%, #162447 100%)',
    icon: 'business',
    tag: 'Room 102 Live Queue',
  },
  {
    id: 3,
    title: 'Professional Home Nursing & Post-Op Care',
    subtitle: 'Certified nursing care at the patient doorstep. Track vitals, administer scheduled medication, change wound dressings, and log daily shifts.',
    badge: 'HOME NURSING SERVICES',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #06283D 0%, #1363DF 50%, #06283D 100%)',
    icon: 'heart',
    tag: 'GPS Shift Tracking',
  },
  {
    id: 4,
    title: 'Unified Health Records & Diagnostic Testing',
    subtitle: 'Complete clinical history, electronic prescriptions, lab diagnostic orders, and ongoing patient follow-ups unified in one centralized portal.',
    badge: 'UNIFIED HEALTHCARE HUB',
    accentColor: '#8B5CF6',
    bgGradient: 'linear-gradient(135deg, #0B192C 0%, #1E3E62 50%, #000000 100%)',
    icon: 'document-text',
    tag: 'Instant Digital Records',
  },
];

export default function WebLandingPage({ onNavigate }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  // Auto-advance Carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  // Smooth scrolling to sections on Web
  const scrollToSection = (sectionId) => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ============================================================== */}
      {/* 1. HEADER: Navy Blue background, fit to zoom of 100%           */}
      {/* ============================================================== */}
      <View style={styles.header}>
        {/* Left Side: Logo, Brand Text, and Nav Links (Feature, About) */}
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity
            style={styles.brandRow}
            onPress={() => scrollToSection('home-top')}
            activeOpacity={0.8}
          >
            <WebLogo size={36} withBorder />
            <Text style={styles.brandText}>
              Medi<Text style={styles.brandAccent}>unify</Text>
            </Text>
          </TouchableOpacity>

          {/* Navigation Links in front of logo/brand */}
          <View style={styles.navLinksRow}>
            <TouchableOpacity
              style={styles.navLinkBtn}
              onPress={() => scrollToSection('how-it-works')}
              activeOpacity={0.7}
            >
              <Text style={styles.navLinkText}>Feature</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navLinkBtn}
              onPress={() => scrollToSection('about-platform')}
              activeOpacity={0.7}
            >
              <Text style={styles.navLinkText}>About</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: Sign In & Sign Up buttons with Teal Green background */}
        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            style={styles.tealHeaderBtn}
            onPress={() => onNavigate('role-signin')}
            activeOpacity={0.85}
          >
            <Ionicons name="log-in-outline" size={16} color="#FFFFFF" />
            <Text style={styles.tealBtnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tealHeaderBtn}
            onPress={() => onNavigate('role-signup')}
            activeOpacity={0.85}
          >
            <Ionicons name="person-add-outline" size={16} color="#FFFFFF" />
            <Text style={styles.tealBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Little White Gap below header as requested */}
      <View style={styles.whiteGap} />

      {/* ============================================================== */}
      {/* 2. BOOTSTRAP 4 CAROUSEL: FULL WIDTH TILL END OF SCREEN         */}
      {/* ============================================================== */}
      <View id="home-top" style={styles.carouselOuterWrapper}>
        <View style={styles.carouselContainer}>
          {/* Main Slide Card: Full Width edge-to-edge */}
          <View
            style={[
              styles.carouselSlide,
              Platform.OS === 'web' && {
                background: CAROUSEL_SLIDES[activeSlide].bgGradient,
              },
            ]}
          >
            {/* Centered inner content container for high-res screens */}
            <View style={styles.slideInnerContentContainer}>
              {/* Left Content Area */}
              <View style={styles.slideContentCol}>
                <View style={styles.slideBadgeRow}>
                  <View
                    style={[
                      styles.slideBadge,
                      { backgroundColor: CAROUSEL_SLIDES[activeSlide].accentColor },
                    ]}
                  >
                    <Text style={styles.slideBadgeText}>
                      {CAROUSEL_SLIDES[activeSlide].badge}
                    </Text>
                  </View>

                  <View style={styles.slideTagPill}>
                    <Ionicons name="shield-checkmark" size={12} color="#00B894" />
                    <Text style={styles.slideTagText}>
                      {CAROUSEL_SLIDES[activeSlide].tag}
                    </Text>
                  </View>
                </View>

                <Text style={styles.slideTitle}>
                  {CAROUSEL_SLIDES[activeSlide].title}
                </Text>

                <Text style={styles.slideSubtitle}>
                  {CAROUSEL_SLIDES[activeSlide].subtitle}
                </Text>

                {/* Action Buttons inside Carousel */}
                <View style={styles.slideActionsRow}>
                  <TouchableOpacity
                    style={styles.slidePrimaryBtn}
                    onPress={() => onNavigate('role-signup')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.slidePrimaryBtnText}>Register Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.slideSecondaryBtn}
                    onPress={() => scrollToSection('about-platform')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.slideSecondaryBtnText}>Learn More</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Right Graphic Illustration */}
              <View style={styles.slideGraphicCol}>
                <View
                  style={[
                    styles.graphicCircleGlow,
                    { borderColor: CAROUSEL_SLIDES[activeSlide].accentColor },
                  ]}
                >
                  <Ionicons
                    name={CAROUSEL_SLIDES[activeSlide].icon}
                    size={72}
                    color={CAROUSEL_SLIDES[activeSlide].accentColor}
                  />
                </View>
              </View>
            </View>

            {/* Navigation Arrows: Prev < and Next > */}
            <TouchableOpacity
              style={[styles.carouselNavBtn, styles.carouselPrevBtn]}
              onPress={handlePrevSlide}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.carouselNavBtn, styles.carouselNextBtn]}
              onPress={handleNextSlide}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Bottom Dots Indicator */}
            <View style={styles.carouselIndicatorsRow}>
              {CAROUSEL_SLIDES.map((slide, idx) => (
                <TouchableOpacity
                  key={slide.id}
                  style={[
                    styles.indicatorDot,
                    activeSlide === idx && styles.indicatorDotActive,
                  ]}
                  onPress={() => setActiveSlide(idx)}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 3. FEATURE SECTION: HOW IT WORKS                               */}
      {/* ============================================================== */}
      <View id="how-it-works" style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTagBadge}>
            <Text style={styles.sectionTagText}>PLATFORM FEATURES</Text>
          </View>
          <Text style={styles.sectionMainTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>
            From healthcare provider onboarding to continuous patient care in four seamless steps
          </Text>
        </View>

        <View style={styles.stepsGrid}>
          {/* Step 1 */}
          <View style={styles.stepBox}>
            <View style={styles.stepNumPill}>
              <Text style={styles.stepNumText}>01</Text>
            </View>
            <View style={styles.stepIconWrap}>
              <Ionicons name="shield-checkmark" size={24} color="#00B894" />
            </View>
            <Text style={styles.stepCardTitle}>Register & Verify</Text>
            <Text style={styles.stepCardDesc}>
              Doctors and nurses register their profile, upload medical council certifications, and get verified for clinical practice.
            </Text>
          </View>

          {/* Step 2 */}
          <View style={styles.stepBox}>
            <View style={styles.stepNumPill}>
              <Text style={styles.stepNumText}>02</Text>
            </View>
            <View style={styles.stepIconWrap}>
              <Ionicons name="calendar" size={24} color="#00B894" />
            </View>
            <Text style={styles.stepCardTitle}>Manage Schedules</Text>
            <Text style={styles.stepCardDesc}>
              Set real-time clinic hours, configure video consultation slots, manage breaks, and accept patient appointments directly.
            </Text>
          </View>

          {/* Step 3 */}
          <View style={styles.stepBox}>
            <View style={styles.stepNumPill}>
              <Text style={styles.stepNumText}>03</Text>
            </View>
            <View style={styles.stepIconWrap}>
              <Ionicons name="medkit" size={24} color="#00B894" />
            </View>
            <Text style={styles.stepCardTitle}>Consult & Prescribe</Text>
            <Text style={styles.stepCardDesc}>
              Conduct in-person visits or HD video consultations, record symptoms, write clinical notes, and generate e-prescriptions.
            </Text>
          </View>

          {/* Step 4 */}
          <View style={styles.stepBox}>
            <View style={styles.stepNumPill}>
              <Text style={styles.stepNumText}>04</Text>
            </View>
            <View style={styles.stepIconWrap}>
              <Ionicons name="heart-circle" size={24} color="#00B894" />
            </View>
            <Text style={styles.stepCardTitle}>Care & Follow-up</Text>
            <Text style={styles.stepCardDesc}>
              Dispatch home nurses for post-op care, monitor vitals, review diagnostic lab reports, and manage follow-up schedules.
            </Text>
          </View>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 4. ABOUT SECTION: THE MEDIUNIFY PLATFORM                       */}
      {/* ============================================================== */}
      <View id="about-platform" style={styles.aboutSectionContainer}>
        <View style={styles.aboutContentWrapper}>
          <View style={styles.aboutTagBadge}>
            <Ionicons name="information-circle" size={14} color="#00B894" />
            <Text style={styles.aboutTagText} fontSize="25px" >ABOUT MEDIUNIFY</Text>
          </View>

          <Text style={styles.aboutHeading}>
            All-In-One Unified Healthcare Ecosystem
          </Text>

          {/* Exact required statement from user prompt */}
          <View style={styles.aboutHighlightCard}>
            <Ionicons size={32} color="#00B894" style={{ marginBottom: 12 }} />
            <Text style={styles.aboutPromptQuoteText}>
              Mediunify is an all-in-one healthcare platform that connects doctors with patients for both online and in-person consultations. Doctors can register on the platform to provide healthcare services, conduct video consultations, manage appointments, and deliver in-person treatment to patients.
            </Text>
          </View>

          {/* Supporting Pillars */}
          <View style={styles.aboutPillarsRow}>
            <View style={styles.pillarItem}>
              <Ionicons name="videocam" size={22} color="#00B894" />
              <Text style={styles.pillarTitle}>Online Video Telehealth</Text>
              <Text style={styles.pillarDesc}>
                Encrypted high-definition audio & video consultations with patient dossier integration.
              </Text>
            </View>

            <View style={styles.pillarItem}>
              <Ionicons name="business" size={22} color="#00B894" />
              <Text style={styles.pillarTitle}>In-Person Clinic Workstations</Text>
              <Text style={styles.pillarDesc}>
                Comprehensive clinical appointment management, queue check-ins, and structured diagnosis.
              </Text>
            </View>

            <View style={styles.pillarItem}>
              <Ionicons name="heart" size={22} color="#00B894" />
              <Text style={styles.pillarTitle}>Certified Home Nursing</Text>
              <Text style={styles.pillarDesc}>
                Skilled home care nurses for medication administration, vitals tracking, and daily care.
              </Text>
            </View>
          </View>

          {/* Call to Action Bar */}
          <View style={styles.aboutCtaBar}>
            <Text style={styles.aboutCtaText}>
              Ready to start consulting and treating patients on MediUnify?
            </Text>
            <TouchableOpacity
              style={styles.aboutCtaButton}
              onPress={() => onNavigate('role-signup')}
              activeOpacity={0.88}
            >
              <Text style={styles.aboutCtaButtonText}>Register as Doctor / Nurse</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 5. FOOTER: 4 COLUMNS, NAVY BLUE BACKGROUND                    */}
      {/* ============================================================== */}
      <View style={styles.footer}>
        <View style={styles.footerColumnsContainer}>
          {/* Column 1: Our Services */}
          <View style={styles.footerCol}>
            <Text style={styles.footerColHeading}>Our Services</Text>
            <Text style={styles.footerLinkItem}>Doctor Video Consultation</Text>
            <Text style={styles.footerLinkItem}>In-Person Clinic Visits</Text>
            <Text style={styles.footerLinkItem}>Home Nursing Care</Text>
            <Text style={styles.footerLinkItem}>Digital E-Prescriptions</Text>
            <Text style={styles.footerLinkItem}>Diagnostic Lab Orders</Text>
            <Text style={styles.footerLinkItem}>Follow-up Management</Text>
          </View>

          {/* Column 2: Quick Links */}
          <View style={styles.footerCol}>
            <Text style={styles.footerColHeading}>Quick Links</Text>
            <TouchableOpacity onPress={() => scrollToSection('home-top')}>
              <Text style={styles.footerLinkClickable}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => scrollToSection('how-it-works')}>
              <Text style={styles.footerLinkClickable}>Features (How It Works)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => scrollToSection('about-platform')}>
              <Text style={styles.footerLinkClickable}>About MediUnify</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('role-signin')}>
              <Text style={styles.footerLinkClickable}>Doctor / Nurse Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('role-signup')}>
              <Text style={styles.footerLinkClickable}>Register Provider Account</Text>
            </TouchableOpacity>
          </View>

          {/* Column 3: Contact */}
          <View style={styles.footerCol}>
            <Text style={styles.footerColHeading}>Contact</Text>
            <View style={styles.contactItemRow}>
              <Ionicons name="mail-outline" size={14} color="#00B894" />
              <Text style={styles.contactItemText}>support@mediunify.com</Text>
            </View>
            <View style={styles.contactItemRow}>
              <Ionicons name="call-outline" size={14} color="#00B894" />
              <Text style={styles.contactItemText}>+91 98765 43210</Text>
            </View>
            <View style={styles.contactItemRow}>
              <Ionicons name="time-outline" size={14} color="#00B894" />
              <Text style={styles.contactItemText}>24/7 Healthcare Helpline</Text>
            </View>
            <View style={styles.contactItemRow}>
              <Ionicons name="location-outline" size={14} color="#00B894" />
              <Text style={styles.contactItemText}>MediUnify Tech Park, New Delhi</Text>
            </View>
          </View>

          {/* Column 4: Legal & Support */}
          <View style={styles.footerCol}>
            <Text style={styles.footerColHeading}>Legal & Support</Text>
            <Text style={styles.footerLinkItem}>Privacy Policy</Text>
            <Text style={styles.footerLinkItem}>Terms of Service</Text>
            <Text style={styles.footerLinkItem}>DISHA & HIPAA Compliance</Text>
            <Text style={styles.footerLinkItem}>Medical Council Standards</Text>
            <Text style={styles.footerLinkItem}>Provider Help & Support</Text>
          </View>
        </View>

        {/* Footer Bottom Bar */}
        <View style={styles.footerBottomBar}>
          <Text style={styles.footerCopyText}>
            © 2026 MediUnify Healthcare Systems. All rights reserved.
          </Text>
          <Text style={styles.footerTagline}>
            Better Care • Healthier Tomorrow
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 0,
  },

  /* 1. Header Styles */
  header: {
    width: '100%',
    height: 76,
    backgroundColor: '#081E3E', // Navy Blue
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF', // Medi in white
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#00B894', // unify in teal green
  },
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navLinkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
    letterSpacing: 0.2,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tealHeaderBtn: {
    backgroundColor: '#00B894', // Teal green background
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  tealBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Little White Gap below header */
  whiteGap: {
    height: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },

  /* 2. Bootstrap 4 Carousel (Full width till end of screen) */
  carouselOuterWrapper: {
    width: '100%',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    marginBottom: 48,
    overflow: 'hidden',
  },
  carouselContainer: {
    width: '100%',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    position: 'relative',
  },
  carouselSlide: {
    width: '100%',
    minHeight: 440,
    borderRadius: 0, // Edge-to-edge flush till the ends of the screen
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 44,
    boxShadow: '0 16px 40px rgba(8, 30, 62, 0.16)',
  },
  slideInnerContentContainer: {
    width: '100%',
    maxWidth: 1200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 72,
    zIndex: 2,
  },
  slideContentCol: {
    flex: 1.2,
    justifyContent: 'center',
    zIndex: 2,
  },
  slideBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  slideBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  slideBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  slideTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  slideTagText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  slideSubtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 520,
  },
  slideActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  slidePrimaryBtn: {
    backgroundColor: '#00B894',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  slidePrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  slideSecondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  slideSecondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  slideGraphicCol: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  graphicCircleGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 35px rgba(0, 184, 148, 0.25)',
  },

  /* Carousel Navigation Buttons */
  carouselNavBtn: {
    position: 'absolute',
    top: '46%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  carouselPrevBtn: {
    left: 20,
  },
  carouselNextBtn: {
    right: 20,
  },
  carouselIndicatorsRow: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  indicatorDotActive: {
    width: 24,
    backgroundColor: '#00B894',
  },

  /* Carousel Side Vertical Scrollbar Display (Integrated at right edge of full-width slide) */
  carouselVerticalScrollBarWrap: {
    position: 'absolute',
    right: 18,
    top: '18%',
    bottom: '18%',
    width: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 15,
  },
  carouselScrollTrack: {
    flex: 1,
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 999,
    position: 'relative',
    overflow: 'hidden',
  },
  carouselScrollThumb: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#00B894', // Teal Green indicator thumb
    borderRadius: 999,
    boxShadow: '0 2px 8px rgba(0, 184, 148, 0.6)',
  },
  carouselSlideCounter: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  counterText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 3. Feature Section: How It Works */
  sectionContainer: {
    width: '100%',
    maxWidth: 1140,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTagBadge: {
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  sectionTagText: {
    color: '#00B894',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionMainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#081E3E',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 620,
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  stepBox: {
    flex: 1,
    minWidth: 240,
    maxWidth: 270,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  stepNumPill: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  stepIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  stepCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#081E3E',
    marginBottom: 10,
  },
  stepCardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },

  /* 4. About Section */
  aboutSectionContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    paddingVertical: 64,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  aboutContentWrapper: {
    maxWidth: 1040,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  aboutTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  aboutTagText: {
    color: '#00B894',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  aboutHeading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#081E3E',
    marginBottom: 28,
    textAlign: 'center',
  },
  aboutHighlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 32,
    borderWidth: 1.5,
    borderColor: '#00B894',
    boxShadow: '0 12px 30px rgba(0, 184, 148, 0.08)',
    marginBottom: 36,
    width: '100%',
    alignItems: 'center',
  },
  aboutPromptQuoteText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#0F172A',
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  aboutPillarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pillarItem: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#081E3E',
    marginTop: 12,
    marginBottom: 8,
  },
  pillarDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
  aboutCtaBar: {
    width: '100%',
    backgroundColor: '#081E3E', // Navy Blue
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  aboutCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  aboutCtaButton: {
    backgroundColor: '#00B894',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  aboutCtaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* 5. Footer: 4 Columns with Navy Blue Background */
  footer: {
    width: '100%',
    backgroundColor: '#081E3E', // Navy Blue
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 40,
  },
  footerColumnsContainer: {
    maxWidth: 1140,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 32,
    marginBottom: 48,
  },
  footerCol: {
    flex: 1,
    minWidth: 200,
  },
  footerColHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 18,
    letterSpacing: -0.2,
  },
  footerLinkItem: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 10,
    lineHeight: 18,
  },
  footerLinkClickable: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 10,
    fontWeight: '500',
  },
  contactItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  contactItemText: {
    fontSize: 13,
    color: '#CBD5E1',
  },
  footerBottomBar: {
    maxWidth: 1140,
    alignSelf: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerCopyText: {
    fontSize: 12,
    color: '#64748B',
  },
  footerTagline: {
    fontSize: 12,
    color: '#00B894',
    fontWeight: '700',
  },
});
