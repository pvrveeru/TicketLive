import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { getTicketsByBookingId } from '../services/Apiservices';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';

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
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const result = await getTicketsByBookingId(bookingId);
        console.log('Fetched Tickets:', result);
        setTickets(result.tickets);
      } catch (err) {
        setError('Failed to fetch tickets. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [bookingId]);

  const handleDownloadAllTickets = async () => {
    if (tickets.length === 0) {
      console.log('No tickets available to download.');
      return;
    }

    try {
      let combinedHtml = `<h1>All Tickets</h1>`;

      // Loop through each ticket and append its details to the combined HTML
      tickets.forEach((ticket) => {
        combinedHtml += `
          <h2>Ticket ID: ${ticket.ticketid}</h2>
          <p><strong>Event:</strong> ${ticket.title}</p>
          <p><strong>Date and Hour:</strong> ${ticket.eventdate}</p>
          <p><strong>Event Location:</strong> ${ticket.eventlocation}</p>
          <p><strong>Booking ID:</strong> ${ticket.bookingid}</p>
          <p><strong>Booking Status:</strong> ${ticket.bookingstatus}</p>
          <p><strong>Seat Number:</strong> ${ticket.seatnumber}</p>
          <p><strong>QR Code:</strong></p>
          ${ticket.qrcode ? `<img src="${ticket.qrcode}" style="width: 100px; height: 100px;" />` : '<p>No QR Code available</p>'}
          <hr/>
        `;
      });

      const options = {
        html: combinedHtml,
        fileName: `TicketLiv_Tickets`,
        directory: 'Documents',
      };

      // Generate combined PDF
      const file = await RNHTMLtoPDF.convert(options);

      // Move the PDF to the Downloads directory
      const downloadsDir = `${RNFS.DownloadDirectoryPath}/All_Tickets.pdf`;
      await RNFS.moveFile(file.filePath, downloadsDir);

      console.log(`Tickets PDF downloaded to: ${downloadsDir}`);
      Alert.alert('All tickets downloaded successfully!', `The PDF has been saved to:\n${downloadsDir}`);
    } catch (error) {
      console.error('Error downloading tickets:', error);
      Alert.alert('Failed to download tickets. Please try again.');
    }
  };

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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>E Tickets</Text>
      </View>
      {tickets.map((ticket, index) => (
        <View key={index} style={styles.ticketCard}>
          {/* QR Code */}
          <View style={styles.qrContainer}>
            {ticket.qrcode ? (
              <Image source={{ uri: ticket.qrcode }} style={styles.qrCode} />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrPlaceholderText}>QR Code</Text>
              </View>
            )}
          </View>

          {/* Ticket Details */}
          <Text style={styles.label}>Event: </Text>
          <Text style={styles.detailText}>{ticket.title}</Text>
          <Text style={styles.label}>Date and Hour: </Text>
          <Text style={styles.detailText}>{ticket.eventdate}</Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Event Location: </Text>
            {ticket.eventlocation}
          </Text>
          <Text style={styles.label}>Event Organizer: </Text>
          <Text style={styles.detailText}>{ticket.title}</Text>
        </View>
      ))}

      {/* Download All Tickets Button */}
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadAllTickets}>
        <Text style={styles.downloadButtonText}>Download Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    columnGap: 20,
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
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
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCode: {
    width: 120,
    height: 120,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  qrPlaceholderText: {
    color: '#888',
    fontSize: 14,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  downloadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicketDetails;
