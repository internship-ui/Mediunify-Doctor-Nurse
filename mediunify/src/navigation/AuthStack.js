import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
// import VerificationScreen from '../screens/VerificationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import {
  HomeNursingLoginScreen,
  HomeNursingRegistrationScreen,
  HomeNursingNavigator,
} from '../homeNursing';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      {/* <Stack.Screen name="Verification" component={VerificationScreen} /> */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="HomeNursingLogin" component={HomeNursingLoginScreen} />
      <Stack.Screen name="HomeNursingRegistration" component={HomeNursingRegistrationScreen} />
      <Stack.Screen name="HomeNursingApp" component={HomeNursingNavigator} />
    </Stack.Navigator>
  );
}
