import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, shadow } from '../theme';
import { formatPrice } from '../data/catalog';

// Tarjeta de producto usada tanto en el inicio como en el catálogo.
export default function ProductCard({ product, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <View style={[styles.sleeve, !product.isDisc && styles.sleeveFlat]}>
        {product.isDisc ? (
          <View style={styles.vinyl}>
            <View style={styles.vinylLabel} />
          </View>
        ) : null}
        <View style={[styles.cover, { backgroundColor: product.colors[1] }]}>
          <Text style={styles.coverText} numberOfLines={2}>
            {product.title}
          </Text>
        </View>
      </View>
      <Text style={styles.sub} numberOfLines={1}>
        {product.sub}
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
    width: 140,
  },
  sleeve: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 34,
  },
  sleeveFlat: {
    marginBottom: 14,
  },
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.md,
    padding: 10,
    justifyContent: 'flex-end',
    zIndex: 2,
    ...shadow.card,
  },
  coverText: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 14,
    color: 'rgba(255,255,255,0.92)',
    textTransform: 'uppercase',
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
  sub: {
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
