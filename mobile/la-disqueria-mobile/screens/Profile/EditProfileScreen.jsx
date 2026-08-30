import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BackBar from '../../components/BackBar';
import TextField from '../../components/TextField';
import AppButton from '../../components/AppButton';
import { colors, spacing } from '../../theme';

// Edición de los datos personales del cliente.
export default function EditProfileScreen({ navigation }) {
  const [form, setForm] = useState({
    name: 'Sofía',
    lastName: 'Ramírez',
    phone: '+503 7000 0000',
    email: 'sofia.r@correo.com',
  });

  const updateField = (key) => (value) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackBar title="Editar perfil" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SR</Text>
          </View>
          <Pressable style={styles.cameraButton}>
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
          label="Guardar cambios"
          onPress={() => navigation.goBack()}
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
});
