import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import OrderSummary from '../../components/OrderSummary';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkout } from '../../api/orders';
import { addressError, cityError } from '../../utils/validators';
import { colors, fonts, radii, spacing } from '../../theme';

const paymentMethods = ['Tarjeta de crédito o débito', 'Efectivo contra entrega'];

const notesMax = 250;

// Datos de envío y registro del pedido en el backend.
export default function CheckoutScreen({ navigation }) {
  const { items, subtotal, count, hasIssues, clearCart, refreshStock } = useCart();
  const { user } = useAuth();
  const savedAddress = user?.addresses?.[0];

  const [form, setForm] = useState({
    address: savedAddress?.street || '',
    city: savedAddress?.city || '',
    notes: '',
    payment: paymentMethods[0],
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const next = {};
    const address = addressError(form.address);
    const city = cityError(form.city);
    if (address) next.address = address;
    if (city) next.city = city;
    if (form.notes.trim().length > notesMax) next.notes = `Máximo ${notesMax} caracteres`;
    if (!paymentMethods.includes(form.payment)) next.payment = 'Selecciona un método de pago';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    if (items.length === 0) {
      setApiError('El carrito está vacío');
      return;
    }
    if (hasIssues) {
      setApiError('Hay productos sin stock suficiente. Vuelve al carrito para ajustarlos.');
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await checkout({
        items,
        shippingAddress: { street: form.address.trim(), city: form.city.trim() },
        paymentMethod: form.payment,
        notes: form.notes.trim(),
      });
      clearCart();
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Main' },
          {
            name: 'OrderConfirmed',
            params: {
              orderNumber: result.order?.order_number || result.cart?.order_number,
              total: result.order?.total ?? result.cart?.total ?? subtotal,
            },
          },
        ],
      });
    } catch (error) {
      setApiError(error.message);
      // Si el rechazo fue por stock, el carrito se actualiza para mostrarlo.
      if (error.status === 400 || error.status === 404 || error.status === 409) {
        refreshStock().catch(() => {});
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackBar title="Finalizar compra" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FormBanner message={apiError} />

        <Text style={styles.heading}>Datos de envío</Text>

        <TextField
          label="Dirección"
          value={form.address}
          onChangeText={setField('address')}
          placeholder="Calle, número, colonia"
          maxLength={150}
          error={errors.address}
        />
        <View style={styles.gap} />
        <TextField
          label="Ciudad"
          value={form.city}
          onChangeText={setField('city')}
          placeholder="San Salvador"
          maxLength={60}
          error={errors.city}
        />

        <Text style={styles.fieldLabel}>Método de pago</Text>
        <View style={styles.methods}>
          {paymentMethods.map((method) => {
            const selected = method === form.payment;
            return (
              <Pressable
                key={method}
                onPress={() => setForm((current) => ({ ...current, payment: method }))}
                style={[styles.method, selected && styles.methodSelected]}
              >
                <Text style={[styles.methodText, selected && styles.methodTextSelected]}>
                  {method}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.gap} />
        <TextField
          label="Notas (opcional)"
          value={form.notes}
          onChangeText={setField('notes')}
          placeholder="Indicaciones para la entrega"
          multiline
          maxLength={notesMax}
          error={errors.notes}
        />
        <Text style={styles.counter}>
          {form.notes.length}/{notesMax}
        </Text>

        <OrderSummary subtotal={subtotal} itemCount={count} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <AppButton
          label="Confirmar compra"
          onPress={handleSubmit}
          loading={submitting}
          disabled={items.length === 0 || hasIssues}
          style={styles.confirmButton}
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
    paddingTop: spacing.sm,
    paddingBottom: 110,
  },
  heading: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.ink,
    marginBottom: 14,
    marginTop: spacing.md,
  },
  gap: {
    height: spacing.lg,
  },
  fieldLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.inkSoft,
    marginTop: spacing.lg,
    marginBottom: 7,
  },
  methods: {
    gap: 8,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
  },
  method: {
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.field,
    borderWidth: 1.5,
    borderColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  methodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  methodText: {
    fontSize: 14,
    color: colors.inkSoft,
  },
  methodTextSelected: {
    color: colors.ink,
    fontWeight: '700',
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
  },
  confirmButton: {
    width: '100%',
  },
});
