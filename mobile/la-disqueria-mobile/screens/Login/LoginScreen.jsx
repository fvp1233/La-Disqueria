import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BrandHeader from '../../components/BrandHeader';
import TextField from '../../components/TextField';
import PasswordField from '../../components/PasswordField';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { useAuth } from '../../context/AuthContext';
import { isEmail, isNotEmpty } from '../../utils/validators';
import { colors, fonts, spacing } from '../../theme';

// Inicio de sesión directo con correo y contraseña.
export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!isEmail(email)) next.email = 'Ingresa un correo válido';
    if (!isNotEmpty(password)) next.password = 'Ingresa tu contraseña';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <BrandHeader caption="Iniciar sesión" />

      <View style={styles.form}>
        <FormBanner message={apiError} />

        <TextField
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <PasswordField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Tu contraseña"
          error={errors.password}
        />

        <Pressable style={styles.forgot} onPress={() => navigation.navigate('ForgotPasswordEmail')}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        <AppButton label="Iniciar sesión" onPress={handleSubmit} loading={submitting} />

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
