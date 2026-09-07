import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import CodeField from '../../components/CodeField';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { verifyRegistrationCode } from '../../api/auth';
import { maskCode } from '../../utils/masks';
import { colors, fonts, radii, spacing } from '../../theme';

// Verificación del correo tras el registro mediante el código recibido.
export default function VerifyCodeScreen({ navigation, route }) {
  const email = route.params?.email || 'tu correo';
  const registrationToken = route.params?.registrationToken;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (code.length < 6) {
      setError('El código tiene 6 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      await verifyRegistrationCode(code, registrationToken);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen header={<BackBar title="Verifica tu correo" onBack={() => navigation.goBack()} />}>
      <View style={styles.badge}>
        <Feather name="mail" size={24} color={colors.primary} />
      </View>
      <Text style={styles.title}>Ingresa el código</Text>
      <Text style={styles.lede}>
        Enviamos un código de 6 caracteres a {email}. Vence en 15 minutos.
      </Text>

      <View style={styles.form}>
        <FormBanner message={error} />
        <CodeField value={code} onChangeText={(value) => setCode(maskCode(value))} />
        <AppButton label="Verificar cuenta" onPress={handleSubmit} loading={submitting} />
        <Text style={styles.hint}>Revisa también la carpeta de spam.</Text>
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
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.muted,
  },
});
