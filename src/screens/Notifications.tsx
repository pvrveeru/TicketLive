import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Theme/ThemeContext';
import { getNotificationsByUserId } from '../services/Apiservices';
import { useSelector } from 'react-redux';

interface NotificationItem {
    text: string;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    createdAt: string;
}

interface UserData {
    userId: string;
}
interface RootState {
    userData: UserData;
}

const Notifications = () => {
    const { isDarkMode } = useTheme();
    const navigation = useNavigation();
    const userData = useSelector((state: RootState) => state.userData);
    const userId = userData.userId;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const data = await getNotificationsByUserId(userId);
                setNotifications(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch notifications.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [userId]);

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const handleSettingsPress = () => {
        Alert.alert('Settings', 'Settings icon clicked!', [{ text: 'OK' }]);
    };

    const notificationsData: NotificationItem[] = notifications?.map(notification => ({
        text: notification.message,
    }));

    const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
        <View style={[styles.notificationItem, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
            <Icon name="notifications-outline" size={24} color="#EF412B" style={styles.notificationIcon} />
            <Text style={[styles.notificationText, { color: isDarkMode ? '#fff' : '#333' }]}>{item.text}</Text>
        </View>
    );

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

            {notificationsData?.length === 0 ? (
                <View style={styles.noNotificationsContainer}>
                    <Text style={styles.noNotificationsText}>No notifications available.</Text>
                </View>
            ) : (
                <FlatList
                    data={notificationsData}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.list}
                />
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {},
    headerTitle: {
        fontSize: 16,
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
        marginTop: 3,
    },
    notificationText: {
        flex: 1,
        fontSize: 13,
    },
    list: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 13,
    },
    noNotificationsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noNotificationsText: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Notifications;
