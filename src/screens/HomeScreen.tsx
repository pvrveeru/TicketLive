import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import sampleEvents from '../config/sample.json';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BottomBar'>;

type Event = {
  id: number;
  name: string;
  date: string;
  location: string;
  category: string;
  imageUrl: any;
  isFavorite: boolean,
};


const HomeScreen: React.FC = () => {
  // console.log('sampleEvents', sampleEvents);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const profileImage = require('../../assests/images/icon.png');
  // const eventImage = require('../../assests/images/ticketliv_logo.png');

  const [events, setEvents] = useState<Event[]>(sampleEvents);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', '♫Music', 'Art', 'Workshops'];

  const toggleFavorite = (id: number) => {
    setEvents(events.map(event => (event.id === id ? { ...event, isFavorite: !event.isFavorite } : event)));
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification'); // Navigate to the Notification screen
  };

  const handleSeeAll = () => {
    navigation.navigate('AllEvents');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.name}>Andrew Ainsley</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationPress}>
          <Text style={styles.socialIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar />

      {/* Featured Section */}
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollview}>
          {events.map(event => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <Image source={event.imageUrl} style={styles.eventImage} />
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDetails}>{event.date}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(event.id)} style={styles.favoriteIcon}>
                <Text style={{fontSize: 20}}>{event.isFavorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Section */}
      <View style={styles.popularSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Event 🔥</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategoryPress(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    color: 'blue',
  },
  scrollview: {
    marginVertical: 10,
  },
  eventCard: {
    width: 250,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    elevation: 3,
  },
  // eventCard: {
  //   backgroundColor: '#fff',
  //   borderRadius: 8,
  //   // elevation: 3,
  //   // shadowColor: '#000',
  //   // shadowOffset: { width: 0, height: 2 },
  //   // shadowOpacity: 0.2,
  //   // shadowRadius: 4,
  //   padding: 10,
  //   marginRight: 10,
  //   width: '20%',
  //   borderWidth: 2,
  //   borderColor: 'red',
  // },
  eventImage: {
    // width: '90%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'contain',
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
  categoryButton: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonSelected: {
    backgroundColor: 'red',
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    color: 'grey',
  },
  categoryTextSelected: {
    color: 'white',
  },
  notificationIcon: {
    padding: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    marginLeft: 'auto',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    width: 40, // Set a fixed width
    height: 40, // Set a fixed height to make it a circle
  },
  socialIcon: {
    fontSize: 20, // Adjust the font size for the bell icon
  },
});

export default HomeScreen;
