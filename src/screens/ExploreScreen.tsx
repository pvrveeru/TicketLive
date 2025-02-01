import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { fetchEvents, fetchFeaturedEvents, fetchManualEvents, fetchPopularEvents, getAllEventCategories, markEventAsDeleteFavorite, markEventAsFavorite } from '../services/Apiservices';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { COLORS } from '../styles/globalstyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

type Category = {
  categoryId: number;
  categoryName: string;
  createdAt: string;
  uniqueCategoryId: string;
  updatedAt: string;
};

const ExploreScreen = () => {
  const route = useRoute<ExploreScreenRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { type } = route.params || { type: '' };
  console.log('type', type);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [auserId, setUserId] = useState<number | null>(null);
  const [noEventsMessage, setNoEventsMessage] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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
    AllCatageories();
  }, [])

  const loadByType = async () => {
    setLoading(true);
    setNoEventsMessage('');
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
          console.log('All Events API is calling');
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

  useEffect(() => {
    loadByType();
  }, [searchKeyword, type, auserId]);

  useFocusEffect(
    React.useCallback(() => {
      if (auserId !== null) {
        loadByType();
      }
    }, [searchKeyword, type, auserId])
  );

  const AllCatageories = async () => {
    const result = await getAllEventCategories();
    setCategories(result);
    console.log('catageories result', result);
  }
  const handleEventPress = (eventId: number | undefined) => {
    if (eventId) {
      navigation.navigate('EventDetails', { eventId });
    } else {
      console.warn('Event ID is undefined');
    }
  };

  const formatDate = (dateString: string) => {
    return moment.utc(dateString).local().format('MMMM DD, YYYY hh:mm A');
  };

  const toggleFavorite = async (eventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventId === eventId
          ? { ...event, isFavorite: !event.isFavorite }
          : event
      )
    );

    if (auserId === null) {
      console.error("User ID is null, can't toggle favorite");
      return;
    }

    try {
      const event = events.find((e) => e.eventId === eventId);
      if (event) {
        const isCurrentlyFavorite = event.isFavorite;

        if (isCurrentlyFavorite) {
          await markEventAsDeleteFavorite(auserId, eventId);
          console.log(`Unliked event ID: ${eventId}`);
        } else {
          await markEventAsFavorite({ userId: auserId, eventId });
          console.log(`Liked event ID: ${eventId}`);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setEvents((prevFavorites) =>
        prevFavorites.map((event) =>
          event.eventId === eventId
            ? { ...event, isFavorite: !event.isFavorite }
            : event
        )
      );
    }
  };


  const renderEventRow = ({ item, index }: { item: EventData[]; index: number }) => {
    return (
      <View style={styles.eventRow}>
        {item?.map((event, idx) => (
          <TouchableOpacity
            key={event.id || idx}
            style={styles.eventCard}
            onPress={() => handleEventPress(event?.eventId)}
          >
            <Image source={{ uri: event?.thumbUrl }} style={styles.eventImage} />
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{event?.title}</Text>
              <Text style={styles.eventDescription}>{event?.location}</Text>
              <Text style={styles.eventDate}>{formatDate(event?.eventDate || '')}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (event?.eventId !== undefined) {
                    toggleFavorite(event.eventId);
                  } else {
                    console.warn("Event ID is undefined");
                  }
                }}
                style={styles.favotites}
              >
                <Ionicons
                  name={event?.isFavorite ? "heart" : "heart-outline"}
                  size={30}
                  color={event?.isFavorite ? "red" : "#888"}
                />
              </TouchableOpacity>

            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };


  const transformDataToRows = (data: EventData[]) => {
    const rows: EventData[][] = [];
    for (let i = 0; i < data?.length; i += 2) {
      rows.push(data.slice(i, i + 2));
    }
    return rows;
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const filteredEvents = selectedCategory
    ? events.filter(event => event.categoryId?.categoryId === selectedCategory)
    : events;
  return (
    <View style={styles.container}>
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
        <Text style={styles.eventCount}>{type} Events found: {filteredEvents?.length ? filteredEvents?.length : events?.length}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.buttonContainer} horizontal>
        {categories.length > 0 ? (
          categories.map((category) => (
            <TouchableOpacity
              key={category.categoryId}
              style={styles.button}
              onPress={() => handleCategoryClick(category.categoryId)}
            >
              <Text style={styles.buttonText}>{category.categoryName}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Loading categories...</Text>
        )}
      </ScrollView>
      {noEventsMessage && <Text style={styles.noEventsMessage}>{noEventsMessage}</Text>}

      {loading ? (
        <Text>Loading events...</Text>
      ) : (
        <FlatList
          data={transformDataToRows(filteredEvents)}
          renderItem={renderEventRow}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    columnGap: 20,
  },
  button: {
    backgroundColor: COLORS.red,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favotites: {
    position: 'absolute',
    left: '85%',
    bottom: 0,
    right: 0,
  },
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
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  eventCard: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventDetails: {
    padding: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  eventDate: {
    marginTop: 4,
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  noEventsMessage: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ExploreScreen;
