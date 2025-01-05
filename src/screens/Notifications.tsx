import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Or any other icon library
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { useTheme } from '../Theme/ThemeContext';

interface NotificationItem {
    text: string;
}

const Notifications = () => {
    const { isDarkMode } = useTheme();
    const navigation = useNavigation(); // Initialize useNavigation hook

    const notificationsData: NotificationItem[] = [
        { text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
        { text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliqui...' },
        { text: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit la...' },
        { text: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit la...' },
    ];

    const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
        <View style={[styles.notificationItem, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
            <Icon name="notifications-outline" size={24} color="#EF412B" style={styles.notificationIcon} />
            <Text style={[styles.notificationText, { color: isDarkMode ? '#fff' : '#333' }]}>
                {item.text}
            </Text>
        </View>
    );

    const handleSettingsPress = () => {
        Alert.alert('Settings', 'Settings icon clicked!', [
            { text: 'OK' },
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back-outline" size={30} color={isDarkMode ? '#fff' : 'black'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : 'black' }]}>Notification</Text>
                <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
                    <Icon name="settings-outline" size={24} color={isDarkMode ? '#fff' : 'black'} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={notificationsData}
                renderItem={renderNotificationItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20, // Adjust as needed for status bar
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {},
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingsButton: {},
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 15,
        borderRadius: 10,
        paddingHorizontal: 5,
    },
    notificationIcon: {
        marginRight: 10,
        marginTop: 3, // Align icon vertically
    },
    notificationText: {
        flex: 1, // Allow text to wrap
        fontSize: 16,
    },
    list: {
        flex: 1,
    },
});

export default Notifications;
