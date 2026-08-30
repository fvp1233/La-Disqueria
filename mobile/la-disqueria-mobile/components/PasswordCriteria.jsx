import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';

const rules = [
  { key: 'length', label: 'Mínimo 8 caracteres', test: (value) => value.length >= 8 },
  { key: 'upper', label: 'Una letra mayúscula', test: (value) => /[A-Z]/.test(value) },
  { key: 'lower', label: 'Una letra minúscula', test: (value) => /[a-z]/.test(value) },
  { key: 'number', label: 'Un número', test: (value) => /[0-9]/.test(value) },
  { key: 'special', label: 'Un carácter especial', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

// Lista de requisitos de la contraseña que se marca a medida que se cumplen.
export default function PasswordCriteria({ password = '' }) {
  return (
    <View style={styles.wrap}>
      {rules.map((rule) => {
        const passed = rule.test(password);
        return (
          <View key={rule.key} style={styles.row}>
            <View style={[styles.dot, passed && styles.dotOn]}>
              {passed ? <Feather name="check" size={9} color={colors.white} /> : null}
            </View>
            <Text style={styles.text}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 9,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: {
    backgroundColor: colors.ok,
    borderColor: colors.ok,
  },
  text: {
    fontSize: 12,
    color: colors.inkSoft,
  },
});
