import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import StepDots from '../../components/StepDots';
import CodeField from '../../components/CodeField';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { verifyPasswordCode } from '../../api/auth';
import { maskCode } from '../../utils/masks';
import { colors, fonts, spacing } from '../../theme';

// Segundo paso de la recuperación. Recibe el código enviado por correo.
export default function ForgotPasswordCodeScreen({ navigation, route }) {
  const email = route.params?.email || 'tu correo';
  const recoveryToken = route.params?.recoveryToken;

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
      const data = await verifyPasswordCode(code, recoveryToken);
      navigation.navigate('ForgotPasswordNew', {
        recoveryToken: data.recoveryToken || recoveryToken,
      });
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      header={
        <BackBar
          title="Recuperar contraseña"
          onBack={() => navigation.goBack()}
          rightSlot={<StepDots total={3} current={2} />}
        />
      }
    >
      <Text style={styles.title}>Ingresa el código de verificación</Text>
      <Text style={styles.lede}>
        Revisa tu correo {email} e ingresa el código de 6 caracteres.
      </Text>

      <View style={styles.form}>
        <FormBanner message={error} />
        <CodeField value={code} onChangeText={(value) => setCode(maskCode(value))} />
        <AppButton label="Verificar código" onPress={handleSubmit} loading={submitting} />
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
});
