import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHomeNursing } from '../../homeNursing/context/HomeNursingContext';

export default function NurseNotificationsPage({ setActiveTab }) {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
  } = useHomeNursing();

  const [filter, setFilter] = useState('All');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'All') return true;
    if (filter === 'Assignments') return n.type === 'assignment';
    if (filter === 'Schedule') return n.type === 'schedule';
    if (filter === 'Admin') return n.type === 'admin';
    return true;
  });

  const handleActionClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.type === 'assignment') {
      if (setActiveTab) setActiveTab('services');
    } else if (notif.type === 'schedule') {
      if (setActiveTab) setActiveTab('schedule');
    } else if (notif.type === 'admin') {
      if (setActiveTab) setActiveTab('profile');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Notifications & Broadcasts</Text>
          <Text style={styles.pageSubtitle}>
            Assignment alerts, schedule updates, admin announcements and reminders
          </Text>
        </View>

        {unreadNotificationsCount > 0 && (
          <TouchableOpacity
            style={styles.markAllBtn}
            onPress={markAllNotificationsRead}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-done" size={15} color="#081E3E" />
            <Text style={styles.markAllBtnText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['All', 'Assignments', 'Schedule', 'Admin'].map((tab) => {
          const isActive = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFilter(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notifications List */}
      <View style={styles.notifList}>
        {filteredNotifs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyText}>No notifications found in {filter}</Text>
          </View>
        ) : (
          filteredNotifs.map((notif) => {
            const isUnread = !notif.read;
            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, isUnread && styles.notifCardUnread]}
                onPress={() => markNotificationRead(notif.id)}
                activeOpacity={0.88}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: notif.iconBg || (isUnread ? '#E8F8F5' : '#F1F5F9') },
                  ]}
                >
                  <Ionicons
                    name={notif.icon || 'notifications'}
                    size={20}
                    color={notif.iconColor || (isUnread ? '#00B894' : '#64748B')}
                  />
                </View>

                <View style={styles.metaCol}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.notifTitle, isUnread && styles.notifTitleUnread]}>
                      {notif.title}
                    </Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                  <Text style={styles.notifBody}>{notif.body}</Text>
                </View>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleActionClick(notif)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>
                    {notif.type === 'assignment'
                      ? 'View Service →'
                      : notif.type === 'schedule'
                      ? 'View Shifts →'
                      : 'Details →'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    padding: 24,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#081E3E',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  markAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081E3E',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#081E3E',
    borderColor: '#081E3E',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  notifList: {
    gap: 10,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 40,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifCardUnread: {
    borderColor: '#00B894',
    backgroundColor: '#FAFCFC',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaCol: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  notifTitleUnread: {
    fontWeight: '800',
    color: '#081E3E',
  },
  notifTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  notifBody: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081E3E',
  },
});
