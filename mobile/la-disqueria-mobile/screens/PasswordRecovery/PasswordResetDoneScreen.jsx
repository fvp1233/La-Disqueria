import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AuthScreen from '../../components/AuthScreen';
import AppButton from '../../components/AppButton';
import { colors, fonts, spacing } from '../../theme';

// Último paso de la recuperación. Confirma el cambio y regresa al inicio de sesión.
export default function PasswordResetDoneScreen({ navigation }) {
  const goToLogin = () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

  return (
    <AuthScreen>
      <View style={styles.center}>
        <View style={styles.ring}>
          <Feather name="check" size={34} color={colors.ok} />
        </View>
        <Text style={styles.title}>LISTO</Text>
        <Text style={styles.lede}>
          Tu contraseña se actualizó correctamente. Inicia sesión con tu nueva contraseña.
        </Text>
        <AppButton label="Ir a iniciar sesión" onPress={goToLogin} style={styles.button} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
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
    fontSize: 34,
    letterSpacing: 1,
    color: colors.ink,
  },
  lede: {
    fontSize: 13.5,
    color: colors.inkSoft,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    maxWidth: 270,
  },
  button: {
    alignSelf: 'stretch',
  },
});
