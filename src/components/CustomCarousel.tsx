import React, { useEffect, useRef, useState } from 'react';
import { ViewStyle } from 'react-native';
import { ImageStyle } from 'react-native';
import { StyleProp } from 'react-native';
import { ScrollView, Image, StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomCarouselProps {
  images: string[];
  interval?: number;
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  artistName?: string;
  eventTitle?: string;
  onBackPress: () => void;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  images,
  interval = 3000,
  height = 200,
  containerStyle,
  imageStyle,
  artistName,
  eventTitle,
  onBackPress
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const screenWidth = Dimensions.get('window').width;
  const displayArtistName = artistName || 'Unknown Artist';
  const displayEventTitle = eventTitle || 'Untitled Event';

  useEffect(() => {
    if (images.length === 0) return;

    const autoScroll = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 < images.length ? prevIndex + 1 : 0;
        scrollViewRef.current?.scrollTo({
          x: screenWidth * nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(autoScroll);
  }, [images, screenWidth, interval]);

  return (
    <View style={[styles.carouselContainer, { height }, containerStyle]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: screenWidth }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {images.map((imageUrl, index) => (
          <View key={index} style={{ width: screenWidth, height }}>
            <Image
              source={{ uri: imageUrl }}
              style={[styles.image, { width: screenWidth, height }, imageStyle]}
            />
            <View style={styles.overlay}>
              <Text style={styles.artistText}>{`By ${displayArtistName}`}</Text>
              <Text style={styles.eventText}>{displayEventTitle}</Text>
            </View>
            <TouchableOpacity onPress={onBackPress} style={styles.backArrow}>
              <Icon name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    width: 200,
  },
  artistText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backArrow: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
  },
});

export default CustomCarousel;