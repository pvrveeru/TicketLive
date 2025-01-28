// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// type EventCardProps = {
//   imageUrl: string;
//   title: string;
//   dateTime: string;
//   location: string;
//   onPress?: () => void;
// };

// const EventCard: React.FC<EventCardProps> = ({ imageUrl, title, dateTime, location, onPress }) => {
//   return (
//     <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
//       <Image source={{ uri: imageUrl }} style={styles.image} />
//       <View style={styles.content}>
//         <Text style={styles.title} numberOfLines={1}>{title}</Text>
//         <Text style={styles.dateTime}>{dateTime}</Text>
//         <Text style={styles.location} numberOfLines={1}>{location}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   cardContainer: {
//     width: 200,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     marginRight: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   image: {
//     width: '100%',
//     height: 120,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   content: {
//     padding: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   dateTime: {
//     fontSize: 12,
//     color: '#888',
//     marginBottom: 5,
//   },
//   location: {
//     fontSize: 12,
//     color: '#555',
//   },
// });

// export default EventCard;
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/globalstyles';

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
  // console.log('isFavorite', isFavorite);
  const AltImg = require('../../assests/images/altimg.jpg');
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image source={AltImg} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.dateTime}>{dateTime}</Text>
        <View style={styles.rowContainer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={25} color="#555" />
            <Text style={styles.location}>{location}</Text>
          </View>
          <TouchableOpacity onPress={onFavoritePress}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={30}
              color={isFavorite ? "red" : "#888"} // Make sure the color changes based on isFavorite
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    width: 300,
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
