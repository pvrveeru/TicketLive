/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { getTicketsByBookingId } from '../services/Apiservices';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';
import Share from 'react-native-share';
// import moment from 'moment';
import { COLORS } from '../styles/globalstyles';
import { formatDate } from '../utils/Time';

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
  startdate: string;
  endDate: string;
}

const TicketDetails = () => {
  const route = useRoute<TicketDetailsRouteProp>();
  const { bookingId } = route.params;
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const Logo = require('../../assets/images/ticketliv_logo.png');

  // const formatDate = (dateString: string) => {
  //   const date = moment.utc(dateString);

  //   if (!date.isValid()) {
  //     return 'Invalid Date';
  //   }

  //   return date.local().format('MM-DD-YY : h:mm A');
  // };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const result = await getTicketsByBookingId(bookingId);
        console.log('Fetched Tickets:', result.tickets);
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

  // const handleDownloadTicket = async (ticket: Ticket) => {
  //   const basePrice = parseFloat(ticket?.price);
  //   const convenienceFee = basePrice * (ticket?.conveniencefee / 100);
  //   const gst = basePrice * (ticket?.gstpercentage / 100);
  //   const totalPrice = basePrice + convenienceFee + gst;

  //   try {
  //     let ticketHtml = `
  //       <h1>Ticket Details</h1>
  //       <img src="${Logo}" style="width:150px;"/>
  //       <h2>Ticket ID: ${ticket.ticketid}</h2>
  //       <p><strong>Event:</strong> ${ticket.title}</p>
  //       <p><strong>Date and Hour:</strong> ${ticket.eventdate}</p>
  //       <p><strong>Location:</strong> ${ticket.eventlocation}</p>
  //     `;
  //     if (ticket?.price) {
  //       ticketHtml += `<p><strong>Base Price:</strong> ${basePrice.toFixed(2)}</p>`;
  //     }

  //     if (ticket?.conveniencefee) {
  //       ticketHtml += `<p><strong>Convenience Fee:</strong> ${convenienceFee.toFixed(2)}</p>`;
  //     }

  //     if (ticket?.gstpercentage) {
  //       ticketHtml += `<p><strong>GST:</strong> ${gst.toFixed(2)}</p>`;
  //     }

  //     if (ticket?.price && ticket?.conveniencefee && ticket?.gstpercentage) {
  //       ticketHtml += `<p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>`;
  //     }

  //     ticketHtml += ticket.qrcode
  //       ? `<img src="${ticket.qrcode}" style="width:100px; height:100px;"/>`
  //       : '<p>No QR Code available</p>';

  //     const options = {
  //       html: ticketHtml,
  //       fileName: `TicketLiv_Tickets`,
  //       directory: 'Documents',
  //     };

  //     const file = await RNHTMLtoPDF.convert(options);

  //     let downloadsDir;
  //     if (Platform.OS === 'ios') {
  //       downloadsDir = `${RNFS.DocumentDirectoryPath}/Ticketliv_Tickets.pdf`;
  //     } else {
  //       downloadsDir = `${RNFS.DownloadDirectoryPath}/Ticketliv_Tickets.pdf`;
  //     }

  //     await RNFS.moveFile(file.filePath, downloadsDir);

  //     Alert.alert('All tickets downloaded successfully!', `The PDF has been saved to:\n${downloadsDir}`);
  //     return downloadsDir;
  //   } catch (error) {
  //     console.error('Error downloading tickets:', error);
  //     Alert.alert('Failed to download tickets. Please try again.');
  //   }
  // };


  // const shareTicketPDF = async (ticket: Ticket) => {
  //   try {
  //     const basePrice = parseFloat(ticket?.price);
  //     const convenienceFee = basePrice * (ticket?.conveniencefee / 100);
  //     const gst = basePrice * (ticket?.gstpercentage / 100);
  //     const totalPrice = basePrice + convenienceFee + gst;

  //     let ticketHtml = `
  //       <h1>Ticket Details</h1>
  //       <img src="${Logo}" style="width:150px;"/>
  //       <h2>Ticket ID: ${ticket.ticketid}</h2>
  //       <p><strong>Event:</strong> ${ticket.title}</p>
  //       <p><strong>Date and Hour:</strong> ${ticket.eventdate}</p>
  //       <p><strong>Location:</strong> ${ticket.eventlocation}</p>
  //       <p><strong>Base Price:</strong> ${basePrice.toFixed(2)}</p>
  //       <p><strong>Convenience Fee:</strong> ${convenienceFee.toFixed(2)}</p>
  //       <p><strong>GST:</strong> ${gst.toFixed(2)}</p>
  //       <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
  //     `;
  //     ticketHtml += ticket.qrcode
  //       ? `<img src="${ticket.qrcode}" style="width: 120px; height: 120px; background-color: #e0e0e0; display: flex; justify-content: center; align-items: center; border-radius: 8px; border: 1px solid #ddd;"/>`
  //       : '<p>No QR Code available</p>';


  //     const options = {
  //       html: ticketHtml,
  //       fileName: `Ticket_${ticket.ticketid}`,
  //       directory: 'Documents',
  //     };

  //     const file = await RNHTMLtoPDF.convert(options);
  //     await Share.open({
  //       title: 'Share Ticket',
  //       url: `file://${file.filePath}`,
  //       type: 'application/pdf',
  //     });
  //   } catch (error) {
  //     console.log('Error sharing ticket:', error);
  //     Alert.alert('Failed to share ticket. Please try again.');
  //   }
  // };
  const handleDownloadTicket = async (ticket: Ticket) => {
    const basePrice = parseFloat(ticket?.price);
    const convenienceFee = basePrice * (ticket?.conveniencefee / 100);
    const gst = basePrice * (ticket?.gstpercentage / 100);
    const totalPrice = basePrice + convenienceFee + gst;

    try {
      let ticketHtml = `
        <div style="
          width: 380px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-family: Arial, sans-serif;
          background: #fff;
          text-align: left;
          box-sizing: border-box;
        ">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="
              width: 120px;
              height: 120px;
              margin: 0 auto;
              background: #e0e0e0;
              border-radius: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            ">
              <p>QR Code</p>
            </div>
          </div>
          <div style="width: 100%;">
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Event</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">${ticket.title}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Date & Time</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">${ticket.startdate}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Location</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">${ticket.eventlocation}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between; 
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Ticket No</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">${ticket.ticketid}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Base Price</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">₹${basePrice.toFixed(2)}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Convenience Fee (${ticket.conveniencefee}%)</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">₹${convenienceFee.toFixed(2)}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">GST (${ticket.gstpercentage}%)</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">₹${gst.toFixed(2)}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
            ">
              <p style="font-weight: bold; font-size: 16px; color: #555; flex: 1;">Total Price</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">₹${totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      `;

      const options = {
        html: ticketHtml,
        fileName: `Ticket_${ticket.ticketid}`,
        directory: 'Documents',
        height: 500, // Adjusted height for ticket size
        width: 300, // Exact ticket width
      };

      const file = await RNHTMLtoPDF.convert(options);

      // Save to Downloads folder
      let downloadsDir;
      if (Platform.OS === 'ios') {
        downloadsDir = `${RNFS.DocumentDirectoryPath}/Ticket_${ticket.ticketid}.pdf`;
      } else {
        downloadsDir = `${RNFS.DownloadDirectoryPath}/Ticket_${ticket.ticketid}.pdf`;
      }

      await RNFS.moveFile(file.filePath, downloadsDir);

      Alert.alert('Download Successful!', `The ticket has been saved to:\n${downloadsDir}`);
      return downloadsDir;
    } catch (error) {
      console.error('Error downloading ticket:', error);
      Alert.alert('Failed to download ticket. Please try again.');
    }
  };

  const shareTicketPDF = async (ticket: Ticket) => {
    try {
      const basePrice = parseFloat(ticket?.price);
      const convenienceFee = basePrice * (ticket?.conveniencefee / 100);
      const gst = basePrice * (ticket?.gstpercentage / 100);
      const totalPrice = basePrice + convenienceFee + gst;

      let ticketHtml = `
        <div style="
          width: 380px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-family: Arial, sans-serif;
          background: #fff;
          text-align: left;
          box-sizing: border-box;
        ">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="
              width: 120px;
              height: 120px;
              margin: 0 auto;
              background: #e0e0e0;
              border-radius: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            ">
              <p>QR Code</p>
            </div>
          </div>
          <div style="width: 100%;">
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Event</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">${ticket.title}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Date & Time</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">${formatDate(ticket.startdate)}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Location</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">${ticket.eventlocation}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between; 
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Ticket No</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">${ticket.ticketid}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Base Price</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">₹${basePrice.toFixed(2)}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">Convenience Fee (${ticket.conveniencefee}%)</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">₹${convenienceFee.toFixed(2)}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
              border-bottom: 1px solid #f0f0f0;
            ">
              <p style="font-weight: bold; font-size: 14px; color: #555; flex: 1;">GST (${ticket.gstpercentage}%)</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">₹${gst.toFixed(2)}</p>
            </div>
            <div style="
              display: flex; 
              flex-direction: row; 
              justify-content: space-between;
            ">
              <p style="font-weight: bold; font-size: 16px; color: #555; flex: 1;">Total Price</p>
              <p style="font-size: 16px; color: #333; flex: 2; text-align: right;">₹${totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      `;

      const options = {
        html: ticketHtml,
        fileName: `Ticket_${ticket.ticketid}`,
        directory: 'Documents',
        width: 300, // Set the width to match the div
        height: 500, // Approximate height
      };

      const file = await RNHTMLtoPDF.convert(options);
      await Share.open({
        title: 'Share Ticket',
        url: `file://${file.filePath}`,
        type: 'application/pdf',
      });
    } catch (error) {
      console.log('Error sharing ticket:', error);
      Alert.alert('Failed to share ticket. Please try again.');
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
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>E Tickets</Text>
        <View />
        {/* <TouchableOpacity onPress={shareTicketPDF}>
          <Icon name="share-social-outline" size={28} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity> */}
      </View>

      {tickets.map((ticket, index) => {
        const basePrice = parseFloat(ticket?.price);
        // console.log('basePrice', basePrice);
        const convenienceFee = basePrice * (ticket?.conveniencefee / 100);
        // console.log('convenienceFee', convenienceFee);
        const gst = basePrice * (ticket?.gstpercentage / 100);
        // console.log('gst', gst);
        const totalPrice = basePrice + convenienceFee + gst;
        //         console.log('totalPrice', totalPrice);
        //         console.log('Convenience Fee Percentage:', ticket?.conveniencefee);
        // console.log('GST Percentage:', ticket?.gstpercentage);
        return (
          <View key={index} style={[styles.ticketCard, { backgroundColor: isDarkMode ? COLORS.darkCardColor : '#fff' }]}>
            <View style={styles.qrContainer}>
              <TouchableOpacity style={styles.share} onPress={() => shareTicketPDF(ticket)}>
                <Icon name="share-social-outline" size={20} color={isDarkMode ? COLORS.darkTextColor : '#333'} />
              </TouchableOpacity>
              {ticket.qrcode ? (
                <Image source={{ uri: ticket.qrcode }} style={styles.qrCode} />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrPlaceholderText}>QR Code</Text>
                </View>
              )}
            </View>
            <View style={styles.tableContainer}>
              <View style={[styles.tableRow, {borderBottomColor: isDarkMode ? COLORS.darkTextColor : '#efefef'}]}>
                <Text style={[styles.tableHeader, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>Event</Text>
                <Text style={[styles.tableCell, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{ticket.title}</Text>
              </View>
              <View style={[styles.tableRow, {borderBottomColor: isDarkMode ? COLORS.darkTextColor : '#efefef'}]}>
                <Text style={[styles.tableHeader, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>Date & Time</Text>
                <Text style={[styles.tableCell, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{formatDate(ticket.startdate || '')}</Text>
              </View>
              <View style={[styles.tableRow, {borderBottomColor: isDarkMode ? COLORS.darkTextColor : '#efefef'}]}>
                <Text style={[styles.tableHeader, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>Location</Text>
                <Text style={[styles.tableCell, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{ticket.eventlocation}</Text>
              </View>
              <View style={[styles.tableRow, {borderBottomColor: isDarkMode ? COLORS.darkTextColor : '#efefef'}]}>
                <Text style={[styles.tableHeader, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>Ticket No</Text>
                <Text style={[styles.tableCell, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{ticket.ticketid}</Text>
              </View>
              {ticket?.price && (
                <View style={[styles.tableRow, {borderBottomColor: isDarkMode ? COLORS.darkTextColor : '#efefef'}]}>
                  <Text style={[styles.tableHeader, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>Base Price</Text>
                  <Text style={[styles.tableCell, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{basePrice.toFixed(2)}</Text>
                </View>
              )}
              {ticket?.conveniencefee && (
                <View style={[styles.tableRow, {borderBottomColor: isDarkMode ? COLORS.darkTextColor : '#efefef'}]}>
                  <Text style={[styles.tableHeader, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>Convenience Fee ({ticket?.conveniencefee || 0}%):</Text>
                  <Text style={[styles.tableCell, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{convenienceFee.toFixed(2)}</Text>
                </View>
              )}
              {ticket?.gstpercentage && (
                <View style={[styles.tableRow, {borderBottomColor: isDarkMode ? COLORS.darkTextColor : '#efefef'}]}>
                  <Text style={[styles.tableHeader, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>GST ({ticket?.gstpercentage || 0}%)</Text>
                  <Text style={[styles.tableCell, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{gst.toFixed(2)}</Text>
                </View>
              )}
              {ticket?.price && ticket?.conveniencefee && ticket?.gstpercentage && (
                <View style={[styles.tableRow, {borderBottomColor: isDarkMode ? COLORS.darkTextColor : '#efefef'}]}>
                  <Text style={[styles.tableHeader, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>Total Price</Text>
                  <Text style={[styles.tableCell, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{totalPrice.toFixed(2)}</Text>
                </View>
              )}

            </View>
            <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownloadTicket(ticket)}>
              <Text style={styles.downloadButtonText}>Download Ticket</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  share: {
    alignSelf: 'flex-end',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 16,
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
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
  },
  tableHeader: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right', // Aligns content to the right for better readability
  },

  downloadButton: {
    backgroundColor: COLORS.red,
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
