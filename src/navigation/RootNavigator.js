import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import PatientProfileScreen from '../screens/PatientProfileScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import VideoConsultationScreen from '../screens/VideoConsultationScreen';
import PrescriptionScreen from '../screens/PrescriptionScreen';
import TestRequirementScreen from '../screens/TestRequirementScreen';
import EarningsScreen from '../screens/EarningsScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SpecialityServicesScreen from '../screens/SpecialityServicesScreen';
import FollowUpsScreen from '../screens/FollowUpsScreen';
import DirectPatientScreen from '../screens/DirectPatientScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';
import ClaimProfileScreen from '../screens/ClaimProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import SplashScreen from '../screens/SplashScreen';
import {
  HomeNursingLoginScreen,
  HomeNursingRegistrationScreen,
  HomeNursingNavigator,
} from '../homeNursing';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="DashbaordScreen" component={DashboardScreen} />
      <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="HomeNursingLogin" component={HomeNursingLoginScreen} />
      <Stack.Screen name="HomeNursingRegistration" component={HomeNursingRegistrationScreen} />
      <Stack.Screen name="HomeNursingApp" component={HomeNursingNavigator} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="ClaimProfile" component={ClaimProfileScreen} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
      <Stack.Screen name="PatientProfile" component={PatientProfileScreen} />
      <Stack.Screen name="Consultation" component={ConsultationScreen} />
      <Stack.Screen name="VideoConsultation" component={VideoConsultationScreen} />
      <Stack.Screen name="Prescription" component={PrescriptionScreen} />
      <Stack.Screen name="TestRequirement" component={TestRequirementScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SpecialityServices" component={SpecialityServicesScreen} />
      <Stack.Screen name="FollowUps" component={FollowUpsScreen} />
      <Stack.Screen name="DirectPatient" component={DirectPatientScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
