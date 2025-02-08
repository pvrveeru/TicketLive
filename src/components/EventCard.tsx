import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/globalstyles';
import moment from 'moment';
import SkeletonLoader from './SkeletonLoading';
import { useTheme } from '../Theme/ThemeContext';
// import SkeletonLoading from './SkeletonLoading';

type EventCardProps = {
  imageUrl?: string;
  title?: string;
  dateTime?: string;
  location?: string;
  isFavorite: boolean;
  onPress?: () => void;
  onFavoritePress: () => void;
  loading: boolean;
};

const EventCard: React.FC<EventCardProps> = ({
  onPress,
  imageUrl,
  title,
  dateTime,
  location,
  isFavorite,
  onFavoritePress,
  loading,
}) => {
  const { isDarkMode } = useTheme();
  const AltImg = require('../../assets/images/altimg.jpg');

  const formatDate = (dateString: string) => {
    return moment.utc(dateString).local().format('MMMM DD, YYYY hh:mm A');
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {loading ? (
        <>
          <SkeletonLoader width="100%" height={150} borderRadius={10} />
          <View style={styles.content}>
            <SkeletonLoader width="80%" height={20} borderRadius={4} />
            <SkeletonLoader width="60%" height={15} borderRadius={4} style={{ marginVertical: 5 }} />
            <View style={styles.rowContainer}>
              <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={25} color="#555" />
                <SkeletonLoader width="50%" height={15} borderRadius={4} />
              </View>
              <TouchableOpacity>
                <SkeletonLoader width={30} height={30} borderRadius={15} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <Image source={AltImg} style={styles.image} />
          )}
          <View style={[styles.content, { backgroundColor: isDarkMode ? COLORS.darkCardColor : '#fff' }]}>
            <Text style={[styles.title, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]} numberOfLines={1}>{title}</Text>
            <Text style={[styles.dateTime, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{formatDate(dateTime || '')}</Text>
            <View style={styles.rowContainer}>
              <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={25} color="#555" />
                <Text style={[styles.location, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{location}</Text>
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
        </>
      )}
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
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
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
