import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import CodeField from '../../components/CodeField';
import AppButton from '../../components/AppButton';
import { colors, fonts, radii, spacing } from '../../theme';

// Verificación del correo tras el registro mediante un código de seis caracteres.
export default function VerifyCodeScreen({ navigation }) {
  const [code, setCode] = useState('');

  return (
    <AuthScreen header={<BackBar title="Verifica tu correo" onBack={() => navigation.navigate('Register')} />}>
      <View style={styles.badge}>
        <Feather name="mail" size={24} color={colors.primary} />
      </View>
      <Text style={styles.title}>Ingresa el código</Text>
      <Text style={styles.lede}>
        Enviamos un código de 6 caracteres a sofia.r@correo.com. Vence en 15 minutos.
      </Text>

      <View style={styles.form}>
        <CodeField value={code} onChangeText={setCode} />
        <AppButton label="Verificar cuenta" onPress={() => navigation.navigate('Login')} />
        <Text style={styles.resend}>¿No lo recibiste? Reenviar código en 0:42</Text>
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
  resend: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.muted,
  },
});
