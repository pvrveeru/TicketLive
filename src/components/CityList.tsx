import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Pressable,
} from 'react-native';
import { useTheme } from '../Theme/ThemeContext';

// Define types for API responses
interface State {
    name: string;
    iso2: string;
}

interface City {
    name: string;
}

interface CityListProps {
    setState: React.Dispatch<React.SetStateAction<string | null>>;
    setCity: React.Dispatch<React.SetStateAction<string | null>>;
    state: string | null;
    city: string | null;
}

const CityList: React.FC<CityListProps> = ({ setState, setCity, state, city }) => {
    const { isDarkMode } = useTheme();
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [stateModalVisible, setStateModalVisible] = useState(false);
    const [cityModalVisible, setCityModalVisible] = useState(false);

    const API_KEY = 'a1JiQml0MEtyRUx5dnhyV1BPdVAzY0dqYVVud3poa3F3SHBSSmJFYQ=='; // Replace with your actual API key

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async (): Promise<void> => {
        try {
            const response = await fetch(
                'https://api.countrystatecity.in/v1/countries/IN/states',
                {
                    method: 'GET',
                    headers: { 'X-CSCAPI-KEY': API_KEY },
                }
            );
            const data: State[] = await response.json();
            setStates(data);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const fetchCities = async (stateCode: string): Promise<void> => {
        try {
            const response = await fetch(
                `https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`,
                {
                    method: 'GET',
                    headers: { 'X-CSCAPI-KEY': API_KEY },
                }
            );
            const data: City[] = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const filteredStates = states.filter(state =>
        state.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* State Selection */}
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setStateModalVisible(true)}
            >
                <Text style={[styles.dropdownText, { color: isDarkMode ? '#fff' : '#000' }]}>
                    {state ? state : 'Select State'}
                </Text>
            </TouchableOpacity>

            {/* Modal for State Selection */}
            <Modal
                visible={stateModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setStateModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setStateModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search States"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <FlatList
                            data={filteredStates}
                            keyExtractor={(item) => item.iso2}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => {
                                        setState(item.name);
                                        setStateModalVisible(false);
                                        fetchCities(item.iso2);
                                        setCity(null);
                                        setSearchQuery('');
                                    }}
                                >
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>

            {/* City Selection */}
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => cities.length > 0 && setCityModalVisible(true)}
                disabled={cities.length === 0}
            >
                <Text style={[styles.dropdownText, cities.length === 0 && { color: '#999' }, { color: isDarkMode ? '#fff' : '#000' }]}>
                    {city ? city : 'Select City'}
                </Text>
            </TouchableOpacity>

            {/* Modal for City Selection */}
            <Modal
                visible={cityModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCityModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setCityModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Cities"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <FlatList
                            data={filteredCities}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => {
                                        setCity(item.name);
                                        setCityModalVisible(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        alignItems: 'flex-start',
    },
    dropdownText: { fontSize: 16, color: '#333' },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        maxHeight: '60%',
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    searchInput: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        marginBottom: 15,
    },
});

export default CityList;