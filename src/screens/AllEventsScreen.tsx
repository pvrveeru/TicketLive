import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import sampleEvents from '../config/sample.json';
const AllEventsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={sampleEvents}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            {/* <Image source={require(item.image)} style={styles.eventImage} /> */}
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text style={styles.eventDetails}>{item.date}</Text>
            <Text style={styles.eventLocation}>{item.location}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  eventCard: {
    marginBottom: 20,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDetails: {
    color: 'gray',
  },
  eventLocation: {
    color: 'gray',
  },
});

export default AllEventsScreen;
