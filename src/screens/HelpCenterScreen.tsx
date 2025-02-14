import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';

const HelpCenterScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <View style={[styles.header, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Help Center</Text>
      </View>

      <Text style={[styles.subHeader, { color: isDarkMode ? '#fff' : '#000' }]}>Frequently Asked Questions</Text>

      <View style={styles.faqContainer}>
        <Text style={[styles.question, { color: isDarkMode ? '#fff' : '#000' }]}>1. How do I book an event?</Text>
        <Text style={[styles.answer, { color: isDarkMode ? '#fff' : '#000' }]}>
          Navigate to the Explore tab, select your desired event, and proceed with the booking process.
        </Text>

        <Text style={[styles.question, { color: isDarkMode ? '#fff' : '#000' }]}>2. How can I cancel my booking?</Text>
        <Text style={[styles.answer, { color: isDarkMode ? '#fff' : '#000' }]}>
          Go to the Tickets tab, select the booking, and follow the cancellation process as per the event policy.
        </Text>

        <Text style={[styles.question, { color: isDarkMode ? '#fff' : '#000' }]}>3. How do I contact customer support?</Text>
        <Text style={[styles.answer, { color: isDarkMode ? '#fff' : '#000' }]}>
          You can reach out via email at support@eventapp.com or call our helpline at +91 98765 43210.
        </Text>
      </View>

      <Text style={[styles.subHeader, { color: isDarkMode ? '#fff' : '#000', textAlign: 'center' }]}>Contact Support</Text>
      <TouchableOpacity style={styles.supportButton}>
        <Text style={[styles.supportText, { color: isDarkMode ? '#fff' : '#000' }]}>Email Us: support@eventapp.com</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.supportButton}>
        <Text style={[styles.supportText, { color: isDarkMode ? '#fff' : '#000' }]}>Call Us: +91 98765 43210</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  faqContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },
  answer: {
    fontSize: 11,
    color: '#555',
    marginBottom: 10,
    marginTop: 5
  },
  supportButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  supportText: {
    fontSize: 13,
    color: '#000',
  },
});

export default HelpCenterScreen;
