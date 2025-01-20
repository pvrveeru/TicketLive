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
import ExploreDetails from '../screens/ExploreDetails';
import BookEventScreen from '../screens/BookEventScreen';
import EventBookingDetails from '../screens/EventBookingDetails';
import ReviewSummary from '../screens/ReviewSummary';
import EventDetails from '../screens/EventDetails';
export type RootStackParamList = {
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  BottomBar: undefined;
  Notification: undefined;
  AllEvents: undefined;
  TicketDetails: undefined;
  BookEventScreen: undefined;
  EventBookingDetails: { selectedZone: string; numSeats: number; totalPrice: number };
  ReviewSummary: undefined;
  EventDetails: { eventId: number };
  ExploreDetails: { item: { id: number; title: string; price: number; description: string; image: string } };
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
          <Stack.Screen name="ExploreDetails" component={ExploreDetails} />
          <Stack.Screen name="BookEventScreen" component={BookEventScreen} />
          <Stack.Screen name="EventBookingDetails" component={EventBookingDetails} />
          <Stack.Screen name="ReviewSummary" component={ReviewSummary} />
          <Stack.Screen name="EventDetails" component={EventDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;
