// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Logo from './Logo';
// import { colors, spacing, typography } from '../theme/colors';

// export default function ScreenHeader({ title, subtitle, onBack, navigation, showIcons = true }) {
//   const handleEmergency = () => {
//     Alert.alert('Emergency Call', 'Initiate an emergency call for an urgent patient case?', [
//       { text: 'Cancel', style: 'cancel' },
//       { text: 'Call Now', style: 'destructive', onPress: () => {} },
//     ]);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topRow}>
//         <View style={styles.leftRow}>
//           {onBack ? (
//             <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Ionicons name="chevron-back" size={22} color={colors.primary} />
//             </TouchableOpacity>
//           ) : null}
//           <Logo size={32} style={onBack ? { marginLeft: 4 } : { marginRight: 8 }} />
//         </View>
//         <View style={{ flex: 1 }} />
//         {showIcons ? (
//           <View style={styles.iconsRow}>
//             <TouchableOpacity style={[styles.iconBtn, styles.callBtn]} onPress={handleEmergency}>
//               <Ionicons name="call" size={16} color={colors.white} />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.iconBtn, styles.notifyBtn]}
//               onPress={() => navigation && navigation.navigate('Notifications')}
//             >
//               <Ionicons name="notifications-outline" size={16} color={colors.white} />
//               <View style={styles.bellDot} />
//             </TouchableOpacity>
//           </View>
//         ) : null}
//       </View>
//       <Text style={styles.title}>{title}</Text>
//       {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.white,
//     paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 14 : 54,
//     paddingBottom: spacing.md,
//     paddingHorizontal: spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
//   leftRow: { flexDirection: 'row', alignItems: 'center' },
//   backBtn: { padding: 4, marginRight: 6 },
//   iconsRow: { flexDirection: 'row', gap: 8 },
//   iconBtn: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//   },
//   callBtn: { backgroundColor: colors.accent, borderColor: colors.accentBorder },
//   notifyBtn: { backgroundColor: colors.primary, borderColor: colors.primaryBorder },
//   bellDot: { position: 'absolute', top: 6, right: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning, borderWidth: 1, borderColor: colors.white },
//   title: { ...typography.h2, color: colors.textPrimary },
//   subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
// });


import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from './Logo';
import { colors, spacing, typography } from '../theme/colors';

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  navigation,
  showIcons = true,
}) {
  const handleEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Initiate an emergency call for an urgent patient case?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => {},
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>

        {/* LEFT SIDE */}
        <View style={styles.leftRow}>
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backBtn}
              hitSlop={{
                top: 8,
                bottom: 8,
                left: 8,
                right: 8,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          ) : null}

          <View style={styles.brandRow}>
            <Logo
              size={30}
              style={
                onBack
                  ? { marginLeft: 2 }
                  : null
              }
            />
            <Text style={styles.brandName}>
              <Text style={styles.brandMedi}>Medi</Text>
              <Text style={styles.brandUnify}>Unify</Text>
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* CALL + NOTIFICATION */}
        {showIcons ? (
          <View style={styles.iconsRow}>

            {/* CALL */}
            <TouchableOpacity
              style={styles.headerNavItem}
              onPress={handleEmergency}
              activeOpacity={0.7}
            >
              <View style={styles.headerNavIconWrap}>
                <Ionicons
                  name="call-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.headerNavLabel}>
                Call
              </Text>
            </TouchableOpacity>

            {/* NOTIFICATIONS */}
            <TouchableOpacity
              style={styles.headerNavItem}
              onPress={() =>
                navigation &&
                navigation.navigate('Notifications')
              }
              activeOpacity={0.7}
            >
              <View style={styles.headerNavIconWrap}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={colors.primary}
                />

                <View style={styles.bellDot} />
              </View>

              <Text style={styles.headerNavLabel}>
                Alerts
              </Text>
            </TouchableOpacity>

          </View>
        ) : null}
      </View>

      {/* TITLE */}
      <Text style={styles.title}>
        {title}
      </Text>

      {/* SUBTITLE */}
      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + 14
        : 54,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  brandName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  brandMedi: {
    color: '#08317C',
    fontWeight: '800',
  },

  brandUnify: {
    color: colors.primary,
    fontWeight: '800',
  },

  backBtn: {
    padding: 4,
    marginRight: 6,
  },

  /*
   * CALL + NOTIFICATION
   *
   * Same visual style as the bottom navigation:
   * icon on top
   * label underneath
   */
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },

  headerNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 42,
  },

  headerNavIconWrap: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  headerNavLabel: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },

  bellDot: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.warning,
    borderWidth: 1,
    borderColor: colors.white,
  },

  /*
   * TITLE
   * Kept exactly the same
   */
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },

  /*
   * SUBTITLE
   * Kept exactly the same
   */
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
});