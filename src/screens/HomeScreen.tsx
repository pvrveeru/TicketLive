import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import sampleEvents from '../config/sample.json';
import CategorySelector from './CategorySelector';
import { COLORS } from '../styles/globalstyles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BottomBar'>;

type Event = {
  id: number;
  eventName: string;
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

  const toggleFavorite = (id: number) => {
    setEvents(events.map(event => (event.id === id ? { ...event, isFavorite: !event.isFavorite } : event)));
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const handleSeeAll = () => {
    navigation.navigate('AllEvents');
  };

  return (
    <ScrollView style={styles.container}>
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
      <SearchBar />
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
              <Text style={styles.eventName}>{event.eventName}</Text>
              <Text style={styles.eventDetails}>{event.date}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(event.id)} style={styles.favoriteIcon}>
                <Text>{event.isFavorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.popularSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Event 🔥</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <CategorySelector />
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
    color: COLORS.red,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  categoryButtonSelected: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
  categoryTextSelected: {
    fontWeight: 'bold',
    color: 'blue',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});

export default HomeScreen;
