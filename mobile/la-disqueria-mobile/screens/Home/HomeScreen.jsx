import { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import HomeHeader from './components/HomeHeader';
import HeroCard from './components/HeroCard';
import SectionHeader from './components/SectionHeader';
import CategoryChips from './components/CategoryChips';
import BestSellerRow from './components/BestSellerRow';
import ProductCard from '../../components/ProductCard';
import StateView from '../../components/StateView';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getProducts, getProductById, getBestSellers } from '../../api/catalog';
import { colors, radii, spacing } from '../../theme';

// Pantalla de inicio con novedades, categorías y productos destacados.
export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { count } = useCart();

  const [newReleases, setNewReleases] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const { products } = await getProducts({ limit: 6, sort: 'az' });
      setNewReleases(products);

      const ranking = await getBestSellers(6).catch(() => []);
      if (ranking.length > 0) {
        const resolved = await Promise.all(
          ranking.map((entry) => getProductById(entry.productId).catch(() => null))
        );
        setBestSellers(resolved.filter(Boolean));
      } else {
        const fallback = await getProducts({ limit: 4, sort: 'price-high' });
        setBestSellers(fallback.products);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openProduct = (id) => navigation.navigate('ProductDetail', { productId: id });
  const openCatalog = (type) => navigation.navigate('Catalog', { type });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.primary}
          />
        }
      >
        <HomeHeader
          name={user?.name}
          cartCount={count}
          onCartPress={() => navigation.navigate('Cart')}
          onBellPress={() => navigation.navigate('Help')}
        />

        <Pressable style={styles.search} onPress={() => navigation.navigate('Catalog')}>
          <Feather name="search" size={17} color={colors.muted} />
          <Text style={styles.searchText}>Buscar vinilos, artistas, géneros</Text>
        </Pressable>

        <HeroCard onPress={() => navigation.navigate('Catalog')} />

        <CategoryChips onSelect={openCatalog} />

        {loading || error ? (
          <StateView loading={loading} error={error} onRetry={load} />
        ) : (
          <>
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
          </>
        )}
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
