import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHomeNursing } from '../../homeNursing/context/HomeNursingContext';

export default function NurseTopNavbar({
  activeTab = 'dashboard',
  setActiveTab,
  onNavigateHome,
  onOpenNotifications,
}) {
  const {
    currentStatus,
    setCurrentStatus,
    nurseProfile,
    unreadNotificationsCount,
  } = useHomeNursing();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');

  const isOnline = currentStatus !== 'Off duty';

  const handleSetStatus = (status) => {
    setCurrentStatus(status);
  };

  // Search Items Dataset
  const searchDataset = [
    {
      category: 'Patients',
      title: 'Priya Sharma (28 yrs, Female)',
      subtitle: '12th Main, Indiranagar • Wound dressing at 4:00 PM',
      icon: 'person',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      tag: 'Today Assignment',
      targetTab: 'services',
    },
    {
      category: 'Patients',
      title: 'Andre Merritt (27 yrs, Male)',
      subtitle: 'Koramangala 4th Block • Cardiac vitals & medication review',
      icon: 'person',
      iconBg: '#ECFDF5',
      iconColor: '#059669',
      tag: 'Completed Visit',
      targetTab: 'services',
    },
    {
      category: 'Patients',
      title: 'Suresh Iyer (62 yrs, Male)',
      subtitle: 'Domlur Layout • Post-operative surgical drain inspection',
      icon: 'person',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      tag: 'Tomorrow Visit',
      targetTab: 'schedule',
    },
    {
      category: 'Services',
      title: 'Wound Dressing & Sterile Bandage',
      subtitle: 'Fee: ₹500 • Duration: 45 min • Indiranagar Hub',
      icon: 'bandage-outline',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      tag: 'Care Service',
      targetTab: 'services',
    },
    {
      category: 'Services',
      title: 'IV Infusion & Medication Administration',
      subtitle: 'Fee: ₹450 • Duration: 30 min • Certified Nurse Duty',
      icon: 'medkit-outline',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE',
      tag: 'Care Service',
      targetTab: 'services',
    },
    {
      category: 'Assignments',
      title: 'Indiranagar Cluster #4 Service Dispatch',
      subtitle: 'Assigned: Today, 4:00 PM • Token #DISP-77401',
      icon: 'navigate-outline',
      iconBg: '#E0E7FF',
      iconColor: '#3730A3',
      tag: 'Dispatch Order',
      targetTab: 'services',
    },
    {
      category: 'Assignments',
      title: 'Weekly Duty Schedule & Working Hours',
      subtitle: 'Monday - Saturday: 8:00 AM - 6:00 PM • Base Hub #3',
      icon: 'calendar-outline',
      iconBg: '#CCFBF1',
      iconColor: '#0D9488',
      tag: 'Schedule Calendar',
      targetTab: 'schedule',
    },
  ];

  const filteredSearchItems = searchDataset.filter((item) => {
    const matchesCategory = searchCategory === 'All' || item.category === searchCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // Notifications dataset
  const [notifItems, setNotifItems] = useState([
    {
      id: 'notif-1',
      section: 'NEW',
      userName: 'Maria Ryan',
      actionText: 'added you to the folder',
      targetName: 'Web App Designs 2019',
      timestamp: 'Today at 12:28 PM',
      avatarInitials: 'MR',
      avatarBg: '#FDE68A',
      avatarTextColor: '#92400E',
      badgeType: 'folder',
      badgeColor: '#0284C7',
      hasActions: true,
      status: 'pending',
    },
    {
      id: 'notif-2',
      section: 'NEW',
      userName: 'Clifford Larson',
      actionText: 'invited you to the folder',
      targetName: 'EMEA Major Deal Close Plans',
      timestamp: 'Yesterday at 5:15 PM',
      avatarInitials: 'CL',
      avatarBg: '#FECDD3',
      avatarTextColor: '#9F1239',
      badgeType: 'folder',
      badgeColor: '#0284C7',
      hasActions: true,
      status: 'pending',
    },
    {
      id: 'notif-3',
      section: 'NEW',
      userName: 'Benjamin Bortles',
      actionText: 'added you to',
      targetName: 'Web App Concepts 2018.pdf',
      timestamp: 'Oct 2 at 3:13 PM',
      avatarInitials: 'BB',
      avatarBg: '#0A2540',
      avatarTextColor: '#FFFFFF',
      badgeType: 'pdf',
      badgeColor: '#DC2626',
      hasActions: false,
      status: 'read',
    },
    {
      id: 'notif-4',
      section: 'EARLIER',
      userName: 'Amal Shah',
      actionText: 'added you to',
      targetName: 'Enterprise Corporation Contracts.pdf',
      timestamp: 'Sep 20 at 3:13 PM',
      avatarInitials: 'AS',
      avatarBg: '#0A2540',
      avatarTextColor: '#FFFFFF',
      badgeType: 'pdf',
      badgeColor: '#DC2626',
      hasActions: false,
      status: 'read',
    },
    {
      id: 'notif-5',
      section: 'EARLIER',
      userName: 'Roger Sly',
      actionText: 'mentioned you in a comment on',
      targetName: 'Product OKR FY19.docx',
      commentPreview: 'Hey @Tina Laungani This looks great. Thanks!',
      timestamp: 'Sep 20 at 3:13 PM',
      avatarInitials: 'RS',
      avatarBg: '#FEF08A',
      avatarTextColor: '#854D0E',
      badgeType: 'comment',
      badgeColor: '#0284C7',
      hasActions: false,
      status: 'read',
    },
  ]);

  const handleAcceptInvite = (id) => {
    setNotifItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'accepted' } : item))
    );
  };

  const handleDeclineInvite = (id) => {
    setNotifItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'declined' } : item))
    );
  };

  const getHeaderTitle = () => {
    if (!activeTab || activeTab === 'dashboard' || activeTab === 'home') {
      return 'Dashboard';
    }
    if (activeTab === 'schedule' || activeTab === 'availability') {
      return 'Schedule';
    }
    if (activeTab === 'profile') {
      return 'My Profile';
    }
    if (activeTab === 'services') {
      return 'Services';
    }
    if (activeTab === 'history') {
      return 'History';
    }
    if (activeTab === 'email' || activeTab === 'mail' || activeTab === 'messages') {
      return 'Email & Messages';
    }
    return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  const getHeaderSubtitle = () => {
    if (!activeTab || activeTab === 'dashboard' || activeTab === 'home') {
      return "Let's check your update today";
    }
    if (activeTab === 'schedule' || activeTab === 'availability') {
      return 'Manage your work timings, breaks and calendar';
    }
    if (activeTab === 'profile') {
      return 'Personal, professional and clinical credentials';
    }
    if (activeTab === 'services') {
      return 'Active doorstep visits, assignments and care duties';
    }
    if (activeTab === 'email' || activeTab === 'mail' || activeTab === 'messages') {
      return 'Hospital notices, doctor instructions and dispatch communications';
    }
    return 'Home Care & Nursing Management';
  };

  const newItems = notifItems.filter((item) => item.section === 'NEW');
  const earlierItems = notifItems.filter((item) => item.section === 'EARLIER');

  return (
    <View style={styles.topbar}>
      {/* Click-outside backdrop for closing notifications popover */}
      {showNotificationsPopover && (
        <TouchableOpacity
          style={styles.popoverBackdrop}
          activeOpacity={1}
          onPress={() => setShowNotificationsPopover(false)}
        />
      )}

      {/* Click-outside backdrop for closing profile dropdown */}
      {showProfileDropdown && (
        <TouchableOpacity
          style={styles.popoverBackdrop}
          activeOpacity={1}
          onPress={() => setShowProfileDropdown(false)}
        />
      )}

      {/* Left: Title and Subtitle */}
      <View style={styles.headerTitleCol}>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <Text style={styles.headerSubtitle}>{getHeaderSubtitle()}</Text>
      </View>

      {/* Right Actions: Online/Offline Toggle Switch, Search, Mail, Notifications, Profile Circle */}
      <View style={styles.actionsRight}>
        {/* ============================================================== */}
        {/* 1. TOP ONLINE / OFFLINE TOGGLE SWITCH SLIDER BUTTON             */}
        {/* ============================================================== */}
        <View style={styles.topToggleWrap}>
          <Text
            style={[
              styles.topToggleLabel,
              isOnline ? styles.topToggleLabelOnline : styles.topToggleLabelOffline,
            ]}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <TouchableOpacity
            style={[
              styles.toggleSwitchTrack,
              isOnline ? styles.toggleSwitchTrackOnline : styles.toggleSwitchTrackOffline,
            ]}
            onPress={() => handleSetStatus(isOnline ? 'Off duty' : 'Available')}
            activeOpacity={0.85}
            accessibilityRole="switch"
            accessibilityState={{ checked: isOnline }}
          >
            <View
              style={[
                styles.toggleSwitchThumb,
                isOnline ? styles.toggleSwitchThumbOnline : styles.toggleSwitchThumbOffline,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* ============================================================== */}
        {/* 2. SEARCH BUTTON (TRIGGERS POP-UP SEARCH BAR)                  */}
        {/* ============================================================== */}
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => setShowSearchModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={19} color="#1E293B" />
        </TouchableOpacity>

        {/* ============================================================== */}
        {/* 3. EMAIL BUTTON (DIRECTS TO EMAIL PAGE)                        */}
        {/* ============================================================== */}
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => {
            if (setActiveTab) setActiveTab('email');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="mail-outline" size={19} color="#1E293B" />
        </TouchableOpacity>

        {/* ============================================================== */}
        {/* 4. NOTIFICATION BELL WITH SCREENSHOT-MATCHING POPOVER          */}
        {/* ============================================================== */}
        <View style={{ position: 'relative', zIndex: 99999 }}>
          <TouchableOpacity
            style={[
              styles.headerIconBtn,
              showNotificationsPopover && styles.headerIconBtnActive,
            ]}
            onPress={() => {
              setShowNotificationsPopover(!showNotificationsPopover);
              setShowProfileDropdown(false);
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={showNotificationsPopover ? 'notifications' : 'notifications-outline'}
              size={20}
              color={showNotificationsPopover ? '#0062E0' : '#1E293B'}
            />
            {unreadNotificationsCount > 0 && !showNotificationsPopover && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* NOTIFICATIONS DROPDOWN POPOVER */}
          {showNotificationsPopover && (
            <View style={styles.notifDropdownCard}>
              <View style={styles.notifHeaderRow}>
                <Text style={styles.notifHeaderTitle}>Notifications</Text>
              </View>

              <ScrollView style={styles.notifScrollList} showsVerticalScrollIndicator={false}>
                {/* NEW SECTION */}
                <Text style={styles.notifSectionTitle}>NEW</Text>
                {newItems.map((item, idx) => (
                  <View key={item.id}>
                    <View style={styles.notifItemRow}>
                      <View style={styles.avatarWithBadgeWrap}>
                        <View style={[styles.notifAvatarCircle, { backgroundColor: item.avatarBg }]}>
                          <Text style={[styles.notifAvatarText, { color: item.avatarTextColor }]}>
                            {item.avatarInitials}
                          </Text>
                        </View>
                        <View style={[styles.avatarSubBadge, { backgroundColor: item.badgeColor }]}>
                          {item.badgeType === 'folder' ? (
                            <Ionicons name="folder" size={9} color="#FFFFFF" />
                          ) : item.badgeType === 'pdf' ? (
                            <Ionicons name="document-text" size={9} color="#FFFFFF" />
                          ) : (
                            <Ionicons name="chatbubble" size={9} color="#FFFFFF" />
                          )}
                        </View>
                      </View>

                      <View style={styles.notifContentCol}>
                        <Text style={styles.notifMainText}>
                          <Text style={styles.notifBoldText}>{item.userName}</Text>{' '}
                          {item.actionText}{' '}
                          <Text style={styles.notifBoldText}>{item.targetName}</Text>
                        </Text>
                        <Text style={styles.notifTimestamp}>{item.timestamp}</Text>

                        {item.hasActions && (
                          <View style={styles.actionsBtnRow}>
                            {item.status === 'pending' ? (
                              <>
                                <TouchableOpacity
                                  style={styles.acceptBtn}
                                  onPress={() => handleAcceptInvite(item.id)}
                                  activeOpacity={0.85}
                                >
                                  <Text style={styles.acceptBtnText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.declineBtn}
                                  onPress={() => handleDeclineInvite(item.id)}
                                  activeOpacity={0.85}
                                >
                                  <Text style={styles.declineBtnText}>Decline</Text>
                                </TouchableOpacity>
                              </>
                            ) : item.status === 'accepted' ? (
                              <View style={styles.statusBadgeAccepted}>
                                <Ionicons name="checkmark-circle" size={13} color="#059669" />
                                <Text style={styles.statusBadgeAcceptedText}>Accepted</Text>
                              </View>
                            ) : (
                              <View style={styles.statusBadgeDeclined}>
                                <Ionicons name="close-circle" size={13} color="#DC2626" />
                                <Text style={styles.statusBadgeDeclinedText}>Declined</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                    {idx < newItems.length - 1 && <View style={styles.notifItemDivider} />}
                  </View>
                ))}

                {/* EARLIER SECTION */}
                <View style={styles.sectionDividerGap} />
                <Text style={styles.notifSectionTitle}>EARLIER</Text>
                {earlierItems.map((item, idx) => (
                  <View key={item.id}>
                    <View style={styles.notifItemRow}>
                      <View style={styles.avatarWithBadgeWrap}>
                        <View style={[styles.notifAvatarCircle, { backgroundColor: item.avatarBg }]}>
                          <Text style={[styles.notifAvatarText, { color: item.avatarTextColor }]}>
                            {item.avatarInitials}
                          </Text>
                        </View>
                        <View style={[styles.avatarSubBadge, { backgroundColor: item.badgeColor }]}>
                          {item.badgeType === 'folder' ? (
                            <Ionicons name="folder" size={9} color="#FFFFFF" />
                          ) : item.badgeType === 'pdf' ? (
                            <Ionicons name="document-text" size={9} color="#FFFFFF" />
                          ) : (
                            <Ionicons name="chatbubble" size={9} color="#FFFFFF" />
                          )}
                        </View>
                      </View>

                      <View style={styles.notifContentCol}>
                        <Text style={styles.notifMainText}>
                          <Text style={styles.notifBoldText}>{item.userName}</Text>{' '}
                          {item.actionText}{' '}
                          <Text style={styles.notifBoldText}>{item.targetName}</Text>
                        </Text>
                        {item.commentPreview && (
                          <Text style={styles.notifCommentQuote}>{item.commentPreview}</Text>
                        )}
                        <Text style={styles.notifTimestamp}>{item.timestamp}</Text>
                      </View>
                    </View>
                    {idx < earlierItems.length - 1 && <View style={styles.notifItemDivider} />}
                  </View>
                ))}
                <View style={{ height: 16 }} />
              </ScrollView>
            </View>
          )}
        </View>

        {/* ============================================================== */}
        {/* 5. CIRCLE PROFILE (RK) WITH NAVIGATION DROPDOWN MENU           */}
        {/* Directs: My Profile -> Profile, Availability -> Schedule,       */}
        {/* Services -> Services on every page!                             */}
        {/* ============================================================== */}
        <View style={{ position: 'relative', zIndex: 99999 }}>
          <TouchableOpacity
            style={styles.avatarProfileBtn}
            onPress={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotificationsPopover(false);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitialsText}>RK</Text>
            </View>
            <Ionicons name="chevron-down" size={13} color="#64748B" />
          </TouchableOpacity>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <View style={styles.profileDropdownMenu}>
              {/* Nurse Summary */}
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownNameText}>
                  {nurseProfile?.fullName || 'Kavitha R'}
                </Text>
                <Text style={styles.dropdownRoleText}>Home Care Specialist</Text>
              </View>

              <View style={styles.dropdownDivider} />

              {/* Online/Offline Quick Toggle inside dropdown */}
              <View style={styles.dropdownStatusRow}>
                <Text style={styles.dropdownStatusLabel}>Duty Status</Text>
                <TouchableOpacity
                  style={[
                    styles.dutyToggleBtn,
                    isOnline ? styles.dutyToggleOnline : styles.dutyToggleOffline,
                  ]}
                  onPress={() => handleSetStatus(isOnline ? 'Off duty' : 'Available')}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.dutyDot,
                      isOnline ? styles.dutyDotOnline : styles.dutyDotOffline,
                    ]}
                  />
                  <Text
                    style={[
                      styles.dutyToggleText,
                      isOnline ? styles.dutyToggleTextOnline : styles.dutyToggleTextOffline,
                    ]}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dropdownDivider} />

              {/* 1. MY PROFILE -> DIRECTS TO PROFILE PAGE */}
              <TouchableOpacity
                style={styles.dropdownMenuItem}
                onPress={() => {
                  setShowProfileDropdown(false);
                  if (setActiveTab) setActiveTab('profile');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="person-outline" size={16} color="#0062E0" />
                <Text style={styles.dropdownMenuText}>My Profile</Text>
              </TouchableOpacity>

              {/* 2. AVAILABILITY -> DIRECTS TO SCHEDULE PAGE */}
              <TouchableOpacity
                style={styles.dropdownMenuItem}
                onPress={() => {
                  setShowProfileDropdown(false);
                  if (setActiveTab) setActiveTab('schedule');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={16} color="#00B894" />
                <Text style={styles.dropdownMenuText}>Availability</Text>
              </TouchableOpacity>

              {/* 3. SERVICES -> DIRECTS TO SERVICES PAGE */}
              <TouchableOpacity
                style={styles.dropdownMenuItem}
                onPress={() => {
                  setShowProfileDropdown(false);
                  if (setActiveTab) setActiveTab('services');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="bag-handle-outline" size={16} color="#8B5CF6" />
                <Text style={styles.dropdownMenuText}>Services</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* ============================================================== */}
      {/* POP-UP SEARCH BAR MODAL                                        */}
      {/* ============================================================== */}
      <Modal
        visible={showSearchModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.searchModalBackdrop}>
          <TouchableOpacity
            style={styles.searchModalDismissArea}
            activeOpacity={1}
            onPress={() => setShowSearchModal(false)}
          />

          <View style={styles.searchModalCard}>
            {/* Search Input Header */}
            <View style={styles.searchModalInputRow}>
              <Ionicons name="search" size={20} color="#0062E0" />
              <TextInput
                style={styles.searchModalTextInput}
                placeholder="Search patients, services, assignments, locations..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery ? (
                <TouchableOpacity
                  style={styles.searchClearBtn}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.searchCloseBtn}
                onPress={() => setShowSearchModal(false)}
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Category Filter Chips */}
            <View style={styles.searchFilterChipsRow}>
              {['All', 'Patients', 'Services', 'Assignments'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.searchCategoryChip,
                    searchCategory === cat && styles.searchCategoryChipActive,
                  ]}
                  onPress={() => setSearchCategory(cat)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.searchCategoryChipText,
                      searchCategory === cat && styles.searchCategoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Search Results List */}
            <ScrollView
              style={styles.searchResultsScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.searchSectionLabel}>
                {searchQuery ? 'SEARCH RESULTS' : 'FREQUENTLY ACCESSED & RECENT ASSIGNMENTS'}
              </Text>

              {filteredSearchItems.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.searchResultItem}
                  onPress={() => {
                    setShowSearchModal(false);
                    if (item.targetTab && setActiveTab) {
                      setActiveTab(item.targetTab);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.searchResultIconBox, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon} size={16} color={item.iconColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.searchResultTitle}>{item.title}</Text>
                    <Text style={styles.searchResultSub}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.searchResultTag}>
                    <Text style={styles.searchResultTagText}>{item.tag}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {filteredSearchItems.length === 0 && (
                <View style={styles.noSearchFoundBox}>
                  <Ionicons name="search-outline" size={28} color="#CBD5E1" />
                  <Text style={styles.noSearchFoundText}>
                    No matching records found for "{searchQuery}"
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 14,
    minHeight: 70,
    zIndex: 100,
    position: 'relative',
  },
  popoverBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 9998,
  },
  headerTitleCol: {
    gap: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // ==============================================================
  // TOP ONLINE / OFFLINE TOGGLE SWITCH BUTTON
  // ==============================================================
  topToggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 4,
  },
  topToggleLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  topToggleLabelOnline: {
    color: '#059669',
  },
  topToggleLabelOffline: {
    color: '#64748B',
  },
  toggleSwitchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
    cursor: 'pointer',
  },
  toggleSwitchTrackOnline: {
    backgroundColor: '#10B981',
  },
  toggleSwitchTrackOffline: {
    backgroundColor: '#CBD5E1',
  },
  toggleSwitchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleSwitchThumbOnline: {
    alignSelf: 'flex-end',
  },
  toggleSwitchThumbOffline: {
    alignSelf: 'flex-start',
  },

  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  headerIconBtnActive: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  // ==============================================================
  // NOTIFICATIONS DROPDOWN POPOVER STYLES
  // ==============================================================
  notifDropdownCard: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 380,
    maxHeight: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
    zIndex: 99999,
    overflow: 'hidden',
  },
  notifHeaderRow: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  notifHeaderTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  notifScrollList: {
    maxHeight: 460,
  },
  notifSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  sectionDividerGap: {
    height: 8,
  },
  notifItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 14,
  },
  notifItemDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
  },
  avatarWithBadgeWrap: {
    position: 'relative',
    width: 40,
    height: 40,
  },
  notifAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  avatarSubBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 17,
    height: 17,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notifContentCol: {
    flex: 1,
  },
  notifMainText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  notifBoldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  notifCommentQuote: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },
  notifTimestamp: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  actionsBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  acceptBtn: {
    backgroundColor: '#0062E0',
    paddingVertical: 7,
    paddingHorizontal: 22,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  declineBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadgeAccepted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusBadgeAcceptedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadgeDeclined: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusBadgeDeclinedText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },

  // ==============================================================
  // AVATAR & PROFILE DROPDOWN STYLES
  // ==============================================================
  avatarProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
    paddingHorizontal: 3,
    cursor: 'pointer',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  profileDropdownMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99999,
  },
  dropdownHeader: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  dropdownNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  dropdownRoleText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  dropdownStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  dropdownStatusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  dutyToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dutyToggleOnline: {
    backgroundColor: '#E8F8F5',
  },
  dutyToggleOffline: {
    backgroundColor: '#F1F5F9',
  },
  dutyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dutyDotOnline: {
    backgroundColor: '#00B894',
  },
  dutyDotOffline: {
    backgroundColor: '#94A3B8',
  },
  dutyToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  dutyToggleTextOnline: {
    color: '#00B894',
  },
  dutyToggleTextOffline: {
    color: '#64748B',
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 6,
    marginHorizontal: 4,
    cursor: 'pointer',
  },
  dropdownMenuText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },

  // ==============================================================
  // SEARCH MODAL STYLES
  // ==============================================================
  searchModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 16,
    zIndex: 99999,
  },
  searchModalDismissArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchModalCard: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 20,
    zIndex: 100000,
  },
  searchModalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  searchModalTextInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  searchClearBtn: {
    padding: 4,
  },
  searchCloseBtn: {
    padding: 4,
  },
  searchFilterChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  searchCategoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchCategoryChipActive: {
    backgroundColor: '#0062E0',
    borderColor: '#0062E0',
  },
  searchCategoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  searchCategoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  searchResultsScroll: {
    maxHeight: 380,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.6,
    paddingHorizontal: 6,
    marginBottom: 8,
    marginTop: 4,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    cursor: 'pointer',
  },
  searchResultIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchResultSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  searchResultTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  searchResultTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  noSearchFoundBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  noSearchFoundText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
