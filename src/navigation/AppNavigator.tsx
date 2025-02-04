import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import BottomBar from '../components/BottomBar';
import Notifications from '../screens/Notifications';
import AllEventsScreen from '../screens/AllEventsScreen';
import { ThemeProvider } from '../Theme/ThemeContext';
import TicketDetails from '../screens/TicketDetails ';
import BookEventScreen from '../screens/BookEventScreen';
import EventBookingDetails from '../screens/EventBookingDetails';
import ReviewSummary from '../screens/ReviewSummary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../Redux/Actions';
import store from '../Redux/Store';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import EventDetails from '../screens/EventDetails';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../styles/globalstyles';
import EditProfileScreen from '../screens/EditProfileScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import FullMapScreen from '../screens/FullMapScreen';

export type RootStackParamList = {
  Login: undefined;
  OtpVerification: undefined;
  BottomBar: undefined;
  Notification: undefined;
  AllEvents: undefined;
  TicketDetails: undefined;
  BookEventScreen: undefined;
  EventBookingDetails: undefined;
  ReviewSummary: undefined;
  EventDetails: undefined;
  HelpCenter: undefined;
  TermsConditions: undefined;
  EditProfile: undefined;
  FullMapScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAppStatus = async () => {
      try {
        const userStatus = await AsyncStorage.getItem('isLoggedIn');
        console.log('userStatus', userStatus);
        if (!userStatus) {
          await AsyncStorage.setItem('isLoggedIn', 'false');
          setIsLoggedIn(false);
        } else if (userStatus === 'true') {
          const userData = await AsyncStorage.getItem('userData');
          const parsedUserData = JSON.parse(userData || '{}');
          store.dispatch(getUserData(parsedUserData));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.log(err);
        setIsLoggedIn(false);
      }
    };

    checkAppStatus();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? "BottomBar" : "Login"} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BottomBar" component={BottomBar} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Notification" component={Notifications} />
          <Stack.Screen name="AllEvents" component={AllEventsScreen} />
          <Stack.Screen name="TicketDetails" component={TicketDetails} />
          <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
          <Stack.Screen name="BookEventScreen" component={BookEventScreen} />
          <Stack.Screen name="EventBookingDetails" component={EventBookingDetails} />
          <Stack.Screen name="ReviewSummary" component={ReviewSummary} />
          <Stack.Screen name="EventDetails" component={EventDetails} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
          <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
          <Stack.Screen name="FullMapScreen" component={FullMapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;
