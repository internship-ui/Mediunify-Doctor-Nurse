import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import ClaimProfileScreen from '../screens/ClaimProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MainTabs from './MainTabs';
import { useAuth } from '../context/AuthContext';
import {
  HomeNursingLoginScreen,
  HomeNursingRegistrationScreen,
  HomeNursingNavigator,
} from '../homeNursing';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const { authInitialRoute } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={authInitialRoute || 'RoleSelectionScreen'}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="ClaimProfile" component={ClaimProfileScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="DashbaordScreen" component={DashboardScreen} />
      <Stack.Screen name="HomeNursingLogin" component={HomeNursingLoginScreen} />
      <Stack.Screen name="HomeNursingRegistration" component={HomeNursingRegistrationScreen} />
      <Stack.Screen name="HomeNursingApp" component={HomeNursingNavigator} />
    </Stack.Navigator>
  );
}
