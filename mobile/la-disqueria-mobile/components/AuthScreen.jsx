import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopoLines from './TopoLines';
import { colors, spacing } from '../theme';

// Estructura común de las pantallas de acceso con fondo crema y líneas topográficas.
export default function AuthScreen({ children, header }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <TopoLines placement="topLeft" tint={colors.primary} />
      <TopoLines placement="bottomRight" tint={colors.salmon} />
      {header}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
});
