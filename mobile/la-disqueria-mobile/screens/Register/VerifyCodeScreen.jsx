import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import CodeField from '../../components/CodeField';
import AppButton from '../../components/AppButton';
import { colors, fonts, radii, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import useRegisterCustomer from '../../hooks/login/useRegisterCustomer';

// Verificación del correo tras el registro mediante un código de seis caracteres.
export default function VerifyCodeScreen({ navigation, route }) {
  const [code, setCode] = useState('');
  const email = route?.params?.email;

  const { signIn } = useAuth();
  const { verifyCode, submitting, error } = useRegisterCustomer();

  const onSubmit = async () => {
    const result = await verifyCode(code.trim().toLowerCase());
    if (result) {
      // La verificación deja la sesión iniciada: RootNavigator entra a la app.
      await signIn(result.user, result.token);
    }
  };

  return (
    <AuthScreen header={<BackBar title="Verifica tu correo" onBack={() => navigation.navigate('Register')} />}>
      <View style={styles.badge}>
        <Feather name="mail" size={24} color={colors.primary} />
      </View>
      <Text style={styles.title}>Ingresa el código</Text>
      <Text style={styles.lede}>
        Enviamos un código de 6 caracteres a {email || 'tu correo'}. Vence en 15 minutos.
      </Text>

      <View style={styles.form}>
        <CodeField value={code} onChangeText={setCode} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AppButton
          label={submitting ? 'Verificando…' : 'Verificar cuenta'}
          onPress={onSubmit}
          disabled={submitting}
        />
        <Text style={styles.resend}>¿No lo recibiste? Vuelve a crear tu cuenta para reenviarlo.</Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(232,96,42,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 30,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  lede: {
    fontSize: 13.5,
    color: colors.inkSoft,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.danger,
    lineHeight: 18,
  },
  resend: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.muted,
  },
});
