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
  const AltImg = require('../../assests/images/altimg.jpg');
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {/* <Image source={{ uri: imageUrl || AltImg }} style={styles.image} /> */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image source={AltImg} style={styles.image}/>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.dateTime}>{dateTime}</Text>
        <View style={styles.rowContainer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color="#555" />
            <Text style={styles.location} numberOfLines={1}>{location}</Text>
          </View>
          <TouchableOpacity onPress={onFavoritePress}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "red" : "#888"} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
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
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 12,
    color: COLORS.red,
    marginBottom: 5,
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
    fontSize: 12,
    color: '#555',
    marginLeft: 5,
  },
});

export default EventCard;
