import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Pill, Activity, Bell } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

interface AnimationProps {
  name: 'medication' | 'activity' | 'reminder';
  size?: number;
}

export const Animation = ({ name, size = 80 }: AnimationProps) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity1 = useSharedValue(0.7);
  const opacity2 = useSharedValue(0.5);
  const opacity3 = useSharedValue(0.3);
  
  // Setup animations
  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1, // Infinite repeat
      false
    );
    
    scale.value = withRepeat(
      withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true // Reverse
    );
    
    // Pulse animation for rings
    opacity1.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      true
    );
    
    opacity2.value = withRepeat(
      withDelay(
        300,
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) })
      ),
      -1,
      true
    );
    
    opacity3.value = withRepeat(
      withDelay(
        600,
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);
  
  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });
  
  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const ringStyle1 = useAnimatedStyle(() => {
    return {
      opacity: opacity1.value,
    };
  });
  
  const ringStyle2 = useAnimatedStyle(() => {
    return {
      opacity: opacity2.value,
    };
  });
  
  const ringStyle3 = useAnimatedStyle(() => {
    return {
      opacity: opacity3.value,
    };
  });
  
  const renderIcon = () => {
    const iconSize = size * 0.6;
    const iconColor = 'white';
    
    switch (name) {
      case 'medication':
        return <Pill size={iconSize} color={iconColor} />;
      case 'activity':
        return <Activity size={iconSize} color={iconColor} />;
      case 'reminder':
        return <Bell size={iconSize} color={iconColor} />;
      default:
        return <Pill size={iconSize} color={iconColor} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.ring, 
          { width: size * 1.8, height: size * 1.8, borderRadius: size * 0.9 },
          ringStyle3
        ]} 
      />
      <Animated.View 
        style={[
          styles.ring, 
          { width: size * 1.5, height: size * 1.5, borderRadius: size * 0.75 },
          ringStyle2
        ]} 
      />
      <Animated.View 
        style={[
          styles.ring, 
          { width: size * 1.2, height: size * 1.2, borderRadius: size * 0.6 },
          ringStyle1
        ]} 
      />
      <Animated.View 
        style={[
          styles.iconContainer, 
          { width: size, height: size, borderRadius: size / 2 },
          scaleStyle
        ]}
      >
        <Animated.View style={rotationStyle}>
          {renderIcon()}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
});