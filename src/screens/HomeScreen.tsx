import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  image: any;
  isFavorite: boolean;
}

const HomeScreen: React.FC = () => {
  const profileImage = require('../../assests/images/icon.png');
  const eventImage = require('../../assests/images/ticketliv_logo.png');

  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: 'National Music Festival', date: 'Mon. Dec 24 18.00-23.00 PM', location: 'Grand Park, New York', image: eventImage, isFavorite: false },
    { id: 2, name: 'Art Expo 2025', date: 'Tue. Jan 14 10.00-17.00 PM', location: 'Art Center, LA', image: eventImage, isFavorite: false },
    { id: 3, name: 'Tech Workshop', date: 'Sat. Feb 10 09.00-18.00 PM', location: 'Tech Hub, SF', image: eventImage, isFavorite: false },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', '♫Music', 'Art', 'Workshops'];

  const toggleFavorite = (id: number) => {
    setEvents(events.map(event => (event.id === id ? { ...event, isFavorite: !event.isFavorite } : event)));
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
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
        <TouchableOpacity style={styles.notificationIcon}>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={{ color: 'grey' }}>What event are you looking for</Text>
      </View>

      {/* Featured Section */}
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {events.map(event => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <Image source={event.image} style={styles.eventImage} />
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDetails}>{event.date}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(event.id)} style={styles.favoriteIcon}>
                <Text>{event.isFavorite ? '❤️' : '🤍'}</Text>
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
    backgroundColor: '#fff',
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
  searchBar: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
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
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
    marginRight: 10,
    width: 350,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
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
    marginLeft: 'auto',
    fontSize: 20,
  },
});

export default HomeScreen;
