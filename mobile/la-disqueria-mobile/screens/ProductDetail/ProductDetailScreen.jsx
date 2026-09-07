import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';
import IconButton from '../../components/IconButton';
import Pill from '../../components/Pill';
import QuantityStepper from '../../components/QuantityStepper';
import AppButton from '../../components/AppButton';
import TrackList from './components/TrackList';
import useProductById from '../../hooks/products/useProductById';
import { useCart } from '../../context/CartContext';
import { colors, fonts, radii, shadow, spacing } from '../../theme';

const formatPrice = (amount) => `$${amount.toFixed(2)}`;

// Ficha de un producto con opciones de cantidad y acción de compra.
export default function ProductDetailScreen({ navigation, route }) {
  const { product, loading } = useProductById(route.params?.productId);
  const { rows: cartRows, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const cartCount = cartRows.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <BackBar title="Cargando..." onBack={() => navigation.goBack()} />
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <BackBar title="Error" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.errorText}>Producto no encontrado</Text>
          <AppButton label="Volver" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigation.navigate('Cart');
  };

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
          <View style={[styles.cover, { backgroundColor: product.color || product.colors?.[1] || '#999' }, !product.isDisc && styles.coverFlat]}>
            <Text style={styles.coverText} numberOfLines={3}>
              {product.title}
            </Text>
          </View>
        </View>

        <Text style={styles.sub}>{product.artist || product.sub || 'Artista'}</Text>
        <Text style={styles.title}>{product.title || 'Sin título'}</Text>

        <View style={styles.pills}>
          {product.genre && <Pill label={product.genre} tone="neutral" />}
          <Pill label={product.stock > 0 ? "Disponible" : "Agotado"} tone={product.stock > 0 ? "success" : "danger"} icon={product.stock > 0 ? "check" : "x"} />
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
              {product.description || 'Descripción, materiales y especificaciones del producto pendientes de la tienda pública.'}
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
          onPress={handleAddToCart}
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
  loader: {
    marginTop: 60,
  },
  errorText: {
    fontSize: 16,
    color: colors.ink,
    textAlign: 'center',
    marginVertical: spacing.xl,
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
