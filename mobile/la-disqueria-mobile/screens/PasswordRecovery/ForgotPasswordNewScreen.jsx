import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import StepDots from '../../components/StepDots';
import PasswordField from '../../components/PasswordField';
import PasswordCriteria from '../../components/PasswordCriteria';
import AppButton from '../../components/AppButton';
import usePasswordRecovery from '../../hooks/password/usePasswordRecovery';
import { colors, fonts, spacing } from '../../theme';

const PASSWORD_MIN_LENGTH = 8;

// Tercer paso de la recuperación. Define y confirma la nueva contraseña.
export default function ForgotPasswordNewScreen({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { resetPassword, loading, error, setError } = usePasswordRecovery();
  const code = route.params?.code || '';

  const showMismatch = confirm.length > 0 && confirm !== password;
  const isValid = password.length >= PASSWORD_MIN_LENGTH && password === confirm;

  const handleReset = async () => {
    if (!isValid) {
      Alert.alert('Error', 'Las contraseñas deben tener al menos 8 caracteres y coincidir');
      return;
    }
    const ok = await resetPassword(code, password);
    if (ok) {
      navigation.navigate('PasswordResetDone');
    }
  };

  return (
    <AuthScreen
      header={
        <BackBar
          title="Recuperar contraseña"
          onBack={() => {
            navigation.navigate('ForgotPasswordCode');
            setError(null);
          }}
          rightSlot={<StepDots total={3} current={3} />}
        />
      }
    >
      <Text style={styles.title}>Crea tu nueva contraseña</Text>
      <Text style={styles.lede}>Elige una contraseña segura que no uses en otros sitios.</Text>

      <View style={styles.form}>
        <PasswordField
          label="Nueva contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
          }}
          placeholder="Nueva contraseña"
          editable={!loading}
        />
        <View>
          <PasswordField
            label="Confirmar nueva contraseña"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repite la nueva contraseña"
            editable={!loading}
          />
          {showMismatch ? (
            <Text style={styles.mismatch}>Las contraseñas no coinciden</Text>
          ) : null}
        </View>
        <PasswordCriteria password={password} />
        {error && <Text style={styles.error}>{error}</Text>}
        <AppButton
          label={loading ? 'Actualizando…' : 'Actualizar contraseña'}
          onPress={handleReset}
          disabled={loading || !isValid}
        />
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
  mismatch: {
    marginTop: 6,
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primary,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.danger,
    lineHeight: 18,
  },
});
