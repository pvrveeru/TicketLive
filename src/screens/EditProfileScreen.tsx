import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserById } from '../services/Apiservices';

interface UserData {
  userId: number;
}
interface RootState {
  userData: UserData;
}
const EditProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.userData);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [emailId, setEmailId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [city, setCity] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchUserById(userData.userId);
        const user = response;
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmailId(user.emailId || null);
        setPhoneNumber(user.phoneNumber || '');
        setDateOfBirth(user.dateOfBirth || '');
        setGender(user.gender || '');
        setCity(user.city || null);
        setState(user.state || null);
        setCountry(user.country || null);
      } catch (err: any) {
        console.error('Failed to fetch user data:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.userId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.input}
        value={emailId || ''}
        onChangeText={setEmailId}
        placeholder="Email ID"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholder="Date of Birth (YYYY-MM-DD)"
      />
      <TextInput
        style={styles.input}
        value={gender}
        onChangeText={setGender}
        placeholder="Gender"
      />
      <TextInput
        style={styles.input}
        value={city || ''}
        onChangeText={setCity}
        placeholder="City"
      />
      <TextInput
        style={styles.input}
        value={state || ''}
        onChangeText={setState}
        placeholder="State"
      />
      <TextInput
        style={styles.input}
        value={country || ''}
        onChangeText={setCountry}
        placeholder="Country"
      />

      <Button title="Save Changes" onPress={() => console.log('Save functionality')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
});

export default EditProfileScreen;
