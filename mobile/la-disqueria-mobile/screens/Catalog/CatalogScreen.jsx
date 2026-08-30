import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import TypeTabs from './components/TypeTabs';
import ProductCard from '../../components/ProductCard';
import TopBarIcons from '../../components/TopBarIcons';
import { getProductsByType, sampleCartItems } from '../../data/catalog';
import { colors, fonts, radii, spacing } from '../../theme';

const cartCount = sampleCartItems.reduce((total, item) => total + item.quantity, 0);

// Catálogo separado por tipo de producto con una cuadrícula de resultados.
export default function CatalogScreen({ navigation, route }) {
  const [activeType, setActiveType] = useState(route.params?.type || 'Vinilos');

  useEffect(() => {
    if (route.params?.type) {
      setActiveType(route.params.type);
    }
  }, [route.params?.type]);

  const results = getProductsByType(activeType);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Catálogo</Text>
            <Text style={styles.count}>
              {results.length} productos en {activeType}
            </Text>
          </View>
          <TopBarIcons
            cartCount={cartCount}
            onCartPress={() => navigation.navigate('Cart')}
            onBellPress={() => {}}
          />
        </View>

        <Pressable style={styles.search}>
          <Feather name="search" size={17} color={colors.muted} />
          <Text style={styles.searchText}>Buscar en el catálogo</Text>
        </Pressable>

        <TypeTabs value={activeType} onChange={setActiveType} />

        <View style={styles.grid}>
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              style={styles.gridItem}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
            />
          ))}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 26,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  count: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.muted,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.field,
    paddingHorizontal: 14,
    marginBottom: spacing.xl,
  },
  searchText: {
    color: colors.muted,
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  gridItem: {
    width: '47%',
  },
});
