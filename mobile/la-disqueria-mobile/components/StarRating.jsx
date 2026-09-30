import { View, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme';

const starColor = '#F2A93B';

// Muestra de una a cinco estrellas. Con onChange se vuelve un selector.
export default function StarRating({ value = 0, onChange, size = 14 }) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        let name = 'star-o';
        if (rounded >= star) name = 'star';
        else if (rounded >= star - 0.5) name = 'star-half-o';

        const icon = (
          <FontAwesome
            name={name}
            size={size}
            color={name === 'star-o' ? colors.muted : starColor}
          />
        );

        if (!onChange) return <View key={star}>{icon}</View>;

        return (
          <Pressable
            key={star}
            onPress={() => onChange(star)}
            hitSlop={6}
            accessibilityLabel={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
            style={styles.touch}
          >
            {icon}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  touch: {
    paddingHorizontal: 3,
  },
});
