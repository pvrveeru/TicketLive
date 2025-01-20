import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../styles/globalstyles';
import SuccessModal from '../components/SuccessModal';

interface ReviewSummaryProps {
  route: any;
  navigation: any;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ route, navigation }) => {
  const { formData, selectedZone, numSeats, totalPrice } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  const handleContinue = () => {
    setModalVisible(true); // Show the success modal
  };

  const handleViewTicket = () => {
    setModalVisible(false);
    // navigation.navigate('E-Ticket'); // Navigate to ticket screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Review Summary</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="times" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.eventDetailsContainer}>
        <Image
          source={require('../../assests/images/ticketliv_logo.png')}
          style={styles.eventImage}
        />
        <Text style={styles.eventTitle}>National Music Festival</Text>
        <Text style={styles.eventDate}>Mon. Dec 24, 2024 - 6:00 PM</Text>
      </View>

      <View style={styles.contactInfoContainer}>
        <Text style={styles.infoTitle}>Contact Information</Text>
        <Text>
          {formData.firstName} {formData.lastName}
        </Text>
        <Text>{formData.phone}</Text>
        <Text>{formData.email}</Text>
      </View>

      <View style={styles.ticketDetailsContainer}>
        <Text style={styles.infoTitle}>Ticket Details</Text>
        <Text>Section: {selectedZone}</Text>
        <Text>Quantity: {numSeats}</Text>
        <Text>Price: ${totalPrice}</Text>
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SuccessModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onViewTicket={handleViewTicket}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  eventDetailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  eventImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  eventDate: {
    color: '#808080',
  },
  contactInfoContainer: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ticketDetailsContainer: {
    marginBottom: 30,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  continueButton: {
    backgroundColor: COLORS.red,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewSummary;
