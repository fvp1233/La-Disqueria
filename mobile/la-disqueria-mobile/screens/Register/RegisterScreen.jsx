import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import PasswordField from '../../components/PasswordField';
import PasswordCriteria from '../../components/PasswordCriteria';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { registerCustomer } from '../../api/auth';
import { maskName, maskDui, maskPhone } from '../../utils/masks';
import { isEmail, isDui, isPhone, isValidName, isStrongPassword } from '../../utils/validators';
import { colors, fonts, spacing } from '../../theme';

const emptyForm = { name: '', lastName: '', dui: '', phone: '', email: '', password: '' };

// Formulario de registro de un nuevo cliente con validaciones y máscaras.
export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, transform) => (value) =>
    setForm((current) => ({ ...current, [key]: transform ? transform(value) : value }));

  const validate = () => {
    const next = {};
    if (!isValidName(form.name)) next.name = 'Entre 3 y 15 caracteres';
    if (!isValidName(form.lastName)) next.lastName = 'Entre 3 y 15 caracteres';
    if (!isDui(form.dui)) next.dui = 'Formato ########-#';
    if (!isPhone(form.phone)) next.phone = 'Formato ####-####';
    if (!isEmail(form.email)) next.email = 'Correo no válido';
    if (!isStrongPassword(form.password)) next.password = 'No cumple los requisitos';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await registerCustomer(form);
      navigation.navigate('VerifyCode', {
        email: form.email.trim(),
        registrationToken: data.registrationToken,
      });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen header={<BackBar title="Crear cuenta" onBack={() => navigation.navigate('Login')} />}>
      <Text style={styles.title}>Crea tu cuenta</Text>
      <Text style={styles.lede}>
        Guarda tu carrito, sigue tus pedidos y recibe avisos de nuevos ingresos.
      </Text>

      <View style={styles.form}>
        <FormBanner message={apiError} />

        <View style={styles.row}>
          <View style={styles.half}>
            <TextField
              label="Nombre"
              value={form.name}
              onChangeText={setField('name', maskName)}
              placeholder="Sofía"
              error={errors.name}
            />
          </View>
          <View style={styles.half}>
            <TextField
              label="Apellido"
              value={form.lastName}
              onChangeText={setField('lastName', maskName)}
              placeholder="Ramírez"
              error={errors.lastName}
            />
          </View>
        </View>

        <TextField
          label="DUI"
          value={form.dui}
          onChangeText={setField('dui', maskDui)}
          placeholder="00000000-0"
          keyboardType="number-pad"
          maxLength={10}
          error={errors.dui}
        />
        <TextField
          label="Teléfono"
          value={form.phone}
          onChangeText={setField('phone', maskPhone)}
          placeholder="0000-0000"
          keyboardType="number-pad"
          maxLength={9}
          error={errors.phone}
        />
        <TextField
          label="Correo electrónico"
          value={form.email}
          onChangeText={setField('email')}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <PasswordField
          label="Contraseña"
          value={form.password}
          onChangeText={setField('password')}
          placeholder="Mínimo 8 caracteres"
          error={errors.password}
        />
        <PasswordCriteria password={form.password} />

        <AppButton label="Crear cuenta" onPress={handleSubmit} loading={submitting} />

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
