import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../styles/globalstyles";
import { useTheme } from "../Theme/ThemeContext";

interface HeaderProps {
    profileImageUrl?: string;
    profileImage?: any;
    userName?: string;
    isDarkMode?: boolean;
    Welcome?: string;
    onProfilePress?: () => void;
    onNotificationPress?: () => void;
    title?: string;
}

const Header: React.FC<HeaderProps> = ({
    // profileImageUrl,
    profileImage,
    // userName,
    // Welcome,
    onProfilePress,
    onNotificationPress,
    title,
}) => {
    const { isDarkMode } = useTheme();

    return (
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#000' : '#fff'}]}>
            <TouchableOpacity onPress={onProfilePress} style={styles.profile}>
                {/* {profileImageUrl ? (
                    <Image
                        source={{ uri: profileImageUrl }}
                        style={styles.profileImage}
                    />
                ) : (
                    <Image source={profileImage} style={styles.profileImage} />
                )} */}
                <Image source={profileImage} style={styles.profileImage} />
            </TouchableOpacity>
            {title && <Text style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>{title}</Text>}

            {onNotificationPress && (
                <TouchableOpacity style={styles.notificationIcon} onPress={onNotificationPress}>
                    <MaterialCommunityIcons
                        name="bell-badge-outline"
                        style={[styles.socialIcon, isDarkMode ? styles.darkIcon : styles.lightIcon]}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingLeft: 10,
        height:60,
        marginTop: Platform.OS === 'ios' ? 50 : 0,
    },
    profile: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: '55%',
        height: 50,
        marginLeft: 10,
     
    },
    light: {
        fontSize: 14,
        color: "#555",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        alignItems: "center",
    },
    darkText: {
        color: "#fff",
    },
    lightText: {
        color: "#000",
        fontSize: 16,
        fontWeight: 'bold',
    },
    notificationIcon: {
        //padding: 10,
        paddingRight:20,
       
    },
    socialIcon: {
        fontSize: 24,
    },
    darkIcon: {
        color: "#fff",
    },
    lightIcon: {
        color: COLORS.red,
    },
});

export default Header;
