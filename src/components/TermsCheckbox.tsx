import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface TermsCheckboxProps {
  formData: { termsAccepted: boolean };
  setFormData: (data: { termsAccepted: boolean }) => void;
  errors: { termsAccepted?: string };
  isDarkMode: boolean;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ formData, setFormData, errors, isDarkMode }) => {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        onPress={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
        style={styles.checkbox}
      >
        <Icon 
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
  );
};

const styles = StyleSheet.create({
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default TermsCheckbox;
