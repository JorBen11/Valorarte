import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

export const lightTheme: ThemeProp = {
  ...MD3LightTheme,
  roundness: 10,
  colors: {
    ...MD3LightTheme.colors,
    background: '#F9FAFB',
    surface: '#FFFFFF',
    primary: '#4F46E5',
    primaryContainer: '#EEF2FF',
    onPrimary: '#FFFFFF',
    onSurface: '#111827',
    outline: '#E5E7EB',
    secondary: '#6B7280',
  },
};

export const darkTheme: ThemeProp = {
  ...MD3DarkTheme,
  mode: 'adaptive',
  roundness: 10,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#121D2A',
    surface: '#1E2A38',
    primary: '#818CF8',
    primaryContainer: '#312E81',
    onPrimary: '#FFFFFF',
    onSurface: '#F9FAFB',
    outline: '#334155',
    secondary: '#CBD5E1',
  },
};
