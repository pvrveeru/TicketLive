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
    width: 40,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#ccc',
    padding: 3,
    justifyContent: 'center',
  },
  switchEnabled: {
    backgroundColor: '#4caf50',
  },
  switchThumb: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  thumbEnabled: {
    alignSelf: 'flex-end',
  },
});

export default CustomSwitch;
