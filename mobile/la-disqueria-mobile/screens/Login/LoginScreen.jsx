import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BrandHeader from '../../components/BrandHeader';
import TextField from '../../components/TextField';
import PasswordField from '../../components/PasswordField';
import AppButton from '../../components/AppButton';
import { colors, fonts, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useLogin } from './hooks';

// Inicio de sesión directo con correo y contraseña.
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();
  const { login, loading, error, setError } = useLogin();

  const onChangeEmail = (value) => {
    setError(null);
    setEmail(value);
  };

  const onChangePassword = (value) => {
    setError(null);
    setPassword(value);
  };

  const onSubmit = async () => {
    const result = await login({ email, password });
    if (result) {
      // Al activar la sesión, RootNavigator cambia solo a la pila principal.
      await signIn(result.user, result.token);
    }
  };

  return (
    <AuthScreen>
      <BrandHeader caption="Iniciar sesión" />

      <View style={styles.form}>
        <TextField
          label="Correo electrónico"
          value={email}
          onChangeText={onChangeEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PasswordField
          label="Contraseña"
          value={password}
          onChangeText={onChangePassword}
          placeholder="Tu contraseña"
        />

        <Pressable style={styles.forgot} onPress={() => navigation.navigate('ForgotPasswordEmail')}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AppButton
          label={loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          onPress={onSubmit}
          disabled={loading}
        />

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
  error: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.danger,
    lineHeight: 18,
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
