import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  FullMapScreen: {
    latitude: number;
    longitude: number;
    title: string;
    location: string;
  };
};

type FullMapScreenRouteProp = RouteProp<RootStackParamList, 'FullMapScreen'>;

const FullMapScreen: React.FC = () => {
  const route = useRoute<FullMapScreenRouteProp>();
  const navigation = useNavigation();
  const { latitude, longitude, title, location } = route.params;

  // Navigation back function
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{location}</Text>
        </View>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title={title} description={location}>
          <Callout>
            <View style={styles.callout}>
              <Text>{title}</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  backButton: {
    marginRight: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default FullMapScreen;
