/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useTheme } from '../Theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllFavouriteEvents, markEventAsDeleteFavorite } from '../services/Apiservices';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SkeletonLoader from '../components/SkeletonLoading';
import { COLORS } from '../styles/globalstyles';
import moment from 'moment';
import { formatDate } from '../utils/Time';
interface Events {
  event: any;
  eventId: number;
  title: string;
  city: string;
  state: string;
  eventDate: string;
  startDate?: string;
  thumbUrl: string | null;
  isPopular: boolean;
  location: string;
}
type RootStackParamList = {
  EventDetails: { eventId: number };
  BottomBar: { screen: string };
  Notification: undefined;
};

interface UserData {
  userId: string;
  profileImageUrl: string;
}
interface RootState {
  userData: UserData;
}
const FavoritiesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode } = useTheme();
  const userData = useSelector((state: RootState) => state.userData);
  // const profileImage = require('../../assets/images/icon.png');
  // const profileImageUrl = userData?.profileImageUrl;
  const [favoriteEvents, setFavoriteEvents] = useState<Events[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
console.log('favoriteEvents', favoriteEvents);
  const handleProfilePress = () => {
    navigation.navigate('BottomBar', { screen: 'Profile' });
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.userId);
        }
      } catch (error: any) {
        console.error('Error fetching user data from AsyncStorage:', error.message);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchFavoriteEvents();
    }
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoriteEvents();
    }, [userId])
  );

  const fetchFavoriteEvents = async () => {
    setLoading(true);
    try {
      if (userId) {
        const events = await getAllFavouriteEvents(userId);
        const currentDate = moment();
        const filteredEvents = events.favorites.filter((event: any) => {
          const eventDateTime = moment(`${event.event.eventDate}`, 'YYYY-MM-DD HH:mm');
          return eventDateTime.isSameOrAfter(currentDate);
        });
        setFavoriteEvents(filteredEvents);
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error('Error fetching favorite events:', error);
      setIsRefreshing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (eventId: number) => {
    try {
      if (userId) {
        await markEventAsDeleteFavorite(userId, eventId);
        fetchFavoriteEvents();
      }
    } catch (error) {
      console.error('Error removing favorite event:', error);
    }
  };

  // const formatDate = (dateString: string) => {
  //   return moment.utc(dateString).local().format('MMMM DD, YYYY hh:mm A');
  // };

  const handleEventPress = (eventId: number) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const renderEventItem = (item: Events) => {
    const eventDetails = item.event;
    const isFavorite = favoriteEvents.some((event) => event.eventId === eventDetails.eventId);
    return (
      <TouchableOpacity
        key={item.eventId}
        style={[styles.eventContainer, { backgroundColor: isDarkMode ? COLORS.darkCardColor : '#fff' }]}
        onPress={() => handleEventPress(eventDetails.eventId)}
      >
        <View style={styles.eventDetails}>

          {eventDetails.thumbUrl ? (
            <Image source={{ uri: eventDetails.thumbUrl }} style={styles.eventImage} />
          ) : (
            <Image source={require('../../assets/images/altimg.jpg')} style={styles.eventImage} />
          )}
           <TouchableOpacity
            style={styles.favotites}
            onPress={() => handleRemoveFavorite(eventDetails.eventId)}
          >
            <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? 'red' : '#000'} />
          </TouchableOpacity>

          <View style={styles.eventDetails}>
            <Text style={[styles.eventTitle, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{eventDetails.title}</Text>
            <Text style={styles.eventDate}>{formatDate(eventDetails.startDate)}</Text>
            <Text style={[styles.eventDescription, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{eventDetails.location}, {eventDetails.city}</Text>
            {/* <Text style={[styles.eventDescription, { color: isDarkMode ? COLORS.darkTextColor : '#000', marginTop: -10, }]}>{eventDetails.city}</Text> */}
          </View>


        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>

      <View style={[styles.main, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
        <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>My Favorities</Text>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchFavoriteEvents} />}
        >
          {/* <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>My Favorities</Text> */}
          {/* {Array.isArray(favoriteEvents) && favoriteEvents.length === 0 ? (
            <Text style={[styles.noResultsText, { color: isDarkMode ? '#fff' : '#000' }]}>
              No favorite events found.
            </Text>
          ) : (
            Array.isArray(favoriteEvents) ? (
              favoriteEvents.map((event) => renderEventItem(event))
            ) : (
              <Text style={[styles.noResultsText, { color: isDarkMode ? '#fff' : '#000' }]}>
                Error loading events.
              </Text>
            )
          )} */}
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <SkeletonLoader width="100%" height={200} borderRadius={10} />
              </View>

            ))
          ) : favoriteEvents.length === 0 ? (
            <Text style={[styles.noResultsText, { color: isDarkMode ? '#fff' : '#000' }]}>No favorite events found.</Text>
          ) : (
            favoriteEvents.map((event) => renderEventItem(event))
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
  },
  favotites: {
    position: 'absolute',
    // left: '85%',
    top: 145,
    right: 10,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 50,
  },
  main: {
    flex: 1,
    padding: 15,
  },
  container: {
    flexGrow: 1,
  },
  eventContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,

  },
  eventDetails: {
    padding: 0,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderBlockColor: '#efefef',
    // borderWidth: 1, // Add border
    // borderColor: '#efefef', // Light gray border
  },
  eventImage: {
    width: '100%',
    height: 160,
    marginBottom: 0,
  },
  eventType: {
    color: 'gray',
    marginTop: 5,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventDescription: {
    marginTop: 0,
    fontSize: 16,
    color: '#777',
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  eventDate: {
    marginTop: 0,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  favoriteIconContainer: {
    padding: 5,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
  },
});

export default FavoritiesScreen;
