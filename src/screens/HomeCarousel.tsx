import React, { useEffect, useState } from 'react';
import { ScrollView, Image, StyleSheet, View, Text } from 'react-native';
import { fetchBannerImages } from '../services/Apiservices';

const HomeCarousel: React.FC = () => {
    const [bannerImages, setBannerImages] = useState<string[]>([]);

    useEffect(() => {
        const getBannerImages = async () => {
            const images = await fetchBannerImages();
            setBannerImages(images);
        };

        getBannerImages();
    }, []);

    return (
        <View style={styles.carouselContainer}>
            {bannerImages.length === 0 ? (
                <Text>No banners available.</Text>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {bannerImages.map((imageUrl, index) => (
                        <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 200,
        marginRight: 10,
    },
});

export default HomeCarousel;
