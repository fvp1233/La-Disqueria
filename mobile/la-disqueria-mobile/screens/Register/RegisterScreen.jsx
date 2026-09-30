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
import { maskName, maskDui, maskPhone, maskDate } from '../../utils/masks';
import {
  isEmail,
  isDui,
  isPhone,
  isValidName,
  isStrongPassword,
  birthdateError,
  displayDateToIso,
  MIN_AGE,
} from '../../utils/validators';
import { colors, fonts, spacing } from '../../theme';

const emptyForm = {
  name: '',
  lastName: '',
  birthdate: '',
  dui: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

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
    if (!form.name.trim()) next.name = 'Campo obligatorio';
    else if (!isValidName(form.name)) next.name = 'Entre 3 y 15 caracteres';
    if (!form.lastName.trim()) next.lastName = 'Campo obligatorio';
    else if (!isValidName(form.lastName)) next.lastName = 'Entre 3 y 15 caracteres';
    const birthdate = birthdateError(form.birthdate);
    if (birthdate) next.birthdate = birthdate;
    if (!form.dui.trim()) next.dui = 'Campo obligatorio';
    else if (!isDui(form.dui)) next.dui = 'Formato ########-#';
    if (!form.phone.trim()) next.phone = 'Campo obligatorio';
    else if (!isPhone(form.phone)) next.phone = 'Formato ####-####';
    if (!form.email.trim()) next.email = 'Campo obligatorio';
    else if (!isEmail(form.email)) next.email = 'Correo no válido';
    if (!form.password) next.password = 'Campo obligatorio';
    else if (!isStrongPassword(form.password)) next.password = 'No cumple los requisitos';
    if (!form.confirmPassword) next.confirmPassword = 'Confirma tu contraseña';
    else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await registerCustomer({
        ...form,
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        birthdate: displayDateToIso(form.birthdate),
      });
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
          label="Fecha de nacimiento"
          value={form.birthdate}
          onChangeText={setField('birthdate', maskDate)}
          placeholder="DD/MM/AAAA"
          keyboardType="number-pad"
          maxLength={10}
          error={errors.birthdate}
        />
        {!errors.birthdate ? (
          <Text style={styles.hint}>Debes ser mayor de {MIN_AGE} años para comprar.</Text>
        ) : null}
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
        <PasswordField
          label="Confirmar contraseña"
          value={form.confirmPassword}
          onChangeText={setField('confirmPassword')}
          placeholder="Repite tu contraseña"
          error={errors.confirmPassword}
        />

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
  hint: {
    fontSize: 11.5,
    color: colors.muted,
    marginTop: -spacing.sm,
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
