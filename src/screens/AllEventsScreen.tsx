import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import sampleEvents from '../config/sample.json';
import { useTheme } from '../Theme/ThemeContext';

const AllEventsScreen: React.FC = () => {
    const { isDarkMode } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Text style={[styles.all, { color: isDarkMode ? '#fff' : '#000' }]}>All Events</Text>
            <FlatList
                data={sampleEvents}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.eventCard, { backgroundColor: isDarkMode ? '#888' : '#fff' }]}>
                        <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
                        <Text style={[styles.eventName, { color: isDarkMode ? '#fff' : '#000' }]}>
                            {item.eventName}
                        </Text>
                        <Text style={[styles.eventDetails, { color: isDarkMode ? '#ccc' : 'gray' }]}>
                            {item.date}
                        </Text>
                        <Text style={[styles.eventLocation, { color: isDarkMode ? '#ccc' : 'gray' }]}>
                            {item.location}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    all: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    eventCard: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        borderBottomColor: '#888',
        borderBottomWidth: 1,
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
        fontSize: 14,
    },
    eventLocation: {
        fontSize: 14,
    },
});

export default AllEventsScreen;
