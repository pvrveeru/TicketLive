import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useTheme } from '../Theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllFavouriteEvents, markEventAsDeleteFavorite } from '../services/Apiservices';
import { useFocusEffect } from '@react-navigation/native';

interface Events {
  event: any;
  eventId: number;
  title: string;
  city: string;
  state: string;
  eventDate: string;
  thumbUrl: string | null;
  isPopular: boolean;
  location: string;
}

const FavoritiesScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [favoriteEvents, setFavoriteEvents] = useState<Events[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    try {
      if (userId) {
        const events = await getAllFavouriteEvents(userId);
        setFavoriteEvents(events.favorites);
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error('Error fetching favorite events:', error);
      setIsRefreshing(false);
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

  const formatEventDateTime = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleString();
  };

  const renderEventItem = (item: Events) => {
    const eventDetails = item.event;
    const isFavorite = favoriteEvents.some((event) => event.eventId === eventDetails.eventId);
    return (
      <TouchableOpacity
        key={item.eventId}
        style={[styles.eventContainer, { backgroundColor: isDarkMode ? 'gray' : '#fff' }]}
      >
        <View style={styles.eventDetails}>
          {eventDetails.thumbUrl ? (
            <Image source={{ uri: eventDetails.thumbUrl }} style={styles.eventImage} />
          ) : (
            <Image source={require('../../assests/images/altimg.jpg')} style={styles.eventImage} />
          )}
          <Text style={[styles.eventTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{eventDetails.title}</Text>
          <Text style={[styles.eventType, { color: isDarkMode ? '#fff' : '#000' }]}>
            {eventDetails.location}
          </Text>
          <View style={styles.eventFooter}>
            <Text style={styles.eventDate}>{formatEventDateTime(eventDetails.eventDate)}</Text>
            <TouchableOpacity
              style={styles.favoriteIconContainer}
              onPress={() => handleRemoveFavorite(eventDetails.eventId)}
            >
              <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? 'red' : '#000'} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.main, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Favorite Events</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={fetchFavoriteEvents} />
        }
      >
        {Array.isArray(favoriteEvents) && favoriteEvents.length === 0 ? (
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
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
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
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 15,
  },
  eventDetails: {
    padding: 10,
    borderRadius: 8,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
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
  eventDate: {
    width: '70%',
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    flexWrap: 'wrap',
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
