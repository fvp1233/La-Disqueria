import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import PasswordField from '../../components/PasswordField';
import AppButton from '../../components/AppButton';
import { colors, fonts, spacing } from '../../theme';
import { useRegister } from './hooks';

// Formulario de registro de un nuevo cliente.
export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    dui: '',
    phone: '',
    email: '',
    password: '',
  });

  const { register, loading, error, setError } = useRegister();

  const updateField = (key) => (value) => {
    setError(null);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async () => {
    const result = await register(form);
    if (result) {
      navigation.navigate('VerifyCode', { email: result.email });
    }
  };

  return (
    <AuthScreen header={<BackBar title="Crear cuenta" onBack={() => navigation.navigate('Login')} />}>
      <Text style={styles.title}>Crea tu cuenta</Text>
      <Text style={styles.lede}>
        Guarda tu carrito, sigue tus pedidos y recibe avisos de nuevos ingresos.
      </Text>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.half}>
            <TextField label="Nombre" value={form.name} onChangeText={updateField('name')} placeholder="Sofía" />
          </View>
          <View style={styles.half}>
            <TextField label="Apellido" value={form.lastName} onChangeText={updateField('lastName')} placeholder="Ramírez" />
          </View>
        </View>
        <TextField
          label="DUI"
          value={form.dui}
          onChangeText={updateField('dui')}
          placeholder="01234567-8"
          keyboardType="number-pad"
        />
        <TextField
          label="Teléfono"
          value={form.phone}
          onChangeText={updateField('phone')}
          placeholder="7000-0000"
          keyboardType="phone-pad"
        />
        <TextField
          label="Correo electrónico"
          value={form.email}
          onChangeText={updateField('email')}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PasswordField
          label="Contraseña"
          value={form.password}
          onChangeText={updateField('password')}
          placeholder="Mínimo 8 caracteres"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AppButton
          label={loading ? 'Creando cuenta…' : 'Crear cuenta'}
          onPress={onSubmit}
          disabled={loading}
        />

        <Text style={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Inicia sesión
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
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
