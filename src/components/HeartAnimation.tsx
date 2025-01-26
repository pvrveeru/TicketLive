import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface HeartAnimationProps {
  isLiked: boolean;
  onAnimationComplete?: () => void;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({ isLiked, onAnimationComplete }) => {
  const animationRef = useRef<LottieView>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (animationRef.current) {
      if (isFirstRun.current) {
        if (isLiked) {
          animationRef.current.play(66, 66);
        } else {
          animationRef.current.play(19, 19);
        }
        isFirstRun.current = false;
      } else if (isLiked) {
        animationRef.current.play(19, 50);
      } else {
        animationRef.current.play(0, 19);
      }
    }
  }, [isLiked]);

  const handleHeartClick = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }

    if (onAnimationComplete) {
      setTimeout(onAnimationComplete, 1500);
    }
  };

  return (
    <TouchableOpacity onPress={handleHeartClick}>
      <LottieView
        ref={animationRef}
        source={require('../../assests/lottie/like.json')}
        autoPlay={false}
        loop={false}
        style={styles.lottieStyle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  lottieStyle: {
    width: 150,
    height: 150,
  },
});

export default HeartAnimation;
