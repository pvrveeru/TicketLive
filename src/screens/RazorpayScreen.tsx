// RazorpayScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

interface RazorpayProps {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  orderId: string;
  contact: string;
  email: string;
}

const RazorpayScreen: React.FC<RazorpayProps> = ({
  amount,
  currency = 'INR',
  name,
  description,
  orderId,
  contact,
  email,
}) => {
  const handlePayment = () => {
    const options = {
      description,
      image: 'https://your-logo-url.com/logo.png',
      currency,
      key: 'rzp_test_yourapikey', // Replace with your Razorpay Key ID
      amount: amount * 100, // Amount in paise
      name,
      order_id: orderId,
      prefill: {
        email,
        contact,
        name,
      },
      theme: { color: '#F37254' },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        Alert.alert('Payment Failed', error.description);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Razorpay Payment</Text>
      <TouchableOpacity
        onPress={handlePayment}
        style={{
          backgroundColor: '#F37254',
          padding: 15,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Pay ₹{amount}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RazorpayScreen;
