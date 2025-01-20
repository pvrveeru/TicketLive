import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../styles/globalstyles';
import { useTheme } from '../Theme/ThemeContext';

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
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setLoading(true);
    axios
      .get<Product[]>('https://fakestoreapi.com/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const toggleLike = (productId: number) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.serach}>
        <Text style={[styles.head, isDarkMode ? styles.darkText : styles.lightText]}>Search</Text>
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          color={isDarkMode ? 'white' : 'black'}
          size={24}
        />
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

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.red} style={styles.loader} />
      ) : (
        <>
          <Text style={[styles.len, isDarkMode ? styles.darkText : styles.lightText]}>
            {filteredProducts.length} found
          </Text>

          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => {
              const isLiked = likedProducts.includes(item.id);
              const currentDateTime = new Date().toLocaleString();
              return (
                <TouchableOpacity
                  style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}
                  onPress={() => navigation.navigate('ExploreDetails', { item })}
                >
                  <View>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                      {item.title}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Text style={styles.dateTime}>{currentDateTime}</Text>
                      <TouchableOpacity
                        // style={styles.heartIcon}
                        onPress={() => toggleLike(item.id)}
                      >
                        <Icon
                          name="heart"
                          size={24}
                          color={isLiked ? COLORS.red : '#fff'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  lightContainer: {
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
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightCard: {
    backgroundColor: '#fff',
  },
  darkCard: {
    backgroundColor: '#888',
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
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  serach: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 30,
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    position: 'absolute',
    bottom: 10,
    right: 5,
  },
});

export default ExploreScreen;
