import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { getOtpData, MobileNumber } from '../Redux/Actions';
import { createUser } from '../services/Apiservices';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Theme/ThemeContext';

type RootStackParamList = {
  Login: undefined;
  OtpVerification: undefined;
};


const LoginScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const Logo = require('../../assests/images/ticketliv_logo.png');
  const Facebook = require('../../assests/images/facebook.png');
  const Google = require('../../assests/images/google.png');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleOtpRequest = async () => {
    if (phoneNumber.length === 10) {
      const formattedPhoneNumber = `+91${phoneNumber}`;
      dispatch(MobileNumber(formattedPhoneNumber));
      Keyboard.dismiss();
      setLoading(true);

      try {
        const response = await createUser(formattedPhoneNumber);
        console.log('response45', response);
        dispatch(getOtpData({
          otpCode: response.otpCode,
          otpId: response.otpId,
          phoneNumber: response.phoneNumber,
          expiresAt: response.expiresAt,
        }));
        Alert.alert('Success', 'OTP request sent successfully!');
        navigation.navigate('OtpVerification');
      } catch (error) {
        console.log('Error', error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
    }
  };

  const handleInputChange = (text: string): void => {
    if (text.length <= 10) {
      setPhoneNumber(text);
    }
    if (text.length === 10) {
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Image source={Logo} style={styles.logo} />
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Login to Your Account</Text>
          <View style={styles.inputContainer}>
            <Icon name="mobile-phone" size={30} color="#ccc" style={styles.phoneIcon} />
            <TextInput
              style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              placeholderTextColor={isDarkMode ? '#fff' : '#000'}
              onChangeText={handleInputChange}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleOtpRequest}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : 'OTP Request'}
            </Text>
          </TouchableOpacity>


          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={[styles.orText, { color: isDarkMode ? '#fff' : '#000' }]}>or continue with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialIcons}>
            <View style={styles.socialIconContainer}>
              <Image source={Facebook} style={styles.socialIcon} />
            </View>
            <View style={styles.socialIconContainer}>
              <Image source={Google} style={styles.socialIcon} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logo: {
    width: '70%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: '10%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: '12%',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 5,
    marginBottom: '15%',
  },
  phoneIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#26276C',
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: '15%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Change color when disabled
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '15%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  orText: {
    fontSize: 14,
    color: '#666',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: '10%',
  },
  socialIconContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default LoginScreen;
