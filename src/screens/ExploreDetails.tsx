import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../Theme/ThemeContext';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
};

type ExploreDetailsRouteProp = RouteProp<{ ExploreDetails: { item: Product } }, 'ExploreDetails'>;

type ExploreDetailsProps = {
  route: ExploreDetailsRouteProp;
};
export type RootStackParamList = {
  ExploreDetails: { item: Product };
  BookEventScreen: { item: Product };
  // Add other screens here
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExploreDetails'>;

const ExploreDetails: React.FC<ExploreDetailsProps> = ({ route }) => {
  const { isDarkMode } = useTheme();
  const { item } = route.params;
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>Hybrid Model</Text>
      </View>

      <View>
        <Text style={[styles.about, { color: isDarkMode ? '#fff' : '#000' }]}>About Event</Text>
        <Text style={{ color: isDarkMode ? '#ccc' : '#000' }}>{item.description}</Text>
      </View>

      <View>
        <Text style={[styles.location, { color: isDarkMode ? '#fff' : '#000' }]}>Location</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Book Event"
          onPress={() => navigation.navigate('BookEventScreen', { item })}
          color={isDarkMode ? '#6200ee' : '#007bff'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: 'black',
  },
  title: {
    position: 'absolute',
    right: 10,
    top: 230,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  about: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 20,
  },
  location: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 20,
  },
  buttonWrapper: {
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },
});

export default ExploreDetails;
