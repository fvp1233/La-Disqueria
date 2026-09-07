import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing } from '../../../theme';

const tracks = [
  { number: '1', name: 'Cara A · Apertura', length: '3:48' },
  { number: '2', name: 'Tema principal', length: '4:12' },
  { number: '3', name: 'Interludio', length: '2:05' },
  { number: '4', name: 'Cierre', length: '5:30' },
];

// Lista de canciones de muestra para vinilos y discos compactos.
export default function TrackList() {
  return (
    <View style={styles.card}>
      <View style={styles.headingBlock}>
        <Text style={styles.heading}>Lista de canciones</Text>
        <View style={styles.rule} />
      </View>

      {tracks.map((track, index) => (
        <View
          key={track.number}
          // La última fila no lleva línea: el borde de la tarjeta ya cierra la lista
          style={[styles.row, index === tracks.length - 1 && styles.rowLast]}
        >
          <View style={styles.numberBadge}>
            <Text style={styles.number}>{track.number}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {track.name}
          </Text>
          <Text style={styles.length}>{track.length}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  headingBlock: {
    marginBottom: spacing.sm,
  },
  heading: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.ink,
  },
  // Barrita de acento bajo el título, como el sello de una contraportada
  rule: {
    width: 34,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    // Mantiene los números centrados aunque pase de 9 a 10
    fontVariant: ['tabular-nums'],
  },
  name: {
    flex: 1,
    fontSize: 13.5,
    color: colors.ink,
  },
  length: {
    fontSize: 12,
    color: colors.muted,
    // Alinea las duraciones en columna
    fontVariant: ['tabular-nums'],
  },
});