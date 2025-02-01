import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Image, StyleSheet, View, Dimensions } from 'react-native';
import { fetchBannerImages } from '../services/Apiservices';

const HomeCarousel: React.FC = () => {
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const getBannerImages = async () => {
      const images = await fetchBannerImages();
      setBannerImages(images);
    };

    getBannerImages();
  }, []);

  useEffect(() => {
    if (bannerImages?.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 < bannerImages?.length ? prevIndex + 1 : 0;
        scrollViewRef.current?.scrollTo({
          x: screenWidth * nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [bannerImages, screenWidth]);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: screenWidth }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {bannerImages?.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={[styles.image, { width: screenWidth }]} // Ensure the image fills the width of the container
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: '25%', // Adjust the height of the container as needed
    width: '100%', // Ensure the container takes the full width
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ccc", // Background color for the carousel
  },
  image: {
    height: '100%', // Ensure the image fills the container height
    resizeMode: 'cover', // Use 'cover' to ensure the image covers the container without distortion
  },
});

export default HomeCarousel;
