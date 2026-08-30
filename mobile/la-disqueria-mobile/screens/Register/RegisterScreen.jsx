import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import PasswordField from '../../components/PasswordField';
import AppButton from '../../components/AppButton';
import { colors, fonts, spacing } from '../../theme';

// Formulario de registro de un nuevo cliente.
export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const updateField = (key) => (value) =>
    setForm((current) => ({ ...current, [key]: value }));

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
          label="Teléfono"
          value={form.phone}
          onChangeText={updateField('phone')}
          placeholder="+503 7000 0000"
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

        <AppButton label="Crear cuenta" onPress={() => navigation.navigate('VerifyCode')} />

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
