import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { searchProducts, Producto } from '../../src/services/openFoodFacts';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../src/components/ProductCard';
import BarcodeScanner from '../../src/components/BarcodeScanner';

export default function SearchScreen() {
  const { category, tag, marca } = useLocalSearchParams<{ category?: string, tag?: string, marca?: string }>();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState(false);

  const prevQueryRef = useRef(searchQuery);
  const prevCategoryRef = useRef(category);
  const prevTagRef = useRef(tag);
  const prevMarcaRef = useRef(marca);

  const clearFilters = () => {
    setSearchQuery('');
    router.setParams({ category: '', tag: '', marca: '' });
  };

  useEffect(() => {
    let active = true;

    const queryChanged =
      searchQuery !== prevQueryRef.current ||
      category !== prevCategoryRef.current ||
      tag !== prevTagRef.current ||
      marca !== prevMarcaRef.current;

    const currentQuery = searchQuery;
    const currentFilters = {
      category: category || undefined,
      tag: tag || undefined,
      brand: marca || undefined
    };

    const fetchApiProducts = async (pageToFetch: number) => {
      if (pageToFetch === 1) {
        setIsLoading(true);
      } else {
        setIsMoreLoading(true);
      }
      setError(null);
      try {
        const results = await searchProducts(currentQuery, currentFilters, pageToFetch);
        if (active) {
          if (results.length < 24) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          if (pageToFetch === 1) {
            setProducts(results);
          } else {
            setProducts(prev => {
              // Evitar duplicados por ID
              const existingIds = new Set(prev.map(p => p.id));
              const newResults = results.filter(p => !existingIds.has(p.id));
              return [...prev, ...newResults];
            });
          }
        }
      } catch (err) {
        if (active) {
          setError('Error al conectar con Open Food Facts. Revisa tu conexión.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
          setIsMoreLoading(false);
        }
      }
    };

    // Actualizar referencias
    prevQueryRef.current = searchQuery;
    prevCategoryRef.current = category;
    prevTagRef.current = tag;
    prevMarcaRef.current = marca;

    let timerId: NodeJS.Timeout;

    if (queryChanged) {
      setProducts([]);
      setHasMore(true);
      setPage(1);

      if (page === 1) {
        timerId = setTimeout(() => {
          fetchApiProducts(1);
        }, 400);
      }
    } else {
      if (page === 1) {
        timerId = setTimeout(() => {
          fetchApiProducts(1);
        }, 400);
      } else {
        fetchApiProducts(page);
      }
    }

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [searchQuery, category, tag, marca, page]);

  const loadMore = () => {
    if (!isLoading && !isMoreLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleScanSuccess = (code: string) => {
    setIsScanning(false);
    router.push(`/producto?id=${code}`);
  };

  const pageTitle = marca
    ? `Brand: ${marca.charAt(0).toUpperCase() + marca.slice(1)}`
    : tag
      ? `Tag: ${tag.charAt(0).toUpperCase() + tag.slice(1)}`
      : category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : 'Products';

  if (isScanning) {
    return (
      <BarcodeScanner
        onScan={handleScanSuccess}
        onClose={() => setIsScanning(false)}
      />
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{pageTitle}</Text>
        {(category || tag || marca || searchQuery.length > 0) ? (
          <Pressable style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>X</Text>
          </Pressable>
        ) : null}
      </View>
      
      {!isLoading && !error && (
        <Text style={styles.itemCount}>{products.length} ITEMS FOUND</Text>
      )}

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(true)}>
          <Ionicons name="barcode-outline" size={24} color="#28884B" />
        </TouchableOpacity>
      </View>

      {isLoading && products.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#28884B" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noResultsText}>No se encontraron productos.</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                onPress={() => router.push(`/producto?id=${item.id}`)}
              />
            )}
            contentContainerStyle={[styles.listContainer]}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isMoreLoading ? (
                <ActivityIndicator size="small" color="#28884B" style={styles.listLoader} />
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  clearButton: {
    backgroundColor: '#ff4d4f',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
  },
  itemCount: {
    fontSize: 12,
    color: '#687076',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#11181C',
  },
  listContainer: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#687076',
  },
  errorText: {
    fontSize: 14,
    color: '#ff4d4f',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 14,
    color: '#687076',
  },
  listLoader: {
    marginVertical: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  scanButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
});
