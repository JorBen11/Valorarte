import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SpinnerProps {
  color: string;
  size?: number;
}

/** Indicador de actividad propio: arco de marca que gira (estático si el sistema reduce el movimiento). */
export function Spinner({ color, size = 22 }: SpinnerProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(rotation);
  }, [rotation]);

  const animated = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const stroke = Math.max(2, Math.round(size / 9));

  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}>
      <View style={[styles.ring, { borderRadius: size / 2, borderWidth: stroke, borderColor: color, opacity: 0.25 }]} />
      <Animated.View
        style={[
          styles.ring,
          { borderRadius: size / 2, borderWidth: stroke, borderColor: 'transparent', borderTopColor: color },
          animated,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
});
