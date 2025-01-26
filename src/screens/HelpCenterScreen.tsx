import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelpCenterScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Help Center Screen</Text>
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

export default HelpCenterScreen;
