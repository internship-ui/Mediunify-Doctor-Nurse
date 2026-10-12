import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeNursingHeader from '../components/HomeNursingHeader';
import MapRoutePreview from '../components/MapRoutePreview';
import { useHomeNursing } from '../context/HomeNursingContext';
import { radius } from '../../theme/colors';

export default function HomeNursingAssignmentDetailScreen({ route, navigation }) {
  const { assignmentId } = route.params || { assignmentId: 'NS-2041' };
  const { assignments, acceptAssignment } = useHomeNursing();

  const assignment =
    assignments.find((a) => a.id === assignmentId) || assignments[0] || {
      id: 'NS-2041',
      service: 'Wound dressing',
      patientName: 'Priya Sharma',
      patientAge: 28,
      patientGender: 'Female',
      patientPhone: '+91 98860 12345',
      dateTime: 'Today, 4:00 PM',
      location: '12th Main, Indiranagar',
      distance: '3.2 km',
      eta: 'about 14 min',
      assignedAgo: '10 min ago',
      instructions:
        'Dressing change on left forearm. Carry sterile kit. Ask for door code on arrival.',
      status: 'Assigned',
    };

  const handleCallPatient = () => {
    Alert.alert(
      `Call Patient`,
      `Dialing ${assignment.patientName} (${assignment.patientPhone})...`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${assignment.patientPhone}`).catch(() => {}),
        },
      ]
    );
  };

  const handleCallAdmin = () => {
    Alert.alert(
      'Call Admin Desk',
      'Dialing Home Nursing Admin Dispatch (+91 80 4567 8900)...',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+918045678900').catch(() => {}),
        },
      ]
    );
  };

  const handleAcceptAssignment = () => {
    acceptAssignment(assignment.id);
    // Direct transition to Service Status Screen (matching Main Nurse Flow)
    navigation.navigate('HomeNursingServiceStatus', {
      assignmentId: assignment.id,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071E42" />

      {/* TOP BRAND HEADER */}
      <HomeNursingHeader
        navigation={navigation}
        showBack={true}
        title={`Assignment ${assignment.id}`}
        subtitle={`Assigned by admin · ${assignment.assignedAgo || '10 min ago'}`}
        patientPhone={assignment.patientPhone}
        patientName={assignment.patientName}
        rightElement={
          <View style={styles.assignedBadgeHeader}>
            <Text style={styles.assignedBadgeHeaderText}>{assignment.status}</Text>
          </View>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PATIENT INFO CARD */}
        <View style={styles.card}>
          <View style={styles.patientHeaderRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>
                {assignment.patientName.slice(0, 2).toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.patientName}>{assignment.patientName}</Text>
              <Text style={styles.patientMeta}>
                {assignment.patientAge} yrs · {assignment.patientGender}
              </Text>
            </View>

            {/* CALL PATIENT BUTTON */}
            <TouchableOpacity
              style={styles.callPatientBtn}
              onPress={handleCallPatient}
              activeOpacity={0.75}
            >
              <Ionicons name="call" size={17} color="#08317C" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* REQUIRED NURSING SERVICE */}
          <View style={styles.detailItemRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="medkit" size={18} color="#00B894" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.detailLabel}>Required nursing service</Text>
              <Text style={styles.detailValue}>{assignment.service}</Text>
            </View>
          </View>

          {/* DATE AND TIME */}
          <View style={[styles.detailItemRow, { marginTop: 14 }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar" size={18} color="#00B894" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.detailLabel}>Date and time</Text>
              <Text style={styles.detailValue}>{assignment.dateTime}</Text>
            </View>
          </View>
        </View>

        {/* MAP PREVIEW CARD */}
        <MapRoutePreview
          location={assignment.location}
          distance={assignment.distance}
          eta={assignment.eta}
        />

        {/* SERVICE INSTRUCTIONS */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>SERVICE INSTRUCTIONS</Text>
          <Text style={styles.instructionsBody}>{assignment.instructions}</Text>
        </View>

        {/* BOTTOM ACTION BUTTONS */}
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.callAdminBtn}
            onPress={handleCallAdmin}
            activeOpacity={0.8}
          >
            <Ionicons name="headset-outline" size={16} color="#08317C" style={{ marginRight: 6 }} />
            <Text style={styles.callAdminBtnText}>Call admin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptAssignmentBtn}
            onPress={handleAcceptAssignment}
            activeOpacity={0.88}
          >
            <Text style={styles.acceptAssignmentBtnText}>Accept assignment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071E42',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  assignedBadgeHeader: {
    backgroundColor: 'rgba(0, 184, 148, 0.25)',
    borderWidth: 1,
    borderColor: '#00B894',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedBadgeHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7FE3D4',
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  patientHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
  },
  patientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.2,
  },
  patientMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  callPatientBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#08317C',
    marginTop: 1,
  },

  /* Service Instructions Card */
  instructionsCard: {
    backgroundColor: '#E6FAF6',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#7FE3D4',
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#008F7A',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  instructionsBody: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#064E3B',
    fontWeight: '600',
  },

  /* Bottom Actions Bar */
  actionsBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  callAdminBtn: {
    flex: 1,
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.2,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callAdminBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#08317C',
  },
  acceptAssignmentBtn: {
    flex: 1.4,
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: '#08317C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#08317C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptAssignmentBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
