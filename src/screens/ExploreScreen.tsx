/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { fetchEvents, fetchFeaturedEvents, fetchPopularEvents, getAllEventCategories, markEventAsDeleteFavorite, markEventAsFavorite } from '../services/Apiservices';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { COLORS } from '../styles/globalstyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import SkeletonLoader from '../components/SkeletonLoading';
import { useTheme } from '../Theme/ThemeContext';

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
  BottomBar: { screen: string };
  Notification: undefined;
};

type ExploreScreenRouteProps = RouteProp<RootStackParamList, 'Explore'>;

type Category = {
  categoryId: number;
  categoryName: string;
  createdAt: string;
  uniqueCategoryId: string;
  updatedAt: string;
};

interface UserData {
  userId: string;
  profileImageUrl: string;
}
interface RootState {
  userData: UserData;
}

const ExploreScreen = () => {
  const { isDarkMode } = useTheme();
  const route = useRoute<ExploreScreenRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { type } = route.params || { type: '' };
  const [eventType, setEventType] = useState<string | null>(type);
  const userData = useSelector((state: RootState) => state.userData);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [auserId, setUserId] = useState<number | null>(null);
  const [noEventsMessage, setNoEventsMessage] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  // const [skloading, setSkLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // console.log('categories', categories);
  const [placeholder, setPlaceholder] = useState('Search for events...');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    if (!categories || categories.length === 0) {return;}

    const interval = setInterval(() => {
      setPlaceholder(`Search for ${categories[currentCategoryIndex]?.categoryName || 'events'} events...`);
      setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentCategoryIndex, categories]);

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
  }, []);
  useEffect(() => {
    if (type) {
      setEventType(type);
    } else {
      setEventType(null); // Reset eventType if type is null
    }
  }, [type]);

  // console.log('auserId, type, eventType', auserId, type, eventType)
  const loadByType = async () => {
    setLoading(true);
    // setSkLoading(true);
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
          status: 'Published',
        });
      } else {
        if (eventType === 'Featured') {
          console.log('Featured API is calling');
          data = await fetchFeaturedEvents(auserId, 10);
          if (!data.result) { setNoEventsMessage('No featured events found'); }
        } else if (eventType === 'Popular') {
          console.log('Popular API is calling');
          data = await fetchPopularEvents(auserId, 10);
          if (!data.result) { setNoEventsMessage('No popular events found'); }
        } else {
          console.log('All Events API is calling');
          data = await fetchEvents({
            keyword: searchKeyword,
            sortBy: 'createdAt',
            sortOrder: 'asc',
            limit: 10,
            offset: 0,
            status: 'Published',
          });
          if (!data.result) { setNoEventsMessage('No events found'); }
        }
      }
      const currentDate = moment();
      const filteredEvents = data.result.filter((event: any) => {
        // console.log('event.eventDate', event.eventDate);
        const eventDateTime = moment(`${event.eventDate}`, 'YYYY-MM-DD HH:mm');
        return eventDateTime.isSameOrAfter(currentDate);
      });
      // console.log('filteredEvents', filteredEvents);
      setEvents(filteredEvents);
    } catch (err: any) {
      console.log('Failed to load events', err.message);
      setNoEventsMessage('Error loading events');
    } finally {
      setLoading(false);
      // setSkLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setEventType(null);
    await loadByType();
    setRefreshing(false);
  };


  useEffect(() => {
    loadByType();
  }, [searchKeyword, type, auserId, eventType]);

  useFocusEffect(
    React.useCallback(() => {
      if (auserId !== null) {
        loadByType();
      }
    }, [searchKeyword, type, auserId, eventType])
  );

  const AllCatageories = async () => {
    const result = await getAllEventCategories();
    setCategories(result);
  };
  const handleEventPress = (eventId: number | undefined) => {
    if (eventId) {
      navigation.navigate('EventDetails', { eventId });
    } else {
      console.log('Event ID is undefined');
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
        } else {
          await markEventAsFavorite({ userId: auserId, eventId });
        }
      }
    } catch (error) {
      setEvents((prevFavorites) =>
        prevFavorites.map((event) =>
          event.eventId === eventId
            ? { ...event, isFavorite: !event.isFavorite }
            : event
        )
      );
    }
  };

  // const handleNotificationPress = () => {
  //   navigation.navigate('Notification');
  // };

  // const handleProfilePress = () => {
  //   navigation.navigate('BottomBar', { screen: 'Profile' });
  // };

  const renderEventRow = ({ item }: { item: EventData[]; index: number }) => {
    const currentDateTime = new Date();

    const filteredEvents = item.filter((event) => {
      const eventDateTime = moment(`${event.eventDate}`, 'YYYY-MM-DD HH:mm');
      return eventDateTime.isSameOrAfter(currentDateTime);
    });

    return (
      <View style={styles.eventRow}>
        {filteredEvents.map((event, idx) => (
          <TouchableOpacity
            key={event.id || idx}
            style={[styles.eventCard, { backgroundColor: isDarkMode ? COLORS.darkCardColor : '#f9f9f9' }]}
            onPress={() => handleEventPress(event?.eventId)}
          >
            <View>
            <Image source={{ uri: event?.thumbUrl }} style={styles.eventImage} />
            <TouchableOpacity
                onPress={() => {
                  if (event?.eventId !== undefined) {
                    toggleFavorite(event.eventId);
                  } else {
                    console.warn('Event ID is undefined');
                  }
                }}
                style={styles.favotites}
              >
                <Ionicons
                  name={event?.isFavorite ? 'heart' : 'heart-outline'}
                  size={30}
                  color={event?.isFavorite ? 'red' : '#000'}
                />
              </TouchableOpacity>
              </View>
            <View style={styles.eventDetails}>
              <Text style={[styles.eventTitle, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{event?.title}</Text>
              <Text style={styles.eventDate}>{formatDate(event?.eventDate || '')}</Text>
              <Text style={[styles.eventDescription, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{event?.location}, {event?.city}</Text>
              {/* <Text style={[styles.eventDescription, { color: isDarkMode ? COLORS.darkTextColor : '#000', marginTop: -10 }]}>{event?.city}</Text> */}

              
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };



  const transformDataToRows = (data: EventData[]) => {
    const rows: EventData[][] = [];
    for (let i = 0; i < data?.length; i += 1) {
      rows.push(data.slice(i, i + 1));
    }
    return rows;
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const filteredEvents = selectedCategory
    ? events?.filter(event =>
      event.categoryId?.categoryId === selectedCategory &&
      (event?.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        event?.location?.toLowerCase().includes(searchKeyword.toLowerCase()))
    )
    : events?.filter(event =>
      event?.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      event?.location?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  return (
    <>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Explore Events</Text>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#000' }]}
              placeholder={placeholder}
              placeholderTextColor={isDarkMode ? '#fff' : '#000'}
              value={searchKeyword}
              onChangeText={setSearchKeyword} />
          </View>
          <Text style={[styles.eventCount, { color: isDarkMode ? '#fff' : '#000' }]}>{eventType} Total Events Count: {filteredEvents?.length ? filteredEvents?.length : events?.length}</Text>
        </View>
        <View>
          <ScrollView contentContainerStyle={styles.buttonContainer} horizontal>
            <TouchableOpacity
              style={[styles.button, selectedCategory === null && styles.selectedButton]}
              onPress={() => handleCategoryClick(null)}
            >
              <Text style={[isDarkMode ? styles.darkbuttontext : styles.buttonText,
              selectedCategory === null && styles.selectedButtontxt,
              ]}>All</Text>
            </TouchableOpacity>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TouchableOpacity
                  key={category.categoryId}
                  style={[
                    styles.button,
                    selectedCategory === category.categoryId && styles.selectedButton,
                  ]}
                  onPress={() => handleCategoryClick(category.categoryId)}
                >
                  <Text style={[
                    styles.buttonText,
                    selectedCategory === category.categoryId &&
                    styles.selectedButtontxt,
                    isDarkMode && selectedCategory !== category.categoryId
                      ? { color: 'white' }
                      : null,
                  ]}>{category.categoryName}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Loading categories...</Text>
            )}
          </ScrollView>
        </View>
        {noEventsMessage && <Text style={styles.noEventsMessage}>{noEventsMessage}</Text>}
        <View style={{ flex: 1 }}>
          {loading ? (
            <ScrollView>
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} style={{ margin: 5 }}>
                  <SkeletonLoader width="100%" height={190} borderRadius={10} />
                </View>
              ))}
            </ScrollView>
          ) : filteredEvents?.length === 0 ? (
            <Text style={[styles.noResultsText, { color: isDarkMode ? '#fff' : '#000' }]}>No events found.</Text>
          ) : (
            <FlatList
              data={transformDataToRows(filteredEvents)}
              renderItem={renderEventRow}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh} // Call the onRefresh function
                />
              } />
          )}
        </View>
      </View >
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    // marginBottom: 20,
  },
  button: {
    borderColor: '#EF412B',
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 5,
    height: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedButton: {
    backgroundColor: '#EF412B',
    marginRight: 10,
    borderRadius: 5,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  darkbuttontext: {
    color: '#fff',
    fontSize: 16,
  },
  selectedButtontxt: {
    color: '#fff',
    fontSize: 16,
  },
  favotites: {
    position: 'absolute',
    // left: '85%',
    bottom: -20,
    right: 10,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 2,    
    borderRadius: 50,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 14,
  },
  eventCount: {
    marginLeft: 0,
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  eventCard: {
    marginHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    elevation: 2,
    width: '95%',
  },
  eventImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  eventDetails: {
    padding: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventDescription: {
    marginTop: 0,
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
    textAlign: 'center',
  },
  eventDate: {
    marginTop: 0,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noEventsMessage: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ExploreScreen;
