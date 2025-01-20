import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';

interface ProfileOption {
  title: string;
  icon: string;
}

const ProfileScreen = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

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

  const renderProfileOption = ({ title, icon }: ProfileOption, index: number) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => index === 2 ? toggleNotifications() : index === 3 ? toggleDarkMode() : null}
    >
      <Icon name={icon} size={24} color={isDarkMode ? '#fff' : '#333'} style={styles.optionIcon} />
      <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#333' }]}>{title}</Text>
      {index === 2 && (
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleNotifications}
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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={styles.view}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#fff' }]}>Profile</Text>
        </View>
        <View style={styles.profileTop}>
          <View style={styles.profileImageContainer}>
            <Icon name="camera" size={30} color="#fff" style={styles.cameraIcon} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  profileTop: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 5,
  },
  header: {
    marginBottom: 20,
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
});

export default ProfileScreen;
