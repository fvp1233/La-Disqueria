import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppButton from './AppButton';
import { colors, spacing } from '../theme';

// Muestra el estado de carga, error o vacío de una pantalla que consume datos.
export default function StateView({ loading, error, empty, emptyText, onRetry }) {
  if (loading) {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.text}>Cargando…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.wrap}>
        <Feather name="wifi-off" size={26} color={colors.muted} />
        <Text style={styles.text}>{error}</Text>
        {onRetry ? (
          <AppButton label="Reintentar" variant="ghost" onPress={onRetry} style={styles.button} />
        ) : null}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.wrap}>
        <Feather name="inbox" size={26} color={colors.muted} />
        <Text style={styles.text}>{emptyText || 'No hay datos para mostrar'}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: spacing.md,
  },
  text: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.sm,
    paddingHorizontal: 24,
  },
});
