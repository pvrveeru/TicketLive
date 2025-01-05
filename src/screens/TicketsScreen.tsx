import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../styles/globalstyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../Theme/ThemeContext';

interface Ticket {
  id: number;
  title: string;
  date: string;
  location: string;
  status: string;
  image: any;
}

const TicketsScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('Upcoming');
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const ticketsData: Ticket[] = [
    {
      id: 1,
      title: 'Ultrafest Music Events',
      date: 'Med. Dec 08/2023',
      location: 'Washington Ave.',
      status: 'Upcoming',
      image: require('../../assests/images/ticketliv_logo.png'),
    },
    {
      id: 2,
      title: 'Concert Westlife',
      date: 'Med. Dec 06/2025',
      location: 'Thornridge Cir.',
      status: 'Completed',
      image: require('../../assests/images/ticketliv_logo.png'),
    },
    {
      id: 3,
      title: 'Festival Parade',
      date: 'Med. Nov 15/2023',
      location: 'Baker St.',
      status: 'Cancelled',
      image: require('../../assests/images/ticketliv_logo.png'),
    },
    {
      id: 4,
      title: 'Jazz Night',
      date: 'Med. Jan 12/2024',
      location: '5th Avenue',
      status: 'Upcoming',
      image: require('../../assests/images/ticketliv_logo.png'),
    },
  ];

  const filterTickets = (status: string) => {
    return ticketsData.filter((ticket) => ticket.status === status);
  };

  const handleCancelBooking = (ticketId: number) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No' },
      {
        text: 'Yes',
        onPress: () => {
          Alert.alert('Booking Cancelled', `Your booking for ticket ID ${ticketId} has been cancelled.`);
        },
      },
    ]);
  };

  const handleViewTicket = () => {
    navigation.navigate('TicketDetails');
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <View style={[styles.ticketContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
      {/* Row containing image and details */}
      <View style={styles.rowContainer}>
        <View style={styles.ticketImageContainer}>
          <Image source={item.image} style={styles.ticketImage} resizeMode="cover" />
        </View>
        <View style={styles.ticketDetails}>
          <Text style={[styles.ticketTitle, { color: isDarkMode ? '#fff' : '#333' }]}>{item.title}</Text>
          <Text style={[styles.ticketInfo, { color: isDarkMode ? '#bbb' : '#666' }]}>{item.date}</Text>
          <Text style={[styles.ticketInfo, { color: isDarkMode ? '#bbb' : '#666' }]}>{item.location}</Text>
          <Text
            style={[
              styles.ticketStatus,
              item.status === 'Paid' ? styles.statusPaid : styles.statusCancelled,
              { color: isDarkMode ? '#fff' : item.status === 'Paid' ? 'green' : 'red' },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      {/* Buttons Section below the row */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: isDarkMode ? '#fff' : COLORS.blue }]}
          onPress={() => handleCancelBooking(item.id)}
          disabled={item.status !== 'Upcoming'}
        >
          <Text style={[styles.cancelButtonText, { color: isDarkMode ? '#fff' : COLORS.blue }]}>
            Cancel Booking
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: isDarkMode ? '#EF412B' : COLORS.red }]}
          onPress={handleViewTicket}
        >
          <Text style={styles.viewButtonText}>View Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#000' }]}>My Tickets</Text>
        <TouchableOpacity style={styles.bellIconContainer} onPress={handleNotificationPress}>
          <MaterialCommunityIcons name="bell-badge-outline" size={30} color={COLORS.red} />
        </TouchableOpacity>
      </View>
      <View style={styles.tabBar}>
        {['Upcoming', 'Completed', 'Cancelled'].map((tab) => (
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

      {/* Ticket List */}
      <FlatList
        data={filterTickets(selectedTab)}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noTicketsText}>No tickets available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
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
  ticketContainer: {
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  rowContainer: {
    flexDirection: 'row', // Arrange image and details in a row
    alignItems: 'center',
  },
  ticketImageContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  ticketDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketInfo: {
    fontSize: 14,
    marginVertical: 2,
  },
  ticketStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusPaid: {
    color: 'green',
  },
  statusCancelled: {
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noTicketsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default TicketsScreen;
