import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import AppButton from '../../components/AppButton';
import useProfile from '../../hooks/profile/useProfile';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';

const initialsOf = (name = '', lastName = '') =>
  `${name.trim()[0] ?? ''}${lastName.trim()[0] ?? ''}`.toUpperCase() || '·';

// Edición de los datos personales del cliente.
export default function EditProfileScreen({ navigation }) {
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useProfile(user?.id);
  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const updateField = (key) => (value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }
    if (!form.lastName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu apellido');
      return;
    }
    if (!form.phone.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu teléfono');
      return;
    }

    try {
      await updateProfile({
        name: form.name.trim(),
        last_name: form.lastName.trim(),
        phone: form.phone.trim(),
      });
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo actualizar el perfil');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackBar title="Editar perfil" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(form.name, form.lastName)}</Text>
          </View>
          <Pressable style={styles.cameraButton} onPress={() => Alert.alert('Info', 'Cambio de foto próximamente')}>
            <Feather name="camera" size={14} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <TextField label="Nombre" value={form.name} onChangeText={updateField('name')} />
          </View>
          <View style={styles.half}>
            <TextField label="Apellido" value={form.lastName} onChangeText={updateField('lastName')} />
          </View>
        </View>
        <View style={styles.gap} />
        <TextField
          label="Teléfono"
          value={form.phone}
          onChangeText={updateField('phone')}
          keyboardType="phone-pad"
        />
        <View style={styles.gap} />
        <TextField
          label="Correo electrónico"
          value={form.email}
          onChangeText={updateField('email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppButton
          label={loading ? 'Guardando…' : 'Guardar cambios'}
          onPress={handleSave}
          disabled={loading}
          style={styles.saveButton}
        />
        {loading && <ActivityIndicator size="small" color={colors.primary} style={styles.spinner} />}
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
  },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 26,
  },
  cameraButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  gap: {
    height: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
  spinner: {
    marginTop: spacing.md,
  },
});
