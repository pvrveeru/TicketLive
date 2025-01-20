import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../styles/globalstyles';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../Theme/ThemeContext';

type BookEventScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventBookingDetails'>;

interface Zone {
    name: string;
    type: string;
    color: string;
    widthPercentage: number;
}

const zones: Zone[] = [
    { name: 'Stage', color: '#FFFFFF', widthPercentage: 40, type: '(Main Area)' },
    { name: 'MIP ZONE', type: '(Sofa Seated)', color: '#FFFF00', widthPercentage: 50 },
    { name: 'VIP ZONE', type: '(Chair Seated)', color: '#FF69B4', widthPercentage: 60 },
    { name: 'PLATINUM ZONE', type: '(Chair Seated)', color: '#FFA07A', widthPercentage: 70 },
    { name: 'GOLD ZONE', type: '(Standing Area)', color: '#FFD700', widthPercentage: 80 },
    { name: 'SILVER ZONE', type: '(Standing Area)', color: '#D3D3D3', widthPercentage: 90 },
];

const BookEventScreen: React.FC = () => {
    const { isDarkMode } = useTheme();
    const navigation = useNavigation<BookEventScreenNavigationProp>();
    const [numSeats, setNumSeats] = useState(1);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);

    const handleIncrement = () => {
        if (numSeats < 5) {
            setNumSeats(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (numSeats > 1) {
            setNumSeats(prev => prev - 1);
        }
    };

    const handleZonePress = (zoneName: string) => setSelectedZone(zoneName);

    const totalPrice = numSeats * 500;

    const handleContinuePress = () => {
        if (selectedZone) {
            navigation.navigate('EventBookingDetails', {
                selectedZone,
                numSeats,
                totalPrice,
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#fff' }]}>Book Event</Text>
            </View>

            <View style={styles.seatSelection}>
                <Text style={[styles.choosetext, { color: isDarkMode ? '#fff' : '#fff' }]}>Choose number of seats</Text>
                <View style={styles.seatCounter}>
                    <TouchableOpacity
                        style={[styles.counterButton, { borderColor: isDarkMode ? '#fff' : '#fff' }]}
                        onPress={handleDecrement}
                    >
                        <Text style={[styles.counterButtonText, { color: isDarkMode ? '#fff' : '#fff' }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.seatCount, { color: isDarkMode ? '#fff' : '#fff' }]}>{numSeats}</Text>
                    <TouchableOpacity
                        style={[styles.counterButton, { borderColor: isDarkMode ? '#fff' : '#fff' }]}
                        onPress={handleIncrement}
                        disabled={numSeats >= 5}
                    >
                        <Text style={[styles.counterButtonText, { color: isDarkMode ? '#fff' : '#fff' }]}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.zonesContainer}>
                {zones.map((zone) => (
                    <TouchableOpacity
                        key={zone.name}
                        style={[
                            styles.zoneButton,
                            { backgroundColor: zone.color, width: `${zone.widthPercentage}%` },
                            selectedZone === zone.name && styles.selectedZone,
                        ]}
                        onPress={() => handleZonePress(zone.name)}
                    >
                        {selectedZone === zone.name && (
                            <Icon name="checkmark-circle" size={20} color="green" style={styles.checkIcon} />
                        )}
                        <Text style={styles.zoneName}>{zone.name}</Text>
                        <Text style={styles.zoneType}>{zone.type}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.continueButton, !selectedZone && styles.disabledButton]}
                disabled={!selectedZone}
                onPress={handleContinuePress}
            >
                <Text style={styles.continueButtonText}>Continue - {totalPrice}.00</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    checkIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    choosetext: {
        fontSize: 20,
    },
    seatSelection: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    seatCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    counterButton: {
        borderWidth: 1,
        borderColor: COLORS.blue,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    counterButtonText: {
        fontSize: 20,
    },
    seatCount: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    zonesContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    zoneButton: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    selectedZone: {
        borderWidth: 2,
        borderColor: 'black',
    },
    zoneName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    zoneType: {
        fontSize: 14,
    },
    continueButton: {
        backgroundColor: '#FF6347',
        padding: 15,
        borderRadius: 8,
        width: '90%',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BookEventScreen;
