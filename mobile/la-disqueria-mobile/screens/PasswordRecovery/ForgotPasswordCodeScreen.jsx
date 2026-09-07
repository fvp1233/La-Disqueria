import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import StepDots from '../../components/StepDots';
import CodeField from '../../components/CodeField';
import AppButton from '../../components/AppButton';
import usePasswordRecovery from '../../hooks/password/usePasswordRecovery';
import { colors, fonts, spacing } from '../../theme';

// Segundo paso de la recuperación. Recibe el código enviado por correo.
export default function ForgotPasswordCodeScreen({ navigation, route }) {
  const [code, setCode] = useState('');
  const { verifyCode, loading, error, setError } = usePasswordRecovery();
  const email = route.params?.email || '';

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código');
      return;
    }
    const ok = await verifyCode(code);
    if (ok) {
      navigation.navigate('ForgotPasswordNew', { code, email });
    }
  };

  return (
    <AuthScreen
      header={
        <BackBar
          title="Recuperar contraseña"
          onBack={() => {
            navigation.navigate('ForgotPasswordEmail');
            setError(null);
          }}
          rightSlot={<StepDots total={3} current={2} />}
        />
      }
    >
      <Text style={styles.title}>Ingresa el código de verificación</Text>
      <Text style={styles.lede}>
        Revisa tu correo {email} e ingresa el código de 6 caracteres.
      </Text>

      <View style={styles.form}>
        <CodeField
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setError(null);
          }}
          editable={!loading}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <AppButton
          label={loading ? 'Verificando…' : 'Verificar código'}
          onPress={handleVerify}
          disabled={loading}
        />
        <Text style={styles.resend}>¿No lo recibiste? Reenviar código</Text>
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
  resend: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.muted,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.danger,
    lineHeight: 18,
  },
});
