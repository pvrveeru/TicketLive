import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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
  const userData = useSelector((state: RootState) => state.userData);
  const profileImage = require('../../assests/images/icon.png');
  const profileImageUrl = userData?.profileImageUrl;
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [auserId, setUserId] = useState<number | null>(null);
  const [noEventsMessage, setNoEventsMessage] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [skloading, setSkLoading] = useState<boolean>(false);

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
            status: "Published",
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
      setSkLoading(false);
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
            style={[styles.eventCard, { backgroundColor: isDarkMode ? 'gray' : '#f9f9ff9' }]}
            onPress={() => handleEventPress(event?.eventId)}
          >
            <Image source={{ uri: event?.thumbUrl }} style={styles.eventImage} />
            <View style={styles.eventDetails}>
              <Text style={[styles.eventTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{event?.title}</Text>
              <Text style={[styles.eventDescription, { color: isDarkMode ? '#fff' : '#000' }]}>{event?.location}</Text>
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
        profileImage={require('../../assests/images/icon.png')}
        onNotificationPress={handleNotificationPress} 
        onProfilePress={handleProfilePress}/>
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
          <Text style={[styles.eventCount, { color: isDarkMode ? '#fff' : '#000' }]}>{type} Events found: {filteredEvents?.length ? filteredEvents?.length : events?.length}</Text>
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
          ) : filteredEvents.length === 0 ? (
            <Text style={[styles.noResultsText, { color: isDarkMode ? '#fff' : '#000' }]}>No events found.</Text>
          ) : (
            <FlatList
              data={transformDataToRows(filteredEvents)}
              renderItem={renderEventRow}
              keyExtractor={(item, index) => index.toString()} />
          )}
        </View>
      </View >
    </>
  );
};

const styles = StyleSheet.create({
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
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
    height: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedButton: {
    backgroundColor: '#EF412B',
    marginRight: 10,
    borderRadius: 5,
    height: 40,
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
