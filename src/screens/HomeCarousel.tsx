/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Image, StyleSheet, View, Dimensions } from 'react-native';
import { fetchBannerImages } from '../services/Apiservices';

const HomeCarousel: React.FC = () => {
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const screenWidth = Dimensions.get('window').width;

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
    }, 3000);

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
        contentContainerStyle={styles.scrollViewContent}
      >
        {bannerImages?.map((imageUrl, index) => (
          <View key={index} style={[styles.imageWrapper, { width: screenWidth }]}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 180,
    width: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});

export default HomeCarousel;
