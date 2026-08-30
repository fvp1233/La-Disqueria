import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import StepDots from '../../components/StepDots';
import CodeField from '../../components/CodeField';
import AppButton from '../../components/AppButton';
import { colors, fonts, spacing } from '../../theme';

// Segundo paso de la recuperación. Recibe el código enviado por correo.
export default function ForgotPasswordCodeScreen({ navigation }) {
  const [code, setCode] = useState('');

  return (
    <AuthScreen
      header={
        <BackBar
          title="Recuperar contraseña"
          onBack={() => navigation.navigate('ForgotPasswordEmail')}
          rightSlot={<StepDots total={3} current={2} />}
        />
      }
    >
      <Text style={styles.title}>Ingresa el código de verificación</Text>
      <Text style={styles.lede}>
        Revisa tu correo sofia.r@correo.com e ingresa el código de 6 caracteres.
      </Text>

      <View style={styles.form}>
        <CodeField value={code} onChangeText={setCode} />
        <AppButton label="Verificar código" onPress={() => navigation.navigate('ForgotPasswordNew')} />
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
});
