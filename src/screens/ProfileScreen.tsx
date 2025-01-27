import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Modal, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { updateUserNotifications } from '../services/Apiservices';
import { getUserData } from '../Redux/Actions';

interface ProfileOption {
  title: string;
  icon: string;
}

type RootStackParamList = {
  Tickets: undefined;
  EditProfile: undefined;
  TermsConditions: undefined;
  HelpCenter: undefined;
};

interface UserData {
  profileImageUrl: string;
  notificationsEnabled: boolean;
  userId: string;
}
interface RootState {
  userData: UserData;
}

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.userData);
  const profileImageUrl = userData.profileImageUrl;
  const notificationState = userData.notificationsEnabled;
  const userId = userData.userId;

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(notificationState);
  const [isNModalVisible, setIsNModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState<string | null>(null);

  const profileOptions: ProfileOption[] = [
    { title: 'Edit Profile', icon: 'person-outline' },
    { title: 'My Booking', icon: 'calendar-outline' },
    { title: 'Notifications', icon: 'notifications-outline' },
    { title: isDarkMode ? 'Light Mode' : 'Dark Mode', icon: isDarkMode ? 'sunny-outline' : 'moon-outline' },
    { title: 'Terms & Conditions', icon: 'document-text-outline' },
    { title: 'Help Center', icon: 'help-circle-outline' },
  ];

  const toggleNotifications = () => {
    setIsNotificationsEnabled(prevState => !prevState);
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const NotificationCancel = () => {
    setIsNModalVisible(false);
  };

  const handleCameraSelection = async () => {
    const response = await launchCamera({
      mediaType: 'photo',
    });

    if (response.didCancel) {
      console.log('User cancelled camera');
    } else if (response.errorCode) {
      console.log('Camera Error: ', response.errorMessage);
    } else {
      const uri = response.assets?.[0]?.uri ?? null;
      setImageSource(uri);
      console.log('Captured Image URI:', uri);
    }
    closeModal();
  };

  const handleGallerySelection = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      const uri = response.assets?.[0]?.uri ?? null;
      setImageSource(uri);
      console.log('Selected Image URI:', uri);
    }
    closeModal();
  };

  const openNotificationModal = (state: boolean) => {
    setIsNotificationsEnabled(state);
    setIsNModalVisible(true);
  };

  const handleNotificationChange = async () => {
    if (isNotificationsEnabled === null) return;

    try {
      const result = await updateUserNotifications(userId, isNotificationsEnabled);
      dispatch(getUserData(result));
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setIsNModalVisible(false);
    }
  };

  const handleCancelModal = () => {
    setIsNModalVisible(false);
  };

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
        }
      }}
    >
      <Icon name={icon} size={24} color={isDarkMode ? '#fff' : '#333'} style={styles.optionIcon} />
      <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#333' }]}>{title}</Text>
      {index === 2 && (
        // <Switch
        //   value={isNotificationsEnabled}
        //   onValueChange={toggleNotifications}
        //   trackColor={{ false: '#ccc', true: '#00cc66' }}
        //   thumbColor={isNotificationsEnabled ? '#fff' : '#f4f3f4'}
        //   style={styles.notificationSwitch}
        // />
        <Switch
          value={isNotificationsEnabled}
          onValueChange={() => openNotificationModal(!isNotificationsEnabled)}
          trackColor={{ false: '#ccc', true: '#00cc66' }}
          thumbColor={isNotificationsEnabled ? '#fff' : '#f4f3f4'}
          style={styles.notificationSwitch}
        />
      )}
      {index === 3 && (
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#ccc', true: '#00cc66' }}
          thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          style={styles.notificationSwitch}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
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
    paddingTop: 5,
  },
  profileTop: {
    alignItems: 'center',
    marginBottom: 50,
  },
  profileImageContainer: {
    borderRadius: 100,
    backgroundColor: '#444',
    width: 150,
    height: 150,
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  accountSection: {
    marginBottom: 20,
    marginTop: 10,
  },
  supportSection: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    backgroundColor: '#FF5733',
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
    fontSize: 18,
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
    fontSize: 16,
  },
});

export default ProfileScreen;
