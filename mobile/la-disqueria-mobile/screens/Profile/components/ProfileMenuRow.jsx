import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii } from '../../../theme';

// Fila de una opción del menú de perfil con icono y flecha.
export default function ProfileMenuRow({ icon, label, onPress, last = false }) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper onPress={onPress} style={[styles.row, last && styles.last]}>
      <View style={styles.icon}>
        <Feather name={icon} size={16} color={colors.inkSoft} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Feather name="chevron-right" size={16} color={colors.muted} style={styles.chevron} />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  last: {
    borderBottomWidth: 0,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: colors.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
