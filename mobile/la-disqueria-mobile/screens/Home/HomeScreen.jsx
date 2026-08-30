import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import HomeHeader from './components/HomeHeader';
import HeroCard from './components/HeroCard';
import SectionHeader from './components/SectionHeader';
import CategoryChips from './components/CategoryChips';
import BestSellerRow from './components/BestSellerRow';
import ProductCard from '../../components/ProductCard';
import { products, sampleCartItems } from '../../data/catalog';
import { colors, radii, spacing } from '../../theme';

const cartCount = sampleCartItems.reduce((total, item) => total + item.quantity, 0);
const newReleases = products.slice(0, 4);
const bestSellers = [products[4], products[2], products[7]];

// Pantalla de inicio con novedades, categorías y productos destacados.
export default function HomeScreen({ navigation }) {
  const openProduct = (productId) => navigation.navigate('ProductDetail', { productId });
  const openCatalog = (type) => navigation.navigate('Catalog', { type });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          cartCount={cartCount}
          onCartPress={() => navigation.navigate('Cart')}
          onBellPress={() => {}}
        />

        <Pressable style={styles.search} onPress={() => navigation.navigate('Catalog')}>
          <Feather name="search" size={17} color={colors.muted} />
          <Text style={styles.searchText}>Buscar vinilos, artistas, géneros</Text>
        </Pressable>

        <HeroCard onPress={() => navigation.navigate('Catalog')} />

        <CategoryChips onSelect={openCatalog} />

        <SectionHeader title="Nuevos lanzamientos" onAction={() => navigation.navigate('Catalog')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rail}
        >
          {newReleases.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => openProduct(product.id)}
            />
          ))}
        </ScrollView>

        <SectionHeader title="Más vendidos" onAction={() => navigation.navigate('Catalog')} />
        {bestSellers.map((product) => (
          <BestSellerRow
            key={product.id}
            product={product}
            onPress={() => openProduct(product.id)}
          />
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
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
  rail: {
    gap: 16,
    paddingRight: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
