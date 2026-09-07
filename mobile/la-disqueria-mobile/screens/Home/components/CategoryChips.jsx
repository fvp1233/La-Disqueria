import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { productTypes } from '../../../utils/format';
import { colors, radii, spacing } from '../../../theme';

// Fila de accesos a cada tipo de producto del catálogo.
export default function CategoryChips({ onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {productTypes.map((type, index) => (
        <Pressable
          key={type}
          onPress={() => onSelect(type)}
          style={[styles.chip, index === 0 && styles.chipActive]}
        >
          <Text style={[styles.label, index === 0 && styles.labelActive]}>{type}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: spacing.xxl,
  },
  row: {
    gap: 9,
    paddingRight: spacing.xl,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  chipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  labelActive: {
    color: colors.white,
  },
});
