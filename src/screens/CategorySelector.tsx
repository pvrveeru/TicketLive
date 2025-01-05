import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or any other icon set
import { COLORS } from '../styles/globalstyles';

const categories = ['All', 'Music', 'Art', 'Workshops'];

const CategorySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const renderIcon = (category: string) => {
    const iconColor = selectedCategory === category ? 'white' : '#000'; // Change color based on selection

    switch (category) {
      case 'All':
        return <Icon name="checkbox-marked" size={20} color={iconColor} />;
      case 'Music':
        return <Icon name="music-note" size={20} color={iconColor} />;
      case 'Art':
        return <Icon name="palette" size={20} color={iconColor} />;
      case 'Workshops':
        return <Icon name="briefcase" size={20} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          onPress={() => handleCategoryPress(category)}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonSelected,
          ]}
        >
          <View style={styles.iconContainer}>
            {renderIcon(category)}
          </View>
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextSelected,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 10,
    borderColor: COLORS.red,
    borderWidth: 1,
    borderRadius: 20,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.red,
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
  categoryTextSelected: {
    fontWeight: 'bold',
    color: 'white',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategorySelector;
