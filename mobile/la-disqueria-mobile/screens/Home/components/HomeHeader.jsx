import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TopBarIcons from '../../../components/TopBarIcons';
import { colors, spacing } from '../../../theme';

// Cabecera del inicio con el saludo, la ubicación y los accesos rápidos.
export default function HomeHeader({ onCartPress, onBellPress, cartCount, name }) {
  const initial = (name || 'A').trim().charAt(0).toUpperCase();

  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View>
        <Text style={styles.greeting}>Hola, {name || 'bienvenido'}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={11} color={colors.muted} />
          <Text style={styles.location}>San Salvador</Text>
        </View>
      </View>
      <View style={styles.spacer} />
      <TopBarIcons onCartPress={onCartPress} onBellPress={onBellPress} cartCount={cartCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  greeting: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.ink,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    fontSize: 11,
    color: colors.muted,
  },
  spacer: {
    flex: 1,
  },
});
