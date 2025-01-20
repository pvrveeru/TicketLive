import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import sampleEvents from '../config/sample.json';
import CategorySelector from './CategorySelector';
import { COLORS } from '../styles/globalstyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../Theme/ThemeContext';
import { getAllEvents } from '../services/Apiservices';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BottomBar'>;

type Event = {
  id: number;
  eventName: string;
  date: string;
  location: string;
  category: string;
  imageUrl: string;
  isFavorite: boolean,
};

interface Events {
  ageLimit: string;
  artistName: string;
  brief: string;
  city: string;
  createdAt: string;
  description: string;
  duration: string;
  endDate: string;
  eventDate: string;
  eventId: number;
  isFeatured: boolean;
  isManual: boolean;
  isPaid: boolean;
  isPopular: boolean;
  language: string;
  location: string;
  noOfTickets: number;
  startDate: string;
  state: string;
  status: string;
  thumbUrl: string | null;
  title: string;
  type: string;
  updatedAt: string;
}

const HomeScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const profileImage = require('../../assests/images/icon.png');

  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State to hold the search query
  const [allevents, setAllEvents] = useState<Events[]>();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setAllEvents(data.data);
        // console.log('all events data', data.data);
      } catch (err) {
        console.log('Error fetching events:', err);
      }
    };

    fetchEvents(); // Call the fetch function
  }, []);
  const uniqueEventTypes = Array.from(new Set(allevents?.map((event: Events) => event.type)));
  // console.log('all events data47', allevents);
  // console.log('all event types:', uniqueEventTypes);
  //   const filteredPopularEvents = allevents?.filter((event: Events) => event.isPopular !== undefined);
  // console.log('All events:', filteredPopularEvents);
  const toggleFavorite = (id: number) => {
    setEvents(events.map(event => (event.id === id ? { ...event, isFavorite: !event.isFavorite } : event)));
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const handleSeeAll = () => {
    navigation.navigate('AllEvents');
  };

  // Filter events based on the search query
  const filteredEvents = events.filter(event =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <View>
          <Text style={[styles.greeting, isDarkMode ? styles.darkText : styles.lightText]}>Good Morning 👋</Text>
          <Text style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>Andrew Ainsley</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationPress}>
          <MaterialCommunityIcons name="bell-badge-outline" style={[styles.socialIcon, isDarkMode ? styles.darkIcon : styles.lightIcon]} />
        </TouchableOpacity>
      </View>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>Featured</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={[styles.seeAll, isDarkMode ? styles.darkText : styles.lightText]}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollview}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <TouchableOpacity key={event.id} style={[styles.eventCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
                <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
                <Text style={[styles.eventName, isDarkMode ? styles.darkText : styles.lightText]}>{event.eventName}</Text>
                <Text style={[styles.eventDetails, isDarkMode ? styles.darkText : styles.lightText]}>{event.date}</Text>
                <Text style={[styles.eventLocation, isDarkMode ? styles.darkText : styles.lightText]}>{event.location}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(event.id)} style={styles.favoriteIcon}>
                  {/* <Text>{event.isFavorite ? '❤️' : '🤍'}</Text> */}
                  <MaterialCommunityIcons
                    name={event.isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={event.isFavorite ? COLORS.red : 'gray'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.noResultsText, isDarkMode ? styles.darkText : styles.lightText]}>
              No events found.
            </Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.popularSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>Popular Event 🔥</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, isDarkMode ? styles.darkText : styles.lightText]}>See All</Text>
          </TouchableOpacity>
        </View>
        <CategorySelector categories={uniqueEventTypes} cevents={allevents || []} />
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
  featuredSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: COLORS.red,
  },
  scrollview: {
    marginVertical: 10,
  },
  eventCard: {
    width: 250,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#333333',
  },
  lightCard: {
    backgroundColor: '#f8f8f8',
  },
  eventImage: {
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDetails: {
    color: 'gray',
  },
  eventLocation: {
    color: 'gray',
  },
  favoriteIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  popularSection: {},
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
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default HomeScreen;
