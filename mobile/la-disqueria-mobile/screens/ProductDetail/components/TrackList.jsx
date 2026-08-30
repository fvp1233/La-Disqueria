import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../../theme';

const tracks = [
  { number: '1', name: 'Cara A · Apertura', length: '3:48' },
  { number: '2', name: 'Tema principal', length: '4:12' },
  { number: '3', name: 'Interludio', length: '2:05' },
  { number: '4', name: 'Cierre', length: '5:30' },
];

// Lista de canciones de muestra para vinilos y discos compactos.
export default function TrackList() {
  return (
    <View>
      <Text style={styles.heading}>Lista de canciones</Text>
      {tracks.map((track) => (
        <View key={track.number} style={styles.row}>
          <Text style={styles.number}>{track.number}</Text>
          <Text style={styles.name}>{track.name}</Text>
          <Text style={styles.length}>{track.length}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.ink,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  number: {
    width: 18,
    fontSize: 12,
    color: colors.muted,
  },
  name: {
    flex: 1,
    fontSize: 13,
    color: colors.ink,
  },
  length: {
    fontSize: 12,
    color: colors.muted,
  },
});
