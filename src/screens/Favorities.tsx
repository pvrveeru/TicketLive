import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavoritiesScreen = () => {
    return (
        <View style={styles.container}>
            <Text>FavoritiesScreen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FavoritiesScreen;
