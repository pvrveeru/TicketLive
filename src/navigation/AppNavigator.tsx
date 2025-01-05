// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import BottomBar from '../components/BottomBar';
import Notifications from '../screens/Notifications';
import AllEventsScreen from '../screens/AllEventsScreen';

export type RootStackParamList = {
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  BottomBar: undefined;
  Notification: undefined;
  AllEvents: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="BottomBar" component={BottomBar} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notification" component={Notifications} options={{ headerShown: false }} />
        <Stack.Screen name="AllEvents" component={AllEventsScreen} />

        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
