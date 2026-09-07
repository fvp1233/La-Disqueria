import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import TypeTabs from './components/TypeTabs';
import ProductCard from '../../components/ProductCard';
import TopBarIcons from '../../components/TopBarIcons';
import StateView from '../../components/StateView';
import AppButton from '../../components/AppButton';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../api/catalog';
import { uiTypeToApi } from '../../utils/format';
import { colors, fonts, radii, spacing } from '../../theme';

const pageSize = 10;

// Catálogo separado por tipo de producto con carga por páginas.
export default function CatalogScreen({ navigation, route }) {
  const { count } = useCart();
  const [activeType, setActiveType] = useState(route.params?.type || 'Vinilos');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (route.params?.type) setActiveType(route.params.type);
  }, [route.params?.type]);

  const load = useCallback(
    async (type, nextPage) => {
      const first = nextPage === 1;
      first ? setLoading(true) : setLoadingMore(true);
      setError('');
      try {
        const result = await getProducts({
          type: uiTypeToApi(type),
          page: nextPage,
          limit: pageSize,
        });
        setProducts((current) =>
          first ? result.products : [...current, ...result.products]
        );
        setTotal(result.total);
        setTotalPages(result.totalPages);
        setPage(nextPage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    load(activeType, 1);
  }, [activeType, load]);

  const canLoadMore = page < totalPages;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Catálogo</Text>
            <Text style={styles.count}>
              {total} {total === 1 ? 'producto' : 'productos'} en {activeType}
            </Text>
          </View>
          <TopBarIcons
            cartCount={count}
            onCartPress={() => navigation.navigate('Cart')}
            onBellPress={() => navigation.navigate('Help')}
          />
        </View>

        <Pressable style={styles.search}>
          <Feather name="search" size={17} color={colors.muted} />
          <Text style={styles.searchText}>Buscar en el catálogo</Text>
        </Pressable>

        <TypeTabs value={activeType} onChange={setActiveType} />

        {loading || error || products.length === 0 ? (
          <StateView
            loading={loading}
            error={error}
            empty={!loading && !error && products.length === 0}
            emptyText={`No hay ${activeType.toLowerCase()} disponibles todavía`}
            onRetry={() => load(activeType, 1)}
          />
        ) : (
          <>
            <View style={styles.grid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                />
              ))}
            </View>

            {canLoadMore ? (
              <AppButton
                label="Cargar más"
                variant="ghost"
                loading={loadingMore}
                onPress={() => load(activeType, page + 1)}
                style={styles.more}
              />
            ) : null}
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
  more: {
    marginTop: spacing.xl,
  },
});
