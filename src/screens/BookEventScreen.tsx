import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSeatingOptionsByEventId } from '../services/Apiservices';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';

interface RouteParams {
    eventId: number;
}

interface SeatingOption {
    seatingId: number;
    zoneName: string;
    price: string;
    capacity: number;
}

const BookEventScreen: React.FC = () => {
    const route = useRoute();
    const { isDarkMode } = useTheme();
    const navigation = useNavigation<any>();
    const { eventId } = route.params as RouteParams;

    const [seatingOptions, setSeatingOptions] = useState<SeatingOption[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<{ [key: number]: number }>({}); // Track quantity per zone
    const [selectedZones, setSelectedZones] = useState<SeatingOption[]>([]); // Track selected zones

    useEffect(() => {
        const fetchSeatingOptions = async () => {
            try {
                const options = await getSeatingOptionsByEventId(eventId);
                if (Array.isArray(options)) {
                    setSeatingOptions(options);
                } else {
                    console.error('API returned data in unexpected format:', options);
                }
            } catch (error) {
                console.error('Error fetching seating options:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeatingOptions();
    }, [eventId]);

    const toggleZoneSelection = (zone: SeatingOption) => {
        if (selectedZones.some((selectedZone) => selectedZone.seatingId === zone.seatingId)) {
            // Deselect zone
            setSelectedZones(selectedZones.filter((selectedZone) => selectedZone.seatingId !== zone.seatingId));
            const newQuantity = { ...quantity };
            delete newQuantity[zone.seatingId];
            setQuantity(newQuantity);
        } else {
            // Select zone
            setSelectedZones([...selectedZones, zone]);
            setQuantity((prev) => ({ ...prev, [zone.seatingId]: 1 })); // Default to 1 ticket for the selected zone
        }
    };

    const incrementQuantity = (zoneId: number) => {
        if (quantity[zoneId] < 5) {
            setQuantity((prev) => ({ ...prev, [zoneId]: prev[zoneId] + 1 }));
        }
    };

    const decrementQuantity = (zoneId: number) => {
        if (quantity[zoneId] > 1) {
            setQuantity((prev) => ({ ...prev, [zoneId]: prev[zoneId] - 1 }));
        }
    };

    // const handleContinue = () => {
    //     selectedZones.forEach((zone) => {
    //         const totalPrice = parseFloat(zone.price) * (quantity[zone.seatingId] || 1);
    //         console.log(`Zone: ${zone.zoneName}, Tickets: ${quantity[zone.seatingId]}, Total Price: $${totalPrice.toFixed(2)}`);
    //         console.log({
    //             seatingId: zone.seatingId,
    //             noOfTickets: `${quantity[zone.seatingId]}`,
    //             zoneName: zone.zoneName,
    //         });
    //     });

    //     // // Navigate with selected zones and quantities
    //     // navigation.navigate('EventBookingDetails', {
    //     //     selectedZones,
    //     //     quantity,
    //     // });
    // };

    const handleContinue = () => {
        const selectedSeatingIds: number[] = [];
        const selectedZoneNames: string[] = [];
        const selectedClass: string[] = [];
        const ticketCounts: number[] = [];
        const prices: number[] = [];
        let totalAmount = 0; // To store the total amount

        selectedZones.forEach((zone) => {
            const tickets = quantity[zone.seatingId] || 1;
            selectedSeatingIds.push(zone.seatingId);
            selectedZoneNames.push(zone.zoneName);
            selectedClass.push(zone.zoneName.split(' ')[0]); // Assuming the class is the first word of the zone name
            ticketCounts.push(tickets);
            prices.push(parseFloat(zone.price));

            const totalPriceForZone = parseFloat(zone.price) * tickets;
            totalAmount += totalPriceForZone;

            // console.log(`Zone: ${zone.zoneName}, Tickets: ${tickets}, Price per Ticket: ₹${zone.price}, Total Price: ₹${totalPriceForZone.toFixed(2)}`);
        });
        const eventBookingDetails = {
            seatingIds: selectedSeatingIds,
            noOfTickets: ticketCounts,
            selectedClass: selectedClass,
            zoneNames: selectedZoneNames,
            prices: prices,
            totalAmount: totalAmount.toFixed(2),
        };
        navigation.navigate('EventBookingDetails', {
            eventBookingDetails,
            eventId,
        });
    };


    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (seatingOptions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>No seating options available for this event.</Text>
            </View>
        );
    }

    console.log('seatingOptions', seatingOptions);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Book Event</Text>
            </View>
            <Text style={styles.subTitle}>Choose number of seats</Text>

            <FlatList
                data={seatingOptions}
                keyExtractor={(item) => item.seatingId.toString()}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity
                            style={[styles.zoneCard, { backgroundColor: selectedZones.some((zone) => zone.seatingId === item.seatingId) ? '#d3f3f7' : '#fff' }]}
                            onPress={() => toggleZoneSelection(item)}
                        >
                            <Text style={styles.zoneName}>{item.zoneName}</Text>
                            <Text style={styles.zonePrice}>Price: ${item.price}</Text>
                            <Text style={styles.zoneCapacity}>Capacity: {item.capacity}</Text>
                            {selectedZones.some((zone) => zone.seatingId === item.seatingId) && (
                                <Icon name="checkmark-circle" size={30} color="#4caf50" style={styles.checkIcon} />
                            )}
                        </TouchableOpacity>
                        {selectedZones.some((zone) => zone.seatingId === item.seatingId) && (
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={[styles.button, quantity[item.seatingId] === 1 && styles.disabledButton]}
                                    onPress={() => decrementQuantity(item.seatingId)}
                                    disabled={quantity[item.seatingId] === 1}
                                >
                                    <Text style={styles.buttonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity[item.seatingId]}</Text>
                                <TouchableOpacity
                                    style={[styles.button, quantity[item.seatingId] === 5 && styles.disabledButton]}
                                    onPress={() => incrementQuantity(item.seatingId)}
                                    disabled={quantity[item.seatingId] === 5}
                                >
                                    <Text style={styles.buttonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                disabled={selectedZones.length === 0}
            >
                <Text style={styles.continueButtonText}>
                    Continue - $
                    {selectedZones.reduce((total, zone) => total + parseFloat(zone.price) * (quantity[zone.seatingId] || 1), 0).toFixed(2)}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    zoneCard: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    zoneName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    zonePrice: {
        fontSize: 16,
        color: '#333',
        marginTop: 4,
    },
    zoneCapacity: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    checkIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    button: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#ddd',
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    quantityText: {
        fontSize: 20,
        marginHorizontal: 20,
    },
    continueButton: {
        backgroundColor: '#ff6f61',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default BookEventScreen;
