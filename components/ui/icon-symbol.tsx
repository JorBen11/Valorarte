// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'doc.plaintext': 'assignment',
  'plus.circle.fill': 'assignment-add',
  'bag.fill': 'shopping-bag',
  'gear': 'settings',
  'cube.box': 'inventory-2',
  'chevron.left': 'chevron-left',
  'textformat.abc': 'sort-by-alpha',
  'number': 'looks-one',
  'calendar': 'calendar-today',
  'dollarsign.circle': 'attach-money',
  'dollarsign': 'attach-money',
  'arrow.up': 'arrow-upward',
  'arrow.down': 'arrow-downward',
  'nosign': 'not-interested',
  'chart.bar.fill': 'bar-chart',
} satisfies IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
type IconSymbolProps = {
  readonly name: IconSymbolName;
  readonly size?: number;
  readonly color: string | OpaqueColorValue;
  readonly style?: StyleProp<TextStyle>;
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
