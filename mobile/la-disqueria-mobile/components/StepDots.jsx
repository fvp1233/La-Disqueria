import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Indicador de progreso para el flujo de recuperación de contraseña.
export default function StepDots({ total = 3, current = 1 }) {
  return (
    <View style={styles.wrap}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index < current && styles.dotActive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});
