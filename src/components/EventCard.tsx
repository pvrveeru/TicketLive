import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
  city?: string;
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
  city,
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
                {/* <Ionicons name="location-sharp" size={20} color="#555" /> */}
                <Text style={[styles.location, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{location}, {city}</Text>
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
    overflow: 'hidden',  // Ensure shadow is not clipped
    backgroundColor: '#fff',
    marginRight: 20,
    marginBottom:5,
    // borderWidth: 1, // Add border
    // borderColor: '#efefef', // Light gray border

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Adjust height for even shadow
    shadowOpacity: 0.25,
    shadowRadius: 3, // Increase for softer effect

    // Android Shadow
    elevation: 3, // Higher value for stronger shadow
  },
  image: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center'
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
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
    width: '90%',
    flexWrap: 'wrap',
     textAlign: 'center'
  },
});

export default EventCard;
