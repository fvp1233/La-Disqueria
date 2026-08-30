import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Dibuja las líneas topográficas de las esquinas usando anillos concéntricos.
// Reproduce el motivo de las pantallas de acceso de la tienda pública.
export default function TopoLines({ placement = 'topLeft', tint = colors.primary }) {
  const rings = [0, 1, 2, 3, 4];
  const isTop = placement === 'topLeft';

  return (
    <View
      pointerEvents="none"
      style={[
        styles.wrap,
        isTop ? styles.topLeft : styles.bottomRight,
      ]}
    >
      {rings.map((index) => {
        const size = 120 + index * 58;
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 1.4,
              borderColor: tint,
              opacity: 0.42 - index * 0.07,
              top: isTop ? -size / 2 : undefined,
              left: isTop ? -size / 2 : undefined,
              bottom: isTop ? undefined : -size / 2,
              right: isTop ? undefined : -size / 2,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: 260,
    height: 260,
    overflow: 'hidden',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
});
