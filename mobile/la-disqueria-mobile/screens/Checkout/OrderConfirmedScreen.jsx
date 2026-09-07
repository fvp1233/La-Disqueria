import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import { formatPrice } from '../../utils/format';
import { colors, fonts, spacing } from '../../theme';

// Confirmación del pedido con el número de referencia y el total pagado.
export default function OrderConfirmedScreen({ navigation, route }) {
  const orderNumber = route.params?.orderNumber || 'ORD';
  const total = route.params?.total ?? 0;

  const backToStore = () => navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={styles.ring}>
          <Feather name="check" size={36} color={colors.ok} />
        </View>
        <Text style={styles.title}>¡Pedido confirmado!</Text>
        <Text style={styles.line}>Pedido {orderNumber}</Text>
        <Text style={styles.line}>Total pagado {formatPrice(total)}</Text>
        <AppButton label="Seguir comprando" onPress={backToStore} style={styles.button} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  ring: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(63,155,91,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 24,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  line: {
    fontSize: 13.5,
    color: colors.inkSoft,
    marginTop: 6,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
  },
});
