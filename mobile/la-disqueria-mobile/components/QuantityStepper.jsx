import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii } from '../theme';

// Control para aumentar o disminuir una cantidad con un mínimo de uno.
export default function QuantityStepper({ value, onChange, size = 'md' }) {
  const dimension = size === 'sm' ? 30 : 44;

  const decrease = () => onChange(Math.max(1, value - 1));
  const increase = () => onChange(value + 1);

  return (
    <View style={styles.wrap}>
      <Pressable onPress={decrease} style={[styles.button, { width: dimension, height: dimension }]}>
        <Feather name="minus" size={size === 'sm' ? 13 : 15} color={colors.ink} />
      </Pressable>
      <Text style={[styles.value, size === 'sm' && styles.valueSmall]}>{value}</Text>
      <Pressable onPress={increase} style={[styles.button, { width: dimension, height: dimension }]}>
        <Feather name="plus" size={size === 'sm' ? 13 : 15} color={colors.ink} />
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
