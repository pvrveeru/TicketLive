import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../Theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../styles/globalstyles';

type TicketDetailsRouteProp = RouteProp<RootStackParamList, 'TicketDetails'>;

type TicketDetailsProps = {
  route: TicketDetailsRouteProp;
};

const TicketDetails: React.FC<TicketDetailsProps> = ({ route }) => {
  const { isDarkMode } = useTheme();
  const { ticket } = route.params || {};
  const navigation = useNavigation();

  const handleDownload = () => {
    Alert.alert('Download Ticket', 'This feature will download the ticket.');
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode ? styles.darkText : styles.lightText]}>
          E-Ticket
        </Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Options', 'More options will be displayed here.')}
          style={styles.iconContainer}
        >
          <Ionicons
            name="ellipsis-horizontal-circle-outline"
            size={24}
            color={isDarkMode ? 'white' : 'black'}
          />
        </TouchableOpacity>
      </View>

      {/* Ticket Image */}
      <View style={styles.imageContainer}>
        <Image source={ticket.image} style={styles.image} resizeMode="contain" />
      </View>

      <Text style={[styles.label, isDarkMode ? styles.darkLabel : styles.lightLabel]}>Event</Text>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
        {ticket.title}
      </Text>
      <Text style={[styles.label, isDarkMode ? styles.darkLabel : styles.lightLabel]}>Date and Hour</Text>
      <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>{ticket.date}</Text>

      <Text style={[styles.label, isDarkMode ? styles.darkLabel : styles.lightLabel]}>Event Location</Text>
      <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
        Location: {ticket.location}
      </Text>

      {/* Download Button at the Bottom */}
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadButtonText}>Download Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80, // Space for the download button
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lightText: {
    color: '#000',
  },
  darkLabel: {
    color: '#A6A6A6',
  },
  lightLabel: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  iconContainer: {
    padding: 0,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  details: {
    fontSize: 16,
    marginVertical: 4,
  },
  downloadButton: {
    backgroundColor: COLORS.red,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '90%',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicketDetails;
