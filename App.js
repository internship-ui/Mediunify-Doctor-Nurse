import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { HomeNursingProvider } from './src/homeNursing';
import RootNavigator from './src/navigation/RootNavigator';
import { WebContainer } from './src/web';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <HomeNursingProvider>
          <StatusBar style="dark" />
          <WebContainer>
            <RootNavigator />
          </WebContainer>
        </HomeNursingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}



