import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors, radii, shadow } from '../../../theme';
import { formatPrice } from '../../../utils/format';

// Fila compacta de un producto dentro de la lista de más vendidos.
export default function BestSellerRow({ product, onPress }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Image source={{ uri: product.cover }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.subtitle} numberOfLines={1}>
          {product.subtitle || product.genre}
        </Text>
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
    backgroundColor: colors.field,
    ...shadow.soft,
  },
  info: {
    flex: 1,
  },
  subtitle: {
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
