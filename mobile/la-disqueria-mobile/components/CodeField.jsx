import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '../theme';

// Campo para ingresar el código de verificación de seis caracteres.
export default function CodeField({ label = 'Código', value, onChangeText }) {
  return (
    <View style={styles.group}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="••••••"
        placeholderTextColor="#b3a99c"
        maxLength={6}
        autoCapitalize="characters"
        textAlign="center"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 7,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  input: {
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.field,
    fontFamily: fonts.body,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 10,
    color: colors.ink,
  },
});
