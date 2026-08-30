import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing } from '../../../theme';

// Tarjeta destacada que anuncia los nuevos ingresos.
export default function HeroCard({ onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.discBackdrop} />
      <Text style={styles.title}>Nuevos ingresos de octubre</Text>
      <Text style={styles.subtitle}>
        Ediciones limitadas recién llegadas · Envío gratis desde $25
      </Text>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>Ver novedades</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.xl,
    backgroundColor: colors.teal,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
  },
  discBackdrop: {
    position: 'absolute',
    right: -40,
    top: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#111111',
    opacity: 0.35,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 25,
    textTransform: 'uppercase',
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    marginBottom: 14,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radii.pill,
  },
  ctaText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
