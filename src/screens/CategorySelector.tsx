import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Image, Alert } from 'react-native';
import { COLORS } from '../styles/globalstyles';
import { useTheme } from '../Theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { markEventAsFavorite } from '../services/Apiservices';

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

type RootStackParamList = {
  EventDetails: { eventId: number };
};

interface CategorySelectorProps {
  categories: string[];
  cevents: Events[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, cevents }) => {
  const AltImg = require('../../assets/images/altimg.jpg');
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredEvents, setFilteredEvents] = useState(cevents);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  console.log('userId', userId);
  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.userId); // Ensure your AsyncStorage data contains `userId`
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    getUserId();
  }, []);
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredEvents(cevents);
    } else {
      setFilteredEvents(cevents.filter((event) => event.type === selectedCategory));
    }
  }, [selectedCategory, cevents]);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEventPress = (eventId: number) => {
    console.log('eventId', eventId);
    navigation.navigate('EventDetails', { eventId });
  };

  const formatEventDateTime = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleString();
  };

  const handleFavoritePress = (eventId: number) => {
    console.log('eventId', eventId);
    if (favorites.includes(eventId)) {
      setFavorites(favorites.filter((id) => id !== eventId));
    } else {
      setFavorites([...favorites, eventId]);
    }
  };

  // const handleFavoritePress = async (eventId: number) => {
  //   if (!userId) {
  //     Alert.alert('Error', 'User not logged in.');
  //     return;
  //   }

  //   try {
  //     await markEventAsFavorite(eventId, userId);

  //     // Update the local favorites state
  //     if (favorites.includes(eventId)) {
  //       setFavorites(favorites.filter((id) => id !== eventId));
  //     } else {
  //       setFavorites([...favorites, eventId]);
  //     }

  //     Alert.alert('Success', 'Event marked as favorite!');
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to mark event as favorite. Please try again.');
  //   }
  // };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['All', ...categories].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategoryPress(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonSelected,
              {
                backgroundColor: selectedCategory === category ? COLORS.red : isDarkMode ? '#444' : '#fff',
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected,
                { color: selectedCategory === category ? 'white' : isDarkMode ? '#fff' : '#000' },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.eventsContainer}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.eventId}
              style={styles.eventContainer}
              onPress={() => handleEventPress(event.eventId)}
            >
              <View style={[styles.eventDetails, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
                {event.thumbUrl ? <Image source={{ uri: event.thumbUrl }} style={styles.eventImage} /> :
                  <Image source={AltImg} style={styles.eventImage} />}
                <Text style={[styles.eventTitle, isDarkMode ? styles.darkText : styles.lightText]}>{event.title}</Text>
                <Text style={[styles.eventType, isDarkMode ? styles.darkText : styles.lightText]}>{event.city} {event.state}</Text>
                <View style={styles.eventFooter}>
                  <Text
                    style={styles.eventDate}
                  >
                    {formatEventDateTime(event.eventDate)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleFavoritePress(event.eventId)}
                    style={styles.favoriteIconContainer}
                  >
                    <Icon
                      name={favorites.includes(event.eventId) ? 'heart' : 'heart-outline'}
                      size={30}
                      color={favorites.includes(event.eventId) ? 'red' : isDarkMode ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>
                </View>

              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noEventsText}>No events found for this category</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  eventDate: {
    width: '70%',
    fontSize: 14,
    color: COLORS.red,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  // eventDate: {
  //   fontSize: 12,

  // },
  favoriteIconContainer: {
    width: '30%', // Remaining space for the heart icon
    alignItems: 'flex-end', // Align icon to the right
    padding: 5,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkeventDate: {
    color: COLORS.red,
  },
  lightText: {
    color: '#000000',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 20,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.red,
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center',
    color: 'black',
  },
  categoryTextSelected: {
    fontWeight: 'bold',
    color: 'white',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 20,
    // borderWidth: 2,
  },
  eventContainer: {
    width: '46%',
    marginBottom: 20,
    marginRight: '4%',
  },
  eventDetails: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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
    color: 'black',
  },
  eventType: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  noEventsText: {
    fontSize: 16,
    color: '#999',
  },
});

export default CategorySelector;
