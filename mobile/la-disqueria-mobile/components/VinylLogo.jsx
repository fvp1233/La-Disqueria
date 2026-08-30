import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// Representa el disco de vinilo del logotipo con su etiqueta central salmón.
export default function VinylLogo({ size = 76, showLabel = true }) {
  const labelSize = size * 0.4;

  return (
    <View
      style={[
        styles.disc,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        style={[
          styles.groove,
          { width: size * 0.72, height: size * 0.72, borderRadius: size * 0.36 },
        ]}
      />
      {showLabel ? (
        <View
          style={[
            styles.label,
            { width: labelSize, height: labelSize, borderRadius: labelSize / 2 },
          ]}
        >
          <Text style={styles.labelText}>LA</Text>
          <Text style={styles.labelText}>DIS</Text>
        </View>
      ) : (
        <View style={[styles.hole, { width: size * 0.12, height: size * 0.12, borderRadius: size * 0.06 }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groove: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  label: {
    backgroundColor: colors.salmon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    color: colors.white,
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 8,
    lineHeight: 9,
    letterSpacing: 0.5,
  },
  hole: {
    backgroundColor: colors.bg,
  },
});
