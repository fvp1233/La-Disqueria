import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii } from '../theme';

// Mensaje de estado para formularios, en tono de error o de éxito.
export default function FormBanner({ message, tone = 'error' }) {
  if (!message) return null;

  const palette = tone === 'success' ? successPalette : errorPalette;

  return (
    <View style={[styles.banner, { backgroundColor: palette.background }]}>
      <Feather
        name={tone === 'success' ? 'check-circle' : 'alert-circle'}
        size={15}
        color={palette.text}
      />
      <Text style={[styles.text, { color: palette.text }]}>{message}</Text>
    </View>
  );
}

const errorPalette = { background: 'rgba(232,96,42,0.12)', text: colors.primaryPress };
const successPalette = { background: 'rgba(63,155,91,0.14)', text: colors.ok };

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: radii.md,
  },
  text: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
  },
});
