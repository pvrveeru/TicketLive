import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Button, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserById, updateUserProfile } from '../services/Apiservices';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../Redux/Actions';
import { useTheme } from '../Theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/globalstyles';

interface UserData {
  userId: number;
}
interface RootState {
  userData: UserData;
}

const EditProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const userData = useSelector((state: RootState) => state.userData);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [emailId, setEmailId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [address, setAddress] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchUserById(userData.userId);
        dispatch(getUserData(response));
        // console.log('response', response);
        const user = response;
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmailId(user.emailId || null);
        setPhoneNumber(user.phoneNumber || '');
        setDateOfBirth(user.dateOfBirth || '');
        setGender(user.gender || '');
        setCity(user.city || null);
        setState(user.state || null);
        setCity(user.country || null);
        setAddress(user.address || '')
      } catch (err: any) {
        console.error('Failed to fetch user data:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.userId]);

  const handleSaveChanges = async () => {
    if (!firstName || !lastName || !emailId || !phoneNumber || !dateOfBirth || !gender || !address || !state || !city) {
      Alert.alert('All fields are required!');
      return;
    }

    const userDetails = {
      firstName,
      lastName,
      emailId,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      state,
      city,
    };
    // console.log("userDetails::", userDetails)
    try {
      setLoading(true);
      const response = await updateUserProfile(userData.userId, userDetails);
      dispatch(getUserData(response));
      // console.log('response', response);
      Alert.alert('Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error updating profile: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={isDarkMode ? styles.darkheader : styles.header}>Edit Profile</Text>
      </View>

      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />
      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />
      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={emailId || ''} onChangeText={setEmailId} placeholder="Email ID" keyboardType="email-address" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />
      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />
      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="Date of Birth (YYYY-MM-DD)" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />
      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={gender} onChangeText={setGender} placeholder="Gender" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />
      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={address || ''} onChangeText={setAddress} placeholder="Address" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />
      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={city || ''} onChangeText={setCity} placeholder="City" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />
      <TextInput style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]} value={state || ''} onChangeText={setState} placeholder="State" placeholderTextColor={isDarkMode ? '#fff' : '#000'} />

      <TouchableOpacity onPress={handleSaveChanges} style={styles.button}>
        <Text style={styles.btntext}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    columnGap: 30,
  },
  leftArrow: {
    fontSize: 24,
    marginRight: 8,
    color: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  darkheader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.red,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    borderRadius: 15,
    marginTop: '20%',
  },
  btntext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
