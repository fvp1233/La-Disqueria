import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii } from '../theme';

// Etiqueta compacta con un icono opcional a la izquierda.
export default function Pill({ label, tone = 'neutral', icon }) {
  return (
    <View style={[styles.pill, toneStyles[tone]]}>
      {icon ? <Feather name={icon} size={11} color={toneColors[tone]} /> : null}
      <Text style={[styles.text, { color: toneColors[tone] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});

const toneStyles = StyleSheet.create({
  neutral: {
    backgroundColor: colors.field,
  },
  success: {
    backgroundColor: 'rgba(63,155,91,0.14)',
  },
});

const toneColors = {
  neutral: colors.inkSoft,
  success: colors.ok,
};
