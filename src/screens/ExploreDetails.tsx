import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

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

const ExploreDetails: React.FC<ExploreDetailsProps> = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>Hybrid Model</Text>
      </View>

      <View>
        <Text style={styles.about}>About Event</Text>
        <Text>{item.description}</Text>
      </View>

      <View>
        <Text style={styles.location}>Location</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    elevation: 7,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative', // Enables positioning inside this container
  },
  image: {
    width: 400,
    height: 300,
    alignSelf: 'center',
    marginBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'black',
  },
  title: {
    position: 'absolute', // Allows the title to be positioned over the image
    right: 10, // Position the title on the right side of the image
    top: 230, // Adjust the vertical alignment of the title
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background for readability
    padding: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  about: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
    paddingTop: 20,
  },
  location: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
    paddingTop: 20,
  },
});

export default ExploreDetails;
