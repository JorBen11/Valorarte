import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme/theme-provider';
import { minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

interface SwitchRowProps {
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const TRACK_W = 52;
const TRACK_H = 32;
const THUMB = 24;
const TRAVEL = TRACK_W - THUMB - (TRACK_H - THUMB);

/** Interruptor propio: toda la fila es el área táctil. */
export function SwitchRow({ label, hint, value, onValueChange }: SwitchRowProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 180 });
  }, [progress, value]);

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surface, colors.primary]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.fieldBorder, colors.primary]),
  }));
  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRAVEL }],
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.fieldBorder, colors.onPrimary]),
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={styles.row}>
      <View style={styles.text}>
        <Text style={[typography.body, { color: colors.textPrimary }]}>{label}</Text>
        {hint ? <Text style={[typography.caption, { color: colors.textSecondary }]}>{hint}</Text> : null}
      </View>
      <Animated.View style={[styles.track, track]}>
        <Animated.View style={[styles.thumb, thumb]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: minTouchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  text: { flex: 1, gap: spacing.xs },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: radius.pill,
    borderWidth: 2,
    paddingHorizontal: (TRACK_H - THUMB) / 2 - 2,
    justifyContent: 'center',
  },
  thumb: { width: THUMB, height: THUMB, borderRadius: THUMB / 2 },
});
