import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, shadow } from '../theme';
import { formatPrice } from '../utils/format';

// Tarjeta de producto usada en el inicio y en el catálogo.
export default function ProductCard({ product, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <View style={[styles.sleeve, !product.isDisc && styles.sleeveFlat]}>
        {product.isDisc ? (
          <View style={styles.vinyl}>
            <View style={styles.vinylLabel} />
          </View>
        ) : null}
        <Image source={{ uri: product.cover }} style={styles.cover} resizeMode="cover" />
      </View>
      <Text style={styles.subtitle} numberOfLines={1}>
        {product.subtitle || product.genre}
      </Text>
      <Text style={styles.title} numberOfLines={1}>
        {product.title}
      </Text>
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
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 3,
  },
});
