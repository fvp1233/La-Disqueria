import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';
import IconButton from '../../components/IconButton';
import Pill from '../../components/Pill';
import QuantityStepper from '../../components/QuantityStepper';
import AppButton from '../../components/AppButton';
import TrackList from './components/TrackList';
import { findProductById, formatPrice, sampleCartItems } from '../../data/catalog';
import { colors, fonts, radii, shadow, spacing } from '../../theme';

const cartCount = sampleCartItems.reduce((total, item) => total + item.quantity, 0);

// Ficha de un producto con opciones de cantidad y acción de compra.
export default function ProductDetailScreen({ navigation, route }) {
  const product = findProductById(route.params?.productId);
  const [quantity, setQuantity] = useState(1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackBar
        title={product.type}
        onBack={() => navigation.goBack()}
        rightSlot={
          <IconButton
            name="shopping-cart"
            onPress={() => navigation.navigate('Cart')}
            badge={cartCount ? String(cartCount) : undefined}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, !product.isDisc && styles.heroFlat]}>
          {product.isDisc ? (
            <View style={styles.vinyl}>
              <View style={styles.vinylLabel} />
            </View>
          ) : null}
          <View style={[styles.cover, { backgroundColor: product.colors[1] }, !product.isDisc && styles.coverFlat]}>
            <Text style={styles.coverText} numberOfLines={3}>
              {product.title}
            </Text>
          </View>
        </View>

        <Text style={styles.sub}>{product.sub}</Text>
        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.pills}>
          <Pill label={product.genre} tone="neutral" />
          <Pill label="Disponible" tone="success" icon="check" />
        </View>

        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>Cantidad</Text>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </View>

        {product.isDisc ? (
          <TrackList />
        ) : (
          <View>
            <Text style={styles.sectionHeading}>Descripción</Text>
            <Text style={styles.description}>
              Descripción, materiales y especificaciones del producto pendientes de la tienda pública.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.priceCaption}>Precio unitario</Text>
        </View>
        <AppButton
          label="Añadir al carrito"
          onPress={() => navigation.navigate('Cart')}
          style={styles.addButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: 120,
  },
  hero: {
    height: 260,
    marginBottom: spacing.xl,
  },
  heroFlat: {
    alignItems: 'center',
  },
  cover: {
    position: 'absolute',
    left: 0,
    top: '8%',
    width: '70%',
    height: '84%',
    borderRadius: radii.md,
    padding: 14,
    justifyContent: 'flex-end',
    zIndex: 2,
    ...shadow.card,
  },
  coverFlat: {
    position: 'relative',
    left: 0,
    top: 0,
    width: '72%',
  },
  coverText: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 21,
    textTransform: 'uppercase',
    color: colors.white,
  },
  vinyl: {
    position: 'absolute',
    right: 6,
    top: '12%',
    width: '66%',
    height: '76%',
    borderRadius: 999,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    ...shadow.card,
  },
  vinylLabel: {
    width: '32%',
    height: '32%',
    borderRadius: 999,
    backgroundColor: colors.salmon,
  },
  sub: {
    fontSize: 13,
    color: colors.inkSoft,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 24,
    textTransform: 'uppercase',
    color: colors.ink,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.xl,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quantityLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  sectionHeading: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.ink,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 21,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: spacing.xl,
    paddingTop: 14,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  price: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 26,
    color: colors.ink,
  },
  priceCaption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  addButton: {
    flex: 1,
  },
});
