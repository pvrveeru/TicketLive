/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { ViewStyle, ImageStyle, StyleProp, ScrollView, Image, StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
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
          <View key={index} style={[styles.imageContainer, { width: screenWidth, height }]}>
            <Image
              source={{ uri: imageUrl }}
              style={[
                styles.image,
                { width: screenWidth * 0.95, height: height, borderRadius: 20 },
                imageStyle
              ]}
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
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
    width: '50%',
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
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
  },
});

export default CustomCarousel;
