import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthScreen from '../../components/AuthScreen';
import BackBar from '../../components/BackBar';
import StepDots from '../../components/StepDots';
import PasswordField from '../../components/PasswordField';
import PasswordCriteria from '../../components/PasswordCriteria';
import AppButton from '../../components/AppButton';
import { colors, fonts, spacing } from '../../theme';

// Tercer paso de la recuperación. Define y confirma la nueva contraseña.
export default function ForgotPasswordNewScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const showMismatch = confirm.length > 0 && confirm !== password;

  return (
    <AuthScreen
      header={
        <BackBar
          title="Recuperar contraseña"
          onBack={() => navigation.navigate('ForgotPasswordCode')}
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
          onChangeText={setPassword}
          placeholder="Nueva contraseña"
        />
        <View>
          <PasswordField
            label="Confirmar nueva contraseña"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repite la nueva contraseña"
          />
          {showMismatch ? (
            <Text style={styles.mismatch}>Las contraseñas no coinciden</Text>
          ) : null}
        </View>
        <PasswordCriteria password={password} />
        <AppButton label="Actualizar contraseña" onPress={() => navigation.navigate('PasswordResetDone')} />
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
});
