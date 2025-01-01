import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomBar from './src/components/BottomBar';

const App = () => {
    return (
        <NavigationContainer>
            <BottomBar />
        </NavigationContainer>
    );
};

export default App;
