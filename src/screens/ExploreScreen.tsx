import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { fetchEvents, fetchFeaturedEvents, fetchManualEvents, fetchPopularEvents } from '../services/Apiservices';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EventData = {
  id: any;
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
  Explore: { type: string };
  EventDetails: { eventId: number };
};

type ExploreScreenRouteProps = RouteProp<RootStackParamList, 'Explore'>;

const ExploreScreen = () => {
  const route = useRoute<ExploreScreenRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { type } = route.params || { type: '' };
  console.log('type', type);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [auserId, setUserId] = useState<number | null>(null);
  const [noEventsMessage, setNoEventsMessage] = useState<string>(''); // New state to hold no events message

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
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
    const loadByType = async () => {
      setLoading(true);
      setNoEventsMessage(''); // Clear any previous no events message
      try {
        let data;
        if (auserId === null) {
          console.log('User ID is null, skipping type-specific API calls');
          data = await fetchEvents({
            keyword: searchKeyword,
            sortBy: 'createdAt',
            sortOrder: 'asc',
            limit: 10,
            offset: 0,
          });
        } else {
          if (type === 'Featured') {
            console.log('Featured API is calling');
            data = await fetchFeaturedEvents(auserId, 10);
            if (!data.result) setNoEventsMessage('No featured events found');
          } else if (type === 'Manual') {
            console.log('Manual API is calling');
            data = await fetchManualEvents(auserId, 10);
            if (!data.result) setNoEventsMessage('No manual events found');
          } else if (type === 'Popular') {
            console.log('Popular API is calling');
            data = await fetchPopularEvents(auserId, 10);
            if (!data.result) setNoEventsMessage('No popular events found');
          } else {
            data = await fetchEvents({
              keyword: searchKeyword,
              sortBy: 'createdAt',
              sortOrder: 'asc',
              limit: 10,
              offset: 0,
            });
            if (!data.result) setNoEventsMessage('No events found');
          }
        }
        setEvents(data.result);
      } catch (err) {
        console.log('Failed to load events', err);
        setNoEventsMessage('Error loading events');
      } finally {
        setLoading(false);
      }
    };

    loadByType();
  }, [searchKeyword, type, auserId]);

  const handleEventPress = (eventId: number | undefined) => {
    if (eventId) {
      navigation.navigate('EventDetails', { eventId });
    } else {
      console.warn('Event ID is undefined');
    }
  };

  const renderEventItem = ({ item }: { item: EventData }) => (
    <View style={styles.eventItem}>
      <TouchableOpacity onPress={() => handleEventPress(item.eventId)}>
        <Image source={{ uri: item.thumbUrl }} style={styles.eventImage} />
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDescription}>{item.brief}</Text>
          <Text style={styles.eventLocation}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Explore Events and Search Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Events</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for events..."
            value={searchKeyword}
            onChangeText={setSearchKeyword}
          />
        </View>
        <Text style={styles.eventCount}>Events found: {events?.length}</Text>
      </View>

      {/* Message when no events are found */}
      {noEventsMessage && <Text style={styles.noEventsMessage}>{noEventsMessage}</Text>}

      {/* Event List */}
      {loading ? (
        <Text>Loading events...</Text>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  eventCount: {
    marginLeft: 10,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  eventImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
  },
  eventLocation: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  noEventsMessage: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ExploreScreen;
