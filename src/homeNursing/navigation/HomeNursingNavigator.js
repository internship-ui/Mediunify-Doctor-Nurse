import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeNursingTabs from './HomeNursingTabs';
import HomeNursingAssignmentDetailScreen from '../screens/HomeNursingAssignmentDetailScreen';
import HomeNursingServiceStatusScreen from '../screens/HomeNursingServiceStatusScreen';
import HomeNursingNotificationsScreen from '../screens/HomeNursingNotificationsScreen';
import HomeNursingAvailabilityScreen from '../screens/HomeNursingAvailabilityScreen';
import HomeNursingHistoryScreen from '../screens/HomeNursingHistoryScreen';
import HomeNursingProfileScreen from '../screens/HomeNursingProfileScreen';
import HomeNursingServicesScreen from '../screens/HomeNursingServicesScreen';

const Stack = createNativeStackNavigator();

export default function HomeNursingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeNursingMain">
      <Stack.Screen name="HomeNursingMain" component={HomeNursingTabs} />
      <Stack.Screen
        name="HomeNursingAssignmentDetail"
        component={HomeNursingAssignmentDetailScreen}
      />
      <Stack.Screen
        name="HomeNursingServiceStatus"
        component={HomeNursingServiceStatusScreen}
      />
      <Stack.Screen
        name="HomeNursingNotifications"
        component={HomeNursingNotificationsScreen}
      />
      <Stack.Screen
        name="HomeNursingAvailability"
        component={HomeNursingAvailabilityScreen}
      />
      <Stack.Screen
        name="HomeNursingHistory"
        component={HomeNursingHistoryScreen}
      />
      <Stack.Screen
        name="HomeNursingProfile"
        component={HomeNursingProfileScreen}
      />
      <Stack.Screen
        name="HomeNursingServicesList"
        component={HomeNursingServicesScreen}
      />
    </Stack.Navigator>
  );
}
