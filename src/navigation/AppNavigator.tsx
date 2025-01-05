import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import BottomBar from '../components/BottomBar';
import Notifications from '../screens/Notifications';
import AllEventsScreen from '../screens/AllEventsScreen';
import { ThemeProvider } from '../Theme/ThemeContext';
import TicketDetails from '../screens/TicketDetails ';

export type RootStackParamList = {
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  BottomBar: undefined;
  Notification: undefined;
  AllEvents: undefined;
  TicketDetails: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BottomBar" component={BottomBar} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Notification" component={Notifications} />
          <Stack.Screen name="AllEvents" component={AllEventsScreen} />
          <Stack.Screen name="TicketDetails" component={TicketDetails} />
          <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;
