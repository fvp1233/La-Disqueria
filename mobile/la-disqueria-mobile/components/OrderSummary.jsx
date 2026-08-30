import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';
import { formatPrice } from '../data/catalog';

// Resumen de importes compartido entre el carrito y la pantalla de pago.
export default function OrderSummary({ subtotal, itemCount }) {
  return (
    <View style={styles.card}>
      <View style={styles.line}>
        <Text style={styles.label}>
          Subtotal{itemCount != null ? ` (${itemCount} art.)` : ''}
        </Text>
        <Text style={styles.label}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={styles.line}>
        <Text style={styles.label}>Envío</Text>
        <Text style={styles.free}>Gratis</Text>
      </View>
      <View style={[styles.line, styles.totalLine]}>
        <Text style={styles.total}>Total</Text>
        <Text style={styles.total}>{formatPrice(subtotal)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  label: {
    fontSize: 13,
    color: colors.inkSoft,
  },
  free: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ok,
  },
  totalLine: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
    marginTop: 3,
    marginBottom: 0,
  },
  total: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
});
