import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BackBar from '../../components/BackBar';
import { colors, fonts, radii, spacing } from '../../theme';

const contactRows = [
  { icon: 'mail', label: 'Correo', value: 'ayuda@ladisqueria.sv' },
  { icon: 'phone', label: 'Teléfono', value: '2222-0000' },
  { icon: 'map-pin', label: 'Tienda', value: 'San Salvador, El Salvador' },
  { icon: 'clock', label: 'Horario', value: 'Lunes a sábado, 9:00 a 18:00' },
];

const faqs = [
  {
    question: '¿Cómo sigo mi pedido?',
    answer: 'Entra a Perfil y luego a Mis pedidos para ver el estado de cada compra.',
  },
  {
    question: '¿Puedo cambiar mi contraseña?',
    answer: 'Sí. Desde la pantalla de inicio de sesión usa ¿Olvidaste tu contraseña?.',
  },
  {
    question: '¿Cuánto cuesta el envío?',
    answer: 'El envío es gratis dentro del país para las compras registradas en la app.',
  },
];

// Pantalla de ayuda con datos de contacto y preguntas frecuentes.
export default function HelpScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackBar title="Ayuda y soporte" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Contacto</Text>
        <View style={styles.card}>
          {contactRows.map((row, index) => (
            <View
              key={row.label}
              style={[styles.row, index === contactRows.length - 1 && styles.rowLast]}
            >
              <View style={styles.iconWrap}>
                <Feather name={row.icon} size={15} color={colors.inkSoft} />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>Preguntas frecuentes</Text>
        {faqs.map((item) => (
          <View key={item.question} style={styles.faq}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  heading: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.ink,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    color: colors.ink,
  },
  faq: {
    marginBottom: spacing.md,
  },
  question: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  answer: {
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 19,
  },
});
