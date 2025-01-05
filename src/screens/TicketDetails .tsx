import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';

interface TicketDetailsProps {
  navigation: any;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ navigation }) => {
  const { isDarkMode } = useTheme();

  const downloadTicket = async () => {
    console.log('download ticket');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={30} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>E-Ticket</Text>
        <TouchableOpacity onPress={() => console.log('Show options')}>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={30} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {/* Ticket Details */}
      <View style={[styles.ticketCard, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.qrCode} />

        <View style={styles.detailsContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#888' }]}>Event</Text>
          <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#000' }]}>National Music Festival</Text>

          <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#888' }]}>Date and Hour</Text>
          <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#000' }]}>Monday, Dec 24 · 18.00 - 23.00 PM</Text>

          <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#888' }]}>Event Location</Text>
          <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#000' }]}>Grand Park, New York City, US</Text>

          <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#888' }]}>Event Organizer</Text>
          <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#000' }]}>World of Music</Text>
        </View>
      </View>

      {/* Pricing Card */}
      <View style={[styles.pricingCard, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
        <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#888' }]}>1 Seat (Economy)</Text>
        <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#000' }]}>$50.00</Text>

        <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#888' }]}>Tax</Text>
        <Text style={[styles.value, { color: isDarkMode ? '#fff' : '#000' }]}>$5.00</Text>
      </View>

      {/* Download Ticket Button */}
      <TouchableOpacity style={[styles.downloadButton, { backgroundColor: isDarkMode ? '#ff4d4d' : '#ff4d4d' }]} onPress={downloadTicket}>
        <Text style={styles.downloadButtonText}>Download Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  qrCode: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  ticketCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  pricingCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  downloadButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TicketDetails;
