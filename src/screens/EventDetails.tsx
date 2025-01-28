import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getEventById } from '../services/Apiservices';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../styles/globalstyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';
import CustomCarousel from '../components/CustomCarousel';


interface Category {
  categoryId?: number;
  categoryName?: string;
}

interface SeatingDetail {
  seatingId?: number;
  zoneName?: string;
  capacity?: number;
  price?: string;
}

interface EventDetailsData {
  eventId?: number;
  uniqueEventId?: string;
  title?: string;
  categoryId?: Category;
  description?: string;
  brief?: string;
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  maxTicketAllowed?: number;
  ageLimit?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  city?: string;
  state?: string;
  artistName?: string;
  language?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isManual?: boolean;
  isPaid?: boolean;
  status?: string;
  stage?: string | null;
  createdAt?: string;
  updatedAt?: string;
  thumbUrl?: string;
  layoutImageUrl?: string;
  venueType?: string;
  musicType?: string;
  venueStatus?: string;
  layoutStatus?: string | null;
  totalCapacity?: number;
  partners?: string | null;
  sponsors?: string | null;
  favoritesCount?: number;
  isFavorite?: boolean;
  galleryImages?: string[];
  seatingDetails?: SeatingDetail[];
}


type RootStackParamList = {
  BookEventScreen: { eventId: number, layoutImage: string };
};

interface RouteParams {
  eventId: number;
  layoutImage: string;
}

const EventDetails: React.FC = () => {
  const { isDarkMode } = useTheme();
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { eventId } = route.params as RouteParams;

  const [eventDetails, setEventDetails] = useState<EventDetailsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const details = await getEventById(eventId);
        setEventDetails(details.data);
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color={COLORS.red} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!eventDetails) {
    return (
      <View style={styles.centered}>
        <Text>No details available for this event.</Text>
      </View>
    );
  }

  const handleBookEvent = () => {
    const layoutImage = eventDetails?.layoutImageUrl || '';
    navigation.navigate('BookEventScreen', { eventId, layoutImage });
  };

  console.log('eventDetails', eventDetails);
  return (
    <>
      <View style={[styles.header, isDarkMode ? styles.dark : styles.light]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Book Event</Text>
      </View>
      <ScrollView style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
        {/* <Image source={{ uri: eventDetails.layoutImageUrl }} style={styles.eventImage} /> */}
        {eventDetails.galleryImages && eventDetails.galleryImages.length > 0 ? (
          <CustomCarousel
            images={eventDetails.galleryImages}
            interval={3000}
            height={250}
            containerStyle={{ marginBottom: 20 }}
            imageStyle={{ borderRadius: 10 }}
          />
        ) : (
          <Image source={require('../../assests/images/altimg.jpg')} style={styles.eventImage} />
        )}
        <View style={styles.header2}>
          <Text style={styles.organizer}>By {eventDetails.artistName}</Text>
          <Text style={styles.eventName}>{eventDetails.title}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={styles.row}>
              <FontAwesome name="clock-o" size={20} color="gray" />
              <Text style={styles.text}>
                {moment(eventDetails.eventDate).format('HH:mm:ss')}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={20} color="gray" />
              <Text style={styles.text}>
                {moment(eventDetails.eventDate).format('DD/MM/YYYY')}
              </Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={20} color="gray" />
            <Text style={styles.text}>{eventDetails.location}</Text>
          </View>
        </View>
        <View style={styles.actionButtons}>

          <View style={styles.row}>
            <MaterialIcons name="group" size={20} color="gray" />
            <Text style={styles.text}>
              {eventDetails.favoritesCount} Interested
            </Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="call-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mail-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>About Event</Text>
        <Text style={styles.description}>{eventDetails.description}</Text>
        <Text style={styles.sectionTitle}>Location</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(eventDetails?.latitude ?? '0'), // Fallback to '0' if undefined or invalid
            longitude: parseFloat(eventDetails?.longitude ?? '0'), // Fallback to '0' if undefined or invalid
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(eventDetails?.latitude ?? '0'), // Fallback to '0' if undefined or invalid
              longitude: parseFloat(eventDetails?.longitude ?? '0'), // Fallback to '0' if undefined or invalid
            }}
            title={eventDetails.title}
            description={eventDetails.location}
          />
        </MapView>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookEvent}>
          <Text style={styles.bookButtonText}>Book Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 150,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  light: {
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  header2: {
    padding: 20,
  },
  spaceBetween: {
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bookButton: {
    backgroundColor: COLORS.red,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  eventImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
  },
  organizer: {
    fontSize: 14,
    color: 'gray',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 5,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: 'gray',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  iconButton: {
    backgroundColor: '#c11c84',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginHorizontal: 20,
    lineHeight: 22,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default EventDetails;
