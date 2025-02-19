import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../Theme/ThemeContext';

interface CustomDatePickerProps {
  label?: string;
  date: Date | null;
  setDate: (date: Date) => void;
  isDarkMode?: boolean;
}

const formatDate = (date: Date | null) => {
  if (!date) return '';
  return date instanceof Date ? date.toISOString().split('T')[0] : date; // Safely format the date
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ label = "Enter DOB", date, setDate }) => {
  const { isDarkMode } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleConfirm = (selectedDate: Date) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  return (
    <View>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
          {date ? formatDate(date) : label}
        </Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={showDatePicker} animationType="fade">
        <View style={styles.modalBackground}>
            <DatePicker
              modal
              open={showDatePicker}
              date={date instanceof Date ? date : new Date()} // Ensure date is always a Date object
              mode="date"
              onConfirm={handleConfirm}
              onCancel={() => setShowDatePicker(false)}
              maximumDate={new Date()}
            />
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // modalContainer: {
  //   backgroundColor: 'white',
  //   padding: 20,
  //   borderRadius: 10,
  // },
});

export default CustomDatePicker;
