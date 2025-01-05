import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchBar: React.FC = () => {
  return (
    <View style={styles.searchBar}>
      <Icon name="search" size={20} color="grey" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="What event are you looking for"
        placeholderTextColor="grey"
      />
      <Icon name="filter" size={20} color="grey" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
