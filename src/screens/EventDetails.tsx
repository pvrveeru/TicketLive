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
import { RouteProp } from '@react-navigation/native';
import { getEventById } from '../services/Apiservices';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


type EventDetailsRouteParams = {
  EventDetails: {
    eventId: number;
  };
};

type EventDetailsProps = {
  route: RouteProp<EventDetailsRouteParams, 'EventDetails'>;
};

interface EventDetailsData {
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
    organizer: string;
    interestedCount: number;
    imageUrl: string;
    eventDate: string;
    eventId: number;
    brief: string;
    duration: string;
    startDate: string;
    endDate: string;
    city: string;
    state: string;
    type: string;
    isFeatured: boolean;
    isPopular: boolean;
    isPaid: boolean;
    language: string;
    noOfTickets: number;
    ageLimit: string;
    status: string;
    favoritesCount: number;
    artistName: string;
    thumbUrl: string | null;
    updatedAt: string;
    createdAt: string;
  }

const EventDetails: React.FC<EventDetailsProps> = ({ route }) => {
  const { eventId } = route.params;

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
    return <ActivityIndicator style={styles.loader} size="large" />;
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
// console.log('eventDetails', eventDetails);
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: eventDetails.imageUrl }} style={styles.eventImage} />
      <View style={styles.header}>
        <Text style={styles.organizer}>By {eventDetails.artistName}</Text>
        <Text style={styles.eventName}>{eventDetails.title}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <FontAwesome name="clock-o" size={20} color="gray" />
          <Text style={styles.text}>
            {eventDetails.eventDate}
          </Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={20} color="gray" />
          <Text style={styles.text}>{eventDetails.location}</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="group" size={20} color="gray" />
          <Text style={styles.text}>
            {eventDetails.interestedCount} Interested
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color="pink" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="call-outline" size={24} color="pink" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mail-outline" size={24} color="pink" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>About Event</Text>
      <Text style={styles.description}>{eventDetails.description}</Text>
      <Text style={styles.sectionTitle}>Location</Text>
      <View style={styles.mapPlaceholder}>
        <Text>Map Placeholder</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    padding: 20,
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
    marginVertical: 5,
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
    backgroundColor: '#f8f8f8',
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
