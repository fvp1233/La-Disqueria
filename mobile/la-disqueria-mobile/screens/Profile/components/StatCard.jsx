import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../../../theme';

// Tarjeta breve con un valor numérico y su etiqueta.
export default function StatCard({ value, label }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  value: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 22,
    color: colors.ink,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
