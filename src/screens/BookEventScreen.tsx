/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSeatingOptionsByEventId } from '../services/Apiservices';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Theme/ThemeContext';
import SkeletonLoader from '../components/SkeletonLoading';
import { Platform } from 'react-native';
import { COLORS } from '../styles/globalstyles';

interface RouteParams {
    eventId: number;
    layoutImage: string;
    maxTickets: number;
    noOfTickets: number;
}

interface SeatingOption {
    seatingId: number;
    zoneName: string;
    price: string;
    capacity: number;
}

type Event = {
    eventId: number;
    title: string;
};

type SeatingZone = {
    capacity: number;
    createdAt: string;
    event: Event;
    eventId: number;
    price: string;
    seatingId: number;
    seatsAvailable: number;
    updatedAt: string;
    zoneName: string;
};

const BookEventScreen: React.FC = () => {
    const route = useRoute();
    const { isDarkMode } = useTheme();
    const navigation = useNavigation<any>();
    const { eventId, layoutImage, maxTickets, noOfTickets } = route.params as RouteParams;
    const [seatingOptions, setSeatingOptions] = useState<SeatingZone[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<{ [key: number]: number }>({});
    const [selectedZones, setSelectedZones] = useState<SeatingZone[]>([]);
    const [limitExceeded, setLimitExceeded] = useState<boolean>(false);
    const [ismanual, setIsManual] = useState<boolean>(false);
    const [skloading, setSkLoading] = useState<boolean>(true);
    // console.log('noOfTickets maxTickets', noOfTickets ,maxTickets);
    useEffect(() => {
        const fetchSeatingOptions = async () => {
            try {
                const options = await getSeatingOptionsByEventId(eventId);
                // console.log('options', options);
                if (Array.isArray(options)) {
                    setSeatingOptions(options);
                    if (options.length > 0) {
                        setIsManual(options[0].event.isManual);
                    }
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

   
    const getTotalQuantity = () => {
        return Object.values(quantity).reduce((total, num) => total + num, 0);
    };
    const MAX_TOTAL_QUANTITY = maxTickets - noOfTickets;
    // console.log('MAX_TOTAL_QUANTITY', MAX_TOTAL_QUANTITY);
    const toggleZoneSelection = (zone: SeatingZone) => {
        if (zone.seatsAvailable === 0) return;
        if (selectedZones.some((selectedZone) => selectedZone.seatingId === zone.seatingId)) {
            setSelectedZones(selectedZones.filter((selectedZone) => selectedZone.seatingId !== zone.seatingId));
            const newQuantity = { ...quantity };
            delete newQuantity[zone.seatingId];
            setQuantity(newQuantity);
            setLimitExceeded(false);
        } else {
            if (getTotalQuantity() + 1 > MAX_TOTAL_QUANTITY) {
                setLimitExceeded(true);
                Alert.alert('Limit Exceeded', 'You cannot select more than 5 tickets.');
                return;
            }
            setSelectedZones([...selectedZones, zone]);
            setQuantity((prev) => ({ ...prev, [zone.seatingId]: 1 }));
        }
    };

    const incrementQuantity = (zone: SeatingZone) => {
        if (getTotalQuantity() < MAX_TOTAL_QUANTITY && quantity[zone.seatingId] < zone.seatsAvailable) {
            setQuantity((prev) => ({ ...prev, [zone.seatingId]: prev[zone.seatingId] + 1 }));
            setLimitExceeded(false);
        } else {
            Alert.alert('Limit Reached', 'Cannot exceed available seats or max limit.');
        }
    };

    const decrementQuantity = (zoneId: number) => {
        if (quantity[zoneId] > 1) {
            setQuantity((prev) => ({ ...prev, [zoneId]: prev[zoneId] - 1 }));
        }
    };

    const handleBackPress = () => {
        navigation.goBack(); // Go back to the previous screen
    };

    const handleContinue = () => {
        const selectedSeatingIds: number[] = [];
        const selectedZoneNames: string[] = [];
        const selectedClass: string[] = [];
        const ticketCounts: number[] = [];
        const prices: number[] = [];
        let totalAmount = 0;

        selectedZones.forEach((zone) => {
            const tickets = quantity[zone.seatingId] || 1;
            selectedSeatingIds.push(zone.seatingId);
            selectedZoneNames.push(zone.zoneName);
            selectedClass.push(zone.zoneName.split(' ')[0]);
            ticketCounts.push(tickets);
            prices.push(parseFloat(zone.price));

            const totalPriceForZone = parseFloat(zone.price) * tickets;
            totalAmount += totalPriceForZone;

            // console.log(Zone: ₹{zone.zoneName}, Tickets: ₹{tickets}, Price per Ticket: ₹₹{zone.price}, Total Price: ₹₹{totalPriceForZone.toFixed(2)});
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
            ismanual,
        });
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <FlatList
                data={seatingOptions}
                keyExtractor={(item) => item.seatingId.toString()}
                ListHeaderComponent={
                    <View>

                        <View style={styles.imageContainer}>
                            {/* {skloading && (
                                <SkeletonLoader width='100%' height={300}
                                />
                            )} */}
                            <Image
                                source={{ uri: layoutImage }}
                                style={styles.layoutImage}
                            // onLoad={() => setSkLoading(false)}
                            // onError={() => setSkLoading(false)}
                            />
                            <TouchableOpacity onPress={handleBackPress} style={styles.backArrow}>
                                <Icon name="arrow-back" size={30} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.subTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Choose Number of Seats</Text>

                        {limitExceeded && (
                            <Text style={styles.limitText}>⚠️ Your limit is exceeded! Maximum 5 tickets allowed.</Text>
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.zoneCard,
                            { backgroundColor: item.seatsAvailable === 0 ? '#ccc' : selectedZones.some((zone) => zone.seatingId === item.seatingId) ? '#d3f3f7' : '#fff' }
                        ]}
                        onPress={() => toggleZoneSelection(item)}
                        disabled={item.seatsAvailable === 0}
                    >
                        <View style={styles.rowContainer}>
                            <View style={styles.zoneDetails}>
                                <Text style={styles.zoneName}>{item.zoneName}</Text>
                                <Text style={styles.zonePrice}>Price: ₹{item.price}</Text>
                                <Text style={styles.zoneCapacity}>Available Seats: {item.seatsAvailable}</Text>
                            </View>
                            {selectedZones.some((zone) => zone.seatingId === item.seatingId) && item.seatsAvailable > 0 && (
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
                                        style={[styles.button, quantity[item.seatingId] >= item.seatsAvailable && styles.disabledButton]}
                                        onPress={() => incrementQuantity(item)}
                                        disabled={quantity[item.seatingId] >= item.seatsAvailable}
                                    >
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        {item.seatsAvailable === 0 && <Text style={styles.noSeatsText}>Seats are not available</Text>}
                    </TouchableOpacity>
                )}

                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                disabled={selectedZones.length === 0}
            >
                <Text style={styles.continueButtonText}>
                    Continue - ₹
                    {selectedZones.reduce((total, zone) => total + parseFloat(zone.price) * (quantity[zone.seatingId] || 1), 0).toFixed(2)}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    backArrow: {
        position: 'absolute',
        top: 10,
        left: 20,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 10,
    },
    layoutImage: {
        width: '95%',
        height: 300,
        alignSelf: 'center',
        resizeMode: 'cover',
        borderRadius: 0,
    },
    layoutText: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
        fontSize: 14,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    zoneDetails: {
        flex: 1,
    },
    limitText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
    },
    noSeatsText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
    },
    container: {
        flex: 1,
        // padding: 16,
        backgroundColor: '#f9f9f9',
        paddingTop: Platform.OS === 'ios' ? 50 : 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 20,
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
        marginLeft: 16,
        paddingBottom: 0,
        marginBottom: 10,
        textAlign: 'center',
        
    },
    zoneCard: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        //margin: 16,
        marginHorizontal: 16,
       
        
    },
    zoneName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    zonePrice: {
        fontSize: 16,
        color: '#333',
        marginTop: 2,
        fontWeight: 'bold',
    },
    zoneCapacity: {
        fontSize: 16,
        color: '#666',
        marginTop: 2,
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
        backgroundColor: '#EF412B',
        padding: 16,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 10,
    },
    continueButtonText: {
        fontSize: 18,
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
