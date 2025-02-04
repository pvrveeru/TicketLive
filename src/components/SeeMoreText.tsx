import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../styles/globalstyles";
import { useTheme } from "../Theme/ThemeContext";

interface SeeMoreTextProps {
  text: string;
  maxLength?: number;
}

const SeeMoreText: React.FC<SeeMoreTextProps> = ({ text, maxLength = 70 }) => {
  const { isDarkMode } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
      {expanded ? text : `${text.slice(0, maxLength)}... `}
      {text.length > maxLength && (
        <TouchableOpacity onPress={toggleExpanded}>
          <Text style={styles.seeMore}>{expanded ? "See Less" : "See More"}</Text>
        </TouchableOpacity>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    marginHorizontal: 20,
  },
  seeMore: {
    color: COLORS.red,
    fontWeight: "bold",
  },
});

export default SeeMoreText;
