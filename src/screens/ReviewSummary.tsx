import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../styles/globalstyles';
import SuccessModal from '../components/SuccessModal';
import { createBooking, getChargesByEventId, getEventById } from '../services/Apiservices';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';
import { useSelector } from 'react-redux';
import { Dialog } from '@rneui/themed';
import moment from 'moment';

interface ReviewSummaryProps {
  route: any;
  navigation: any;
}

interface EventDetailsData {
  eventId?: number;
  uniqueEventId?: string;
  title?: string;
  description?: string;
  brief?: string;
  eventDate?: string;
  maxTicketAllowed?: number;
  ageLimit?: string;
  location?: string;
  artistName?: string;
  thumbUrl?: string;
  layoutImageUrl?: string;
}

interface UserData {
  userId: string;
}
interface RootState {
  userData: UserData;
}

interface ChargesData {
  convenienceFee: number;
  gstPercentage: number;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ route, navigation }) => {
  const { isDarkMode } = useTheme();
  const userData = useSelector((state: RootState) => state.userData);
  const userId = userData.userId;
  const { formData, eventBookingDetails, eventId } = route.params;
  const dob = formData.dob ? new Date(formData.dob) : null;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [charges, setCharges] = useState<ChargesData | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetailsData | null>(null);
const formatDate = (dateString: string) => {
        return moment.utc(dateString).local().format('MMMM DD, YYYY hh:mm A');
      };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const details = await getEventById(eventId);
        setEventDetails(details.data);
      } catch (err) {
        console.log('Failed to load event details.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    const fetchCharges = async () => {
      setLoading(true);
      try {
        const data = await getChargesByEventId(eventId);
        // console.log('data', data);
        setCharges(data);
      } catch (err: any) {
        console.log('error for fetching charges', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
  }, [eventId]);

  const totalAmount = Number(eventBookingDetails?.totalAmount);
  const gstPercentage = Number(charges?.gstPercentage || 0);
  const convenienceFeePercentage = Number(charges?.convenienceFee || 0);
  const gstAmount = (totalAmount * (gstPercentage / 100));
  const convenienceFee = totalAmount * (convenienceFeePercentage / 100);
  const totalAmountWithCharges = (totalAmount + gstAmount + convenienceFee).toFixed(2);

  const handleContinue = async () => {
    setLoading(true);
    const seatingDetails = eventBookingDetails?.seatingIds.map((id: any, index: number) => ({
      seatingId: id,
      noOfTickets: eventBookingDetails?.noOfTickets[index]
    }));

    const payload = {
      userId: userId,
      eventId: eventId,
      seatingDetails: seatingDetails,
      totalAmount: totalAmountWithCharges,
      contactPersonFirstName: formData.firstName,
      contactPersonLastName: formData.lastName,
      contactPersonGender: formData.gender,
      contactPersonEmail: formData.email,
      contactPersonPhone: formData.phone,
      contactPersonCountry: formData.state,
      contactPersonCity: formData.city,
      contactPersonAddress: formData.address,
      contactPersonDOB: dob?.toISOString(),
      bookingDate: new Date().toISOString(),
    };
    console.log('Booking result payload:', payload);
    try {
      const result = await createBooking(payload);
      // console.log('Booking result:', result);
      setLoading(false);
      setModalVisible(true);
    } catch (error) {
      console.error('Error during booking:', error);
      Alert.alert('Failed to create booking. Please try again.');
    }
  };


  const handleViewTicket = () => {
    setModalVisible(false);
    navigation.navigate('BottomBar', { screen: 'Tickets' });
  };
  // console.log('charges in review screen', charges);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Review Summary</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.eventDetailsContainer}>
          <Image source={{ uri: eventDetails?.thumbUrl }} style={styles.eventImage} />
          <View>
            <Text style={styles.eventTitle}>{eventDetails?.title}</Text>
            <Text style={styles.eventDate}>{formatDate(eventDetails?.eventDate || '')}</Text>
            <Text style={styles.eventLocation}>{eventDetails?.location}</Text>
          </View>
        </View>

        <View style={styles.contactInfoContainer}>
          <Text style={styles.infoTitle}>Contact Information</Text>
          <View style={styles.contactRow}>
            <Text style={styles.value}>Full Name:</Text>
            <Text style={styles.label}>
              {formData.firstName} {formData.lastName}
            </Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.value}>Phone:</Text>
            <Text style={styles.label}>{formData.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.value}>Email:</Text>
            <Text style={styles.label}>{formData.email}</Text>
          </View>
        </View>
        <View style={styles.ticketDetailsContainer}>
          <Text style={styles.infoTitle}>Ticket Details</Text>
          {/* {eventBookingDetails?.zoneNames.map((zone: string, index: number) => (
            <View key={index} style={styles.ticketRow}>
              <Text style={styles.value}>Zone:</Text>
              <Text style={styles.label}>{zone}</Text>
            </View>
          ))} */}

          {eventBookingDetails?.noOfTickets.map((ticket: number, index: number) => (
            <View key={index} style={styles.ticketRow}>
              <Text style={styles.value}>Seats ({eventBookingDetails?.selectedClass[index]}):</Text>
              <Text style={styles.label}>{ticket}</Text>
            </View>
          ))}

          {eventBookingDetails?.prices.map((price: number, index: number) => (
            <View key={index} style={styles.ticketRow}>
              <Text style={styles.value}>Price:</Text>
              <Text style={styles.label}>₹{price.toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.horizontalLine} />
          <View style={styles.ticketRow}>
            <Text style={styles.value}>Base Price:</Text>
            <Text style={styles.label}>₹{eventBookingDetails?.totalAmount}</Text>
          </View>
          {charges && (

            <>
              <View style={styles.horizontalLine} />
              <View style={styles.ticketRow}>
                <Text style={styles.value}>Convenience Fee:</Text>
                <Text style={styles.label}>₹{convenienceFee}</Text>
              </View>
              <View style={styles.ticketRow}>
                <Text style={styles.value}>GST ({charges?.gstPercentage || 0}%):</Text>
                <Text style={styles.label}>₹{gstAmount.toFixed(2)}</Text>
              </View>
            </>
          )}
          <View style={styles.horizontalLine} />
          <View style={styles.ticketRow}>
            <Text style={styles.value}>Total Price:</Text>
            <Text style={styles.label}>₹{totalAmountWithCharges}</Text>
          </View>
        </View>

      </ScrollView>
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
      <Dialog isVisible={loading}>
          {/* <Dialog.Loading /> */}
          <ActivityIndicator
              size="large"
              color={COLORS.red}
            />
        </Dialog>
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
    alignItems: 'center',
    marginBottom: 20,
    columnGap: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  horizontalLine: {
    height: 2,
    backgroundColor: '#ccc',
    marginVertical: 10,
    width: '100%',
  },
  eventDetailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    columnGap: 10,
    backgroundColor: '#fff', // Added card style
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: 100,
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
  eventLocation: {
    color: COLORS.blue,
    fontWeight: 'bold',
    width: '80%',
  },
  contactInfoContainer: {
    marginBottom: 20,
    backgroundColor: '#fff', // Added card style
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
  },
  value: {
    color: 'black',
  },
  ticketDetailsContainer: {
    marginBottom: 80,
    backgroundColor: '#fff', // Added card style
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
