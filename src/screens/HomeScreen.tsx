import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { fetchFeaturedEvents, fetchManualEvents, fetchPopularEvents, fetchUserById, markEventAsDeleteFavorite, markEventAsFavorite } from '../services/Apiservices';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from '../components/EventCard';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../Theme/ThemeContext';
import { COLORS } from '../styles/globalstyles';
import HomeCarousel from './HomeCarousel';
import { getUserData } from '../Redux/Actions';


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

interface RootState {
  userData: UserDataTypes;
}

const HomeScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [popularEvents, setPopularEvents] = useState<EventData[]>([]);
  const [manualEvents, setManualEvents] = useState<EventData[]>([]);
  const [auserId, setUserId] = useState<number | null>(null)
  const userData = useSelector((state: RootState) => state.userData);
  // console.log(' in homescreen', userData)
  const profileImage = require('../../assests/images/icon.png');
  const profileImageUrl = userData.profileImageUrl;
  const userName = userData.userName;
  // console.log('UserId', auserId);

  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // const toggleFavorite = (eventId: number) => {
  //   console.log(`Toggled favorite for event ID: ${eventId}, User ID: ${auserId}`);
  //   setFavorites((prevFavorites) => {
  //     return {
  //       ...prevFavorites,
  //       [eventId]: !prevFavorites[eventId],
  //     };
  //   });
  // };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        // console.log('token', userData);
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

  const fetchData = async (auserId: number | null) => {
    if (auserId === null) {
      console.log('User ID is null, skipping fetch');
      return;
    }

    try {
      const response = await fetchUserById(auserId);
      dispatch(getUserData(response));
    } catch (err: any) {
      console.log(err.message || 'Failed to fetch user data.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (auserId !== null) {
        fetchData(auserId);
      }
    }, [auserId])
  );

  useEffect(() => {
    if (auserId !== null) {
      fetchData(auserId);
    }
  }, []);

  useEffect(() => {
    // Fetch events on mount
    fetchEventData(fetchFeaturedEvents, setFeaturedEvents);
    fetchEventData(fetchPopularEvents, setPopularEvents);
    fetchEventData(fetchManualEvents, setManualEvents);
  }, []);

  const fetchEventData = async (fetchFunction: Function, setEvents: Function) => {
    try {
      const data = await fetchFunction(auserId, 10);
      setEvents(data.result || []);
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
    navigation.navigate('Explore', { type: type });
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

  // console.log('featuredEvents', featuredEvents)
  // console.log('popularevents', popularEvents)
  // console.log('manualevents', manualEvents)

  const toggleFavorite = async (eventId: number) => {
    if (!auserId) return;

    // Check if the event is currently a favorite
    const isCurrentlyFavorite = favorites[eventId] || false;
    setFavorites((prevFavorites) => {
      return {
        ...prevFavorites,
        [eventId]: !isCurrentlyFavorite,
      };
    });

    try {
      if (isCurrentlyFavorite) {
        // Call API to remove from favorites (unlike)
        await markEventAsDeleteFavorite(auserId, eventId);
        console.log(`Unliked event ID: ${eventId}`);
      } else {
        // Call API to add to favorites (like)
        await markEventAsFavorite({ userId: auserId, eventId });
        console.log(`Liked event ID: ${eventId}`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert the favorite state if the API call fails
      setFavorites((prevFavorites) => {
        return {
          ...prevFavorites,
          [eventId]: isCurrentlyFavorite,
        };
      });
    }
  };
  const renderEventSection = (title: string, events: any[], type: string) => (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <Button title="See All" onPress={() => navigateToExplore(type)} />
      </View>
      <FlatList
        horizontal
        data={events?.slice(0, 3)}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <EventCard
            imageUrl={item.thumbUrl}
            title={item.title}
            dateTime={item.eventDate}
            location={item.location}
            isFavorite={favorites[item.eventId] || false}
            onFavoritePress={() => toggleFavorite(item.eventId)}
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
          {/* <Image source={profileImage} style={styles.profileImage} /> */}
          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
          ) : (
            <Image source={profileImage} style={styles.profileImage} />
          )}
          <Text style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>{userName}</Text>
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
    marginBottom: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
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
