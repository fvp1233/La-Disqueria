import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import ProfileMenuRow from './components/ProfileMenuRow';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, radii, shadow, spacing } from '../../theme';

// Perfil del cliente autenticado con sus datos y accesos de la cuenta.
export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const fullName = `${user?.name || ''} ${user?.last_name || ''}`.trim() || 'Cliente';
  const initials = fullName
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi perfil</Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.identity}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Feather name="edit-2" size={16} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.dataCard}>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Teléfono</Text>
            <Text style={styles.dataValue}>{user?.phone || 'Sin registrar'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>DUI</Text>
            <Text style={styles.dataValue}>{user?.dui || 'Sin registrar'}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <ProfileMenuRow
            icon="file-text"
            label="Mis pedidos"
            onPress={() => navigation.navigate('Orders')}
          />
          <ProfileMenuRow
            icon="edit-2"
            label="Editar perfil"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <ProfileMenuRow
            icon="help-circle"
            label="Ayuda y soporte"
            onPress={() => navigation.navigate('Help')}
            last
          />
        </View>

        <AppButton
          label="Cerrar sesión"
          variant="ghost"
          onPress={signOut}
          style={styles.logout}
        />
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
    fontSize: 18,
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
  dataCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    marginTop: 14,
    marginBottom: spacing.xl,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  dataValue: {
    fontSize: 13.5,
    color: colors.ink,
  },
  menu: {
    marginBottom: spacing.xl,
  },
  logout: {
    marginTop: spacing.sm,
  },
});
