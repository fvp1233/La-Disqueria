import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import ProfileMenuRow from './components/ProfileMenuRow';
import StatCard from './components/StatCard';
import AppButton from '../../components/AppButton';
import { colors, fonts, radii, shadow, spacing } from '../../theme';

const menuItems = [
  { icon: 'file-text', label: 'Mis pedidos' },
  { icon: 'map-pin', label: 'Mis direcciones' },
  { icon: 'credit-card', label: 'Métodos de pago' },
  { icon: 'bell', label: 'Notificaciones' },
  { icon: 'help-circle', label: 'Ayuda y soporte' },
];

// Perfil del cliente con datos, estadísticas y accesos de la cuenta.
export default function ProfileScreen({ navigation }) {
  const logout = () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi perfil</Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SR</Text>
          </View>
          <View style={styles.identity}>
            <Text style={styles.name}>Sofía Ramírez</Text>
            <Text style={styles.email}>sofia.r@correo.com</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Feather name="edit-2" size={16} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.stats}>
          <StatCard value="3" label="Pedidos" />
          <StatCard value="12" label="Favoritos" />
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <ProfileMenuRow
              key={item.label}
              icon={item.icon}
              label={item.label}
              last={index === menuItems.length - 1}
            />
          ))}
        </View>

        <AppButton label="Cerrar sesión" variant="ghost" onPress={logout} style={styles.logout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 26,
    textTransform: 'uppercase',
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 20,
  },
  identity: {
    flex: 1,
  },
  name: {
    fontWeight: '800',
    fontSize: 16,
    color: colors.ink,
  },
  email: {
    fontSize: 12.5,
    color: colors.muted,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginBottom: spacing.xl,
  },
  menu: {
    marginBottom: spacing.xl,
  },
  logout: {
    marginTop: spacing.sm,
  },
});
