import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HelpCenterScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <Text style={styles.subHeader}>Frequently Asked Questions</Text>

      <View style={styles.faqContainer}>
        <Text style={styles.question}>1. How do I book an event?</Text>
        <Text style={styles.answer}>
          Navigate to the Explore tab, select your desired event, and proceed with the booking process.
        </Text>

        <Text style={styles.question}>2. How can I cancel my booking?</Text>
        <Text style={styles.answer}>
          Go to the Tickets tab, select the booking, and follow the cancellation process as per the event policy.
        </Text>

        <Text style={styles.question}>3. How do I contact customer support?</Text>
        <Text style={styles.answer}>
          You can reach out via email at support@eventapp.com or call our helpline at +91 98765 43210.
        </Text>
      </View>

      <Text style={styles.subHeader}>Contact Support</Text>
      <TouchableOpacity style={styles.supportButton}>
        <Text style={styles.supportText}>Email Us: support@eventapp.com</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.supportButton}>
        <Text style={styles.supportText}>Call Us: +91 98765 43210</Text>
      </TouchableOpacity>
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
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  faqContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  answer: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  supportButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  supportText: {
    fontSize: 16,
    color: '#000',
  },
});

export default HelpCenterScreen;
