import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { fetchEvents, fetchFeaturedEvents, fetchManualEvents, fetchPopularEvents, getAllEventCategories, markEventAsDeleteFavorite, markEventAsFavorite } from '../services/Apiservices';
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
  const [skloading, setSkLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  console.log('eventType', eventType);
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
  useEffect(() => {
    if (type) {
      setEventType(type);
    } else {
      setEventType(null); // Reset eventType if type is null
    }
  }, [type]);

  console.log('auserId, type, eventType', auserId, type, eventType)
  const loadByType = async () => {
    setLoading(true);
    setSkLoading(true);
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
          status: "Published",
        });
      } else {
        if (eventType === 'Featured') {
          console.log('Featured API is calling');
          data = await fetchFeaturedEvents(auserId, 10);
          if (!data.result) setNoEventsMessage('No featured events found');
        } else if (eventType === 'Popular') {
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
            status: "Published",
          });
          if (!data.result) setNoEventsMessage('No events found');
        }
      }
      setEvents(data.result);
    } catch (err: any) {
      console.log('Failed to load events', err.message);
      setNoEventsMessage('Error loading events');
    } finally {
      setLoading(false);
      setSkLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setEventType(null); // Set eventType to null
    await loadByType(); // Call the function to load all events
    setRefreshing(false); // Reset refreshing state
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
  }
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

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const handleProfilePress = () => {
    navigation.navigate('BottomBar', { screen: 'Profile' });
  };

  const renderEventRow = ({ item, index }: { item: EventData[]; index: number }) => {
    return (
      <View style={styles.eventRow}>
        {item?.map((event, idx) => (
          <TouchableOpacity
            key={event.id || idx}
            style={[styles.eventCard, { backgroundColor: isDarkMode ? COLORS.darkCardColor : '#f9f9f9' }]}
            onPress={() => handleEventPress(event?.eventId)}
          >
            <Image source={{ uri: event?.thumbUrl }} style={styles.eventImage} />
            <View style={styles.eventDetails}>
              <Text style={[styles.eventTitle, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{event?.title}</Text>
              <Text style={[styles.eventDescription, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{event?.location}</Text>
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
                  color={event?.isFavorite ? "red" : "#000"}
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
      <Header
        title={'Explore Events'}
        profileImageUrl={userData?.profileImageUrl}
        profileImage={require('../../assets/images/icon.png')}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress} />
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#000' }]}
              placeholder="Search for events..."
              placeholderTextColor={isDarkMode ? '#fff' : '#000'}
              value={searchKeyword}
              onChangeText={setSearchKeyword} />
          </View>
          <Text style={[styles.eventCount, { color: isDarkMode ? '#fff' : '#000' }]}>{eventType} Events found: {filteredEvents?.length ? filteredEvents?.length : events?.length}</Text>
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
        <View style={{ marginBottom: '50%' }}>
          {loading ? (
            <ScrollView>
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} style={{ margin: 5 }}>
                  <SkeletonLoader width="100%" height={120} borderRadius={10} />
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
  noResultsText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
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
    fontSize: 12,
  },
  darkbuttontext: {
    color: '#fff',
    fontSize: 12,
  },
  selectedButtontxt: {
    color: '#fff',
    fontSize: 12,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 13,
  },
  eventCount: {
    marginLeft: 10,
    fontSize: 14,
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
