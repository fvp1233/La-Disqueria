import { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';
import IconButton from '../../components/IconButton';
import Pill from '../../components/Pill';
import QuantityStepper from '../../components/QuantityStepper';
import AppButton from '../../components/AppButton';
import StateView from '../../components/StateView';
import StarRating from '../../components/StarRating';
import FormBanner from '../../components/FormBanner';
import TrackList from './components/TrackList';
import Reviews from './components/Reviews';
import { useCart, maxQuantityFor } from '../../context/CartContext';
import { getProductById } from '../../api/catalog';
import { formatPrice, isInStock, stockLabel } from '../../utils/format';
import { colors, fonts, shadow, spacing } from '../../theme';

// Ficha de un producto con opciones de cantidad y acción de compra.
export default function ProductDetailScreen({ navigation, route }) {
  const productId = route.params?.productId;
  const { addItem, count, quantityOf } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProduct(await getProductById(productId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const inCart = product ? quantityOf(product.id) : 0;
  const inStock = isInStock(product);
  // Unidades que todavía se pueden sumar sin superar el stock.
  const remaining = product ? Math.max(0, maxQuantityFor(product.stock) - inCart) : 0;
  const canAdd = inStock && remaining > 0;

  // La cantidad elegida nunca supera lo que queda disponible.
  useEffect(() => {
    if (remaining > 0 && quantity > remaining) setQuantity(remaining);
  }, [remaining, quantity]);

  const updateSummary = useCallback(
    ({ average, count: total }) =>
      setProduct((current) =>
        current ? { ...current, ratingAverage: average, ratingCount: total } : current
      ),
    []
  );

  const handleAdd = () => {
    setNotice('');
    if (!canAdd) {
      setNotice(inStock ? 'Ya tienes en el carrito todo el stock disponible' : 'Producto agotado');
      return;
    }
    const addedUnits = addItem(product, quantity);
    if (addedUnits === 0) {
      setNotice('No quedan unidades disponibles para agregar');
      return;
    }
    if (addedUnits < quantity) {
      setNotice(`Solo se agregaron ${addedUnits} unidades por el stock disponible`);
    }
    setQuantity(1);
    setAdded(true);
  };

  const ratingText = product?.ratingCount
    ? `${product.ratingAverage.toFixed(1)} · ${product.ratingCount} ${
        product.ratingCount === 1 ? 'valoración' : 'valoraciones'
      }`
    : 'Sin valoraciones';

  if (loading || error || !product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <BackBar title="Producto" onBack={() => navigation.goBack()} />
        <StateView loading={loading} error={error} onRetry={load} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackBar
        title={product.genre || 'Producto'}
        onBack={() => navigation.goBack()}
        rightSlot={
          <IconButton
            name="shopping-cart"
            onPress={() => navigation.navigate('Cart')}
            badge={count ? String(count) : undefined}
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
          <Image
            source={{ uri: product.cover }}
            style={[styles.cover, !product.isDisc && styles.coverFlat]}
            resizeMode="cover"
          />
        </View>

        {product.subtitle ? <Text style={styles.subtitle}>{product.subtitle}</Text> : null}
        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.ratingRow}>
          <StarRating value={product.ratingAverage} size={14} />
          <Text style={styles.ratingText}>{ratingText}</Text>
        </View>

        <View style={styles.pills}>
          {product.genre ? <Pill label={product.genre} tone="neutral" /> : null}
          <Pill
            label={stockLabel(product)}
            tone={inStock ? 'success' : 'neutral'}
            icon={inStock ? 'check' : 'x'}
          />
        </View>

        <FormBanner message={notice} />

        {canAdd ? (
          <View style={styles.quantityRow}>
            <View>
              <Text style={styles.quantityLabel}>Cantidad</Text>
              {inCart ? (
                <Text style={styles.quantityHint}>Ya tienes {inCart} en el carrito</Text>
              ) : null}
            </View>
            <QuantityStepper value={quantity} onChange={setQuantity} max={remaining} />
          </View>
        ) : (
          <Text style={styles.soldOut}>
            {inStock
              ? 'Ya tienes en el carrito todas las unidades disponibles.'
              : 'Este producto está agotado por ahora.'}
          </Text>
        )}

        {product.isDisc ? (
          <TrackList tracks={product.trackList} />
        ) : (
          <View>
            <Text style={styles.sectionHeading}>Descripción</Text>
            <Text style={styles.description}>
              {product.description || 'Este producto todavía no tiene una descripción cargada.'}
            </Text>
          </View>
        )}

        <Reviews productId={product.id} onSummaryChange={updateSummary} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.priceCaption}>Precio unitario</Text>
        </View>
        {added ? (
          <AppButton
            label="Ver carrito"
            variant="teal"
            onPress={() => navigation.navigate('Cart')}
            style={styles.addButton}
          />
        ) : (
          <AppButton
            label={inStock ? 'Añadir al carrito' : 'Agotado'}
            onPress={handleAdd}
            disabled={!canAdd}
            style={styles.addButton}
          />
        )}
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
    borderRadius: 14,
    backgroundColor: colors.field,
    zIndex: 2,
    ...shadow.card,
  },
  coverFlat: {
    position: 'relative',
    left: 0,
    top: 0,
    width: '72%',
    height: '100%',
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
  subtitle: {
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
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.lg,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -4,
    marginBottom: spacing.md,
  },
  ratingText: {
    fontSize: 12,
    color: colors.muted,
  },
  quantityHint: {
    fontSize: 11.5,
    color: colors.muted,
    marginTop: 2,
  },
  soldOut: {
    fontSize: 13,
    color: colors.inkSoft,
    marginVertical: spacing.lg,
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
