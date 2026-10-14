import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebLogo from '../components/WebLogo';

export default function RoleSelectionPage({
  mode = 'signin', // 'signin' | 'signup'
  onNavigate,
}) {
  const isSignIn = mode === 'signin';

  return (
    <View style={styles.outerContainer}>
      {/* 1. Header: Navy Blue background, fit to 100% zoom */}
      <View style={styles.header}>
        {/* Left Side: Logo and MediUnify brand text */}
        <TouchableOpacity
          style={styles.brandRow}
          onPress={() => onNavigate('landing')}
          activeOpacity={0.8}
        >
          <WebLogo size={36} withBorder />
          <Text style={styles.brandText}>
            Medi<Text style={styles.brandAccent}>unify</Text>
          </Text>
        </TouchableOpacity>

        {/* Right Side Buttons: Teal Green background */}
        <View style={styles.headerActions}>
          {/* Home Button */}
          <TouchableOpacity
            style={styles.headerTealBtn}
            onPress={() => onNavigate('landing')}
            activeOpacity={0.85}
          >
            <Ionicons name="home-outline" size={16} color="#FFFFFF" />
            <Text style={styles.headerBtnText}>Home</Text>
          </TouchableOpacity>

          {/* Toggle between Sign Up and Sign In */}
          {isSignIn ? (
            <TouchableOpacity
              style={styles.headerTealBtn}
              onPress={() => onNavigate('role-signup')}
              activeOpacity={0.85}
            >
              <Ionicons name="person-add-outline" size={16} color="#FFFFFF" />
              <Text style={styles.headerBtnText}>Sign Up</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.headerTealBtn}
              onPress={() => onNavigate('role-signin')}
              activeOpacity={0.85}
            >
              <Ionicons name="log-in-outline" size={16} color="#FFFFFF" />
              <Text style={styles.headerBtnText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. Page Body with User's Exact Radial Gradient Mesh Background */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{ __html: `
          .mediunify-role-page {
            position: relative;
            background: #FFFFFF;
            overflow: hidden;
            min-height: calc(100vh - 72px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .mediunify-role-page::before {
            content: "";
            position: absolute;
            top: -180px;
            right: -120px;
            width: 620px;
            height: 420px;
            border-radius: 50%;
            background:
              radial-gradient(circle at 30% 40%, #f7d6ee 0%, transparent 60%),
              radial-gradient(circle at 70% 50%, #d6e4ff 0%, transparent 65%),
              radial-gradient(circle at 50% 70%, #d3f4ea 0%, transparent 60%);
            filter: blur(40px);
            opacity: .9;
            z-index: 0;
            pointer-events: none;
          }
          .mediunify-role-page > * {
            position: relative;
            z-index: 1;
          }
        ` }} />
      )}

      <ScrollView
        style={styles.bodyScrollView}
        contentContainerStyle={styles.bodyContent}
      >
        <View className="page mediunify-role-page" style={styles.pageCardWrapper}>
          {/* Split Column Design as shown in User Image */}
          <View style={styles.splitColumnsContainer}>
            {/* COLUMN 1: FOR DOCTOR */}
            <View style={styles.roleColumn}>
              {/* Top Badge: BUSINESS / DOCTOR */}
              <View style={styles.roleBadgeBlack}>
                <Text style={styles.roleBadgeText}>DOCTOR</Text>
              </View>

              {/* Title with italic styling as shown in image */}
              <Text style={styles.columnTitle}>
                For <Text style={styles.columnTitleItalic}>Doctors</Text>
              </Text>

              {/* Description */}
              <Text style={styles.columnDescription}>
                {isSignIn
                  ? 'Connect with patients via video consultations and in-person clinic visits, manage schedules, and write digital prescriptions.'
                  : 'Join thousands of verified doctors, provide digital telemedicine and in-person consultations, and grow your clinical practice.'}
              </Text>

              {/* Action Button: Black rounded button */}
              <TouchableOpacity
                style={styles.blackActionBtn}
                onPress={() => onNavigate(isSignIn ? 'doctor-login' : 'doctor-register')}
                activeOpacity={0.88}
              >
                <Text style={styles.blackActionBtnText}>
                  {isSignIn ? 'Login' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              {/* Bottom Switch Link */}
              <View style={styles.switchLinkRow}>
                <Text style={styles.switchPromptText}>
                  {isSignIn ? "Don't have an account?" : 'Already have an account?'}
                </Text>
                <TouchableOpacity
                  onPress={() => onNavigate(isSignIn ? 'role-signup' : 'role-signin')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchActionLink}>
                    {isSignIn ? ' Sign up.' : ' Sign in.'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Vertical Split Divider */}
            <View style={styles.verticalDivider} />

            {/* COLUMN 2: FOR HOME NURSE */}
            <View style={styles.roleColumn}>
              {/* Top Badge: HOME CARE / NURSE */}
              <View style={styles.roleBadgeBlack}>
                <Text style={styles.roleBadgeText}>HOME NURSE</Text>
              </View>

              {/* Title with italic styling as shown in image */}
              <Text style={styles.columnTitle}>
                For <Text style={styles.columnTitleItalic}>Home Nurse</Text>
              </Text>

              {/* Description */}
              <Text style={styles.columnDescription}>
                {isSignIn
                  ? 'Deliver compassionate home nursing care, manage patient vitals, medication schedules, and daily shift visits.'
                  : 'Join our verified healthcare nursing network to deliver home care services, monitor patient recovery, and track shift schedules.'}
              </Text>

              {/* Action Button: Black rounded button */}
              <TouchableOpacity
                style={styles.blackActionBtn}
                onPress={() => onNavigate(isSignIn ? 'nurse-login' : 'nurse-register')}
                activeOpacity={0.88}
              >
                <Text style={styles.blackActionBtnText}>
                  {isSignIn ? 'Login' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              {/* Bottom Switch Link */}
              <View style={styles.switchLinkRow}>
                <Text style={styles.switchPromptText}>
                  {isSignIn ? "Don't have an account?" : 'Already have an account?'}
                </Text>
                <TouchableOpacity
                  onPress={() => onNavigate(isSignIn ? 'role-signup' : 'role-signin')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchActionLink}>
                    {isSignIn ? ' Sign up.' : ' Sign in.'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  /* 1. Header Styles */
  header: {
    width: '100%',
    height: 72,
    backgroundColor: '#081E3E', // Navy Blue
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
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
    letterSpacing: -0.4,
  },
  brandAccent: {
    color: '#00B894', // unify in teal green
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTealBtn: {
    backgroundColor: '#00B894', // Teal Green
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  headerBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* 2. Body & Split Column Layout */
  bodyScrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  bodyContent: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  pageCardWrapper: {
    width: '100%',
    maxWidth: 1100,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitColumnsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  roleColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },

  /* Badge, Titles, Description matching user reference image */
  roleBadgeBlack: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 20,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  columnTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  columnTitleItalic: {
    fontStyle: 'italic',
    fontWeight: '700',
  },
  columnDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    textAlign: 'center',
    maxWidth: 380,
    marginBottom: 32,
    minHeight: 72,
  },

  /* Black Action Button as shown in image */
  blackActionBtn: {
    backgroundColor: '#000000',
    paddingVertical: 13,
    paddingHorizontal: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  blackActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* Switch Link */
  switchLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchPromptText: {
    fontSize: 14,
    color: '#475569',
  },
  switchActionLink: {
    fontSize: 14,
    color: '#00B894',
    fontWeight: '700',
  },
});
