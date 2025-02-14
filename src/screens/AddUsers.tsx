import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FormField {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const Addusers = () => {
    const [fields, setFields] = useState<FormField[]>([
        { id: 1, name: '', email: '', phone: '' },
    ]);

    const addField = () => {
        setFields([...fields, { id: Date.now(), name: '', email: '', phone: '' }]);
    };

    const removeField = (id: number) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const handleChange = (id: number, key: keyof FormField, value: string) => {
        setFields(fields.map(field => (field.id === id ? { ...field, [key]: value } : field)));
    };

    const handleSubmit = () => {
        console.log('Submitted Values:', fields);
        Alert.alert('Submitted!', JSON.stringify(fields, null, 2));
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <FlatList
                data={fields}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 15, borderWidth: 1, padding: 10, borderRadius: 5 }}>
                        <TextInput
                            placeholder="Name"
                            value={item.name}
                            onChangeText={text => handleChange(item.id, 'name', text)}
                            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
                        />
                        <TextInput
                            placeholder="Email"
                            value={item.email}
                            onChangeText={text => handleChange(item.id, 'email', text)}
                            keyboardType="email-address"
                            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
                        />
                        <TextInput
                            placeholder="Phone Number"
                            value={item.phone}
                            onChangeText={text => handleChange(item.id, 'phone', text)}
                            keyboardType="phone-pad"
                            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {fields.length > 1 && (
                                <TouchableOpacity onPress={() => removeField(item.id)} style={{ alignSelf: 'flex-end' }}>
                                    <Icon name="remove-circle-outline" size={30} color="red" />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={addField} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="add-circle-outline" size={30} color="green" />
                                <Text style={{ fontSize: 16, marginLeft: 5 }}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />


            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Addusers;
