import { StyleSheet } from 'react-native';

// Define color constants
export const COLORS = {
  blue: '#26276c', // Blue color
  red: '#ef412b',  // Red color
};

// Global styles
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: COLORS.blue, // Use the blue color from COLORS
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
