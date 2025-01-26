import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getTicketsByBookingId } from '../services/Apiservices';

type RootStackParamList = {
  TicketDetails: { bookingId: number };
};

type TicketDetailsRouteProp = RouteProp<RootStackParamList, 'TicketDetails'>;

interface Ticket {
  bookingdate?: string;
  bookingid?: number;
  bookingstatus?: string;
  eventdate?: string;
  eventdescription?: string;
  eventid?: number;
  eventlocation?: string;
  qrcode?: string | null;
  seatingid?: number;
  seatnumber?: string | null;
  ticketid?: number;
  ticketurl?: string | null;
  title?: string;
  type?: string;
  userid?: number;
}

const TicketDetails = () => {
  const route = useRoute<TicketDetailsRouteProp>();
  const { bookingId } = route.params;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const result = await getTicketsByBookingId(bookingId);
        console.log('Fetched Tickets:', result);
        setTickets(result);
      } catch (err) {
        setError('Failed to fetch tickets. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [bookingId]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No ticket details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {tickets.map((ticket, index) => (
        <View key={index} style={styles.ticketCard}>
          <Text style={styles.title}>{ticket.title}</Text>
          <Text style={styles.label}>Event Description:</Text>
          <Text style={styles.value}>{ticket.eventdescription}</Text>
          <Text style={styles.label}>Event Date:</Text>
          <Text style={styles.value}>{ticket.eventdate}</Text>
          <Text style={styles.label}>Event Location:</Text>
          <Text style={styles.value}>{ticket.eventlocation}</Text>
          <Text style={styles.label}>Booking Date:</Text>
          <Text style={styles.value}>{ticket.bookingdate}</Text>
          <Text style={styles.label}>Booking Status:</Text>
          <Text style={styles.value}>{ticket.bookingstatus}</Text>
          <Text style={styles.label}>Seat Number:</Text>
          <Text style={styles.value}>{ticket.seatnumber || 'Not Assigned'}</Text>
          <Text style={styles.label}>Ticket Type:</Text>
          <Text style={styles.value}>{ticket.type}</Text>
          <Text style={styles.label}>Ticket ID:</Text>
          <Text style={styles.value}>{ticket.ticketid}</Text>
          <Text style={styles.label}>Seating ID:</Text>
          <Text style={styles.value}>{ticket.seatingid}</Text>
          <Text style={styles.label}>QR Code:</Text>
          <Text style={styles.value}>{ticket.qrcode || 'Not Available'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  ticketCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});

export default TicketDetails;
