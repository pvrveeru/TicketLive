import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/globalstyles';
import moment from 'moment';

type EventCardProps = {
  imageUrl: string;
  title: string;
  dateTime: string;
  location: string;
  isFavorite: boolean;
  onPress?: () => void;
  onFavoritePress: () => void;
};

const EventCard: React.FC<EventCardProps> = ({ onPress, imageUrl, title, dateTime, location, isFavorite, onFavoritePress }) => {
  
  const AltImg = require('../../assests/images/altimg.jpg');
   const formatDate = (dateString: string) => {
      return moment.utc(dateString).local().format('MMMM DD, YYYY hh:mm A');
    };
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image source={AltImg} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.dateTime}>{formatDate(dateTime)}</Text>
        <View style={styles.rowContainer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={25} color="#555" />
            <Text style={styles.location}>{location}</Text>
          </View>
          <TouchableOpacity onPress={onFavoritePress}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={30}
              color={isFavorite ? "red" : "#888"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    width: 250,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 16,
    color: COLORS.red,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
    width: '80%',
    flexWrap: 'wrap',
  },
});

export default EventCard;
