import { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import VinylLogo from '../../components/VinylLogo';
import TopoLines from '../../components/TopoLines';
import { colors, fonts } from '../../theme';

// Pantalla de carga que se muestra mientras la aplicación restaura la sesión.
export default function LoadingScreen() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.screen}>
      <TopoLines placement="topLeft" tint={colors.primary} />
      <TopoLines placement="bottomRight" tint={colors.salmon} />

      <Animated.View style={{ transform: [{ rotate }] }}>
        <VinylLogo size={104} />
      </Animated.View>
      <Text style={styles.wordmark}>La disquería</Text>
      <Text style={styles.caption}>Cargando tu tienda de música</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 40,
    color: colors.primary,
    letterSpacing: 0.4,
    marginTop: 26,
  },
  caption: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 10,
  },
});
