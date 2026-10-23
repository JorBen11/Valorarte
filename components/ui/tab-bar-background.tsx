import { container } from "@/assets/styles/globalStyle";
import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/hooks/use-theme-mode";
import { useNavigationState } from "expo-router/react-navigation";
import { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

const TabBarBackground = () => {
  const { tabIndex, tabCount } = useNavigationState((state) => ({
    tabIndex: state.index, 
    tabCount: state.routes.length
  }));
  
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const { theme } = useThemeMode();
  
  // Valores animados
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Configuración responsiva
  const tabWidth = dimensions.width / tabCount;
  const indicatorWidth = tabWidth * 0.8; // 80% del ancho del tab
  const indicatorOffset = (tabWidth - indicatorWidth) / 2; // Para centrarlo
  
  // Escuchar cambios en las dimensiones
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);
  
  // Animar cuando cambia el tab
  useEffect(() => {
    const targetTranslateX = (tabIndex * tabWidth) + indicatorOffset;
    
    // Animación con spring para una sensación más natural
    translateX.value = withSpring(targetTranslateX, {
      damping: 20,
      stiffness: 150,
      mass: 1,
    });
    
    // Pequeña animación de escala para feedback visual
    scale.value = withTiming(1.05, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 200 });
    });
    
  }, [tabIndex, tabWidth, indicatorOffset, translateX, scale]);
  
  // Estilo animado del indicador
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });
  
  // Color del indicador con opacidad
  const backgroundColor = Colors[theme].tabIconSelected + '25';
  
  // Altura dinámica basada en el dispositivo y safe area
  const getIndicatorHeight = () => {
    const baseHeight = 50;
    const platformAdjustment = Platform.OS === 'ios' ? 5 : 0;
    return Math.min(baseHeight + platformAdjustment, 55);
  };
  
  const indicatorHeight = getIndicatorHeight();
  
  return (
    <View style={[container, styles.backgroundContainer]}>
      <Animated.View 
        style={[
          styles.indicator, 
          {
            width: indicatorWidth,
            height: indicatorHeight,
            backgroundColor,
            // Ajuste vertical para centrar mejor
            top: (60 - indicatorHeight) / 2,
          }, 
          animatedIndicatorStyle
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    overflow: 'hidden', // Evita que el indicador se salga del contenedor
  },
  indicator: {
    borderRadius: 12,
    // Sombra sutil para mejor definición
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
});

export default TabBarBackground;

