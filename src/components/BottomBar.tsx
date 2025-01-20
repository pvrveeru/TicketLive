import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ExploreScreen from '../screens/ExploreScreen';
import FavoritiesScreen from '../screens/Favorities';
import TicketsScreen from '../screens/TicketsScreen';
import { useTheme } from '../Theme/ThemeContext'; // Import the useTheme hook

const Tab = createBottomTabNavigator();

// Function to map icons to tab names
const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
    if (routeName === 'Tickets') {
        // Use MaterialCommunityIcons for 'Tickets'
        return (
            <MaterialCommunityIcons
                name={focused ? 'ticket-confirmation-outline' : 'ticket-confirmation-outline'}
                size={size}
                color={color}
            />
        );
    }

    // Default icons for other tabs using Ionicons
    let iconName = '';

    switch (routeName) {
        case 'Home':
            iconName = focused ? 'home' : 'home';
            break;
        case 'Explore':
            iconName = focused ? 'compass-outline' : 'compass-outline';
            break;
        case 'Favorities':
            iconName = focused ? 'heart-outline' : 'heart-outline';
            break;
        case 'Profile':
            iconName = focused ? 'person-outline' : 'person-outline';
            break;
        default:
            break;
    }

    return <Ionicons name={iconName} size={size} color={color} />;
};

const BottomBar = () => {
    const { isDarkMode } = useTheme(); // Get the current theme from context

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) =>
                    getTabBarIcon(route.name, focused, color, size),
                tabBarActiveTintColor: isDarkMode ? '#EF412B' : '#EF412B', // Active icon color
                tabBarInactiveTintColor: isDarkMode ? '#A6A6A6' : '#26276C', // Inactive icon color
                tabBarStyle: {
                    backgroundColor: isDarkMode ? '#333' : '#FFF', // Background color of the tab bar
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />
            <Tab.Screen name="Favorities" component={FavoritiesScreen} />
            <Tab.Screen name="Tickets" component={TicketsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomBar;
