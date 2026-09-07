import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import StepDots from '../../components/StepDots';
import PasswordField from '../../components/PasswordField';
import PasswordCriteria from '../../components/PasswordCriteria';
import AppButton from '../../components/AppButton';
import FormBanner from '../../components/FormBanner';
import { resetPassword } from '../../api/auth';
import { isStrongPassword } from '../../utils/validators';
import { colors, fonts, spacing } from '../../theme';

// Tercer paso de la recuperación. Define y confirma la nueva contraseña.
export default function ForgotPasswordNewScreen({ navigation, route }) {
  const recoveryToken = route.params?.recoveryToken;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!isStrongPassword(password)) next.password = 'No cumple los requisitos';
    if (confirm !== password) next.confirm = 'Las contraseñas no coinciden';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await resetPassword(password, confirm, recoveryToken);
      navigation.reset({ index: 0, routes: [{ name: 'PasswordResetDone' }] });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      header={
        <BackBar
          title="Recuperar contraseña"
          onBack={() => navigation.goBack()}
          rightSlot={<StepDots total={3} current={3} />}
        />
      }
    >
      <Text style={styles.title}>Crea tu nueva contraseña</Text>
      <Text style={styles.lede}>Elige una contraseña segura que no uses en otros sitios.</Text>

      <View style={styles.form}>
        <FormBanner message={apiError} />
        <PasswordField
          label="Nueva contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Nueva contraseña"
          error={errors.password}
        />
        <PasswordField
          label="Confirmar nueva contraseña"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Repite la nueva contraseña"
          error={errors.confirm}
        />
        <PasswordCriteria password={password} />
        <AppButton label="Actualizar contraseña" onPress={handleSubmit} loading={submitting} />
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
});
