import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii } from '../theme';

// Control para aumentar o disminuir una cantidad entre un mínimo y un máximo.
// No permite valores negativos, cero ni superar el stock disponible.
export default function QuantityStepper({ value, onChange, size = 'md', min = 1, max }) {
  const dimension = size === 'sm' ? 30 : 44;
  const iconSize = size === 'sm' ? 13 : 15;

  const canDecrease = value > min;
  const canIncrease = max == null || value < max;

  const decrease = () => {
    if (canDecrease) onChange(Math.max(min, value - 1));
  };
  const increase = () => {
    if (canIncrease) onChange(max == null ? value + 1 : Math.min(max, value + 1));
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={decrease}
        disabled={!canDecrease}
        accessibilityLabel="Disminuir cantidad"
        style={[styles.button, { width: dimension, height: dimension }, !canDecrease && styles.off]}
      >
        <Feather name="minus" size={iconSize} color={colors.ink} />
      </Pressable>
      <Text style={[styles.value, size === 'sm' && styles.valueSmall]}>{value}</Text>
      <Pressable
        onPress={increase}
        disabled={!canIncrease}
        accessibilityLabel="Aumentar cantidad"
        style={[styles.button, { width: dimension, height: dimension }, !canIncrease && styles.off]}
      >
        <Feather name="plus" size={iconSize} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  off: {
    opacity: 0.3,
  },
  value: {
    minWidth: 30,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
    color: colors.ink,
  },
  valueSmall: {
    minWidth: 24,
    fontSize: 12.5,
  },
});
