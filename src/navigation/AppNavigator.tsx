// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import BottomBar from '../components/BottomBar';
import Notifications from '../screens/Notifications';
import AllEventsScreen from '../screens/AllEventsScreen';

import ExploreDetails from '../screens/ExploreDetails';
export type RootStackParamList = {
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  BottomBar: undefined;
  Notification: undefined;
  AllEvents: undefined;
  ExploreDetails: { item: { id: number; title: string; price: number; description: string; image: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="BottomBar" component={BottomBar} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen  name="ExploreDetails" component={ExploreDetails} />
        <Stack.Screen name="Notification" component={Notifications}  />
        <Stack.Screen name="AllEvents" component={AllEventsScreen} />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
