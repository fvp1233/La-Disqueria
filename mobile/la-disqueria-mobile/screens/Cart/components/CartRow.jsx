import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import QuantityStepper from '../../../components/QuantityStepper';
import { maxQuantityFor } from '../../../context/CartContext';
import { colors, radii, shadow } from '../../../theme';
import { formatPrice } from '../../../utils/format';

// Fila de un producto dentro del carrito con control de cantidad y eliminación.
// Si el producto se agotó o su stock bajó, lo indica debajo del precio.
export default function CartRow({ item, issue, onQuantityChange, onRemove }) {
  const max = Math.max(1, maxQuantityFor(item.stock));

  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.info}>
        {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        {issue ? (
          <View style={styles.issue}>
            <Feather name="alert-circle" size={12} color={colors.primaryPress} />
            <Text style={styles.issueText}>{issue}</Text>
          </View>
        ) : null}
        <View style={styles.stepper}>
          <QuantityStepper
            value={item.quantity}
            onChange={onQuantityChange}
            size="sm"
            max={max}
          />
        </View>
      </View>
      <Pressable onPress={onRemove} hitSlop={8} style={styles.trash}>
        <Feather name="trash-2" size={17} color={colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 13,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.field,
    ...shadow.soft,
  },
  info: {
    flex: 1,
  },
  subtitle: {
    fontSize: 11.5,
    color: colors.muted,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.ink,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 2,
  },
  issue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  issueText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primaryPress,
  },
  stepper: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  trash: {
    padding: 4,
  },
});
