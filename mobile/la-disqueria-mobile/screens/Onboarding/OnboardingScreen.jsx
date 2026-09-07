import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AuthScreen from '../../components/AuthScreen';
import BrandHeader from '../../components/BrandHeader';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme';

const highlights = [
  { icon: 'disc', title: 'Catálogo completo', text: 'Vinilos, CDs, tocadiscos y accesorios en un solo lugar.' },
  { icon: 'shopping-bag', title: 'Compra sencilla', text: 'Arma tu carrito y realiza tu pedido en pocos pasos.' },
  { icon: 'truck', title: 'Envíos a El Salvador', text: 'Recibe tu música favorita donde estés.' },
];

// Pantalla de bienvenida que se muestra una sola vez antes de iniciar sesión.
export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();

  return (
    <AuthScreen>
      <BrandHeader caption="Bienvenido" />

      <Text style={styles.title}>Tu tienda de música,{'\n'}ahora en tu bolsillo</Text>

      <View style={styles.list}>
        {highlights.map((item) => (
          <View key={item.title} style={styles.row}>
            <View style={styles.iconWrap}>
              <Feather name={item.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowBody}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <AppButton label="Comenzar" onPress={completeOnboarding} style={styles.button} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 28,
    color: colors.ink,
    marginBottom: spacing.xl,
  },
  list: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(232,96,42,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  rowBody: {
    fontSize: 12.5,
    color: colors.inkSoft,
    lineHeight: 18,
  },
  button: {
    alignSelf: 'stretch',
  },
});
