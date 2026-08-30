import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '../theme';

// Botón principal de la aplicación con variantes primary, teal y ghost.
export default function AppButton({ label, onPress, variant = 'primary', style, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 53,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ translateY: 1 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.body,
    fontWeight: '700',
    fontSize: 12.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  teal: {
    backgroundColor: colors.teal,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.6,
    borderColor: colors.primary,
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: colors.white,
  },
  teal: {
    color: colors.white,
  },
  ghost: {
    color: colors.primary,
  },
});
