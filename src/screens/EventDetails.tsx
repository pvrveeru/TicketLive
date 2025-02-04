import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getBookingsByUserId, getEventById, markEventAsDeleteFavorite, markEventAsFavorite } from '../services/Apiservices';
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
import { useSelector } from 'react-redux';
import SeeMoreText from '../components/SeeMoreText';
import { GetLocation, RequestLocationPermission } from '../components/RequestLocationPermission';


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
  tnc: string;
  noOfTicketsBookedByYou: number;
}


type RootStackParamList = {
  BookEventScreen: { eventId: number, layoutImage: string, maxTickets: number, noOfTickets: number };
  FullMapScreen: {
    latitude: number;
    longitude: number;
    title: string;
    location: string;
  };
};

interface RouteParams {
  eventId: number;
  layoutImage: string;
}
interface UserData {
  userId: number;
}
interface RootState {
  userData: UserData;
}

const EventDetails: React.FC = () => {
  const { isDarkMode } = useTheme();
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { eventId } = route.params as RouteParams;
  const userData = useSelector((state: RootState) => state.userData);
  const userId = userData.userId;

  const [eventDetails, setEventDetails] = useState<EventDetailsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const details = await getEventById(eventId);
        setEventDetails(details.data);
        setIsFavorite(details.data.isFavorite);
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookingsByUserId(userId.toString());
      // console.log('data.bookings', data.bookings);
    } catch (error) {
      console.error('error fetching bookings', error);
    }
  };
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await markEventAsDeleteFavorite(userId, eventId);
      } else {
        await markEventAsFavorite({ userId: userId, eventId });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to update favorite status', err);
    }
  };

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
    const maxTickets = eventDetails?.maxTicketAllowed || 0;
    const noOfTickets = eventDetails?.noOfTicketsBookedByYou || 0;
    navigation.navigate('BookEventScreen', { eventId, layoutImage, maxTickets, noOfTickets });
  };
  const handleBackPress = () => {
    navigation.goBack();
  };
  console.log('eventDetails', eventDetails);

  const handleMarkerPress = () => {
    navigation.navigate('FullMapScreen', {
      latitude: parseFloat(eventDetails?.latitude ?? '0'),
      longitude: parseFloat(eventDetails?.longitude ?? '0'),
      title: eventDetails?.title ?? 'Unknown Title',
      location: eventDetails?.location ?? 'Unknown Location',
    });
  };

  const mobilecalling = () => {
    Linking.openURL(`tel:${'+91' + 9949220002}`);
  };

  const navigateToEmail = () => {
    const email = "support@ticketliv.com";
    const subject = "Support Request";
    const body = "Hello, I need help with...";

    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoURL).catch((err) =>
      console.error("Failed to open email client", err)
    );
  };

  const handleViewDirections = async () => {
    await GetLocation();
  };

  return (
    <>
      <ScrollView style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
        {eventDetails?.galleryImages && eventDetails?.galleryImages.length > 0 ? (
          <CustomCarousel
            images={eventDetails?.galleryImages}
            interval={3000}
            height={300}
            containerStyle={{ marginBottom: 20 }}
            imageStyle={{ borderRadius: 10 }}
            artistName={eventDetails?.artistName}
            eventTitle={eventDetails?.title}
            onBackPress={handleBackPress}
          />
        ) : (
          <Image source={require('../../assests/images/altimg.jpg')} style={styles.eventImage} />
        )}
        <View style={styles.detailsContainer}>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={styles.row}>
              <FontAwesome name="clock-o" size={20} color="gray" />
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
                {moment(eventDetails?.eventDate).format('HH:mm:ss')}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={20} color="gray" />
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
                {moment(eventDetails?.eventDate).format('DD/MM/YYYY')}
              </Text>
            </View>
            <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={30} color={isFavorite ? "red" : "#888"} />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={20} color="gray" />
            <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>{eventDetails?.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={styles.row}>
              <Ionicons name="language-outline" size={20} color="gray" />
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>{eventDetails?.language}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>Duration:</Text>
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>{eventDetails?.duration}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>

          <View style={styles.row}>
            <MaterialIcons name="group" size={20} color="gray" />
            <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
              {eventDetails?.favoritesCount} Interested
            </Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={mobilecalling}>
            <Ionicons name="call-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={navigateToEmail}>
            <Ionicons name="mail-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>About Event</Text>
        <SeeMoreText text={eventDetails?.description ?? ""} maxLength={40} />

        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Location</Text>
        <View>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(eventDetails?.latitude ?? '0'),
              longitude: parseFloat(eventDetails?.longitude ?? '0'),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(eventDetails?.latitude ?? '0'),
                longitude: parseFloat(eventDetails?.longitude ?? '0'),
              }}
              title={eventDetails?.title}
              description={eventDetails?.location}
              onPress={handleMarkerPress}
            />
          </MapView>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: '#ff5722',
              padding: 12,
              borderRadius: 50,
              elevation: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={handleViewDirections}
          >
            <Ionicons name="navigate-outline" size={24} color="white" />
            <Text style={{ color: 'white', marginLeft: 5 }}>View Directions</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Terms & Conditions</Text>
        <SeeMoreText text={eventDetails?.tnc ?? ""} maxLength={70} />
        <TouchableOpacity
          style={[
            styles.bookButton,
            eventDetails?.noOfTicketsBookedByYou === eventDetails?.maxTicketAllowed && styles.disabledButton,
          ]}
          onPress={handleBookEvent}
          disabled={eventDetails?.noOfTicketsBookedByYou === eventDetails?.maxTicketAllowed}
        >
          <Text style={styles.bookButtonText}>Book Event</Text>
        </TouchableOpacity>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: 'gray',
    opacity: 0.6,
  },
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
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
  },
  heartButton: {
    borderWidth: 1,
    borderColor: '#c11c84',
    padding: 5,
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
