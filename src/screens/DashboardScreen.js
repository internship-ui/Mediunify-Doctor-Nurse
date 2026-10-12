


// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   StatusBar,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Logo from '../components/Logo';
// import Card from '../components/Card';
// import StatusPill from '../components/StatusPill';
// import TypeTag from '../components/TypeTag';
// import { colors, spacing, typography, radius } from '../theme/colors';
// import { doctor, appointments } from '../data/mockData';

// const navCards = [
//   {
//     key: 'Appointments',
//     label: 'Appointments',
//     icon: 'calendar',
//     bg: colors.primarySurface,
//     fg: colors.primary,
//     border: colors.primary,
//   },
//   {
//     key: 'Patients',
//     label: 'Patients Follow-up',
//     icon: 'people',
//     bg: colors.primarySurface,
//     fg: colors.primary,
//     border: colors.primary,
//   },
//   {
//     key: 'Prescription',
//     label: 'Prescriptions',
//     icon: 'medical',
//     bg: colors.primarySurface,
//     fg: colors.primary,
//     border: colors.primary,
//   },
//   {
//     key: 'Availability',
//     label: 'Availability',
//     icon: 'time',
//     bg: colors.primarySurface,
//     fg: colors.primary,
//     border: colors.primary,
//   },
// ];

// export default function DashboardScreen({ navigation }) {
//   const todays = appointments.filter((a) => a.date === 'Today');

//   const handleEmergency = () => {
//     Alert.alert(
//       'Emergency Call',
//       'Initiate an emergency call for an urgent patient case?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Call Now',
//           style: 'destructive',
//           onPress: () => {},
//         },
//       ]
//     );
//   };

//   return (
//     <ScrollView
//       style={{
//         flex: 1,
//         backgroundColor: colors.white,
//       }}
//       showsVerticalScrollIndicator={false}
//     >
//       <View style={styles.header}>

//         {/* TOP ROW */}
//         <View style={styles.topRow}>
//           <Logo size={36} />

//           {/* Call + Notification - navigation style */}
//           <View style={styles.iconsRow}>

//             {/* CALL */}
//             <TouchableOpacity
//               style={styles.headerNavItem}
//               onPress={handleEmergency}
//               activeOpacity={0.7}
//             >
//               <View style={styles.headerNavIconWrap}>
//                 <Ionicons
//                   name="call-outline"
//                   size={22}
//                   color={colors.primary}
//                 />
//               </View>

//               <Text style={styles.headerNavLabel}>
//                 Call
//               </Text>
//             </TouchableOpacity>

//             {/* NOTIFICATIONS */}
//             <TouchableOpacity
//               style={styles.headerNavItem}
//               onPress={() => navigation.navigate('Notifications')}
//               activeOpacity={0.7}
//             >
//               <View style={styles.headerNavIconWrap}>
//                 <Ionicons
//                   name="notifications-outline"
//                   size={22}
//                   color={colors.primary}
//                 />

//                 <View style={styles.bellDot} />
//               </View>

//               <Text style={styles.headerNavLabel}>
//                 Alerts
//               </Text>
//             </TouchableOpacity>

//           </View>
//         </View>

//         {/* GREETING */}
//         <View style={styles.greetingBlock}>
//           <Text style={styles.greeting}>
//             Hello, {doctor.name}
//           </Text>

//           <View style={styles.locationRow}>
//             <Ionicons
//               name="location-outline"
//               size={13}
//               color={colors.textSecondary}
//             />

//             <Text style={styles.locationText}>
//               {doctor.location}
//             </Text>
//           </View>

//           <View style={styles.onlineRow}>
//             <View style={styles.onlineDot} />

//             <Text style={styles.onlineText}>
//               Online — accepting appointments
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* NAVIGATION CARDS */}
//       <View style={styles.navGrid}>
//         {navCards.map((c) => (
//           <TouchableOpacity
//             key={c.key}
//             style={[
//               styles.navCard,
//               {
//                 borderColor: c.border,
//               },
//             ]}
//             onPress={() => navigation.navigate(c.key)}
//             activeOpacity={0.85}
//           >
//             <View
//               style={[
//                 styles.navIconWrap,
//                 {
//                   backgroundColor: c.bg,
//                 },
//               ]}
//             >
//               <Ionicons
//                 name={c.icon}
//                 size={22}
//                 color={c.fg}
//               />
//             </View>

//             <Text style={styles.navLabel}>
//               {c.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* TODAY'S APPOINTMENTS */}
//       <View style={styles.section}>

//         <View style={styles.sectionHeaderRow}>
//           <Text style={styles.sectionTitle}>
//             Today's Appointments
//           </Text>

//           {/* <TouchableOpacity
//             style={styles.seeAllBtn}
//             onPress={() => navigation.navigate('Appointments')}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.seeAll}>
//               See all
//             </Text> 

//              <Ionicons
//               name="chevron-forward"
//               size={12}
//               color={colors.accent}
//             />
//           </TouchableOpacity> */}
//         </View> 

//         {todays.map((appt) => (
//           <Card
//             key={appt.id}
//             style={[
//               styles.apptCard,
//               {
//                 borderColor:
//                   appt.type === 'Video'
//                     ? colors.primary + '55'
//                     : colors.accent + '55',

//                 borderLeftWidth: 4,

//                 borderLeftColor:
//                   appt.type === 'Video'
//                     ? colors.primary
//                     : colors.accent,
//               },
//             ]}
//           >
//             <View style={styles.apptRow}>

//               {/* PATIENT AVATAR */}
//               <View style={styles.apptAvatar}>
//                 <Text style={styles.apptAvatarText}>
//                   {appt.patient.charAt(0)}
//                 </Text>
//               </View>

//               {/* PATIENT INFO */}
//               <View style={styles.apptInfo}>
//                 <Text style={styles.apptName}>
//                   {appt.patient}
//                 </Text>

//                 <Text style={styles.apptMeta}>
//                   {appt.age} yrs · {appt.gender} · {appt.time}
//                 </Text>

//                 <View style={{ marginTop: 6 }}>
//                   <TypeTag type={appt.type} />
//                 </View>
//               </View>

//               {/* STATUS */}
//               <StatusPill status={appt.status} />
//             </View>
//           </Card>
//         ))}
//       </View>

//       <View style={{ height: 24 }} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({

//   /* HEADER */
//   header: {
//     backgroundColor: colors.white,
//     paddingTop:
//       Platform.OS === 'android'
//         ? (StatusBar.currentHeight || 24) + 16
//         : 56,
//     paddingBottom: spacing.lg,
//     paddingHorizontal: spacing.lg,
//     borderBottomWidth: 1.5,
//     borderBottomColor:
//       colors.cardBorder || colors.border,
//   },

//   topRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   /*
//    * CALL + NOTIFICATION
//    * Styled like the bottom navigation:
//    * icon on top
//    * label underneath
//    */
//   iconsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 18,
//   },

//   headerNavItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 42,
//   },

//   headerNavIconWrap: {
//     width: 30,
//     height: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//   },

//   headerNavLabel: {
//     ...typography.tiny,
//     color: colors.primary,
//     fontWeight: '700',
//     marginTop: 2,
//   },

//   bellDot: {
//     position: 'absolute',
//     top: 1,
//     right: 1,
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: colors.warning,
//     borderWidth: 1,
//     borderColor: colors.white,
//   },

//   /* GREETING */
//   greetingBlock: {
//     marginTop: spacing.lg,
//   },

//   greeting: {
//     ...typography.h3,
//     color: colors.textPrimary,
//   },

//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginTop: 4,
//   },

//   locationText: {
//     ...typography.small,
//     color: colors.textSecondary,
//   },

//   onlineRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },

//   onlineDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: colors.success,
//     marginRight: 8,
//   },

//   onlineText: {
//     ...typography.small,
//     color: colors.textSecondary,
//   },

//   /* NAVIGATION CARDS */
//   navGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: spacing.lg,
//     marginTop: spacing.lg,
//     gap: 12,
//   },

//   navCard: {
//     width: '47%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.card,
//     borderRadius: radius.lg,
//     paddingVertical: spacing.lg,
//     borderWidth: 1.8,
//   },

//   navIconWrap: {
//     width: 46,
//     height: 46,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },

//   navLabel: {
//     ...typography.bodyBold,
//     color: colors.textPrimary,
//   },

//   /* APPOINTMENTS SECTION */
//   section: {
//     paddingHorizontal: spacing.lg,
//     marginTop: spacing.xl,
//   },

//   sectionHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: spacing.md,
//   },

//   sectionTitle: {
//     ...typography.h3,
//     color: colors.textPrimary,
//   },

//   seeAllBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: radius.pill,
//     borderWidth: 1.2,
//     borderColor: colors.accent,
//     backgroundColor: colors.accentSurface,
//   },

//   seeAll: {
//     ...typography.smallBold,
//     color: colors.accent,
//   },

//   /* APPOINTMENT CARD */
//   apptCard: {
//     marginBottom: 12,
//     borderWidth: 1.5,
//   },

//   apptRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   apptAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: colors.primarySurface,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1.2,
//     borderColor: colors.primaryLight,
//   },

//   apptAvatarText: {
//     ...typography.h3,
//     color: colors.primary,
//   },

//   apptInfo: {
//     flex: 1,
//     marginLeft: 12,
//     marginRight: 8,
//   },

//   apptName: {
//     ...typography.bodyBold,
//     color: colors.textPrimary,
//   },

//   apptMeta: {
//     ...typography.small,
//     color: colors.textSecondary,
//     marginTop: 2,
//   },
// });








// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   StatusBar,
// } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';

// import Logo from '../components/Logo';
// import Card from '../components/Card';
// import StatusPill from '../components/StatusPill';
// import TypeTag from '../components/TypeTag';

// import {
//   colors,
//   spacing,
//   typography,
//   radius,
// } from '../theme/colors';

// import {
//   doctor,
//   appointments,
// } from '../data/mockData';


// /* ============================================================
//    QUICK ACTION CARDS
// ============================================================ */

// const navCards = [
//   {
//     key: 'Appointments',
//     label: 'Appointments',
//     icon: 'calendar',
//     bg: colors.primarySurface,
//     fg: colors.primary,
//     border: colors.primary,
//   },
//   {
//     key: 'Patients',
//     label: 'Patients Follow-up',
//     icon: 'people',
//     bg: colors.primarySurface,
//     fg: colors.primary,
//     border: colors.primary,
//   },
//   {
//     key: 'Prescription',
//     label: 'Prescriptions',
//     icon: 'medical',
//     bg: colors.primarySurface,
//     fg: colors.primary,
//     border: colors.primary,
//   },
//   {
//     key: 'Availability',
//     label: 'Availability',
//     icon: 'time',
//     bg: colors.primarySurface,
//     fg: colors.primary,
//     border: colors.primary,
//   },
// ];


// /* ============================================================
//    DASHBOARD
// ============================================================ */

// export default function DashboardScreen({ navigation }) {

//   /* ----------------------------------------------------------
//      TODAY'S APPOINTMENTS
//   ---------------------------------------------------------- */

//   const todays = appointments.filter(
//     (a) => a.date === 'Today'
//   );


//   /* ----------------------------------------------------------
//      COUNT CARDS

//      Active = accepted / confirmed appointments
//      Pending = pending appointments
//   ---------------------------------------------------------- */

//   const todayCount = todays.length;

//   const activeCount = appointments.filter(
//     (a) =>
//       a.status === 'Accepted' ||
//       a.status === 'Confirmed'
//   ).length;

//   const pendingCount = appointments.filter(
//     (a) =>
//       a.status === 'Pending' ||
//       a.status === 'Requested'
//   ).length;


//   /* ----------------------------------------------------------
//      EMERGENCY
//   ---------------------------------------------------------- */

//   const handleEmergency = () => {
//     Alert.alert(
//       'Emergency Call',
//       'Initiate an emergency call for an urgent patient case?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Call Now',
//           style: 'destructive',
//           onPress: () => {},
//         },
//       ]
//     );
//   };


//   return (
//     <ScrollView
//       style={{
//         flex: 1,
//         backgroundColor: colors.white,
//       }}
//       showsVerticalScrollIndicator={false}
//     >

//       {/* ======================================================
//           HEADER
//       ======================================================= */}

//       <View style={styles.header}>

//         {/* TOP ROW */}

//         <View style={styles.topRow}>

//           <Logo size={36} />


//           {/* CALL + NOTIFICATIONS */}

//           <View style={styles.iconsRow}>

//             {/* CALL */}

//             <TouchableOpacity
//               style={styles.headerNavItem}
//               onPress={handleEmergency}
//               activeOpacity={0.7}
//             >

//               <View style={styles.headerNavIconWrap}>

//                 <Ionicons
//                   name="call-outline"
//                   size={22}
//                   color={colors.primary}
//                 />

//               </View>

//               <Text style={styles.headerNavLabel}>
//                 Call
//               </Text>

//             </TouchableOpacity>


//             {/* NOTIFICATIONS */}

//             <TouchableOpacity
//               style={styles.headerNavItem}
//               onPress={() =>
//                 navigation.navigate('Notifications')
//               }
//               activeOpacity={0.7}
//             >

//               <View style={styles.headerNavIconWrap}>

//                 <Ionicons
//                   name="notifications-outline"
//                   size={22}
//                   color={colors.primary}
//                 />

//                 <View style={styles.bellDot} />

//               </View>

//               <Text style={styles.headerNavLabel}>
//                 Alerts
//               </Text>

//             </TouchableOpacity>

//           </View>

//         </View>


//         {/* GREETING */}

//         <View style={styles.greetingBlock}>

//           <Text style={styles.greeting}>
//             Hello, {doctor.name}
//           </Text>


//           <View style={styles.locationRow}>

//             <Ionicons
//               name="location-outline"
//               size={13}
//               color={colors.textSecondary}
//             />

//             <Text style={styles.locationText}>
//               {doctor.location}
//             </Text>

//           </View>


//           <View style={styles.onlineRow}>

//             <View style={styles.onlineDot} />

//             <Text style={styles.onlineText}>
//               Online — accepting appointments
//             </Text>

//           </View>

//         </View>

//       </View>


//       {/* ======================================================
//           SUMMARY COUNT CARDS

//           3 cards ABOVE Quick Actions
//       ======================================================= */}

//       <View style={styles.summarySection}>

//         {/* TODAY'S APPOINTMENTS */}

//         <TouchableOpacity
//           style={styles.summaryCard}
//           activeOpacity={0.8}
//           onPress={() =>
//             navigation.navigate('Appointments')
//           }
//         >

//           <View
//             style={[
//               styles.summaryIcon,
//               {
//                 backgroundColor:
//                   colors.primarySurface,
//               },
//             ]}
//           >

//             <Ionicons
//               name="calendar-outline"
//               size={20}
//               color={colors.primary}
//             />

//           </View>

//           <Text style={styles.summaryCount}>
//             {todayCount}
//           </Text>

//           <Text style={styles.summaryLabel}>
//             Today's Appointments
//           </Text>

//         </TouchableOpacity>


//         {/* ACTIVE */}

//         <TouchableOpacity
//           style={styles.summaryCard}
//           activeOpacity={0.8}
//           onPress={() =>
//             navigation.navigate('Appointments')
//           }
//         >

//           <View
//             style={[
//               styles.summaryIcon,
//               {
//                 backgroundColor:
//                   colors.successSurface,
//               },
//             ]}
//           >

//             <Ionicons
//               name="checkmark-circle-outline"
//               size={20}
//               color={colors.success}
//             />

//           </View>

//           <Text style={styles.summaryCount}>
//             7
//             {activeCount}
//           </Text>

//           <Text style={styles.summaryLabel}>
//             Active
//           </Text>

//         </TouchableOpacity>


//         {/* PENDING */}

//         <TouchableOpacity
//           style={styles.summaryCard}
//           activeOpacity={0.8}
//           onPress={() =>
//             navigation.navigate('Appointments')
//           }
//         >

//           <View
//             style={[
//               styles.summaryIcon,
//               {
//                 backgroundColor:
//                   colors.warningSurface,
//               },
//             ]}
//           >

//             <Ionicons
//               name="time-outline"
//               size={20}
//               color={colors.warning}
//             />

//           </View>

//           <Text style={styles.summaryCount}>
//             1
//             {pendingCount}
//           </Text>

//           <Text style={styles.summaryLabel}>
//             Pending
//           </Text>

//         </TouchableOpacity>

//       </View>


//       {/* ======================================================
//           QUICK ACTIONS TITLE
//       ======================================================= */}

//       <View style={styles.quickActionsHeader}>

//         <Text style={styles.quickActionsTitle}>
//           Quick Actions
//         </Text>

//       </View>


//       {/* ======================================================
//           FOUR QUICK ACTION CARDS
//       ======================================================= */}

//       <View style={styles.navGrid}>

//         {navCards.map((c) => (

//           <TouchableOpacity
//             key={c.key}
//             style={[
//               styles.navCard,
//               {
//                 borderColor: c.border,
//               },
//             ]}
//             onPress={() =>
//               navigation.navigate(c.key)
//             }
//             activeOpacity={0.85}
//           >

//             <View
//               style={[
//                 styles.navIconWrap,
//                 {
//                   backgroundColor: c.bg,
//                 },
//               ]}
//             >

//               <Ionicons
//                 name={c.icon}
//                 size={22}
//                 color={c.fg}
//               />

//             </View>

//             <Text style={styles.navLabel}>
//               {c.label}
//             </Text>

//           </TouchableOpacity>

//         ))}

//       </View>


//       {/* ======================================================
//           TODAY'S APPOINTMENTS
//       ======================================================= */}

//       <View style={styles.section}>

//         <View style={styles.sectionHeaderRow}>

//           <Text style={styles.sectionTitle}>
//             Today's Appointments
//           </Text>

//         </View>


//         {todays.map((appt) => (

//           <Card
//             key={appt.id}
//             style={[
//               styles.apptCard,
//               {
//                 borderColor:
//                   appt.type === 'Video'
//                     ? colors.primary + '55'
//                     : colors.accent + '55',

//                 borderLeftWidth: 4,

//                 borderLeftColor:
//                   appt.type === 'Video'
//                     ? colors.primary
//                     : colors.accent,
//               },
//             ]}
//           >

//             <View style={styles.apptRow}>

//               {/* PATIENT AVATAR */}

//               <View style={styles.apptAvatar}>

//                 <Text style={styles.apptAvatarText}>
//                   {appt.patient.charAt(0)}
//                 </Text>

//               </View>


//               {/* PATIENT INFO */}

//               <View style={styles.apptInfo}>

//                 <Text style={styles.apptName}>
//                   {appt.patient}
//                 </Text>

//                 <Text style={styles.apptMeta}>
//                   {appt.age} yrs · {appt.gender} · {appt.time}
//                 </Text>

//                 <View style={{ marginTop: 6 }}>

//                   <TypeTag
//                     type={appt.type}
//                   />

//                 </View>

//               </View>


//               {/* STATUS */}

//               <StatusPill
//                 status={appt.status}
//               />

//             </View>

//           </Card>

//         ))}

//       </View>


//       <View style={{ height: 24 }} />

//     </ScrollView>
//   );
// }


// /* ============================================================
//    STYLES
// ============================================================ */

// const styles = StyleSheet.create({

//   /* ==========================================================
//      HEADER
//   ========================================================== */

//   header: {
//     backgroundColor: colors.white,

//     paddingTop:
//       Platform.OS === 'android'
//         ? (StatusBar.currentHeight || 24) + 16
//         : 56,

//     paddingBottom: spacing.lg,
//     paddingHorizontal: spacing.lg,

//     borderBottomWidth: 1.5,

//     borderBottomColor:
//       colors.cardBorder || colors.border,
//   },


//   topRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },


//   /* ==========================================================
//      HEADER ICONS
//   ========================================================== */

//   iconsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 18,
//   },


//   headerNavItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 42,
//   },


//   headerNavIconWrap: {
//     width: 30,
//     height: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//   },


//   headerNavLabel: {
//     ...typography.tiny,
//     color: colors.primary,
//     fontWeight: '700',
//     marginTop: 2,
//   },


//   bellDot: {
//     position: 'absolute',
//     top: 1,
//     right: 1,

//     width: 7,
//     height: 7,

//     borderRadius: 4,

//     backgroundColor: colors.warning,

//     borderWidth: 1,
//     borderColor: colors.white,
//   },


//   /* ==========================================================
//      GREETING
//   ========================================================== */

//   greetingBlock: {
//     marginTop: spacing.lg,
//   },


//   greeting: {
//     ...typography.h3,
//     color: colors.textPrimary,
//   },


//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginTop: 4,
//   },


//   locationText: {
//     ...typography.small,
//     color: colors.textSecondary,
//   },


//   onlineRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },


//   onlineDot: {
//     width: 8,
//     height: 8,

//     borderRadius: 4,

//     backgroundColor: colors.success,

//     marginRight: 8,
//   },


//   onlineText: {
//     ...typography.small,
//     color: colors.textSecondary,
//   },


//   /* ==========================================================
//      SUMMARY COUNT CARDS
//   ========================================================== */

//   summarySection: {
//     flexDirection: 'row',

//     paddingHorizontal: spacing.lg,

//     marginTop: spacing.lg,

//     gap: 10,
//   },


//   summaryCard: {
//     flex: 1,

//     minHeight: 120,

//     backgroundColor: colors.card,

//     borderRadius: radius.lg,

//     borderWidth: 1,

//     borderColor:
//       colors.cardBorder || colors.border,

//     paddingVertical: 12,
//     paddingHorizontal: 8,

//     alignItems: 'center',
//     justifyContent: 'center',
//   },


//   summaryIcon: {
//     width: 38,
//     height: 38,

//     borderRadius: 12,

//     alignItems: 'center',
//     justifyContent: 'center',

//     marginBottom: 7,
//   },


//   summaryCount: {
//     ...typography.h2,

//     color: colors.textPrimary,

//     fontSize: 22,

//     lineHeight: 27,
//   },


//   summaryLabel: {
//     ...typography.tiny,

//     color: colors.textSecondary,

//     textAlign: 'center',

//     marginTop: 3,
//   },


//   /* ==========================================================
//      QUICK ACTIONS TITLE
//   ========================================================== */

//   quickActionsHeader: {
//     paddingHorizontal: spacing.lg,

//     marginTop: spacing.xl,

//     marginBottom: spacing.sm,
//   },


//   quickActionsTitle: {
//     ...typography.h3,

//     color: colors.textPrimary,

//     fontSize: 17,
//   },


//   /* ==========================================================
//      QUICK ACTION GRID
//   ========================================================== */

//   navGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',

//     paddingHorizontal: spacing.lg,

//     gap: 12,
//   },


//   navCard: {
//     width: '47%',

//     alignItems: 'center',
//     justifyContent: 'center',

//     backgroundColor: colors.card,

//     borderRadius: radius.lg,

//     paddingVertical: spacing.lg,

//     borderWidth: 1.8,

//   },


//   navIconWrap: {
//     width: 46,
//     height: 46,

//     borderRadius: 14,

//     alignItems: 'center',
//     justifyContent: 'center',

//     marginBottom: 8,
//   },


//   navLabel: {
//     ...typography.bodyBold,

//     color: colors.textPrimary,

//     textAlign: 'center',
//   },


//   /* ==========================================================
//      TODAY'S APPOINTMENTS
//   ========================================================== */

//   section: {
//     paddingHorizontal: spacing.lg,

//     marginTop: spacing.xl,
//   },


//   sectionHeaderRow: {
//     flexDirection: 'row',

//     justifyContent: 'space-between',

//     alignItems: 'center',

//     marginBottom: spacing.md,
//   },


//   sectionTitle: {
//     ...typography.h3,

//     color: colors.textPrimary,
//   },


//   /* ==========================================================
//      APPOINTMENT CARD
//   ========================================================== */

//   apptCard: {
//     marginBottom: 12,

//     borderWidth: 1.5,
//   },


//   apptRow: {
//     flexDirection: 'row',

//     alignItems: 'center',
//   },


//   apptAvatar: {
//     width: 44,
//     height: 44,

//     borderRadius: 22,

//     backgroundColor:
//       colors.primarySurface,

//     alignItems: 'center',
//     justifyContent: 'center',

//     borderWidth: 1.2,

//     borderColor:
//       colors.primaryLight,
//   },


//   apptAvatarText: {
//     ...typography.h3,

//     color: colors.primary,
//   },


//   apptInfo: {
//     flex: 1,

//     marginLeft: 12,

//     marginRight: 8,
//   },


//   apptName: {
//     ...typography.bodyBold,

//     color: colors.textPrimary,
//   },


//   apptMeta: {
//     ...typography.small,

//     color: colors.textSecondary,

//     marginTop: 2,
//   },

// });





import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Logo from '../components/Logo';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import TypeTag from '../components/TypeTag';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../theme/colors';

import {
  doctor,
  appointments,
} from '../data/mockData';


/* ============================================================
   QUICK ACTION CARDS (REAL IMAGES)
============================================================ */

const navCards = [
  {
    key: 'Appointments',
    label: 'Appointments',
    screen: 'Appointments',
    image: require('../assets/quick_appointments.jpg'),
  },
  {
    key: 'PatientsFollowUp',
    label: 'Patients Follow-up',
    screen: 'FollowUps',
    image: require('../assets/quick_followup.jpg'),
  },
  {
    key: 'DirectPatient',
    label: 'Direct Patient',
    screen: 'DirectPatient',
    image: require('../assets/quick_direct_patient.jpg'),
  },
  {
    key: 'Availability',
    label: 'Availability',
    screen: 'Availability',
    image: require('../assets/quick_availability.jpg'),
  },
];

const nextAppointmentData = {
  id: 'a1',
  patientId: 'p1',
  patient: 'Rohan Mehta',
  age: 34,
  gender: 'Male',
  time: '10:30 AM',
  date: 'Today',
  type: 'Video',
  reason: 'Follow-up · Video consultation',
  status: 'confirmed',
  fee: 600,
};

const dashboardFollowUps = [
  {
    id: 'df1',
    patient: 'Suresh K.',
    initials: 'SK',
    avatarBg: '#E2E8F0',
    avatarColor: '#1E293B',
    subtitle: 'Overdue · 2 days',
    subtitleColor: '#DC2626',
    status: 'overdue',
  },
  {
    id: 'df2',
    patient: 'Priya D.',
    initials: 'PD',
    avatarBg: '#D1FAE5',
    avatarColor: '#065F46',
    subtitle: 'Due today · Lab review',
    subtitleColor: '#64748B',
    status: 'today',
  },
  {
    id: 'df3',
    patient: 'Rahul K.',
    initials: 'RK',
    avatarBg: '#DBEAFE',
    avatarColor: '#1E40AF',
    subtitle: 'Due today · BP Check',
    subtitleColor: '#64748B',
    status: 'today',
  },
  {
    id: 'df4',
    patient: 'Arjun M.',
    initials: 'AM',
    avatarBg: '#FEF3C7',
    avatarColor: '#92400E',
    subtitle: 'Upcoming · HbA1c review',
    subtitleColor: '#64748B',
    status: 'upcoming',
  },
];


/* ============================================================
   DASHBOARD
============================================================ */

export default function DashboardScreen({ navigation }) {

  const [followUpFilter, setFollowUpFilter] = useState('all'); // 'all' | 'overdue' | 'today'

  const filteredDashboardFollowUps = dashboardFollowUps.filter((item) => {
    if (followUpFilter === 'overdue') return item.status === 'overdue';
    if (followUpFilter === 'today') return item.status === 'today';
    return true; // 'all'
  });

  /* ----------------------------------------------------------
     TODAY'S APPOINTMENTS
  ---------------------------------------------------------- */

  const todays = appointments.filter(
    (a) => a.date === 'Today'
  );


  /* ----------------------------------------------------------
     COUNT CARDS
  ---------------------------------------------------------- */

  const todayCount = todays.length;

  // Fixed count requested
  const activeCount = 7;

  // Fixed count requested
  const pendingCount = 5;

  const inPersonCount = todays.filter((a) => a.type === 'In-Person').length;
  const videoCount = todays.filter((a) => a.type === 'Video').length;


  /* ----------------------------------------------------------
     EMERGENCY
  ---------------------------------------------------------- */

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
          onPress: () => { },
        },
      ]
    );
  };


  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
      showsVerticalScrollIndicator={false}
    >

      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* ======================================================
          DARK NAVY HEADER (MATCHING UI DESIGN)
      ======================================================= */}

      <View style={styles.header}>

        {/* TOP ROW: BRAND & ACTION ICONS (NO SETTINGS) */}

        <View style={styles.topRow}>

          <View style={styles.brandRow}>
            <Logo size={36} />
            <Text style={styles.brandName}>
              <Text style={styles.brandMedi}>Medi</Text>
              <Text style={styles.brandUnify}>Unify</Text>
            </Text>
          </View>


          {/* CALL + NOTIFICATIONS (NO SETTINGS) */}

          <View style={styles.iconsRow}>

            {/* CALL */}

            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={handleEmergency}
              activeOpacity={0.7}
            >
              <Ionicons
                name="call"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>


            {/* NOTIFICATIONS */}

            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() =>
                navigation.navigate('Notifications')
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications"
                size={18}
                color="#FFFFFF"
              />

              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>


        {/* GREETING: GOOD MORNING + DOCTOR NAME + LOCATION (NO ONLINE TOGGLE) */}

        <View style={styles.greetingBlock}>

          <Text style={styles.greetingSub}>
            Good morning
          </Text>

          <Text style={styles.greetingName}>
            {doctor.name}
          </Text>


          <View style={styles.locationRow}>

            <Ionicons
              name="location-outline"
              size={15}
              color="#94A3B8"
            />

            <Text style={styles.locationText}>
              {doctor.location}
            </Text>

          </View>

        </View>

      </View>


      {/* ======================================================
          NEXT APPOINTMENT CARD (Refer UI-design in image)
      ======================================================= */}

      <View style={styles.nextApptContainer}>

        <View style={styles.nextApptCard}>

          {/* TOP ROW: NEXT APPOINTMENT & IN 25 MIN */}
          <View style={styles.nextApptTopRow}>
            <Text style={styles.nextApptBadgeTitle}>
              NEXT APPOINTMENT
            </Text>

            <View style={styles.nextApptTimePill}>
              <Text style={styles.nextApptTimePillText}>
                in 25 min
              </Text>
            </View>
          </View>

          {/* PATIENT INFO (Matching Image Design) */}
          <TouchableOpacity
            style={styles.nextApptPatientBox}
            onPress={() =>
              navigation.navigate('AppointmentDetail', {
                appointment: nextAppointmentData,
                mode: 'Video',
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.nextApptAvatar}>
              <Text style={styles.nextApptAvatarText}>
                RM
              </Text>
            </View>

            <View style={styles.nextApptInfo}>
              <Text style={styles.nextApptName}>
                Rohan Mehta, 34
              </Text>

              <Text style={styles.nextApptMeta}>
                10:30 AM · Follow-up · Video
              </Text>
            </View>
          </TouchableOpacity>

          {/* ACTION BUTTONS: JOIN CALL & PATIENT DETAILS (NAVY BLUE) */}
          <View style={styles.nextApptActions}>
            <TouchableOpacity
              style={styles.nextApptJoinBtn}
              onPress={() =>
                navigation.navigate('VideoConsultation', { patient: 'Rohan Mehta' })
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="videocam-outline"
                size={17}
                color="#071E42"
              />
              <Text style={styles.nextApptJoinText}>
                Join call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextApptFileBtn}
              onPress={() =>
                navigation.navigate('AppointmentDetail', {
                  appointment: nextAppointmentData,
                  mode: 'Video',
                })
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#071E42"
              />
              <Text style={styles.nextApptFileText}>
                Patient Details
              </Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>


      {/* ======================================================
          TODAY APPOINTMENTS HEADER
      ======================================================= */}

      <View style={styles.todayAppointmentsHeader}>

        <Text style={styles.todayAppointmentsTitle}>
          Today Appointments
        </Text>

      </View>


      {/* ======================================================
          SUMMARY COUNT CARDS
      ======================================================= */}

      <View style={styles.summarySection}>

        {/* TODAY */}
        {/* <TouchableOpacity
          style={styles.summaryCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Appointments')
          }
        >
          <Text style={styles.summaryCount}>
            {todayCount}
          </Text>
          <Text style={styles.summaryLabel}>
            Today
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.summaryCardNavy}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Appointments')
          }
        >
          <Text style={styles.summaryCountNavy}>
            {todayCount}
          </Text>
          <Text style={styles.summaryLabelNavy}>
            Today
          </Text>
        </TouchableOpacity>


        {/* CONFIRMED */}
        {/* <TouchableOpacity
          style={styles.summaryCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Appointments')
          }
        >
          <Text style={styles.summaryCount}>
            {activeCount}
          </Text>
          <Text style={styles.summaryLabel}>
            Confirmed
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.summaryCardNavy}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Appointments')
          }
        >
          <Text style={styles.summaryCountNavy}>
            {activeCount}
          </Text>
          <Text style={styles.summaryLabelNavy}>
            Confirmed
          </Text>
        </TouchableOpacity>


        {/* PENDING (NAVY BLUE THEME) */}
        <TouchableOpacity
          style={styles.summaryCardNavy}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Appointments')
          }
        >
          <Text style={styles.summaryCountNavy}>
            {pendingCount}
          </Text>
          <Text style={styles.summaryLabelNavy}>
            Pending
          </Text>
        </TouchableOpacity>

      </View>


      {/* ======================================================
          IN-PERSON & VIDEO CONSULTATION MODE CARDS
      ======================================================= */}

      <View style={styles.consultModeContainer}>

        {/* IN-PERSON CARD */}

        <TouchableOpacity
          style={styles.consultModeCard}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('Appointments', { initialType: 'In-Person' })
          }
        >

          <View style={[styles.consultModeIconWrap, { backgroundColor: '#E6FAF6' }]}>
            <Ionicons
              name="business-outline"
              size={22}
              color="#071E42"
            />
          </View>

          <View style={styles.consultModeInfo}>
            <Text style={styles.consultModeTitle}>
              In-Person
            </Text>
            <Text style={styles.consultModeSubtitle}>
              {inPersonCount} today
            </Text>
          </View>

          <View style={styles.consultModeArrow}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="#071E42"
            />
          </View>

        </TouchableOpacity>


        {/* VIDEO CARD */}

        <TouchableOpacity
          style={styles.consultModeCard}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('Appointments', { initialType: 'Video' })
          }
        >

          <View style={[styles.consultModeIconWrap, { backgroundColor: '#EEF4FC' }]}>
            <Ionicons
              name="videocam-outline"
              size={22}
              color="#071E42"
            />
          </View>

          <View style={styles.consultModeInfo}>
            <Text style={styles.consultModeTitle}>
              Video
            </Text>
            <Text style={styles.consultModeSubtitle}>
              {videoCount} today
            </Text>
          </View>

          <View style={styles.consultModeArrow}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="#071E42"
            />
          </View>

        </TouchableOpacity>

      </View>


      {/* ======================================================
          QUICK ACTIONS TITLE
      ======================================================= */}

      <View style={styles.quickActionsHeader}>

        <Text style={styles.quickActionsTitle}>
          Quick Actions
        </Text>

      </View>


      {/* ======================================================
          FOUR QUICK ACTION CARDS
      ======================================================= */}

      <View style={styles.navGrid}>

        {navCards.map((c) => {
          return (
            <TouchableOpacity
              key={c.key}
              style={styles.navCard}
              onPress={() =>
                navigation.navigate(c.screen)
              }
              activeOpacity={0.85}
            >

              {/* CARD TOP HEADER: Title & Navy Blue Arrow Button */}
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardHeaderTitle} numberOfLines={1}>
                  {c.label}
                </Text>

                <View style={styles.navyArrowCircle}>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              {/* REAL IMAGE */}
              <View style={styles.quickImageContainer}>
                <Image
                  source={c.image}
                  style={styles.quickImage}
                  resizeMode="cover"
                />
              </View>

            </TouchableOpacity>
          );
        })}

      </View>


      {/* ======================================================
          PATIENT FOLLOW-UPS (MATCHING USER SCREENSHOT)
      ======================================================= */}
      <View style={styles.followUpSection}>
        {/* HEADER: TITLE + VIEW ALL (6 NUMBER REMOVED) */}
        <View style={styles.followUpHeaderRow}>
          <Text style={styles.followUpSectionTitle}>Patient follow-ups</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('FollowUps')}
            activeOpacity={0.7}
          >
            <Text style={styles.followUpViewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* FILTER PILLS */}
        <View style={styles.followUpPillsRow}>
          <TouchableOpacity
            style={[
              styles.followUpPill,
              followUpFilter === 'all' && styles.followUpPillActive,
            ]}
            onPress={() => setFollowUpFilter('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.followUpPillText,
                followUpFilter === 'all' && styles.followUpPillTextActive,
              ]}
            >
              All 4
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.followUpPill,
              followUpFilter === 'overdue' && styles.followUpPillActive,
            ]}
            onPress={() => setFollowUpFilter('overdue')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.followUpPillText,
                followUpFilter === 'overdue' && styles.followUpPillTextActive,
              ]}
            >
              Overdue 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.followUpPill,
              followUpFilter === 'today' && styles.followUpPillActive,
            ]}
            onPress={() => setFollowUpFilter('today')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.followUpPillText,
                followUpFilter === 'today' && styles.followUpPillTextActive,
              ]}
            >
              Today 2
            </Text>
          </TouchableOpacity>
        </View>

        {/* FOLLOW-UP CARDS */}
        {filteredDashboardFollowUps.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.followUpCard}
            onPress={() => navigation.navigate('FollowUps')}
            activeOpacity={0.8}
          >
            {/* AVATAR */}
            <View style={[styles.followUpAvatar, { backgroundColor: item.avatarBg }]}>
              <Text style={[styles.followUpAvatarText, { color: item.avatarColor }]}>
                {item.initials}
              </Text>
            </View>

            {/* PATIENT INFO */}
            <View style={styles.followUpCardInfo}>
              <Text style={styles.followUpPatientName}>{item.patient}</Text>
              <Text style={[styles.followUpSubtitle, { color: item.subtitleColor }]}>
                {item.subtitle}
              </Text>
            </View>

            {/* BOOK */}
            <TouchableOpacity
              onPress={() => navigation.navigate('FollowUps')}
              activeOpacity={0.7}
            >
              <Text style={styles.followUpBookText}>Book</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* ======================================================
          BRAND BANNER (WHITE OPEN FIELD SHAPE)
      ======================================================= */}
      <View style={styles.brandBannerContainer}>
        <View style={styles.brandBannerCard}>
          <View style={styles.brandBannerHeaderRow}>
            <Logo size={28} />
            <Text style={styles.brandBannerTitle}>
              Go for <Text style={styles.brandBannerTitleNavy}>MediUnify</Text>
            </Text>
          </View>
          <Text style={styles.brandBannerTagline}>
            "Connecting Care, Empowering Health"
          </Text>
        </View>
      </View>

      <View style={{ height: 24 }} />

    </ScrollView>
  );
}


/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({

  /* ==========================================================
     HEADER (DARK NAVY THEME MATCHING UI DESIGN)
  ========================================================== */

  header: {
    backgroundColor: '#061A3A',

    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + 12
        : 52,

    paddingBottom: 48,
    paddingHorizontal: spacing.lg,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  brandMedi: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  brandUnify: {
    color: '#00B894',
    fontWeight: '800',
  },

  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#00B894',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#061A3A',
  },

  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  greetingBlock: {
    marginTop: 18,
  },

  greetingSub: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },

  greetingName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },

  locationText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },

  /* ==========================================================
     NEXT APPOINTMENT CARD
  ========================================================== */

  nextApptContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: -36,
    marginBottom: 6,
    zIndex: 10,
  },

  nextApptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },

  nextApptTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  nextApptBadgeTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#00897B',
  },

  nextApptTimePill: {
    backgroundColor: '#E6FAF6',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
  },

  nextApptTimePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00897B',
  },

  nextApptPatientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },

  nextApptAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8EEF8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextApptAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#071E42',
  },

  nextApptInfo: {
    flex: 1,
    marginLeft: 12,
  },

  nextApptName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#071E42',
  },

  nextApptMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },

  nextApptActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },

  nextApptJoinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#EEF4FC',
  },

  nextApptJoinText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },

  nextApptFileBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#EEF4FC',
  },

  nextApptFileText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071E42',
  },


  /* ==========================================================
     TODAY APPOINTMENTS HEADER
  ========================================================== */

  todayAppointmentsHeader: {
    paddingHorizontal: spacing.lg,

    marginTop: 4,

    marginBottom: 4,
  },


  todayAppointmentsTitle: {
    ...typography.h3,
    color: '#071E42',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },


  /* ==========================================================
     SUMMARY COUNT CARDS
  ========================================================== */

  summarySection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    gap: 12,
  },

  summaryCard: {
    flex: 1,
    minHeight: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryCount: {
    fontSize: 26,
    fontWeight: '700',
    color: '#071E42',
    lineHeight: 30,
    marginBottom: 2,
  },

  summaryLabel: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },

  summaryCardNavy: {
    flex: 1,
    minHeight: 80,
    backgroundColor: '#071E42',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#071E42',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryCountNavy: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 30,
    marginBottom: 2,
  },

  summaryLabelNavy: {
    fontSize: 13.5,
    color: '#00B894',
    textAlign: 'center',
    fontWeight: '600',
  },


  /* ==========================================================
     IN-PERSON & VIDEO CONSULTATION MODE CARDS
  ========================================================== */

  consultModeContainer: {
    flexDirection: 'row',

    paddingHorizontal: spacing.lg,

    marginTop: spacing.lg,

    gap: 12,
  },


  consultModeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },

  consultModeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  consultModeInfo: {
    flex: 1,
  },

  consultModeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#071E42',
  },

  consultModeSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },

  consultModeArrow: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },


  /* ==========================================================
     QUICK ACTIONS TITLE
  ========================================================== */

  quickActionsHeader: {
    paddingHorizontal: spacing.lg,

    marginTop: 10,

    marginBottom: spacing.sm,
  },


  quickActionsTitle: {
    ...typography.h3,

    color: colors.textPrimary,

    fontSize: 17,
  },


  /* ==========================================================
     QUICK ACTION GRID
  ========================================================== */

  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    rowGap: 14,
  },

  navCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    minHeight: 30,
  },

  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A1E3F',
    flex: 1,
    marginRight: 4,
  },

  navyArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Real Image Container for Quick Action Cards */
  quickImageContainer: {
    height: 98,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },

  quickImage: {
    width: '100%',
    height: '100%',
  },

  /* Appointments Illustration */
  calWrapper: {
    width: 78,
    height: 58,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
  },

  calRing: {
    position: 'absolute',
    top: -3,
    width: 4,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#00B894',
    zIndex: 10,
  },

  calHeader: {
    height: 14,
    backgroundColor: '#132847',
  },

  calBody: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
    justifyContent: 'space-around',
  },

  calRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  calDot: {
    width: 5.5,
    height: 5.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },

  calCheckDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clockCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 3.5,
    borderColor: '#071E42',
    position: 'absolute',
    right: 8,
    bottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clockCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#071E42',
    position: 'absolute',
  },

  clockHandHour: {
    width: 2.2,
    height: 9.5,
    backgroundColor: '#071E42',
    borderRadius: 1,
    position: 'absolute',
    top: 5.5,
  },

  clockHandMin: {
    width: 2.2,
    height: 10.5,
    backgroundColor: '#071E42',
    borderRadius: 1,
    position: 'absolute',
    top: 11,
    left: 15,
    transform: [{ rotate: '55deg' }],
  },

  /* Patients Follow-up Illustration */
  followUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarCard: {
    width: 44,
    height: 50,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
    overflow: 'hidden',
  },

  avatarHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 2,
  },

  avatarBody: {
    width: 30,
    height: 13,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  syncBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#071E42',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginHorizontal: -8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  /* Direct Patient Illustration */
  directPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  directAvatarBox: {
    position: 'relative',
    alignItems: 'center',
  },

  directHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#071E42',
    marginBottom: 2,
  },

  directBody: {
    width: 42,
    height: 20,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    backgroundColor: '#071E42',
  },

  plusBadge: {
    position: 'absolute',
    top: -1,
    right: -4,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EAF7F4',
  },

  docCard: {
    width: 56,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 6,
    justifyContent: 'space-between',
  },

  docLineHeader: {
    height: 4.5,
    width: '65%',
    backgroundColor: '#071E42',
    borderRadius: 2,
  },

  docLineBody: {
    height: 3,
    width: '85%',
    backgroundColor: '#CBD5E1',
    borderRadius: 1.5,
  },

  docPillButton: {
    height: 7,
    width: 20,
    backgroundColor: '#00B894',
    borderRadius: 3.5,
  },

  /* Availability Illustration */
  availCard: {
    width: '92%',
    height: 64,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: 'space-between',
  },

  availHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  availDayText: {
    fontSize: 7.5,
    fontWeight: '600',
    color: '#64748B',
    width: 19,
    textAlign: 'center',
  },

  availSlotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  availPill: {
    width: 19,
    height: 8.5,
    borderRadius: 4.25,
  },


  /* ==========================================================
     TODAY'S APPOINTMENTS
  ========================================================== */

  section: {
    paddingHorizontal: spacing.lg,

    marginTop: spacing.xl,
  },


  sectionHeaderRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: spacing.md,
  },


  sectionTitle: {
    ...typography.h3,

    color: colors.textPrimary,
  },


  /* ==========================================================
     APPOINTMENT CARD
  ========================================================== */

  apptCard: {
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },


  apptRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },


  apptAvatar: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor:
      colors.primarySurface,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1.2,

    borderColor:
      colors.primaryLight,
  },


  apptAvatarText: {
    ...typography.h3,

    color: colors.primary,
  },


  apptInfo: {
    flex: 1,

    marginLeft: 12,

    marginRight: 8,
  },


  apptName: {
    ...typography.bodyBold,

    color: colors.textPrimary,
  },


  apptMeta: {
    ...typography.small,

    color: colors.textSecondary,

    marginTop: 2,
  },

  /* ==========================================================
     PATIENT FOLLOW-UPS WIDGET (MATCHING USER SCREENSHOT)
  ========================================================== */
  followUpSection: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  followUpHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  followUpTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followUpBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  followUpBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  followUpSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#071E42',
  },
  followUpViewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D9488',
  },
  followUpPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  followUpPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EEF2F6',
  },
  followUpPillActive: {
    backgroundColor: '#071E42',
  },
  followUpPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#071E42',
  },
  followUpPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  followUpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  followUpAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  followUpAvatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  followUpCardInfo: {
    flex: 1,
  },
  followUpPatientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  followUpSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  followUpBookText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#CBD5E1',
    paddingLeft: 12,
  },

  /* ==========================================================
     BRAND BANNER (WHITE OPEN FIELD SHAPE)
  ========================================================== */
  brandBannerContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  brandBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  brandBannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  brandBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#071E42',
    letterSpacing: 0.2,
  },
  brandBannerTitleNavy: {
    color: '#071E42',
    fontWeight: '800',
  },
  brandBannerTagline: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },

});

