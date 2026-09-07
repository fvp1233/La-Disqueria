import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import StepDots from '../../components/StepDots';
import TextField from '../../components/TextField';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { requestPasswordCode } from '../../api/auth';
import { isEmail } from '../../utils/validators';
import { colors, fonts, spacing } from '../../theme';

// Primer paso de la recuperación. Solicita el correo de la cuenta.
export default function ForgotPasswordEmailScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setApiError('');
    if (!isEmail(email)) {
      setError('Ingresa un correo válido');
      return;
    }

    setSubmitting(true);
    try {
      const data = await requestPasswordCode(email.trim());
      navigation.navigate('ForgotPasswordCode', {
        email: email.trim(),
        recoveryToken: data.recoveryToken,
      });
    } catch (apiErr) {
      setApiError(apiErr.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      header={
        <BackBar
          title="Recuperar contraseña"
          onBack={() => navigation.navigate('Login')}
          rightSlot={<StepDots total={3} current={1} />}
        />
      }
    >
      <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
      <Text style={styles.lede}>
        Escribe el correo de tu cuenta y te enviaremos un código para restablecerla.
      </Text>

      <View style={styles.form}>
        <FormBanner message={apiError} />
        <TextField
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />
        <AppButton label="Enviar código" onPress={handleSubmit} loading={submitting} />
        <Text style={styles.footer}>
          ¿Recordaste tu contraseña?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Volver a iniciar sesión
          </Text>
        </Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
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
  footer: {
    textAlign: 'center',
    fontSize: 12.5,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});
