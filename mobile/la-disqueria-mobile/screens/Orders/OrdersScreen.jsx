import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BackBar from '../../components/BackBar';
import StateView from '../../components/StateView';
import { getOrderHistory } from '../../api/orders';
import { formatPrice } from '../../utils/format';
import { colors, fonts, radii, spacing } from '../../theme';

const monthLabels = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  return `${day} ${monthLabels[date.getMonth()]} ${date.getFullYear()}`;
};

// Historial de compras del cliente autenticado.
export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrderHistory();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackBar title="Mis pedidos" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading || error || orders.length === 0 ? (
          <StateView
            loading={loading}
            error={error}
            empty={!loading && !error && orders.length === 0}
            emptyText="Todavía no has realizado ninguna compra"
            onRetry={load}
          />
        ) : (
          orders.map((order) => {
            const units = (order.items || []).reduce(
              (total, item) => total + (item.quantity || 0),
              0
            );
            return (
              <View key={order._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconWrap}>
                    <Feather name="package" size={16} color={colors.primary} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.orderNumber}>{order.order_number || 'Pedido'}</Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.purchased_at || order.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
                </View>
                <Text style={styles.orderMeta}>
                  {units} {units === 1 ? 'artículo' : 'artículos'} · {order.payment_method || 'Pago'}
                </Text>
              </View>
            );
          })
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
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(232,96,42,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  orderDate: {
    fontSize: 12,
    color: colors.muted,
  },
  orderTotal: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 18,
    color: colors.ink,
  },
  orderMeta: {
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 10,
  },
});
