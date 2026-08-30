import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import VinylLogo from '../../components/VinylLogo';
import TopoLines from '../../components/TopoLines';
import { colors, fonts } from '../../theme';

// Pantalla de apertura. Gira el disco y avanza al inicio de sesión.
export default function SplashScreen({ navigation }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotation.start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2200);

    return () => {
      rotation.stop();
      clearTimeout(timer);
    };
  }, [navigation, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Pressable style={styles.screen} onPress={() => navigation.replace('Login')}>
      <TopoLines placement="topLeft" tint={colors.primary} />
      <TopoLines placement="bottomRight" tint={colors.salmon} />

      <Animated.View style={{ transform: [{ rotate }] }}>
        <VinylLogo size={104} />
      </Animated.View>
      <Text style={styles.wordmark}>La disquería</Text>
      <Text style={styles.caption}>Vinilos · CDs · Tocadiscos</Text>
      <Text style={styles.footer}>La tienda de música · El Salvador</Text>
    </Pressable>
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
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 54,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
