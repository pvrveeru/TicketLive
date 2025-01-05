import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OtpInput from './OtpInput';
type RootStackParamList = {
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  BottomBar: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

const OtpVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const Logo = require('../../assests/images/ticketliv_logo.png');
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState<string>('');

  const handleVerify = () => {
    if (otp.length === 5) {
      // Navigate to BottomBar screen
      navigation.navigate('BottomBar');
    } else {
      Alert.alert('Invalid OTP', 'Please enter a 5-digit OTP.');
    }
  };

  const handleOtpChange = (text: string) => {
    if (text.length <= 5) {
      setOtp(text);
    }
  };


  const handleOtpBlur = () => {
    console.log('OTP input blurred');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        {/* <Text>{'< Back'}</Text> */}
        <AntDesign name="arrowleft" size={30} color="#000" />
      </TouchableOpacity>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Mobile verification has successfully done</Text>
      <Text style={styles.subtitle}>
        We have sent the OTP on {phoneNumber}. It will apply auto to the fields.
      </Text>
      <OtpInput
        otpCode={otp}
        onChange={handleOtpChange}
        onBlur={handleOtpBlur}
        // error={error}
        maxLength={5}
        size="large"
        disabled={false}
      />

      <Text style={styles.resendText}>
        If you didn't receive a code?{' '}
        <Text style={styles.resendLink} onPress={() => Alert.alert('Resend OTP')}>
          Resend
        </Text>
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
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
