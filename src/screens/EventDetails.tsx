/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { Dialog } from '@rneui/themed';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to show directions.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};


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
  const [locationLoading, setLocationLoading] = useState(false);
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
      console.log('data.bookings', data.bookings);
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
  // console.log('eventDetails', eventDetails);

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
    const email = 'support@ticketliv.com';
    const subject = 'Support Request';
    const body = 'Hello, I need help with...';

    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoURL).catch((err) =>
      console.error('Failed to open email client', err)
    );
  };

  // const handleViewDirections = async () => {
  //   const hasPermission = await requestLocationPermission();
  //   setLocationLoading(true);
  //   console.log('hasPermission', hasPermission);
  //   if (!hasPermission) {
  //     Alert.alert('Permission Denied', 'Location permission is required to show directions.');
  //     return;
  //   }

  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const { latitude, longitude } = position.coords;
  //       console.log('latitude, longitude', latitude, longitude);
  //       setLocationLoading(false);
  //       openMaps(eventDetails?.latitude, eventDetails?.longitude)
  //     },
  //     error => {
  //       console.log('Error fetching location', error);
  //       Alert.alert('Error', 'Unable to fetch current location. Please try again.');
  //       setLocationLoading(false);
  //     },
  //     { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
  //   );
  // };

  // const openMaps = (lat: string | undefined, lng: string | undefined): void => {
  //   const scheme = Platform.select({
  //     ios: 'maps://0,0?q=',
  //     android: 'geo:0,0?q=',
  //   });
  //   const latLng = `${lat},${lng}`;
  //   const url = Platform.select({
  //     ios: `${scheme}@${latLng}`,
  //     android: `${scheme}${latLng}`,
  //   });

  //   if (url) {
  //     Linking.openURL(url);
  //   }
  // };
console.log('eventDetails?.tnc', eventDetails?.tnc);
  return (
    <>
      <ScrollView style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
        {eventDetails?.galleryImages && eventDetails?.galleryImages.length > 0 ? (
          <CustomCarousel
            images={eventDetails?.galleryImages}
            interval={3000}
            height={300}
            containerStyle={{ marginBottom: 20 }}
            imageStyle={{ borderRadius: 20 }}
            artistName={eventDetails?.artistName}
            eventTitle={eventDetails?.title}
            onBackPress={handleBackPress}
          />
        ) : (
          <Image source={require('../../assets/images/altimg.jpg')} style={styles.eventImage} />
        )}
        <View style={styles.detailsContainer}>
          <View style={[styles.row, styles.spaceBetween]}>
          <View style={styles.row}>
              <Ionicons name="calendar-outline" size={20} color="gray" />
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
                {moment(eventDetails?.eventDate).format('MMMM DD, YYYY')}
              </Text>
            </View>
            <View style={styles.row}>
              <FontAwesome name="clock-o" size={20} color="gray" />
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
                {moment(eventDetails?.eventDate).format('hh:mm A')}
              </Text>
            </View>

            <View style={styles.row}>
              <FontAwesome name="clock-o" size={20} color="gray" />
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>{eventDetails?.duration}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={20} color="gray" />
            <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>{eventDetails?.location}, {eventDetails?.city}, {eventDetails?.state}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={styles.row}>
              <Ionicons name="language-outline" size={20} color="gray" />
              <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>{eventDetails?.language}</Text>
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
          <View style={{ flexDirection: 'row', columnGap: 20 }}>
            {/* <TouchableOpacity style={styles.iconButton} onPress={mobilecalling}>
              <Ionicons name="call-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={navigateToEmail}>
              <Ionicons name="mail-outline" size={24} color="white" />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? 'red' : '#888'} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>About Event</Text>
        <SeeMoreText text={eventDetails?.description ?? ''} maxLength={40} />

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
            scrollEnabled={false} // Disable scrolling
            zoomEnabled={false} // Optional: Disable zooming
            rotateEnabled={false} // Optional: Disable rotation
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
              bottom: 10,
              right: 30,
              backgroundColor: '#ff5722',
              padding: 5,
              borderRadius: 50,
              elevation: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            //onPress={handleViewDirections}
          >
            <Ionicons name="navigate-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <SeeMoreText text={eventDetails?.tnc ?? ''} maxLength={40} />
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Terms & Conditions</Text>
      </ScrollView>
      <View style={{ backgroundColor: isDarkMode ? '#000' : '#fff' }}>
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
      </View>
      <Dialog isVisible={locationLoading}>
        {/* <Dialog.Loading /> */}
        <ActivityIndicator
          size="large"
          color={COLORS.red}
        />
        <Text style={{ color: isDarkMode ? '#000' : '#000', textAlign: 'center' }}>Fetching...</Text>
      </Dialog>
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
    marginHorizontal: 20,
    marginVertical: 5,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderWidth: 2,
    borderColor: 'red',
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
    fontSize: 13,
    color: 'gray',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 25,
  },
  iconButton: {
    backgroundColor: '#c11c84',
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
  },
  heartButton: {
    // borderWidth: 1,
    // borderColor: '#c11c84',
    // padding: 5,
    // borderRadius: 50,
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  sectionTitle: {
    fontSize: 16,
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
    borderRadius: 0,
  },
});

export default EventDetails;
