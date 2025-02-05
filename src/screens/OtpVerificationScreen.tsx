import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OtpInput from './OtpInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { validateOtp } from '../services/Apiservices';
import { getUserData } from '../Redux/Actions';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../Theme/ThemeContext';

type RootStackParamList = {
  Login: undefined;
  OtpVerification: undefined;
  BottomBar: undefined;
};

const OtpVerificationScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const Logo = require('../../assets/images/ticketliv_logo.png');
  // const { phoneNumber } = route.params;
  const mobileNumber = useSelector((state: RootState) => state.mobile);
  const otpCode = useSelector((state: RootState) => state.otpCode);
  const [otp, setOtp] = useState<string>(otpCode || '');

  const handleVerifyOtp = async () => {
    const phoneNumber = mobileNumber;
    if (otp.length === 6) {
      try {
        const userData = await validateOtp(phoneNumber, otp);
        dispatch(getUserData(userData));
        console.log('userData', userData.accessToken);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(userData),
        );
        await AsyncStorage.setItem('acessToken', userData.accessToken);
        Alert.alert('Success', 'OTP verified successfully!');
        navigation.navigate('BottomBar');
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
    }
  };

  const handleOtpChange = (text: string) => {
    if (text.length <= 6) {
      setOtp(text);
    }
    if (text.length === 6) {
      Keyboard.dismiss();
    }
  };


  const handleOtpBlur = () => {
    console.log('OTP input blurred');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={30} color={isDarkMode ? '#fff' : '#333'} />
      </TouchableOpacity>
      <Image source={Logo} style={styles.logo} />
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Mobile verification has successfully done</Text>
      <Text style={[styles.subtitle, { color: isDarkMode ? '#fff' : '#000' }]}>
        We have sent the OTP on {mobileNumber}. It will apply auto to the fields.
      </Text>
      <OtpInput
        otpCode={otp}
        onChange={handleOtpChange}
        onBlur={handleOtpBlur}
        // error={error}
        maxLength={6}
        size="large"
        disabled={false}
      />

      <Text style={[styles.resendText, { color: isDarkMode ? '#fff' : '#000' }]}>
        If you didn't receive a code?{' '}
        <Text style={styles.resendLink} onPress={() => Alert.alert('Resend OTP')}>
          Resend
        </Text>
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 40, left: 20 },
  logo: { height: '15%', width: '80%', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginHorizontal: 20, width: '60%' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 10, width: '70%' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20 },
  otpBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 40,
    height: 40,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  otpText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  button: {
    backgroundColor: '#26276C',
    paddingVertical: 15,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    // marginBottom: '15%',
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  resendText: { marginTop: 20, fontSize: 14, color: '#666', marginBottom: '10%' },
  resendLink: { color: '#EF412B', fontWeight: 'bold' },
});

export default OtpVerificationScreen;
