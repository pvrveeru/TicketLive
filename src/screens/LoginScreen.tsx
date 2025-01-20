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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';

type RootStackParamList = {
  Login: undefined;
  OtpVerification: { phoneNumber: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const Logo = require('../../assests/images/ticketliv_logo.png');
  const Facebook = require('../../assests/images/facebook.png');
  const Google = require('../../assests/images/google.png');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleOtpRequest = () => {
    if (phoneNumber.length === 10) {
      Keyboard.dismiss();
      navigation.navigate('OtpVerification', { phoneNumber });
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.title}>Login to Your Account</Text>
          <View style={styles.inputContainer}>
            <Icon name="mobile-phone" size={30} color="#ccc" style={styles.phoneIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
               onChangeText={handleInputChange}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleOtpRequest}>
            <Text style={styles.buttonText}>OTP Request</Text>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or continue with</Text>
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
    </KeyboardAvoidingView>
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
