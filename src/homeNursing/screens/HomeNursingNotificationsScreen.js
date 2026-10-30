import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeNursingHeader from '../components/HomeNursingHeader';
import { useHomeNursing } from '../context/HomeNursingContext';

const FILTERS = ['All', 'Assignments', 'Schedule', 'Admin'];

export default function HomeNursingNotificationsScreen({ navigation }) {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useHomeNursing();

  const [activeFilter, setActiveFilter] = useState('All');

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Assignments') return item.type === 'assignment';
    if (activeFilter === 'Schedule') return item.type === 'schedule';
    if (activeFilter === 'Admin') return item.type === 'admin';
    return true;
  });

  const handleNotificationPress = (item) => {
    markNotificationRead(item.id);
    if (item.assignmentId) {
      navigation.navigate('HomeNursingAssignmentDetail', {
        assignmentId: item.assignmentId,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#071E42" />

      {/* TOP BRAND HEADER */}
      <HomeNursingHeader
        navigation={navigation}
        showBack={true}
        title="Notifications"
        rightElement={
          <TouchableOpacity
            onPress={markAllNotificationsRead}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.markAllReadText}>Mark all read</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {/* FILTER CATEGORY PILLS */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const isSelected = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* NOTIFICATIONS LIST */}
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notifCard,
                  !notif.read && styles.notifCardUnread,
                ]}
                onPress={() => handleNotificationPress(notif)}
                activeOpacity={0.8}
              >
                {/* ICON IN COLORED CIRCLE */}
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: notif.iconBg || '#E6FAF6' },
                  ]}
                >
                  <Ionicons
                    name={notif.icon || 'notifications'}
                    size={20}
                    color={notif.iconColor || '#00B894'}
                  />
                </View>

                {/* TEXT CONTENT */}
                <View style={styles.notifContent}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifBody}>{notif.body}</Text>
                </View>

                {/* TIME & UNREAD PIN */}
                <View style={styles.notifMetaColumn}>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                  {!notif.read && <View style={styles.unreadDot} />}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={38} color="#94A3B8" />
              <Text style={styles.emptyStateTitle}>No notifications</Text>
              <Text style={styles.emptyStateSubtitle}>
                You're completely up to date.
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
  markAllReadText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00B894',
  },

  /* Filters */
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: '#071E42',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  /* Scroll List */
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 36,
    gap: 12,
  },

  /* Card */
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  notifCardUnread: {
    borderColor: '#BAE6FD',
    backgroundColor: '#FBFDFF',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: -0.2,
  },
  notifBody: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 17,
  },
  notifMetaColumn: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  notifTime: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B894',
    marginTop: 6,
  },

  /* Empty */
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 10,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
});
