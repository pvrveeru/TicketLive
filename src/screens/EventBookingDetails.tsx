import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/globalstyles';
import { useTheme } from '../Theme/ThemeContext';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface FormData {
    firstName: string;
    lastName: string;
    gender: string;
    dob: Date | null;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    termsAccepted: boolean;
}

interface RouteParams {
    eventBookingDetails: any;
    eventId: number;
    ismanual: boolean;
}
interface UserData {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string | null;
    emailId: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    termsAccepted: boolean;
}
interface RootState {
    userData: UserData;
}

interface FormField {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const EventBookingDetails: React.FC = ({ navigation }: any) => {
    const { isDarkMode } = useTheme();
    const route = useRoute();
    const userData = useSelector((state: RootState) => state.userData);
    // console.log('userData i event booking details', userData);
    const phoneNumber = userData?.phoneNumber;

    const { eventBookingDetails, eventId, ismanual } = route.params as RouteParams;
    console.log('noofticketslength', eventBookingDetails?.noOfTickets);
    const noOfTicketsLength = eventBookingDetails?.noOfTickets;
    console.log('noofTicketsLength', noOfTicketsLength);
    const [formData, setFormData] = useState<FormData>({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        gender: userData?.gender || 'Male',
        dob: userData?.dateOfBirth ? new Date(userData.dateOfBirth) : null,
        email: userData?.emailId || '',
        phone: userData?.phoneNumber || phoneNumber || '',
        address: userData?.address || '',
        city: userData?.city || '',
        state: userData?.state || '',
        termsAccepted: false,
    });

    const [showDropdown, setShowDropdown] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const genderOptions = ['Male', 'Female', 'Other'];
    const [fields, setFields] = useState<FormField[]>([
        { id: Date.now(), name: '', email: '', phone: '' },
    ]);

    const addField = () => {
        if (fields.length < noOfTicketsLength) {
            setFields([...fields, { id: Date.now(), name: '', email: '', phone: '' }]);
        } else {
            Alert.alert('Maximum number of tickets reached');
        }
    };

    const removeField = (id: number) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const handleSelectGender = (gender: string) => {
        setFormData({ ...formData, gender });
        setShowDropdown(false);
    };

    const handleDateConfirm = (selectedDate: Date) => {
        setFormData({ ...formData, dob: selectedDate });
        setShowDatePicker(false);
        setErrors({ ...errors, dob: '' });
    };
    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName) { newErrors.firstName = 'First name is required'; }
        if (!formData.lastName) { newErrors.lastName = 'Last name is required'; }
        if (!formData.email) { newErrors.email = 'Email is required'; }
        if (!formData.phone) { newErrors.phone = 'Phone number is required'; }
        if (!formData.address) { newErrors.address = 'Address is required'; }
        if (!formData.city) { newErrors.city = 'City is required'; }
        if (!formData.state) { newErrors.state = 'State is required'; }
        if (!formData.dob) { newErrors.dob = 'Date of birth is required'; }
        if (!formData.termsAccepted) { newErrors.termsAccepted = 'You must accept the Terms of Service'; }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (key: keyof FormData, value: string) => {
        setFormData({ ...formData, [key]: value });
        if (value.trim().length > 0) {
            setErrors({ ...errors, [key]: '' });
        }
    };

    const handleSubmit = async () => {
        if (validateFields()) {
            navigation.navigate('ReviewSummary', {
                formData: {
                    ...formData,
                    dob: formData.dob ? formData.dob.toISOString() : '',
                },
                bookingUsers: fields.map(field => ({
                    name: field.name,
                    email: field.email,
                    phone: field.phone,
                })),
                eventBookingDetails,
                eventId,
            });
        }
    };

    const renderGenderDropdown = () => (
        <ScrollView style={styles.dropdownList}>
            {genderOptions.map((gender, index) => (
                <TouchableOpacity
                    key={index.toString()} // Use index as key, but ideally use a unique identifier if available
                    style={styles.dropdownItem}
                    onPress={() => handleSelectGender(gender)}
                >
                    <Text style={[styles.dropdownItemText, { color: isDarkMode ? '#fff' : '#000' }]}>
                        {gender}
                    </Text>
                    {formData.gender === gender && (
                        <Icon name="checkmark" size={30} color="green" style={styles.checkIcon} />
                    )}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: isDarkMode ? '#333' : '#fff', marginTop: Platform.OS === 'ios' ? 50 : 0 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={30} color={isDarkMode ? '#fff' : '#333'} />
                    </TouchableOpacity>
                    <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Book Event</Text>
                </View>
                {!ismanual && (
                    <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 16, marginTop: 10 }}>Please Give Me Valid Details (or) Please carry the ticket for an event</Text>
                )}
                <Text style={[styles.Contact, { color: isDarkMode ? '#fff' : '#000' }]}>Contact Information</Text>

                <TextInput
                    style={[
                        styles.input,
                        { color: isDarkMode ? '#fff' : '#000' },
                    ]}
                    placeholder="First Name"
                    value={formData.firstName}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                    onChangeText={(text) => handleInputChange('firstName', text)}
                />
                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
                <TextInput
                    style={[
                        styles.input,
                        { color: isDarkMode ? '#fff' : '#000' },
                    ]}
                    placeholder="Last Name"
                    value={formData.lastName}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                    onChangeText={(text) => handleInputChange('lastName', text)}
                />
                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowDropdown(!showDropdown)}
                >
                    <Text style={[styles.dropdownText, { color: isDarkMode ? '#fff' : '#000' }]}>{formData.gender}</Text>
                    <Icon name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color={isDarkMode ? '#fff' : '#333'} />
                </TouchableOpacity>
                {showDropdown && renderGenderDropdown()}

                <TouchableOpacity style={
                    styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text style={[styles.dobText, { color: isDarkMode ? '#fff' : '#000' }]}>
                        {formData.dob ? formData.dob.toDateString() : 'Select Date of Birth'}
                    </Text>
                </TouchableOpacity>
                {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}

                <DatePicker
                    modal
                    open={showDatePicker}
                    date={formData.dob || new Date()}
                    mode="date"
                    onConfirm={(selectedDate) => handleDateConfirm(selectedDate)}
                    onCancel={() => setShowDatePicker(false)}
                    maximumDate={new Date()}
                />

                <TextInput
                    style={[
                        styles.input,
                        { color: isDarkMode ? '#fff' : '#000' },
                    ]}
                    placeholder="Email"
                    value={formData.email}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                <TextInput
                    style={[
                        styles.input,
                        { color: isDarkMode ? '#fff' : '#000' },
                    ]}
                    placeholder="Phone"
                    value={formData.phone}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    keyboardType="phone-pad"
                    editable={!phoneNumber}
                />
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

                <TextInput
                    style={[
                        styles.input,
                        { color: isDarkMode ? '#fff' : '#000' },
                    ]}
                    placeholder="Address"
                    value={formData.address}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                    onChangeText={(text) => handleInputChange('address', text)}
                />
                {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

                <TextInput
                    style={[
                        styles.input,
                        { color: isDarkMode ? '#fff' : '#000' },
                    ]}
                    placeholder="City"
                    value={formData.city}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                    onChangeText={(text) => handleInputChange('city', text)}
                />
                {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

                <TextInput
                    style={[
                        styles.input,
                        { color: isDarkMode ? '#fff' : '#000' },
                    ]}
                    placeholder="State"
                    value={formData.state}
                    placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                    onChangeText={(text) => handleInputChange('state', text)}
                />
                {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
                <View style={[styles.addusers, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 16 }}>Booking Users</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={addField}>
                        <MaterialIcons name="add-circle-outline" size={30} color="green" />
                        <Text style={{ fontSize: 16, marginLeft: 5, color: isDarkMode ? '#fff' : '#000' }}>Add</Text>
                    </TouchableOpacity>
                </View>
                {fields.map((field, index) => (
                    <View key={field.id} style={{ marginBottom: 10 }}>
                        <TextInput
                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                            placeholder="Name"
                            value={field.name}
                            placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                            onChangeText={(text) => {
                                const updatedFields = [...fields];
                                updatedFields[index].name = text;
                                setFields(updatedFields);
                            }}
                        />
                        <TextInput
                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                            placeholder="Email"
                            value={field.email}
                            placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                            onChangeText={(text) => {
                                const updatedFields = [...fields];
                                updatedFields[index].email = text;
                                setFields(updatedFields);
                            }}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                            placeholder="Phone"
                            value={field.phone}
                            placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
                            onChangeText={(text) => {
                                const updatedFields = [...fields];
                                updatedFields[index].phone = text;
                                setFields(updatedFields);
                            }}
                            keyboardType="phone-pad"
                        />
                        {fields.length > 1 && (
                            <TouchableOpacity onPress={() => removeField(field.id)}>
                                <Icon name="remove-circle-outline" size={30} color="red" />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                {/* <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                        onPress={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
                    >
                        <Text style={[styles.checkboxText, { color: isDarkMode ? '#fff' : '#000' }]}>
                            {formData.termsAccepted ? '✓' : '☐'} I accept the Terms of Service
                        </Text>
                    </TouchableOpacity>
                    {errors.termsAccepted ? <Text style={styles.errorText}>{errors.termsAccepted}</Text> : null}
                </View> */}
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                        onPress={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
                        style={styles.checkbox}
                    >
                        <FontAwesome
                            name={formData.termsAccepted ? 'check-square' : 'square-o'}
                            size={24}
                            color={isDarkMode ? '#fff' : '#000'}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.checkboxText, { color: isDarkMode ? '#fff' : '#000' }]}>
                        I accept the Terms of Service
                    </Text>
                    {errors.termsAccepted && <Text style={styles.errorText}>{errors.termsAccepted}</Text>}
                </View>
            </ScrollView>
            <View style={{ backgroundColor: isDarkMode ? '#000' : '#fff' }}>
                <TouchableOpacity
                    style={[styles.button, !formData.termsAccepted && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={!formData.termsAccepted}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    addusers: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    Contact: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
        justifyContent: 'center',
        color: 'black',
        fontWeight: 'bold',
    },
    dobText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    dropdown: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropdownList: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        maxHeight: 150,
        marginBottom: 10,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    dropdownItemText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkIcon: {
        marginLeft: 10,
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxText: {
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.red,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 5,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default EventBookingDetails;
