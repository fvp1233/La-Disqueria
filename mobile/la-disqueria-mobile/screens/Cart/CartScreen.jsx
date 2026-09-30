import { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BackBar from '../../components/BackBar';
import OrderSummary from '../../components/OrderSummary';
import AppButton from '../../components/AppButton';
import CartRow from './components/CartRow';
import FormBanner from '../../components/FormBanner';
import { useCart, cartIssue } from '../../context/CartContext';
import { colors, spacing } from '../../theme';

// Carrito de compras con edición de cantidades y acceso al pago.
export default function CartScreen({ navigation }) {
  const { items, subtotal, hasIssues, setQuantity, removeItem, refreshStock } = useCart();
  const [checking, setChecking] = useState(false);

  // Cada vez que se abre el carrito se confirma stock y precio con la API.
  useFocusEffect(
    useCallback(() => {
      setChecking(true);
      refreshStock().finally(() => setChecking(false));
    }, [refreshStock])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackBar title="Tu carrito" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyCircle}>
              <Feather name="shopping-cart" size={32} color={colors.muted} />
            </View>
            <Text style={styles.emptyTitle}>Tu bolsa está vacía</Text>
            <Text style={styles.emptyText}>Explora el catálogo y añade tu próximo disco.</Text>
            <AppButton
              label="Explorar catálogo"
              onPress={() => navigation.navigate('Main', { screen: 'Catalog' })}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <View>
            <FormBanner
              message={
                hasIssues
                  ? 'Algunos productos cambiaron de stock. Revisa las cantidades para continuar.'
                  : ''
              }
            />
            {items.map((item) => (
              <CartRow
                key={item.productId}
                item={item}
                issue={cartIssue(item)}
                onQuantityChange={(next) => setQuantity(item.productId, next)}
                onRemove={() => removeItem(item.productId)}
              />
            ))}

            <OrderSummary subtotal={subtotal} />

            <AppButton
              label="Tramitar pedido"
              variant="teal"
              onPress={() => navigation.navigate('Checkout')}
              disabled={hasIssues || checking}
              loading={checking}
              style={styles.checkoutButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 70,
  },
  emptyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.field,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: colors.ink,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 22,
    textAlign: 'center',
  },
  emptyButton: {
    alignSelf: 'stretch',
  },
  checkoutButton: {
    marginTop: spacing.lg,
  },
});
