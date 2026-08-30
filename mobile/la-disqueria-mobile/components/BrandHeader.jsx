import { View, Text, StyleSheet } from 'react-native';
import VinylLogo from './VinylLogo';
import { colors, fonts, spacing } from '../theme';

// Encabezado de marca con el disco, el nombre y una acción opcional.
export default function BrandHeader({ caption }) {
  return (
    <View style={styles.wrap}>
      <VinylLogo size={72} />
      <Text style={styles.wordmark}>La disquería</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 34,
    color: colors.primary,
    letterSpacing: 0.4,
  },
  caption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
