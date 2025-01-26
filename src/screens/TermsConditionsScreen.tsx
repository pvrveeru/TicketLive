import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsConditionsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Terms & Conditions Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TermsConditionsScreen;
