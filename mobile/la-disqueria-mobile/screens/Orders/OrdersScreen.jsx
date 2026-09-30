import { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BackBar from '../../components/BackBar';
import StateView from '../../components/StateView';
import Pill from '../../components/Pill';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { getOrderHistory, cancelOrder } from '../../api/orders';
import { formatPrice, FALLBACK_COVER } from '../../utils/format';
import { colors, fonts, radii, spacing } from '../../theme';

const isCancelled = (order) => /^cancelad/i.test(order.order_status || '');
const isPending = (order) => /^pendiente$/i.test(order.order_status || '');

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
  const [expanded, setExpanded] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [notice, setNotice] = useState({ message: '', tone: 'error' });

  const handleCancel = async (orderId) => {
    setCancelling(orderId);
    setNotice({ message: '', tone: 'error' });
    try {
      await cancelOrder(orderId);
      setConfirming(null);
      setNotice({ message: 'Pedido cancelado', tone: 'success' });
      await load();
    } catch (err) {
      setNotice({ message: err.message, tone: 'error' });
    } finally {
      setCancelling(null);
    }
  };

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
        <FormBanner message={notice.message} tone={notice.tone} />
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
            const isOpen = expanded === order._id;
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
                <View style={styles.metaRow}>
                  <Text style={styles.orderMeta}>
                    {units} {units === 1 ? 'artículo' : 'artículos'} ·{' '}
                    {order.payment_method || 'Pago'}
                  </Text>
                  <Pill
                    label={order.order_status || 'Pendiente'}
                    tone={isCancelled(order) ? 'neutral' : 'success'}
                  />
                </View>

                {isOpen ? (
                  <View style={styles.detail}>
                    {(order.items || []).map((item, index) => (
                      <View key={item._id || index} style={styles.itemRow}>
                        <Image
                          source={{ uri: item.image || FALLBACK_COVER }}
                          style={styles.itemThumb}
                        />
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.itemMeta}>
                            {item.quantity} × {formatPrice(item.price)}
                          </Text>
                        </View>
                        <Text style={styles.itemTotal}>
                          {formatPrice((item.price || 0) * (item.quantity || 0))}
                        </Text>
                      </View>
                    ))}
                    {order.shipping_address?.street ? (
                      <Text style={styles.detailText}>
                        Envío a {order.shipping_address.street}, {order.shipping_address.city}
                      </Text>
                    ) : null}
                    {order.notes ? (
                      <Text style={styles.detailText}>Notas: {order.notes}</Text>
                    ) : null}
                    {isPending(order) ? (
                      confirming === order._id ? (
                        <View style={styles.confirmBox}>
                          <Text style={styles.detailText}>
                            ¿Cancelar este pedido? Los productos vuelven a estar disponibles.
                          </Text>
                          <View style={styles.confirmActions}>
                            <AppButton
                              label="No"
                              variant="ghost"
                              onPress={() => setConfirming(null)}
                              style={styles.confirmButton}
                            />
                            <AppButton
                              label="Sí, cancelar"
                              onPress={() => handleCancel(order._id)}
                              loading={cancelling === order._id}
                              style={styles.confirmButton}
                            />
                          </View>
                        </View>
                      ) : (
                        <AppButton
                          label="Cancelar pedido"
                          variant="ghost"
                          onPress={() => setConfirming(order._id)}
                          style={styles.confirmButton}
                        />
                      )
                    ) : null}
                  </View>
                ) : null}

                <Pressable
                  onPress={() => setExpanded(isOpen ? null : order._id)}
                  style={styles.toggle}
                  hitSlop={6}
                >
                  <Text style={styles.toggleText}>{isOpen ? 'Ocultar detalle' : 'Ver detalle'}</Text>
                  <Feather
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={colors.primary}
                  />
                </Pressable>
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: 10,
  },
  orderMeta: {
    flex: 1,
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  confirmBox: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  confirmButton: {
    flex: 1,
    height: 44,
    marginTop: spacing.xs,
  },
  detail: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemThumb: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.field,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.muted,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  detailText: {
    fontSize: 12,
    color: colors.inkSoft,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
