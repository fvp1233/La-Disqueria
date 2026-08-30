import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts } from '../../../theme';

// Título de sección con una acción opcional para ver todo el contenido.
export default function SectionHeader({ title, actionLabel = 'Ver todo', onAction }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {onAction ? (
        <Pressable onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 21,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  action: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.muted,
  },
});
