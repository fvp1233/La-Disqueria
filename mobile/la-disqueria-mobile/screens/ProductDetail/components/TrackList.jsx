import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../../theme';

// Lista de canciones del disco. Acepta el formato de vinilos y el de CDs.
export default function TrackList({ tracks = [] }) {
  if (tracks.length === 0) {
    return (
      <View>
        <Text style={styles.heading}>Lista de canciones</Text>
        <Text style={styles.empty}>Este disco todavía no tiene canciones cargadas.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.heading}>Lista de canciones</Text>
      {tracks.map((track, index) => (
        <View key={track._id || index} style={styles.row}>
          <Text style={styles.number}>{track.position || index + 1}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {track.song_name || track.title || 'Pista sin título'}
          </Text>
          {track.duration ? <Text style={styles.duration}>{track.duration}</Text> : null}
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
  empty: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
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
    width: 22,
    fontSize: 12,
    color: colors.muted,
  },
  name: {
    flex: 1,
    fontSize: 13,
    color: colors.ink,
  },
  duration: {
    fontSize: 12,
    color: colors.muted,
  },
});
