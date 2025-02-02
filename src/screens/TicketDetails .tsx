import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { getTicketsByBookingId } from '../services/Apiservices';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';
import Share from 'react-native-share';
import moment from 'moment';

type RootStackParamList = {
  TicketDetails: { bookingId: number };
};

type TicketDetailsRouteProp = RouteProp<RootStackParamList, 'TicketDetails'>;

interface Ticket {
  bookingdate: string;
  bookingid: number;
  bookingstatus: string;
  conveniencefee: number;
  eventdate: string;
  eventdescription: string;
  eventid: number;
  eventlocation: string;
  gstpercentage: number;
  price: string;
  qrcode: string | null;
  seatingid: number;
  seatnumber: string | null;
  ticketid: number;
  ticketurl: string | null;
  title: string;
  type: string;
  userid: number;
  zonename: string;
}

const TicketDetails = () => {
  const route = useRoute<TicketDetailsRouteProp>();
  const { bookingId } = route.params;
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const Logo = require('../../assests/images/ticketliv_logo.png');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const result = await getTicketsByBookingId(bookingId);
        // console.log('Fetched Tickets:', result.tickets);
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

      tickets.forEach((ticket) => {
        combinedHtml += `
        <div class="vehicleimage"
            style="width:200px; margin: 3px 30px 3px 0px;">
            <img src="${Logo}" alt=""
                style="object-fit: scale-down; height: 100%; width: 100%; max-height: 150px; max-width: 250px;"/>
        </div>
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

      const file = await RNHTMLtoPDF.convert(options)
      let downloadsDir;
      if (Platform.OS === 'ios') {
        downloadsDir = `${RNFS.DocumentDirectoryPath}/Ticketliv_Tickets.pdf`;
      } else {
        downloadsDir = `${RNFS.DownloadDirectoryPath}/Ticketliv_Tickets.pdf`;
      }

      await RNFS.moveFile(file.filePath, downloadsDir);

      Alert.alert('All tickets downloaded successfully!', `The PDF has been saved to:\n${downloadsDir}`);
      return downloadsDir;
    } catch (error) {
      console.error('Error downloading tickets:', error);
      Alert.alert('Failed to download tickets. Please try again.');
    }
  };

  const handleDownloadTicket = async (ticket: Ticket) => {
    const basePrice = parseFloat(ticket?.price);
    const convenienceFee = basePrice * (ticket?.conveniencefee / 100);
    const gst = basePrice * (ticket?.gstpercentage / 100);
    const totalPrice = basePrice + convenienceFee + gst;

    try {
      let ticketHtml = `
        <h1>Ticket Details</h1>
        <img src="${Logo}" style="width:150px;"/> 
        <h2>Ticket ID: ${ticket.ticketid}</h2>
        <p><strong>Event:</strong> ${ticket.title}</p>
        <p><strong>Date and Hour:</strong> ${ticket.eventdate}</p>
        <p><strong>Location:</strong> ${ticket.eventlocation}</p>
      `;
      if (ticket?.price) {
        ticketHtml += `<p><strong>Base Price:</strong> ${basePrice.toFixed(2)}</p>`;
      }

      if (ticket?.conveniencefee) {
        ticketHtml += `<p><strong>Convenience Fee:</strong> ${convenienceFee.toFixed(2)}</p>`;
      }

      if (ticket?.gstpercentage) {
        ticketHtml += `<p><strong>GST:</strong> ${gst.toFixed(2)}</p>`;
      }

      if (ticket?.price && ticket?.conveniencefee && ticket?.gstpercentage) {
        ticketHtml += `<p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>`;
      }

      ticketHtml += ticket.qrcode
        ? `<img src="${ticket.qrcode}" style="width:100px; height:100px;"/>`
        : '<p>No QR Code available</p>';

      const options = {
        html: ticketHtml,
        fileName: `TicketLiv_Tickets`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      let downloadsDir;
      if (Platform.OS === 'ios') {
        downloadsDir = `${RNFS.DocumentDirectoryPath}/Ticketliv_Tickets.pdf`;
      } else {
        downloadsDir = `${RNFS.DownloadDirectoryPath}/Ticketliv_Tickets.pdf`;
      }

      await RNFS.moveFile(file.filePath, downloadsDir);

      Alert.alert('All tickets downloaded successfully!', `The PDF has been saved to:\n${downloadsDir}`);
      return downloadsDir;
    } catch (error) {
      console.error('Error downloading tickets:', error);
      Alert.alert('Failed to download tickets. Please try again.');
    }
  };


  const shareTicketPDF = async () => {
    try {
      let combinedHtml = `<h1>All Tickets</h1>`;

    tickets.forEach((ticket) => {
      const basePrice = parseFloat(ticket?.price);
      const convenienceFee = basePrice * (ticket?.conveniencefee / 100);
      const gst = basePrice * (ticket?.gstpercentage / 100);
      const totalPrice = basePrice + convenienceFee + gst;

      combinedHtml += `
        <div class="vehicleimage" style="width:200px; margin: 3px 30px 3px 0px;">
          <img src="${Logo}" alt="" style="object-fit: scale-down; height: 100%; width: 100%; max-height: 150px; max-width: 250px;"/>
        </div>
        <h2>Ticket ID: ${ticket.ticketid}</h2>
        <p><strong>Event:</strong> ${ticket.title}</p>
        <p><strong>Date and Hour:</strong> ${ticket.eventdate}</p>
        <p><strong>Event Location:</strong> ${ticket.eventlocation}</p>
        <p><strong>Booking ID:</strong> ${ticket.bookingid}</p>
        <p><strong>Booking Status:</strong> ${ticket.bookingstatus}</p>
        <p><strong>Seat Number:</strong> ${ticket.seatnumber}</p>
        <p><strong>QR Code:</strong></p>
        ${ticket.qrcode ? `<img src="${ticket.qrcode}" style="width: 100px; height: 100px;" />` : '<p>No QR Code available</p>'}
        
        <!-- Conditionally add Base Price -->
        ${ticket?.price ? `<p><strong>Base Price:</strong> ${basePrice.toFixed(2)}</p>` : ''}
        
        <!-- Conditionally add Convenience Fee -->
        ${ticket?.conveniencefee ? `<p><strong>Convenience Fee:</strong> ${convenienceFee.toFixed(2)}</p>` : ''}
        
        <!-- Conditionally add GST -->
        ${ticket?.gstpercentage ? `<p><strong>GST:</strong> ${gst.toFixed(2)}</p>` : ''}
        
        <!-- Add Total Price only if all relevant fields are available -->
        ${ticket?.price && ticket?.conveniencefee && ticket?.gstpercentage ? 
        `<p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>` : ''}
        
        <hr/>
      `;
    });

      const options = {
        html: combinedHtml,
        fileName: `TicketLiv_Tickets`,
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      await Share.open({
        title: 'Share Tickets',
        url: `file://${file.filePath}`,
        type: 'application/pdf',
      });
    } catch (error) {
      console.log('Error sharing tickets:', error);
      Alert.alert('Failed to share tickets. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = moment.utc(dateString);

    if (!date.isValid()) {
      return 'Invalid Date';
    }

    return date.local().format('MM-DD-YY : h:mm A');
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
        <TouchableOpacity onPress={shareTicketPDF}>
          <Icon name="share-social-outline" size={28} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
      </View>

      {tickets.map((ticket, index) => {
        const basePrice = parseFloat(ticket?.price);
        const convenienceFee = basePrice * (ticket?.conveniencefee / 100);
        const gst = basePrice * (ticket?.gstpercentage / 100);
        const totalPrice = basePrice + convenienceFee + gst;

        return (
          <View key={index} style={styles.ticketCard}>
            <View style={styles.qrContainer}>
              {ticket.qrcode ? (
                <Image source={{ uri: ticket.qrcode }} style={styles.qrCode} />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrPlaceholderText}>QR Code</Text>
                </View>
              )}
            </View>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Event</Text>
                <Text style={styles.tableCell}>{ticket.title}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Date & Time</Text>
                <Text style={styles.tableCell}>{formatDate(ticket.eventdate || '')}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Location</Text>
                <Text style={styles.tableCell}>{ticket.eventlocation}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Ticket No</Text>
                <Text style={styles.tableCell}>{ticket.ticketid}</Text>
              </View>
              {ticket?.price && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Base Price</Text>
                  <Text style={styles.tableCell}>{basePrice.toFixed(2)}</Text>
                </View>
              )}
              {ticket?.conveniencefee && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Convenience Fee (10%)</Text>
                  <Text style={styles.tableCell}>{convenienceFee.toFixed(2)}</Text>
                </View>
              )}
              {ticket?.gstpercentage && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>GST (18%)</Text>
                  <Text style={styles.tableCell}>{gst.toFixed(2)}</Text>
                </View>
              )}
              {ticket?.price && ticket?.conveniencefee && ticket?.gstpercentage && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Total Price</Text>
                  <Text style={styles.tableCell}>{totalPrice.toFixed(2)}</Text>
                </View>
              )}

            </View>

            {/* Download Button */}
            <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownloadTicket(ticket)}>
              <Text style={styles.downloadButtonText}>Download Ticket</Text>
            </TouchableOpacity>
          </View>
        );
      })}


      {/* <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadAllTickets}>
        <Text style={styles.downloadButtonText}>Download Ticket</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
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
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCode: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qrPlaceholderText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Table Styles
  tableContainer: {
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  tableCell: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right', // Aligns content to the right for better readability
  },

  downloadButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default TicketDetails;
