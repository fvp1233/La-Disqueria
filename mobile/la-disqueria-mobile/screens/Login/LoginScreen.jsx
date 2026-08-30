import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BrandHeader from '../../components/BrandHeader';
import TextField from '../../components/TextField';
import PasswordField from '../../components/PasswordField';
import AppButton from '../../components/AppButton';
import { colors, fonts, spacing } from '../../theme';

// Inicio de sesión directo con correo y contraseña.
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToApp = () => navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  return (
    <AuthScreen>
      <BrandHeader caption="Iniciar sesión" />

      <View style={styles.form}>
        <TextField
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PasswordField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Tu contraseña"
        />

        <Pressable style={styles.forgot} onPress={() => navigation.navigate('ForgotPasswordEmail')}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        <AppButton label="Iniciar sesión" onPress={goToApp} />

        <Text style={styles.footer}>
          ¿No tienes una cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Crear cuenta
          </Text>
        </Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  forgot: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.muted,
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
