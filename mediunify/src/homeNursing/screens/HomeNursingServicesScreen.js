import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeNursingHeader from '../components/HomeNursingHeader';
import { useHomeNursing } from '../context/HomeNursingContext';
import { radius } from '../../theme/colors';

export default function HomeNursingServicesScreen({ navigation }) {
  const {
    assignments,
    upcomingServices,
    activeAssignment,
    acceptAssignment,
  } = useHomeNursing();

  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'upcoming'

  const handleAccept = (item) => {
    acceptAssignment(item.id);
    Alert.alert(
      'Assignment Accepted',
      `You accepted assignment ${item.id} for ${item.patientName}. Proceeding to Live Service Status.`,
      [
        {
          text: 'Open Status & Map',
          onPress: () =>
            navigation.navigate('HomeNursingServiceStatus', { assignmentId: item.id }),
        },
        { text: 'OK' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071E42" />

      {/* TOP BRAND HEADER */}
      <HomeNursingHeader
        navigation={navigation}
        showBack={false}
        title="Nursing Services"
        subtitle="Manage assigned patient visits and upcoming schedule"
      />

      <View style={styles.container}>
        {/* TABS (Assigned vs Upcoming) */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'assigned' && styles.tabBtnActive]}
            onPress={() => setActiveTab('assigned')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'assigned' && styles.tabBtnTextActive,
              ]}
            >
              New Assigned ({assignments.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'upcoming' && styles.tabBtnTextActive,
              ]}
            >
              Upcoming ({upcomingServices.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'assigned' ? (
            assignments.length > 0 ? (
              assignments.map((item) => (
                <View key={item.id} style={styles.serviceCard}>
                  {/* HEADER */}
                  <View style={styles.cardHeader}>
                    <View style={styles.serviceIconWrap}>
                      <Ionicons name="medkit" size={20} color="#00B894" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.serviceTitle}>{item.service}</Text>
                      <Text style={styles.assignmentIdText}>
                        Ref: {item.id} · Assigned {item.assignedAgo || 'Recently'}
                      </Text>
                    </View>
                    <View style={styles.badgeWrap}>
                      <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                  </View>

                  {/* PATIENT INFO */}
                  <View style={styles.patientRow}>
                    <Ionicons name="person-outline" size={15} color="#08317C" />
                    <Text style={styles.patientNameText}>
                      {item.patientName} ({item.patientAge} yrs, {item.patientGender})
                    </Text>
                  </View>

                  {/* DATE & TIME */}
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={15} color="#64748B" />
                    <Text style={styles.infoText}>{item.dateTime}</Text>
                  </View>

                  {/* LOCATION */}
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={15} color="#64748B" />
                    <Text style={styles.infoText}>
                      {item.location} ({item.distance} · {item.eta})
                    </Text>
                  </View>

                  {/* INSTRUCTIONS */}
                  <View style={styles.instructionSnippet}>
                    <Text style={styles.instructionLabel}>Notes: </Text>
                    <Text style={styles.instructionText} numberOfLines={2}>
                      {item.instructions}
                    </Text>
                  </View>

                  {/* BUTTONS */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.viewDetailsBtn}
                      onPress={() =>
                        navigation.navigate('HomeNursingAssignmentDetail', {
                          assignmentId: item.id,
                        })
                      }
                      activeOpacity={0.75}
                    >
                      <Text style={styles.viewDetailsBtnText}>View Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.acceptServiceBtn}
                      onPress={() => handleAccept(item)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.acceptServiceBtnText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyWrap}>
                <Ionicons name="checkmark-done-circle-outline" size={40} color="#00B894" />
                <Text style={styles.emptyTitle}>No pending assignments</Text>
                <Text style={styles.emptySubtitle}>
                  You are all caught up! New requests will appear here when assigned by admin.
                </Text>
              </View>
            )
          ) : upcomingServices.length > 0 ? (
            upcomingServices.map((item) => (
              <View key={item.id} style={styles.serviceCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.serviceIconWrap, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="calendar" size={20} color="#0284C7" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.serviceTitle}>{item.service}</Text>
                    <Text style={styles.assignmentIdText}>Ref: {item.id}</Text>
                  </View>
                  <View style={[styles.badgeWrap, { backgroundColor: '#E0F2FE' }]}>
                    <Text style={[styles.badgeText, { color: '#0284C7' }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.patientRow}>
                  <Ionicons name="person-outline" size={15} color="#08317C" />
                  <Text style={styles.patientNameText}>
                    {item.patientName} ({item.patientAge} yrs, {item.patientGender})
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={15} color="#64748B" />
                  <Text style={styles.infoText}>{item.dateTime}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={15} color="#64748B" />
                  <Text style={styles.infoText}>
                    {item.location} · {item.distance}
                  </Text>
                </View>

                <View style={styles.upcomingNoteRow}>
                  <Ionicons name="notifications-outline" size={14} color="#0284C7" />
                  <Text style={styles.upcomingNoteText}>
                    Reminder will be triggered 1 hour prior to appointment
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyWrap}>
              <Ionicons name="calendar-outline" size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No upcoming services</Text>
              <Text style={styles.emptySubtitle}>
                Accepted future services will be listed here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#071E42',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 14,
  },

  /* Card */
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.2,
  },
  assignmentIdText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  badgeWrap: {
    backgroundColor: '#E6FAF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B894',
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  patientNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#08317C',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12.5,
    color: '#64748B',
  },
  instructionSnippet: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  instructionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#08317C',
  },
  instructionText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewDetailsBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#08317C',
  },
  acceptServiceBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptServiceBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Upcoming Note */
  upcomingNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 12,
    marginTop: 6,
    gap: 6,
  },
  upcomingNoteText: {
    fontSize: 11.5,
    color: '#0284C7',
    fontWeight: '600',
    flex: 1,
  },

  /* Empty */
  emptyWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
