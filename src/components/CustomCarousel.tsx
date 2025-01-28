import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Image, StyleSheet, View, Dimensions, StyleProp, ViewStyle, ImageStyle } from 'react-native';

interface CustomCarouselProps {
  images: string[]; // Array of image URLs
  interval?: number; // Auto-scroll interval in milliseconds (default: 3000)
  height?: number; // Height of the carousel (default: 200)
  containerStyle?: StyleProp<ViewStyle>; // Custom style for the container
  imageStyle?: StyleProp<ImageStyle>; // Custom style for images
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  images,
  interval = 3000,
  height = 200,
  containerStyle,
  imageStyle,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const screenWidth = Dimensions.get('window').width;

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
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={[styles.image, { width: screenWidth, height }, imageStyle]}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
});

export default CustomCarousel;
