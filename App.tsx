// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import BottomBar from './src/components/BottomBar';

// const App = () => {
//     return (
//         <NavigationContainer>
//             <BottomBar />
//         </NavigationContainer>
//     );
// };

// export default App;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import BottomBar from './src/components/BottomBar';

type RootStackParamList = {
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  BottomBar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="BottomBar" component={BottomBar} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
