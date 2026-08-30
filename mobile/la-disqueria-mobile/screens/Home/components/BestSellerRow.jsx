import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, shadow } from '../../../theme';
import { formatPrice } from '../../../data/catalog';

// Fila compacta de un producto dentro de la lista de más vendidos.
export default function BestSellerRow({ product, onPress }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.thumb, { backgroundColor: product.colors[1] }]} />
      <View style={styles.info}>
        <Text style={styles.sub}>{product.sub}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
      </View>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    ...shadow.soft,
  },
  info: {
    flex: 1,
  },
  sub: {
    fontSize: 12,
    color: colors.muted,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
});
