/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { deleteUser, fetchUserById, updateUserNotifications, uploadUserProfile } from '../services/Apiservices';
import { getUserData } from '../Redux/Actions';
import { requestCameraPermission } from '../components/requestCameraPermission ';
import CustomSwitch from '../components/CustomSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface ProfileOption {
  title: string;
  icon: string;
}

type RootStackParamList = {
  Tickets: undefined;
  EditProfile: undefined;
  TermsConditions: undefined;
  HelpCenter: undefined;
  Login: undefined;
};

interface UserData {
  profileImageUrl: string;
  notificationsEnabled: boolean;
  userId: number;
}
interface RootState {
  userData: UserData;
}

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.userData);
  const profileImageUrl = userData?.profileImageUrl;
  const notificationState = userData?.notificationsEnabled;
  const userId = userData?.userId;

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(notificationState);
  const [isNModalVisible, setIsNModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState<string | null>(profileImageUrl);
  const [previousNotificationState, setPreviousNotificationState] = useState(notificationState);
  // const [loading, setLoading] = useState<boolean>(false);

  const profileOptions: ProfileOption[] = [
    { title: 'Edit Profile', icon: 'person-outline' },
    { title: 'My Booking', icon: 'calendar-outline' },
    { title: 'Notifications', icon: 'notifications-outline' },
    { title: isDarkMode ? 'Light Mode' : 'Dark Mode', icon: isDarkMode ? 'sunny-outline' : 'moon-outline' },
    { title: 'Terms & Conditions', icon: 'document-text-outline' },
    { title: 'Help Center', icon: 'help-circle-outline' },
    { title: 'LogOut', icon: 'log-out-outline' },
    { title: 'Delete Account', icon: 'trash-outline' },
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('isLoggedIn', 'false');
              await AsyncStorage.removeItem('jwtToken');
              await AsyncStorage.removeItem('userData');
              dispatch(getUserData([]));
              Alert.alert('Logged out', 'You have been logged out successfully.');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'An error occurred while logging out.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    setImageSource(userData?.profileImageUrl);
  }, [userData?.profileImageUrl]);

  const fetchData = async (userId: number | null) => {
    console.log('api calling');
    if (userId === null) {
      console.log('User ID is null, skipping fetch');
      return;
    }
    try {
      const response = await fetchUserById(userId);
      dispatch(getUserData(response));
    } catch (err: any) {
      console.log(err.message || 'Failed to fetch user data.');
    }
  };

  const toggleNotifications = () => {
    setIsNotificationsEnabled(prevState => !prevState);
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleImageUpload = async (body: any) => {
    try {
      const response = await uploadUserProfile(userId, body);
      if (response) {
        setImageSource(response);
        await fetchData(userId);
        // dispatch(getUserData({ ...userData, profileImageUrl: response }));
      }
    } catch (error: any) {
      console.error("Error uploading profile image:", error.message);
    }
  };

  const handleCameraSelection = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }
    const response = await launchCamera({
      mediaType: 'photo',
    });

    if (response.didCancel) {
    } else if (response.errorCode) {
    } else {
      const formData = new FormData();
      const image = response.assets?.[0];

      formData.append('image', {
        uri: image?.uri,
        name: image?.fileName,
        type: image?.type,
      });
      const uri = response.assets?.[0]?.uri ?? null;
      await handleImageUpload(formData)
      setImageSource(uri);
    }
    closeModal();
  };

  const handleGallerySelection = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (response.didCancel) {
    } else if (response.errorCode) {
    } else {
      const formData = new FormData();
      const image = response.assets?.[0];

      formData.append('image', {
        uri: image?.uri,
        name: image?.fileName,
        type: image?.type,
      });
      const uri = response.assets?.[0]?.uri ?? null;
      await handleImageUpload(formData)
      setImageSource(uri);
    }
    closeModal();
  };

  // const openNotificationModal = (state: boolean) => {
  //   setIsNotificationsEnabled(state);
  //   setIsNModalVisible(true);
  // };
  const openNotificationModal = (state: boolean) => {
    setPreviousNotificationState(isNotificationsEnabled);
    setIsNotificationsEnabled(state);
    setIsNModalVisible(true);
  };

  const NotificationCancel = () => {
    setIsNotificationsEnabled(previousNotificationState);
    setIsNModalVisible(false);
  };
  const handleNotificationChange = async () => {
    if (isNotificationsEnabled === null) return;

    try {
      const result = await updateUserNotifications(userId, isNotificationsEnabled);
      console.log('result noto', result);
      dispatch(getUserData(result));
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setIsNModalVisible(false);
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDeleteAccount },
      ],
    );
  };

  // Function to handle the actual deletion logic
  const handleDeleteAccount = async () => {
    // console.log('Account deleted');
    try {
      const response = await deleteUser(userId);
      console.log('Response:', response);
      Alert.alert(
        'Success',
        'User deleted successfully',
        [
          {
            text: 'OK',
            onPress: async () => {
              navigation.navigate('Login');
              // try {
              //   await AsyncStorage.setItem('isLoggedIn', 'false');
              //   await AsyncStorage.removeItem('jwtToken');
              //   await AsyncStorage.removeItem('userData');
              //   dispatch(getUserData([]));
              //   Alert.alert('Logged out', 'You have been logged out successfully.');
              //   navigation.navigate('Login');
              // } catch (error) {
              //   console.error('Logout failed:', error);
              //   Alert.alert('Error', 'An error occurred while logging out.');
              // }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      console.log('Error:', error.message);
      Alert.alert('Error', error.message); // Show error in an alert
    }
  };

  // const handleCancelModal = () => {
  //   setIsNModalVisible(false);
  // };

  const renderProfileOption = ({ title, icon }: ProfileOption, index: number) => (
    <TouchableOpacity
      style={styles.optionContainer}
      // onPress={() => index === 2 ? toggleNotifications() : index === 3 ? toggleDarkMode() : null}
      onPress={() => {
        if (index === 0) {
          navigation.navigate('EditProfile');
        } else if (index === 1) {
          navigation.navigate('Tickets');
        } else if (index === 2) {
          toggleNotifications();
        } else if (index === 3) {
          toggleDarkMode();
        } else if (index === 4) {
          navigation.navigate('TermsConditions');
        } else if (index === 5) {
          navigation.navigate('HelpCenter');
        } else if (index === 6) {
          handleLogout();
        } else if (index === 7) {
          confirmDeleteAccount();
        }
      }}
    >
      <Icon name={icon} size={20} color={isDarkMode ? '#fff' : '#333'} style={styles.optionIcon} />
      <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#333' }]}>{title}</Text>
      {index === 2 && (
        <CustomSwitch value={isNotificationsEnabled} onChange={() => openNotificationModal(!isNotificationsEnabled)} />
      )}
      {index === 3 && (
        <CustomSwitch value={isDarkMode} onChange={toggleDarkMode} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View>
        <View style={styles.view}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#fff' }]}>Profile</Text>
          </View>
          <View style={styles.profileTop}>
            <View style={styles.profileImageContainer}>
              {imageSource ? (
                <Image source={{ uri: imageSource }} style={styles.profileImage} />
              ) : (
                <Icon name="person-circle-outline" size={80} color="#fff" />
              )}
              <TouchableOpacity style={styles.cameraIcon} onPress={openModal}>
                <Icon name="camera" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.accountSection}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Account</Text>
          {profileOptions.slice(0, 4).map((option, index) => (
            <React.Fragment key={index}>
              {renderProfileOption(option, index)}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.supportSection}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Support & About</Text>
          {profileOptions.slice(4).map((option, index) => (
            <React.Fragment key={index + 4}>
              {renderProfileOption(option, index + 4)}
            </React.Fragment>
          ))}
        </View>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Image Source</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleCameraSelection}>
                <Text style={styles.modalButtonText}>Use Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleGallerySelection}>
                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={isNModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Notification Settings</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to {isNotificationsEnabled ? 'enable' : 'disable'} notifications?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton2, { backgroundColor: '#f44336' }]}
                  onPress={NotificationCancel}
                >
                  <Text style={styles.modalButtonText2}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton2, { backgroundColor: '#4CAF50' }]}
                  onPress={handleNotificationChange}
                >
                  <Text style={styles.modalButtonText2}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalButton2: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText2: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalMessage: { fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', columnGap: 20, },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // paddingTop: 5,
    paddingTop: Platform.OS === 'ios' ? 50 : 10,

  },
  profileTop: {
    alignItems: 'center',
    marginBottom: 50,
  },
  profileImageContainer: {
    borderRadius: 100,
    backgroundColor: '#444',
    width: 150,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  header: {
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
  },
  accountSection: {
    marginBottom: 20,
    marginTop: 10,
  },
  supportSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: '#efefef',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  notificationSwitch: {
    marginLeft: 'auto',
  },
  view: {
    backgroundColor: '#EF412B',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#00cc66',
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProfileScreen;
