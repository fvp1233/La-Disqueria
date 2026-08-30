import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import OrderSummary from '../../components/OrderSummary';
import AppButton from '../../components/AppButton';
import { findProductById, sampleCartItems } from '../../data/catalog';
import { colors, fonts, radii, spacing } from '../../theme';

const paymentMethods = ['Tarjeta de crédito o débito', 'Efectivo contra entrega'];

const itemCount = sampleCartItems.reduce((total, item) => total + item.quantity, 0);
const subtotal = sampleCartItems.reduce(
  (total, item) => total + findProductById(item.productId).price * item.quantity,
  0
);

// Datos de envío y confirmación del pedido.
export default function CheckoutScreen({ navigation }) {
  const [form, setForm] = useState({
    address: '',
    city: '',
    notes: '',
    payment: paymentMethods[0],
  });

  const updateField = (key) => (value) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackBar title="Finalizar compra" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Datos de envío</Text>

        <TextField
          label="Dirección"
          value={form.address}
          onChangeText={updateField('address')}
          placeholder="Calle, número, colonia"
        />
        <View style={styles.gap} />
        <TextField
          label="Ciudad"
          value={form.city}
          onChangeText={updateField('city')}
          placeholder="San Salvador"
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
          onChangeText={updateField('notes')}
          placeholder="Indicaciones para la entrega"
          multiline
        />

        <OrderSummary subtotal={subtotal} itemCount={itemCount} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <AppButton
          label="Confirmar compra"
          onPress={() => navigation.navigate('OrderConfirmed')}
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
