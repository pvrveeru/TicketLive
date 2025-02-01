import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onChange: (newValue: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onChange(!value)} style={[styles.switchContainer, value && styles.switchEnabled]}>
        <View style={[styles.switchThumb, value && styles.thumbEnabled]} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchContainer: {
    width: 50,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#ccc',
    padding: 2,
    justifyContent: 'center',
  },
  switchEnabled: {
    backgroundColor: '#4caf50',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  thumbEnabled: {
    alignSelf: 'flex-end',
  },
});

export default CustomSwitch;
