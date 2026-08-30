import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, radii, spacing, shadow } from '../theme';

// Barra superior con flecha de retorno y un título breve.
export default function BackBar({ title, onBack, rightSlot }) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} style={({ pressed }) => [styles.icon, pressed && styles.pressed]}>
        <Feather name="chevron-left" size={20} color={colors.ink} />
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.spacer} />
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  pressed: {
    opacity: 0.85,
  },
  title: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  spacer: {
    flex: 1,
  },
});
