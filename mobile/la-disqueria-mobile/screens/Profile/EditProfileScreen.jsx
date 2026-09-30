import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { useAuth } from '../../context/AuthContext';
import { maskName, maskPhone, maskDate } from '../../utils/masks';
import {
  isValidName,
  isPhone,
  birthdateError,
  displayDateToIso,
  isoToDisplayDate,
  addressError,
  cityError,
} from '../../utils/validators';
import { colors, fonts, spacing } from '../../theme';

// Edición de los datos de contacto del cliente.
export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const savedAddress = user?.addresses?.[0];

  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    birthdate: isoToDisplayDate(user?.birthdate),
    street: savedAddress?.street || '',
    city: savedAddress?.city || '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, transform) => (value) =>
    setForm((current) => ({ ...current, [key]: transform ? transform(value) : value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Campo obligatorio';
    else if (!isValidName(form.name)) next.name = 'Entre 3 y 15 caracteres';
    if (!form.lastName.trim()) next.lastName = 'Campo obligatorio';
    else if (!isValidName(form.lastName)) next.lastName = 'Entre 3 y 15 caracteres';
    if (!form.phone.trim()) next.phone = 'Campo obligatorio';
    else if (!isPhone(form.phone)) next.phone = 'Formato ####-####';
    const birthdate = birthdateError(form.birthdate);
    if (birthdate) next.birthdate = birthdate;

    // La dirección es opcional, pero si se llena se piden ambos campos válidos.
    if (form.street.trim() || form.city.trim()) {
      const street = addressError(form.street);
      const city = cityError(form.city);
      if (street) next.street = street;
      if (city) next.city = city;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const hasChanges =
    form.name.trim() !== (user?.name || '') ||
    form.lastName.trim() !== (user?.last_name || '') ||
    form.phone.trim() !== (user?.phone || '') ||
    form.birthdate !== isoToDisplayDate(user?.birthdate) ||
    form.street.trim() !== (savedAddress?.street || '') ||
    form.city.trim() !== (savedAddress?.city || '');

  const handleSubmit = async () => {
    setApiError('');
    setSuccess('');
    if (!validate()) return;
    if (!hasChanges) {
      setApiError('No hay cambios para guardar');
      return;
    }

    const street = form.street.trim();
    const city = form.city.trim();

    setSubmitting(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        last_name: form.lastName.trim(),
        phone: form.phone.trim(),
        birthdate: displayDateToIso(form.birthdate),
        addresses: street && city ? [{ street, city }] : [],
      });
      setSuccess('Datos actualizados');
      setTimeout(() => navigation.goBack(), 600);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackBar title="Editar perfil" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FormBanner message={apiError} />
        <FormBanner message={success} tone="success" />

        <View style={styles.row}>
          <View style={styles.half}>
            <TextField
              label="Nombre"
              value={form.name}
              onChangeText={setField('name', maskName)}
              error={errors.name}
            />
          </View>
          <View style={styles.half}>
            <TextField
              label="Apellido"
              value={form.lastName}
              onChangeText={setField('lastName', maskName)}
              error={errors.lastName}
            />
          </View>
        </View>
        <View style={styles.gap} />
        <TextField
          label="Teléfono"
          value={form.phone}
          onChangeText={setField('phone', maskPhone)}
          keyboardType="number-pad"
          maxLength={9}
          error={errors.phone}
        />
        <View style={styles.gap} />
        <TextField
          label="Fecha de nacimiento"
          value={form.birthdate}
          onChangeText={setField('birthdate', maskDate)}
          placeholder="DD/MM/AAAA"
          keyboardType="number-pad"
          maxLength={10}
          error={errors.birthdate}
        />

        <Text style={styles.section}>Dirección de envío</Text>
        <TextField
          label="Dirección"
          value={form.street}
          onChangeText={setField('street')}
          placeholder="Calle, número, colonia"
          maxLength={150}
          error={errors.street}
        />
        <View style={styles.gap} />
        <TextField
          label="Ciudad"
          value={form.city}
          onChangeText={setField('city')}
          placeholder="San Salvador"
          maxLength={60}
          error={errors.city}
        />
        <Text style={styles.hint}>Se usará para completar tus próximas compras.</Text>

        <Text style={styles.section}>Datos de la cuenta</Text>
        <Text style={styles.readOnly}>{user?.email || ''}</Text>
        <Text style={styles.readOnly}>DUI {user?.dui || 'sin registrar'}</Text>
        <Text style={styles.hint}>El correo y el DUI no se pueden modificar desde la app.</Text>

        <AppButton
          label="Guardar cambios"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  gap: {
    height: spacing.xs,
  },
  section: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15,
    textTransform: 'uppercase',
    color: colors.ink,
    marginTop: spacing.lg,
  },
  readOnly: {
    fontSize: 14,
    color: colors.inkSoft,
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
