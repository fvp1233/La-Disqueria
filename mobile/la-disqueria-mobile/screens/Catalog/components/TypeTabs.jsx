import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { productTypes } from '../../../utils/format';
import { colors, radii, spacing } from '../../../theme';

// Pestañas que separan el catálogo por los cuatro tipos de producto.
export default function TypeTabs({ value, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {productTypes.map((type) => {
        const active = type === value;
        return (
          <Pressable
            key={type}
            onPress={() => onChange(type)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{type}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: spacing.xl,
  },
  row: {
    gap: 9,
    paddingRight: spacing.xl,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  tabActive: {
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
