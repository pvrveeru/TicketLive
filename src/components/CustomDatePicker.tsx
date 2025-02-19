import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker';

interface CustomDatePickerProps {
  label?: string;
  date: Date | null;
  setDate: (date: Date) => void;
  isDarkMode?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ label = "Select Date", date, setDate, isDarkMode = false }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleConfirm = (selectedDate: Date) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  return (
    <View>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
          {date ? date.toDateString() : label}
        </Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={showDatePicker} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <DatePicker
              modal
              open={showDatePicker}
              date={date || new Date()}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={() => setShowDatePicker(false)}
              maximumDate={new Date()}
            />
          </View>
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default CustomDatePicker;
