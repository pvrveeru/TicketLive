import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TermsConditionsScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>
      <Text style={styles.title}>Terms & Conditions</Text>
      
      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.text}>Welcome to our Event Booking App! By using our services, you agree to the following Terms and Conditions. Please read them carefully before proceeding.</Text>
      
      <Text style={styles.sectionTitle}>2. User Accounts</Text>
      <Text style={styles.text}>- Users must create an account to book events and access certain features.
- Users are responsible for maintaining the confidentiality of their account credentials.
- Any unauthorized access or breach should be reported immediately.</Text>
      
      <Text style={styles.sectionTitle}>3. Event Listings & Booking</Text>
      <Text style={styles.text}>- The Home Page displays all available events under the "Explore" section.
- Users can filter events by categories for easier browsing.
- A Favorites section allows users to save and access their preferred events.
- Bookings can be viewed in the Tickets tab, showing all past and upcoming reservations.</Text>
      
      <Text style={styles.sectionTitle}>4. Payment & Convenience Fee</Text>
      <Text style={styles.text}>- All ticket purchases are subject to applicable GST and a 10% convenience fee.
- Users will see the final amount before confirming their booking.
- Refunds and cancellations are subject to the event organizer’s policy.</Text>
      
      <Text style={styles.sectionTitle}>5. Profile & Preferences</Text>
      <Text style={styles.text}>- Users can edit their profile details in the Profile tab.
- Users can enable or disable notifications for event updates and alerts.
- The app offers a Dark Mode and Light Mode setting for user convenience.</Text>
      
      <Text style={styles.sectionTitle}>6. Cancellations & Refunds</Text>
      <Text style={styles.text}>- Cancellation policies vary by event and organizer.
- Users should check the cancellation terms before booking.
- Refunds (if applicable) will be processed as per the organizer's policy.</Text>
      
      <Text style={styles.sectionTitle}>7. Privacy & Data Protection</Text>
      <Text style={styles.text}>- We respect user privacy and handle personal data securely.
- User information is not shared with third parties without consent.
- For more details, refer to our Privacy Policy.</Text>
      
      <Text style={styles.sectionTitle}>8. Prohibited Activities</Text>
      <Text style={styles.text}>Users must NOT:
- Use the platform for fraudulent activities.
- Violate any event rules or engage in disruptive behavior.
- Misuse the app’s features to harm other users or organizers.</Text>
      
      <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
      <Text style={styles.text}>- We act as a booking platform and are not responsible for event cancellations, reschedules, or organizer-related issues.
- Users acknowledge that event availability and pricing may change.</Text>
      
      <Text style={styles.sectionTitle}>10. Changes to Terms & Conditions</Text>
      <Text style={styles.text}>- We may update these Terms at any time. Continued use of the app signifies acceptance of the revised terms.</Text>
      
      <Text style={styles.sectionTitle}>11. Contact Us</Text>
      <Text style={styles.text}>For any queries or support, please contact our customer service team.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    elevation: 3,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  text: {
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
    color: '#333',
  },
});

export default TermsConditionsScreen;
