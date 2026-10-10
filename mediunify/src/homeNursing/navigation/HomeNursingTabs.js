import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeNursingDashboardScreen from '../screens/HomeNursingDashboardScreen';
import HomeNursingServicesScreen from '../screens/HomeNursingServicesScreen';
import HomeNursingAvailabilityScreen from '../screens/HomeNursingAvailabilityScreen';
import HomeNursingHistoryScreen from '../screens/HomeNursingHistoryScreen';
import HomeNursingProfileScreen from '../screens/HomeNursingProfileScreen';
import { useHomeNursing } from '../context/HomeNursingContext';

const Tab = createBottomTabNavigator();

export default function HomeNursingTabs() {
  const { assignments } = useHomeNursing();
  const assignedCount = assignments.filter((a) => a.status === 'Assigned').length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#00B894',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeNursingHome"
        component={HomeNursingDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="HomeNursingServices"
        component={HomeNursingServicesScreen}
        options={{
          tabBarLabel: 'Services',
          tabBarBadge: assignedCount > 0 ? assignedCount : undefined,
          tabBarBadgeStyle: styles.tabBadge,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'medkit' : 'medkit-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="HomeNursingSchedule"
        component={HomeNursingAvailabilityScreen}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="HomeNursingHistory"
        component={HomeNursingHistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="HomeNursingProfile"
        component={HomeNursingProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 26 : 10,
    shadowColor: '#071E42',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tabBadge: {
    backgroundColor: '#00B894',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
