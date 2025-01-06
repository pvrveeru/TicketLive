import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
};

type RootStackParamList = {
  ExploreDetails: { item: Product };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExploreDetails'>;

const ExploreScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>('');
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Fetch products
    axios
      .get<Product[]>('https://fakestoreapi.com/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.serach}>
        <Text style={styles.head}>Search</Text>
        <MaterialCommunityIcons name="dots-horizontal-circle-outline" color="#000" size={24} />
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={30} color="#888" style={styles.icon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <Text style={styles.len}>{filteredProducts.length} found</Text>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => {
          const currentDateTime = new Date().toLocaleString();
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ExploreDetails', { item })}
            >
              <View>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.dateTime}>{currentDateTime}</Text> {/* Add Date and Time */}
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures FlatList takes up remaining space
    padding: 10,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    paddingBottom: 50,
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  head: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
    paddingLeft: 30,
  },
  len: {
    paddingLeft: 30,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  serach: {
    flexDirection: 'row', // Aligns items horizontally
    alignItems: 'center', // Ensures vertical alignment
    justifyContent: 'space-between', // Adjust spacing between items (if needed)
    paddingRight: 30,
    marginBottom: 10, // Add margin to avoid overlapping with FlatList
  },
  dateTime: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
});

export default ExploreScreen;
