import { View, StyleSheet } from 'react-native';
import IconButton from './IconButton';

// Grupo de accesos rápidos con el carrito y las notificaciones.
export default function TopBarIcons({ onCartPress, onBellPress, cartCount }) {
  return (
    <View style={styles.wrap}>
      <IconButton
        name="shopping-cart"
        onPress={onCartPress}
        badge={cartCount ? String(cartCount) : undefined}
      />
      <IconButton name="bell" onPress={onBellPress} dot />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 9,
  },
});
