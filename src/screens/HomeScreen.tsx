import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { fetchFeaturedEvents, fetchManualEvents, fetchPopularEvents } from '../services/Apiservices';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from '../components/EventCard';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../Theme/ThemeContext';
import { COLORS } from '../styles/globalstyles';
import HomeCarousel from './HomeCarousel';


type EventData = {
  ageLimit?: string;
  artistName?: string;
  bannerImageUrl?: string;
  brief?: string;
  categoryId?: {
    categoryId?: number;
    name?: string;
  };
  city?: string;
  createdAt?: string;
  description?: string;
  duration?: string;
  endDate?: string;
  eventDate?: string;
  eventId?: number;
  favoritesCount?: number;
  galleryImages?: string[];
  isFavorite?: boolean;
  isFeatured?: boolean;
  isManual?: boolean;
  isPaid?: boolean;
  isPopular?: boolean;
  language?: string;
  layoutImageUrl?: string;
  layoutStatus?: string;
  location?: string;
  musicType?: string;
  noOfTickets?: number;
  startDate?: string;
  state?: string;
  status?: string;
  thumbUrl?: string;
  title?: string;
  updatedAt?: string;
  venueStatus?: string;
};


type RootStackParamList = {
  BottomBar: { screen: string };
  Notification: undefined;
  Explore: { type: string };
  EventDetails: { eventId: number };
};

type UserDataTypes = {
  accessToken: string;
  accountVerified: boolean;
  country: string | null;
  createdAt: string;
  darkModeEnabled: boolean;
  dateOfBirth: string | null;
  email: string | null;
  firstName: string | null;
  gender: string | null;
  lastName: string | null;
  notificationsEnabled: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  profileImageUrl: string | null;
  updatedAt: string;
  userId: number;
  userName: string | null;
};

interface UserData {
  userId: string;
}
interface RootState {
  userData: UserData;
}

const HomeScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [popularEvents, setPopularEvents] = useState<EventData[]>([]);
  const [manualEvents, setManualEvents] = useState<EventData[]>([]);
  const [userId, setUserId] = useState<UserDataTypes[]>([]);
  const profileImage = require('../../assests/images/icon.png');

  const userData = useSelector((state: RootState) => state.userData);
  const UserId = userData.userId;
  console.log('UserId', UserId);
  // console.log('userData', userData);

  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleFavorite = (eventId: number) => {
    console.log(`Toggled favorite for event ID: ${eventId}, User ID: ${userId}`);
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [eventId]: !prevFavorites[eventId],
    }));
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const token = await AsyncStorage.getItem('acessToken');
        console.log('token', token);
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.userId);
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    // Fetch events on mount
    fetchEventData(fetchFeaturedEvents, setFeaturedEvents);
    fetchEventData(fetchPopularEvents, setPopularEvents);
    fetchEventData(fetchManualEvents, setManualEvents);
  }, []);

  const fetchEventData = async (fetchFunction: Function, setEvents: Function) => {
    try {
      const data = await fetchFunction(userId, 10);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchEventData(fetchFeaturedEvents, setFeaturedEvents),
        fetchEventData(fetchPopularEvents, setPopularEvents),
        fetchEventData(fetchManualEvents, setManualEvents),
      ]);
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const navigateToExplore = (type: string) => {
    navigation.navigate('Explore', { type });
  };

  const handleProfilePress = () => {
    navigation.navigate('BottomBar', { screen: 'Profile' });
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const handleEventPress = (eventId: number) => {
    navigation.navigate('EventDetails', { eventId });
  };


  const renderEventSection = (title: string, events: any[], type: string) => (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <Button title="See All" onPress={() => navigateToExplore(type)} />
      </View>
      <FlatList
        horizontal
        data={events.slice(0, 3)}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <EventCard
            imageUrl={item.thumbUrl}
            title={item.title}
            dateTime={item.eventDate}
            location={item.location}
            isFavorite={favorites[item.id] || false}
            onFavoritePress={() => toggleFavorite(item.eventId || 0)}
            onPress={() => handleEventPress(item.eventId)}
          />
        )}

      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleProfilePress} style={styles.profile}>
          <Image source={profileImage} style={styles.profileImage} />
          <Text style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>Andrew Ainsley</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationPress}>
          <MaterialCommunityIcons name="bell-badge-outline" style={[styles.socialIcon, isDarkMode ? styles.darkIcon : styles.lightIcon]} />
        </TouchableOpacity>
      </View>
      <HomeCarousel />
      <View>
        {renderEventSection('Featured Events', featuredEvents, 'Featured')}
        {renderEventSection('Popular Events', popularEvents, 'Popular')}
        {renderEventSection('Manual Events', manualEvents, 'Manual')}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  notificationIcon: {
    padding: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  socialIcon: {
    fontSize: 20,
  },
  darkIcon: {
    color: '#FFFFFF',
  },
  lightIcon: {
    color: COLORS.red,
  },
  section: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    width: 150,
    height: 100,
    marginRight: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default HomeScreen;
