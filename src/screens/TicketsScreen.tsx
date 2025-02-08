import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getBookingsByUserId } from '../services/Apiservices';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../styles/globalstyles';
import { useTheme } from '../Theme/ThemeContext';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import SkeletonLoader from '../components/SkeletonLoading';

type RootStackParamList = {
  TicketDetails: { bookingId: number };
  BottomBar: { screen: string };
  Notification: undefined;
};

type Booking = {
  bookingDate: string;
  bookingId: number;
  bookingStatus: string;
  contactPersonAddress: string | null;
  contactPersonCity: string | null;
  contactPersonDOB: string | null;
  contactPersonEmail: string;
  contactPersonFirstName: string;
  contactPersonGender: string;
  contactPersonLastName: string;
  contactPersonPhone: string;
  contactPersonState: string | null;
  createdAt: string;
  event: Event;
  eventId: number;
  noOfTickets: number;
  paymentStatus: string;
  selectedClass: string | null;
  totalPrice: string | null;
  updatedAt: string;
  user: User;
  userId: number;
  zoneName: string | null;
};

type Event = {
  eventDate: string;
  event_id: number;
  title: string;
  thumbUrl: string;
};

type User = {
  user_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
};

interface UserData {
  userId: string;
  profileImageUrl: string;
}
interface RootState {
  userData: UserData;
}

const TicketsScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>('Upcoming');
  const userData = useSelector((state: RootState) => state.userData);
  const userId = userData.userId;
  const profileImage = require('../../assets/images/icon.png');
  const profileImageUrl = userData?.profileImageUrl;
  const formatDate = (dateString: string) => {
    return moment.utc(dateString).local().format('MMMM DD, YYYY hh:mm A');
  };

  const handleProfilePress = () => {
    navigation.navigate('BottomBar', { screen: 'Profile' });
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getBookingsByUserId(userId);
      setBookings(data.bookings);
      // console.log('all bookings', data.bookings);
    } catch (error) {
      console.error('error fetching bookings', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleViewTicket = (bookingId: number) => {
    navigation.navigate('TicketDetails', { bookingId });
  };

  const handleCancelBooking = (bookingId: number) => {
    Alert.alert(`Cancel booking with ID: ${bookingId}`);
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  // Function to categorize bookings
  const categorizeBookings = () => {
    const today = moment();
    const upcomingBookings = bookings.filter((item) => moment(item.event.eventDate).isAfter(today));
    const completedBookings = bookings.filter((item) => moment(item.event.eventDate).isBefore(today));
    return { upcomingBookings, completedBookings };
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const { event, paymentStatus } = item;
    const eventTitle = event?.title || 'No Title';
    const eventDate = event?.eventDate || 'No Date';
    return (
      <>
        <View style={[styles.bookingItem, { backgroundColor: isDarkMode ? COLORS.darkCardColor : '#fff' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
            <Image source={{ uri: event?.thumbUrl }} style={{ width: 100, height: 100 }} />
            <View>
              <Text style={[styles.title, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{eventTitle}</Text>
              <Text style={[styles.detail, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{formatDate(eventDate)}</Text>
              <Text style={[styles.detail, { color: isDarkMode ? COLORS.darkTextColor : '#000' }]}>{paymentStatus}</Text>
            </View>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.viewButton, { backgroundColor: isDarkMode ? '#EF412B' : COLORS.red }]}
              onPress={() => handleViewTicket(item.bookingId)}
            >
              <Text style={styles.buttonText}>View Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const { upcomingBookings, completedBookings } = categorizeBookings();
  // console.log('upcomingBookings', upcomingBookings);
  return (
    <>
      <Header
        title={'My Tickets'}
        profileImageUrl={userData?.profileImageUrl}
        profileImage={require('../../assets/images/icon.png')}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress} />
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <View style={styles.tabBar}>
          {['Upcoming', 'Completed'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, selectedTab === tab && styles.selectedTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.selectedTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <ScrollView>
            {Array.from({ length: 5 }).map((_, index) => (
              <View key={index} style={{ margin: 5 }}>
                <SkeletonLoader width="100%" height={150} borderRadius={10} />
              </View>
            ))}
          </ScrollView>
        ) : selectedTab === 'Upcoming' ? (
          upcomingBookings.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming events. Book your tickets now and stay updated!</Text>
          ) : (
            <FlatList
              data={upcomingBookings}
              keyExtractor={(item, index) => item.bookingId?.toString() || index.toString()}
              renderItem={renderBookingItem}
              showsVerticalScrollIndicator={false} />
          )
        ) : selectedTab === 'Completed' ? (
          completedBookings.length === 0 ? (
            <Text style={styles.emptyText}>You have no completed events yet. Once you attend an event, it'll show up here!</Text>
          ) : (
            <FlatList
              data={completedBookings}
              keyExtractor={(item, index) => item.bookingId?.toString() || index.toString()}
              renderItem={renderBookingItem} />
          )
        ) : null}
      </View ></>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  bookingItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  viewButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ff8533',
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bellIconContainer: {
    position: 'absolute',
    right: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabItem: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  selectedTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#EF412B',
  },
  selectedTabText: {
    color: '#EF412B',
    fontWeight: 'bold',
  },
});

export default TicketsScreen;
