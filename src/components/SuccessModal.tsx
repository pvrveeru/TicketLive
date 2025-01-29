import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Import FontAwesome icon set

interface SuccessModalProps {
    isVisible: boolean;
    onClose: () => void;
    onViewTicket: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isVisible, onClose, onViewTicket }) => {
    const { width, height } = Dimensions.get('window');
    return (
        <Modal
        animationType="fade" // Or "slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose} // Handles back button press on Android
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: width * 0.8, maxHeight: height * 0.6 }]}>
            <View style={styles.iconContainer}>
              <View style={styles.circle}>
                <Icon name="check" size={60} color="white" />
              </View>
            </View>
            <Text style={styles.title}>Congratulations!</Text>
            <Text style={styles.message}>
              <Text>You have successfully placed an order for National Music Festival. Enjoy the event!</Text>
            </Text>
            <TouchableOpacity style={styles.viewTicketButton} onPress={onViewTicket}>
              <Text style={styles.buttonText}>View Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    iconContainer: {
        marginBottom: 20,
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        marginBottom: 20,
    },
    viewTicketButton: {
        backgroundColor: '#FF6B6B', // Example color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    cancelButtonText: {
        color: 'grey',
        textAlign: 'center',
    },
});

export default SuccessModal;
