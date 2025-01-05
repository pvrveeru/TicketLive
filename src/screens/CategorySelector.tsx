import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or any other icon set
import { COLORS } from '../styles/globalstyles';
import { useTheme } from '../Theme/ThemeContext';

const categories = ['All', 'Music', 'Art', 'Workshops'];

const CategorySelector = () => {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const renderIcon = (category: string) => {
    const iconColor = selectedCategory === category ? 'white' : isDarkMode ? '#fff' : '#000'; // Adjust icon color based on theme

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
            {
              backgroundColor: selectedCategory === category ? COLORS.red : isDarkMode ? '#444' : '#fff',
              borderColor: isDarkMode ? 'white' : COLORS.red,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            {renderIcon(category)}
          </View>
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextSelected,
              { color: isDarkMode ? '#fff' : '#000' }, // Text color adjustment based on theme
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
    borderWidth: 1,
    borderRadius: 20,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.red, // Red background for the selected button
  },
  categoryText: {
    fontSize: 16,
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
