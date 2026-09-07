import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { useAuth } from '../../context/AuthContext';
import { maskName, maskPhone } from '../../utils/masks';
import { isValidName, isPhone } from '../../utils/validators';
import { colors, spacing } from '../../theme';

// Edición de los datos de contacto del cliente.
export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, transform) => (value) =>
    setForm((current) => ({ ...current, [key]: transform ? transform(value) : value }));

  const validate = () => {
    const next = {};
    if (!isValidName(form.name)) next.name = 'Entre 3 y 15 caracteres';
    if (!isValidName(form.lastName)) next.lastName = 'Entre 3 y 15 caracteres';
    if (!isPhone(form.phone)) next.phone = 'Formato ####-####';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    setSuccess('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        last_name: form.lastName.trim(),
        phone: form.phone.trim(),
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
        <TextField label="Correo electrónico" value={user?.email || ''} onChangeText={() => {}} />
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
  hint: {
    fontSize: 12,
    color: colors.muted,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
