import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, shadow } from '../theme';
import { formatPrice, isInStock } from '../utils/format';
import StarRating from './StarRating';

// Tarjeta de producto usada en el inicio y en el catálogo.
export default function ProductCard({ product, onPress, style }) {
  const soldOut = !isInStock(product);

  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <View style={[styles.sleeve, !product.isDisc && styles.sleeveFlat]}>
        {product.isDisc ? (
          <View style={styles.vinyl}>
            <View style={styles.vinylLabel} />
          </View>
        ) : null}
        <Image source={{ uri: product.cover }} style={styles.cover} resizeMode="cover" />
        {!soldOut ? null : (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>Agotado</Text>
          </View>
        )}
      </View>
      <Text style={styles.subtitle} numberOfLines={1}>
        {product.subtitle || product.genre}
      </Text>
      <Text style={styles.title} numberOfLines={1}>
        {product.title}
      </Text>
      {product.ratingCount ? (
        <View style={styles.rating}>
          <StarRating value={product.ratingAverage} size={10} />
          <Text style={styles.ratingText}>({product.ratingCount})</Text>
        </View>
      ) : null}
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
  },
  sleeve: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 34,
  },
  sleeveFlat: {
    marginBottom: 12,
  },
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.md,
    backgroundColor: colors.field,
    zIndex: 2,
    ...shadow.card,
  },
  vinyl: {
    position: 'absolute',
    right: -26,
    top: '8%',
    width: '84%',
    height: '84%',
    borderRadius: 999,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  vinylLabel: {
    width: '28%',
    height: '28%',
    borderRadius: 999,
    backgroundColor: colors.salmon,
  },
  subtitle: {
    fontSize: 12,
    color: colors.inkSoft,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.ink,
  },
  soldOut: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 3,
    backgroundColor: 'rgba(28,25,23,0.82)',
    borderRadius: radii.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  soldOutText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 10.5,
    color: colors.muted,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 3,
  },
});
