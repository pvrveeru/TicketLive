/* eslint-disable react-hooks/exhaustive-deps */
// import React from "react";
// import { View, StyleSheet, ViewStyle } from "react-native";
// import LinearGradient from "react-native-linear-gradient";

// interface SkeletonLoaderProps {
//   width?: number | string;
//   height?: number | string;
//   borderRadius?: number;
//   style?: ViewStyle;
// }

// const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
//   width = "100%",
//   height = 20,
//   borderRadius = 8,
//   style = {},
// }) => {
//   const containerStyle: ViewStyle = {
//     width: typeof width === "number" ? width : undefined,
//     height: typeof height === "number" ? height : undefined,
//     borderRadius,
//     ...style,
//   };

//   return (
//     <View style={containerStyle}>
//       <LinearGradient
//         colors={["#E0E0E0", "#F5F5F5", "#E0E0E0"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={[styles.skeleton, containerStyle]} // Ensure proper type handling
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   skeleton: {
//     flex: 1, // Ensures it stretches within the container
//     backgroundColor: "#E0E0E0",
//     overflow: "hidden",
//   },
// });

// export default SkeletonLoader;
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle, Easing, DimensionValue } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface SkeletonLoaderProps {
  width?: number | `${number}%`; // ✅ Ensure correct DimensionValue type
  height?: number | `${number}%`; // ✅ Ensure correct DimensionValue type
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style = {},
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false, // Linear gradient animation requires layout updates
      })
    );

    shimmerLoop.start();
    return () => shimmerLoop.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-150%", "150%"],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: width as DimensionValue, // ✅ Explicit cast to DimensionValue
          height: height as DimensionValue, // ✅ Explicit cast to DimensionValue
          borderRadius,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={["#E0E0E0", "#F5F5F5", "#E0E0E0"]}
        style={styles.skeleton}
      >
        <Animated.View
          style={[
            styles.shimmer,
            { transform: [{ translateX }] },
          ]}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  skeleton: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    position: "relative",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.3,
  },
});

export default SkeletonLoader;
