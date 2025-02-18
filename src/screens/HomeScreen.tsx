/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, Platform } from 'react-native';
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
import Header from '../components/Header';
import moment from 'moment';


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
  const [auserId, setUserId] = useState<number | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);
  // const userData = useSelector((state: RootState) => state.userData);
  const profileImage = require('../../assets/images/icon.png');
  // const profileImageUrl = userData?.profileImageUrl;
  // const userName = userData?.firstName;

  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

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


  useFocusEffect(
    React.useCallback(() => {
      if (auserId !== null) {
        fetchEventData(fetchFeaturedEvents, setFeaturedEvents);
        fetchEventData(fetchPopularEvents, setPopularEvents);
        // fetchEventData(fetchManualEvents, setManualEvents);
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
    // fetchEventData(fetchManualEvents, setManualEvents);
  }, []);

  const fetchEventData = async (fetchFunction: Function, setEvents: Function) => {
    setLoading(true);
    try {
      const data = await fetchFunction(auserId, 10);
      const eventList = data.result || [];
      const currentDate = moment();
      const filteredEvents = eventList.filter((event: any) => {
        const eventDateTime = moment(`${event.eventDate}`, 'YYYY-MM-DD HH:mm');
        return eventDateTime.isSameOrAfter(currentDate);
      });
      setEvents(filteredEvents);
      const updatedFavorites: { [key: number]: boolean } = {};
      eventList.forEach((event: any) => {
        updatedFavorites[event.eventId] = event.isFavorite;
      });

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        ...updatedFavorites,
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchEventData(fetchFeaturedEvents, setFeaturedEvents),
        fetchEventData(fetchPopularEvents, setPopularEvents),
        // fetchEventData(fetchManualEvents, setManualEvents),
      ]);
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // const navigateToExplore = (type: string) => {
  //   navigation.navigate('Explore', { type: type });
  // };
  const navigateToExplore = (type: string) => {
    setEventType(type);
    navigation.navigate('Explore', { type: type });
  };
  useFocusEffect(
    React.useCallback(() => {
      setEventType(null);
    }, [])
  );
  // console.log('eventType in home screen', eventType);
  const handleProfilePress = () => {
    navigation.navigate('BottomBar', { screen: 'Profile' });
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const handleEventPress = (eventId: number) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const toggleFavorite = async (eventId: number) => {
    if (!auserId) { return; }
    const isCurrentlyFavorite = favorites[eventId] || false;
    setFavorites((prevFavorites) => {
      return {
        ...prevFavorites,
        [eventId]: !isCurrentlyFavorite,
      };
    });

    try {
      if (isCurrentlyFavorite) {
        await markEventAsDeleteFavorite(auserId, eventId);
      } else {
        await markEventAsFavorite({ userId: auserId, eventId });
      }
    } catch (error) {
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
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>{title}</Text>
        <TouchableOpacity onPress={() => navigateToExplore(type)} style={styles.seeallbtn}>
          <Text style={styles.seeallbtntxt}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={events?.slice(0, 3)}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <EventCard
            imageUrl={item.thumbUrl}
            title={item.title}
            dateTime={item.startDate}
            location={item.location}
            city={item.city}
            isFavorite={favorites[item.eventId] || false}
            onFavoritePress={() => toggleFavorite(item.eventId)}
            onPress={() => handleEventPress(item.eventId)}
            loading={loading}
          />
        )}

      />
    </View>
  );

  return (
    <>
      <Header
        profileImage={require('../../assets/images/ticketliv_logo.png')}
        onNotificationPress={handleNotificationPress}
      />
      <ScrollView style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
        {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleProfilePress} style={styles.profile}>
          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
          ) : (
           {userName ? userName : null}
            <Image source={profileImage} style={styles.profileImage} />
          )}
          <Image source={profileImage} style={styles.profileImage} />
          <View>
            <Text style={isDarkMode ? styles.darkText : styles.welcome}>Welcome</Text>
            <Text style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>Ticket Live</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationPress}>
          <MaterialCommunityIcons name="bell-badge-outline" style={[styles.socialIcon, isDarkMode ? styles.darkIcon : styles.lightIcon]} />
        </TouchableOpacity>
      </View> */}
        <HomeCarousel />
        <View style={{ marginBottom: 40 }}>
          {renderEventSection('Featured Events', featuredEvents, 'Featured')}
          {renderEventSection('Popular Events', popularEvents, 'Popular')}
          {/* {renderEventSection('Manual Events', manualEvents, 'Manual')} */}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  seeallbtn: {
    backgroundColor: COLORS.red,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  seeallbtntxt: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'normal',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: Platform.OS === 'ios' ? 50 : 0,
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
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  greeting: {
    fontSize: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
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
